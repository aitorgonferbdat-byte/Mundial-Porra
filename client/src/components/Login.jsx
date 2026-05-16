import { useState } from 'react';
import { auth, googleProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '../lib/firebase';

const Login = ({ onLogin, onBack }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      onLogin(result.user);
    } catch (err) {
      console.error(err);
      setError('Error al iniciar sesión con Google.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegistering) {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        onLogin(result.user);
      } else {
        const result = await signInWithEmailAndPassword(auth, email, password);
        onLogin(result.user);
      }
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Email o contraseña incorrectos.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('El email ya está en uso.');
      } else if (err.code === 'auth/weak-password') {
        setError('La contraseña debe tener al menos 6 caracteres.');
      } else {
        setError('Error en la autenticación. Inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex bg-black overflow-hidden">
      {/* Left Side - Green Brand */}
      <div className="hidden lg:flex w-1/2 bg-emerald items-center justify-center relative">
        <div className="flex flex-col items-center">
          <img 
            src="/logo.png" 
            alt="La Porrita" 
            className="w-48 h-48 object-contain drop-shadow-2xl"
            onError={(e) => {
              e.target.src = "https://cdn-icons-png.flaticon.com/512/5329/5329948.png";
            }}
          />
          <span className="text-white/40 text-xs font-black mt-8 tracking-widest uppercase">v0.5.02</span>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-10 relative">
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="absolute top-8 left-8 text-white/40 hover:text-white transition-colors flex items-center gap-2 text-sm font-bold uppercase tracking-widest"
        >
          ← Volver
        </button>

        {/* Language Selectors */}
        <div className="absolute top-8 right-8 flex items-center gap-4">
          <button className="text-white/40 hover:text-white"><i className="fas fa-sun"></i></button>
          <img src="https://flagcdn.com/w20/gb.png" alt="English" className="w-5 h-3.5 object-cover rounded-sm opacity-40 hover:opacity-100 cursor-pointer transition-opacity" />
          <img src="https://flagcdn.com/w20/es.png" alt="Spanish" className="w-5 h-3.5 object-cover rounded-sm border border-emerald/50" />
        </div>

        <div className="w-full max-w-sm">
          <h2 className="text-3xl font-black text-white mb-8 text-center">
            {isRegistering ? 'Crear cuenta' : 'Iniciar sesión'}
          </h2>

          {/* Google Login */}
          <button 
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-3 px-6 rounded-xl border border-white/10 flex items-center justify-center gap-3 hover:bg-white/5 transition-all mb-6 disabled:opacity-50"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/action/google.svg" alt="Google" className="w-5 h-5" />
            <span className="text-sm font-bold text-white/80">Continuar con Google</span>
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="h-[1px] flex-1 bg-white/10"></div>
            <span className="text-white/20 text-xs font-bold uppercase">o</span>
            <div className="h-[1px] flex-1 bg-white/10"></div>
          </div>

          <form onSubmit={handleEmailAuth}>
            {/* Email Field */}
            <div className="mb-4">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20">
                  <i className="far fa-envelope"></i>
                </span>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Correo electrónico" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-brand-green/50 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-6">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20">
                  <i className="fas fa-lock"></i>
                </span>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-12 text-white placeholder-white/20 focus:outline-none focus:border-brand-green/50 transition-all"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/40 transition-colors"
                >
                  <i className={`far ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-xs font-bold mb-4 bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                {error}
              </p>
            )}

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-brand-green hover:bg-brand-green/90 text-white font-black py-4 rounded-xl shadow-lg shadow-brand-green/20 transition-all hover:scale-[1.02] mb-6 disabled:opacity-50"
            >
              {loading ? 'Cargando...' : (isRegistering ? 'Crear cuenta' : 'Iniciar sesión')}
            </button>
          </form>

          {/* Extra Links */}
          <div className="flex flex-col items-center gap-4">
            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-xs font-bold text-white/40 hover:text-white transition-colors uppercase tracking-widest"
            >
              {isRegistering ? 'Ya tengo cuenta - Entrar' : 'Crear cuenta'}
            </button>
            {!isRegistering && (
              <button className="text-xs font-bold text-white/20 hover:text-white transition-colors">¿Olvidaste tu contraseña?</button>
            )}
          </div>

          <p className="mt-12 text-center text-[10px] text-white/20 leading-relaxed">
            Al usar esta app, aceptas nuestra <span className="underline cursor-pointer">Política de Privacidad</span> y <br />
            <span className="underline cursor-pointer">Términos de Servicio</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
