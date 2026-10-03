import type { MetadataRoute } from 'next';
import {
  getDivisions,
  getPublications,
  getInsights,
  getResearchers,
  getEvents,
} from '@/lib/cms/client';

const BASE = 'https://niser.gov.ng';

/** Static routes with their cache change-frequency and priority */
const STATIC_ROUTES: MetadataRoute.Sitemap = [
  { url: BASE, changeFrequency: 'daily',   priority: 1.0 },
  { url: `${BASE}/about`,                  changeFrequency: 'weekly',  priority: 0.8 },
  { url: `${BASE}/about/history`,          changeFrequency: 'monthly', priority: 0.5 },
  { url: `${BASE}/about/governance-structure`, changeFrequency: 'monthly', priority: 0.5 },
  { url: `${BASE}/about/governing-council`,    changeFrequency: 'monthly', priority: 0.5 },
  { url: `${BASE}/about/management-team`,      changeFrequency: 'monthly', priority: 0.5 },
  { url: `${BASE}/about/departments`,          changeFrequency: 'monthly', priority: 0.5 },
  { url: `${BASE}/about/staff-directory`,      changeFrequency: 'weekly',  priority: 0.6 },
  { url: `${BASE}/about/tenders`,              changeFrequency: 'weekly',  priority: 0.6 },
  { url: `${BASE}/about/content-governance`,   changeFrequency: 'yearly',  priority: 0.4 },
  { url: `${BASE}/about/servicom`,             changeFrequency: 'monthly', priority: 0.4 },
  { url: `${BASE}/publications`,           changeFrequency: 'daily',   priority: 0.9 },
  { url: `${BASE}/publications-archive`,   changeFrequency: 'weekly',  priority: 0.7 },
  { url: `${BASE}/annual-reports`,         changeFrequency: 'yearly',  priority: 0.6 },
  { url: `${BASE}/insights`,               changeFrequency: 'daily',   priority: 0.8 },
  { url: `${BASE}/policy-briefs`,          changeFrequency: 'weekly',  priority: 0.8 },
  { url: `${BASE}/people`,                 changeFrequency: 'weekly',  priority: 0.8 },
  { url: `${BASE}/events`,                 changeFrequency: 'daily',   priority: 0.8 },
  { url: `${BASE}/news`,                   changeFrequency: 'daily',   priority: 0.8 },
  { url: `${BASE}/research`,               changeFrequency: 'weekly',  priority: 0.7 },
  { url: `${BASE}/divisions`,              changeFrequency: 'monthly', priority: 0.7 },
  { url: `${BASE}/research-centers`,       changeFrequency: 'weekly',  priority: 0.7 },
  { url: `${BASE}/working-groups`,         changeFrequency: 'weekly',  priority: 0.6 },
  { url: `${BASE}/bckc-center`,            changeFrequency: 'weekly',  priority: 0.6 },
  { url: `${BASE}/data`,                   changeFrequency: 'weekly',  priority: 0.8 },
  { url: `${BASE}/careers`,                changeFrequency: 'weekly',  priority: 0.7 },
  { url: `${BASE}/internships`,            changeFrequency: 'weekly',  priority: 0.6 },
  { url: `${BASE}/training`,               changeFrequency: 'weekly',  priority: 0.6 },
  { url: `${BASE}/funding-opportunities`,  changeFrequency: 'weekly',  priority: 0.6 },
  { url: `${BASE}/partnerships`,           changeFrequency: 'monthly', priority: 0.5 },
  { url: `${BASE}/services`,               changeFrequency: 'monthly', priority: 0.5 },
  { url: `${BASE}/webinars`,               changeFrequency: 'weekly',  priority: 0.6 },
  { url: `${BASE}/gallery`,                changeFrequency: 'weekly',  priority: 0.5 },
  { url: `${BASE}/governance`,             changeFrequency: 'monthly', priority: 0.5 },
  { url: `${BASE}/contact`,               changeFrequency: 'yearly',  priority: 0.5 },
  { url: `${BASE}/subscribe`,             changeFrequency: 'yearly',  priority: 0.4 },
  { url: `${BASE}/privacy-policy`,        changeFrequency: 'yearly',  priority: 0.3 },
  { url: `${BASE}/search`,               changeFrequency: 'yearly',  priority: 0.4 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Fetch all CMS-driven slugs in parallel (graceful — returns [] if CMS is offline)
  const [publications, insights, researchers, events, divisions] = await Promise.all([
    getPublications({ limit: 500 }),
    getInsights({ limit: 500 }),
    getResearchers({}),
    getEvents({ limit: 200 }),
    getDivisions().catch(() => []),
  ]);

  const publicationUrls: MetadataRoute.Sitemap = publications
    .filter((p) => p.slug)
    .map((p) => ({
      url: `${BASE}/publications/${p.slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

  const insightUrls: MetadataRoute.Sitemap = insights
    .filter((i) => i.slug)
    .map((i) => ({
      url: `${BASE}/insights/${i.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

  const researcherUrls: MetadataRoute.Sitemap = researchers
    .filter((r) => r.slug)
    .map((r) => ({
      url: `${BASE}/people/${r.slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    }));

  const upcomingEventUrls: MetadataRoute.Sitemap = events
    .filter((e) => e.slug && new Date(e.startDate) >= now)
    .map((e) => ({
      url: `${BASE}/events/${e.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

  const divisionUrls: MetadataRoute.Sitemap = divisions
    .filter((d) => d.slug)
    .map((d) => ({
      url: `${BASE}/divisions/${d.slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

  return [
    ...STATIC_ROUTES,
    ...publicationUrls,
    ...insightUrls,
    ...researcherUrls,
    ...upcomingEventUrls,
    ...divisionUrls,
  ];
}
