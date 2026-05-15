import { useState, useEffect } from 'react';
import { KNOCKOUT_BRACKET } from '../data/teams';
import { getQualifiedTeams, areGroupsComplete } from '../utils/groupLogic';
import {
  updateBracketWithQualifiedTeams,
  advanceWinners,
  determineWinner,
  isBracketComplete,
  getFinalists
} from '../utils/bracketLogic';
import Flag from './Flag';

const Bracket = ({ groupMatches, bracket, setBracket, onSubmit }) => {
  const [qualifiedTeams, setQualifiedTeams] = useState({});
  const [currentRound, setCurrentRound] = useState('roundOf16');

  useEffect(() => {
    if (areGroupsComplete(groupMatches)) {
      const qualified = getQualifiedTeams(groupMatches);
      setQualifiedTeams(qualified);
      
      const updatedBracket = updateBracketWithQualifiedTeams(KNOCKOUT_BRACKET, qualified);
      setBracket(updatedBracket);
    }
  }, [groupMatches]);

  const updateMatch = (round, matchId, field, value) => {
    const updatedBracket = { ...bracket };
    const matchIndex = updatedBracket[round].findIndex(m => m.id === matchId);
    
    if (field === 'penalties') {
      updatedBracket[round][matchIndex].penalties = value;
    } else {
      updatedBracket[round][matchIndex][field] = value === '' ? null : parseInt(value);
    }
    
    // Check if match is complete
    const match = updatedBracket[round][matchIndex];
    match.played = match.homeGoals !== null && match.awayGoals !== null;
    
    // Auto-advance winners
    const advancedBracket = advanceWinners(updatedBracket);
    setBracket(advancedBracket);
  };

  const MatchCard = ({ match, round }) => {
    const winner = determineWinner(match);
    const isComplete = match.played && (match.homeGoals !== match.awayGoals || match.penalties);
    
    return (
      <div className="bg-surfaceLight rounded-lg p-4 border border-surfaceLight min-w-[200px]">
        <div className="text-xs text-textMuted mb-2 font-medium">
          {round === 'roundOf32' ? 'Dieciseisavos' :
           round === 'roundOf16' ? 'Octavos' :
           round === 'quarterFinals' ? 'Cuartos' :
           round === 'semiFinals' ? 'Semifinales' : 'Final'}
        </div>
        
        <div className="space-y-2">
          {/* Home Team */}
          <div className="flex items-center justify-between gap-2">
            <Flag team={match.homeTeam} />
            <span className={`text-sm font-medium flex-1 ${
              winner === match.homeTeam ? 'text-accent' : 'text-text'
            }`}>
              {match.homeTeam || '---'}
            </span>
            <input
              type="number"
              min="0"
              max="99"
              className="w-10 h-8 bg-background border border-surfaceLight rounded text-center text-text font-bold text-sm"
              value={match.homeGoals ?? ''}
              onChange={(e) => updateMatch(round, match.id, 'homeGoals', e.target.value)}
              disabled={!match.homeTeam}
            />
          </div>
          
          {/* Away Team */}
          <div className="flex items-center justify-between gap-2">
            <Flag team={match.awayTeam} />
            <span className={`text-sm font-medium flex-1 ${
              winner === match.awayTeam ? 'text-accent' : 'text-text'
            }`}>
              {match.awayTeam || '---'}
            </span>
            <input
              type="number"
              min="0"
              max="99"
              className="w-10 h-8 bg-background border border-surfaceLight rounded text-center text-text font-bold text-sm"
              value={match.awayGoals ?? ''}
              onChange={(e) => updateMatch(round, match.id, 'awayGoals', e.target.value)}
              disabled={!match.awayTeam}
            />
          </div>
          
          {/* Penalties for draws */}
          {match.played && match.homeGoals === match.awayGoals && (
            <div className="mt-2 pt-2 border-t border-surface">
              <label className="text-xs text-textMuted block mb-1">Ganador por penaltis:</label>
              <select
                className="w-full bg-background border border-surfaceLight rounded px-2 py-1 text-text text-sm"
                value={match.penalties || ''}
                onChange={(e) => updateMatch(round, match.id, 'penalties', e.target.value)}
              >
                <option value="">Seleccionar...</option>
                <option value={match.homeTeam}>{match.homeTeam}</option>
                <option value={match.awayTeam}>{match.awayTeam}</option>
              </select>
            </div>
          )}
          
          {winner && (
            <div className="mt-2 pt-2 border-t border-accent/30">
              <div className="text-xs text-accent font-bold">
                ★ {winner}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const BracketRound = ({ title, matches, round }) => (
    <div className="flex flex-col gap-4">
      <h3 className="font-montserrat text-lg font-bold text-text text-center">{title}</h3>
      <div className="flex flex-col gap-4">
        {matches.map(match => (
          <MatchCard key={match.id} match={match} round={round} />
        ))}
      </div>
    </div>
  );

  const finalists = getFinalists(bracket);
  const complete = isBracketComplete(bracket);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="font-montserrat text-3xl font-bold text-gradient mb-2">
            Fase de Eliminatorias
          </h1>
          <p className="text-textMuted">
            Introduce los resultados. Los ganadores avanzarán automáticamente.
          </p>
        </div>

        {/* Bracket Visualization */}
        <div className="card overflow-x-auto">
          <div className="flex gap-8 min-w-max p-6">
            {/* Round of 32 */}
            <BracketRound
              title="Dieciseisavos"
              matches={bracket.roundOf32}
              round="roundOf32"
            />
            
            {/* Connector Line */}
            <div className="hidden lg:flex items-center">
              <div className="w-8 h-0.5 bg-surfaceLight" />
            </div>

            {/* Round of 16 */}
            <BracketRound
              title="Octavos de Final"
              matches={bracket.roundOf16}
              round="roundOf16"
            />
            
            {/* Connector Line */}
            <div className="hidden lg:flex items-center">
              <div className="w-8 h-0.5 bg-surfaceLight" />
            </div>
            
            {/* Quarter Finals */}
            <BracketRound
              title="Cuartos de Final"
              matches={bracket.quarterFinals}
              round="quarterFinals"
            />
            
            {/* Connector Line */}
            <div className="hidden lg:flex items-center">
              <div className="w-8 h-0.5 bg-surfaceLight" />
            </div>
            
            {/* Semi Finals */}
            <BracketRound
              title="Semifinales"
              matches={bracket.semiFinals}
              round="semiFinals"
            />
            
            {/* Connector Line */}
            <div className="hidden lg:flex items-center">
              <div className="w-8 h-0.5 bg-gold" />
            </div>
            
            {/* Final */}
            <div className="flex flex-col gap-4">
              <h3 className="font-montserrat text-lg font-bold text-gold text-center">Gran Final</h3>
              <div className="bg-gold/10 rounded-lg p-4 border border-gold/30 min-w-[200px]">
                {bracket.final.map(match => (
                  <MatchCard key={match.id} match={match} round="final" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Final Result Display */}
        {complete && (
          <div className="mt-8 card bg-gradient-to-r from-gold/20 to-accent/20 border-gold/50">
            <h2 className="font-montserrat text-2xl font-bold text-text mb-4 text-center">
              🏆 Tu Predicción Final
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="text-center p-6 bg-gold/10 rounded-lg">
                <div className="flex justify-center mb-2">
                  <Flag team={finalists.champion} className="w-16 h-10" />
                </div>
                <div className="text-textMuted text-sm mb-1">Campeón</div>
                <div className="font-montserrat text-2xl font-bold text-gold">
                  {finalists.champion}
                </div>
              </div>
              <div className="text-center p-6 bg-surfaceLight rounded-lg">
                <div className="flex justify-center mb-2">
                  <Flag team={finalists.runnerUp} className="w-16 h-10" />
                </div>
                <div className="text-textMuted text-sm mb-1">Subcampeón</div>
                <div className="font-montserrat text-2xl font-bold text-accent">
                  {finalists.runnerUp}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        {complete && (
          <div className="mt-8 text-center">
            <button
              onClick={onSubmit}
              className="btn-gold text-lg px-12 py-4"
            >
              Enviar Porra Definitiva ✓
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bracket;
