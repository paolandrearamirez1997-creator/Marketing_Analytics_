import React, { useState } from 'react';
import {
  Calculator,
  Info,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  TrendingUp,
  Briefcase,
} from 'lucide-react';
import { BinaryConfusionMatrix } from '../../types';
import { calculateBinaryMetrics } from '../../utils/metrics';

interface Module3MetricsProps {
  matrix: BinaryConfusionMatrix;
  onUpdateMatrix: (newMatrix: BinaryConfusionMatrix) => void;
  onAwardXP: (amount: number, reason: string) => void;
}

export const Module3Metrics: React.FC<Module3MetricsProps> = ({
  matrix,
  onUpdateMatrix,
  onAwardXP,
}) => {
  const [beta, setBeta] = useState<number>(1.0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedMetricId, setExpandedMetricId] = useState<string | null>('precision');

  const metricsObj = calculateBinaryMetrics(matrix, beta);
  const metricsList = Object.values(metricsObj);

  const filteredMetrics =
    selectedCategory === 'all'
      ? metricsList
      : metricsList.filter((m) => m.category === selectedCategory);

  const handleBetaChange = (newBeta: number) => {
    setBeta(newBeta);
    onAwardXP(15, 'Ajustaste el parámetro beta en F-Beta');
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Encabezado */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
          <span>MÓDULO 03</span>
          <span aria-hidden="true">·</span>
          <span>CALCULADORA EXHAUSTIVA</span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
          Las 11 Métricas de Clasificación en Detalle
        </h1>
        <p className="mt-1 text-sm text-slate-600 max-w-3xl leading-relaxed">
          Cada métrica responde a una pregunta distinta sobre el clasificador. Consulta la fórmula
          matemática, los valores exactos calculados, sus limitaciones y cuándo utilizarla para tomar
          decisiones de negocio.
        </p>
      </div>

      {/* Control interactivo de Beta para F-Beta */}
      <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
              Control Dinámico de F-Beta (Importancia Recall vs Precisión)
            </h3>
          </div>
          <span className="text-xs font-bold text-indigo-700 bg-white px-2.5 py-1 rounded-md border border-indigo-200 shadow-xs tabular-nums">
            β = {beta.toFixed(1)}
          </span>
        </div>

        <input
          type="range"
          min="0.2"
          max="3.0"
          step="0.1"
          value={beta}
          onChange={(e) => handleBetaChange(parseFloat(e.target.value))}
          className="w-full accent-indigo-600 h-2 bg-indigo-200 rounded-lg cursor-pointer"
        />

        <div className="flex justify-between text-[11px] text-slate-600">
          <span>β = 0.5: Prioriza Precisión (evitar Falsos Positivos)</span>
          <span>β = 1.0: F1 Estándar (balance armónico)</span>
          <span>β = 2.0: Prioriza Recall (evitar Falsos Negativos)</span>
        </div>
      </div>

      {/* Filtro por Categorías */}
      <div className="flex items-center gap-2 flex-wrap border-b border-slate-200 pb-3">
        <span className="text-xs font-semibold text-slate-500 mr-2">Filtrar por:</span>
        {[
          { id: 'all', label: 'Todas las 11 Métricas' },
          { id: 'general', label: 'Generales (Exactitud)' },
          { id: 'positive_class', label: 'Clase Positiva (Precisión / Recall)' },
          { id: 'negative_class', label: 'Clase Negativa (Especificidad / NPV)' },
          { id: 'combined', label: 'Compuestas (F1 / F-Beta)' },
          { id: 'correlation', label: 'Correlación (MCC)' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedCategory(tab.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              selectedCategory === tab.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid de Tarjetas de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMetrics.map((m) => {
          const isExpanded = expandedMetricId === m.id;
          const isUndefined = m.value === null;

          return (
            <div
              key={m.id}
              className={`bg-white rounded-xl border transition-all ${
                isExpanded
                  ? 'border-indigo-400 ring-2 ring-indigo-50 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Encabezado de la tarjeta */}
              <div
                onClick={() => setExpandedMetricId(isExpanded ? null : m.id)}
                className="p-5 cursor-pointer flex items-start justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400 font-semibold">
                      {m.shortName}
                    </span>
                    <span className="text-sm font-bold text-slate-900">{m.name}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{m.interpretation}</p>
                </div>

                <div className="text-right shrink-0">
                  <div
                    className={`text-xl font-extrabold tabular-nums ${
                      isUndefined ? 'text-amber-600 text-base' : 'text-slate-900'
                    }`}
                  >
                    {m.percentage}
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {isExpanded ? 'Ocultar detalle ▲' : 'Ver detalle ▼'}
                  </span>
                </div>
              </div>

              {/* Detalle Desplegable */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-100 space-y-4 text-xs">
                  {/* Fórmula y valores sustituidos */}
                  <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 font-mono space-y-1">
                    <div className="text-slate-500 text-[11px]">Fórmula Teórica:</div>
                    <div className="text-indigo-900 font-bold">{m.formula}</div>
                    <div className="text-slate-500 text-[11px] pt-1 border-t border-slate-200/60">
                      Valores sustituidos:
                    </div>
                    <div className="text-slate-800 font-bold">{m.formulaExpanded}</div>
                  </div>

                  {/* Advertencia de indefinido si aplica */}
                  {isUndefined && m.undefinedReason && (
                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>Métrica Indefinida:</strong> {m.undefinedReason}
                      </span>
                    </div>
                  )}

                  {/* Significado Alto vs Bajo */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="p-2.5 bg-emerald-50/60 rounded-lg border border-emerald-100">
                      <span className="font-bold text-emerald-900 block mb-0.5">Resultado Alto:</span>
                      <span className="text-slate-600">{m.highMeaning}</span>
                    </div>
                    <div className="p-2.5 bg-rose-50/60 rounded-lg border border-rose-100">
                      <span className="font-bold text-rose-900 block mb-0.5">Resultado Bajo:</span>
                      <span className="text-slate-600">{m.lowMeaning}</span>
                    </div>
                  </div>

                  {/* Limitaciones */}
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-800 block mb-1">
                      Limitaciones y Errores de Interpretación:
                    </span>
                    <span className="text-slate-600 leading-relaxed">{m.limitations}</span>
                  </div>

                  {/* Decisión Empresarial */}
                  <div className="p-3 bg-indigo-50/50 rounded-lg border border-indigo-100 flex items-start gap-2">
                    <Briefcase className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-indigo-950 block mb-0.5">
                        Ejemplo de Decisión Empresarial:
                      </span>
                      <span className="text-slate-700 leading-relaxed">{m.businessExample}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
