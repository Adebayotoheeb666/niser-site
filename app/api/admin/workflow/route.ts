import { NextRequest, NextResponse } from 'next/server';
import { requireInternalAccess } from '@/lib/ai/auth';
import { getFirebaseFirestore } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

/**
 * Durable audit trail for AI-assisted content transitions (Implementation
 * Plan v1.1 §9 governance: model/version, timestamp, approving researcher;
 * retained 5 years). Best-effort — workflow continues if Firestore is down.
 */
async function writeAuditLog(entry: {
  action: string;
  contentId?: string;
  contentType?: string;
  targetStatus?: string;
  notes?: string;
}): Promise<void> {
  try {
    const db = getFirebaseFirestore();
    await db.collection('ai_audit_log').add({
      ...entry,
      actor: 'authenticated-admin',
      recordedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Editorial Workflow] Audit log write failed (non-fatal):', error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireInternalAccess(req);
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status ?? 401 });
    }

    const body = (await req.json()) as {
      contentId?: string;
      contentType?: 'publication' | 'insight';
      targetStatus?: 'draft' | 'review' | 'published';
      notes?: string;
    };

    if (!body.contentId || !body.contentType || !body.targetStatus) {
      return NextResponse.json({
        error: 'Missing required parameters: contentId, contentType, and targetStatus are required.',
      }, { status: 400 });
    }

    // In a real CMS, this would update the database record.
    // In our headless client, we log the state transition and record an
    // audit entry, then return success.
    console.log(`[Editorial Workflow] Transitioning ${body.contentType} (${body.contentId}) to status: ${body.targetStatus}`);

    await writeAuditLog({
      action: 'status_transition',
      contentId: body.contentId,
      contentType: body.contentType,
      targetStatus: body.targetStatus,
      notes: body.notes,
    });

    return NextResponse.json({
      success: true,
      message: `Content ${body.contentId} successfully transitioned to ${body.targetStatus}`,
      transition: {
        id: body.contentId,
        type: body.contentType,
        status: body.targetStatus,
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error('[Editorial Workflow Error]:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
