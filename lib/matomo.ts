const MATOMO_URL = process.env.MATOMO_URL;
const MATOMO_SITE_ID = process.env.MATOMO_SITE_ID;

export function getMatomoConfig() {
  return {
    url: MATOMO_URL,
    siteId: MATOMO_SITE_ID,
  };
}

export async function trackMatomoEvent(
  eventCategory: string,
  eventAction: string,
  eventName: string,
  eventValue?: number,
): Promise<void> {
  if (!MATOMO_URL || !MATOMO_SITE_ID) {
    return;
  }

  const params = new URLSearchParams({
    idsite: MATOMO_SITE_ID,
    rec: '1',
    e_c: eventCategory,
    e_a: eventAction,
    e_n: eventName,
  });

  if (typeof eventValue === 'number') {
    params.set('e_v', String(eventValue));
  }

  const url = `${MATOMO_URL}/matomo.php?${params.toString()}`;

  try {
    await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'image/webp,image/apng,image/*,*/*;q=0.8',
      },
    });
  } catch (error) {
    console.warn('[Matomo] Event tracking failed:', (error as Error).message);
  }
}
