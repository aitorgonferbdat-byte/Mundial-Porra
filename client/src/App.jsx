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
  );
}

export default App;
