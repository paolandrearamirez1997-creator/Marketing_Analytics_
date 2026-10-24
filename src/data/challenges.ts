/**
 * Preguntas de Quiz, Retos Gamificados e Insignias para MatrizLab
 */

import { ChallengeQuestion } from '../types';

export interface BadgeInfo {
  id: string;
  name: string;
  description: string;
  category: 'básico' | 'métricas' | 'negocio' | 'maestría';
  icon: string;
  condition: string;
}

export const BADGES_LIST: BadgeInfo[] = [
  {
    id: 'badge-first-steps',
    name: 'Primeros Pasos en ML',
    description: 'Completaste la introducción y comprendes qué es una matriz de confusión.',
    category: 'básico',
    icon: 'Compass',
    condition: 'Explora el módulo de fundamentos y ajusta tu primera matriz.',
  },
  {
    id: 'badge-paradox-hunter',
    name: 'Cazador de la Paradoja',
    description: 'Demostraste por qué un 99% de exactitud puede ser un modelo inútil.',
    category: 'métricas',
    icon: 'ShieldAlert',
    condition: 'Resuelve el reto sobre desbalance severo de clases.',
  },
  {
    id: 'badge-precision-master',
    name: 'Guardián de la Precisión',
    description: 'Identificaste cuándo los falsos positivos son el enemigo número uno.',
    category: 'métricas',
    icon: 'Target',
    condition: 'Responde correctamente preguntas sobre valor predictivo positivo.',
  },
  {
    id: 'badge-recall-champion',
    name: 'Campeón del Recall',
    description: 'Minimizaste los falsos negativos en escenarios de salud y ciberseguridad.',
    category: 'métricas',
    icon: 'Activity',
    condition: 'Supera el caso de diagnóstico médico oncológico.',
  },
  {
    id: 'badge-threshold-tuner',
    name: 'Afinador de Umbrales',
    description: 'Comprendiste el trade-off continuo de modificar el punto de corte τ.',
    category: 'métricas',
    icon: 'Sliders',
    condition: 'Experimenta con el simulador de umbrales continuo.',
  },
  {
    id: 'badge-cost-strategist',
    name: 'Estratega de Costos',
    description: 'Maximizaste el valor financiero neto evaluando costos asimétricos de error.',
    category: 'negocio',
    icon: 'DollarSign',
    condition: 'Completa al menos 3 casos sectoriales de negocio.',
  },
  {
    id: 'badge-data-scientist',
    name: 'Científico de Datos Práctico',
    description: 'Procesaste un conjunto de datos propio o multiclase en el laboratorio.',
    category: 'maestría',
    icon: 'FileSpreadsheet',
    condition: 'Genera una matriz N x N con datos del laboratorio.',
  },
  {
    id: 'badge-ml-master',
    name: 'Maestro en Evaluación de Clasificadores',
    description: 'Aprobaste el Desafío Integrador Final con más del 80% de aciertos.',
    category: 'maestría',
    icon: 'Award',
    condition: 'Supera el examen final integrador.',
  },
];

