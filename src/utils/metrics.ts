/**
 * Motor Estadístico y Algoritmos de Evaluación de Modelos de Clasificación
 * Rigor técnico basado en scikit-learn, Powers (2011), Fawcett (2006) y Bishop (2006).
 */

import { BinaryConfusionMatrix, MetricDetail, MulticlassMatrix, MulticlassMetricsSummary } from '../types';

/**
 * Calcula todas las 11 métricas clave a partir de una matriz de confusión binaria.
 * Gestiona de forma rigurosa las divisiones por cero.
 */
export function calculateBinaryMetrics(
  matrix: BinaryConfusionMatrix,
  beta: number = 1.0
): Record<string, MetricDetail> {
  const { tp, tn, fp, fn } = matrix;
  const total = tp + tn + fp + fn;
  const actualPositives = tp + fn;
  const actualNegatives = tn + fp;
  const predictedPositives = tp + fp;
  const predictedNegatives = tn + fn;

  // 1. Accuracy (Exactitud)
  const accuracyVal = total > 0 ? (tp + tn) / total : null;

  // 2. Precision (Valor Predictivo Positivo - PPV)
  const precisionVal = predictedPositives > 0 ? tp / predictedPositives : null;

  // 3. Recall / Sensibilidad (Tasa de Verdaderos Positivos - TPR)
  const recallVal = actualPositives > 0 ? tp / actualPositives : null;

  // 4. Especificidad (Tasa de Verdaderos Negativos - TNR)
  const specificityVal = actualNegatives > 0 ? tn / actualNegatives : null;

  // 5. F1-Score (Media armónica entre precisión y recall)
  let f1Val: number | null = null;
  if (precisionVal !== null && recallVal !== null) {
    const sum = precisionVal + recallVal;
    f1Val = sum > 0 ? (2 * precisionVal * recallVal) / sum : 0;
  }

  // 6. Tasa de Falsos Positivos (FPR / Fall-out)
  const fprVal = actualNegatives > 0 ? fp / actualNegatives : null;

  // 7. Tasa de Falsos Negativos (FNR / Miss rate)
  const fnrVal = actualPositives > 0 ? fn / actualPositives : null;

  // 8. Valor Predictivo Negativo (NPV)
  const npvVal = predictedNegatives > 0 ? tn / predictedNegatives : null;

  // 9. Balanced Accuracy (Exactitud Balanceada)
  let balancedAccVal: number | null = null;
  if (recallVal !== null && specificityVal !== null) {
    balancedAccVal = (recallVal + specificityVal) / 2;
  } else if (recallVal !== null) {
    balancedAccVal = recallVal;
  } else if (specificityVal !== null) {
    balancedAccVal = specificityVal;
  }

  // 10. F-Beta Score
  let fBetaVal: number | null = null;
  const betaSq = beta * beta;
  if (precisionVal !== null && recallVal !== null) {
    const denom = betaSq * precisionVal + recallVal;
    fBetaVal = denom > 0 ? ((1 + betaSq) * precisionVal * recallVal) / denom : 0;
  }

  // 11. Matthews Correlation Coefficient (MCC)
  let mccVal: number | null = null;
  const mccNum = tp * tn - fp * fn;
  const mccDenom = Math.sqrt(
    (tp + fp) * (tp + fn) * (tn + fp) * (tn + fn)
  );
  if (mccDenom > 0) {
    mccVal = mccNum / mccDenom;
  } else {
    // Cuando el denominador es 0, scikit-learn define MCC como 0.0
    mccVal = 0;
  }

  const formatPct = (val: number | null): string => {
    if (val === null) return 'Indefinido';
    return `${(val * 100).toFixed(2)}%`;
  };

  const formatNum = (val: number | null, decimals: number = 4): string => {
    if (val === null) return 'Indefinido';
    return val.toFixed(decimals);
  };

  return {
    accuracy: {
      id: 'accuracy',
      name: 'Exactitud',
      shortName: 'Accuracy',
      category: 'general',
      formula: 'Accuracy = (TP + TN) / (TP + TN + FP + FN)',
      formulaExpanded: `(${tp} + ${tn}) / ${total}`,
      value: accuracyVal,
      percentage: formatPct(accuracyVal),
      interpretation:
        'Porcentaje global de aciertos del modelo respecto a todas las instancias evaluadas.',
      highMeaning:
        'Indica que la mayoría de las predicciones son correctas, pero puede ser muy engañosa si las clases están desbalanceadas.',
      lowMeaning:
        'El modelo comete errores frecuentes en general. Rendimiento inferior a un clasificador aleatorio balanceado si < 0.50.',
      limitations:
        'La Paradoja de la Exactitud: Un modelo que prediga siempre negativo ante una enfermedad rara del 1% obtendrá 99% de exactitud siendo completamente inútil.',
      businessExample:
        'Útil para comparar modelos globales únicamente si las clases tienen proporciones similares y los costos de error son simétricos.',
      undefinedReason: total === 0 ? 'La matriz de confusión no contiene muestras (total = 0).' : undefined,
    },
    precision: {
      id: 'precision',
      name: 'Precisión',
      shortName: 'Precision (PPV)',
      category: 'positive_class',
      formula: 'Precision = TP / (TP + FP)',
      formulaExpanded: `${tp} / (${tp} + ${fp})`,
      value: precisionVal,
      percentage: formatPct(precisionVal),
      interpretation:
        'De todos los casos que el modelo predijo como positivos, ¿cuántos eran realmente positivos?',
      highMeaning:
        'Cuando el modelo da una alarma positiva, tiene alta probabilidad de ser verdad. Pocos falsos positivos.',
      lowMeaning:
        'El modelo genera muchas falsas alarmas (falsos positivos), alertando sobre casos inocuos.',
      limitations:
        'No mide cuántos positivos reales dejó escapar el modelo. Un modelo muy tímido que solo prediga 1 caso seguro tendrá 100% de precisión pero ignorará al resto.',
      businessExample:
        'Crítica en filtros de Spam de correo o campañas costosas de marketing directo donde contactar a un cliente cuesta dinero.',
      undefinedReason:
        predictedPositives === 0
          ? 'El modelo no predijo ninguna muestra como positiva (TP + FP = 0). Denominador nulo.'
          : undefined,
    },
    recall: {
      id: 'recall',
      name: 'Sensibilidad / Recall',
      shortName: 'Recall (TPR)',
      category: 'positive_class',
      formula: 'Recall = TP / (TP + FN)',
      formulaExpanded: `${tp} / (${tp} + ${fn})`,
      value: recallVal,
      percentage: formatPct(recallVal),
      interpretation:
        'De todos los positivos reales que existían en el mundo, ¿qué proporción logró capturar el modelo?',
      highMeaning:
        'El modelo encuentra casi todos los casos positivos reales. Muy pocos falsos negativos se escapan.',
      lowMeaning:
        'El modelo es ciego a muchos casos positivos reales, dejando pasar riesgos o eventos críticos.',
      limitations:
        'Puede aumentarse trivialmente prediciendo positivo para todo el mundo (100% de recall), pero arruinaría la precisión.',
      businessExample:
        'Fundamental en diagnóstico médico de enfermedades graves o detección de fraudes bancarios donde un falso negativo cuesta vidas o millones.',
      undefinedReason:
        actualPositives === 0
          ? 'No hay instancias positivas reales en el conjunto de datos (TP + FN = 0).'
          : undefined,
    },
    specificity: {
      id: 'specificity',
      name: 'Especificidad',
      shortName: 'Specificity (TNR)',
      category: 'negative_class',
      formula: 'Specificity = TN / (TN + FP)',
      formulaExpanded: `${tn} / (${tn} + ${fp})`,
      value: specificityVal,
      percentage: formatPct(specificityVal),
      interpretation:
        'De todas las instancias negativas reales, ¿qué proporción fue clasificada correctamente como negativa?',
      highMeaning:
        'El modelo reconoce con fiabilidad a los casos sanos o legítimos, evitando molestarlos o someterlos a pruebas invasivas.',
      lowMeaning:
        'Gran cantidad de casos normales o sanos son erróneamente clasificados como sospechosos o anómalos.',
      limitations:
        'Al igual que el recall pero en la clase negativa, es vulnerable a modelos sesgados a predecir siempre negativo.',
      businessExample:
        'Esencial en pruebas médicas de confirmación para evitar someter a pacientes sanos a tratamientos tóxicos o quimioterapias innecesarias.',
      undefinedReason:
        actualNegatives === 0
          ? 'No existen instancias negativas reales en los datos (TN + FP = 0).'
          : undefined,
    },
    f1: {
      id: 'f1',
      name: 'Puntaje F1',
      shortName: 'F1-Score',
      category: 'combined',
      formula: 'F1 = 2 × (Precision × Recall) / (Precision + Recall)',
      formulaExpanded:
        precisionVal !== null && recallVal !== null
          ? `2 × (${formatNum(precisionVal)} × ${formatNum(recallVal)}) / (${formatNum(precisionVal)} + ${formatNum(recallVal)})`
          : 'Indefinido',
      value: f1Val,
      percentage: formatPct(f1Val),
      interpretation:
        'Media armónica entre precisión y recall. Penaliza fuertemente a los modelos que tienen una de las dos métricas muy baja.',
      highMeaning:
        'Existe un balance sólido entre encontrar positivos reales y no saturar con falsas alarmas.',
      lowMeaning:
        'Uno o ambos componentes (precisión o recall) son deficientes; el modelo no logra un compromiso aceptable.',
      limitations:
        'Asigna exactamente el mismo peso (peso = 1) a los falsos positivos que a los falsos negativos, lo cual rara vez ocurre en los negocios.',
      businessExample:
        'Métrica estándar por defecto cuando las clases están desbalanceadas y no se conoce con exactitud la matriz de costos monetarios.',
      undefinedReason:
        precisionVal === null || recallVal === null
          ? 'Precisión o Recall están indefinidos debido a denominadores nulos.'
          : undefined,
    },
    fpr: {
      id: 'fpr',
      name: 'Tasa de Falsos Positivos',
      shortName: 'FPR (Fall-out)',
      category: 'negative_class',
      formula: 'FPR = FP / (FP + TN) = 1 - Especificidad',
      formulaExpanded: `${fp} / (${fp} + ${tn})`,
      value: fprVal,
      percentage: formatPct(fprVal),
      interpretation:
        'Proporción de casos negativos reales que el modelo alertó incorrectamente como positivos.',
      highMeaning:
        'Alta tasa de falsas alarmas sobre la población sana o transacciones legítimas.',
      lowMeaning:
        'Muy pocas falsas alarmas (deseable en casi todos los sistemas).',
      limitations:
        'Es el eje horizontal (X) de la curva ROC. Depende exclusivamente de la distribución de la clase negativa.',
      businessExample:
        'Determina la sobrecarga de trabajo manual para el equipo de analistas de seguridad que revisa alertas generadas por el sistema.',
      undefinedReason:
        actualNegatives === 0 ? 'No hay negativos reales en el dataset (FP + TN = 0).' : undefined,
    },
    fnr: {
      id: 'fnr',
      name: 'Tasa de Falsos Negativos',
      shortName: 'FNR (Miss Rate)',
      category: 'positive_class',
      formula: 'FNR = FN / (FN + TP) = 1 - Recall',
      formulaExpanded: `${fn} / (${fn} + ${tp})`,
      value: fnrVal,
      percentage: formatPct(fnrVal),
      interpretation:
        'Proporción de casos positivos reales que el clasificador no detectó (escaparon al radar).',
      highMeaning:
        'El modelo es negligente o ciego ante los riesgos reales; se le escapan muchos eventos críticos.',
      lowMeaning:
        'Excelente capacidad de detección; el modelo rara vez deja pasar un positivo desapercibido.',
      limitations:
        'No refleja cuántas falsas alarmas se tuvieron que tolerar para alcanzar esa tasa.',
      businessExample:
        'En control de calidad de aviación, un FNR mayor a 0% puede significar una pieza defectuosa en vuelo.',
      undefinedReason:
        actualPositives === 0 ? 'No hay positivos reales en el dataset (FN + TP = 0).' : undefined,
    },
    npv: {
      id: 'npv',
      name: 'Valor Predictivo Negativo',
      shortName: 'NPV',
      category: 'negative_class',
      formula: 'NPV = TN / (TN + FN)',
      formulaExpanded: `${tn} / (${tn} + ${fn})`,
      value: npvVal,
      percentage: formatPct(npvVal),
      interpretation:
        'De todos los casos que el modelo predijo como negativos, ¿qué proporción es verdaderamente inocua/sana?',
      highMeaning:
        'Cuando el modelo dice "todo despejado / negativo", se puede confiar plenamente en ese dictamen.',
      lowMeaning:
        'Una predicción de "negativo" es riesgosa porque contiene muchos casos positivos encubiertos (falsos negativos).',
      limitations:
        'Al igual que la precisión, el NPV depende de la prevalencia real de la condición en la población evaluada.',
      businessExample:
        'En inspecciones aduaneras, garantiza que los contenedores liberados sin revisión física no contengan contrabando.',
      undefinedReason:
        predictedNegatives === 0
          ? 'El modelo no emitió ninguna predicción negativa (TN + FN = 0).'
          : undefined,
    },
    balancedAccuracy: {
      id: 'balancedAccuracy',
      name: 'Exactitud Balanceada',
      shortName: 'Balanced Acc',
      category: 'general',
      formula: 'Balanced Accuracy = (Recall + Especificidad) / 2',
      formulaExpanded:
        recallVal !== null && specificityVal !== null
          ? `(${formatNum(recallVal)} + ${formatNum(specificityVal)}) / 2`
          : 'Indefinido',
      value: balancedAccVal,
      percentage: formatPct(balancedAccVal),
      interpretation:
        'Promedio aritmético de la sensibilidad (clase positiva) y la especificidad (clase negativa).',
      highMeaning:
        'El clasificador se desempeña de forma equilibrada y consistente en ambas clases.',
      lowMeaning:
        'El clasificador está severamente sesgado o rinde pobremente en al menos una de las clases.',
      limitations:
        'Un modelo aleatorio en clases equilibradas da 0.50. Da el mismo peso relativo a ambas clases sin importar la frecuencia.',
      businessExample:
        'Sustituto ideal de la exactitud tradicional cuando se evalúan datasets médicos o de ciberseguridad con fuerte desbalance.',
      undefinedReason:
        recallVal === null || specificityVal === null
          ? 'Falta información para calcular recall o especificidad.'
          : undefined,
    },
    fBeta: {
      id: 'fBeta',
      name: `Puntaje F-Beta (β = ${beta})`,
      shortName: `F-${beta} Score`,
      category: 'combined',
      formula: 'F_β = (1 + β²) × (Precision × Recall) / (β² × Precision + Recall)',
      formulaExpanded:
        precisionVal !== null && recallVal !== null
          ? `(1 + ${betaSq}) × (${formatNum(precisionVal)} × ${formatNum(recallVal)}) / (${betaSq} × ${formatNum(precisionVal)} + ${formatNum(recallVal)})`
          : 'Indefinido',
      value: fBetaVal,
      percentage: formatPct(fBetaVal),
      interpretation: `Medida que pondera la importancia relativa entre precisión y recall. Con β = ${beta}, ${
        beta < 1
          ? 'se prioriza la Precisión (evitar FP).'
          : beta > 1
          ? 'se prioriza el Recall (evitar FN).'
          : 'ambos tienen igual peso (F1).'
      }`,
      highMeaning:
        'El modelo cumple con el objetivo de negocio ajustado según el costo preferencial de error.',
      lowMeaning:
        'El modelo no satisface el balance de calidad requerido bajo el esquema de penalización fijado.',
      limitations:
        'Requiere que el analista seleccione un valor de β justificado por la realidad económica o clínica del problema.',
      businessExample:
        'En diagnóstico médico se usa F2 (β=2) para priorizar recall. En marketing premium se usa F0.5 (β=0.5) para cuidar la precisión.',
      undefinedReason:
        precisionVal === null || recallVal === null
          ? 'Precisión o Recall están indefinidos.'
          : undefined,
    },
    mcc: {
      id: 'mcc',
      name: 'Coeficiente de Matthews',
      shortName: 'MCC',
      category: 'correlation',
      formula: 'MCC = (TP×TN - FP×FN) / √((TP+FP)(TP+FN)(TN+FP)(TN+FN))',
      formulaExpanded: `(${tp}×${tn} - ${fp}×${fn}) / √(${predictedPositives}×${actualPositives}×${actualNegatives}×${predictedNegatives})`,
      value: mccVal,
      percentage: mccVal !== null ? `${(mccVal).toFixed(3)} (rango [-1, 1])` : '0.000',
      interpretation:
        'Coeficiente de correlación entre la clasificación real y la predicha. Oscila entre -1 (desacuerdo total), 0 (azar) y +1 (predicción perfecta).',
      highMeaning:
        'Valores cercanos a +1 confirman que el modelo predice con alta fiabilidad incluso si una clase es extremadamente rara.',
      lowMeaning:
        'Cercano a 0 indica que el modelo no aporta información superior a una moneda al aire.',
      limitations:
        'Es más complejo de explicar a audiencias no técnicas que la exactitud o el F1-score.',
      businessExample:
        'Recomendado por bioinformáticos y científicos de datos senior para certificar modelos de detección de anomalías extremas.',
      undefinedReason: undefined,
    },
  };
}

