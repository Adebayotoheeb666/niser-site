import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseFirestore } from '@/lib/firebase-admin';
import { captureException } from '@/lib/sentry';

export const dynamic = 'force-dynamic';

const ALLOWED_TOPICS = ['niser_publications', 'niser_events', 'niser_insights', 'niser_rapid_response'];

export async function POST(req: NextRequest) {
  let body: { token?: unknown; platform?: unknown; topics?: unknown } = {};

  try {
    body = (await req.json()) as typeof body;
    const token = typeof body.token === 'string' ? body.token.trim() : '';
    const platform = typeof body.platform === 'string' ? body.platform.trim().toLowerCase() : 'unknown';
    const topics = Array.isArray(body.topics)
      ? body.topics
          .filter((t): t is string => typeof t === 'string')
          .map((t) => t.trim())
          .filter((t) => ALLOWED_TOPICS.includes(t))
      : [];

    if (!token || token.length < 30 || token.length > 512) {
      return NextResponse.json({ error: 'A valid device token is required' }, { status: 400 });
    }
    if (platform !== 'android' && platform !== 'ios') {
      return NextResponse.json({ error: 'platform must be android or ios' }, { status: 400 });
    }

    const db = getFirebaseFirestore();
    const now = new Date().toISOString();
    await db.collection('device_tokens').doc(token).set({
      token,
      platform,
      topics,
      createdAt: now,
      lastSeen: now,
      updatedAt: now,
    });

    return NextResponse.json({ status: 'registered', token, topics });
  } catch (error) {
    console.error('[FCM Register API Error]:', error);
    captureException(error, {
      route: '/api/fcm-register',
      platform: body.platform,
    });
    return NextResponse.json({ error: 'Unable to register device token' }, { status: 500 });
  }
}