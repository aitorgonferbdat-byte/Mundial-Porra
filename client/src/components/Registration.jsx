import { useState } from 'react';
import { User, Mail, Trophy } from 'lucide-react';
import { storage } from '../utils/api';

const Registration = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    name: '',
    nickname: '',
    email: ''
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

      // Save user to localStorage
      const user = storage.saveUser(formData);
      onComplete(user);
    } catch (err) {
      setError('Error inesperado. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Trophy className="w-16 h-16 text-gold" />
          </div>
          <h1 className="font-montserrat text-3xl font-bold text-gradient mb-2">
            Mundial Porra 2026
          </h1>
          <p className="text-textMuted">Regístrate para participar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Nombre Completo
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-textMuted" />
              <input
                type="text"
                required
                className="input-field w-full pl-10"
                placeholder="Tu nombre"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Nickname
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-textMuted" />
              <input
                type="text"
                required
                className="input-field w-full pl-10"
                placeholder="Tu nickname único"
                value={formData.nickname}
                onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-textMuted" />
              <input
                type="email"
                required
                className="input-field w-full pl-10"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-gold w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Registrando...' : 'Comenzar Predicción'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Registration;