/**
 * Normaliza la matriz de confusión binaria
 */
export function normalizeBinaryMatrix(
  matrix: BinaryConfusionMatrix,
  mode: 'none' | 'row' | 'col' | 'all'
): { tp: number; tn: number; fp: number; fn: number } {
  const { tp, tn, fp, fn } = matrix;
  const total = tp + tn + fp + fn;

  if (mode === 'none' || total === 0) {
    return { tp, tn, fp, fn };
  }

  if (mode === 'all') {
    return {
      tp: (tp / total) * 100,
      tn: (tn / total) * 100,
      fp: (fp / total) * 100,
      fn: (fn / total) * 100,
    };
  }

  if (mode === 'row') {
    // Normalizar por Fila (Clase Real)
    // Fila Positiva: TP + FN
    // Fila Negativa: FP + TN
    const rowPosTotal = tp + fn;
    const rowNegTotal = fp + tn;

    return {
      tp: rowPosTotal > 0 ? (tp / rowPosTotal) * 100 : 0,
      fn: rowPosTotal > 0 ? (fn / rowPosTotal) * 100 : 0,
      fp: rowNegTotal > 0 ? (fp / rowNegTotal) * 100 : 0,
      tn: rowNegTotal > 0 ? (tn / rowNegTotal) * 100 : 0,
    };
  }

  if (mode === 'col') {
    // Normalizar por Columna (Clase Predicha)
    // Columna Positiva: TP + FP
    // Columna Negativa: FN + TN
    const colPosTotal = tp + fp;
    const colNegTotal = fn + tn;

    return {
      tp: colPosTotal > 0 ? (tp / colPosTotal) * 100 : 0,
      fp: colPosTotal > 0 ? (fp / colPosTotal) * 100 : 0,
      fn: colNegTotal > 0 ? (fn / colNegTotal) * 100 : 0,
      tn: colNegTotal > 0 ? (tn / colNegTotal) * 100 : 0,
    };
  }

  return { tp, tn, fp, fn };
}

