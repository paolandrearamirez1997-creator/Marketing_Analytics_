import React, { useState } from 'react';
import {
  Trophy,
  Award,
  Zap,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  Printer,
  Compass,
  ShieldAlert,
  Target,
  Activity,
  Sliders,
  DollarSign,
  FileSpreadsheet,
} from 'lucide-react';
import { UserProgress } from '../../types';
import { BADGES_LIST, CHALLENGE_QUESTIONS } from '../../data/challenges';
import { getNextLevelXP } from '../../utils/storage';

interface Module7GamificationProps {
  progress: UserProgress;
  onAwardXP: (amount: number, reason: string) => void;
  onUnlockBadge: (badgeId: string) => void;
  onUpdateStudentName: (name: string) => void;
  onCompleteFinalExam: (score: number) => void;
}

const BADGE_ICONS: Record<string, React.ElementType> = {
  Compass,
  ShieldAlert,
  Target,
  Activity,
  Sliders,
  DollarSign,
  FileSpreadsheet,
  Award,
};

export const Module7Gamification: React.FC<Module7GamificationProps> = ({
  progress,
  onAwardXP,
  onUnlockBadge,
  onUpdateStudentName,
  onCompleteFinalExam,
}) => {
  const [activeTab, setActiveTab] = useState<'quizzes' | 'badges' | 'final_exam'>('quizzes');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // Examen final integrador
  const [examStep, setExamStep] = useState<'intro' | 'questions' | 'certificate'>('intro');
  const [examAnswers, setExamAnswers] = useState<Record<number, number>>({});
  const [examScore, setExamScore] = useState<number>(progress.finalExamScore || 0);

  const levelInfo = getNextLevelXP(progress.xp);
  const currentQuestion = CHALLENGE_QUESTIONS[currentQuestionIndex];

  const handleSelectOption = (idx: number) => {
    if (showFeedback) return;
    setSelectedOption(idx);
    setShowFeedback(true);

    const isCorrect = currentQuestion.options[idx].isCorrect;
    if (isCorrect) {
      onAwardXP(currentQuestion.xpReward, `Pregunta superada: ${currentQuestion.category}`);
      if (currentQuestion.id === 'q1') onUnlockBadge('badge-first-steps');
      if (currentQuestion.id === 'q2') onUnlockBadge('badge-paradox-hunter');
      if (currentQuestion.id === 'q3') onUnlockBadge('badge-precision-master');
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setShowFeedback(false);
    setCurrentQuestionIndex((prev) => (prev + 1) % CHALLENGE_QUESTIONS.length);
  };

  const FINAL_EXAM_QUESTIONS = [
    {
      q: 'En un modelo de detección de fraude con 1% de casos positivos, si el clasificador tiene 99% de Accuracy pero 0% de Recall, ¿cuál es el estado real del sistema?',
      options: [
        'El modelo es inoperante: predice siempre la clase mayoritaria y no detecta ningún fraude real.',
        'El modelo es excelente porque supera el 95% de exactitud requerido.',
        'El modelo sufre de sobreajuste por exceso de variables predictivas.',
      ],
      correct: 0,
    },
    {
      q: '¿Qué métrica compuesta es preferible cuando se auditan clasificadores en conjuntos de datos extremadamente asimétricos?',
      options: [
        'El Coeficiente de Correlación de Matthews (MCC), ya que evalúa de forma simétrica los cuatro cuadrantes.',
        'La media aritmética simple de Precisión y Recall.',
        'El valor del soporte total de muestras.',
      ],
      correct: 0,
    },
    {
      q: 'Si el costo de un Falso Negativo ($5,000) es 100 veces superior al de un Falso Positivo ($50), ¿qué estrategia técnica debe aplicarse?',
      options: [
        'Disminuir el umbral de decisión τ para maximizar el Recall y minimizar las omisiones críticas.',
        'Aumentar el umbral de decisión a 0.90 para asegurar una alta precisión.',
        'Eliminar los Verdaderos Negativos de la matriz para equilibrar la fórmula.',
      ],
      correct: 0,
    },
    {
      q: '¿Por qué la normalización por filas (True Class) es especialmente útil al analizar una matriz de confusión?',
      options: [
        'Porque muestra directamente la Sensibilidad (Recall) en la fila positiva y la Especificidad en la fila negativa.',
        'Porque transforma los números en dólares para el departamento de ventas.',
        'Porque elimina la necesidad de contar falsos positivos.',
      ],
      correct: 0,
    },
  ];

  const handleSubmitExam = () => {
    let correctCount = 0;
    FINAL_EXAM_QUESTIONS.forEach((q, idx) => {
      if (examAnswers[idx] === q.correct) correctCount++;
    });

    const scorePct = Math.round((correctCount / FINAL_EXAM_QUESTIONS.length) * 100);
    setExamScore(scorePct);
    onCompleteFinalExam(scorePct);

    if (scorePct >= 75) {
      onAwardXP(100, 'Aprobaste el Desafío Integrador Final');
      onUnlockBadge('badge-ml-master');
    }
    setExamStep('certificate');
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Encabezado */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
          <span>MÓDULO 07</span>
          <span aria-hidden="true">·</span>
          <span>GAMIFICACIÓN Y RETOS FORMATIVOS</span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
          Aprende Jugando: Niveles, Retos e Insignias
        </h1>
        <p className="mt-1 text-sm text-slate-600 max-w-3xl leading-relaxed">
          Pon a prueba tu intuición estadística, acumula Puntos de Experiencia (XP), desbloquea
          insignias de maestría y obtén tu reporte final de certificación educativa.
        </p>
      </div>

      {/* Banner de Rango y Progresión */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-xs">
              <Trophy className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                Rango Actual
              </span>
              <span className="text-xl font-extrabold text-slate-900">
                Nivel: {progress.level}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-500 block">Puntos Acumulados</span>
            <span className="text-2xl font-black text-indigo-600 tabular-nums">
              {progress.xp} XP
            </span>
          </div>
        </div>

        {/* Barra de progreso de XP */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <div className="flex justify-between text-xs font-medium text-slate-600">
            <span>Progreso hacia {levelInfo.nextLevel}</span>
            <span>{levelInfo.progressPct.toFixed(0)}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${levelInfo.progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Navegación de Pestañas */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('quizzes')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'quizzes'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:text-slate-900'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Retos y Preguntas Cortas</span>
        </button>
        <button
          onClick={() => setActiveTab('badges')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'badges'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:text-slate-900'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Insignias ({progress.badges.length} / {BADGES_LIST.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('final_exam')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'final_exam'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Desafío Integrador Final</span>
        </button>
      </div>

      {/* CONTENIDO TAB 1: RETOS Y PREGUNTAS CORTAS */}
      {activeTab === 'quizzes' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 lg:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              Pregunta {currentQuestionIndex + 1} de {CHALLENGE_QUESTIONS.length} · Dificultad:{' '}
              {currentQuestion.difficulty}
            </span>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-md">
              +{currentQuestion.xpReward} XP
            </span>
          </div>

          <h2 className="text-base font-bold text-slate-900 leading-snug">
            {currentQuestion.question}
          </h2>

          {/* Opciones */}
          <div className="space-y-2.5">
            {currentQuestion.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              let btnStyle = 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100';

              if (showFeedback) {
                if (opt.isCorrect) {
                  btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-medium';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-50 border-rose-400 text-rose-950 font-medium';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={showFeedback}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left p-3.5 rounded-lg text-xs transition-all border ${btnStyle}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="font-bold text-slate-400 shrink-0">
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    <span>{opt.text}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Retroalimentación Inmediata */}
          {showFeedback && selectedOption !== null && (
            <div
              className={`p-4 rounded-xl border text-xs leading-relaxed flex items-start gap-3 ${
                currentQuestion.options[selectedOption].isCorrect
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-rose-50 border-rose-300 text-rose-900'
              }`}
            >
              {currentQuestion.options[selectedOption].isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <span className="font-bold block">
                  {currentQuestion.options[selectedOption].isCorrect
                    ? '¡Respuesta Correcta!'
                    : 'Respuesta Incorrecta'}
                </span>
                <p>{currentQuestion.options[selectedOption].explanation}</p>
              </div>
            </div>
          )}

          {/* Botón Siguiente Pregunta */}
          {showFeedback && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNextQuestion}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
              >
                Siguiente Pregunta →
              </button>
            </div>
          )}
        </div>
      )}

      {/* CONTENIDO TAB 2: INSIGNIAS */}
      {activeTab === 'badges' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {BADGES_LIST.map((b) => {
            const isUnlocked = progress.badges.includes(b.id);
            const Icon = BADGE_ICONS[b.icon] || Award;

            return (
              <div
                key={b.id}
                className={`p-5 rounded-xl border transition-all flex items-start gap-4 ${
                  isUnlocked
                    ? 'bg-white border-indigo-200 shadow-xs'
                    : 'bg-slate-50/70 border-slate-200 opacity-60'
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                    isUnlocked
                      ? 'bg-indigo-600 text-amber-300 shadow-xs'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{b.name}</span>
                    {isUnlocked && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-semibold">
                        Desbloqueada
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-snug">{b.description}</p>
                  <span className="text-[11px] text-slate-400 block pt-1">
                    Criterio: {b.condition}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CONTENIDO TAB 3: EXAMEN INTEGRADOR FINAL */}
      {activeTab === 'final_exam' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 lg:p-8 shadow-xs space-y-6">
          {examStep === 'intro' && (
            <div className="space-y-4 max-w-xl mx-auto text-center py-4">
              <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
                <Sparkles className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Desafío Integrador: Certificación de Comprensión
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Este reto consta de 4 preguntas integradoras que evalúan tu criterio estadístico y de
                negocio. Obtén al menos un 75% para desbloquear la insignia definitiva y generar tu
                reporte de finalización.
              </p>

              <div className="pt-2">
                <input
                  type="text"
                  placeholder="Tu nombre completo para el reconocimiento..."
                  value={progress.studentName || ''}
                  onChange={(e) => onUpdateStudentName(e.target.value)}
                  className="w-full max-w-sm px-3.5 py-2 text-xs border border-slate-300 rounded-lg text-slate-900 text-center mb-4 focus:outline-indigo-500"
                />
                <div>
                  <button
                    onClick={() => setExamStep('questions')}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
                  >
                    Iniciar Examen Integrador
                  </button>
                </div>
              </div>
            </div>
          )}

          {examStep === 'questions' && (
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                Responde las siguientes preguntas analíticas:
              </h3>

              {FINAL_EXAM_QUESTIONS.map((q, qIdx) => (
                <div key={qIdx} className="space-y-2.5 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs font-bold text-indigo-700 block">
                    Pregunta {qIdx + 1}
                  </span>
                  <p className="text-xs font-medium text-slate-800">{q.q}</p>

                  <div className="space-y-1.5 pt-1">
                    {q.options.map((opt, oIdx) => (
                      <label
                        key={oIdx}
                        className={`flex items-start gap-2.5 p-2.5 rounded-lg text-xs cursor-pointer border transition-colors ${
                          examAnswers[qIdx] === oIdx
                            ? 'bg-indigo-50 border-indigo-300 text-indigo-950 font-medium'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`exam_q_${qIdx}`}
                          checked={examAnswers[qIdx] === oIdx}
                          onChange={() => setExamAnswers({ ...examAnswers, [qIdx]: oIdx })}
                          className="mt-0.5 accent-indigo-600"
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex justify-end pt-2">
                <button
                  disabled={Object.keys(examAnswers).length < FINAL_EXAM_QUESTIONS.length}
                  onClick={handleSubmitExam}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
                >
                  Enviar y Calificar Examen
                </button>
              </div>
            </div>
          )}

          {examStep === 'certificate' && (
            <div className="space-y-6">
              {/* Diploma / Certificado Educativo */}
              <div className="p-8 border-4 border-indigo-700/20 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/40 text-center space-y-4 shadow-sm relative">
                <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto shadow-xs">
                  <Award className="w-8 h-8 text-amber-300" />
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold tracking-widest text-indigo-900 uppercase">
                    Reconocimiento Educativo Interno
                  </span>
                  <h2 className="text-2xl font-black text-slate-900">
                    Certificado de Competencia en Matrices de Confusión
                  </h2>
                  <p className="text-xs text-slate-500">
                    Otorgado a través de la plataforma interactiva MatrizLab
                  </p>
                </div>

                <div className="py-4 border-y border-indigo-200/60 max-w-md mx-auto">
                  <span className="text-xs text-slate-400 block mb-1">Se certifica que</span>
                  <div className="text-xl font-black text-indigo-950">
                    {progress.studentName?.trim() || 'Estudiante de Ciencia de Datos'}
                  </div>
                  <p className="text-xs text-slate-600 mt-2">
                    Ha completado satisfactoriamente los 9 módulos de formación analítica, demostrando
                    comprensión sobre la anatomía de matrices, métricas de clasificación, paradoja de la
                    exactitud y optimización de umbrales bajo costos asimétricos de negocio.
                  </p>
                </div>

                <div className="flex items-center justify-center gap-8 text-xs text-slate-600 font-semibold pt-2">
                  <div>
                    Puntaje Examen Final:{' '}
                    <span className="text-indigo-700 font-extrabold">{examScore}%</span>
                  </div>
                  <div>·</div>
                  <div>
                    Nivel Alcanzado:{' '}
                    <span className="text-indigo-700 font-extrabold">{progress.level}</span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 italic">
                  Documento formativo sin validez oficial acreditada por entidades gubernamentales.
                </div>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-xs"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir Reconocimiento</span>
                </button>
                <button
                  onClick={() => setExamStep('intro')}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                >
                  Reiniciar Examen
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
