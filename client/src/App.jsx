import { useState } from 'react';
import Home from './components/Home';
import Registration from './components/Registration';
import GroupPhase from './components/GroupPhase';
import Bracket from './components/Bracket';
import Submission from './components/Submission';
import Leaderboard from './components/Leaderboard';
import AdminPanel from './components/AdminPanel';
import Rules from './components/Rules';
import { GROUP_MATCHES, KNOCKOUT_BRACKET } from './data/teams';

function App() {
  const [step, setStep] = useState('home'); // home, registration, groups, bracket, submission, leaderboard, admin, rules
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
    <div className="min-h-screen bg-pitch-dark text-white font-outfit">
      {/* Header */}
      <header className="py-6 px-10 flex items-center justify-between sticky top-0 z-[100] backdrop-blur-xl border-b border-white/5">
        {/* Logo & Social */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setStep('home')}>
            <img src="/logo.png" alt="Logo" className="h-10 group-hover:scale-110 transition-transform" 
              onError={(e) => e.target.src = "https://cdn-icons-png.flaticon.com/512/5329/5329948.png"} 
            />
            <span className="font-black text-xl tracking-tighter uppercase">LaPorrita</span>
          </div>
          
          <div className="hidden md:flex items-center gap-4 text-white/40">
            <a href="#" className="hover:text-white transition-colors"><i className="fab fa-twitter text-lg"></i></a>
            <a href="#" className="hover:text-white transition-colors"><i className="fab fa-tiktok text-lg"></i></a>
            <svg className="w-5 h-5 fill-current hover:text-white transition-colors cursor-pointer" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            <svg className="w-5 h-5 fill-current hover:text-white transition-colors cursor-pointer" viewBox="0 0 448 512"><path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"/></svg>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center gap-12">
          {[
            { id: 'registration', label: 'Participar' },
            { id: 'leaderboard', label: 'Clasificación' },
            { id: 'rules', label: 'Reglas' }
          ].map((item) => (
            <span 
              key={item.id}
              onClick={() => setStep(item.id)}
              className={`cursor-pointer text-sm font-bold uppercase tracking-widest transition-all hover:text-brand-green ${step === item.id ? 'text-brand-green' : 'text-white/60'}`}
            >
              {item.label}
            </span>
          ))}
        </nav>

        {/* Login Button */}
        <button 
          onClick={() => setStep('admin')}
          className="bg-brand-green/20 hover:bg-brand-green/30 text-brand-green px-6 py-2 rounded-full text-sm font-bold border border-brand-green/30 transition-all hover:scale-105"
        >
          Entrar
        </button>
      </header>

      {/* Main Content */}
      <main>
        {step === 'home' && (
          <Home 
            onStart={() => setStep('registration')} 
            onRules={() => setStep('rules')} 
            onLeaderboard={() => setStep('leaderboard')} 
          />
        )}

        {step === 'registration' && (
          <div className="max-w-4xl mx-auto py-12 px-6">
            <Registration onComplete={handleRegistrationComplete} />
          </div>
        )}
        
        {step === 'groups' && (
          <div className="max-w-6xl mx-auto py-12 px-6">
            <GroupPhase
              groupMatches={groupMatches}
              setGroupMatches={setGroupMatches}
              onNext={handleGroupsComplete}
            />
          </div>
        )}
        
        {step === 'bracket' && (
          <div className="max-w-7xl mx-auto py-12 px-6">
            <Bracket
              groupMatches={groupMatches}
              bracket={bracket}
              setBracket={setBracket}
              onSubmit={handleBracketSubmit}
            />
          </div>
        )}
        
        {step === 'submission' && (
          <div className="max-w-4xl mx-auto py-12 px-6">
            <Submission
              userData={userData}
              groupMatches={groupMatches}
              bracket={bracket}
              onComplete={handleSubmitComplete}
            />
          </div>
        )}

        {step === 'leaderboard' && (
          <div className="max-w-5xl mx-auto py-12 px-6">
            <Leaderboard />
          </div>
        )}

        {step === 'admin' && (
          <div className="max-w-5xl mx-auto py-12 px-6">
            <AdminPanel />
          </div>
        )}

        {step === 'rules' && (
          <div className="max-w-4xl mx-auto py-12 px-6">
            <Rules />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center mt-20">
        <p className="text-white/20 text-xs uppercase tracking-widest font-black">© 2026 La Porrita - El mundial de todos</p>
      </footer>
    </div>
  );
}

export default App;
