import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseFirestore } from '@/lib/firebase-admin';
import { captureException } from '@/lib/sentry';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { token?: unknown };
    const token = typeof body.token === 'string' ? body.token.trim() : '';

    if (!token) {
      return NextResponse.json({ error: 'token is required' }, { status: 400 });
    }

    const db = getFirebaseFirestore();
    await db.collection('device_tokens').doc(token).delete();

    return NextResponse.json({ status: 'unregistered' });
  } catch (error) {
    console.error('[FCM Unregister API Error]:', error);
    captureException(error, { route: '/api/fcm-unregister' });
    return NextResponse.json({ error: 'Unable to unregister device token' }, { status: 500 });
  }
}