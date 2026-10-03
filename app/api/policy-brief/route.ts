import { NextRequest, NextResponse } from 'next/server';
import { getPublications } from '@/lib/cms/client';
import { createAiCompletion, getAiProvider } from '@/lib/ai/llm';
import { requireAdminIfEnabled } from '@/lib/ai/auth';
import { getFirebaseFirestore } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

interface PolicyBriefSection {
  heading: string;
  content: string;
  citations: string[];
}

interface PolicyBriefSource {
  id: string;
  title: string;
  publicationType: string;
  publishedYear?: number;
  abstract: string;
  url: string;
}

interface PolicyBriefResponse {
  briefText: string;
  sections: PolicyBriefSection[];
  coverageWarning?: string;
  sources: Array<{ title: string; url: string; year?: number }>;
}

function parseJsonResponse(value: string): PolicyBriefResponse | null {
  try {
    return JSON.parse(value) as PolicyBriefResponse;
  } catch {
    const jsonMatch = value.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    try {
      return JSON.parse(jsonMatch[0]) as PolicyBriefResponse;
    } catch {
      return null;
    }
  }
}

function buildCoverageWarning(sources: PolicyBriefSource[]): string | undefined {
  const totalText = sources
    .map((source) => `${source.title} ${source.abstract}`)
    .join(' ')
    .trim();

  if (sources.length < 2) {
    return 'Selected sources are limited. The brief may be supported by a narrow evidence base, so review claims carefully.';
  }

  if (totalText.length < 1600) {
    return 'The selected materials contain limited detail. The brief may need additional sources to strengthen evidence coverage.';
  }

  return undefined;
}

function formatAudience(audience?: string) {
  if (audience === 'media-press') return 'media and communications stakeholders';
  if (audience === 'private-sector') return 'private sector and industry leaders';
  if (audience === 'development-partners') return 'development partners and donor agencies';
  return 'federal ministry policy makers and institutional stakeholders';
}

function buildPrompt(audienceDescription: string, focusAngle: string, sources: PolicyBriefSource[]) {
  return `You are an expert policy analyst writing for NISER. Create a structured policy brief from the selected research sources. Target audience: ${audienceDescription}. Focus angle: ${focusAngle}.

Use only the information provided in the listed sources. Do not invent findings, claims, or citations that are not supported by these sources.

For each claim you make, cite one or more sources inline using [1], [2], etc. The numbers should correspond to the source list below.

If the evidence is thin, include an explicit coverage warning in the response.

Sources:
${sources
    .map((publication, index) =>
      `${index + 1}. ${publication.title}
Type: ${publication.publicationType}
Year: ${publication.publishedYear ?? 'unknown'}
Abstract: ${publication.abstract || 'No abstract available.'}
URL: ${publication.url}`,
    )
    .join('\n\n')}

Return the response in valid JSON only with the following structure:
{
  "briefText": "...",
  "sections": [
    {"heading":"Executive Summary","content":"...","citations":["[1]", "[2]"]},
    {"heading":"Key Findings from the selected research","content":"...","citations":["[1]"]},
    {"heading":"Policy implications and institutional considerations","content":"...","citations":["[2]"]},
    {"heading":"Recommended actions for the target audience","content":"...","citations":["[1]", "[3]"]},
    {"heading":"Conclusion and next steps","content":"...","citations":["[1]"]}
  ],
  "coverageWarning": "...",
  "sources": [{"title":"...","url":"...","year":2024}]
}

Keep the JSON valid. Do not include any markdown or extra text outside the JSON object.`;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      selectedIds?: string[];
      audience?: string;
      focusAngle?: string;
      secret?: string;
    };
    const headerSecret = req.headers.get('x-webhook-secret') ?? '';
    const providedSecret = headerSecret || body.secret || '';

    const access = await requireAdminIfEnabled(req, 'AI_ADMIN_ONLY_POLICY_BRIEF', providedSecret);
    if (!access.ok) {
      return NextResponse.json({ error: access.error }, { status: access.status ?? 401 });
    }

    if (!body.selectedIds || body.selectedIds.length === 0) {
      return NextResponse.json({ error: 'selectedIds is required' }, { status: 400 });
    }

    const publications = await getPublications({ limit: 200 });
    const sources = publications
      .filter((p) => body.selectedIds?.includes(p.id))
      .map((publication): PolicyBriefSource => ({
        id: publication.id,
        title: publication.title,
        publicationType: publication.publicationType,
        publishedYear: publication.publishedYear,
        abstract: publication.abstract ?? 'No abstract available.',
        url: publication.slug
          ? `https://niser.gov.ng/publications/${publication.slug}`
          : 'https://niser.gov.ng/publications',
      }));

    if (sources.length === 0) {
      return NextResponse.json(
        {
          error: 'No selected publications matched the provided IDs.',
        },
        { status: 400 },
      );
    }

    const audienceDescription = formatAudience(body.audience);
    const focusAngle = body.focusAngle?.trim() || 'strengthening evidence-based policy through NISER research';
    const coverageWarning = buildCoverageWarning(sources);
    const prompt = buildPrompt(audienceDescription, focusAngle, sources);

    let resultText = '';
    try {
      resultText = await createAiCompletion({ prompt, maxTokens: 1200, temperature: 0.15 });
    } catch (error) {
      console.warn('[Policy Brief] AI completion unavailable or failed:', (error as Error).message);
    }

    const parsed = resultText ? parseJsonResponse(resultText) : null;
    const response: PolicyBriefResponse = parsed ?? {
      briefText: resultText || `Policy Brief Draft for ${audienceDescription}`,
      sections: [
        {
          heading: 'Executive Summary',
          content: resultText || `Create a concise executive summary from ${sources.length} selected sources.`,
          citations: [],
        },
        {
          heading: 'Key Findings from the selected research',
          content: resultText || 'Summarize the main findings from the selected research sources.',
          citations: [],
        },
        {
          heading: 'Policy implications and institutional considerations',
          content: resultText || 'Identify the policy implications for the targeted audience.',
          citations: [],
        },
        {
          heading: 'Recommended actions for the target audience',
          content: resultText || 'List recommended actions for the target audience.',
          citations: [],
        },
        {
          heading: 'Conclusion and next steps',
          content: resultText || 'Provide concluding remarks and next steps.',
          citations: [],
        },
      ],
      coverageWarning,
      sources: sources.map((source) => ({ title: source.title, url: source.url, year: source.publishedYear })),
    };

    // Durable audit trail (governance requirement): model, sources, timestamp.
    // Best-effort — brief delivery must not depend on audit availability.
    try {
      const db = getFirebaseFirestore();
      await db.collection('ai_audit_log').add({
        action: 'policy_brief_generated',
        model: getAiProvider(),
        sourceIds: body.selectedIds,
        sourceCount: sources.length,
        audience: audienceDescription,
        recordedAt: new Date().toISOString(),
      });
    } catch (auditError) {
      console.error('[Policy Brief] Audit log write failed (non-fatal):', auditError);
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('[Policy Brief API Error]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
