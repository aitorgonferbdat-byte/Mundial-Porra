/**
 * Calculates the score for a single match prediction
 * @param {Object} prediction - { homeGoals: number, awayGoals: number }
 * @param {Object} result - { homeGoals: number, awayGoals: number }
 * @returns {number} points (3 for exact, 1 for trend, 0 otherwise)
 */
export const calculateMatchScore = (prediction, result) => {
  if (!prediction || !result || prediction.homeGoals === null || prediction.awayGoals === null || 
      result.homeGoals === null || result.awayGoals === null) {
    return 0;
  }

  const pHome = parseInt(prediction.homeGoals);
  const pAway = parseInt(prediction.awayGoals);
  const rHome = parseInt(result.homeGoals);
  const rAway = parseInt(result.awayGoals);

  // Exact match
  if (pHome === rHome && pAway === rAway) {
    return 3;
  }

  // Trend (Winner or Draw)
  const pTrend = pHome > pAway ? 1 : (pHome < pAway ? -1 : 0);
  const rTrend = rHome > rAway ? 1 : (rHome < rAway ? -1 : 0);

  if (pTrend === rTrend) {
    return 1;
  }

  return 0;
};

/**
 * Calculates total points for a user's entire prediction set
 * @param {Object} userPredictions - { groups: { A: [matches], ... }, knockout: { roundOf32: [], ... } }
 * @param {Object} officialResults - { matchId: { homeGoals, awayGoals }, ... }
 * @returns {number} totalPoints
 */
export const calculateTotalPoints = (userPredictions, officialResults) => {
  let total = 0;

  if (!userPredictions || !officialResults) return 0;

  // Process groups
  if (userPredictions.groups) {
    Object.values(userPredictions.groups).forEach(matches => {
      matches.forEach(match => {
        const result = officialResults[match.id];
        if (result) {
          total += calculateMatchScore(match, result);
        }
      });
    });
  }

  // Process knockout
  if (userPredictions.knockout) {
    Object.values(userPredictions.knockout).forEach(matches => {
      matches.forEach(match => {
        const result = officialResults[match.id];
        if (result) {
          total += calculateMatchScore(match, result);
        }
      });
    });
  }

  return total;
};
