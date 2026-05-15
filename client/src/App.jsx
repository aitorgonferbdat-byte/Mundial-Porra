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
    <div className="min-h-screen bg-background flex">
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
      <div className="hidden xl:flex w-[400px] items-end justify-center sticky top-0 h-screen overflow-hidden bg-gradient-to-t from-background to-transparent">
        <img 
          src="/jugador.png" 
          alt="Jugador" 
          className="h-[90%] object-contain drop-shadow-[0_0_30px_rgba(212,175,55,0.3)] select-none pointer-events-none"
        />
      </div>
    </div>
  );
}

export default App;
