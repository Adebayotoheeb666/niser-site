const CMS_BASE =
  process.env.NEXT_PUBLIC_CMS_URL ?? "http://localhost:10003/wp-json/niser/v1";

export interface GalleryItem {
  slug: string;
  title: string;
  description: string;
  details: string;
  imageUrl: string;
  videoUrl?: string;
  type?: 'image' | 'video';
}

// Fallback sample data for development/demo
const imageGalleryItemsFallback: GalleryItem[] = [
  {
    slug: 'campus-events',
    title: 'Campus Events',
    description: 'Photos from NISER events, conferences, and community activities.',
    details:
      'A visual record of NISER events and gatherings. These images capture conferences, lectures, and outreach activities on campus.',
    imageUrl: '/niser-img-01.png',
  },
  {
    slug: 'research-facilities',
    title: 'Research Facilities',
    description: 'Images of NISER research spaces, labs, and collaboration areas.',
    details:
      'A look inside NISER research facilities and laboratories, showcasing the infrastructure that supports social and economic research.',
    imageUrl: '/niser-img-02.png',
  },
  {
    slug: 'team-collaboration',
    title: 'Team Collaboration',
    description: 'Photographs highlighting researchers and teams working together.',
    details:
      'Communities of researchers, staff, and partners captured in collaborative settings, meetings, and study sessions.',
    imageUrl: '/niser-img-03.png',
  },
];

const videoGalleryItemsFallback: GalleryItem[] = [
  {
    slug: 'financial-development-fdi',
    title: 'How Financial Development Protects Nigeria\'s FDI from Uncertainties',
    description: 'NISER Policy Spotlight on financial development and foreign direct investment.',
    details:
      'This NISER policy analysis explores how financial development serves as a protective mechanism for Nigeria\'s foreign direct investment amid economic uncertainties.',
    imageUrl: '/niser-img-04.png',
    videoUrl: 'https://youtu.be/KBYG967oycU?si=8HlywwlWc3maCfAu',
    type: 'video',
  },
  {
    slug: 'womens-political-inclusion',
    title: 'Why Women\'s Political Inclusion is Key to Nigeria\'s Future',
    description: 'NISER Policy Spotlight premiering 7/10/26 on women in governance.',
    details:
      'A comprehensive NISER policy spotlight examining the critical role of women\'s political participation in shaping Nigeria\'s democratic future and economic development.',
    imageUrl: '/niser-img-05.png',
    videoUrl: 'https://youtu.be/IaS8_bDgYNk?si=qT_BXmVukD3xIHJp',
    type: 'video',
  },
  {
    slug: 'niser-democracy-day-2024',
    title: 'NISER on Democracy Day 2024',
    description: 'NISER\'s Democracy Day 2024 reflections and analysis.',
    details:
      'NISER\'s commemorative address and policy analysis for Nigeria\'s Democracy Day 2024, reflecting on democratic institutions and national development.',
    imageUrl: '/niser-img-06.png',
    videoUrl: 'https://youtu.be/Zuj7UOq5TMQ?si=xcYme9qP9dU__sZl',
    type: 'video',
  },
  {
    slug: 'perfect-storm-webinar',
    title: 'NISER Webinar: Is Nigeria in the eye of a perfect storm?',
    description: 'NISER webinar analyzing Nigeria\'s current economic and political challenges.',
    details:
      'An in-depth NISER webinar examining the convergence of economic, political, and social challenges facing Nigeria and potential policy responses.',
    imageUrl: '/niser-img-04.png',
    videoUrl: 'https://youtu.be/IYsnUty3-Jc?si=qru5ppYQnUDZ7p7b',
    type: 'video',
  },
];

export async function getImageGalleryItems(): Promise<GalleryItem[]> {
  try {
    const response = await fetch(`${CMS_BASE}/gallery?type=image`, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) throw new Error('Failed to fetch gallery items');
    const items = await response.json();
    return items.map((item: GalleryItem) => ({
      slug: item.slug,
      title: item.title,
      description: item.description,
      details: item.details,
      imageUrl: item.imageUrl,
      type: 'image' as const,
    }));
  } catch (error) {
    console.warn('[Gallery] Failed to fetch images from WordPress, using fallback:', error);
    return imageGalleryItemsFallback;
  }
}

export async function getVideoGalleryItems(): Promise<GalleryItem[]> {
  try {
    const response = await fetch(`${CMS_BASE}/gallery?type=video`, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) throw new Error('Failed to fetch gallery items');
    const items = await response.json();
    return items.map((item: GalleryItem) => ({
      slug: item.slug,
      title: item.title,
      description: item.description,
      details: item.details,
      imageUrl: item.imageUrl,
      videoUrl: item.videoUrl,
      type: 'video' as const,
    }));
  } catch (error) {
    console.warn('[Gallery] Failed to fetch videos from WordPress, using fallback:', error);
    return videoGalleryItemsFallback;
  }
}

export async function getImageGalleryItemBySlug(slug: string): Promise<GalleryItem | undefined> {
  try {
    const response = await fetch(`${CMS_BASE}/gallery/${slug}`, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) throw new Error('Failed to fetch gallery item');
    return await response.json();
  } catch (error) {
    console.warn(`[Gallery] Failed to fetch image ${slug} from WordPress, checking fallback:`, error);
    return imageGalleryItemsFallback.find((item) => item.slug === slug);
  }
}

export async function getVideoGalleryItemBySlug(slug: string): Promise<GalleryItem | undefined> {
  try {
    const response = await fetch(`${CMS_BASE}/gallery/${slug}`, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) throw new Error('Failed to fetch gallery item');
    return await response.json();
  } catch (error) {
    console.warn(`[Gallery] Failed to fetch video ${slug} from WordPress, checking fallback:`, error);
    return videoGalleryItemsFallback.find((item) => item.slug === slug);
  }
}
