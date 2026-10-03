import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

/**
 * Middleware: Cache-Control headers + Cloudflare Cache-Tag headers
 *
 * Execution order matches cloudflare-cache-rules.json priority order.
 * Rules here set the Cache-Control header that Cloudflare respects via s-maxage.
 * Cache-Tag headers allow granular Cloudflare cache purging via /api/revalidate.
 *
 * NOTE: Next.js serves /_next/static/** before middleware runs, so static
 *       asset rules here only cover /public/** assets, not the build bundle.
 */
export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const { pathname } = req.nextUrl;

  // ─── Security headers (always applied) ────────────────────────────────────
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('X-Frame-Options', 'SAMEORIGIN');
  res.headers.set('X-XSS-Protection', '1; mode=block');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );

  // ─── 1. Private / write APIs — never cache ─────────────────────────────────
  if (
    pathname.startsWith('/api/admin/') ||
    pathname.startsWith('/api/chatbot') ||
    pathname.startsWith('/api/subscribe') ||
    pathname.startsWith('/api/embed') ||
    pathname.startsWith('/api/fcm') ||
    pathname.startsWith('/api/notify') ||
    pathname.startsWith('/api/revalidate') ||
    pathname.startsWith('/api/policy-brief') ||
    pathname.startsWith('/api/policy-monitor') ||
    pathname.startsWith('/api/literature-assistant') ||
    pathname.startsWith('/api/translate')
  ) {
    res.headers.set('Cache-Control', 'private, no-store, no-cache');
    return res;
  }

  // ─── 2. Public GET-only APIs ───────────────────────────────────────────────
  if (pathname.startsWith('/api/search')) {
    // Short TTL — search results should be fresh
    res.headers.set('Cache-Control', 'public, max-age=0, s-maxage=120, stale-while-revalidate=60');
    res.headers.set('Cache-Tag', 'search-index');
    return res;
  }

  if (pathname.startsWith('/api/data')) {
    // Open Data Catalogue — moderate TTL
    res.headers.set('Cache-Control', 'public, max-age=0, s-maxage=600, stale-while-revalidate=60');
    res.headers.set('Cache-Tag', 'data-catalogue');
    return res;
  }

  if (pathname.startsWith('/api/recommendations')) {
    // Recommendation results — 5-minute edge cache
    res.headers.set('Cache-Control', 'public, max-age=0, s-maxage=300');
    res.headers.set('Cache-Tag', 'search-index');
    return res;
  }

  if (pathname.startsWith('/api/ai/status')) {
    // AI health check — very short TTL
    res.headers.set('Cache-Control', 'public, max-age=0, s-maxage=30');
    return res;
  }

  if (
    pathname.startsWith('/api/events') ||
    pathname.startsWith('/api/insights') ||
    pathname.startsWith('/api/news') ||
    pathname.startsWith('/api/people') ||
    pathname.startsWith('/api/publications')
  ) {
    // Mobile content APIs — moderate edge TTL with stale-while-revalidate
    res.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=21600, stale-while-revalidate=600');
    return res;
  }

  // Catch-all: any other /api/* not matched above → no cache
  if (pathname.startsWith('/api/')) {
    res.headers.set('Cache-Control', 'private, no-store, no-cache');
    return res;
  }

  // ─── 3. Interactive / personalised page routes — no cache ─────────────────
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/chatbot') ||
    pathname.startsWith('/search') ||
    pathname.startsWith('/cart') ||
    pathname.startsWith('/shop') ||
    pathname.startsWith('/subscribe') ||
    pathname.startsWith('/translate') ||
    pathname.startsWith('/literature-assistant') ||
    pathname.startsWith('/ai-policy-brief')
  ) {
    res.headers.set('Cache-Control', 'private, no-store, no-cache');
    return res;
  }

  // ─── 4. Archive / reports pages — 7 day cache ─────────────────────────────
  if (
    pathname.startsWith('/publications-archive') ||
    pathname.startsWith('/annual-reports')
  ) {
    res.headers.set('Cache-Control', 'public, max-age=86400, s-maxage=604800');
    setCacheTag(res, pathname);
    return res;
  }

  // ─── 5. Dynamic content pages — 6 hour edge / 1 hour browser ─────────────
  if (
    pathname.startsWith('/publications') ||
    pathname.startsWith('/insights') ||
    pathname.startsWith('/events') ||
    pathname.startsWith('/people') ||
    pathname.startsWith('/news') ||
    pathname.startsWith('/policy-briefs') ||
    pathname.startsWith('/research') ||
    pathname.startsWith('/research-centers') ||
    pathname.startsWith('/working-groups')
  ) {
    res.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=21600, stale-while-revalidate=600');
    setCacheTag(res, pathname);
    return res;
  }

  // ─── 6. Semi-static pages — 24 hour edge / 1 hour browser ────────────────
  if (
    pathname === '/' ||
    pathname.startsWith('/about') ||
    pathname.startsWith('/contact') ||
    pathname.startsWith('/governance') ||
    pathname.startsWith('/careers') ||
    pathname.startsWith('/internships') ||
    pathname.startsWith('/partnerships') ||
    pathname.startsWith('/services') ||
    pathname.startsWith('/training') ||
    pathname.startsWith('/funding-opportunities') ||
    pathname.startsWith('/bckc-center') ||
    pathname.startsWith('/resources') ||
    pathname.startsWith('/webinars') ||
    pathname.startsWith('/gallery') ||
    pathname.startsWith('/privacy-policy') ||
    pathname.startsWith('/data')
  ) {
    res.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=3600');
    setCacheTag(res, pathname);
    return res;
  }

  // ─── 7. Public files (/public/**) ─────────────────────────────────────────
  if (
    /\.(webp|png|jpg|jpeg|gif|svg|avif|woff2|woff|ttf|eot|ico|webmanifest|pdf)$/i.test(pathname)
  ) {
    res.headers.set('Cache-Control', 'public, max-age=2592000, immutable');
    return res;
  }

  // ─── Default fallback ─────────────────────────────────────────────────────
  res.headers.set('Cache-Control', 'public, max-age=0, s-maxage=3600');
  return res;
}

