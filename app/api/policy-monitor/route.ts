import { NextRequest, NextResponse } from 'next/server';
import { monitorPolicyFeed } from '@/lib/ai/policy-monitor';
import { requireInternalAccess } from '@/lib/ai/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const access = await requireInternalAccess(req);
    if (!access.ok) return NextResponse.json({ error: access.error }, { status: access.status ?? 401 });

    const body = (await req.json().catch(() => ({}))) as { sendAlerts?: unknown };
    const result = await monitorPolicyFeed({ sendAlerts: body.sendAlerts !== false });

    return NextResponse.json(result);
  } catch (error) {
    console.error('[Policy Monitor API Error]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
