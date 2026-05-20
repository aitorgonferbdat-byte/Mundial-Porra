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

  const features = [
    {
      title: 'Porras Privadas',
      desc: 'Crea tu porra y comparte el código solo con quien tú quieras. Control total sobre los participantes.',
      icon: '👥',
      color: 'bg-emerald/20 text-emerald'
    },
    {
      title: 'Ranking en Tiempo Real',
      desc: 'Sigue tu posición y la de todos los participantes. El ranking se actualiza automáticamente con cada partido.',
      icon: '⭐',
      color: 'bg-blue-500/20 text-blue-400'
    },
    {
      title: 'Fase de Grupos + Eliminatorias',
      desc: 'Predice todos los partidos: fase de grupos, octavos, cuartos, semifinales y la gran final.',
      icon: '📅',
      color: 'bg-red-500/20 text-red-400'
    },
    {
      title: 'Premios Individuales',
      desc: 'Predice Balón de Oro, Bota de Oro, Mejor Portero y más. Puntos extra por acertar los premios.',
      icon: '🏅',
      color: 'bg-brand-yellow/20 text-brand-yellow'
    },
    {
      title: 'Código con Expiración',
      desc: 'Los códigos de invitación expiran cuando tú decidas. Regenera el código en cualquier momento.',
      icon: '🛡️',
      color: 'bg-green-500/20 text-green-400'
    },
    {
      title: 'Web y Móvil',
      desc: 'Accede desde cualquier dispositivo. Diseño responsivo que se adapta a tu pantalla.',
      icon: '💻',
      color: 'bg-indigo-500/20 text-indigo-400'
    }
  ];

  return (
    <div className="relative min-h-screen bg-pitch-dark text-white font-outfit overflow-x-hidden">
      
      {/* Flag Marquee (NOW AT THE TOP) */}
      <div className="w-full bg-black/20 backdrop-blur-md border-b border-white/5 py-3 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap items-center">
          {[...teams, ...teams, ...teams].map((team, idx) => (
            <div key={idx} className="inline-flex items-center mx-8 opacity-40 hover:opacity-100 transition-opacity">
              <img 
                src={getFlag(team)} 
                alt={team} 
                className="w-8 h-5 object-cover rounded-sm shadow-lg"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center px-6 pt-20 pb-32">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-green/10 blur-[150px] rounded-full -z-10 animate-pulse"></div>
        
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
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
            
            <div className="grid grid-cols-3 gap-10 max-w-lg mx-auto lg:mx-0 border-l border-white/10 pl-8 text-left">
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

          {/* Right Content */}
          <div className="relative flex flex-col items-center justify-center z-10 order-1 lg:order-2">
            <div className="relative w-full max-w-2xl flex items-center justify-center mb-16 group">
              <div className="absolute inset-0 bg-brand-green/20 blur-[100px] rounded-full group-hover:bg-brand-green/30 transition-all duration-700"></div>
              <img 
                src="/logo.png" 
                alt="La Porrita" 
                className="relative w-full h-auto object-contain drop-shadow-[0_0_80px_rgba(34,197,94,0.6)] transform group-hover:scale-105 transition-transform duration-700"
              />
            </div>

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
      </section>

      {/* Features Section */}
      <section className="relative px-6 py-32 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-brand-green/20 border border-brand-green/30 text-[10px] font-black text-brand-green uppercase tracking-[0.3em] mb-6">
            Funcionalidades
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Todo lo que necesitas para <span className="text-brand-yellow">tu porra</span>
          </h2>
          <p className="text-white/40 text-lg max-w-2xl mx-auto">
            Una experiencia completa para disfrutar del Mundial con los tuyos
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, idx) => (
            <div key={idx} className="glass p-10 rounded-[32px] group hover:bg-white/10 transition-all duration-500 border border-white/5 hover:border-white/10">
              <div className={`w-16 h-16 ${f.color} rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform duration-500`}>
                {f.icon}
              </div>
              <h3 className="text-2xl font-black text-white mb-4">{f.title}</h3>
              <p className="text-white/40 leading-relaxed group-hover:text-white/60 transition-colors">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
      
    </div>
  );
};

export default Home;
