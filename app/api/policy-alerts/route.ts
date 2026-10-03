import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseFirestore } from '@/lib/firebase-admin';
import { requireInternalAccess } from '@/lib/ai/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const access = await requireInternalAccess(req);
    if (!access.ok) return NextResponse.json({ error: access.error }, { status: access.status ?? 401 });

    const db = getFirebaseFirestore();
    const q = await db.collection('policy_alerts').orderBy('createdAt', 'desc').limit(100).get();
    const items = q.docs.map((d) => ({ id: d.id, ...d.data() }));
    return NextResponse.json({ items });
  } catch (err) {
    console.error('[Policy Alerts API Error]:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
