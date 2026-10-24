/**
 * Definiciones de tipos para MatrizLab
 */

export interface BinaryConfusionMatrix {
  tp: number; // Verdadero Positivo
  tn: number; // Verdadero Negativo
  fp: number; // Falso Positivo
  fn: number; // Falso Negativo
}

export type NormalizationMode = 'none' | 'row' | 'col' | 'all';

export interface MetricDetail {
  id: string;
  name: string;
  shortName: string;
  formula: string;
  formulaExpanded: string;
  value: number | null; // null si no está definido (división por cero)
  percentage: string;
  interpretation: string;
  highMeaning: string;
  lowMeaning: string;
  limitations: string;
  businessExample: string;
  undefinedReason?: string;
  category: 'general' | 'positive_class' | 'negative_class' | 'combined' | 'correlation';
}

export interface CostMatrixConfig {
  costFP: number; // Costo por falso positivo
  costFN: number; // Costo por falso negativo
  benefitTP: number; // Beneficio por verdadero positivo
  benefitTN: number; // Beneficio por verdadero negativo
}

export interface SectorCase {
  id: string;
  sector: 'Finanzas' | 'Telecomunicaciones' | 'Salud' | 'Comercio' | 'Manufactura' | 'Recursos Humanos';
  title: string;
  subtitle: string;
  context: string;
  positiveClassLabel: string;
  negativeClassLabel: string;
  initialMatrix: BinaryConfusionMatrix;
  costConfig: CostMatrixConfig;
  fpConsequence: string;
  fnConsequence: string;
  resolvedInsight: string;
  recommendedDecision: string;
  disclaimer?: string;
  exercise: {
    question: string;
    options: {
      text: string;
      isCorrect: boolean;
      feedback: string;
    }[];
    targetMetric: string;
  };
}

export interface MulticlassMatrix {
  classes: string[];
  matrix: number[][]; // [realIndex][predictedIndex]
  totalSamples: number;
}

export interface MulticlassMetricsSummary {
  accuracy: number;
  macroPrecision: number;
  macroRecall: number;
  macroF1: number;
  microF1: number;
  weightedF1: number;
  perClass: {
    className: string;
    support: number;
    precision: number | null;
    recall: number | null;
    f1: number | null;
  }[];
}

export interface UserProgress {
  xp: number;
  level: 'Principiante' | 'Explorador' | 'Analista' | 'Experto';
  streakDays: number;
  badges: string[];
  completedChallenges: string[];
  completedSectorExercises: string[];
  quizScores: Record<string, { correct: number; total: number }>;
  finalExamCompleted: boolean;
  finalExamScore?: number;
  studentName?: string;
}

export interface ChallengeQuestion {
  id: string;
  category: string;
  difficulty: 'fácil' | 'intermedio' | 'avanzado';
  question: string;
  contextMatrix?: BinaryConfusionMatrix;
  options: {
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  xpReward: number;
}

export interface GlossaryItem {
  term: string;
  definition: string;
  formula?: string;
  relatedTerms: string[];
  reference: string;
}

export interface ProbabilitySample {
  id: number;
  actual: 0 | 1;
  predictedProbability: number;
}
