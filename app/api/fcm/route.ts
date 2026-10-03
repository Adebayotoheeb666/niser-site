import { NextRequest, NextResponse } from 'next/server';
import { sendPushNotificationToToken, sendPushNotificationToTopic } from '@/lib/firebase-admin';
import { captureException } from '@/lib/sentry';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  let body: {
    token?: string;
    topic?: string;
    title?: string;
    body?: string;
    data?: Record<string, string>;
    imageUrl?: string;
  } = {};

  try {
    body = (await request.json()) as typeof body;
    const { token, topic, title, body: messageBody, data, imageUrl } = body;

    if (!title || !messageBody) {
      return NextResponse.json({ error: 'title and body are required' }, { status: 400 });
    }

    if (!token && !topic) {
      return NextResponse.json({ error: 'token or topic is required' }, { status: 400 });
    }

    if (body.token) {
      await sendPushNotificationToToken({
        token: body.token,
        title,
        body: messageBody,
        data,
        imageUrl,
      });
    } else {
      await sendPushNotificationToTopic(body.topic!, {
        title,
        body: messageBody,
        data,
        imageUrl,
      });
    }

    return NextResponse.json({ status: 'sent' });
  } catch (error) {
    console.error('[FCM API] send error', error);
    captureException(error, {
      route: '/api/fcm',
      token: typeof body.token === 'string' ? body.token.slice(0, 50) : undefined,
      topic: body.topic,
    });
    return NextResponse.json({ error: 'Unable to send notification' }, { status: 500 });
  }
}
