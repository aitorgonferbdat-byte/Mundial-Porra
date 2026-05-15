import { ScrollText, Target, Trophy, Info } from 'lucide-react';

const Rules = () => {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <ScrollText className="w-16 h-16 text-vibrant-red mx-auto mb-4" />
          <h1 className="font-outfit text-4xl font-black text-navy uppercase tracking-tight">
            Reglas Oficiales <span className="text-vibrant-red">Porra 2026</span>
          </h1>
          <p className="text-slate-500 font-medium mt-2">Todo lo que necesitas saber para ganar</p>
        </div>

        <div className="grid gap-8">
          {/* Sistema de Puntuación */}
          <section className="card border-l-8 border-l-emerald">
            <div className="flex items-center gap-4 mb-6">
              <Target className="w-8 h-8 text-emerald" />
              <h2 className="font-outfit text-2xl font-black text-navy uppercase">Sistema de Puntuación</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="text-3xl font-black text-emerald mb-1">3 pts</div>
                <div className="font-bold text-navy text-sm uppercase mb-1">Resultado Exacto</div>
                <p className="text-xs text-slate-500">Si aciertas el número exacto de goles de ambos equipos.</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="text-3xl font-black text-navy mb-1">1 pt</div>
                <div className="font-bold text-navy text-sm uppercase mb-1">Tendencia</div>
                <p className="text-xs text-slate-500">Si aciertas quién gana o si hay empate, pero no los goles exactos.</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="text-3xl font-black text-slate-300 mb-1">0 pts</div>
                <div className="font-bold text-navy text-sm uppercase mb-1">Fallo</div>
                <p className="text-xs text-slate-500">Si no aciertas ni el ganador ni el marcador.</p>
              </div>
            </div>
          </section>

          {/* Dinámica del Juego */}
          <section className="card border-l-8 border-l-navy">
            <div className="flex items-center gap-4 mb-6">
              <Info className="w-8 h-8 text-navy" />
              <h2 className="font-outfit text-2xl font-black text-navy uppercase">Cómo Jugar</h2>
            </div>
            <ul className="space-y-4">
              <li className="flex gap-4">
                <div className="bg-navy text-white w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold text-xs">1</div>
                <p className="text-slate-600 text-sm">Completa todos los partidos de la **Fase de Grupos**. Los dos primeros de cada grupo y los 8 mejores terceros avanzarán automáticamente.</p>
              </li>
              <li className="flex gap-4">
                <div className="bg-navy text-white w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold text-xs">2</div>
                <p className="text-slate-600 text-sm">Rellena los cruces de **Eliminatorias** (Dieciseisavos, Octavos, Cuartos, Semis y Final). Si pones un empate, deberás elegir quién pasa por penaltis.</p>
              </li>
              <li className="flex gap-4">
                <div className="bg-navy text-white w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold text-xs">3</div>
                <p className="text-slate-600 text-sm">Envía tu porra oficial. Una vez enviada, se guardará en la base de datos y no podrá modificarse.</p>
              </li>
            </ul>
          </section>

          {/* Desempate */}
          <section className="card border-l-8 border-l-vibrant-red">
            <div className="flex items-center gap-4 mb-6">
              <Trophy className="w-8 h-8 text-vibrant-red" />
              <h2 className="font-outfit text-2xl font-black text-navy uppercase">Criterios de Desempate</h2>
            </div>
            <p className="text-slate-600 text-sm mb-4">En caso de que dos o más participantes tengan los mismos puntos al final del torneo, el orden se decidirá por:</p>
            <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600 font-medium">
              <li>Mayor número de resultados exactos (3 pts) acertados.</li>
              <li>Acierto del Campeón del mundo.</li>
              <li>Acierto del Subcampeón del mundo.</li>
              <li>Fecha de envío de la porra (el más antiguo gana).</li>
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Rules;
