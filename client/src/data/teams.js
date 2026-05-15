// World Cup 2026 - 48 teams organized in 12 groups
export const TEAMS = {
  A: ['Qatar', 'Ecuador', 'Senegal', 'Netherlands'],
  B: ['England', 'Iran', 'USA', 'Wales'],
  C: ['Argentina', 'Saudi Arabia', 'Mexico', 'Poland'],
  D: ['France', 'Australia', 'Denmark', 'Tunisia'],
  E: ['Spain', 'Costa Rica', 'Germany', 'Japan'],
  F: ['Belgium', 'Canada', 'Morocco', 'Croatia'],
  G: ['Brazil', 'Serbia', 'Switzerland', 'Cameroon'],
  H: ['Portugal', 'Ghana', 'Uruguay', 'South Korea'],
  I: ['Italy', 'New Zealand', 'Paraguay', 'Slovakia'],
  J: ['Japan', 'Colombia', 'Greece', 'Ivory Coast'],
  K: ['Sweden', 'Chile', 'Nigeria', 'Algeria'],
  L: ['Croatia', 'Russia', 'Egypt', 'Uruguay']
};

// Group phase matches (6 matches per group, 72 total)
export const GROUP_MATCHES = {};

Object.keys(TEAMS).forEach(group => {
  const teams = TEAMS[group];
  const matches = [];
  
  // Generate all combinations of 2 teams from each group
  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      matches.push({
        id: `${group}-${teams[i]}-${teams[j]}`,
        group,
        home: teams[i],
        away: teams[j],
        homeGoals: null,
        awayGoals: null,
        played: false
      });
    }
  }
  
  GROUP_MATCHES[group] = matches;
});

// Knockout phase bracket structure
export const KNOCKOUT_BRACKET = {
  roundOf32: [
    { id: 'R32-73', home: '2A', away: '2B', homeGoals: null, awayGoals: null, winner: null, penalties: null },
    { id: 'R32-74', home: '1E', away: '3_ABCDF', homeGoals: null, awayGoals: null, winner: null, penalties: null },
    { id: 'R32-75', home: '1F', away: '2C', homeGoals: null, awayGoals: null, winner: null, penalties: null },
    { id: 'R32-76', home: '1C', away: '2F', homeGoals: null, awayGoals: null, winner: null, penalties: null },
    { id: 'R32-77', home: '1I', away: '3_CDFGH', homeGoals: null, awayGoals: null, winner: null, penalties: null },
    { id: 'R32-78', home: '2E', away: '2I', homeGoals: null, awayGoals: null, winner: null, penalties: null },
    { id: 'R32-79', home: '1A', away: '3_CEFHI', homeGoals: null, awayGoals: null, winner: null, penalties: null },
    { id: 'R32-80', home: '1L', away: '3_EHIJK', homeGoals: null, awayGoals: null, winner: null, penalties: null },
    { id: 'R32-81', home: '1D', away: '3_BEFIJ', homeGoals: null, awayGoals: null, winner: null, penalties: null },
    { id: 'R32-82', home: '1G', away: '3_AEHIJ', homeGoals: null, awayGoals: null, winner: null, penalties: null },
    { id: 'R32-83', home: '2K', away: '2L', homeGoals: null, awayGoals: null, winner: null, penalties: null },
    { id: 'R32-84', home: '1H', away: '2J', homeGoals: null, awayGoals: null, winner: null, penalties: null },
    { id: 'R32-85', home: '1B', away: '3_EFGIJ', homeGoals: null, awayGoals: null, winner: null, penalties: null },
    { id: 'R32-86', home: '1J', away: '2H', homeGoals: null, awayGoals: null, winner: null, penalties: null },
    { id: 'R32-87', home: '1K', away: '3_DEIJL', homeGoals: null, awayGoals: null, winner: null, penalties: null },
    { id: 'R32-88', home: '2D', away: '2G', homeGoals: null, awayGoals: null, winner: null, penalties: null },
  ],
  roundOf16: [
    { id: 'R16-1', home: 'R32-73-winner', away: 'R32-75-winner', homeGoals: null, awayGoals: null, winner: null, penalties: null },
    { id: 'R16-2', home: 'R32-74-winner', away: 'R32-77-winner', homeGoals: null, awayGoals: null, winner: null, penalties: null },
    { id: 'R16-3', home: 'R32-76-winner', away: 'R32-78-winner', homeGoals: null, awayGoals: null, winner: null, penalties: null },
    { id: 'R16-4', home: 'R32-79-winner', away: 'R32-80-winner', homeGoals: null, awayGoals: null, winner: null, penalties: null },
    { id: 'R16-5', home: 'R32-83-winner', away: 'R32-84-winner', homeGoals: null, awayGoals: null, winner: null, penalties: null },
    { id: 'R16-6', home: 'R32-81-winner', away: 'R32-82-winner', homeGoals: null, awayGoals: null, winner: null, penalties: null },
    { id: 'R16-7', home: 'R32-86-winner', away: 'R32-88-winner', homeGoals: null, awayGoals: null, winner: null, penalties: null },
    { id: 'R16-8', home: 'R32-85-winner', away: 'R32-87-winner', homeGoals: null, awayGoals: null, winner: null, penalties: null },
  ],
  quarterFinals: [
    { id: 'QF-1', home: 'R16-1-winner', away: 'R16-2-winner', homeGoals: null, awayGoals: null, winner: null, penalties: null },
    { id: 'QF-2', home: 'R16-3-winner', away: 'R16-4-winner', homeGoals: null, awayGoals: null, winner: null, penalties: null },
    { id: 'QF-3', home: 'R16-5-winner', away: 'R16-6-winner', homeGoals: null, awayGoals: null, winner: null, penalties: null },
    { id: 'QF-4', home: 'R16-7-winner', away: 'R16-8-winner', homeGoals: null, awayGoals: null, winner: null, penalties: null },
  ],
  semiFinals: [
    { id: 'SF-1', home: 'QF-1-winner', away: 'QF-2-winner', homeGoals: null, awayGoals: null, winner: null, penalties: null },
    { id: 'SF-2', home: 'QF-3-winner', away: 'QF-4-winner', homeGoals: null, awayGoals: null, winner: null, penalties: null },
  ],
  final: [
    { id: 'F-1', home: 'SF-1-winner', away: 'SF-2-winner', homeGoals: null, awayGoals: null, winner: null, penalties: null, isFinal: true }
  ]
};
