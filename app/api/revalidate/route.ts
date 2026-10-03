import { NextRequest, NextResponse } from 'next/server';
import { purgeCloudflareCache } from '@/lib/cloudflare-cache';

/**
 * ISR Revalidation Route for Payload CMS webhooks
 * 
 * Triggered when content is published/updated in CMS.
 * Revalidates the page and purges Cloudflare cache.
 * 
 * Example webhook URL in Payload CMS:
 * POST https://niser.gov.ng/api/revalidate?token=YOUR_SECRET&type=publication&id=123
 */
export async function POST(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  const type = req.nextUrl.searchParams.get('type');
  const id = req.nextUrl.searchParams.get('id');

  const revalidateToken = process.env.ISR_REVALIDATE_TOKEN;

  if (!revalidateToken || token !== revalidateToken) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  if (!type || !id) {
    return NextResponse.json(
      { error: 'Missing type or id parameter' },
      { status: 400 }
    );
  }

  try {
    // 1. Purge Cloudflare cache by tag
    const tagsToInvalidate = [
      `${type}-${id}`,
      `${type}s-index`,
      'search-index',
    ];

    await purgeCloudflareCache({ tags: tagsToInvalidate });

    // 2. Revalidate paths (works with Next.js ISR)
    const paths = getPathsToRevalidate(type, id);
    for (const path of paths) {
      try {
        await revalidatePath(path);
        console.log(`[ISR] Revalidated: ${path}`);
      } catch (revalidateError) {
        console.warn(`[ISR] Revalidation failed for ${path}:`, revalidateError);
      }
    }

    return NextResponse.json({
      revalidated: true,
      type,
      id,
      paths,
      cloudflareTagsInvalidated: tagsToInvalidate,
    });
  } catch (error) {
    console.error('[ISR] Revalidation error:', error);
    return NextResponse.json(
      { error: 'Revalidation failed', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * Get the Next.js paths to revalidate for a given resource type and ID
 */
function getPathsToRevalidate(resourceType: string, resourceId: string): string[] {
  const paths: string[] = [];

  switch (resourceType) {
    case 'publication':
      // You'll need to fetch the slug from the CMS
      paths.push(`/publications/${resourceId}`);
      paths.push('/publications');
      break;

    case 'researcher':
      paths.push(`/people/${resourceId}`);
      paths.push('/people');
      break;

    case 'insight':
      paths.push(`/insights/${resourceId}`);
      paths.push('/insights');
      break;

    case 'event':
      paths.push('/events');
      break;

    case 'news':
      paths.push('/');
      break;

    default:
      console.warn(`[ISR] Unknown resource type: ${resourceType}`);
  }

  return paths;
}

// Import revalidatePath at top for Next.js ISR
import { revalidatePath } from 'next/cache';
