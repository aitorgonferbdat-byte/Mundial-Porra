import { useState } from 'react';
import { auth, googleProvider, signInWithPopup, signInWithRedirect, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '../lib/firebase';

const Login = ({ onLogin, onBack }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Autenticación con Google
  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      // Intentamos con Popup primero
      await signInWithPopup(auth, googleProvider);
      // El resultado lo maneja onAuthStateChanged en App.jsx
    } catch (err) {
      console.error("Google Popup Error:", err);
      
      if (err.code === 'auth/popup-blocked' || err.code === 'auth/cancelled-popup-request') {
        // Si el popup está bloqueado, probamos con Redireccionamiento
        try {
          await signInWithRedirect(auth, googleProvider);
        } catch (redirErr) {
          setError('Error al intentar redireccionar a Google.');
        }
      } else if (err.code === 'auth/unauthorized-domain') {
        setError('Error: Dominio no autorizado en Firebase. Añade este dominio en la consola.');
      } else {
        setError('Error con Google. Prueba de nuevo o usa Correo.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Registro e Inicio de Sesión Tradicional
  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validación básica de contraseña
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      if (isRegistering) {
        // Crear Cuenta
        const result = await createUserWithEmailAndPassword(auth, email, password);
        onLogin(result.user);
      } else {
        // Iniciar Sesión
        const result = await signInWithEmailAndPassword(auth, email, password);
        onLogin(result.user);
      }
    } catch (err) {
      console.error("Email Auth Error:", err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Correo o contraseña incorrectos.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Este correo ya está registrado.');
      } else if (err.code === 'auth/invalid-email') {
        setError('El formato del correo no es válido.');
      } else {
        setError('Error de autenticación. Inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex bg-black overflow-hidden">
      {/* Lado Izquierdo - Branding (Verde) */}
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

      {/* Lado Derecho - Formulario (Negro) */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-10 relative">
        {/* Botón Volver */}
        <button 
          onClick={onBack}
          className="absolute top-8 left-8 text-white/40 hover:text-white transition-colors flex items-center gap-2 text-sm font-bold uppercase tracking-widest"
        >
          ← Volver
        </button>

        {/* Selectores de Idioma */}
        <div className="absolute top-8 right-8 flex items-center gap-4">
          <button className="text-white/40 hover:text-white"><i className="fas fa-sun"></i></button>
          <img src="https://flagcdn.com/w20/gb.png" alt="English" className="w-5 h-3.5 object-cover rounded-sm opacity-40 hover:opacity-100 cursor-pointer transition-opacity" />
          <img src="https://flagcdn.com/w20/es.png" alt="Spanish" className="w-5 h-3.5 object-cover rounded-sm border border-emerald/50" />
        </div>

        <div className="w-full max-w-sm">
          <h2 className="text-3xl font-black text-white mb-8 text-center uppercase tracking-tighter">
            {isRegistering ? 'Crear cuenta' : 'Iniciar sesión'}
          </h2>

          {/* Botón Google */}
          <button 
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl border border-white/10 flex items-center justify-center gap-3 hover:bg-white/5 transition-all mb-6 disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="text-sm font-black text-white/80 uppercase tracking-widest">Continuar con Google</span>
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="h-[1px] flex-1 bg-white/10"></div>
            <span className="text-white/20 text-xs font-bold uppercase">o</span>
            <div className="h-[1px] flex-1 bg-white/10"></div>
          </div>

          <form onSubmit={handleEmailAuth}>
            {/* Campo Email */}
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
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-brand-green/50 transition-all font-bold"
                />
              </div>
            </div>

            {/* Campo Contraseña */}
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
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-12 text-white placeholder-white/20 focus:outline-none focus:border-brand-green/50 transition-all font-bold"
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

            {/* Mensaje de Error */}
            {error && (
              <div className="mb-6 bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
                <p className="text-red-400 text-xs font-black uppercase tracking-widest text-center">
                  {error}
                </p>
              </div>
            )}

            {/* Botón Principal */}
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-brand-green hover:bg-brand-green/90 text-white font-black py-4 rounded-xl shadow-lg shadow-brand-green/20 transition-all hover:scale-[1.02] mb-6 disabled:opacity-50 uppercase tracking-widest"
            >
              {loading ? 'Procesando...' : (isRegistering ? 'Registrarse' : 'Iniciar sesión')}
            </button>
          </form>

          {/* Links de Cambio de Modo */}
          <div className="flex flex-col items-center gap-4">
            <button 
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
              }}
              className="text-xs font-black text-white/40 hover:text-white transition-colors uppercase tracking-widest"
            >
              {isRegistering ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Crear cuenta'}
            </button>
            {!isRegistering && (
              <button className="text-xs font-bold text-white/20 hover:text-white transition-colors uppercase tracking-widest">
                ¿Olvidaste tu contraseña?
              </button>
            )}
          </div>

          <p className="mt-12 text-center text-[10px] text-white/20 leading-relaxed font-bold uppercase tracking-tighter">
            Al usar esta app, aceptas nuestra <span className="underline cursor-pointer">Política de Privacidad</span> y <br />
            <span className="underline cursor-pointer">Términos de Servicio</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
