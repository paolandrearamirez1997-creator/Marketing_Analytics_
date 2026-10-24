import React, { useState, useMemo } from 'react';
import {
  FileSpreadsheet,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Download,
  RotateCcw,
  Sparkles,
  Info,
  Table,
} from 'lucide-react';
import { SAMPLE_CSV_DATASETS } from '../../data/syntheticDatasets';
import {
  calculateBinaryMetrics,
  calculateMulticlassMetrics,
} from '../../utils/metrics';
import { BinaryConfusionMatrix, MulticlassMatrix } from '../../types';

interface Module6LabProps {
  onAwardXP: (amount: number, reason: string) => void;
  onUnlockBadge: (badgeId: string) => void;
}

export const Module6Lab: React.FC<Module6LabProps> = ({ onAwardXP, onUnlockBadge }) => {
  const [rawText, setRawText] = useState<string>(SAMPLE_CSV_DATASETS[0].content);
  const [actualCol, setActualCol] = useState<string>('clase_real');
  const [predictedCol, setPredictedCol] = useState<string>('clase_predicha');
  const [chosenPositiveClass, setChosenPositiveClass] = useState<string>('Incumple');
  const [hasProcessed, setHasProcessed] = useState<boolean>(true);

  // Parsear CSV / TSV de forma robusta
  const parsedData = useMemo(() => {
    if (!rawText.trim()) return { headers: [], rows: [], error: 'El contenido está vacío.' };

    const lines = rawText
      .trim()
      .split(/\r?\n/)
      .filter((line) => line.trim().length > 0);

    if (lines.length < 2) {
      return { headers: [], rows: [], error: 'El archivo debe contener encabezados y al menos una fila de datos.' };
    }

    // Detectar separador (, o ;)
    const delimiter = lines[0].includes(';') ? ';' : lines[0].includes('\t') ? '\t' : ',';
    const headers = lines[0].split(delimiter).map((h) => h.trim().replace(/^["']|["']$/g, ''));

    const rows: Record<string, string>[] = [];
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(delimiter).map((p) => p.trim().replace(/^["']|["']$/g, ''));
      if (parts.length === headers.length) {
        const rowObj: Record<string, string> = {};
        headers.forEach((h, idx) => {
          rowObj[h] = parts[idx];
        });
        rows.push(rowObj);
      }
    }

    return { headers, rows, error: null };
  }, [rawText]);

  // Lista de clases únicas encontradas en las columnas seleccionadas
  const detectedClasses = useMemo(() => {
    if (!parsedData.rows.length || !actualCol || !predictedCol) return [];
    const set = new Set<string>();
    parsedData.rows.forEach((r) => {
      if (r[actualCol]) set.add(r[actualCol]);
      if (r[predictedCol]) set.add(r[predictedCol]);
    });
    return Array.from(set).sort();
  }, [parsedData, actualCol, predictedCol]);

  // Asegurar que la clase positiva pertenezca a las clases detectadas
  React.useEffect(() => {
    if (detectedClasses.length === 2 && !detectedClasses.includes(chosenPositiveClass)) {
      setChosenPositiveClass(detectedClasses[0]);
    }
  }, [detectedClasses, chosenPositiveClass]);

  // Construcción de la matriz y cálculo
  const evaluationResult = useMemo(() => {
    if (parsedData.rows.length === 0 || detectedClasses.length < 2) return null;

    const isBinary = detectedClasses.length === 2;

    if (isBinary) {
      const posClass = chosenPositiveClass;
      const negClass = detectedClasses.find((c) => c !== posClass) || '';

      let tp = 0;
      let tn = 0;
      let fp = 0;
      let fn = 0;

      parsedData.rows.forEach((r) => {
        const actual = r[actualCol];
        const pred = r[predictedCol];

        if (actual === posClass && pred === posClass) tp++;
        else if (actual === negClass && pred === negClass) tn++;
        else if (actual === negClass && pred === posClass) fp++;
        else if (actual === posClass && pred === negClass) fn++;
      });

      const matrix: BinaryConfusionMatrix = { tp, tn, fp, fn };
      const metrics = calculateBinaryMetrics(matrix);

      return {
        isBinary: true,
        posClass,
        negClass,
        matrix,
        metrics,
        totalCount: parsedData.rows.length,
      };
    } else {
      // Multiclase N x N
      const n = detectedClasses.length;
      const matrix: number[][] = Array.from({ length: n }, () => Array(n).fill(0));

      const classToIndex = new Map<string, number>();
      detectedClasses.forEach((c, idx) => classToIndex.set(c, idx));

      parsedData.rows.forEach((r) => {
        const actualIdx = classToIndex.get(r[actualCol]);
        const predIdx = classToIndex.get(r[predictedCol]);
        if (actualIdx !== undefined && predIdx !== undefined) {
          matrix[actualIdx][predIdx]++;
        }
      });

      const multiData: MulticlassMatrix = {
        classes: detectedClasses,
        matrix,
        totalSamples: parsedData.rows.length,
      };

      const multiMetrics = calculateMulticlassMetrics(multiData);

      return {
        isBinary: false,
        multiData,
        multiMetrics,
        totalCount: parsedData.rows.length,
      };
    }
  }, [parsedData, detectedClasses, actualCol, predictedCol, chosenPositiveClass]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setRawText(content);
        onAwardXP(40, 'Cargaste un archivo CSV propio al laboratorio');
        onUnlockBadge('badge-data-scientist');
      }
    };
    reader.readAsText(file);
  };

  const handleLoadSample = (sampleId: string) => {
    const sample = SAMPLE_CSV_DATASETS.find((s) => s.id === sampleId);
    if (!sample) return;

    setRawText(sample.content);
    if (sample.id === 'credit-risk-binary') {
      setActualCol('clase_real');
      setPredictedCol('clase_predicha');
      setChosenPositiveClass('Incumple');
    } else if (sample.id === 'equipment-quality-multiclass') {
      setActualCol('estado_real');
      setPredictedCol('estado_predicho');
    }
    onAwardXP(25, 'Cargaste una plantilla de datos de prueba');
  };

  const handleDownloadReport = () => {
    if (!evaluationResult) return;

    let reportText = `=======================================================\n`;
    reportText += `   REPORTE DE EVALUACIÓN DE CLASIFICACIÓN - MATRIZLAB   \n`;
    reportText += `=======================================================\n\n`;
    reportText += `Total de muestras evaluadas: ${evaluationResult.totalCount}\n`;
    reportText += `Columna Real: ${actualCol} | Columna Predicha: ${predictedCol}\n\n`;

    if (evaluationResult.isBinary && evaluationResult.matrix && evaluationResult.metrics) {
      reportText += `Tipo: Clasificación Binaria (2 Clases)\n`;
      reportText += `Clase Positiva (+): ${evaluationResult.posClass}\n`;
      reportText += `Clase Negativa (-): ${evaluationResult.negClass}\n\n`;
      reportText += `Matriz de Confusión:\n`;
      reportText += `  TP: ${evaluationResult.matrix.tp} | FN: ${evaluationResult.matrix.fn}\n`;
      reportText += `  FP: ${evaluationResult.matrix.fp} | TN: ${evaluationResult.matrix.tn}\n\n`;
      reportText += `Métricas de Rendimiento:\n`;
      reportText += `  - Exactitud (Accuracy):  ${evaluationResult.metrics.accuracy.percentage}\n`;
      reportText += `  - Precisión (PPV):       ${evaluationResult.metrics.precision.percentage}\n`;
      reportText += `  - Recall / Sensibilidad: ${evaluationResult.metrics.recall.percentage}\n`;
      reportText += `  - Especificidad:         ${evaluationResult.metrics.specificity.percentage}\n`;
      reportText += `  - F1-Score:              ${evaluationResult.metrics.f1.percentage}\n`;
      reportText += `  - Balanced Accuracy:     ${evaluationResult.metrics.balancedAccuracy.percentage}\n`;
      reportText += `  - MCC (Matthews):        ${evaluationResult.metrics.mcc.percentage}\n`;
    } else if (evaluationResult.multiMetrics) {
      reportText += `Tipo: Clasificación Multiclase (${detectedClasses.length} Categorías)\n`;
      reportText += `Clases: ${detectedClasses.join(', ')}\n\n`;
      reportText += `Resumen Global:\n`;
      reportText += `  - Accuracy Global: ${(evaluationResult.multiMetrics.accuracy * 100).toFixed(2)}%\n`;
      reportText += `  - Macro F1-Score:  ${(evaluationResult.multiMetrics.macroF1 * 100).toFixed(2)}%\n`;
      reportText += `  - Weighted F1:     ${(evaluationResult.multiMetrics.weightedF1 * 100).toFixed(2)}%\n\n`;
      reportText += `Métricas por Clase:\n`;
      evaluationResult.multiMetrics.perClass.forEach((c) => {
        reportText += `  [${c.className}] Soporte: ${c.support} | Precision: ${(
          (c.precision ?? 0) * 100
        ).toFixed(1)}% | Recall: ${((c.recall ?? 0) * 100).toFixed(1)}% | F1: ${(
          (c.f1 ?? 0) * 100
        ).toFixed(1)}%\n`;
      });
    }

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reporte_matrizlab_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Encabezado */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
          <span>MÓDULO 06</span>
          <span aria-hidden="true">·</span>
          <span>LABORATORIO CON DATOS PROPIOS</span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
          Laboratorio de Clasificación (CSV / Multiclase N×N)
        </h1>
        <p className="mt-1 text-sm text-slate-600 max-w-3xl leading-relaxed">
          Carga un archivo con las predicciones de tu propio modelo. Selecciona las columnas, elige la
          clase positiva y genera automáticamente la matriz de confusión y el reporte de desempeño.
        </p>
      </div>

      {/* Controles de Carga y Plantillas */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Fuente de Datos
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <label className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg cursor-pointer transition-colors flex items-center gap-1.5 shadow-xs">
              <Upload className="w-3.5 h-3.5" />
              <span>Subir Archivo (.csv / .txt)</span>
              <input
                type="file"
                accept=".csv,.txt,.tsv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Cargar Plantilla Rápida */}
        <div className="flex items-center gap-2 flex-wrap text-xs text-slate-600 pt-2 border-t border-slate-100">
          <span className="font-semibold text-slate-700">O prueba con datos precalibrados:</span>
          {SAMPLE_CSV_DATASETS.map((s) => (
            <button
              key={s.id}
              onClick={() => handleLoadSample(s.id)}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors border border-slate-200/60"
            >
              {s.name}
            </button>
          ))}
        </div>

        {/* Textarea para pegar datos o editar */}
        <div>
          <label className="text-xs font-semibold text-slate-600 block mb-1">
            Vista previa del contenido tabular (editable directamente):
          </label>
          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            rows={5}
            className="w-full font-mono text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-indigo-500"
            placeholder="pega aquí tus columnas separadas por coma..."
          />
        </div>
      </div>

      {/* Mapeo de Columnas */}
      {parsedData.headers.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Configuración de Columnas y Clases
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Columna de Etiqueta Real:
              </label>
              <select
                value={actualCol}
                onChange={(e) => setActualCol(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900"
              >
                {parsedData.headers.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Columna de Etiqueta Predicha:
              </label>
              <select
                value={predictedCol}
                onChange={(e) => setPredictedCol(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900"
              >
                {parsedData.headers.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>

            {/* Selector de clase positiva en caso binario */}
            {detectedClasses.length === 2 && (
              <div>
                <label className="text-xs font-semibold text-indigo-700 block mb-1">
                  Selecciona la Clase Positiva (+):
                </label>
                <select
                  value={chosenPositiveClass}
                  onChange={(e) => setChosenPositiveClass(e.target.value)}
                  className="w-full p-2 bg-indigo-50 border border-indigo-200 rounded-lg text-xs font-bold text-indigo-950"
                >
                  {detectedClasses.map((c) => (
                    <option key={c} value={c}>
                      {c} (Clase de Interés)
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>
              Clases detectadas en el archivo ({detectedClasses.length}):{' '}
              <strong>{detectedClasses.join(', ')}</strong>
            </span>
          </div>
        </div>
      )}

      {/* RESULTADOS DE LA EVALUACIÓN */}
      {evaluationResult && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 lg:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {evaluationResult.isBinary ? 'Clasificación Binaria' : 'Clasificación Multiclase N×N'}
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-1">
                Diagnóstico del Modelo sobre {evaluationResult.totalCount} Instancias
              </h2>
            </div>

            <button
              onClick={handleDownloadReport}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 border border-slate-200/80"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar Reporte (.txt)</span>
            </button>
          </div>

          {/* Si es Binario */}
          {evaluationResult.isBinary && evaluationResult.matrix && evaluationResult.metrics && (
            <div className="space-y-6">
              {/* Matriz 2x2 */}
              <div className="grid grid-cols-2 gap-3 max-w-md mx-auto text-center text-xs">
                <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-xl">
                  <span className="text-[10px] text-emerald-800 font-bold block uppercase">
                    Verdadero Positivo (TP)
                  </span>
                  <span className="text-3xl font-black text-emerald-900 tabular-nums">
                    {evaluationResult.matrix.tp}
                  </span>
                  <span className="text-[11px] text-slate-600 block mt-1">
                    {evaluationResult.posClass} acertado
                  </span>
                </div>

                <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-xl">
                  <span className="text-[10px] text-rose-800 font-bold block uppercase">
                    Falso Negativo (FN)
                  </span>
                  <span className="text-3xl font-black text-rose-900 tabular-nums">
                    {evaluationResult.matrix.fn}
                  </span>
                  <span className="text-[11px] text-slate-600 block mt-1">
                    {evaluationResult.posClass} omitido
                  </span>
                </div>

                <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-xl">
                  <span className="text-[10px] text-amber-800 font-bold block uppercase">
                    Falso Positivo (FP)
                  </span>
                  <span className="text-3xl font-black text-amber-900 tabular-nums">
                    {evaluationResult.matrix.fp}
                  </span>
                  <span className="text-[11px] text-slate-600 block mt-1">
                    Falsa alarma de {evaluationResult.posClass}
                  </span>
                </div>

                <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-xl">
                  <span className="text-[10px] text-emerald-800 font-bold block uppercase">
                    Verdadero Negativo (TN)
                  </span>
                  <span className="text-3xl font-black text-emerald-900 tabular-nums">
                    {evaluationResult.matrix.tn}
                  </span>
                  <span className="text-[11px] text-slate-600 block mt-1">
                    {evaluationResult.negClass} acertado
                  </span>
                </div>
              </div>

              {/* Grid de Métricas Binarias */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                  <span className="text-[11px] text-slate-500 block">Exactitud (Accuracy)</span>
                  <span className="text-base font-bold text-slate-900 tabular-nums">
                    {evaluationResult.metrics.accuracy.percentage}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                  <span className="text-[11px] text-slate-500 block">Precisión (PPV)</span>
                  <span className="text-base font-bold text-indigo-700 tabular-nums">
                    {evaluationResult.metrics.precision.percentage}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                  <span className="text-[11px] text-slate-500 block">Recall (Sensibilidad)</span>
                  <span className="text-base font-bold text-indigo-700 tabular-nums">
                    {evaluationResult.metrics.recall.percentage}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                  <span className="text-[11px] text-slate-500 block">F1-Score</span>
                  <span className="text-base font-bold text-slate-900 tabular-nums">
                    {evaluationResult.metrics.f1.percentage}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Si es Multiclase N x N */}
          {!evaluationResult.isBinary && evaluationResult.multiData && evaluationResult.multiMetrics && (
            <div className="space-y-6">
              {/* Matriz N x N */}
              <div className="overflow-x-auto">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Matriz Multiclase de Contingencia (Real en Filas vs Predicho en Columnas)
                </h4>
                <table className="w-full text-xs text-center border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700">
                      <th className="p-2.5 text-left border border-slate-200">Real \ Predicho</th>
                      {evaluationResult.multiData.classes.map((cls) => (
                        <th key={cls} className="p-2.5 border border-slate-200 font-bold">
                          {cls}
                        </th>
                      ))}
                      <th className="p-2.5 border border-slate-200 font-bold bg-slate-200/70">
                        Total Real
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {evaluationResult.multiData.classes.map((rowClass, r) => {
                      const rowSum = evaluationResult.multiData.matrix[r].reduce((a, b) => a + b, 0);
                      return (
                        <tr key={rowClass} className="hover:bg-slate-50">
                          <td className="p-2.5 text-left font-bold border border-slate-200 bg-slate-50">
                            {rowClass}
                          </td>
                          {evaluationResult.multiData.classes.map((colClass, c) => {
                            const val = evaluationResult.multiData.matrix[r][c];
                            const isHit = r === c;
                            return (
                              <td
                                key={colClass}
                                className={`p-2.5 border border-slate-200 font-bold tabular-nums ${
                                  isHit
                                    ? 'bg-emerald-100/70 text-emerald-950 font-extrabold'
                                    : val > 0
                                    ? 'bg-rose-50 text-rose-800'
                                    : 'text-slate-400'
                                }`}
                              >
                                {val}
                              </td>
                            );
                          })}
                          <td className="p-2.5 border border-slate-200 font-bold bg-slate-100 tabular-nums">
                            {rowSum}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Métricas por Clase (One-vs-Rest) */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Métricas Desglosadas por Categoría (One-vs-Rest)
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border border-slate-200 text-left">
                    <thead className="bg-slate-50 text-slate-600">
                      <tr>
                        <th className="p-2.5 border-b">Clase</th>
                        <th className="p-2.5 border-b">Soporte (Instancias)</th>
                        <th className="p-2.5 border-b">Precisión</th>
                        <th className="p-2.5 border-b">Recall</th>
                        <th className="p-2.5 border-b">F1-Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {evaluationResult.multiMetrics.perClass.map((c) => (
                        <tr key={c.className} className="border-b hover:bg-slate-50">
                          <td className="p-2.5 font-bold text-slate-900">{c.className}</td>
                          <td className="p-2.5 tabular-nums text-slate-600">{c.support}</td>
                          <td className="p-2.5 tabular-nums font-semibold text-slate-800">
                            {c.precision !== null ? `${(c.precision * 100).toFixed(1)}%` : 'Indefinido'}
                          </td>
                          <td className="p-2.5 tabular-nums font-semibold text-slate-800">
                            {c.recall !== null ? `${(c.recall * 100).toFixed(1)}%` : 'Indefinido'}
                          </td>
                          <td className="p-2.5 tabular-nums font-bold text-indigo-700">
                            {c.f1 !== null ? `${(c.f1 * 100).toFixed(1)}%` : 'Indefinido'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Promedios Globales Multiclase */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                  <span className="text-[11px] text-slate-500 block">Exactitud Global</span>
                  <span className="text-base font-bold text-slate-900 tabular-nums">
                    {(evaluationResult.multiMetrics.accuracy * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                  <span className="text-[11px] text-slate-500 block">Macro F1 (Simple)</span>
                  <span className="text-base font-bold text-indigo-700 tabular-nums">
                    {(evaluationResult.multiMetrics.macroF1 * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                  <span className="text-[11px] text-slate-500 block">Micro F1</span>
                  <span className="text-base font-bold text-slate-900 tabular-nums">
                    {(evaluationResult.multiMetrics.microF1 * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                  <span className="text-[11px] text-slate-500 block">Weighted F1 (Ponderado)</span>
                  <span className="text-base font-bold text-emerald-700 tabular-nums">
                    {(evaluationResult.multiMetrics.weightedF1 * 100).toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
