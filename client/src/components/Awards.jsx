import { useState } from 'react';
import { User, Shield, Trophy, Target, AlertTriangle, Skull, Users } from 'lucide-react';
import { TEAMS } from '../data/teams';

const Awards = ({ onNext, onBack }) => {
  const [awards, setAwards] = useState({
    revelacion: '',
    decepcion: '',
    goleador: '',
    asistente: '',
    portero: '',
    mejorJugador: '',
    seleccionSorpresa: '',
    seleccionDecepcion: '',
    jugadorSucio: '',
    equipoSucio: ''
  });

  const allTeams = Object.values(TEAMS).flat().sort();

  const handleChange = (field, value) => {
    setAwards(prev => ({ ...prev, [field]: value }));
  };

  const isComplete = Object.values(awards).every(val => val.trim() !== '');

  const categories = [
    { id: 'mejorJugador', label: 'Mejor Jugador (MVP)', icon: <Trophy className="w-5 h-5 text-gold" />, placeholder: 'Nombre del jugador', type: 'text' },
    { id: 'goleador', label: 'Máximo Goleador', icon: <Target className="w-5 h-5 text-red-400" />, placeholder: 'Nombre del goleador', type: 'text' },
    { id: 'asistente', label: 'Máximo Asistente', icon: <Users className="w-5 h-5 text-blue-400" />, placeholder: 'Nombre del asistente', type: 'text' },
    { id: 'portero', label: 'Mejor Portero', icon: <Shield className="w-5 h-5 text-brand-green" />, placeholder: 'Nombre del portero', type: 'text' },
    { id: 'revelacion', label: 'Jugador Revelación', icon: <User className="w-5 h-5 text-emerald" />, placeholder: 'Nombre del jugador', type: 'text' },
    { id: 'decepcion', label: 'Jugador Decepción', icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />, placeholder: 'Nombre del jugador', type: 'text' },
    { id: 'jugadorSucio', label: 'Jugador más sucio', icon: <Skull className="w-5 h-5 text-purple-400" />, placeholder: 'Nombre del jugador', type: 'text' },
    { id: 'seleccionSorpresa', label: 'Selección Sorpresa', icon: <Trophy className="w-5 h-5 text-emerald" />, type: 'select' },
    { id: 'seleccionDecepcion', label: 'Selección Decepción', icon: <AlertTriangle className="w-5 h-5 text-red-500" />, type: 'select' },
    { id: 'equipoSucio', label: 'Equipo más sucio', icon: <Skull className="w-5 h-5 text-purple-600" />, type: 'select' },
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter">
          Premios Individuales <span className="text-brand-green">& Colectivos</span>
        </h2>
        <p className="text-white/40 text-sm font-bold uppercase tracking-[0.2em]">Completa tu predicción de los galardones del Mundial</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 transition-all hover:border-brand-green/30 group">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                {cat.icon}
              </div>
              <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">{cat.label}</label>
            </div>

            {cat.type === 'text' ? (
              <input
                type="text"
                value={awards[cat.id]}
                onChange={(e) => handleChange(cat.id, e.target.value)}
                placeholder={cat.placeholder}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder-white/10 focus:outline-none focus:border-brand-green/50 transition-all text-sm font-bold"
              />
            ) : (
              <select
                value={awards[cat.id]}
                onChange={(e) => handleChange(cat.id, e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-white focus:outline-none focus:border-brand-green/50 transition-all text-sm font-bold appearance-none cursor-pointer"
              >
                <option value="">Selecciona una selección</option>
                {allTeams.map(team => (
                  <option key={team} value={team} className="bg-pitch-dark text-white">{team}</option>
                ))}
              </select>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-6">
        <button
          onClick={onBack}
          className="flex-1 bg-white/5 hover:bg-white/10 text-white/40 font-black py-4 rounded-xl transition-all uppercase tracking-widest text-xs"
        >
          Atrás
        </button>
        <button
          onClick={() => onNext(awards)}
          className="flex-[2] bg-brand-green hover:bg-brand-green/90 text-white font-black py-4 rounded-xl shadow-lg shadow-brand-green/20 transition-all hover:scale-[1.02] disabled:opacity-30 uppercase tracking-widest text-xs"
        >
          Continuar al Resumen
        </button>
      </div>
    </div>
  );
};

export default Awards;
