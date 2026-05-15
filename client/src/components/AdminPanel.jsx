import { useState, useEffect } from 'react';
import { db, doc, setDoc, getDoc } from '../lib/firebase';
import { GROUP_MATCHES, KNOCKOUT_BRACKET } from '../data/teams';
import { Lock, Save, AlertTriangle } from 'lucide-react';

const AdminPanel = () => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const ADMIN_PASSWORD = "Mundial2026Admin";

  useEffect(() => {
    if (isAuthenticated) {
      loadOfficialResults();
    }
  }, [isAuthenticated]);

  const loadOfficialResults = async () => {
    const docRef = doc(db, "resultados_reales", "oficial");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setResults(docSnap.data());
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setMessage('');
    } else {
      setMessage('Contraseña incorrecta');
    }
  };

  const handleResultChange = (matchId, field, value) => {
    setResults(prev => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [field]: value === '' ? null : parseInt(value)
      }
    }));
  };

  const saveResults = async () => {
    setLoading(true);
    try {
      await setDoc(doc(db, "resultados_reales", "oficial"), results);
      setMessage('✅ Resultados actualizados correctamente');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="card max-w-md mx-auto mt-20 p-8 border-2 border-slate-100 shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="bg-navy p-4 rounded-full shadow-lg">
            <Lock className="text-white w-8 h-8" />
          </div>
        </div>
        <h2 className="text-center font-outfit text-2xl font-black text-navy uppercase mb-6 tracking-tight">Panel de <span className="text-vibrant-red">Control</span></h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            placeholder="Contraseña de Administrador"
            className="input-field w-full text-center"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="w-full btn-primary bg-navy hover:bg-navy/90">
            Acceder al Sistema
          </button>
          {message && <p className="text-vibrant-red text-center text-xs font-bold uppercase">{message}</p>}
        </form>
      </div>
    );
  }

  // List all matches for administration
  const allMatches = [];
  Object.entries(GROUP_MATCHES).forEach(([group, matches]) => {
    matches.forEach(m => allMatches.push({ ...m, title: `Grupo ${group}` }));
  });
  
  // Add knockout matches
  Object.entries(KNOCKOUT_BRACKET).forEach(([round, matches]) => {
    matches.forEach(m => allMatches.push({ ...m, title: round.toUpperCase() }));
  });

  return (
    <div className="card max-w-6xl mx-auto my-12 p-8 border-2 border-navy/10">
      <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-6">
        <div>
          <h2 className="font-outfit text-3xl font-black text-navy uppercase tracking-tighter">Administrar <span className="text-vibrant-red">Resultados</span></h2>
          <p className="text-slate-400 text-sm font-medium">Introduce los marcadores oficiales de la FIFA</p>
        </div>
        <button 
          onClick={saveResults}
          disabled={loading}
          className="flex items-center gap-2 bg-emerald hover:bg-emerald/90 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {loading ? 'Guardando...' : 'Publicar Resultados'}
        </button>
      </div>

      {message && (
        <div className="mb-6 p-4 bg-emerald/10 border border-emerald/20 text-emerald text-center font-bold rounded-xl animate-pulse">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-[600px] overflow-y-auto pr-2 custom-scrollbar">
        {allMatches.map(match => (
          <div key={match.id} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">{match.title}</div>
            <div className="flex items-center gap-4">
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-navy truncate max-w-[80px]">{match.home}</span>
                  <input
                    type="number"
                    className="w-12 h-10 bg-white border border-slate-200 rounded-lg text-center font-black text-navy shadow-sm focus:border-vibrant-red focus:ring-0"
                    value={results[match.id]?.homeGoals ?? ''}
                    onChange={(e) => handleResultChange(match.id, 'homeGoals', e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-navy truncate max-w-[80px]">{match.away}</span>
                  <input
                    type="number"
                    className="w-12 h-10 bg-white border border-slate-200 rounded-lg text-center font-black text-navy shadow-sm focus:border-vibrant-red focus:ring-0"
                    value={results[match.id]?.awayGoals ?? ''}
                    onChange={(e) => handleResultChange(match.id, 'awayGoals', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
