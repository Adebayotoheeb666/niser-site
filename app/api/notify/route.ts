import { NextRequest, NextResponse } from 'next/server';
import { sendPushNotificationToTopic } from '@/lib/firebase-admin';
import { requireInternalAccess } from '@/lib/ai/auth';
import { captureException } from '@/lib/sentry';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const access = await requireInternalAccess(req);
    if (!access.ok) {
      return NextResponse.json({ error: access.error }, { status: access.status ?? 401 });
    }

    const body = (await req.json()) as {
      topic?: unknown;
      title?: unknown;
      body?: unknown;
      data?: unknown;
      imageUrl?: unknown;
    };
    const topic = typeof body.topic === 'string' ? body.topic.trim() : '';
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const messageBody = typeof body.body === 'string' ? body.body.trim() : '';
    const data = body.data && typeof body.data === 'object'
      ? (body.data as Record<string, string>)
      : undefined;
    const imageUrl = typeof body.imageUrl === 'string' ? body.imageUrl.trim() : undefined;

    if (!topic || !title || !messageBody) {
      return NextResponse.json({ error: 'topic, title and body are required' }, { status: 400 });
    }

    await sendPushNotificationToTopic(topic, {
      title,
      body: messageBody,
      data,
      imageUrl,
    });

    return NextResponse.json({ status: 'sent' });
  } catch (error) {
    console.error('[Notify API Error]:', error);
    captureException(error, { route: '/api/notify' });
    return NextResponse.json({ error: 'Unable to send notification' }, { status: 500 });
  }
}