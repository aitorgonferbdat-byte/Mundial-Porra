// Calculate group standings based on match results
export const calculateGroupStandings = (group, matches) => {
  const standings = {};
  
  // Initialize standings for each team
  matches.forEach(match => {
    standings[match.home] = { points: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, played: 0 };
    standings[match.away] = { points: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, played: 0 };
  });
  
  // Process each match
  matches.forEach(match => {
    if (match.played && match.homeGoals !== null && match.awayGoals !== null) {
      // Update home team
      standings[match.home].played += 1;
      standings[match.home].goalsFor += match.homeGoals;
      standings[match.home].goalsAgainst += match.awayGoals;
      standings[match.home].goalDifference = standings[match.home].goalsFor - standings[match.home].goalsAgainst;
      
      // Update away team
      standings[match.away].played += 1;
      standings[match.away].goalsFor += match.awayGoals;
      standings[match.away].goalsAgainst += match.homeGoals;
      standings[match.away].goalDifference = standings[match.away].goalsFor - standings[match.away].goalsAgainst;
      
      // Assign points
      if (match.homeGoals > match.awayGoals) {
        standings[match.home].points += 3;
      } else if (match.homeGoals < match.awayGoals) {
        standings[match.away].points += 3;
      } else {
        standings[match.home].points += 1;
        standings[match.away].points += 1;
      }
    }
  });
  
  // Sort standings: points > goal difference > goals for
  const sortedStandings = Object.entries(standings)
    .sort(([, a], [, b]) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      return b.goalsFor - a.goalsFor;
    })
    .map(([team, stats]) => ({ team, ...stats }));
  
  return sortedStandings;
};

// Get qualified teams for knockout phase
export const getQualifiedTeams = (allGroupMatches) => {
  const qualified = {};
  const thirds = [];
  
  Object.keys(allGroupMatches).forEach(group => {
    const standings = calculateGroupStandings(group, allGroupMatches[group]);
    if (standings.length >= 3) {
      qualified[`1${group}`] = standings[0].team;
      qualified[`2${group}`] = standings[1].team;
      thirds.push({ group, team: standings[2].team, ...standings[2] });
    } else if (standings.length >= 2) {
      qualified[`1${group}`] = standings[0].team;
      qualified[`2${group}`] = standings[1].team;
    }
  });

  // Sort thirds to find top 8
  thirds.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    return b.goalsFor - a.goalsFor;
  });

  const bestThirds = thirds.slice(0, 8);

  const slots = [
    { id: '3_ABCDF', allowed: ['A','B','C','D','F'], opponentGroup: 'E' },
    { id: '3_CDFGH', allowed: ['C','D','F','G','H'], opponentGroup: 'I' },
    { id: '3_CEFHI', allowed: ['C','E','F','H','I'], opponentGroup: 'A' },
    { id: '3_EHIJK', allowed: ['E','H','I','J','K'], opponentGroup: 'L' },
    { id: '3_BEFIJ', allowed: ['B','E','F','I','J'], opponentGroup: 'D' },
    { id: '3_AEHIJ', allowed: ['A','E','H','I','J'], opponentGroup: 'G' },
    { id: '3_EFGIJ', allowed: ['E','F','G','I','J'], opponentGroup: 'B' },
    { id: '3_DEIJL', allowed: ['D','E','I','J','L'], opponentGroup: 'K' }
  ];

  // Backtracking to find a valid assignment for the 8 best thirds into the 8 slots
  const assignThirds = (teamIndex, currentAssignment) => {
    if (teamIndex === 8) return currentAssignment;

    const team = bestThirds[teamIndex];
    for (let i = 0; i < slots.length; i++) {
      if (!currentAssignment[slots[i].id]) {
        // Check if valid
        if (slots[i].allowed.includes(team.group) && team.group !== slots[i].opponentGroup) {
          currentAssignment[slots[i].id] = team.team;
          const result = assignThirds(teamIndex + 1, currentAssignment);
          if (result) return result;
          delete currentAssignment[slots[i].id]; // backtrack
        }
      }
    }
    return null; // Should fall back if no valid assignment, but usually at least one exists.
  };

  const thirdAssignments = assignThirds(0, {});
  
  if (thirdAssignments) {
    Object.assign(qualified, thirdAssignments);
  } else {
    // Fallback if strict backtracking fails (just fill them)
    bestThirds.forEach((team, i) => {
      qualified[slots[i].id] = team.team;
    });
  }
  
  return qualified;
};

// Check if all group matches are completed
export const areGroupsComplete = (allGroupMatches) => {
  return Object.values(allGroupMatches).every(matches =>
    matches.every(match => match.played)
  );
};
