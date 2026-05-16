import { useState, useRef } from 'react';
import { db, doc, setDoc } from '../lib/firebase';
import { CheckCircle, Trophy, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Flag from './Flag';
import { api } from '../utils/api';

const Submission = ({ userData, groupMatches, bracket, onComplete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const summaryRef = useRef(null);

  const handleDownloadPDF = async () => {
    if (!summaryRef.current) return;
    
    try {
      const canvas = await html2canvas(summaryRef.current, {
        backgroundColor: '#041c14',
        scale: 2
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Porra_Mundial_2026_${userData?.nickname || 'usuario'}.pdf`);
    } catch (err) {
      console.error("Error al generar PDF:", err);
    }
  };

  const handleSubmit = async () => {
    if (!userData?.nickname) {
      setError('Error: No se encontró el perfil del usuario.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Preparar resultados de la predicción
      const matchResults = {
        groups: groupMatches,
        knockout: bracket
      };

      // Obtener campeón y subcampeón
      const champion = bracket.final[0]?.winner;
      const runnerUp = bracket.final[0]?.homeTeam === champion 
        ? bracket.final[0]?.awayTeam 
        : bracket.final[0]?.homeTeam;

      // Guardar en Firebase Firestore usando el UID del usuario para que sea único
      const docId = userData.uid || userData.nickname;

      await setDoc(doc(db, "usuarios", docId), {
        user: {
          name: userData.name,
          nickname: userData.nickname,
          email: userData.email,
          uid: userData.uid || null
        },
        predictions: matchResults,
        champion: champion || 'Desconocido',
        runnerUp: runnerUp || 'Desconocido',
        timestamp: new Date().toISOString()
      });

      // Intentar enviar correo (ignorar error si falla para no bloquear el flujo)
      try {
        await api.sendPrediction({
          user: userData,
          matchResults,
          champion,
          runnerUp
        });
      } catch (mailErr) {
        console.error("Error al enviar correo:", mailErr);
      }

      setSuccess(true);
      // Auto-completar después de mostrar el éxito por 5 segundos
      setTimeout(() => onComplete(), 5000);
    } catch (err) {
      console.error('Error saving to Firebase:', err);
      setError('Error al guardar en la base de datos. Asegúrate de tener permisos.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-10 max-w-md w-full text-center backdrop-blur-xl">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-emerald/20 rounded-full flex items-center justify-center animate-bounce">
              <CheckCircle className="w-10 h-10 text-emerald" />
            </div>
          </div>
          <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">
            ¡Porra Entregada!
          </h2>
          <p className="text-white/40 text-sm mb-8 font-bold uppercase tracking-widest">
            Tu predicción se ha guardado correctamente.
          </p>
          
          <div ref={summaryRef} className="bg-[#041c14] rounded-2xl p-8 mb-8 border border-white/10 text-left">
            <h3 className="text-white/20 text-[10px] font-black mb-4 uppercase tracking-[0.3em]">Resumen Oficial 2026</h3>
            <div className="mb-6">
              <p className="text-white/40 text-[10px] font-bold uppercase mb-1">Participante</p>
              <p className="text-xl font-black text-white leading-tight">{userData.nickname}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-brand-green text-[10px] font-black uppercase mb-1">Campeón</p>
                <div className="flex items-center gap-2">
                  <Flag team={bracket.final[0]?.winner} className="w-6 h-4 rounded-sm" />
                  <p className="text-sm font-bold text-white truncate">{bracket.final[0]?.winner}</p>
                </div>
              </div>
              <div>
                <p className="text-white/40 text-[10px] font-black uppercase mb-1">Finalista</p>
                <div className="flex items-center gap-2">
                  <Flag 
                    team={bracket.final[0]?.homeTeam === bracket.final[0]?.winner 
                      ? bracket.final[0]?.awayTeam 
                      : bracket.final[0]?.homeTeam} 
                    className="w-6 h-4 rounded-sm opacity-50" 
                  />
                  <p className="text-sm font-bold text-white/50 truncate">
                    {bracket.final[0]?.homeTeam === bracket.final[0]?.winner 
                      ? bracket.final[0]?.awayTeam 
                      : bracket.final[0]?.homeTeam}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleDownloadPDF}
            className="w-full flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 text-white font-black py-4 rounded-xl transition-all mb-4 uppercase tracking-widest text-xs"
          >
            <Download className="w-4 h-4" />
            Descargar Certificado PDF
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="bg-white/5 border border-white/10 rounded-3xl p-10 max-w-md w-full backdrop-blur-xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brand-green/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-8 h-8 text-brand-green" />
          </div>
          <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">
            Confirmar Entrega
          </h2>
          <p className="text-white/40 text-sm font-bold uppercase tracking-widest">
            Revisa tu selección antes del envío final
          </p>
        </div>

        <div className="space-y-6 mb-10">
          <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
            <p className="text-white/20 text-[10px] font-black uppercase mb-1">Participando como</p>
            <p className="font-bold text-white text-lg">{userData.nickname}</p>
          </div>

          <div className="bg-brand-green/5 rounded-2xl p-6 border border-brand-green/20 text-center">
            <p className="text-brand-green text-[10px] font-black uppercase mb-4 tracking-widest">Tu Campeón Predicho</p>
            <div className="flex flex-col items-center">
              <Flag team={bracket.final[0]?.winner} className="w-20 h-14 rounded-lg shadow-2xl mb-4" />
              <p className="text-2xl font-black text-white uppercase tracking-tighter">
                {bracket.final[0]?.winner || 'Sin elegir'}
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-xs font-bold mb-6 text-center">
            {error}
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={() => window.history.back()}
            className="flex-1 bg-white/5 hover:bg-white/10 text-white/40 font-black py-4 rounded-xl transition-all uppercase tracking-widest text-xs"
          >
            Atrás
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-[2] bg-brand-green hover:bg-brand-green/90 text-white font-black py-4 rounded-xl shadow-lg shadow-brand-green/20 transition-all hover:scale-[1.02] disabled:opacity-50 uppercase tracking-widest text-xs"
          >
            {loading ? 'Enviando...' : 'Entregar Porra'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Submission;
