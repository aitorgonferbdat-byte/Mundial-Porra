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

  const formatTeamName = (name) => {
    if (!name) return '---';
    // If it's a resolved country name, just return it
    if (!name.match(/^\d[A-L]$/) && !name.startsWith('3') && !name.includes('-winner')) {
      return name;
    }
    // Format placeholders
    if (name.startsWith('3')) {
      const groups = name.includes('_') ? name.split('_')[1] : name.substring(1);
      return `3º ${groups}`;
    }
    if (name.match(/^\d[A-L]$/)) {
      const pos = name[0] === '1' ? '1º' : '2º';
      return `${pos} Grupo ${name[1]}`;
    }
    if (name.includes('-winner')) {
      return `Ganador ${name.replace('-winner', '').replace('R32-', 'M').replace('R16-', 'O').replace('QF-', 'C').replace('SF-', 'S')}`;
    }
    return name;
  };

  const MatchCard = ({ match, round }) => {
    const winner = determineWinner(match);
    
    return (
      <div className={`bg-white rounded-xl p-3 border-2 transition-all duration-200 shadow-sm w-full ${
        winner ? 'border-emerald/30 shadow-md' : 'border-slate-100 hover:border-slate-300'
      }`}>
        <div className="flex justify-between items-center mb-2 px-1">
          <span className="text-[9px] text-navy/40 font-black uppercase tracking-widest">
            {round === 'roundOf32' ? 'R32' :
             round === 'roundOf16' ? 'R16' :
             round === 'quarterFinals' ? 'Cuartos' :
             round === 'semiFinals' ? 'Semis' : 'Final'}
          </span>
          {winner && (
            <span className="text-[9px] text-emerald font-black uppercase">✓ OK</span>
          )}
        </div>
        
        <div className="space-y-2">
          {/* Home Team */}
          <div className="flex items-center gap-3">
            <div className="w-8 flex justify-center">
              <Flag team={match.homeTeam} className="w-6 h-4 shadow-sm rounded-sm" />
            </div>
            <span className={`text-xs font-bold flex-1 truncate ${
              winner === match.homeTeam ? 'text-emerald' : 'text-navy'
            }`}>
              {formatTeamName(match.homeTeam || match.home)}
            </span>
            <input
              type="number"
              min="0"
              className="w-10 h-8 bg-slate-50 border border-slate-200 rounded-lg text-center text-navy font-bold text-xs focus:border-navy focus:ring-0 transition-colors"
              value={match.homeGoals ?? ''}
              onChange={(e) => updateMatch(round, match.id, 'homeGoals', e.target.value)}
              disabled={!match.homeTeam}
            />
          </div>
          
          {/* Away Team */}
          <div className="flex items-center gap-3">
            <div className="w-8 flex justify-center">
              <Flag team={match.awayTeam} className="w-6 h-4 shadow-sm rounded-sm" />
            </div>
            <span className={`text-xs font-bold flex-1 truncate ${
              winner === match.awayTeam ? 'text-emerald' : 'text-navy'
            }`}>
              {formatTeamName(match.awayTeam || match.away)}
            </span>
            <input
              type="number"
              min="0"
              className="w-10 h-8 bg-slate-50 border border-slate-200 rounded-lg text-center text-navy font-bold text-xs focus:border-navy focus:ring-0 transition-colors"
              value={match.awayGoals ?? ''}
              onChange={(e) => updateMatch(round, match.id, 'awayGoals', e.target.value)}
              disabled={!match.awayTeam}
            />
          </div>
          
          {/* Penalties for draws */}
          {match.played && match.homeGoals === match.awayGoals && (
            <div className="mt-2 pt-2 border-t border-slate-100">
              <select
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-navy text-[10px] font-bold focus:border-navy"
                value={match.penalties || ''}
                onChange={(e) => updateMatch(round, match.id, 'penalties', e.target.value)}
              >
                <option value="">Ganador penaltis...</option>
                <option value={match.homeTeam}>{match.homeTeam}</option>
                <option value={match.awayTeam}>{match.awayTeam}</option>
              </select>
            </div>
          )}
        </div>
      </div>
    );
  };

  const BracketRound = ({ title, matches, round, isFinal = false }) => (
    <div className="flex flex-col gap-6 min-w-[240px] flex-1">
      <h3 className={`font-outfit text-xs font-black text-center uppercase tracking-[0.2em] py-2 rounded-lg shrink-0 shadow-sm ${
        isFinal ? 'text-white bg-vibrant-red' : 'text-navy bg-white border border-slate-200'
      }`}>
        {title}
      </h3>
      <div className="flex flex-col flex-grow justify-around gap-4 relative">
        {matches.map((match, index) => (
          <div key={match.id} className="flex flex-col justify-center py-2">
            <MatchCard match={match} round={round} />
          </div>
        ))}
      </div>
    </div>
  );

  const finalists = getFinalists(bracket);
  const complete = isBracketComplete(bracket);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-8 text-center md:text-left">
          <h1 className="font-outfit text-4xl font-black text-navy mb-2 uppercase tracking-tight">
            Fase de <span className="text-vibrant-red">Eliminatorias</span>
          </h1>
          <p className="text-slate-500 font-medium">
            Completa los resultados para avanzar en el torneo.
          </p>
        </div>

        {/* Bracket Visualization */}
        <div className="bg-slate-100/50 rounded-3xl p-4 md:p-8 overflow-x-auto border border-slate-200 shadow-inner">
          <div className="flex gap-6 md:gap-12 min-w-max items-stretch">
            <BracketRound
              title="Dieciseisavos"
              matches={bracket.roundOf32}
              round="roundOf32"
            />
            
            <BracketRound
              title="Octavos"
              matches={bracket.roundOf16}
              round="roundOf16"
            />
            
            <BracketRound
              title="Cuartos"
              matches={bracket.quarterFinals}
              round="quarterFinals"
            />
            
            <BracketRound
              title="Semifinales"
              matches={bracket.semiFinals}
              round="semiFinals"
            />
            
            <BracketRound
              title="Final"
              matches={bracket.final}
              round="final"
              isFinal={true}
            />
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
