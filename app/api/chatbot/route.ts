import { NextRequest } from 'next/server';
import { prepareChatResponse, summarizeConversation, type ChatHistoryEntry } from '@/lib/ai/chat';
import { requirePublicChatAccess } from '@/lib/ai/auth';
import { streamAiCompletion } from '@/lib/ai/llm';
import { extractMemory } from '@/lib/ai/facts';
import {
  getMemoryStore,
} from '@/lib/ai/memory';
import {
  readChatIdentity,
  createChatIdentity,
  identityCookiePairs,
} from '@/lib/ai/identity';

export const dynamic = 'force-dynamic';

const MAX_MEMORY_MESSAGES = 16;
const MAX_VISIBLE_MESSAGES = 8;

export async function POST(req: NextRequest) {
  try {
    const access = await requirePublicChatAccess(req);
    if (!access.ok) {
      return new Response(JSON.stringify({ error: access.error }), {
        status: access.status ?? 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (req.headers.get('content-type')?.split(';')[0] !== 'application/json') {
      return Response.json({ error: 'Content-Type must be application/json' }, { status: 415 });
    }
    const body = (await req.json().catch(() => null)) as { message?: unknown; history?: unknown; fingerprint?: unknown } | null;
    const message = typeof body?.message === 'string' ? body.message.trim() : '';
    const history = Array.isArray(body?.history) ? body.history : [];
    const fingerprint = typeof body?.fingerprint === 'string' ? body.fingerprint.slice(0, 128) : '';

    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    if (message.length > 1_500) return Response.json({ error: 'Message must be 1,500 characters or fewer' }, { status: 400 });

    const safeHistory: ChatHistoryEntry[] = history.slice(-8).flatMap((entry) => {
      if (!entry || typeof entry !== 'object') return [];
      const candidate = entry as { role?: unknown; content?: unknown };
      if ((candidate.role !== 'user' && candidate.role !== 'assistant') || typeof candidate.content !== 'string') return [];
      return [{ role: candidate.role, content: candidate.content.slice(0, 1_000) }];
    });

    const memory = await getMemoryStore();
    let { sessionId, visitorId } = readChatIdentity(req);
    if (!sessionId || !visitorId) {
      const fresh = createChatIdentity();
      sessionId = sessionId ?? fresh.sessionId;
      visitorId = visitorId ?? fresh.visitorId;
    }

    // Recognise a returning browser from its fingerprint when the visitor
    // cookie is missing (e.g. cleared), then re-link to the current identity.
    if (fingerprint) {
      try {
        if (!readChatIdentity(req).visitorId) {
          const knownVisitor = await memory.getVisitorByFingerprint(fingerprint);
          if (knownVisitor) visitorId = knownVisitor;
        }
        await memory.linkFingerprint(fingerprint, visitorId);
      } catch (error) {
        console.warn('[chatbot] fingerprint memory failed:', error instanceof Error ? error.message : String(error));
      }
    }

    // Short-term memory: load + persist the conversation server-side.
    let conversation = await memory.getMessages(sessionId);
    if (conversation.length === 0 && safeHistory.length > 0) {
      await memory.replaceMessages(sessionId, safeHistory);
      conversation = safeHistory;
    }
    conversation = [...conversation, { role: 'user', content: message }];
    await memory.appendMessages(sessionId, [{ role: 'user', content: message }]);

    // Rolling summary keeps long conversations bounded.
    let summary = await memory.getSummary(sessionId);
    if (conversation.length > MAX_MEMORY_MESSAGES) {
      summary = await summarizeConversation(conversation, summary);
      conversation = conversation.slice(-6);
      await memory.setSummary(sessionId, summary ?? '');
      await memory.replaceMessages(sessionId, conversation);
    }

    const profile = await memory.getProfile(visitorId);
    const preparation = await prepareChatResponse(message, {
      history: conversation.slice(-MAX_VISIBLE_MESSAGES),
      summary: summary ?? undefined,
      profile,
    });

    const encoder = new TextEncoder();
    const event = (data: unknown) => encoder.encode(`data: ${JSON.stringify(data)}\n\n`);

    if (!preparation.prompt) {
      await memory.appendMessages(sessionId, [{ role: 'assistant', content: preparation.fallback ?? '' }]);
      const body = new ReadableStream({
        start(controller) {
          controller.enqueue(event({ event: 'mode', mode: preparation.mode }));
          controller.enqueue(event({ token: preparation.fallback }));
          controller.enqueue(event({ event: 'done' }));
          controller.close();
        },
      });
      return new Response(body, {
        headers: [
          ['Content-Type', 'text/event-stream'],
          ['Cache-Control', 'no-store'],
          ...identityCookiePairs(sessionId, visitorId),
        ],
      });
    }

    const stream = new ReadableStream({
      async start(controller) {
        let fullText = '';
        try {
          for await (const token of streamAiCompletion({ prompt: preparation.prompt!, maxTokens: 800, temperature: 0.2 })) {
            fullText += token;
            controller.enqueue(event({ token }));
          }
          controller.enqueue(event({ event: 'mode', mode: preparation.mode }));
          controller.enqueue(event({ event: 'sources', sources: preparation.sources, mode: preparation.mode }));
          controller.enqueue(event({ event: 'done' }));

          try {
            await memory.appendMessages(sessionId, [{ role: 'assistant', content: fullText || '' }]);
            const extracted = extractMemory(message);
            if (extracted.facts.length > 0) {
              for (const fact of extracted.facts) {
                await memory.saveFact(visitorId, fact.key, fact.value);
              }
            }
            if (extracted.interests.length > 0) {
              await memory.addInterests(visitorId, extracted.interests);
            }
          } catch (persistError) {
            console.warn('[chatbot] memory persist failed:', persistError instanceof Error ? persistError.message : String(persistError));
          }
        } catch (error) {
          console.error('[Chatbot API stream error]:', error);
          controller.enqueue(event({ event: 'error', error: 'The AI service is temporarily unavailable. Please try again.' }));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: [
        ['Content-Type', 'text/event-stream'],
        ['Cache-Control', 'no-cache'],
        ['Connection', 'keep-alive'],
        ...identityCookiePairs(sessionId, visitorId),
      ],
    });
  } catch (error) {
    console.error('[Chatbot API Error]:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
