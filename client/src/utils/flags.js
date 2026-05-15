// ISO codes for all teams to fetch flag images
const ISO_CODES = {
  'Qatar': 'qa',
  'Ecuador': 'ec',
  'Senegal': 'sn',
  'Netherlands': 'nl',
  'England': 'gb-eng',
  'IR Iran': 'ir',
  'USA': 'us',
  'Mexico': 'mx',
  'France': 'fr',
  'Australia': 'au',
  'Tunisia': 'tn',
  'Spain': 'es',
  'Germany': 'de',
  'Japan': 'jp',
  'Belgium': 'be',
  'Canada': 'ca',
  'Morocco': 'ma',
  'Croatia': 'hr',
  'Brazil': 'br',
  'Switzerland': 'ch',
  'Portugal': 'pt',
  'Ghana': 'gh',
  'Uruguay': 'uy',
  'Korea Republic': 'kr',
  'New Zealand': 'nz',
  'Paraguay': 'py',
  'Colombia': 'co',
  'Côte d\'Ivoire': 'ci',
  'Sweden': 'se',
  'Algeria': 'dz',
  'Egypt': 'eg',
  'Panama': 'pa',
  'Austria': 'at',
  'Türkiye': 'tr',
  'Norway': 'no',
  'Iraq': 'iq',
  'South Africa': 'za',
  'Czechia': 'cz',
  'Bosnia and Herzegovina': 'ba',
  'Haiti': 'ht',
  'Scotland': 'gb-sct',
  'Curaçao': 'cw',
  'Cabo Verde': 'cv',
  'Jordan': 'jo',
  'Congo DR': 'cd',
  'Uzbekistan': 'uz',
  'Argentina': 'ar',
  'Saudi Arabia': 'sa'
};

/**
 * Returns a flag image URL for a given country name.
 * Uses flagcdn.com which is fast and reliable.
 */
export const getFlag = (teamName) => {
  if (!teamName) return '';
  
  const code = ISO_CODES[teamName];
  if (!code) return '🏳️';

  return `https://flagcdn.com/w40/${code.toLowerCase()}.png`;
};

// Keep emojis as fallback just in case
export const FLAGS = {
  'Spain': '🇪🇸',
};
