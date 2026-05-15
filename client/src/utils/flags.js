// ISO codes for all teams to fetch flag images
const ISO_CODES = {
  'Qatar': 'qa',
  'Ecuador': 'ec',
  'Senegal': 'sn',
  'Netherlands': 'nl',
  'England': 'gb-eng',
  'Iran': 'ir',
  'USA': 'us',
  'Wales': 'gb-wls',
  'Argentina': 'ar',
  'Saudi Arabia': 'sa',
  'Mexico': 'mx',
  'Poland': 'pl',
  'France': 'fr',
  'Australia': 'au',
  'Denmark': 'dk',
  'Tunisia': 'tn',
  'Spain': 'es',
  'Costa Rica': 'cr',
  'Germany': 'de',
  'Japan': 'jp',
  'Belgium': 'be',
  'Canada': 'ca',
  'Morocco': 'ma',
  'Croatia': 'hr',
  'Brazil': 'br',
  'Serbia': 'rs',
  'Switzerland': 'ch',
  'Cameroon': 'cm',
  'Portugal': 'pt',
  'Ghana': 'gh',
  'Uruguay': 'uy',
  'South Korea': 'kr',
  'Italy': 'it',
  'New Zealand': 'nz',
  'Paraguay': 'py',
  'Slovakia': 'sk',
  'Colombia': 'co',
  'Greece': 'gr',
  'Ivory Coast': 'ci',
  'Sweden': 'se',
  'Chile': 'cl',
  'Nigeria': 'ng',
  'Algeria': 'dz',
  'Russia': 'ru',
  'Egypt': 'eg'
};

/**
 * Returns a flag image URL for a given country name.
 * Uses flagcdn.com which is fast and reliable.
 */
export const getFlag = (teamName) => {
  if (!teamName) return '';
  
  const code = ISO_CODES[teamName];
  if (!code) return '🏳️';

  // We return a small component or just the URL? 
  // Let's return the URL and adjust the components to use <img>
  return `https://flagcdn.com/w40/${code.toLowerCase()}.png`;
};

// Keep emojis as fallback just in case
export const FLAGS = {
  'Spain': '🇪🇸',
  // ... rest of emojis if needed for text-only contexts
};
