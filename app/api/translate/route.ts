import { NextRequest, NextResponse } from 'next/server';
import { translateText } from '@/lib/ai/translate';
import { captureException } from '@/lib/sentry';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { text, targetLang } = (await req.json()) as {
      text?: string;
      targetLang?: string;
    };

    if (!text || !targetLang) {
      return NextResponse.json({ error: 'text and targetLang are required' }, { status: 400 });
    }

    try {
      const result = await translateText(text, targetLang);
      return NextResponse.json(result);
    } catch (error) {
      console.error('[Translate API Error]:', error);
      captureException(error, { route: '/api/translate', text: text?.slice(0, 200), targetLang });
      return NextResponse.json(
        { error: 'Translation service is unavailable or misconfigured' },
        { status: 502 },
      );
    }
  } catch (error) {
    console.error('[Translate API Error]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
