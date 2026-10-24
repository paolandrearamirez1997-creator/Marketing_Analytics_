import React, { useState, useMemo } from 'react';
import {
  Sliders,
  DollarSign,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  BarChart2,
  Scale,
} from 'lucide-react';
import { BinaryConfusionMatrix, CostMatrixConfig } from '../../types';
import {
  PROBABILITY_BENCHMARK_DATA,
  calculateMatrixFromThreshold,
} from '../../data/syntheticDatasets';
import { calculateBinaryMetrics, calculateEconomicImpact } from '../../utils/metrics';

interface Module4SimulatorProps {
  onAwardXP: (amount: number, reason: string) => void;
  onUnlockBadge: (badgeId: string) => void;
}

export const Module4Simulator: React.FC<Module4SimulatorProps> = ({
  onAwardXP,
  onUnlockBadge,
}) => {
  const [activeTab, setActiveTab] = useState<'threshold' | 'ab_test'>('threshold');

  // Estado del Simulador de Umbral (Tab 1)
  const [threshold, setThreshold] = useState<number>(0.5);
  const [thresholdInteracted, setThresholdInteracted] = useState(false);

  // Recalcular la matriz real para el umbral seleccionado usando las 250 muestras probabilísticas
  const thresholdMatrix = useMemo(() => {
    return calculateMatrixFromThreshold(PROBABILITY_BENCHMARK_DATA, threshold);
  }, [threshold]);

  const thresholdMetrics = useMemo(() => {
    return calculateBinaryMetrics(thresholdMatrix);
  }, [thresholdMatrix]);

  // Estado del Comparador A/B (Tab 2)
  const [modelA, setModelA] = useState<BinaryConfusionMatrix>({
    tp: 92,
    fn: 8,
    fp: 80,
    tn: 820,
  });
  const [modelB, setModelB] = useState<BinaryConfusionMatrix>({
    tp: 75,
    fn: 25,
    fp: 15,
    tn: 885,
  });

  const [costs, setCosts] = useState<CostMatrixConfig>({
    costFP: 25, // Falsa alarma cuesta $25 en revisión
    costFN: 600, // Error no detectado cuesta $600
    benefitTP: 600, // Detección previene pérdida de $600
    benefitTN: 0,
  });

  const metricsA = useMemo(() => calculateBinaryMetrics(modelA), [modelA]);
  const metricsB = useMemo(() => calculateBinaryMetrics(modelB), [modelB]);

  const economicA = useMemo(() => calculateEconomicImpact(modelA, costs), [modelA, costs]);
  const economicB = useMemo(() => calculateEconomicImpact(modelB, costs), [modelB, costs]);

  const handleThresholdChange = (val: number) => {
    setThreshold(val);
    if (!thresholdInteracted) {
      setThresholdInteracted(true);
      onAwardXP(35, 'Experimentaste con el simulador de umbrales continuos');
      onUnlockBadge('badge-threshold-tuner');
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Encabezado */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
          <span>MÓDULO 04</span>
          <span aria-hidden="true">·</span>
          <span>SIMULADOR DE DECISIONES & UMBRALES</span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
          Simulador de Umbral y Comparativa A/B de Modelos
        </h1>
        <p className="mt-1 text-sm text-slate-600 max-w-3xl leading-relaxed">
          Comprueba de forma empírica cómo mover el umbral de corte $\tau$ afecta la matriz de
          confusión sobre un conjunto de probabilidades reales, y simula cuál modelo genera mayor
          valor económico bajo costos asimétricos.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('threshold')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === 'threshold'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>1. Simulador de Umbral Continuo (Dataset Real de 250 Probabilidades)</span>
        </button>
        <button
          onClick={() => setActiveTab('ab_test')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === 'ab_test'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:text-slate-900'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>2. Comparador A/B con Matriz de Costos Económicos</span>
        </button>
      </div>

      {/* CONTENIDO TAB 1: SIMULADOR DE UMBRAL */}
      {activeTab === 'threshold' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Control del Umbral de Decisión ($\tau$)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Las predicciones se asignan como Positivas si la probabilidad calculada $P(Y=1) \ge \tau$.
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block font-medium">Umbral actual</span>
                <span className="text-2xl font-black text-indigo-600 tabular-nums">
                  $\tau$ = {threshold.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Slider de Umbral */}
            <div className="space-y-2">
              <input
                type="range"
                min="0.05"
                max="0.95"
                step="0.02"
                value={threshold}
                onChange={(e) => handleThresholdChange(parseFloat(e.target.value))}
                className="w-full accent-indigo-600 h-2.5 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                <span>0.05 (Ultrarreceptivo / Máximo Recall)</span>
                <span>0.50 (Estándar neutral)</span>
                <span>0.95 (Ultraconservador / Máxima Precisión)</span>
              </div>
            </div>

            {/* Visualizador de Distribución de Puntuaciones */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">
                  Corte sobre las 250 muestras probabilísticas:
                </span>
                <span className="text-slate-500">
                  50 Positivos Reales · 200 Negativos Reales
                </span>
              </div>
              <div className="relative h-6 bg-slate-200 rounded-md overflow-hidden flex">
                <div
                  className="bg-emerald-500 h-full flex items-center justify-center text-[10px] text-white font-bold transition-all"
                  style={{ width: `${threshold * 100}%` }}
                >
                  Zona Negativa (&lt; {threshold.toFixed(2)})
                </div>
                <div
                  className="bg-indigo-600 h-full flex items-center justify-center text-[10px] text-white font-bold transition-all"
                  style={{ width: `${(1 - threshold) * 100}%` }}
                >
                  Zona Positiva (&ge; {threshold.toFixed(2)})
                </div>
              </div>
            </div>

            {/* Matriz resultante en tiempo real */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center pt-2">
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Matriz de Confusión Resultante
                </h4>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-lg">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase block">
                      TP (Aciertos +)
                    </span>
                    <span className="text-2xl font-black text-emerald-900 tabular-nums">
                      {thresholdMatrix.tp}
                    </span>
                    <span className="text-[11px] text-emerald-700 block mt-0.5">
                      de 50 positivos
                    </span>
                  </div>

                  <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-lg">
                    <span className="text-[10px] font-bold text-rose-800 uppercase block">
                      FN (Omisiones)
                    </span>
                    <span className="text-2xl font-black text-rose-900 tabular-nums">
                      {thresholdMatrix.fn}
                    </span>
                    <span className="text-[11px] text-rose-700 block mt-0.5">
                      de 50 positivos
                    </span>
                  </div>

                  <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-lg">
                    <span className="text-[10px] font-bold text-amber-800 uppercase block">
                      FP (Falsas Alarmas)
                    </span>
                    <span className="text-2xl font-black text-amber-900 tabular-nums">
                      {thresholdMatrix.fp}
                    </span>
                    <span className="text-[11px] text-amber-700 block mt-0.5">
                      de 200 negativos
                    </span>
                  </div>

                  <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-lg">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase block">
                      TN (Aciertos -)
                    </span>
                    <span className="text-2xl font-black text-emerald-900 tabular-nums">
                      {thresholdMatrix.tn}
                    </span>
                    <span className="text-[11px] text-emerald-700 block mt-0.5">
                      de 200 negativos
                    </span>
                  </div>
                </div>
              </div>

              {/* Métricas clave en este umbral */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Métricas Dinámicas para $\tau = {threshold.toFixed(2)}$
                </h4>
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-xs font-semibold text-slate-700">
                      Recall / Sensibilidad (TPR):
                    </span>
                    <span className="text-sm font-bold text-indigo-700 tabular-nums">
                      {thresholdMetrics.recall.percentage}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-xs font-semibold text-slate-700">Precisión (PPV):</span>
                    <span className="text-sm font-bold text-indigo-700 tabular-nums">
                      {thresholdMetrics.precision.percentage}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-xs font-semibold text-slate-700">Puntaje F1:</span>
                    <span className="text-sm font-bold text-slate-900 tabular-nums">
                      {thresholdMetrics.f1.percentage}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-xs font-semibold text-slate-700">
                      Tasa Falsos Positivos (FPR):
                    </span>
                    <span className="text-sm font-bold text-amber-700 tabular-nums">
                      {thresholdMetrics.fpr.percentage}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recomendación Pedagógica del Umbral */}
            <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100 text-xs text-indigo-950 space-y-1">
              <span className="font-bold flex items-center gap-1.5 text-indigo-900">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                Diagnóstico del Trade-off en este umbral:
              </span>
              <p className="leading-relaxed">
                {threshold <= 0.3
                  ? `Umbral bajo (${threshold.toFixed(2)}): Excelente Recall (${thresholdMetrics.recall.percentage}), detectando ${thresholdMatrix.tp} de 50 positivos. Sin embargo, la Precisión decae a ${thresholdMetrics.precision.percentage} debido a ${thresholdMatrix.fp} falsas alarmas. Ideal para detección de fraude severo o triaje médico oncológico.`
                  : threshold >= 0.7
                  ? `Umbral alto (${threshold.toFixed(2)}): Alta Precisión (${thresholdMetrics.precision.percentage}) con muy pocas falsas alarmas (${thresholdMatrix.fp} FP). No obstante, el Recall cae a ${thresholdMetrics.recall.percentage}, dejando escapar ${thresholdMatrix.fn} casos positivos reales. Ideal para filtros de spam o campañas de ventas muy costosas.`
                  : `Umbral intermedio (${threshold.toFixed(2)}): Equilibrio estándar. F1-Score actual: ${thresholdMetrics.f1.percentage}. Si los costos de FP y FN son idénticos, suele ser el rango de compromiso razonable.`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CONTENIDO TAB 2: COMPARADOR A/B CON MATRIZ DE COSTOS */}
      {activeTab === 'ab_test' && (
        <div className="space-y-6">
          {/* Configuración de Costos */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Configuración de la Matriz de Costos y Beneficios
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">
                Ajusta el valor monetario asignado a cada tipo de acierto o error
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                <label className="text-[11px] font-semibold text-amber-900 block mb-1">
                  Costo de Falso Positivo (FP)
                </label>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-slate-500">$</span>
                  <input
                    type="number"
                    min="0"
                    value={costs.costFP}
                    onChange={(e) =>
                      setCosts({ ...costs, costFP: Math.max(0, parseInt(e.target.value) || 0) })
                    }
                    className="w-full bg-white border border-amber-300 rounded px-2 py-1 text-xs font-bold text-slate-900"
                  />
                </div>
                <span className="text-[10px] text-amber-700 block mt-1">Costo de falsa alarma</span>
              </div>

              <div className="p-3 bg-rose-50 rounded-lg border border-rose-200">
                <label className="text-[11px] font-semibold text-rose-900 block mb-1">
                  Costo de Falso Negativo (FN)
                </label>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-slate-500">$</span>
                  <input
                    type="number"
                    min="0"
                    value={costs.costFN}
                    onChange={(e) =>
                      setCosts({ ...costs, costFN: Math.max(0, parseInt(e.target.value) || 0) })
                    }
                    className="w-full bg-white border border-rose-300 rounded px-2 py-1 text-xs font-bold text-slate-900"
                  />
                </div>
                <span className="text-[10px] text-rose-700 block mt-1">Costo de no detectar</span>
              </div>

              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <label className="text-[11px] font-semibold text-emerald-900 block mb-1">
                  Beneficio de Verdadero Positivo (TP)
                </label>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-slate-500">$</span>
                  <input
                    type="number"
                    min="0"
                    value={costs.benefitTP}
                    onChange={(e) =>
                      setCosts({ ...costs, benefitTP: Math.max(0, parseInt(e.target.value) || 0) })
                    }
                    className="w-full bg-white border border-emerald-300 rounded px-2 py-1 text-xs font-bold text-slate-900"
                  />
                </div>
                <span className="text-[10px] text-emerald-700 block mt-1">Valor recuperado/ganado</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Beneficio de Verdadero Negativo (TN)
                </label>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-slate-500">$</span>
                  <input
                    type="number"
                    min="0"
                    value={costs.benefitTN}
                    onChange={(e) =>
                      setCosts({ ...costs, benefitTN: Math.max(0, parseInt(e.target.value) || 0) })
                    }
                    className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs font-bold text-slate-900"
                  />
                </div>
                <span className="text-[10px] text-slate-500 block mt-1">Normalmente $0</span>
              </div>
            </div>
          </div>

          {/* Comparación Visual Lado a Lado: Modelo A vs Modelo B */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Modelo A */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-sm font-bold text-slate-900">Modelo A (Sensible / Alto Recall)</span>
                <span className="text-xs text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded">
                  F1: {metricsA.f1.percentage}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="bg-emerald-50 p-2 rounded border border-emerald-200">
                  <span className="text-slate-500 block">TP: {modelA.tp}</span>
                  <span className="font-bold text-emerald-800">Recall: {metricsA.recall.percentage}</span>
                </div>
                <div className="bg-rose-50 p-2 rounded border border-rose-200">
                  <span className="text-slate-500 block">FN: {modelA.fn}</span>
                  <span className="font-bold text-rose-800">
                    Costo FN: ${(modelA.fn * costs.costFN).toLocaleString()}
                  </span>
                </div>
                <div className="bg-amber-50 p-2 rounded border border-amber-200">
                  <span className="text-slate-500 block">FP: {modelA.fp}</span>
                  <span className="font-bold text-amber-800">
                    Costo FP: ${(modelA.fp * costs.costFP).toLocaleString()}
                  </span>
                </div>
                <div className="bg-emerald-50 p-2 rounded border border-emerald-200">
                  <span className="text-slate-500 block">TN: {modelA.tn}</span>
                  <span className="font-bold text-emerald-800">Prec: {metricsA.precision.percentage}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Costo Total Errores:</span>
                  <span className="font-bold text-rose-700 tabular-nums">
                    -${economicA.totalCost.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Beneficio Aciertos:</span>
                  <span className="font-bold text-emerald-700 tabular-nums">
                    +${economicA.totalBenefit.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200 text-sm font-extrabold">
                  <span className="text-slate-800">Impacto Neto Modelo A:</span>
                  <span
                    className={`tabular-nums ${
                      economicA.netValue >= 0 ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    ${economicA.netValue.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Modelo B */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-sm font-bold text-slate-900">Modelo B (Conservador / Alta Precisión)</span>
                <span className="text-xs text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded">
                  F1: {metricsB.f1.percentage}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="bg-emerald-50 p-2 rounded border border-emerald-200">
                  <span className="text-slate-500 block">TP: {modelB.tp}</span>
                  <span className="font-bold text-emerald-800">Recall: {metricsB.recall.percentage}</span>
                </div>
                <div className="bg-rose-50 p-2 rounded border border-rose-200">
                  <span className="text-slate-500 block">FN: {modelB.fn}</span>
                  <span className="font-bold text-rose-800">
                    Costo FN: ${(modelB.fn * costs.costFN).toLocaleString()}
                  </span>
                </div>
                <div className="bg-amber-50 p-2 rounded border border-amber-200">
                  <span className="text-slate-500 block">FP: {modelB.fp}</span>
                  <span className="font-bold text-amber-800">
                    Costo FP: ${(modelB.fp * costs.costFP).toLocaleString()}
                  </span>
                </div>
                <div className="bg-emerald-50 p-2 rounded border border-emerald-200">
                  <span className="text-slate-500 block">TN: {modelB.tn}</span>
                  <span className="font-bold text-emerald-800">Prec: {metricsB.precision.percentage}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Costo Total Errores:</span>
                  <span className="font-bold text-rose-700 tabular-nums">
                    -${economicB.totalCost.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Beneficio Aciertos:</span>
                  <span className="font-bold text-emerald-700 tabular-nums">
                    +${economicB.totalBenefit.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200 text-sm font-extrabold">
                  <span className="text-slate-800">Impacto Neto Modelo B:</span>
                  <span
                    className={`tabular-nums ${
                      economicB.netValue >= 0 ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    ${economicB.netValue.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Dictamen Económico Final */}
          <div className="p-5 bg-emerald-50/80 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>
                Dictamen de Decisión Empresarial:{' '}
                {economicA.netValue > economicB.netValue
                  ? 'Recomendado: Modelo A'
                  : 'Recomendado: Modelo B'}
              </span>
            </div>
            <p className="leading-relaxed">
              {economicA.netValue > economicB.netValue ? (
                <>
                  El <strong>Modelo A</strong> produce un valor neto mayor de{' '}
                  <strong>${economicA.netValue.toLocaleString()}</strong> (diferencia a favor de{' '}
                  <strong>${(economicA.netValue - economicB.netValue).toLocaleString()}</strong>).
                  Aunque el Modelo A genera más falsas alarmas (80 FP vs 15 FP), el costo de cada
                  falso negativo ($600) hace que capturar 17 positivos reales adicionales compense con
                  creces el gasto operativo.
                </>
              ) : (
                <>
                  El <strong>Modelo B</strong> produce un valor neto mayor de{' '}
                  <strong>${economicB.netValue.toLocaleString()}</strong> (diferencia a favor de{' '}
                  <strong>${(economicB.netValue - economicA.netValue).toLocaleString()}</strong>). La
                  alta precisión del Modelo B ahorra costos significativos de falsas alarmas.
                </>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
