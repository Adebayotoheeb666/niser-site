import { timingSafeEqual } from 'node:crypto';
import { NextRequest } from 'next/server';

const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS ?? process.env.AI_RATE_LIMIT_WINDOW_MS ?? 60_000);
const RATE_LIMIT_MAX_REQUESTS = Number(process.env.RATE_LIMIT_MAX_REQUESTS ?? process.env.AI_RATE_LIMIT_MAX_REQUESTS ?? 20);
const PUBLIC_CHAT_RATE_LIMIT_MAX = Number(process.env.PUBLIC_CHAT_RATE_LIMIT_MAX ?? 10);

type RateLimitBucket = { count: number; resetAt: number };

declare global {
  // Persist buckets across development hot reloads.
  // eslint-disable-next-line no-var
  var __niserAiIpBucket: Map<string, RateLimitBucket> | undefined;
}

const ipBucket = globalThis.__niserAiIpBucket ?? (globalThis.__niserAiIpBucket = new Map());

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0].trim() || req.headers.get('x-real-ip') || 'unknown';
}

function secretsMatch(provided: string, expected: string): boolean {
  if (!provided || !expected) return false;
  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);
  return providedBuffer.length === expectedBuffer.length && timingSafeEqual(providedBuffer, expectedBuffer);
}

function enforceRateLimit(key: string, maxRequests: number): { ok: boolean; status?: number; error?: string } {
  const now = Date.now();
  if (ipBucket.size > 10_000) {
    ipBucket.forEach((value, bucketKey) => { if (value.resetAt <= now) ipBucket.delete(bucketKey); });
  }
  const bucket = ipBucket.get(key);
  if (bucket && bucket.resetAt > now) {
    if (bucket.count >= maxRequests) return { ok: false, status: 429, error: 'Rate limit exceeded. Please try again shortly.' };
    bucket.count += 1;
  } else {
    ipBucket.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
  }
  return { ok: true };
}

function hasAllowedOrigin(req: NextRequest): boolean {
  const origin = req.headers.get('origin');
  if (!origin) return true; // Non-browser clients are protected by rate limiting and optional Turnstile.
  return origin === req.nextUrl.origin;
}

export async function requirePublicChatAccess(req: NextRequest): Promise<{ ok: boolean; status?: number; error?: string }> {
  if (!hasAllowedOrigin(req)) return { ok: false, status: 403, error: 'Cross-origin chat requests are not allowed' };

  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  if (turnstileSecret) {
    const token = req.headers.get('x-turnstile-token');
    if (!token) return { ok: false, status: 403, error: 'Human verification is required' };
    try {
      const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ secret: turnstileSecret, response: token, remoteip: getClientIp(req) }),
      });
      const result = (await response.json()) as { success?: boolean };
      if (!response.ok || !result.success) return { ok: false, status: 403, error: 'Human verification failed' };
    } catch {
      return { ok: false, status: 503, error: 'Human verification is temporarily unavailable' };
    }
  }

  return enforceRateLimit(`public-chat:${getClientIp(req)}`, PUBLIC_CHAT_RATE_LIMIT_MAX);
}

export async function requireInternalAccess(req: NextRequest): Promise<{ ok: boolean; status?: number; error?: string }> {
  const internalSecret = process.env.INTERNAL_AI_SECRET ?? '';
  if (!internalSecret) return { ok: false, status: 501, error: 'Internal AI secret is not configured' };
  if (!secretsMatch(req.headers.get('x-internal-ai-secret') ?? '', internalSecret)) {
    return { ok: false, status: 401, error: 'Unauthorized' };
  }
  return enforceRateLimit(`internal-ai:${getClientIp(req)}`, RATE_LIMIT_MAX_REQUESTS);
}

/**
 * Admin gate for internal AI tools. Secure by default: access is enforced
 * unless the named environment variable is explicitly set to "false"
 * (e.g. AI_ADMIN_ONLY_POLICY_BRIEF=false). Provide the WEBHOOK_SECRET
 * via body/header to authenticate.
 */
export async function requireAdminIfEnabled(req: NextRequest, envVarName = '', providedSecret = ''): Promise<{ ok: boolean; status?: number; error?: string }> {
  const setting = String(process.env[envVarName] ?? '').toLowerCase();
  if (!envVarName || setting === 'false') return { ok: true };
  const webhookSecret = process.env.WEBHOOK_SECRET ?? '';
  if (webhookSecret && secretsMatch(providedSecret, webhookSecret)) return { ok: true };
  return requireInternalAccess(req);
}
