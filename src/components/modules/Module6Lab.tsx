import React, { useState, useMemo, useEffect, useRef } from 'react';
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
  ArrowRight,
  Sliders,
  TrendingUp,
  FileText,
  Copy,
  ChevronRight,
  Layers,
  Database,
  Filter,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { SAMPLE_CSV_DATASETS } from '../../data/syntheticDatasets';
import {
  calculateBinaryMetrics,
  calculateMulticlassMetrics,
  normalizeBinaryMatrix,
} from '../../utils/metrics';
import { BinaryConfusionMatrix, MulticlassMatrix, NormalizationMode } from '../../types';

interface Module6LabProps {
  onAwardXP: (amount: number, reason: string) => void;
  onUnlockBadge: (badgeId: string) => void;
  onApplyMatrixToExplorer?: (matrix: BinaryConfusionMatrix) => void;
  onNavigateToModule?: (moduleId: string) => void;
}

export const Module6Lab: React.FC<Module6LabProps> = ({
  onAwardXP,
  onUnlockBadge,
  onApplyMatrixToExplorer,
  onNavigateToModule,
}) => {
  // Estado de los datos
  const [rawText, setRawText] = useState<string>(SAMPLE_CSV_DATASETS[0].content);
  const [fileName, setFileName] = useState<string>('datos_evaluacion_crediticia.csv');
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Mapeo de columnas
  const [actualCol, setActualCol] = useState<string>('');
  const [predMode, setPredMode] = useState<'discrete' | 'probability'>('discrete');
  const [predictedCol, setPredictedCol] = useState<string>('');
  const [probabilityCol, setProbabilityCol] = useState<string>('');
  const [customThreshold, setCustomThreshold] = useState<number>(0.5);

  // Clase positiva seleccionada (para binario)
  const [chosenPositiveClass, setChosenPositiveClass] = useState<string>('');
  const [normalizationMode, setNormalizationMode] = useState<NormalizationMode>('none');

  // Paginación de vista previa
  const [previewPage, setPreviewPage] = useState<number>(1);
  const rowsPerPage = 6;

  // Feedback de copia
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Parsear datos estructurados usando PapaParse
  const parsedData = useMemo(() => {
    if (!rawText.trim()) {
      return { headers: [], rows: [] as Record<string, string>[], error: 'No hay datos cargados.' };
    }

    try {
      const results = Papa.parse<Record<string, string>>(rawText, {
        header: true,
        skipEmptyLines: 'greedy',
        transformHeader: (h) => h.trim(),
        transform: (val) => val.trim(),
      });

      const headers = results.meta.fields?.filter((f) => f.length > 0) || [];
      const rows = results.data.filter((row) =>
        Object.values(row).some((v) => v !== undefined && v !== '')
      );

      return { headers, rows, error: null };
    } catch (err) {
      return { headers: [], rows: [], error: 'Error al interpretar el formato tabular.' };
    }
  }, [rawText]);

  // Selección automática inteligente de columnas (Auto-mapping)
  useEffect(() => {
    if (parsedData.headers.length === 0) return;

    // Buscar columna real
    const actualKeywords = ['real', 'true', 'actual', 'y_true', 'ground_truth', 'target', 'clase_real', 'estado_real', 'diagnostico', 'etiqueta'];
    const matchedActual = parsedData.headers.find((h) =>
      actualKeywords.some((k) => h.toLowerCase().includes(k))
    ) || parsedData.headers[0];

    setActualCol(matchedActual);

    // Buscar columna de predicción discreta
    const predKeywords = ['pred', 'prediction', 'y_pred', 'clase_predicha', 'clasificacion', 'predicho', 'estado_predicho'];
    const matchedPred = parsedData.headers.find(
      (h) => h !== matchedActual && predKeywords.some((k) => h.toLowerCase().includes(k))
    ) || parsedData.headers[1] || '';

    setPredictedCol(matchedPred);

    // Buscar columna de probabilidad continua si existe
    const probKeywords = ['prob', 'probability', 'probabilidad', 'score', 'confianza', 'p_value'];
    const matchedProb = parsedData.headers.find((h) =>
      probKeywords.some((k) => h.toLowerCase().includes(k))
    );

    if (matchedProb) {
      setProbabilityCol(matchedProb);
      // Si el dataset tiene probabilidades, mantener el modo discreto si ya hay predicción, pero tener la columna lista
    } else {
      setProbabilityCol('');
    }
  }, [parsedData.headers]);

  // Clases detectadas en la columna de etiquetas reales
  const detectedClasses = useMemo(() => {
    if (!parsedData.rows.length || !actualCol) return [];
    const set = new Set<string>();
    parsedData.rows.forEach((r) => {
      const val = r[actualCol];
      if (val !== undefined && val !== null && val !== '') {
        set.add(val);
      }
    });

    if (predMode === 'discrete' && predictedCol) {
      parsedData.rows.forEach((r) => {
        const val = r[predictedCol];
        if (val !== undefined && val !== null && val !== '') {
          set.add(val);
        }
      });
    }

    return Array.from(set).sort();
  }, [parsedData.rows, actualCol, predictedCol, predMode]);

  // Sincronizar clase positiva
  useEffect(() => {
    if (detectedClasses.length >= 2) {
      if (!detectedClasses.includes(chosenPositiveClass)) {
        // Preferir nombres típicos positivos: '1', 'Si', 'Yes', 'Fraude', 'Incumple', 'Positivo', 'Enfermo'
        const preferredPositives = ['1', 'si', 'yes', 'fraude', 'fraud', 'incumple', 'positivo', 'positive', 'true', 'enfermo', 'defecto', 'churn'];
        const foundPref = detectedClasses.find((c) =>
          preferredPositives.includes(c.toLowerCase())
        );
        setChosenPositiveClass(foundPref || detectedClasses[0]);
      }
    }
  }, [detectedClasses, chosenPositiveClass]);

  // Búsqueda del Umbral Óptimo de Youden y del F1 Máximo en modo probabilidad
  const optimalThresholds = useMemo(() => {
    if (predMode !== 'probability' || !probabilityCol || detectedClasses.length !== 2) return null;

    const posClass = chosenPositiveClass;
    let bestYouden = { threshold: 0.5, value: -1 };
    let bestF1 = { threshold: 0.5, value: -1 };

    // Barrer umbrales de 0.05 a 0.95 con paso 0.02
    for (let t = 0.05; t <= 0.95; t += 0.02) {
      let tp = 0;
      let tn = 0;
      let fp = 0;
      let fn = 0;

      parsedData.rows.forEach((r) => {
        const actual = r[actualCol];
        const prob = parseFloat(r[probabilityCol]);
        if (isNaN(prob)) return;

        const isPredPos = prob >= t;
        if (actual === posClass) {
          if (isPredPos) tp++;
          else fn++;
        } else {
          if (isPredPos) fp++;
          else tn++;
        }
      });

      const actualPos = tp + fn;
      const actualNeg = tn + fp;
      if (actualPos > 0 && actualNeg > 0) {
        const tpr = tp / actualPos;
        const fpr = fp / actualNeg;
        const youdenJ = tpr - fpr;

        if (youdenJ > bestYouden.value) {
          bestYouden = { threshold: parseFloat(t.toFixed(2)), value: youdenJ };
        }
      }

      const predPos = tp + fp;
      if (predPos > 0 && actualPos > 0) {
        const prec = tp / predPos;
        const rec = tp / actualPos;
        const f1 = prec + rec > 0 ? (2 * prec * rec) / (prec + rec) : 0;
        if (f1 > bestF1.value) {
          bestF1 = { threshold: parseFloat(t.toFixed(2)), value: f1 };
        }
      }
    }

    return { bestYouden, bestF1 };
  }, [predMode, probabilityCol, detectedClasses, chosenPositiveClass, parsedData.rows, actualCol]);

  // CÁLCULO PRINCIPAL DE LA MATRIZ DE CONFUSIÓN Y MÉTRICAS
  const evaluationResult = useMemo(() => {
    if (!parsedData.rows.length || detectedClasses.length < 2) return null;

    let validRowsCount = 0;
    let omittedRowsCount = 0;

    // 1. CASO BINARIO (2 CLASES)
    if (detectedClasses.length === 2) {
      const posClass = chosenPositiveClass;
      const negClass = detectedClasses.find((c) => c !== posClass) || '';

      let tp = 0;
      let tn = 0;
      let fp = 0;
      let fn = 0;

      parsedData.rows.forEach((r) => {
        const actual = r[actualCol];
        if (!actual) {
          omittedRowsCount++;
          return;
        }

        let isPredictedPositive = false;

        if (predMode === 'discrete') {
          const pred = r[predictedCol];
          if (!pred) {
            omittedRowsCount++;
            return;
          }
          isPredictedPositive = pred === posClass;
        } else {
          // Modo Probabilidad Continua
          const prob = parseFloat(r[probabilityCol]);
          if (isNaN(prob)) {
            omittedRowsCount++;
            return;
          }
          isPredictedPositive = prob >= customThreshold;
        }

        validRowsCount++;

        if (actual === posClass) {
          if (isPredictedPositive) tp++;
          else fn++;
        } else {
          if (isPredictedPositive) fp++;
          else tn++;
        }
      });

      const matrix: BinaryConfusionMatrix = { tp, tn, fp, fn };
      const metrics = calculateBinaryMetrics(matrix);
      const normalized = normalizeBinaryMatrix(matrix, normalizationMode);

      return {
        isBinary: true,
        posClass,
        negClass,
        matrix,
        normalized,
        metrics,
        validRowsCount,
        omittedRowsCount,
        totalRows: parsedData.rows.length,
      };
    } else {
      // 2. CASO MULTICLASE (N >= 3 CLASES)
      const n = detectedClasses.length;
      const matrix: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
      const classToIndex = new Map<string, number>();
      detectedClasses.forEach((c, idx) => classToIndex.set(c, idx));

      parsedData.rows.forEach((r) => {
        const actual = r[actualCol];
        const pred = r[predictedCol];

        if (!actual || !pred) {
          omittedRowsCount++;
          return;
        }

        const actualIdx = classToIndex.get(actual);
        const predIdx = classToIndex.get(pred);

        if (actualIdx !== undefined && predIdx !== undefined) {
          matrix[actualIdx][predIdx]++;
          validRowsCount++;
        } else {
          omittedRowsCount++;
        }
      });

      const multiData: MulticlassMatrix = {
        classes: detectedClasses,
        matrix,
        totalSamples: validRowsCount,
      };

      const multiMetrics = calculateMulticlassMetrics(multiData);

      return {
        isBinary: false,
        multiData,
        multiMetrics,
        validRowsCount,
        omittedRowsCount,
        totalRows: parsedData.rows.length,
      };
    }
  }, [
    parsedData.rows,
    detectedClasses,
    actualCol,
    predictedCol,
    probabilityCol,
    predMode,
    customThreshold,
    chosenPositiveClass,
    normalizationMode,
  ]);

  // Manejo de carga de archivos (soporta .xlsx, .xls, .csv, .tsv, .txt)
  const handleProcessFile = async (file: File) => {
    setIsLoadingFile(true);
    setFileName(file.name);

    try {
      const lower = file.name.toLowerCase();

      if (lower.endsWith('.xlsx') || lower.endsWith('.xls')) {
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const csvString = XLSX.utils.sheet_to_csv(worksheet);
        setRawText(csvString);
        onAwardXP(50, `Cargaste exitosamente la hoja de cálculo "${file.name}"`);
        onUnlockBadge('badge-data-scientist');
      } else {
        // CSV / TSV / TXT
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          if (content) {
            setRawText(content);
            onAwardXP(40, `Cargaste el archivo delimitado "${file.name}"`);
            onUnlockBadge('badge-data-scientist');
          }
          setIsLoadingFile(false);
        };
        reader.readAsText(file);
        return;
      }
    } catch (err) {
      console.error('Error procesando archivo:', err);
      alert('Error al procesar el archivo. Comprueba que no esté dañado o protegido con contraseña.');
    } finally {
      setIsLoadingFile(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  // Cargar datasets de ejemplo
  const handleLoadSample = (sampleId: string) => {
    const sample = SAMPLE_CSV_DATASETS.find((s) => s.id === sampleId);
    if (!sample) return;

    setRawText(sample.content);
    setFileName(sample.name);

    if (sample.id === 'credit-risk-binary') {
      setActualCol('clase_real');
      setPredictedCol('clase_predicha');
      setChosenPositiveClass('Incumple');
      setPredMode('discrete');
    } else if (sample.id === 'equipment-quality-multiclass') {
      setActualCol('estado_real');
      setPredictedCol('estado_predicho');
      setPredMode('discrete');
    }
    onAwardXP(20, `Cargaste el conjunto de prueba "${sample.name}"`);
  };

  // Exportar matriz calculada a la herramienta de Explorador 2x2
  const handleTransferToExplorer = () => {
    if (evaluationResult?.isBinary && evaluationResult.matrix && onApplyMatrixToExplorer) {
      onApplyMatrixToExplorer(evaluationResult.matrix);
      if (onNavigateToModule) onNavigateToModule('m2');
    }
  };

  // Exportar informe de diagnóstico en texto
  const handleDownloadFullReport = () => {
    if (!evaluationResult) return;

    let txt = `=================================================================\n`;
    txt += `  MATRIZLAB - INFORME OFICIAL DE EVALUACIÓN DE CLASIFICADOR     \n`;
    txt += `=================================================================\n`;
    txt += `Archivo fuente: ${fileName}\n`;
    txt += `Fecha de generación: ${new Date().toLocaleString()}\n`;
    txt += `Total de registros procesados: ${evaluationResult.validRowsCount} válidos (${evaluationResult.omittedRowsCount} omitidos por datos faltantes)\n\n`;
    txt += `Configuración:\n`;
    txt += `  - Columna de etiqueta real: [${actualCol}]\n`;
    txt += `  - Modo de predicción: ${
      predMode === 'discrete'
        ? `Etiquetas discretas desde [${predictedCol}]`
        : `Estimación por probabilidad continua [${probabilityCol}] con umbral τ = ${customThreshold.toFixed(2)}`
    }\n\n`;

    if (evaluationResult.isBinary && evaluationResult.matrix && evaluationResult.metrics) {
      const { matrix, metrics } = evaluationResult;
      txt += `--- MATRIZ DE CONFUSIÓN BINARIA 2×2 ---\n`;
      txt += `Clase Positiva (+): ${evaluationResult.posClass}\n`;
      txt += `Clase Negativa (-): ${evaluationResult.negClass}\n\n`;
      txt += `                 | Predicho Positivo (+) | Predicho Negativo (-)\n`;
      txt += `-----------------+-----------------------+----------------------\n`;
      txt += `Real Positivo(+) | TP: ${String(matrix.tp).padEnd(17)} | FN: ${matrix.fn}\n`;
      txt += `Real Negativo(-) | FP: ${String(matrix.fp).padEnd(17)} | TN: ${matrix.tn}\n\n`;

      txt += `--- MÉTRICAS ESTADÍSTICAS CALCULADAS ---\n`;
      txt += `1. Exactitud (Accuracy):           ${metrics.accuracy.percentage} (${metrics.accuracy.formulaExpanded})\n`;
      txt += `2. Precisión (PPV):                ${metrics.precision.percentage} (${metrics.precision.formulaExpanded})\n`;
      txt += `3. Sensibilidad / Recall (TPR):     ${metrics.recall.percentage} (${metrics.recall.formulaExpanded})\n`;
      txt += `4. Especificidad (TNR):             ${metrics.specificity.percentage} (${metrics.specificity.formulaExpanded})\n`;
      txt += `5. Puntaje F1:                     ${metrics.f1.percentage}\n`;
      txt += `6. Exactitud Balanceada:           ${metrics.balancedAccuracy.percentage}\n`;
      txt += `7. Tasa de Falsos Positivos (FPR): ${metrics.fpr.percentage}\n`;
      txt += `8. Tasa de Falsos Negativos (FNR): ${metrics.fnr.percentage}\n`;
      txt += `9. Valor Predictivo Negativo (NPV): ${metrics.npv.percentage}\n`;
      txt += `10. Coeficiente de Matthews (MCC): ${metrics.mcc.percentage}\n`;
    } else if (evaluationResult.multiData && evaluationResult.multiMetrics) {
      txt += `--- MATRIZ DE CONFUSIÓN MULTICLASE N×N (${detectedClasses.length} CATEGORÍAS) ---\n`;
      txt += `Clases: ${detectedClasses.join(', ')}\n\n`;
      txt += `Resumen Global:\n`;
      txt += `  - Exactitud Global (Accuracy): ${(evaluationResult.multiMetrics.accuracy * 100).toFixed(2)}%\n`;
      txt += `  - Macro F1-Score:             ${(evaluationResult.multiMetrics.macroF1 * 100).toFixed(2)}%\n`;
      txt += `  - Micro F1-Score:             ${(evaluationResult.multiMetrics.microF1 * 100).toFixed(2)}%\n`;
      txt += `  - Weighted F1 (Ponderado):    ${(evaluationResult.multiMetrics.weightedF1 * 100).toFixed(2)}%\n\n`;

      txt += `Desglose One-vs-Rest por Clase:\n`;
      evaluationResult.multiMetrics.perClass.forEach((c) => {
        txt += `  * [${c.className}]: Soporte = ${c.support} | Precisión = ${(
          (c.precision ?? 0) * 100
        ).toFixed(2)}% | Recall = ${((c.recall ?? 0) * 100).toFixed(2)}% | F1 = ${(
          (c.f1 ?? 0) * 100
        ).toFixed(2)}%\n`;
      });
    }

    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `matrizlab_reporte_${Date.now()}.txt`;
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
          <span>LABORATORIO DE CARGA & ESTIMACIÓN</span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
          Carga de Datos & Estimación de la Matriz de Confusión
        </h1>
        <p className="mt-1 text-sm text-slate-600 max-w-3xl leading-relaxed">
          Sube tus archivos de Excel (.xlsx, .xls) o texto delimitado (.csv, .tsv), o pega los datos
          directamente. MatrizLab mapeará las etiquetas reales y predichas, o estimará la matriz de
          confusión óptima a partir de probabilidades continuas.
        </p>
      </div>

      {/* ÁREA DE CARGA: ZONA DRAG & DROP Y SELECTOR */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`bg-white rounded-xl border-2 border-dashed p-6 lg:p-8 transition-all ${
          dragActive
            ? 'border-indigo-500 bg-indigo-50/50 scale-[1.005]'
            : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Upload className="w-6 h-6" />
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Arrastra tu archivo aquí o haz clic para seleccionarlo
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Compatible con <strong>Excel (.xlsx, .xls)</strong>, <strong>CSV</strong>, <strong>TSV</strong> y <strong>TXT</strong>
            </p>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <label className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors shadow-xs flex items-center gap-1.5">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Seleccionar Archivo</span>
              <input
                type="file"
                accept=".xlsx,.xls,.csv,.tsv,.txt"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleProcessFile(e.target.files[0]);
                  }
                }}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 pt-2">
            <span>Privacidad garantizada: los datos se procesan 100% en la memoria de tu navegador.</span>
          </div>
        </div>

        {/* Acceso Rápido a Ejemplos Predefinidos */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs font-semibold text-slate-700">
            ¿No tienes un archivo a mano? Carga un dataset de prueba:
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            {SAMPLE_CSV_DATASETS.map((s) => (
              <button
                key={s.id}
                onClick={() => handleLoadSample(s.id)}
                className="px-2.5 py-1 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors border border-slate-200/70"
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* EDITOR / VISOR DE DATOS EN BRUTO */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Datos Cargados: {fileName} ({parsedData.rows.length} registros)
            </h3>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(rawText);
              setCopyFeedback(true);
              setTimeout(() => setCopyFeedback(false), 2000);
            }}
            className="text-[11px] text-slate-600 hover:text-slate-900 flex items-center gap-1 font-medium"
          >
            <Copy className="w-3 h-3" />
            <span>{copyFeedback ? '¡Copiado!' : 'Copiar datos'}</span>
          </button>
        </div>

        <textarea
          value={rawText}
          onChange={(e) => {
            setRawText(e.target.value);
            setFileName('datos_personalizados.csv');
          }}
          rows={4}
          className="w-full font-mono text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-indigo-500 leading-relaxed"
          placeholder="Pega aquí tus datos tabulares (puedes copiar y pegar directamente celdas desde Excel o Google Sheets)..."
        />

        {parsedData.error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{parsedData.error}</span>
          </div>
        )}
      </div>

      {/* CONFIGURACIÓN Y MAPEO DE COLUMNAS */}
      {parsedData.headers.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Mapeo de Columnas & Modo de Estimación
              </h3>
            </div>

            {/* Selector de Modo: Etiquetas Directas vs Probabilidades */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200">
              <button
                onClick={() => setPredMode('discrete')}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  predMode === 'discrete'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                1. Etiquetas Discretas
              </button>
              <button
                onClick={() => setPredMode('probability')}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  predMode === 'probability'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                2. Estimación por Probabilidad (τ)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Columna Real */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Columna de Clase Real (Ground Truth):
              </label>
              <select
                value={actualCol}
                onChange={(e) => setActualCol(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:outline-indigo-500"
              >
                {parsedData.headers.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>

            {/* Columna Predicha según modo */}
            {predMode === 'discrete' ? (
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Columna de Clase Predicha:
                </label>
                <select
                  value={predictedCol}
                  onChange={(e) => setPredictedCol(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:outline-indigo-500"
                >
                  {parsedData.headers.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Columna de Probabilidad Calculada $P(Y=1)$:
                </label>
                <select
                  value={probabilityCol}
                  onChange={(e) => setProbabilityCol(e.target.value)}
                  className="w-full p-2 bg-indigo-50 border border-indigo-200 rounded-lg text-xs font-semibold text-indigo-950 focus:outline-indigo-500"
                >
                  <option value="">-- Seleccionar columna de probabilidad --</option>
                  {parsedData.headers.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Selector de clase positiva (si es binario) */}
            {detectedClasses.length === 2 && (
              <div>
                <label className="text-xs font-semibold text-indigo-700 block mb-1">
                  Clase de Interés Positiva (+):
                </label>
                <select
                  value={chosenPositiveClass}
                  onChange={(e) => setChosenPositiveClass(e.target.value)}
                  className="w-full p-2 bg-indigo-50/80 border border-indigo-300 rounded-lg text-xs font-bold text-indigo-950 focus:outline-indigo-500"
                >
                  {detectedClasses.map((c) => (
                    <option key={c} value={c}>
                      {c} (Clase Positiva)
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* SLIDER DE UMBRAL DINÁMICO EN MODO PROBABILIDAD */}
          {predMode === 'probability' && (
            <div className="p-4 bg-indigo-50/70 border border-indigo-200/80 rounded-xl space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <span className="text-xs font-bold text-indigo-950 uppercase tracking-wider block">
                    Ajuste Dinámico del Umbral de Corte ($\tau$) para tus Datos
                  </span>
                  <span className="text-[11px] text-slate-600">
                    Se clasificará como "{chosenPositiveClass}" toda muestra con probabilidad $\ge \tau$
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-indigo-700 bg-white px-2.5 py-1 rounded border border-indigo-200 shadow-xs tabular-nums text-sm">
                    $\tau$ = {customThreshold.toFixed(2)}
                  </span>
                </div>
              </div>

              <input
                type="range"
                min="0.05"
                max="0.95"
                step="0.02"
                value={customThreshold}
                onChange={(e) => setCustomThreshold(parseFloat(e.target.value))}
                className="w-full accent-indigo-600 h-2 bg-indigo-200 rounded-lg cursor-pointer"
              />

              {/* Botones de sugerencias de umbrales óptimos calculados matemáticamente */}
              {optimalThresholds && (
                <div className="flex items-center gap-2 flex-wrap pt-1 text-xs">
                  <span className="font-semibold text-slate-700 text-[11px]">
                    Umbrales óptimos calculados sobre tu archivo:
                  </span>
                  <button
                    onClick={() => setCustomThreshold(optimalThresholds.bestYouden.threshold)}
                    className="px-2.5 py-1 bg-white hover:bg-indigo-100 text-indigo-800 rounded font-semibold border border-indigo-200 shadow-xs transition-colors text-[11px]"
                  >
                    Índice Youden Óptimo (τ = {optimalThresholds.bestYouden.threshold})
                  </button>
                  <button
                    onClick={() => setCustomThreshold(optimalThresholds.bestF1.threshold)}
                    className="px-2.5 py-1 bg-white hover:bg-indigo-100 text-indigo-800 rounded font-semibold border border-indigo-200 shadow-xs transition-colors text-[11px]"
                  >
                    Máximo F1-Score (τ = {optimalThresholds.bestF1.threshold})
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Resumen de Clases Encontradas */}
          <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200/80 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>
                Categorías detectadas en tus datos ({detectedClasses.length}):{' '}
                <strong>{detectedClasses.join(', ')}</strong>
              </span>
            </div>
            <span className="text-[11px] text-slate-500">
              {detectedClasses.length === 2 ? 'Modo Binario 2×2' : `Modo Multiclase ${detectedClasses.length}×${detectedClasses.length}`}
            </span>
          </div>
        </div>
      )}

      {/* RESULTADO DEL CÁLCULO DE LA MATRIZ DE CONFUSIÓN */}
      {evaluationResult && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 lg:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Estimación Completada
                </span>
                <span className="text-xs text-slate-500">
                  {evaluationResult.validRowsCount} filas analizadas
                  {evaluationResult.omittedRowsCount > 0 && ` (${evaluationResult.omittedRowsCount} omitidas por nulos)`}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-1">
                Matriz de Confusión Calculada sobre tus Datos
              </h2>
            </div>

            {/* Acciones Rápidas */}
            <div className="flex items-center gap-2 flex-wrap">
              {evaluationResult.isBinary && (
                <button
                  onClick={handleTransferToExplorer}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <span>Ver en Explorador 2×2</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                onClick={handleDownloadFullReport}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 border border-slate-200/80"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar Reporte (.txt)</span>
              </button>
            </div>
          </div>

          {/* Selector de Normalización para los datos cargados */}
          <div className="flex items-center justify-between flex-wrap gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <span className="font-semibold text-slate-700">Modo de Normalización:</span>
            <div className="flex items-center gap-1">
              {[
                { id: 'none', label: 'Valores Absolutos' },
                { id: 'row', label: '% por Fila (Clase Real)' },
                { id: 'col', label: '% por Columna (Predicción)' },
                { id: 'all', label: '% Total' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setNormalizationMode(m.id as NormalizationMode)}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    normalizationMode === m.id
                      ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* MATRIZ BINARIA 2×2 ESTIMADA */}
          {evaluationResult.isBinary && evaluationResult.matrix && evaluationResult.metrics && (
            <div className="space-y-6">
              {/* Cuadrícula de la Matriz con Heatmap de Intensidad */}
              <div className="max-w-xl mx-auto">
                <div className="grid grid-cols-[140px_1fr_1fr] gap-3 text-center mb-2 items-end">
                  <div className="text-left font-bold text-xs text-slate-400 uppercase">
                    Real \ Predicho
                  </div>
                  <div className="p-2 bg-slate-100 rounded-lg text-xs font-bold text-slate-800">
                    Predicho "{evaluationResult.posClass}"
                  </div>
                  <div className="p-2 bg-slate-100 rounded-lg text-xs font-bold text-slate-800">
                    Predicho "{evaluationResult.negClass}"
                  </div>
                </div>

                {/* Fila Real Positiva */}
                <div className="grid grid-cols-[140px_1fr_1fr] gap-3 items-center mb-3">
                  <div className="p-3 bg-slate-100 rounded-lg text-xs font-bold text-slate-800 text-left">
                    Real: "{evaluationResult.posClass}"
                  </div>

                  {/* TP */}
                  <div className="p-4 rounded-xl bg-emerald-50 border-2 border-emerald-300 text-center">
                    <div className="text-[10px] text-emerald-800 font-bold uppercase">
                      Verdadero Positivo (TP)
                    </div>
                    <div className="text-3xl font-black text-emerald-900 tabular-nums mt-1">
                      {normalizationMode === 'none'
                        ? evaluationResult.matrix.tp.toLocaleString()
                        : `${evaluationResult.normalized.tp.toFixed(1)}%`}
                    </div>
                    <span className="text-[11px] text-emerald-700 block mt-1">
                      Aciertos positivos
                    </span>
                  </div>

                  {/* FN */}
                  <div className="p-4 rounded-xl bg-rose-50 border-2 border-rose-300 text-center">
                    <div className="text-[10px] text-rose-800 font-bold uppercase">
                      Falso Negativo (FN)
                    </div>
                    <div className="text-3xl font-black text-rose-900 tabular-nums mt-1">
                      {normalizationMode === 'none'
                        ? evaluationResult.matrix.fn.toLocaleString()
                        : `${evaluationResult.normalized.fn.toFixed(1)}%`}
                    </div>
                    <span className="text-[11px] text-rose-700 block mt-1">
                      Positivos no detectados
                    </span>
                  </div>
                </div>

                {/* Fila Real Negativa */}
                <div className="grid grid-cols-[140px_1fr_1fr] gap-3 items-center">
                  <div className="p-3 bg-slate-100 rounded-lg text-xs font-bold text-slate-800 text-left">
                    Real: "{evaluationResult.negClass}"
                  </div>

                  {/* FP */}
                  <div className="p-4 rounded-xl bg-amber-50 border-2 border-amber-300 text-center">
                    <div className="text-[10px] text-amber-800 font-bold uppercase">
                      Falso Positivo (FP)
                    </div>
                    <div className="text-3xl font-black text-amber-900 tabular-nums mt-1">
                      {normalizationMode === 'none'
                        ? evaluationResult.matrix.fp.toLocaleString()
                        : `${evaluationResult.normalized.fp.toFixed(1)}%`}
                    </div>
                    <span className="text-[11px] text-amber-700 block mt-1">
                      Falsas alarmas
                    </span>
                  </div>

                  {/* TN */}
                  <div className="p-4 rounded-xl bg-emerald-50 border-2 border-emerald-300 text-center">
                    <div className="text-[10px] text-emerald-800 font-bold uppercase">
                      Verdadero Negativo (TN)
                    </div>
                    <div className="text-3xl font-black text-emerald-900 tabular-nums mt-1">
                      {normalizationMode === 'none'
                        ? evaluationResult.matrix.tn.toLocaleString()
                        : `${evaluationResult.normalized.tn.toFixed(1)}%`}
                    </div>
                    <span className="text-[11px] text-emerald-700 block mt-1">
                      Aciertos negativos
                    </span>
                  </div>
                </div>
              </div>

              {/* MÉTRICAS CALCULADAS DE TUS DATOS */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                  <span className="text-[11px] text-slate-500 block">Exactitud (Accuracy)</span>
                  <span className="text-lg font-bold text-slate-900 tabular-nums">
                    {evaluationResult.metrics.accuracy.percentage}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                  <span className="text-[11px] text-slate-500 block">Precisión (PPV)</span>
                  <span className="text-lg font-bold text-indigo-700 tabular-nums">
                    {evaluationResult.metrics.precision.percentage}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                  <span className="text-[11px] text-slate-500 block">Recall / Sensibilidad</span>
                  <span className="text-lg font-bold text-indigo-700 tabular-nums">
                    {evaluationResult.metrics.recall.percentage}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                  <span className="text-[11px] text-slate-500 block">F1-Score</span>
                  <span className="text-lg font-bold text-slate-900 tabular-nums">
                    {evaluationResult.metrics.f1.percentage}
                  </span>
                </div>
              </div>

              {/* Fila secundaria de métricas avanzadas */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 block">Especificidad</span>
                  <span className="text-sm font-bold text-slate-800 tabular-nums">
                    {evaluationResult.metrics.specificity.percentage}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 block">Balanced Accuracy</span>
                  <span className="text-sm font-bold text-slate-800 tabular-nums">
                    {evaluationResult.metrics.balancedAccuracy.percentage}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 block">Tasa Falsos Positivos (FPR)</span>
                  <span className="text-sm font-bold text-amber-700 tabular-nums">
                    {evaluationResult.metrics.fpr.percentage}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 block">Matthews MCC</span>
                  <span className="text-sm font-bold text-indigo-700 tabular-nums">
                    {evaluationResult.metrics.mcc.percentage}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* MATRIZ MULTICLASE N×N ESTIMADA */}
          {!evaluationResult.isBinary && evaluationResult.multiData && evaluationResult.multiMetrics && (
            <div className="space-y-6">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-center border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700">
                      <th className="p-2.5 text-left border border-slate-200 font-bold">
                        Real \ Predicho
                      </th>
                      {evaluationResult.multiData.classes.map((cls) => (
                        <th key={cls} className="p-2.5 border border-slate-200 font-bold">
                          {cls}
                        </th>
                      ))}
                      <th className="p-2.5 border border-slate-200 font-bold bg-slate-200/60">
                        Total
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
                                    ? 'bg-emerald-100 text-emerald-950 font-black'
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

              {/* Métricas por Clase */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Métricas One-vs-Rest por Clase Calculadas
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border border-slate-200 text-left">
                    <thead className="bg-slate-50 text-slate-600">
                      <tr>
                        <th className="p-2.5 border-b">Categoría</th>
                        <th className="p-2.5 border-b">Soporte</th>
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

              {/* Resumen Global Multiclase */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                  <span className="text-[11px] text-slate-500 block">Exactitud Global</span>
                  <span className="text-base font-bold text-slate-900 tabular-nums">
                    {(evaluationResult.multiMetrics.accuracy * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                  <span className="text-[11px] text-slate-500 block">Macro F1</span>
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
                  <span className="text-[11px] text-slate-500 block">Weighted F1</span>
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
