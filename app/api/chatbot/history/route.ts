import { NextRequest } from 'next/server';
import { requirePublicChatAccess } from '@/lib/ai/auth';
import { getMemoryStore } from '@/lib/ai/memory';
import { readChatIdentity } from '@/lib/ai/identity';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const access = await requirePublicChatAccess(req);
    if (!access.ok) {
      return new Response(JSON.stringify({ error: access.error }), {
        status: access.status ?? 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { sessionId } = readChatIdentity(req);
    if (!sessionId) {
      return Response.json({ messages: [] });
    }

    const memory = await getMemoryStore();
    const messages = await memory.getMessages(sessionId);
    return Response.json({ messages: messages.slice(-40) });
  } catch (error) {
    console.error('[Chatbot History Error]:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
