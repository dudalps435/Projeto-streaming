export const STREAMING_LINKS = {
  Netflix: 'https://www.netflix.com',
  Prime: 'https://www.primevideo.com',
  'Prime Video': 'https://www.primevideo.com',
  'Disney+': 'https://www.disneyplus.com',
  'HBO Max': 'https://www.hbomax.com',
  Max: 'https://www.hbomax.com',
  NOW: 'https://www.nowtv.com',
  'Sky Go': 'https://www.skygo.sky.com',
  'Now TV': 'https://www.nowtv.com',
};

export const RENT_BUY_LINKS = {
  'Apple TV': 'https://tv.apple.com',
  'Google Play Movies': 'https://play.google.com/store/movies',
  'YouTube Movies': 'https://www.youtube.com/feed/storefront',
  'Microsoft Store': 'https://www.microsoft.com/store/movies-and-tv',
};

export function getPlatformLink(name) {
  return STREAMING_LINKS[name] || '#';
}

export function getRentBuyLink(name, title = '') {
  const base = RENT_BUY_LINKS[name];
  if (base) return base;
  const query = encodeURIComponent(`${title} alugar comprar`);
  return `https://www.google.com/search?q=${query}`;
}
