import { useState } from 'react';
import Registration from './components/Registration';
import GroupPhase from './components/GroupPhase';
import Bracket from './components/Bracket';
import Submission from './components/Submission';
import Leaderboard from './components/Leaderboard';
import AdminPanel from './components/AdminPanel';
import { GROUP_MATCHES, KNOCKOUT_BRACKET } from './data/teams';

function App() {
  const [step, setStep] = useState('registration'); // registration, groups, bracket, submission, leaderboard, admin
  const [userData, setUserData] = useState(null);
  const [groupMatches, setGroupMatches] = useState(GROUP_MATCHES);
  const [bracket, setBracket] = useState(KNOCKOUT_BRACKET);

  const handleRegistrationComplete = (data) => {
    setUserData(data);
    setStep('groups');
  };

  const handleGroupsComplete = () => {
    setStep('bracket');
  };

  const handleBracketSubmit = () => {
    setStep('submission');
  };

  const handleSubmitComplete = () => {
    setStep('leaderboard');
    setUserData(null);
    setGroupMatches(GROUP_MATCHES);
    setBracket(KNOCKOUT_BRACKET);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-navy py-4 px-6 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-white p-1 rounded cursor-pointer" onClick={() => setStep('registration')}>
              <img src="https://www.fifa.com/static-assets/fifacom/images/identity/fwc2026/logo.png" alt="FIFA 2026" className="h-10" />
            </div>
            <h1 className="text-white font-outfit text-xl font-bold uppercase tracking-wider cursor-pointer" onClick={() => setStep('registration')}>
              Mundial <span className="text-vibrant-red">Porra</span> 2026
            </h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <span 
              onClick={() => setStep('registration')}
              className={`cursor-pointer transition-colors text-sm font-black uppercase tracking-widest ${step === 'registration' ? 'text-vibrant-red' : 'text-white/80 hover:text-white'}`}
            >
              Participar
            </span>
            <span 
              onClick={() => setStep('leaderboard')}
              className={`cursor-pointer transition-colors text-sm font-black uppercase tracking-widest ${step === 'leaderboard' ? 'text-vibrant-red' : 'text-white/80 hover:text-white'}`}
            >
              Clasificación
            </span>
            <span className="text-white/80 hover:text-white cursor-pointer transition-colors text-sm font-black uppercase tracking-widest">Reglas</span>
          </nav>
        </div>
      </header>

      <div className="flex flex-col xl:flex-row">
        {/* Main Content */}
        <div className="flex-1 pb-20">
          {step === 'registration' && (
            <Registration onComplete={handleRegistrationComplete} />
          )}
          
          {step === 'groups' && (
            <GroupPhase
              groupMatches={groupMatches}
              setGroupMatches={setGroupMatches}
              onNext={handleGroupsComplete}
            />
          )}
          
          {step === 'bracket' && (
            <Bracket
              groupMatches={groupMatches}
              bracket={bracket}
              setBracket={setBracket}
              onSubmit={handleBracketSubmit}
            />
          )}
          
          {step === 'submission' && (
            <Submission
              userData={userData}
              groupMatches={groupMatches}
              bracket={bracket}
              onComplete={handleSubmitComplete}
            />
          )}

          {step === 'leaderboard' && (
            <Leaderboard />
          )}

          {step === 'admin' && (
            <AdminPanel />
          )}

          {/* Footer / Admin Link */}
          <footer className="mt-20 py-8 border-t border-slate-100 text-center">
            <p className="text-slate-400 text-xs uppercase tracking-widest font-bold">© 2026 Porra del Mundial - Todos los derechos reservados</p>
            <button 
              onClick={() => setStep('admin')}
              className="mt-4 text-[10px] text-slate-300 hover:text-navy transition-colors uppercase tracking-widest font-bold"
            >
              Acceso Admin
            </button>
          </footer>
        </div>

        {/* Decorative Player Image (Hidden on mobile and specific views) */}
        {(step === 'registration' || step === 'groups' || step === 'bracket') && (
          <div className="hidden xl:flex w-[400px] items-end justify-center sticky top-[72px] h-[calc(100vh-72px)] overflow-hidden">
            <img 
              src="/jugador.png" 
              alt="Jugador" 
              className="h-[90%] object-contain drop-shadow-[0_0_30px_rgba(10,37,81,0.2)] select-none pointer-events-none"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