/**
 * Calcula el impacto financiero / económico a partir de la matriz de costos y la matriz de confusión
 */
export function calculateEconomicImpact(
  matrix: BinaryConfusionMatrix,
  costs: { costFP: number; costFN: number; benefitTP: number; benefitTN: number }
): {
  totalCost: number;
  totalBenefit: number;
  netValue: number;
  costBreakdown: { fpCost: number; fnCost: number; tpBenefit: number; tnBenefit: number };
} {
  const fpCost = matrix.fp * costs.costFP;
  const fnCost = matrix.fn * costs.costFN;
  const tpBenefit = matrix.tp * costs.benefitTP;
  const tnBenefit = matrix.tn * costs.benefitTN;

  const totalCost = fpCost + fnCost;
  const totalBenefit = tpBenefit + tnBenefit;
  const netValue = totalBenefit - totalCost;

  return {
    totalCost,
    totalBenefit,
    netValue,
    costBreakdown: { fpCost, fnCost, tpBenefit, tnBenefit },
  };
}

/**
 * Calcula métricas multiclase N x N
 */
export function calculateMulticlassMetrics(data: MulticlassMatrix): MulticlassMetricsSummary {
  const { classes, matrix } = data;
  const n = classes.length;
  let totalSamples = 0;
  let correctPredictions = 0;

  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      const count = matrix[r][c] || 0;
      totalSamples += count;
      if (r === c) {
        correctPredictions += count;
      }
    }
  }

  const accuracy = totalSamples > 0 ? correctPredictions / totalSamples : 0;

  const perClass = classes.map((className, i) => {
    // Para la clase i:
    // TP = matrix[i][i]
    // FN = suma de fila i excepto matrix[i][i]
    // FP = suma de columna i excepto matrix[i][i]
    // TN = resto
    const tp = matrix[i][i] || 0;
    let actualSupport = 0;
    for (let c = 0; c < n; c++) actualSupport += matrix[i][c] || 0;

    let predictedSupport = 0;
    for (let r = 0; r < n; r++) predictedSupport += matrix[r][i] || 0;

    const precision = predictedSupport > 0 ? tp / predictedSupport : null;
    const recall = actualSupport > 0 ? tp / actualSupport : null;

    let f1: number | null = null;
    if (precision !== null && recall !== null) {
      const sum = precision + recall;
      f1 = sum > 0 ? (2 * precision * recall) / sum : 0;
    }

    return {
      className,
      support: actualSupport,
      precision,
      recall,
      f1,
    };
  });

  // Macro metrics (promedio simple no ponderado)
  const validPrecisions = perClass.filter((c) => c.precision !== null).map((c) => c.precision!);
  const validRecalls = perClass.filter((c) => c.recall !== null).map((c) => c.recall!);
  const validF1s = perClass.filter((c) => c.f1 !== null).map((c) => c.f1!);

  const macroPrecision =
    validPrecisions.length > 0
      ? validPrecisions.reduce((a, b) => a + b, 0) / validPrecisions.length
      : 0;
  const macroRecall =
    validRecalls.length > 0 ? validRecalls.reduce((a, b) => a + b, 0) / validRecalls.length : 0;
  const macroF1 =
    validF1s.length > 0 ? validF1s.reduce((a, b) => a + b, 0) / validF1s.length : 0;

  // Micro F1 en multiclase global es equivalente a Accuracy global
  const microF1 = accuracy;

  // Weighted F1 (ponderado por el soporte real de cada clase)
  let weightedF1Sum = 0;
  let totalSupport = 0;
  perClass.forEach((c) => {
    if (c.f1 !== null) {
      weightedF1Sum += c.f1 * c.support;
    }
    totalSupport += c.support;
  });
  const weightedF1 = totalSupport > 0 ? weightedF1Sum / totalSupport : 0;

  return {
    accuracy,
    macroPrecision,
    macroRecall,
    macroF1,
    microF1,
    weightedF1,
    perClass,
  };
}

