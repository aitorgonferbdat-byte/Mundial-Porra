import { useState, useEffect } from 'react';
import Home from './components/Home';
import Login from './components/Login';
import Registration from './components/Registration';
import GroupPhase from './components/GroupPhase';
import Bracket from './components/Bracket';
import Submission from './components/Submission';
import Leaderboard from './components/Leaderboard';
import AdminPanel from './components/AdminPanel';
import Rules from './components/Rules';
import { GROUP_MATCHES, KNOCKOUT_BRACKET } from './data/teams';
import { auth, onAuthStateChanged, signOut, db, doc, getDoc, getRedirectResult } from './lib/firebase';

function App() {
  const [step, setStep] = useState('home'); // home, login, registration, groups, bracket, submission, leaderboard, admin, rules
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [groupMatches, setGroupMatches] = useState(GROUP_MATCHES);
  const [bracket, setBracket] = useState(KNOCKOUT_BRACKET);
  const [loading, setLoading] = useState(true);

  // Escuchador de Persistencia de Sesión y Redirección
  useEffect(() => {
    const initAuth = async () => {
      // 1. Verificar si venimos de un redireccionamiento de Google
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          await handleLoginSuccess(result.user);
        }
      } catch (err) {
        console.error("Error en redireccionamiento:", err);
      }

      // 2. Escuchar cambios de estado de autenticación
      onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
          localStorage.setItem('user_name', currentUser.displayName || '');
          localStorage.setItem('user_email', currentUser.email || '');

          // Cargar datos de perfil si existen
          try {
            const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
            if (userDoc.exists()) {
              setUserData(userDoc.data());
            }
          } catch (err) {
            console.error("Error al cargar datos de Firestore:", err);
          }
        } else {
          setUser(null);
          setUserData(null);
          localStorage.removeItem('user_name');
          localStorage.removeItem('user_email');
        }
        setLoading(false);
      });
    };

    initAuth();
  }, []);

  const handleStart = () => {
    if (!user) {
      setStep('login');
    } else if (!userData) {
      setStep('registration');
    } else {
      setStep('groups');
    }
  };

  const handleLoginSuccess = async (loggedUser) => {
    setUser(loggedUser);
    try {
      const userDoc = await getDoc(doc(db, 'users', loggedUser.uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data());
        setStep('home');
      } else {
        setStep('registration');
      }
    } catch (err) {
      setStep('registration');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setStep('home');
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  };

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
    setGroupMatches(GROUP_MATCHES);
    setBracket(KNOCKOUT_BRACKET);
  };

  // Pantalla de Carga Inicial
  if (loading) return (
    <div className="min-h-screen bg-pitch-dark flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="w-16 h-16 border-4 border-brand-green border-t-transparent rounded-full animate-spin"></div>
        <p className="text-white/20 text-xs font-black uppercase tracking-widest">Cargando Porrita...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-pitch-dark text-white font-outfit">
      {/* Header - Oculto en Login */}
      {step !== 'login' && (
        <header className="py-6 px-10 flex items-center sticky top-0 z-[100] backdrop-blur-xl border-b border-white/5">
          {/* Logo & Social */}
          <div className="flex-1 flex items-center gap-8">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setStep('home')}>
              <img src="/logo.png" alt="Logo" className="h-10 group-hover:scale-110 transition-transform" 
                onError={(e) => e.target.src = "https://cdn-icons-png.flaticon.com/512/5329/5329948.png"} 
              />
              <span className="font-black text-xl tracking-tighter uppercase">LaPorrita</span>
            </div>
            
            <div className="hidden md:flex items-center gap-4 text-white/40">
              <svg className="w-5 h-5 fill-current hover:text-white transition-colors cursor-pointer" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              <svg className="w-5 h-5 fill-current hover:text-white transition-colors cursor-pointer" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              <svg className="w-5 h-5 fill-current hover:text-white transition-colors cursor-pointer" viewBox="0 0 448 512"><path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"/></svg>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-12 justify-center">
            {[
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

          {/* User Section */}
          <div className="flex-1 flex justify-end items-center gap-6">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase text-brand-green tracking-widest leading-none mb-1">En línea</p>
                  <p className="text-xs font-bold text-white/60 truncate max-w-[120px]">{userData?.nickname || user.displayName || user.email.split('@')[0]}</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="bg-white/5 hover:bg-red-500/10 text-white/20 hover:text-red-500 p-2.5 rounded-full transition-all border border-white/5"
                  title="Cerrar sesión"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M16 13v-2H7V8l-5 4 5 4v-3h9zM20 3H9c-1.1 0-2 .9-2 2v4h2V5h11v14H9v-4H7v4c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/></svg>
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setStep('login')}
                className="bg-brand-green/20 hover:bg-brand-green/30 text-brand-green px-8 py-2.5 rounded-full text-sm font-black border border-brand-green/30 transition-all hover:scale-105"
              >
                Entrar
              </button>
            )}
          </div>
        </header>
      )}

      {/* Main Content */}
      <main>
        {step === 'home' && (
          <Home 
            onStart={handleStart} 
            onRules={() => setStep('rules')} 
            onLeaderboard={() => setStep('leaderboard')} 
          />
        )}

        {step === 'login' && (
          <Login onBack={() => setStep('home')} onLogin={handleLoginSuccess} />
        )}

        {step === 'registration' && (
          <div className="max-w-4xl mx-auto py-12 px-6">
            <Registration user={user} onComplete={handleRegistrationComplete} />
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
      {step !== 'login' && (
        <footer className="py-12 border-t border-white/5 text-center mt-20">
          <p className="text-white/20 text-xs uppercase tracking-widest font-black">© 2026 La Porrita - El mundial de todos</p>
          <button 
            onClick={() => setStep('admin')}
            className="mt-4 text-[10px] text-white/10 hover:text-white transition-colors uppercase tracking-widest font-black"
          >
            Acceso Admin
          </button>
        </footer>
      )}
    </div>
  );
}

export default App;
