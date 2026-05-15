import { useState, useEffect } from 'react';
import { TEAMS, GROUP_MATCHES } from '../data/teams';
import { calculateGroupStandings } from '../utils/groupLogic';
import Flag from './Flag';

const GroupPhase = ({ groupMatches, setGroupMatches, onNext }) => {
  const [activeGroup, setActiveGroup] = useState('A');
  const groups = Object.keys(TEAMS);

  const updateMatch = (group, matchId, field, value) => {
    const updatedMatches = { ...groupMatches };
    const matchIndex = updatedMatches[group].findIndex(m => m.id === matchId);
    
    updatedMatches[group][matchIndex][field] = value === '' ? null : parseInt(value);
    
    // Check if match is complete
    const match = updatedMatches[group][matchIndex];
    match.played = match.homeGoals !== null && match.awayGoals !== null;
    
    setGroupMatches(updatedMatches);
  };

  const getStandings = (group) => {
    return calculateGroupStandings(group, groupMatches[group]);
  };

  const isGroupComplete = (group) => {
    return groupMatches[group].every(m => m.played);
  };

  const areAllGroupsComplete = () => {
    return groups.every(group => isGroupComplete(group));
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="font-montserrat text-3xl font-bold text-text mb-2">
            Fase de Grupos
          </h1>
          <p className="text-textMuted">
            Introduce los resultados de los partidos. Las tablas se actualizarán automáticamente.
          </p>
        </div>

        {/* Group Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {groups.map(group => (
            <button
              key={group}
              onClick={() => setActiveGroup(group)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeGroup === group
                  ? 'bg-accent text-background'
                  : 'bg-surfaceLight text-text hover:bg-surface'
              }`}
            >
              Grupo {group}
            </button>
          ))}
        </div>

        {/* Group Content */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Matches */}
          <div className="card">
            <h2 className="font-montserrat text-xl font-bold text-text mb-4">
              Partidos - Grupo {activeGroup}
            </h2>
            <div className="space-y-4">
              {groupMatches[activeGroup].map(match => (
                <div
                  key={match.id}
                  className="bg-surfaceLight rounded-lg p-4 border border-surfaceLight"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 text-right flex items-center justify-end gap-2">
                      <span className="font-medium text-text">{match.home}</span>
                      <Flag team={match.home} />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max="99"
                        className="w-12 h-10 bg-background border border-surfaceLight rounded text-center text-text font-bold"
                        value={match.homeGoals ?? ''}
                        onChange={(e) => updateMatch(activeGroup, match.id, 'homeGoals', e.target.value)}
                      />
                      <span className="text-textMuted font-bold">-</span>
                      <input
                        type="number"
                        min="0"
                        max="99"
                        className="w-12 h-10 bg-background border border-surfaceLight rounded text-center text-text font-bold"
                        value={match.awayGoals ?? ''}
                        onChange={(e) => updateMatch(activeGroup, match.id, 'awayGoals', e.target.value)}
                      />
                    </div>
                    <div className="flex-1 text-left flex items-center gap-2">
                      <Flag team={match.away} />
                      <span className="font-medium text-text">{match.away}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Standings */}
          <div className="card">
            <h2 className="font-montserrat text-xl font-bold text-text mb-4">
              Clasificación - Grupo {activeGroup}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surfaceLight">
                    <th className="text-left py-3 px-2 text-textMuted font-medium text-sm">Pos</th>
                    <th className="text-left py-3 px-2 text-textMuted font-medium text-sm">Selección</th>
                    <th className="text-center py-3 px-2 text-textMuted font-medium text-sm">PJ</th>
                    <th className="text-center py-3 px-2 text-textMuted font-medium text-sm">PTS</th>
                    <th className="text-center py-3 px-2 text-textMuted font-medium text-sm">DG</th>
                  </tr>
                </thead>
                <tbody>
                  {getStandings(activeGroup).map((team, index) => (
                    <tr
                      key={team.team}
                      className={`border-b border-surfaceLight ${
                        index < 2 ? 'bg-accent/10' : ''
                      }`}
                    >
                      <td className="py-3 px-2">
                        <span
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                            index === 0 ? 'bg-gold text-background' :
                            index === 1 ? 'bg-surfaceLight text-accent' :
                            'bg-surfaceLight text-textMuted'
                          }`}
                        >
                          {index + 1}
                        </span>
                      </td>
                      <td className="py-3 px-2 font-medium text-text">
                        <span className="inline-flex items-center gap-2">
                          <Flag team={team.team} />
                          {team.team}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-center text-text">{team.played}</td>
                      <td className="py-3 px-2 text-center font-bold text-accent">{team.points}</td>
                      <td className="py-3 px-2 text-center text-text">
                        {team.goalDifference > 0 ? '+' : ''}{team.goalDifference}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 p-3 bg-surfaceLight rounded-lg">
              <p className="text-sm text-textMuted">
                <span className="text-gold font-bold">★</span> Clasificados a Dieciseisavos
              </p>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mt-8 card">
          <div className="flex items-center justify-between mb-4">
            <span className="text-textMuted">Progreso de Fase de Grupos</span>
            <span className="font-bold text-accent">
              {groups.filter(g => isGroupComplete(g)).length} / {groups.length} grupos completados
            </span>
          </div>
          <div className="w-full bg-surfaceLight rounded-full h-2">
            <div
              className="bg-accent h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(groups.filter(g => isGroupComplete(g)).length / groups.length) * 100}%`
              }}
            />
          </div>
        </div>

        {/* Next Button */}
        {areAllGroupsComplete() && (
          <div className="mt-8 text-center">
            <button
              onClick={onNext}
              className="btn-gold text-lg px-12 py-4"
            >
              Continuar a Eliminatorias →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupPhase;
