import { useState, useEffect } from 'react';
import { db, collection, onSnapshot, doc } from '../lib/firebase';
import { calculateTotalPoints } from '../utils/scoring';
import { Trophy, Medal, Star } from 'lucide-react';

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Escuchar resultados oficiales
    const unsubResults = onSnapshot(doc(db, "resultados_reales", "oficial"), (doc) => {
      if (doc.exists()) {
        setResults(doc.data());
      }
    });

    // Escuchar todos los usuarios
    const unsubUsers = onSnapshot(collection(db, "usuarios"), (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);
      setLoading(false);
    });

    return () => {
      unsubResults();
      unsubUsers();
    };
  }, []);

  const ranking = users.map(user => ({
    name: user.user.name,
    points: calculateTotalPoints(user.predictions, results),
    champion: user.champion
  })).sort((a, b) => b.points - a.points);

  if (loading) return <div className="text-center p-8 text-navy font-bold">Cargando clasificación...</div>;

  return (
    <div className="card max-w-4xl mx-auto my-8">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
        <Trophy className="text-emerald w-8 h-8" />
        <h2 className="font-outfit text-2xl font-black text-navy uppercase tracking-tight">
          Clasificación <span className="text-vibrant-red">En Tiempo Real</span>
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black border-b border-slate-50">
              <th className="pb-3 pl-2">Pos</th>
              <th className="pb-3">Participante</th>
              <th className="pb-3">Predicción Campeón</th>
              <th className="pb-3 text-right pr-2">Puntos</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {ranking.map((user, index) => (
              <tr key={user.name} className={`group transition-colors ${index === 0 ? 'bg-gold/5' : 'hover:bg-slate-50'}`}>
                <td className="py-4 pl-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    index === 0 ? 'bg-gold text-white shadow-md' : 
                    index === 1 ? 'bg-slate-300 text-white' :
                    index === 2 ? 'bg-orange-400 text-white' : 'text-slate-400'
                  }`}>
                    {index + 1}
                  </div>
                </td>
                <td className="py-4 font-bold text-navy font-outfit uppercase tracking-tight text-sm">
                  {user.name}
                </td>
                <td className="py-4 text-xs text-slate-500 font-medium">
                  {user.champion || '---'}
                </td>
                <td className="py-4 text-right pr-2">
                  <span className={`font-black text-lg ${index === 0 ? 'text-gold' : 'text-navy'}`}>
                    {user.points}
                  </span>
                </td>
              </tr>
            ))}
            {ranking.length === 0 && (
              <tr>
                <td colSpan="4" className="py-8 text-center text-slate-400 italic">
                  Nadie ha enviado su porra todavía. ¡Sé el primero!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
