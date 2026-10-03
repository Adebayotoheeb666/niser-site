import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email-service';
import { getFirebaseFirestore } from '@/lib/firebase-admin';
import crypto from 'node:crypto';

export const dynamic = 'force-dynamic';

function makeToken() {
  return crypto.randomBytes(18).toString('base64url');
}

export async function POST(req: NextRequest) {
  try {
    const { email, name } = (await req.json()) as { email?: string; name?: string };

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'email is required' }, { status: 400 });
    }

    try {
      const db = getFirebaseFirestore();
      const token = makeToken();
      const now = new Date().toISOString();
      await db.collection('policy_subscriptions').add({ email: email.toLowerCase().trim(), name: name ?? null, token, createdAt: now, confirmed: true });

      const base = process.env.NEXT_PUBLIC_SITE_URL || process.env.BASE_URL || 'http://localhost:3000';
      const unsubscribeUrl = `${base.replace(/\/$/, '')}/api/subscribe/unsubscribe?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;

      await sendEmail({
        to: email,
        subject: 'NISER Subscription Confirmation',
        html: `<p>Thank you for subscribing to NISER updates${name ? `, ${name}` : ''}.</p><p>You will receive news and research alerts from the institute.</p><p>If you would like to unsubscribe, click <a href="${unsubscribeUrl}">here</a>.</p>`,
        text: `Thank you for subscribing to NISER updates${name ? `, ${name}` : ''}. To unsubscribe, visit: ${unsubscribeUrl}`,
      });

      return NextResponse.json({ message: 'Subscription confirmed. Check your email for confirmation.' });
    } catch (error) {
      console.error('[Subscribe API Error]:', error);
      return NextResponse.json({
        error: 'Unable to save subscription or send confirmation email. Check provider configuration.',
      }, { status: 502 });
    }
  } catch (error) {
    console.error('[Subscribe API Error]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    // Allow unsubscribe via token query params
    const token = req.nextUrl.searchParams.get('token') ?? '';
    const email = req.nextUrl.searchParams.get('email') ?? '';
    if (!token || !email) return NextResponse.json({ error: 'token and email are required' }, { status: 400 });

    try {
      const db = getFirebaseFirestore();
      const q = await db.collection('policy_subscriptions').where('email', '==', email.toLowerCase().trim()).where('token', '==', token).get();
      if (q.empty) return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
      const batch = db.batch();
      q.forEach((doc) => batch.delete(doc.ref));
      await batch.commit();
      return NextResponse.json({ message: 'Unsubscribed' });
    } catch (err) {
      console.error('[Subscribe API Error]:', err);
      return NextResponse.json({ error: 'Unable to unsubscribe' }, { status: 502 });
    }
  } catch (err) {
    console.error('[Subscribe API Error]:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
