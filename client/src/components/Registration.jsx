import { useState } from 'react';
import { User, Mail, Trophy } from 'lucide-react';
import { db, doc, setDoc } from '../lib/firebase';

const Registration = ({ user, onComplete }) => {
  const [formData, setFormData] = useState({
    name: user?.displayName || '',
    nickname: '',
    email: user?.email || ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.name || !formData.nickname || !formData.email) {
        setError('Todos los campos son obligatorios');
        setLoading(false);
        return;
      }

      if (!user?.uid) {
        setError('No se ha detectado una sesión activa.');
        setLoading(false);
        return;
      }

      // Save user to Firestore
      const userProfile = {
        uid: user.uid,
        ...formData,
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'users', user.uid), userProfile);
      
      onComplete(userProfile);
    } catch (err) {
      console.error(err);
      setError('Error al guardar el perfil. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-white/5 border border-white/10 rounded-3xl p-10 max-w-md w-full backdrop-blur-xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-brand-green/20 rounded-2xl flex items-center justify-center">
              <Trophy className="w-8 h-8 text-brand-green" />
            </div>
          </div>
          <h1 className="font-black text-3xl text-white mb-2 uppercase tracking-tighter">
            Casi listo
          </h1>
          <p className="text-white/40 text-sm font-bold uppercase tracking-widest">Completa tu perfil de jugador</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] font-black text-white/20 mb-2 uppercase tracking-widest">
              Nombre Completo
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input
                type="text"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-brand-green/50 transition-all"
                placeholder="Tu nombre"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-white/20 mb-2 uppercase tracking-widest">
              Nickname
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input
                type="text"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-brand-green/50 transition-all"
                placeholder="Tu apodo en el ranking"
                value={formData.nickname}
                onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-white/20 mb-2 uppercase tracking-widest">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input
                type="email"
                disabled
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white/40 cursor-not-allowed"
                value={formData.email}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-xs font-bold">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-green hover:bg-brand-green/90 text-white font-black py-4 rounded-xl shadow-lg shadow-brand-green/20 transition-all hover:scale-[1.02] disabled:opacity-50 uppercase tracking-widest text-sm"
          >
            {loading ? 'Guardando...' : 'Comenzar Predicción'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Registration;
