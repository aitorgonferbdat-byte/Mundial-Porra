import { useState } from 'react';

const Login = ({ onLogin, onBack }) => {
  const [showPassword, setShowPassword] = useState(false);

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
          <h2 className="text-3xl font-black text-white mb-8 text-center">Iniciar sesión</h2>

          {/* Google Login */}
          <button className="w-full py-3 px-6 rounded-xl border border-white/10 flex items-center justify-center gap-3 hover:bg-white/5 transition-all mb-6">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/action/google.svg" alt="Google" className="w-5 h-5" />
            <span className="text-sm font-bold text-white/80">Continuar con Google</span>
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="h-[1px] flex-1 bg-white/10"></div>
            <span className="text-white/20 text-xs font-bold uppercase">o</span>
            <div className="h-[1px] flex-1 bg-white/10"></div>
          </div>

          {/* Email Field */}
          <div className="mb-4">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20">
                <i className="far fa-envelope"></i>
              </span>
              <input 
                type="email" 
                placeholder="Correo electrónico" 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-brand-green/50 transition-all"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-8">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20">
                <i className="fas fa-lock"></i>
              </span>
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="Contraseña" 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-12 text-white placeholder-white/20 focus:outline-none focus:border-brand-green/50 transition-all"
              />
              <button 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/40 transition-colors"
              >
                <i className={`far ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            onClick={onLogin}
            className="w-full bg-brand-green hover:bg-brand-green/90 text-white font-black py-4 rounded-xl shadow-lg shadow-brand-green/20 transition-all hover:scale-[1.02] mb-6"
          >
            Iniciar sesión
          </button>

          {/* Extra Links */}
          <div className="flex flex-col items-center gap-4">
            <button className="text-xs font-bold text-white/40 hover:text-white transition-colors uppercase tracking-widest">Crear cuenta</button>
            <button className="text-xs font-bold text-white/20 hover:text-white transition-colors">¿Olvidaste tu contraseña?</button>
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
