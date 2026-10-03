import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/_next/',
          '/chatbot',
          '/ai-policy-brief',
          '/literature-assistant',
          '/cart',
          '/shop',
        ],
      },
      {
        // Allow search-engine crawlers unrestricted access to public pages
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: 'https://niser.gov.ng/sitemap.xml',
    host: 'https://niser.gov.ng',
  };
}