export const CHALLENGE_QUESTIONS: ChallengeQuestion[] = [
  {
    id: 'q1',
    category: 'Fundamentos',
    difficulty: 'fácil',
    question:
      'En un sistema de detección de spam, si un correo legítimo e importante de tu jefe se clasifica en la carpeta de Spam, ¿qué cuadrante de la matriz representa este error?',
    options: [
      {
        text: 'Falso Positivo (FP): El modelo emitió alerta de spam sobre un correo que no lo era.',
        isCorrect: true,
        explanation:
          '¡Exacto! El estado real era Negativo (correo legítimo), pero la predicción del modelo fue Positiva (Spam). Por tanto, es un Falso Positivo (Error Tipo I).',
      },
      {
        text: 'Falso Negativo (FN): El modelo no vio el correo.',
        isCorrect: false,
        explanation: 'Falso. Un FN ocurriría si un correo basura entrara a tu bandeja principal.',
      },
      {
        text: 'Verdadero Positivo (TP): Porque el clasificador tomó una decisión contundente.',
        isCorrect: false,
        explanation: 'Falso. Los verdaderos positivos son aciertos, no equivocaciones.',
      },
      {
        text: 'Verdadero Negativo (TN): Porque el correo era inocuo.',
        isCorrect: false,
        explanation: 'Incorrecto. Si fuera TN, el correo habría quedado en la bandeja de entrada.',
      },
    ],
    xpReward: 30,
  },
  {
    id: 'q2',
    category: 'Desbalance & Exactitud',
    difficulty: 'fácil',
    question:
      'Si un clasificador obtiene una Exactitud (Accuracy) del 98%, ¿podemos afirmar con total seguridad que es un modelo excelente para poner en producción?',
    options: [
      {
        text: 'No necesariamente. Si la clase positiva es muy rara (ej. 1%), un modelo que predice siempre la clase mayoritaria puede tener 99% de exactitud y 0% de utilidad.',
        isCorrect: true,
        explanation:
          '¡Correcto! Es la célebre Paradoja de la Exactitud. En clases desbalanceadas, la exactitud suele estar inflada por la abundancia de la clase dominante.',
      },
      {
        text: 'Sí, porque 98% es superior al estándar industrial del 90%.',
        isCorrect: false,
        explanation: 'Falso. En ciencia de datos nunca se evalúa un clasificador solo por un número descontextualizado.',
      },
      {
        text: 'Solo si el Falsos Positivos Rate (FPR) es exactamente igual al Falsos Negativos Rate (FNR).',
        isCorrect: false,
        explanation: 'Incorrecto. La igualdad entre tasas de error no garantiza calidad de detección.',
      },
    ],
    xpReward: 40,
  },
  {
    id: 'q3',
    category: 'Métricas de Precisión y Recall',
    difficulty: 'intermedio',
    question:
      'En un modelo con TP = 80, FP = 20, FN = 20 y TN = 880, ¿cuál es el valor de la Precisión y el Recall respectivamente?',
    contextMatrix: { tp: 80, fp: 20, fn: 20, tn: 880 },
    options: [
      {
        text: 'Precisión = 80.0%, Recall = 80.0%',
        isCorrect: true,
        explanation:
          '¡Impecable! Precisión = TP/(TP+FP) = 80/(80+20) = 80/100 = 80%. Recall = TP/(TP+FN) = 80/(80+20) = 80/100 = 80%.',
      },
      {
        text: 'Precisión = 88.0%, Recall = 92.0%',
        isCorrect: false,
        explanation: 'Cálculo incorrecto. Revisa las fórmulas de precisión y recall.',
      },
      {
        text: 'Precisión = 80.0%, Recall = 98.0%',
        isCorrect: false,
        explanation: 'El 98% corresponde a la especificidad TN/(TN+FP) = 880/900 = 97.7%, no al recall.',
      },
    ],
    xpReward: 50,
  },
  {
    id: 'q4',
    category: 'Curvas y Umbrales',
    difficulty: 'intermedio',
    question:
      'Si disminuimos el umbral de decisión τ de 0.50 a 0.20 en un clasificador probabilístico, ¿qué efecto general ocurre con la Sensibilidad (Recall) y la Precisión?',
    options: [
      {
        text: 'El Recall tiende a subir (detectamos más positivos reales) y la Precisión tiende a bajar (toleramos más falsas alarmas).',
        isCorrect: true,
        explanation:
          '¡Exacto! Al bajar el umbral, volvemos al modelo más audaz y alarmista: casi todo califica como positivo, capturando más casos reales pero atrayendo más errores.',
      },
      {
        text: 'Tanto el Recall como la Precisión aumentan de forma simultánea.',
        isCorrect: false,
        explanation: 'Falso. Existe un trade-off fundamental entre precisión y recall.',
      },
      {
        text: 'El Recall baja y la Precisión sube.',
        isCorrect: false,
        explanation: 'Al revés: eso ocurriría si subieras el umbral a 0.80.',
      },
    ],
    xpReward: 50,
  },
  {
    id: 'q5',
    category: 'Métricas Combinadas',
    difficulty: 'avanzado',
    question:
      '¿Por qué se prefiere el Coeficiente de Correlación de Matthews (MCC) sobre el F1-Score cuando se auditan clasificadores en conjuntos de datos extremadamente asimétricos?',
    options: [
      {
        text: 'Porque el MCC toma en cuenta de manera simétrica los 4 cuadrantes (incluyendo los Verdaderos Negativos), mientras que el F1 ignora por completo a los TN.',
        isCorrect: true,
        explanation:
          '¡Respuesta magistral! El F1-score no incluye los TN en su fórmula. Por tanto, un modelo que clasifique pésimamente a la clase negativa puede mostrar un F1 aceptable, mientras que el MCC caerá de inmediato.',
      },
      {
        text: 'Porque el MCC siempre es un porcentaje positivo entre 0% y 100%.',
        isCorrect: false,
        explanation: 'Falso. El MCC varía entre -1.0 y +1.0.',
      },
      {
        text: 'Porque el MCC no requiere calcular raíces cuadradas.',
        isCorrect: false,
        explanation: 'Falso. La fórmula del MCC contiene una raíz cuadrada en el denominador.',
      },
    ],
    xpReward: 60,
  },
  {
    id: 'q6',
    category: 'Negocio y Costos',
    difficulty: 'avanzado',
    question:
      'Un banco compara dos clasificadores de fraude: Modelo A (F1 = 0.82, 100 FN, 20 FP) y Modelo B (F1 = 0.85, 30 FN, 250 FP). Si cada fraude no detectado (FN) cuesta $1,000 y cada falsa alarma (FP) cuesta $10, ¿cuál modelo es económicamente superior?',
    options: [
      {
        text: 'El Modelo B, porque genera una pérdida total de $32,500 frente a los $100,200 del Modelo A, a pesar de tener más falsas alarmas.',
        isCorrect: true,
        explanation:
          '¡Brillante análisis financiero! Pérdida Modelo A: (100 × $1,000) + (20 × $10) = $100,200. Pérdida Modelo B: (30 × $1,000) + (250 × $10) = $32,500. El Modelo B ahorra casi $68,000 al banco a pesar de tener más FP.',
      },
      {
        text: 'El Modelo A, porque tiene menos falsos positivos y menor molestia a los usuarios.',
        isCorrect: false,
        explanation: 'Incorrecto. Los 100 fraudes no detectados del Modelo A arruinan el balance del banco.',
      },
      {
        text: 'Ambos son idénticos porque el F1-Score es muy cercano.',
        isCorrect: false,
        explanation: 'Falso. El F1 no contempla los costos monetarios del mundo real.',
      },
    ],
    xpReward: 70,
  },
];
