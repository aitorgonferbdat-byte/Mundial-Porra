import { useState, useRef } from 'react';
import { Trophy, CheckCircle, XCircle, Download } from 'lucide-react';
import { api, storage } from '../utils/api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Flag from './Flag';

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

      // Save prediction to localStorage
      storage.savePrediction({ matchResults, champion, runnerUp, user: userData });

      // Send email via serverless function
      const response = await api.sendPrediction({
        user: userData,
        matchResults,
        champion,
        runnerUp
      });

      if (response.success) {
        setSuccess(true);
        setTimeout(() => onComplete(), 5000);
      } else {
        // Even if email fails, prediction is saved locally
        console.warn('Email sending failed:', response.error);
        setSuccess(true);
        setTimeout(() => onComplete(), 5000);
      }
    } catch (err) {
      // Even on network error, prediction is saved in localStorage
      console.warn('Network error, but prediction saved locally:', err);
      setSuccess(true);
      setTimeout(() => onComplete(), 5000);
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
          <h2 className="font-montserrat text-2xl font-bold text-text mb-2">
            ¡Porra Enviada!
          </h2>
          <p className="text-textMuted mb-6">
            Tu predicción ha sido guardada correctamente. Buena suerte en el Mundial 2026.
          </p>
          <div ref={summaryRef} className="bg-surfaceLight rounded-lg p-6 mb-6 border border-gold/20">
            <h3 className="text-gold font-bold mb-4 font-montserrat">Resumen Mundial 2026</h3>
            <div className="text-sm text-textMuted mb-2">Participante: <span className="text-text font-bold">{userData.name} (@{userData.nickname})</span></div>
            <div className="flex items-center justify-center gap-8 mt-4">
              <div className="text-center">
                <div className="text-3xl mb-1">🥇</div>
                <div className="text-xs text-textMuted uppercase tracking-wider mb-1">Campeón</div>
                <div className="font-bold text-gold text-lg">{bracket.final[0]?.winner}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-1">🥈</div>
                <div className="text-xs text-textMuted uppercase tracking-wider mb-1">Subcampeón</div>
                <div className="font-bold text-accent text-lg">
                  {bracket.final[0]?.homeTeam === bracket.final[0]?.winner 
                    ? bracket.final[0]?.awayTeam 
                    : bracket.final[0]?.homeTeam}
                </div>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleDownloadPDF}
            className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent/80 text-background font-bold py-3 px-6 rounded-lg transition-all mb-4"
          >
            <Download className="w-5 h-5" />
            Descargar Resumen PDF
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
