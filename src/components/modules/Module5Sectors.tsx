import React, { useState } from 'react';
import {
  Briefcase,
  AlertCircle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  DollarSign,
  ShieldAlert,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { SECTOR_CASES } from '../../data/sectorCases';
import { SectorCase } from '../../types';
import { calculateBinaryMetrics } from '../../utils/metrics';

interface Module5SectorsProps {
  onAwardXP: (amount: number, reason: string) => void;
  onRecordSectorCompleted: (sectorId: string) => void;
  completedSectors: string[];
}

export const Module5Sectors: React.FC<Module5SectorsProps> = ({
  onAwardXP,
  onRecordSectorCompleted,
  completedSectors,
}) => {
  const [activeSectorId, setActiveSectorId] = useState<string>(SECTOR_CASES[0].id);
  const [selectedExerciseOption, setSelectedExerciseOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);

  const activeCase = SECTOR_CASES.find((c) => c.id === activeSectorId) || SECTOR_CASES[0];
  const metrics = calculateBinaryMetrics(activeCase.initialMatrix);

  const handleSelectSector = (id: string) => {
    setActiveSectorId(id);
    setSelectedExerciseOption(null);
    setShowFeedback(false);
  };

  const handleAnswerExercise = (index: number) => {
    setSelectedExerciseOption(index);
    setShowFeedback(true);

    const isCorrect = activeCase.exercise.options[index]?.isCorrect;
    if (isCorrect && !completedSectors.includes(activeCase.id)) {
      onRecordSectorCompleted(activeCase.id);
      onAwardXP(50, `Resolviste el caso del sector ${activeCase.sector}`);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Encabezado */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
          <span>MÓDULO 05</span>
          <span aria-hidden="true">·</span>
          <span>CASOS PRÁCTICOS POR SECTOR</span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
          Biblioteca de Aplicación en Negocios y Sectores Clave
        </h1>
        <p className="mt-1 text-sm text-slate-600 max-w-3xl leading-relaxed">
          Los errores en Machine Learning nunca cuestan lo mismo. Explora cómo 6 industrias resuelven
          el dilema entre falsos positivos y falsos negativos según sus objetivos económicos y éticos.
        </p>
      </div>

      {/* Selector de Sectores */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {SECTOR_CASES.map((sc) => {
          const isSelected = sc.id === activeSectorId;
          const isDone = completedSectors.includes(sc.id);

          return (
            <button
              key={sc.id}
              onClick={() => handleSelectSector(sc.id)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-2 ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>{sc.sector}</span>
              {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
            </button>
          );
        })}
      </div>

      {/* Ficha del Caso Sectorial Activo */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 lg:p-8 shadow-xs space-y-6">
        <div>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              {activeCase.subtitle}
            </span>
            {completedSectors.includes(activeCase.id) && (
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Caso Completado (+50 XP)
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">{activeCase.title}</h2>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200/70">
            {activeCase.context}
          </p>
        </div>

        {/* Disclaimer si aplica (Salud o RRHH) */}
        {activeCase.disclaimer && (
          <div className="p-3.5 bg-amber-50/80 rounded-lg border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed font-medium">{activeCase.disclaimer}</span>
          </div>
        )}

        {/* Matriz y Métricas del Caso */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Matriz 2x2 resumida */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Matriz de Confusión del Caso
            </h3>
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg">
                <span className="text-[10px] text-emerald-800 font-bold block">
                  TP: {activeCase.initialMatrix.tp.toLocaleString()}
                </span>
                <span className="text-slate-600 text-[11px] block mt-0.5">
                  {activeCase.positiveClassLabel} detectado
                </span>
              </div>
              <div className="p-3 bg-rose-50 border border-rose-300 rounded-lg">
                <span className="text-[10px] text-rose-800 font-bold block">
                  FN: {activeCase.initialMatrix.fn.toLocaleString()}
                </span>
                <span className="text-slate-600 text-[11px] block mt-0.5">
                  Positivo no detectado
                </span>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-300 rounded-lg">
                <span className="text-[10px] text-amber-800 font-bold block">
                  FP: {activeCase.initialMatrix.fp.toLocaleString()}
                </span>
                <span className="text-slate-600 text-[11px] block mt-0.5">
                  Falsa alarma
                </span>
              </div>
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg">
                <span className="text-[10px] text-emerald-800 font-bold block">
                  TN: {activeCase.initialMatrix.tn.toLocaleString()}
                </span>
                <span className="text-slate-600 text-[11px] block mt-0.5">
                  {activeCase.negativeClassLabel} confirmado
                </span>
              </div>
            </div>
          </div>

          {/* Métricas clave */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Métricas Estadísticas del Modelo
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Exactitud</span>
                <span className="text-base font-bold text-slate-900 tabular-nums">
                  {metrics.accuracy.percentage}
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Precisión</span>
                <span className="text-base font-bold text-indigo-700 tabular-nums">
                  {metrics.precision.percentage}
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Recall (Sensibilidad)</span>
                <span className="text-base font-bold text-indigo-700 tabular-nums">
                  {metrics.recall.percentage}
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Puntaje F1</span>
                <span className="text-base font-bold text-slate-900 tabular-nums">
                  {metrics.f1.percentage}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Asimetría de Costos: Consecuencias FP vs FN */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Consecuencia del Falso Positivo (FP):</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">{activeCase.fpConsequence}</p>
          </div>

          <div className="p-4 bg-rose-50/60 rounded-xl border border-rose-200 space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-900">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>Consecuencia del Falso Negativo (FN):</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">{activeCase.fnConsequence}</p>
          </div>
        </div>

        {/* Hallazgo y Decisión Recomendada */}
        <div className="p-4 bg-indigo-50/70 rounded-xl border border-indigo-100 text-xs text-indigo-950 space-y-2">
          <div>
            <span className="font-bold block text-indigo-900">Interpretación Analítica:</span>
            <p className="mt-0.5 text-slate-700 leading-relaxed">{activeCase.resolvedInsight}</p>
          </div>
          <div className="pt-2 border-t border-indigo-200/60">
            <span className="font-bold block text-indigo-900">Decisión de Negocio Recomendada:</span>
            <p className="mt-0.5 text-slate-700 leading-relaxed">{activeCase.recommendedDecision}</p>
          </div>
        </div>

        {/* EJERCICIO INTERACTIVO EVALUADO */}
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Desafío Práctico: Interpreta el Caso y Toma una Decisión
              </h3>
            </div>
            <span className="text-xs font-semibold text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200 shadow-xs">
              +50 XP
            </span>
          </div>

          <p className="text-xs font-medium text-slate-800 leading-relaxed">
            {activeCase.exercise.question}
          </p>

          <div className="space-y-2">
            {activeCase.exercise.options.map((opt, i) => {
              const isSelected = selectedExerciseOption === i;
              return (
                <button
                  key={i}
                  onClick={() => handleAnswerExercise(i)}
                  className={`w-full text-left p-3 rounded-lg text-xs transition-all border ${
                    isSelected
                      ? opt.isCorrect
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-medium'
                        : 'bg-rose-50 border-rose-400 text-rose-950 font-medium'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <span className="font-bold text-slate-400 shrink-0">
                      {String.fromCharCode(65 + i)}.
                    </span>
                    <span>{opt.text}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Retroalimentación inmediata */}
          {showFeedback && selectedExerciseOption !== null && (
            <div
              className={`p-3.5 rounded-lg border text-xs leading-relaxed flex items-start gap-2.5 ${
                activeCase.exercise.options[selectedExerciseOption].isCorrect
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-rose-50 border-rose-300 text-rose-900'
              }`}
            >
              {activeCase.exercise.options[selectedExerciseOption].isCorrect ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <span>{activeCase.exercise.options[selectedExerciseOption].feedback}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
