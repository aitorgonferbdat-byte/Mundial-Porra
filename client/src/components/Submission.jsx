import { db, doc, setDoc } from '../lib/firebase';

const Submission = ({ userData, groupMatches, bracket, onComplete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const summaryRef = useRef(null);

  const handleDownloadPDF = async () => {
    if (!summaryRef.current) return;
    
    const canvas = await html2canvas(summaryRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Porra_Mundial_2026_${userData.nickname}.pdf`);
  };

  const handleSubmit = async () => {
    if (!userData?.name) {
      setError('Error: No se encontró el nombre del usuario.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Prepare match results
      const matchResults = {
        groups: groupMatches,
        knockout: bracket
      };

      // Get champion and runner-up from bracket
      const champion = bracket.final[0]?.winner;
      const runnerUp = bracket.final[0]?.homeTeam === champion 
        ? bracket.final[0]?.awayTeam 
        : bracket.final[0]?.homeTeam;

      // Save to Firebase Firestore
      // Colección 'usuarios', documento con ID = nombre del amigo
      await setDoc(doc(db, "usuarios", userData.name), {
        user: userData,
        predictions: matchResults,
        champion,
        runnerUp,
        timestamp: new Date().toISOString()
      });

      setSuccess(true);
      // Wait a bit longer to allow user to see success and download PDF
      setTimeout(() => onComplete(), 10000);
    } catch (err) {
      console.error('Error saving to Firebase:', err);
      setError('Error al conectar con la base de datos. Verifica tu conexión e inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card max-w-md w-full text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle className="w-20 h-20 text-green-500" />
          </div>
          <h2 className="font-outfit text-2xl font-bold text-navy mb-2 uppercase">
            ¡Predicción Confirmada!
          </h2>
          <p className="text-textMuted mb-6">
            Tu predicción ha sido guardada correctamente. Buena suerte en el Mundial 2026.
          </p>
          <div ref={summaryRef} className="bg-slate-50 rounded-lg p-6 mb-6 border-2 border-emerald/20 shadow-inner">
            <h3 className="text-navy font-black mb-4 font-outfit uppercase tracking-widest">Resumen Mundial 2026</h3>
            <div className="text-sm text-slate-500 mb-2 font-medium">Participante: <span className="text-vibrant-red font-bold">{userData.name} (@{userData.nickname})</span></div>
            <div className="flex items-center justify-center gap-8 mt-4">
              <div className="text-center">
                <div className="text-3xl mb-1">🥇</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1 font-bold">Campeón</div>
                <div className="font-bold text-navy text-xl">{bracket.final[0]?.winner}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-1">🥈</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1 font-bold">Subcampeón</div>
                <div className="font-bold text-vibrant-red text-xl">
                  {bracket.final[0]?.homeTeam === bracket.final[0]?.winner 
                    ? bracket.final[0]?.awayTeam 
                    : bracket.final[0]?.homeTeam}
                </div>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleDownloadPDF}
            className="w-full flex items-center justify-center gap-2 bg-navy hover:bg-navy/90 text-white font-bold py-3 px-6 rounded-lg transition-all mb-4 shadow-lg"
          >
            <Download className="w-5 h-5" />
            Descargar Certificado Oficial
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card max-w-md w-full">
        <div className="text-center mb-8">
          <Trophy className="w-16 h-16 text-gold mx-auto mb-4" />
          <h2 className="font-montserrat text-2xl font-bold text-text mb-2">
            Confirmar Predicción
          </h2>
          <p className="text-textMuted">
            Revisa tu predicción antes de enviarla
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-surfaceLight rounded-lg p-4">
            <div className="text-sm text-textMuted mb-1">Usuario</div>
            <div className="font-medium text-text">{userData.nickname}</div>
          </div>

          <div className="bg-surfaceLight rounded-lg p-4">
            <div className="text-sm text-textMuted mb-2">Predicción Final</div>
            <div className="flex items-center justify-center gap-6">
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Flag team={bracket.final[0]?.winner} className="w-12 h-8" />
                </div>
                <div className="font-montserrat text-lg font-bold text-gold">
                  {bracket.final[0]?.winner || '---'}
                </div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Flag 
                    team={bracket.final[0]?.homeTeam === bracket.final[0]?.winner 
                      ? bracket.final[0]?.awayTeam 
                      : bracket.final[0]?.homeTeam} 
                    className="w-12 h-8" 
                  />
                </div>
                <div className="font-montserrat text-lg font-bold text-accent">
                  {bracket.final[0]?.homeTeam === bracket.final[0]?.winner 
                    ? bracket.final[0]?.awayTeam 
                    : bracket.final[0]?.homeTeam || '---'}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surfaceLight rounded-lg p-4">
            <div className="text-sm text-textMuted mb-2">Estadísticas</div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-textMuted">Partidos grupos:</span>
                <span className="text-text font-bold ml-2">72</span>
              </div>
              <div>
                <span className="text-textMuted">Partidos eliminatorias:</span>
                <span className="text-text font-bold ml-2">32</span>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={() => window.history.back()}
            className="flex-1 bg-surfaceLight hover:bg-surface text-text font-semibold px-6 py-3 rounded-lg transition-all"
          >
            Volver
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 btn-gold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Enviando...' : 'Confirmar y Enviar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Submission;
