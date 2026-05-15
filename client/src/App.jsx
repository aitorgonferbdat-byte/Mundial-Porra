import { useState } from 'react';
import Registration from './components/Registration';
import GroupPhase from './components/GroupPhase';
import Bracket from './components/Bracket';
import Submission from './components/Submission';
import { GROUP_MATCHES, KNOCKOUT_BRACKET } from './data/teams';

function App() {
  const [step, setStep] = useState('registration');
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
    setStep('registration');
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
            <div className="bg-white p-1 rounded">
              <img src="https://www.fifa.com/static-assets/fifacom/images/identity/fwc2026/logo.png" alt="FIFA 2026" className="h-10" />
            </div>
            <h1 className="text-white font-outfit text-xl font-bold uppercase tracking-wider">
              Mundial <span className="text-vibrant-red">Porra</span> 2026
            </h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <span className="text-white/80 hover:text-white cursor-pointer transition-colors text-sm font-medium">Predicciones</span>
            <span className="text-white/80 hover:text-white cursor-pointer transition-colors text-sm font-medium">Reglas</span>
            <span className="text-white/80 hover:text-white cursor-pointer transition-colors text-sm font-medium">Premios</span>
          </nav>
        </div>
      </header>

      <div className="flex">
        {/* Main Content */}
        <div className="flex-1">
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
        </div>

        {/* Decorative Player Image (Hidden on mobile) */}
        <div className="hidden xl:flex w-[400px] items-end justify-center sticky top-[72px] h-[calc(100vh-72px)] overflow-hidden">
          <img 
            src="/jugador.png" 
            alt="Jugador" 
            className="h-[90%] object-contain drop-shadow-[0_0_30px_rgba(10,37,81,0.2)] select-none pointer-events-none"
          />
        </div>
      </div>
    </div>
  );
}

export default App;
