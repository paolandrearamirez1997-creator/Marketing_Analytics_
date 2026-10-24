import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  TrendingDown,
  Layers,
  Sparkles,
} from 'lucide-react';
import { EDUCATIONAL_LESSONS } from '../../data/educationalContent';

interface Module1LearnProps {
  onAwardXP: (amount: number, reason: string) => void;
  onUnlockBadge: (badgeId: string) => void;
  onGoToExplorer: () => void;
}

export const Module1Learn: React.FC<Module1LearnProps> = ({
  onAwardXP,
  onUnlockBadge,
  onGoToExplorer,
}) => {
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [paradoxPrevalence, setParadoxPrevalence] = useState(1); // 1%
  const [paradoxCompleted, setParadoxCompleted] = useState(false);
  const [hoveredQuadrant, setHoveredQuadrant] = useState<string | null>(null);

  const lesson = EDUCATIONAL_LESSONS[activeLessonIndex];

  // Cálculo didáctico de la paradoja de la exactitud
  const totalSamples = 10000;
  const actualSick = Math.round((totalSamples * paradoxPrevalence) / 100);
  const actualHealthy = totalSamples - actualSick;
  // Modelo ingenuo predice siempre sano (negativo)
  const naiveTP = 0;
  const naiveFN = actualSick;
  const naiveTN = actualHealthy;
  const naiveFP = 0;
  const naiveAccuracy = ((naiveTP + naiveTN) / totalSamples) * 100;
  const naiveRecall = 0;

  const handleTestParadox = () => {
    if (!paradoxCompleted) {
      setParadoxCompleted(true);
      onAwardXP(40, 'Experimentaste con la Paradoja de la Exactitud');
      onUnlockBadge('badge-paradox-hunter');
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Encabezado */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
          <span>MÓDULO 01</span>
          <span aria-hidden="true">·</span>
          <span>FUNDAMENTOS ESTADÍSTICOS</span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
          Aprende a Interpretar Matrices de Confusión desde Cero
        </h1>
        <p className="mt-2 text-base text-slate-600 leading-relaxed max-w-3xl">
          Domina los conceptos fundamentales de la evaluación de clasificadores: desde la anatomía
          de los 4 cuadrantes hasta los sesgos ocultos de la exactitud en clases desbalanceadas.
        </p>
      </div>

      {/* Navegación por lecciones */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {EDUCATIONAL_LESSONS.map((l, idx) => (
          <button
            key={l.id}
            onClick={() => setActiveLessonIndex(idx)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeLessonIndex === idx
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            {idx + 1}. {l.title.split('.')[1]?.trim() || l.title}
          </button>
        ))}
      </div>

      {/* Tarjeta de Lección Activa */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 lg:p-8 shadow-xs space-y-6">
        <div>
          <span className="text-xs font-medium text-slate-400 block mb-1">
            {lesson.category}
          </span>
          <h2 className="text-xl font-bold text-slate-900">{lesson.title}</h2>
          <p className="mt-2 text-slate-700 text-base leading-relaxed">{lesson.description}</p>
        </div>

        {/* Puntos clave */}
        <div className="bg-slate-50 rounded-lg p-5 border border-slate-200/60 space-y-3">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Conceptos Clave para Recordar
          </h3>
          <ul className="space-y-2.5">
            {lesson.keyTakeaways.map((point, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Anatomía interactiva visual para Lección 2 */}
        {activeLessonIndex === 1 && (
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">
              Mapa Interactivo de los 4 Cuadrantes (Convención Estándar)
            </h3>
            <p className="text-xs text-slate-500">
              Pasa el cursor sobre cada celda para descubrir su significado técnico y de negocio.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-emerald-50/70 border border-emerald-200 hover:border-emerald-400 transition-all">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-900 text-sm">Verdadero Positivo (TP)</span>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    Acierto
                  </span>
                </div>
                <p className="text-xs text-emerald-800 mt-2">
                  Real: <strong>Positivo</strong> · Predicho: <strong>Positivo</strong>.
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  El evento ocurrió y el algoritmo dio la alarma correcta. Ejemplo: detectó a tiempo un
                  fraude financiero real o una enfermedad.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-amber-50/70 border border-amber-200 hover:border-amber-400 transition-all">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-900 text-sm">Falso Positivo (FP)</span>
                  <span className="text-[11px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                    Error Tipo I
                  </span>
                </div>
                <p className="text-xs text-amber-800 mt-2">
                  Real: <strong>Negativo</strong> · Predicho: <strong>Positivo</strong>.
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  Falsa alarma. El sistema alertó sobre un evento inocuo o una transacción normal,
                  generando molestia, llamadas a soporte o costos de revisión innecesarios.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-rose-50/70 border border-rose-200 hover:border-rose-400 transition-all">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-900 text-sm">Falso Negativo (FN)</span>
                  <span className="text-[11px] font-semibold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                    Error Tipo II
                  </span>
                </div>
                <p className="text-xs text-rose-800 mt-2">
                  Real: <strong>Positivo</strong> · Predicho: <strong>Negativo</strong>.
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  Ceguera del modelo. El peligro o evento existía, pero el clasificador dijo "todo está
                  bien". En salud o ciberseguridad, suele ser el error más peligroso y costoso.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-emerald-50/70 border border-emerald-200 hover:border-emerald-400 transition-all">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-900 text-sm">Verdadero Negativo (TN)</span>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    Acierto
                  </span>
                </div>
                <p className="text-xs text-emerald-800 mt-2">
                  Real: <strong>Negativo</strong> · Predicho: <strong>Negativo</strong>.
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  El estado era normal o sano y el modelo no generó ninguna alerta. Operación fluida sin
                  fricción.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Simulador Interactivo de la Paradoja de la Exactitud (Lección 3) */}
        {activeLessonIndex === 2 && (
          <div className="space-y-5 pt-4 border-t border-slate-100 bg-slate-50/70 -mx-6 -mb-6 p-6 rounded-b-xl">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Laboratorio: Experimenta la Paradoja de la Exactitud en Vivo
                </h3>
                <p className="text-xs text-slate-500">
                  Imagina una población de 10,000 personas. Simula un clasificador ingenuo que predice
                  SIEMPRE "Sano" (negativo).
                </p>
              </div>
              <button
                onClick={handleTestParadox}
                className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {paradoxCompleted ? '¡Completado (+40 XP)!' : 'Validar Experimento (+40 XP)'}
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">
                  Prevalencia del evento raro en la población:
                </span>
                <span className="font-bold text-indigo-700 text-sm">{paradoxPrevalence}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="10"
                step="0.1"
                value={paradoxPrevalence}
                onChange={(e) => setParadoxPrevalence(parseFloat(e.target.value))}
                className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>0.1% (Muy raro - ej. Fraude extremo)</span>
                <span>5% (Moderado)</span>
                <span>10% (Frecuente)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="bg-white p-4 rounded-lg border border-slate-200 text-center">
                <span className="text-xs text-slate-500 block">Distribución Real</span>
                <div className="text-sm font-bold text-slate-800 mt-1">
                  {actualSick} enfermos · {actualHealthy} sanos
                </div>
                <span className="text-[11px] text-slate-400">Total: 10,000 casos</span>
              </div>

              <div className="bg-white p-4 rounded-lg border border-slate-200 text-center">
                <span className="text-xs text-slate-500 block">Exactitud del Modelo Ingenuo</span>
                <div className="text-xl font-extrabold text-emerald-600 mt-1 tabular-nums">
                  {naiveAccuracy.toFixed(2)}%
                </div>
                <span className="text-[11px] text-emerald-700 font-medium">¡Parece excelente!</span>
              </div>

              <div className="bg-white p-4 rounded-lg border border-rose-200 text-center">
                <span className="text-xs text-rose-600 block font-semibold">
                  Recall / Detección Real
                </span>
                <div className="text-xl font-extrabold text-rose-600 mt-1 tabular-nums">
                  {naiveRecall.toFixed(1)}%
                </div>
                <span className="text-[11px] text-rose-700 font-medium">
                  Cero enfermos detectados (Inútil)
                </span>
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 leading-relaxed flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Conclusión estadística:</strong> Con una prevalencia del {paradoxPrevalence}%, el
                modelo logra {naiveAccuracy.toFixed(2)}% de exactitud únicamente aprovechándose de la
                abundancia de casos sanos. Nunca juzgues un modelo por su exactitud sin verificar su
                Recall y F1-Score.
              </span>
            </div>
          </div>
        )}

        {/* Ejemplo práctico de la lección */}
        {activeLessonIndex !== 2 && (
          <div className="border-t border-slate-100 pt-4">
            <h4 className="text-xs font-bold text-slate-800 mb-1">
              {lesson.exampleContent.title}
            </h4>
            <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed">
              {lesson.exampleContent.description}
            </p>
          </div>
        )}
      </div>

      {/* Pie de acción */}
      <div className="flex items-center justify-between bg-indigo-50 border border-indigo-100 rounded-xl p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
            02
          </div>
          <div>
            <h4 className="text-sm font-bold text-indigo-950">
              ¿Listo para experimentar con números reales?
            </h4>
            <p className="text-xs text-indigo-700">
              Avanza al Explorador 2×2 para modificar celdas interactivamente y ver cómo cambian las
              métricas.
            </p>
          </div>
        </div>

        <button
          onClick={onGoToExplorer}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm shrink-0"
        >
          <span>Ir al Explorador</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
