import { NextResponse } from 'next/server';
import { getAiInfrastructureStatus } from '@/lib/ai/health';

export const dynamic = 'force-dynamic';

export async function GET() {
  const status = await getAiInfrastructureStatus();
  return NextResponse.json(status);
}