/**
 * Attach Cloudflare Cache-Tag header based on the current pathname.
 * Cache-Tag purging is triggered by /api/revalidate (see lib/cloudflare-cache.ts).
 */
function setCacheTag(res: NextResponse, pathname: string): void {
  const tags: string[] = [];

  if (pathname === '/') {
    tags.push('homepage', 'search-index');
  } else if (pathname.startsWith('/publications/')) {
    const slug = pathname.split('/')[2];
    if (slug) tags.push(`publication-${slug}`);
    tags.push('publications-index', 'search-index');
  } else if (pathname === '/publications') {
    tags.push('publications-index', 'search-index');
  } else if (pathname.startsWith('/insights/')) {
    const slug = pathname.split('/')[2];
    if (slug) tags.push(`insight-${slug}`);
    tags.push('insights-index', 'search-index');
  } else if (pathname === '/insights') {
    tags.push('insights-index', 'search-index');
  } else if (pathname.startsWith('/people/')) {
    const slug = pathname.split('/')[2];
    if (slug) tags.push(`researcher-${slug}`);
    tags.push('researchers-directory', 'search-index');
  } else if (pathname === '/people') {
    tags.push('researchers-directory', 'search-index');
  } else if (pathname.startsWith('/events')) {
    tags.push('events-index', 'search-index');
  } else if (pathname.startsWith('/news')) {
    tags.push('news-index', 'homepage', 'search-index');
  } else if (pathname.startsWith('/policy-briefs')) {
    tags.push('policy-briefs-index', 'search-index');
  } else if (pathname.startsWith('/research-centers')) {
    tags.push('research-centers', 'search-index');
  } else if (pathname.startsWith('/working-groups')) {
    tags.push('working-groups', 'search-index');
  } else if (pathname.startsWith('/data')) {
    tags.push('data-catalogue');
  } else if (pathname.startsWith('/publications-archive') || pathname.startsWith('/annual-reports')) {
    tags.push('publications-archive');
  }

  if (tags.length > 0) {
    res.headers.set('Cache-Tag', tags.join(','));
  }
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (build assets, served by Next.js directly)
     * - _next/image  (Next.js image optimiser)
     * - favicon.ico
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