/**
 * Comprueba las fórmulas contra casos de prueba canónicos de la literatura estadística.
 * Retorna true si todos los casos pasan con tolerancia de 0.001.
 */
export function verifyEngineIntegrity(): { passed: boolean; testCasesCount: number } {
  // Caso de referencia scikit-learn standard:
  // TP=50, TN=40, FP=5, FN=5 => Total=100
  const m1: BinaryConfusionMatrix = { tp: 50, tn: 40, fp: 5, fn: 5 };
  const res1 = calculateBinaryMetrics(m1);

  const accOk = Math.abs((res1.accuracy.value ?? 0) - 0.9) < 0.001;
  const precOk = Math.abs((res1.precision.value ?? 0) - 0.909) < 0.002;
  const recOk = Math.abs((res1.recall.value ?? 0) - 0.909) < 0.002;
  const specOk = Math.abs((res1.specificity.value ?? 0) - 0.8888) < 0.002;
  const f1Ok = Math.abs((res1.f1.value ?? 0) - 0.909) < 0.002;

  // Caso extremo: TP=0, FP=0 (sin predicciones positivas)
  const m2: BinaryConfusionMatrix = { tp: 0, tn: 90, fp: 0, fn: 10 };
  const res2 = calculateBinaryMetrics(m2);
  const precUndefined = res2.precision.value === null;

  const passed = accOk && precOk && recOk && specOk && f1Ok && precUndefined;
  return { passed, testCasesCount: 2 };
}
