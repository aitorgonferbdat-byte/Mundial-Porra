// Flag emojis for all World Cup 2026 teams
export const FLAGS = {
  // Group A
  'Qatar': '🇶🇦',
  'Ecuador': '🇪🇨',
  'Senegal': '🇸🇳',
  'Netherlands': '🇳🇱',

  // Group B
  'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  'Iran': '🇮🇷',
  'USA': '🇺🇸',
  'Wales': '🏴󠁧󠁢󠁷󠁬󠁳󠁿',

  // Group C
  'Argentina': '🇦🇷',
  'Saudi Arabia': '🇸🇦',
  'Mexico': '🇲🇽',
  'Poland': '🇵🇱',

  // Group D
  'France': '🇫🇷',
  'Australia': '🇦🇺',
  'Denmark': '🇩🇰',
  'Tunisia': '🇹🇳',

  // Group E
  'Spain': '🇪🇸',
  'Costa Rica': '🇨🇷',
  'Germany': '🇩🇪',
  'Japan': '🇯🇵',

  // Group F
  'Belgium': '🇧🇪',
  'Canada': '🇨🇦',
  'Morocco': '🇲🇦',
  'Croatia': '🇭🇷',

  // Group G
  'Brazil': '🇧🇷',
  'Serbia': '🇷🇸',
  'Switzerland': '🇨🇭',
  'Cameroon': '🇨🇲',

  // Group H
  'Portugal': '🇵🇹',
  'Ghana': '🇬🇭',
  'Uruguay': '🇺🇾',
  'South Korea': '🇰🇷',

  // Group I
  'Italy': '🇮🇹',
  'New Zealand': '🇳🇿',
  'Paraguay': '🇵🇾',
  'Slovakia': '🇸🇰',

  // Group J
  'Colombia': '🇨🇴',
  'Greece': '🇬🇷',
  'Ivory Coast': '🇨🇮',

  // Group K
  'Sweden': '🇸🇪',
  'Chile': '🇨🇱',
  'Nigeria': '🇳🇬',
  'Algeria': '🇩🇿',

  // Group L
  'Russia': '🇷🇺',
  'Egypt': '🇪🇬',
};

/**
 * Returns the flag emoji for a given country name.
 * Falls back to '🏳️' if not found.
 */
export const getFlag = (teamName) => {
  if (!teamName) return '';
  return FLAGS[teamName] || '🏳️';
};
