import { useState, useEffect } from 'react';
import { getFlag } from '../utils/flags';

const Home = ({ onStart, onRules, onLeaderboard }) => {
  const [timeLeft, setTimeLeft] = useState({
    meses: 0,
    dias: 25,
    horas: 7,
    minutos: 10,
    segundos: 12
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.segundos > 0) return { ...prev, segundos: prev.segundos - 1 };
        if (prev.minutos > 0) return { ...prev, minutos: prev.minutos - 1, segundos: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const teams = [
    'Spain', 'Germany', 'France', 'Portugal', 'England', 'Italy', 'Netherlands', 'Belgium',
    'Brazil', 'Argentina', 'Uruguay', 'USA', 'Mexico', 'Canada', 'Japan', 'Korea Republic',
    'Morocco', 'Senegal', 'Australia', 'Croatia', 'Switzerland', 'Denmark', 'Serbia', 'Poland'
  ];

  return (
    <div className="relative min-h-[calc(100vh-88px)] flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-green/10 blur-[150px] rounded-full -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-brand-yellow/5 blur-[150px] rounded-full -z-10 animate-pulse delay-700"></div>

      {/* Hero Section */}
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-12 lg:py-24">
        
        {/* Left Content */}
        <div className="z-10 order-2 lg:order-1 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-2 mb-8">
            <span className="bg-white/5 px-5 py-2 rounded-full text-[11px] font-black text-brand-yellow uppercase tracking-[0.2em] border border-white/10 backdrop-blur-sm">
              🏆 Mundial 2026 - USA, Canadá y México
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl xl:text-8xl font-black text-white leading-[1.1] mb-8 tracking-tighter">
            Crea tu porra <br />
            <span className="text-brand-yellow drop-shadow-[0_0_30px_rgba(246,224,94,0.3)]">compite con los tuyos</span>
          </h1>
          
          <p className="text-white/50 text-lg md:text-xl max-w-xl mb-12 leading-relaxed mx-auto lg:mx-0">
            Porras privadas para grupos de amigos o empresas. Predice resultados, acumula puntos y demuestra quién sabe más de fútbol.
          </p>
          
          <div className="flex flex-wrap justify-center lg:justify-start gap-5 mb-20">
            <button onClick={onStart} className="btn-primary group">
              Crear mi porra <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
            </button>
            <button onClick={onRules} className="btn-outline">
              Cómo funciona
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-10 max-w-lg mx-auto lg:mx-0 border-l border-white/10 pl-8">
            <div className="stat-card">
              <span className="stat-value">48</span>
              <span className="stat-label">Equipos del <br />Mundial</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">104</span>
              <span className="stat-label">Partidos a <br />predecir</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">10</span>
              <span className="stat-label">Trofeos a <br />predecir</span>
            </div>
          </div>
        </div>

        {/* Right Content - Logo & Timer */}
        <div className="relative flex flex-col items-center justify-center z-10 order-1 lg:order-2">
          {/* Logo Placeholder with specialized glow */}
          <div className="relative w-full max-w-md aspect-square flex items-center justify-center mb-16 group">
            <div className="absolute inset-0 bg-brand-green/20 blur-[100px] rounded-full group-hover:bg-brand-green/30 transition-all duration-700"></div>
            <div className="absolute inset-0 border-2 border-dashed border-white/5 rounded-full animate-[spin_20s_linear_infinite]"></div>
            <img 
              src="/logo-placeholder.png" 
              alt="La Porrita" 
              className="relative w-[85%] h-[85%] object-contain drop-shadow-[0_0_60px_rgba(34,197,94,0.5)] transform group-hover:scale-105 transition-transform duration-700"
              onError={(e) => {
                e.target.src = "https://cdn-icons-png.flaticon.com/512/5329/5329948.png";
              }}
            />
          </div>

          {/* Countdown */}
          <div className="w-full max-w-sm">
            <p className="text-center text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-6">El mundial empieza en:</p>
            <div className="grid grid-cols-5 gap-4">
              {[
                { label: 'Meses', value: timeLeft.meses },
                { label: 'Días', value: timeLeft.dias },
                { label: 'Horas', value: timeLeft.horas },
                { label: 'Minutos', value: timeLeft.minutos },
                { label: 'Segundos', value: timeLeft.segundos }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="w-full aspect-square glass rounded-2xl flex items-center justify-center text-2xl md:text-3xl font-black text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    {item.value}
                  </div>
                  <span className="text-[9px] font-black text-white/20 uppercase tracking-widest mt-3">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Flag Marquee */}
      <div className="absolute bottom-0 left-0 w-full bg-pitch-dark/80 backdrop-blur-2xl border-t border-white/5 py-6 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap items-center">
          {[...teams, ...teams, ...teams].map((team, idx) => (
            <div key={idx} className="inline-flex items-center mx-10 opacity-30 hover:opacity-100 hover:scale-125 transition-all duration-300">
              <img 
                src={getFlag(team)} 
                alt={team} 
                className="w-10 h-6 object-cover rounded-sm shadow-xl"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-28 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-3 animate-bounce opacity-20">
        <span className="text-[9px] font-black text-white uppercase tracking-[0.5em]">Scroll</span>
        <div className="w-[1px] h-10 bg-gradient-to-b from-white to-transparent"></div>
      </div>
    </div>
  );
};

export default Home;
