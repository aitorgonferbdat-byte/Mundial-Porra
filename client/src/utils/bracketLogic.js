// Resolve team placeholders (e.g., "1A") to actual team names
export const resolveTeam = (teamPlaceholder, qualifiedTeams) => {
  if (!teamPlaceholder || !qualifiedTeams) return null;
  
  // If it's already a team name (not a placeholder), return it
  if (!teamPlaceholder.match(/^\d[A-L]$/) && !teamPlaceholder.startsWith('3_') && !teamPlaceholder.includes('-winner')) {
    return teamPlaceholder;
  }
  
  // Resolve group position (e.g., "1A" or "3_ABCDF")
  if (teamPlaceholder.match(/^\d[A-L]$/) || teamPlaceholder.startsWith('3_')) {
    return qualifiedTeams[teamPlaceholder] || teamPlaceholder;
  }
  
  // Resolve previous round winner (e.g., "R16-1-winner")
  if (teamPlaceholder.includes('-winner')) {
    const matchId = teamPlaceholder.replace('-winner', '');
    return teamPlaceholder; // Will be resolved by the match winner
  }
  
  return teamPlaceholder;
};

// Update knockout bracket with qualified teams
export const updateBracketWithQualifiedTeams = (bracket, qualifiedTeams) => {
  const updatedBracket = JSON.parse(JSON.stringify(bracket));
  
  // Update Round of 32 with group qualifiers
  updatedBracket.roundOf32.forEach(match => {
    match.homeTeam = resolveTeam(match.home, qualifiedTeams);
    match.awayTeam = resolveTeam(match.away, qualifiedTeams);
  });
  
  return updatedBracket;
};

// Determine match winner
export const determineWinner = (match) => {
  if (!match.played || match.homeGoals === null || match.awayGoals === null) {
    return null;
  }
  
  if (match.homeGoals > match.awayGoals) {
    return match.homeTeam;
  } else if (match.homeGoals < match.awayGoals) {
    return match.awayTeam;
  } else {
    // Draw - check penalties
    return match.penalties;
  }
};

// Advance winners through the bracket
export const advanceWinners = (bracket) => {
  const updatedBracket = JSON.parse(JSON.stringify(bracket));
  
  // Process Round of 32
  updatedBracket.roundOf32.forEach(match => {
    const winner = determineWinner(match);
    if (winner) {
      match.winner = winner;
      updatedBracket.roundOf16.forEach(nextMatch => {
        if (nextMatch.home.replace('-winner', '') === match.id) nextMatch.homeTeam = winner;
        if (nextMatch.away.replace('-winner', '') === match.id) nextMatch.awayTeam = winner;
      });
    }
  });

  // Process Round of 16
  updatedBracket.roundOf16.forEach(match => {
    const winner = determineWinner(match);
    if (winner) {
      match.winner = winner;
      updatedBracket.quarterFinals.forEach(nextMatch => {
        if (nextMatch.home.replace('-winner', '') === match.id) nextMatch.homeTeam = winner;
        if (nextMatch.away.replace('-winner', '') === match.id) nextMatch.awayTeam = winner;
      });
    }
  });
  
  // Process Quarter Finals
  updatedBracket.quarterFinals.forEach(match => {
    const winner = determineWinner(match);
    if (winner) {
      match.winner = winner;
      updatedBracket.semiFinals.forEach(nextMatch => {
        if (nextMatch.home.replace('-winner', '') === match.id) nextMatch.homeTeam = winner;
        if (nextMatch.away.replace('-winner', '') === match.id) nextMatch.awayTeam = winner;
      });
    }
  });
  
  // Process Semi Finals
  updatedBracket.semiFinals.forEach(match => {
    const winner = determineWinner(match);
    if (winner) {
      match.winner = winner;
      updatedBracket.final.forEach(nextMatch => {
        if (nextMatch.home.replace('-winner', '') === match.id) nextMatch.homeTeam = winner;
        if (nextMatch.away.replace('-winner', '') === match.id) nextMatch.awayTeam = winner;
      });
    }
  });
  
  // Process Final
  updatedBracket.final.forEach(match => {
    const winner = determineWinner(match);
    if (winner) {
      match.winner = winner;
    }
  });
  
  return updatedBracket;
};

// Check if bracket is complete
export const isBracketComplete = (bracket) => {
  return bracket.final[0].winner !== null;
};

// Get champion and runner-up
export const getFinalists = (bracket) => {
  if (!isBracketComplete(bracket)) {
    return { champion: null, runnerUp: null };
  }
  
  const final = bracket.final[0];
  const champion = final.winner;
  const runnerUp = final.homeTeam === champion ? final.awayTeam : final.homeTeam;
  
  return { champion, runnerUp };
};
