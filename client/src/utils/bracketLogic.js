// Resolve team placeholders (e.g., "1A", "3B/C/D", "R32-1-winner") to actual team names
export const resolveTeam = (teamPlaceholder, qualifiedTeams) => {
  if (!teamPlaceholder || !qualifiedTeams) return null;
  
  // Check if it's a team placeholder (1A, 2B, etc.)
  const isGroupPos = teamPlaceholder.match(/^\d[A-L]$/);
  // Check if it's a 3rd place placeholder (3B/C/D, 3_ABCDF, etc.)
  const isThirdPlace = teamPlaceholder.startsWith('3');
  // Check if it's a winner placeholder (R32-1-winner)
  const isWinnerPlaceholder = teamPlaceholder.includes('-winner');

  if (isGroupPos || isThirdPlace) {
    return qualifiedTeams[teamPlaceholder] || teamPlaceholder;
  }
  
  if (isWinnerPlaceholder) {
    return teamPlaceholder; // Will be resolved later by match winner
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
