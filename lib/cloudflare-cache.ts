import { NextRequest, NextResponse } from 'next/server';

/**
 * Cloudflare Cache Purge Helper
 * 
 * Purges Cloudflare cache by tag when ISR revalidation occurs.
 * Requires CLOUDFLARE_API_TOKEN, CLOUDFLARE_ZONE_ID in .env.local
 */

const CLOUDFLARE_API_BASE = 'https://api.cloudflare.com/client/v4';
const CF_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const CF_ZONE_ID = process.env.CLOUDFLARE_ZONE_ID;

export interface CloudflareCachePurgeOptions {
  tags?: string[];
  urls?: string[];
  all?: boolean;
}

export async function purgeCloudflareCache(options: CloudflareCachePurgeOptions): Promise<boolean> {
  if (!CF_API_TOKEN || !CF_ZONE_ID) {
    console.warn(
      '[Cloudflare] Cache purge skipped: CLOUDFLARE_API_TOKEN or CLOUDFLARE_ZONE_ID not set'
    );
    return false;
  }

  try {
    const body: Record<string, unknown> = {};

    if (options.all) {
      body.purge_everything = true;
    } else if (options.tags && options.tags.length > 0) {
      body.tags = options.tags;
    } else if (options.urls && options.urls.length > 0) {
      body.files = options.urls;
    } else {
      console.warn('[Cloudflare] No purge targets specified (tags, urls, or all)');
      return false;
    }

    const response = await fetch(
      `${CLOUDFLARE_API_BASE}/zones/${CF_ZONE_ID}/purge_cache`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${CF_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error(
        `[Cloudflare] Cache purge failed (${response.status}):`,
        error
      );
      return false;
    }

    const data = await response.json();
    if (data.success) {
      const target = options.all ? 'all' : options.tags?.length ? `${options.tags.length} tags` : `${options.urls?.length} URLs`;
      console.log(`[Cloudflare] Cache purged successfully: ${target}`);
      return true;
    } else {
      console.error('[Cloudflare] Cache purge returned error:', data.errors);
      return false;
    }
  } catch (error) {
    console.error('[Cloudflare] Cache purge exception:', error);
    return false;
  }
}

/**
 * Cloudflare ISR Webhook Handler
 * 
 * Receives ISR revalidation requests and purges corresponding Cloudflare cache.
 * Call this from your ISR webhook routes.
 */
export async function handleISRRevalidation(req: NextRequest, resourceType: string, resourceId: string): Promise<NextResponse> {
  // Verify webhook signature
  const webhookSecret = process.env.ISR_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.warn('[ISR] ISR_WEBHOOK_SECRET not configured');
    return NextResponse.json({ error: 'ISR_WEBHOOK_SECRET not configured' }, { status: 500 });
  }

  const signature = req.headers.get('x-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
  }

  // Validate signature (implement HMAC-SHA256 validation if using CMS webhooks)
  // For now, just check presence

  try {
    // Determine cache tags to purge based on resource type
    const tagsToInvalidate = generateCacheTags(resourceType, resourceId);

    // Purge from Cloudflare
    await purgeCloudflareCache({ tags: tagsToInvalidate });

    // Also revalidate on Vercel if needed
    if (process.env.VERCEL_API_TOKEN) {
      console.log('[ISR] Would also trigger Vercel revalidation if configured');
    }

    return NextResponse.json({
      revalidated: true,
      resourceType,
      resourceId,
      tags: tagsToInvalidate,
    });
  } catch (error) {
    console.error('[ISR] Revalidation error:', error);
    return NextResponse.json(
      { error: 'Revalidation failed' },
      { status: 500 }
    );
  }
}

/**
 * Generate Cloudflare cache tags for a resource
 * Allows granular cache purging when content changes
 */
export function generateCacheTags(resourceType: string, resourceId: string): string[] {
  const tags: string[] = [];

  switch (resourceType) {
    case 'publication':
      tags.push(`publication-${resourceId}`);
      tags.push('publications-index');
      tags.push('search-index');
      break;

    case 'researcher':
      tags.push(`researcher-${resourceId}`);
      tags.push('researchers-directory');
      tags.push('search-index');
      break;

    case 'insight':
      tags.push(`insight-${resourceId}`);
      tags.push('insights-index');
      tags.push('search-index');
      break;

    case 'event':
      tags.push(`event-${resourceId}`);
      tags.push('events-index');
      tags.push('search-index');
      break;

    case 'news':
      tags.push(`news-${resourceId}`);
      tags.push('news-index');
      tags.push('homepage');
      break;

    case 'homepage':
      tags.push('homepage');
      tags.push('search-index');
      break;

    default:
      tags.push(`content-${resourceType}-${resourceId}`);
  }

  return tags;
}
