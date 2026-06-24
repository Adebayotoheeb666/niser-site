import { NextRequest } from 'next/server';
import { getPublications, getResearchers, getInsights } from '@/lib/cms/client';

export const dynamic = 'force-dynamic';


export async function POST(req: NextRequest) {
  try {
    const { message } = (await req.json()) as {
      message: string;
    };

    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const queryLower = message.toLowerCase();

    // 1. Fetch CMS data to extract context matching keywords
    const [publications, researchers, insights] = await Promise.all([
      getPublications({ limit: 100 }),
      getResearchers({ active: true }),
      getInsights({ limit: 100 }),
    ]);

    const contextChunks: { title: string; excerpt: string; url: string; year: string }[] = [];

    // Search Publications
    publications.forEach((p) => {
      if (
        queryLower.includes('publication') ||
        queryLower.includes('paper') ||
        queryLower.includes('research') ||
        p.title.toLowerCase().split(' ').some((word) => word.length > 4 && queryLower.includes(word)) ||
        p.keywords?.some((k) => queryLower.includes(k.toLowerCase()))
      ) {
        contextChunks.push({
          title: p.title,
          excerpt: p.abstract,
          url: `/publications/${p.slug}`,
          year: p.publishedYear.toString(),
        });
      }
    });

    // Search Researchers
    researchers.forEach((r) => {
      const nameParts = r.fullName.toLowerCase().split(' ');
      if (nameParts.some((part) => part.length > 3 && queryLower.includes(part))) {
        contextChunks.push({
          title: `${r.titlePrefix ? r.titlePrefix + ' ' : ''}${r.fullName}`,
          excerpt: r.biography || `${r.fullName} is a researcher in the ${r.division} division.`,
          url: `/people/${r.slug}`,
          year: 'Profile',
        });
      }
    });

    // Search Insights
    insights.forEach((i) => {
      if (
        queryLower.includes('insight') ||
        queryLower.includes('brief') ||
        i.title.toLowerCase().split(' ').some((word) => word.length > 4 && queryLower.includes(word))
      ) {
        contextChunks.push({
          title: i.title,
          excerpt: i.socialSummary || i.bodyPlaintext || '',
          url: `/insights/${i.slug}`,
          year: new Date(i.publishedDate).getFullYear().toString(),
        });
      }
    });

    // Sort context chunks by keyword frequency to simulate search rank
    const rankedChunks = contextChunks
      .map((chunk) => {
        let score = 0;
        const words = queryLower.split(' ');
        words.forEach((word) => {
          if (word.length > 3) {
            if (chunk.title.toLowerCase().includes(word)) score += 3;
            if (chunk.excerpt.toLowerCase().includes(word)) score += 1;
          }
        });
        return { chunk, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((item) => item.chunk);

    // Formulate prompt responses based on rules
    let responseText = '';
    const sources: { title: string; url: string; excerpt: string }[] = [];

    // System Rules check
    if (queryLower.includes('who are you') || queryLower.includes('identity') || queryLower.includes('your name')) {
      responseText =
        'I am the NISER Research Assistant, an AI tool designed for the National Institute of Social and Economic Research (NISER), Ibadan, Nigeria. My role is to help you search and find research papers, policy briefs, events, and expertise within the NISER digital platform.';
    } else if (rankedChunks.length > 0) {
      const titles = rankedChunks.map((c) => `"${c.title}"`).join(' and ');
      
      responseText = `Based on NISER's knowledge base, we have relevant research regarding your query. According to ${rankedChunks[0].title} (${rankedChunks[0].year}), the primary finding is that evidence-based interventions are critical to policy success. In addition, ${titles} provides analytical frameworks that address these challenges.\n\nYou can read the full studies using the links below.`;

      rankedChunks.forEach((c) => {
        sources.push({
          title: c.title,
          url: c.url,
          excerpt: c.excerpt.substring(0, 150) + '...',
        });
      });
    } else {
      // Rule 3 Fallback Response
      responseText =
        "I cannot find relevant information in NISER's publications for this question. Please search the Publications archive or contact NISER directly.";
    }

    // Set up Server-Sent Events (SSE) stream
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        // Stream text token by token
        const tokens = responseText.split(' ');
        for (let i = 0; i < tokens.length; i++) {
          const token = tokens[i] + (i === tokens.length - 1 ? '' : ' ');
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ token })}\n\n`));
          // Simulate latency
          await new Promise((resolve) => setTimeout(resolve, 40));
        }

        // Send sources list
        if (sources.length > 0) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ event: 'sources', sources })}\n\n`)
          );
        }

        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('[Chatbot API Error]:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
