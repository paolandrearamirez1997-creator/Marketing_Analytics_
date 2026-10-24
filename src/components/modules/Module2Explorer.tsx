import React, { useState } from 'react';
import {
  Grid,
  Info,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Sliders,
  CheckCircle,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { BinaryConfusionMatrix, NormalizationMode } from '../../types';
import { calculateBinaryMetrics, normalizeBinaryMatrix } from '../../utils/metrics';

interface Module2ExplorerProps {
  matrix: BinaryConfusionMatrix;
  onChangeMatrix: (newMatrix: BinaryConfusionMatrix) => void;
  onGoToMetrics: () => void;
  onAwardXP: (amount: number, reason: string) => void;
  onUnlockBadge: (badgeId: string) => void;
}

const PRESETS: {
  id: string;
  name: string;
  description: string;
  matrix: BinaryConfusionMatrix;
}[] = [
  {
    id: 'balanced',
    name: 'Modelo Equilibrado',
    description: 'Distribución balanceada de clases con desempeño sólido en ambos cuadrantes.',
    matrix: { tp: 85, fn: 15, fp: 12, tn: 88 },
  },
  {
    id: 'imbalanced-fraud',
    name: 'Desbalance Severo (Fraude)',
    description: '1% de positivos reales. Evidencia la trampa de la exactitud.',
    matrix: { tp: 70, fn: 30, fp: 180, tn: 9720 },
  },
  {
    id: 'medical-screening',
    name: 'Tamizaje Médico Preventivo',
    description: 'Prioriza evitar a toda costa los falsos negativos (alto recall).',
    matrix: { tp: 95, fn: 5, fp: 140, tn: 1760 },
  },
  {
    id: 'spam-filter',
    name: 'Filtro Anti-Spam Estricto',
    description: 'Prioriza no mandar correos legítimos a la basura (alta precisión).',
    matrix: { tp: 320, fn: 80, fp: 5, tn: 2595 },
  },
  {
    id: 'random-coin',
    name: 'Clasificador Aleatorio (50/50)',
    description: 'Equivalente a lanzar una moneda al aire (MCC ≈ 0).',
    matrix: { tp: 250, fn: 250, fp: 250, tn: 250 },
  },
];

export const Module2Explorer: React.FC<Module2ExplorerProps> = ({
  matrix,
  onChangeMatrix,
  onGoToMetrics,
  onAwardXP,
  onUnlockBadge,
}) => {
  const [normMode, setNormMode] = useState<NormalizationMode>('none');
  const [hasInteracted, setHasInteracted] = useState(false);

  const metrics = calculateBinaryMetrics(matrix);
  const normalized = normalizeBinaryMatrix(matrix, normMode);

  const totalSamples = matrix.tp + matrix.tn + matrix.fp + matrix.fn;
  const actualPos = matrix.tp + matrix.fn;
  const actualNeg = matrix.tn + matrix.fp;
  const predPos = matrix.tp + matrix.fp;
  const predNeg = matrix.tn + matrix.fn;

  const handleCellChange = (key: keyof BinaryConfusionMatrix, valStr: string) => {
    const val = parseInt(valStr, 10);
    const validVal = isNaN(val) ? 0 : Math.max(0, val);
    const updated = { ...matrix, [key]: validVal };
    onChangeMatrix(updated);

    if (!hasInteracted) {
      setHasInteracted(true);
      onAwardXP(30, 'Modificaste los valores de la matriz de confusión');
      onUnlockBadge('badge-first-steps');
    }
  };

  const handleApplyPreset = (presetMatrix: BinaryConfusionMatrix) => {
    onChangeMatrix(presetMatrix);
    if (!hasInteracted) {
      setHasInteracted(true);
      onAwardXP(20, 'Cargaste un escenario predefinido');
    }
  };

  // Diagnóstico e interpretación automática
  const getAutoInterpretation = () => {
    if (totalSamples === 0) return 'La matriz está vacía. Introduce valores en las celdas.';

    const fpDominance = matrix.fp > matrix.fn;
    const fnDominance = matrix.fn > matrix.fp;
    const severeImbalance = actualNeg > actualPos * 5 || actualPos > actualNeg * 5;

    let text = '';
    if (fpDominance) {
      text += `Predominan los Falsos Positivos (${matrix.fp} FP vs ${matrix.fn} FN). El modelo es propenso a generar falsas alarmas, lo que incrementa los costos de revisión manual y causa fatiga o fricción con los usuarios. `;
    } else if (fnDominance) {
      text += `Predominan los Falsos Negativos (${matrix.fn} FN vs ${matrix.fp} FP). El modelo está dejando escapar casos positivos reales sin detectar. En entornos médicos o de ciberseguridad, esta es una condición de alto riesgo. `;
    } else {
      text += `Existe un equilibrio entre falsas alarmas (${matrix.fp} FP) y omisiones (${matrix.fn} FN). `;
    }

    if (severeImbalance) {
      text += `Atención: Hay un marcado desbalance de clases (${actualPos} positivos vs ${actualNeg} negativos). La Exactitud (${metrics.accuracy.percentage}) no debe usarse como único criterio; revisa el F1-Score (${metrics.f1.percentage}) y el Coeficiente MCC (${metrics.mcc.percentage}).`;
    }

    return text;
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Título */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
            <span>MÓDULO 02</span>
            <span aria-hidden="true">·</span>
            <span>EXPLORADOR INTERACTIVO</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
            Matriz de Confusión Dinámica 2×2
          </h1>
          <p className="mt-1 text-sm text-slate-600 max-w-2xl">
            Modifica las cantidades numéricas de aciertos y errores en tiempo real. Observa cómo
            impacta la normalización y la distribución de clases en el diagnóstico del modelo.
          </p>
        </div>

        <button
          onClick={onGoToMetrics}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-xs shrink-0"
        >
          <span>Ver las 11 Métricas</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Selector de Presets */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Escenarios Preconfigurados de Ejemplo
          </span>
          <span className="text-[11px] text-slate-400">Selecciona para cargar valores típicos</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => handleApplyPreset(p.matrix)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200/60"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Controles de Normalización */}
      <div className="flex items-center justify-between flex-wrap gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200/70">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700">Modo de Visualización:</span>
        </div>
        <div className="flex items-center gap-1.5 p-1 bg-white rounded-lg border border-slate-200 shadow-xs">
          <button
            onClick={() => setNormMode('none')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              normMode === 'none'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Frecuencias Absolutas
          </button>
          <button
            onClick={() => setNormMode('row')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              normMode === 'row'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            % por Fila (Clase Real)
          </button>
          <button
            onClick={() => setNormMode('col')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              normMode === 'col'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            % por Columna (Predicción)
          </button>
          <button
            onClick={() => setNormMode('all')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              normMode === 'all'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            % Total
          </button>
        </div>
      </div>

      {/* Explicación de la normalización activa */}
      <div className="text-xs text-slate-600 bg-indigo-50/60 border border-indigo-100 p-3 rounded-lg flex items-start gap-2">
        <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <div>
          {normMode === 'none' && (
            <span>
              <strong>Valores Absolutos:</strong> Muestra el conteo real de muestras clasificadas en
              cada cuadrante.
            </span>
          )}
          {normMode === 'row' && (
            <span>
              <strong>Normalización por Fila (Clase Real):</strong> Cada fila suma 100%. La diagonal
              muestra directamente el <strong>Recall / Sensibilidad</strong> de la clase positiva y la{' '}
              <strong>Especificidad</strong> de la clase negativa.
            </span>
          )}
          {normMode === 'col' && (
            <span>
              <strong>Normalización por Columna (Clase Predicha):</strong> Cada columna suma 100%. La
              diagonal muestra directamente la <strong>Precisión (PPV)</strong> y el{' '}
              <strong>Valor Predictivo Negativo (NPV)</strong>.
            </span>
          )}
          {normMode === 'all' && (
            <span>
              <strong>Normalización Global:</strong> Las 4 celdas suman 100% respecto a todas las
              muestras del estudio.
            </span>
          )}
        </div>
      </div>

      {/* LA MATRIZ 2×2 INTERACTIVA */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 lg:p-8 shadow-xs space-y-6">
        <div className="overflow-x-auto">
          <div className="min-w-[560px]">
            {/* Cabecera de Columnas (Predicho) */}
            <div className="grid grid-cols-[140px_1fr_1fr_100px] gap-3 text-center mb-2 items-end">
              <div className="text-left font-bold text-xs text-slate-400 uppercase tracking-wider">
                Real \ Predicho
              </div>
              <div className="p-2 bg-slate-100 rounded-lg text-xs font-bold text-slate-800">
                Predicho Positivo (+)
              </div>
              <div className="p-2 bg-slate-100 rounded-lg text-xs font-bold text-slate-800">
                Predicho Negativo (-)
              </div>
              <div className="text-xs font-bold text-slate-500">Total Real</div>
            </div>

            {/* Fila 1: Positivo Real */}
            <div className="grid grid-cols-[140px_1fr_1fr_100px] gap-3 items-center mb-3">
              <div className="p-3 bg-slate-100 rounded-lg text-xs font-bold text-slate-800">
                Positivo Real (+)
              </div>

              {/* Celda TP */}
              <div className="p-4 rounded-xl bg-emerald-50 border-2 border-emerald-300 relative group transition-all">
                <div className="flex items-center justify-between text-xs text-emerald-800 font-semibold mb-1">
                  <span>Verdadero Positivo (TP)</span>
                  <span className="text-[10px] bg-emerald-200/80 px-1.5 py-0.5 rounded text-emerald-900 font-bold">
                    Acierto
                  </span>
                </div>
                <div className="text-2xl font-extrabold text-emerald-900 tabular-nums">
                  {normMode === 'none'
                    ? matrix.tp.toLocaleString()
                    : `${normalized.tp.toFixed(1)}%`}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[11px] text-emerald-700">Editar conteo:</span>
                  <input
                    type="number"
                    min="0"
                    value={matrix.tp}
                    onChange={(e) => handleCellChange('tp', e.target.value)}
                    className="w-20 px-2 py-1 text-xs bg-white border border-emerald-300 rounded font-bold text-slate-900 focus:outline-emerald-500"
                  />
                </div>
              </div>

              {/* Celda FN */}
              <div className="p-4 rounded-xl bg-rose-50 border-2 border-rose-300 relative group transition-all">
                <div className="flex items-center justify-between text-xs text-rose-800 font-semibold mb-1">
                  <span>Falso Negativo (FN)</span>
                  <span className="text-[10px] bg-rose-200/80 px-1.5 py-0.5 rounded text-rose-900 font-bold">
                    Error Tipo II
                  </span>
                </div>
                <div className="text-2xl font-extrabold text-rose-900 tabular-nums">
                  {normMode === 'none'
                    ? matrix.fn.toLocaleString()
                    : `${normalized.fn.toFixed(1)}%`}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[11px] text-rose-700">Editar conteo:</span>
                  <input
                    type="number"
                    min="0"
                    value={matrix.fn}
                    onChange={(e) => handleCellChange('fn', e.target.value)}
                    className="w-20 px-2 py-1 text-xs bg-white border border-rose-300 rounded font-bold text-slate-900 focus:outline-rose-500"
                  />
                </div>
              </div>

              <div className="text-center font-bold text-sm text-slate-700 tabular-nums">
                {actualPos.toLocaleString()}
              </div>
            </div>

            {/* Fila 2: Negativo Real */}
            <div className="grid grid-cols-[140px_1fr_1fr_100px] gap-3 items-center mb-3">
              <div className="p-3 bg-slate-100 rounded-lg text-xs font-bold text-slate-800">
                Negativo Real (-)
              </div>

              {/* Celda FP */}
              <div className="p-4 rounded-xl bg-amber-50 border-2 border-amber-300 relative group transition-all">
                <div className="flex items-center justify-between text-xs text-amber-800 font-semibold mb-1">
                  <span>Falso Positivo (FP)</span>
                  <span className="text-[10px] bg-amber-200/80 px-1.5 py-0.5 rounded text-amber-900 font-bold">
                    Error Tipo I
                  </span>
                </div>
                <div className="text-2xl font-extrabold text-amber-900 tabular-nums">
                  {normMode === 'none'
                    ? matrix.fp.toLocaleString()
                    : `${normalized.fp.toFixed(1)}%`}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[11px] text-amber-700">Editar conteo:</span>
                  <input
                    type="number"
                    min="0"
                    value={matrix.fp}
                    onChange={(e) => handleCellChange('fp', e.target.value)}
                    className="w-20 px-2 py-1 text-xs bg-white border border-amber-300 rounded font-bold text-slate-900 focus:outline-amber-500"
                  />
                </div>
              </div>

              {/* Celda TN */}
              <div className="p-4 rounded-xl bg-emerald-50 border-2 border-emerald-300 relative group transition-all">
                <div className="flex items-center justify-between text-xs text-emerald-800 font-semibold mb-1">
                  <span>Verdadero Negativo (TN)</span>
                  <span className="text-[10px] bg-emerald-200/80 px-1.5 py-0.5 rounded text-emerald-900 font-bold">
                    Acierto
                  </span>
                </div>
                <div className="text-2xl font-extrabold text-emerald-900 tabular-nums">
                  {normMode === 'none'
                    ? matrix.tn.toLocaleString()
                    : `${normalized.tn.toFixed(1)}%`}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[11px] text-emerald-700">Editar conteo:</span>
                  <input
                    type="number"
                    min="0"
                    value={matrix.tn}
                    onChange={(e) => handleCellChange('tn', e.target.value)}
                    className="w-20 px-2 py-1 text-xs bg-white border border-emerald-300 rounded font-bold text-slate-900 focus:outline-emerald-500"
                  />
                </div>
              </div>

              <div className="text-center font-bold text-sm text-slate-700 tabular-nums">
                {actualNeg.toLocaleString()}
              </div>
            </div>

            {/* Fila de Totales Predichos */}
            <div className="grid grid-cols-[140px_1fr_1fr_100px] gap-3 text-center pt-2 border-t border-slate-200 items-center">
              <div className="text-xs font-bold text-slate-500 text-left">Total Predicho</div>
              <div className="font-bold text-sm text-slate-700 tabular-nums">
                {predPos.toLocaleString()}
              </div>
              <div className="font-bold text-sm text-slate-700 tabular-nums">
                {predNeg.toLocaleString()}
              </div>
              <div className="font-extrabold text-sm text-indigo-700 tabular-nums">
                {totalSamples.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Resumen de Métricas Inmediatas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-slate-100">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
            <span className="text-[11px] text-slate-500 block">Exactitud (Accuracy)</span>
            <span className="text-lg font-bold text-slate-900 tabular-nums">
              {metrics.accuracy.percentage}
            </span>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
            <span className="text-[11px] text-slate-500 block">Precisión (PPV)</span>
            <span className="text-lg font-bold text-indigo-600 tabular-nums">
              {metrics.precision.percentage}
            </span>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
            <span className="text-[11px] text-slate-500 block">Recall (Sensibilidad)</span>
            <span className="text-lg font-bold text-indigo-600 tabular-nums">
              {metrics.recall.percentage}
            </span>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
            <span className="text-[11px] text-slate-500 block">Puntaje F1</span>
            <span className="text-lg font-bold text-slate-900 tabular-nums">
              {metrics.f1.percentage}
            </span>
          </div>
        </div>

        {/* Diagnóstico Automático Contextual */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            <span>Interpretación Automática de Resultados</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">{getAutoInterpretation()}</p>
        </div>
      </div>
    </div>
  );
};
