// World Cup 2026 - 48 teams organized in 12 groups (A-L)
export const TEAMS = {
  A: ['Mexico', 'USA', 'Canada', 'Panama'],
  B: ['Argentina', 'Peru', 'Chile', 'Paraguay'],
  C: ['Brazil', 'Colombia', 'Uruguay', 'Ecuador'],
  D: ['France', 'Austria', 'Poland', 'Ukraine'],
  E: ['Spain', 'Italy', 'Sweden', 'Turkey'],
  F: ['England', 'Denmark', 'Serbia', 'Norway'],
  G: ['Belgium', 'Portugal', 'Switzerland', 'Hungary'],
  H: ['Germany', 'Netherlands', 'Croatia', 'Slovakia'],
  I: ['Morocco', 'Senegal', 'Nigeria', 'Egypt'],
  J: ['Algeria', 'Ivory Coast', 'Cameroon', 'Ghana'],
  K: ['Japan', 'South Korea', 'Iran', 'Saudi Arabia'],
  L: ['Australia', 'Qatar', 'New Zealand', 'Iraq']
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

// Knockout phase bracket structure (Round of 32 for 2026 format)
export const KNOCKOUT_BRACKET = {
  roundOf32: [
    { id: 'R32-1', home: '1A', away: '3B/C/D', homeGoals: null, awayGoals: null, winner: null, penalties: null },
    { id: 'R32-2', home: '2A', away: '2B', homeGoals: null, awayGoals: null, winner: null, penalties: null },
    { id: 'R32-3', home: '1B', away: '3A/C/D', homeGoals: null, awayGoals: null, winner: null, penalties: null },
    { id: 'R32-4', home: '1C', away: '3A/B/D', homeGoals: null, awayGoals: null, winner: null, penalties: null },
    { id: 'R32-5', home: '1D', away: '3A/B/C', homeGoals: null, awayGoals: null, winner: null, penalties: null },
    { id: 'R32-6', home: '2C', away: '2D', homeGoals: null, awayGoals: null, winner: null, penalties: null },
    { id: 'R32-7', home: '1E', away: '3F/G/H', homeGoals: null, awayGoals: null, winner: null, penalties: null },
    { id: 'R32-8', home: '2E', away: '2F', homeGoals: null, awayGoals: null, winner: null, penalties: null },
    { id: 'R32-9', home: '1F', away: '3E/G/H', homeGoals: null, awayGoals: null, winner: null, penalties: null },
    { id: 'R32-10', home: '1G', away: '3E/F/H', homeGoals: null, awayGoals: null, winner: null, penalties: null },
    { id: 'R32-11', home: '1H', away: '3E/F/G', homeGoals: null, awayGoals: null, winner: null, penalties: null },
    { id: 'R32-12', home: '2G', away: '2H', homeGoals: null, awayGoals: null, winner: null, penalties: null },
    { id: 'R32-13', home: '1I', away: '3J/K/L', homeGoals: null, awayGoals: null, winner: null, penalties: null },
    { id: 'R32-14', home: '2I', away: '2J', homeGoals: null, awayGoals: null, winner: null, penalties: null },
    { id: 'R32-15', home: '1J', away: '3I/K/L', homeGoals: null, awayGoals: null, winner: null, penalties: null },
    { id: 'R32-16', home: '1K', away: '2L', homeGoals: null, awayGoals: null, winner: null, penalties: null }
  ],
  roundOf16: [
    { id: 'R16-1', home: 'R32-1-winner', away: 'R32-2-winner', homeGoals: null, awayGoals: null, winner: null, penalties: null },
    { id: 'R16-2', home: 'R32-3-winner', away: 'R32-4-winner', homeGoals: null, awayGoals: null, winner: null, penalties: null },
    { id: 'R16-3', home: 'R32-5-winner', away: 'R32-6-winner', homeGoals: null, awayGoals: null, winner: null, penalties: null },
    { id: 'R16-4', home: 'R32-7-winner', away: 'R32-8-winner', homeGoals: null, awayGoals: null, winner: null, penalties: null },
    { id: 'R16-5', home: 'R32-9-winner', away: 'R32-10-winner', homeGoals: null, awayGoals: null, winner: null, penalties: null },
    { id: 'R16-6', home: 'R32-11-winner', away: 'R32-12-winner', homeGoals: null, awayGoals: null, winner: null, penalties: null },
    { id: 'R16-7', home: 'R32-13-winner', away: 'R32-14-winner', homeGoals: null, awayGoals: null, winner: null, penalties: null },
    { id: 'R16-8', home: 'R32-15-winner', away: 'R32-16-winner', homeGoals: null, awayGoals: null, winner: null, penalties: null }
  ],
  quarterFinals: [
    { id: 'QF-1', home: 'R16-1-winner', away: 'R16-2-winner', homeGoals: null, awayGoals: null, winner: null, penalties: null },
    { id: 'QF-2', home: 'R16-3-winner', away: 'R16-4-winner', homeGoals: null, awayGoals: null, winner: null, penalties: null },
    { id: 'QF-3', home: 'R16-5-winner', away: 'R16-6-winner', homeGoals: null, awayGoals: null, winner: null, penalties: null },
    { id: 'QF-4', home: 'R16-7-winner', away: 'R16-8-winner', homeGoals: null, awayGoals: null, winner: null, penalties: null }
  ],
  semiFinals: [
    { id: 'SF-1', home: 'QF-1-winner', away: 'QF-2-winner', homeGoals: null, awayGoals: null, winner: null, penalties: null },
    { id: 'SF-2', home: 'QF-3-winner', away: 'QF-4-winner', homeGoals: null, awayGoals: null, winner: null, penalties: null }
  ],
  final: [
    { id: 'F-1', home: 'SF-1-winner', away: 'SF-2-winner', homeGoals: null, awayGoals: null, winner: null, penalties: null, isFinal: true }
  ]
};
