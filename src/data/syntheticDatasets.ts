/**
 * Datasets calibrados con probabilidades reales para simulación de umbral (τ)
 * y plantillas de CSV preconfiguradas para el Laboratorio de Datos.
 */

import { ProbabilitySample } from '../types';

// Generador determinista de 250 muestras probabilísticas con distribución bimodal realista
// Clase positiva (50 casos): probabilidades con media ~0.72 y dispersión
// Clase negativa (200 casos): probabilidades con media ~0.24 y dispersión
function generateCalibratedProbabilities(): ProbabilitySample[] {
  const samples: ProbabilitySample[] = [];
  let id = 1;

  // Semilla fija pseudoaleatoria (LCG) para reproducibilidad idéntica
  let seed = 42;
  const pseudoRand = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  // 50 Positivos reales
  for (let i = 0; i < 50; i++) {
    const u1 = pseudoRand();
    const u2 = pseudoRand();
    // Distribución sesgada hacia valores altos con cola inferior (algunos casos difíciles)
    let p = 0.45 + 0.5 * Math.pow(u1, 0.7) + (u2 - 0.5) * 0.15;
    p = Math.max(0.08, Math.min(0.98, p));
    samples.push({
      id: id++,
      actual: 1,
      predictedProbability: parseFloat(p.toFixed(3)),
    });
  }

  // 200 Negativos reales
  for (let i = 0; i < 200; i++) {
    const u1 = pseudoRand();
    const u2 = pseudoRand();
    // Distribución sesgada hacia valores bajos con cola superior (algunas falsas alarmas)
    let p = 0.05 + 0.45 * Math.pow(u1, 1.8) + (u2 - 0.5) * 0.12;
    p = Math.max(0.02, Math.min(0.89, p));
    samples.push({
      id: id++,
      actual: 0,
      predictedProbability: parseFloat(p.toFixed(3)),
    });
  }

  return samples.sort((a, b) => b.predictedProbability - a.predictedProbability);
}

export const PROBABILITY_BENCHMARK_DATA: ProbabilitySample[] = generateCalibratedProbabilities();

/**
 * Recalcula la matriz binaria exacta para un umbral dado a partir de datos probabilísticos reales
 */
export function calculateMatrixFromThreshold(
  samples: ProbabilitySample[],
  threshold: number
): { tp: number; tn: number; fp: number; fn: number } {
  let tp = 0;
  let tn = 0;
  let fp = 0;
  let fn = 0;

  for (const s of samples) {
    const predictedPositive = s.predictedProbability >= threshold;
    if (s.actual === 1) {
      if (predictedPositive) {
        tp++;
      } else {
        fn++;
      }
    } else {
      if (predictedPositive) {
        fp++;
      } else {
        tn++;
      }
    }
  }

  return { tp, tn, fp, fn };
}

/**
 * Plantillas CSV de prueba para Módulo 6 (Laboratorio de datos propios)
 */
export const SAMPLE_CSV_DATASETS: {
  id: string;
  name: string;
  description: string;
  isMulticlass: boolean;
  content: string;
}[] = [
  {
    id: 'credit-risk-binary',
    name: 'Evaluación Crediticia (Binario)',
    description: '100 solicitudes de crédito con dictamen de mora real y predicción del modelo de riesgo.',
    isMulticlass: false,
    content: `id_cliente,clase_real,clase_predicha,probabilidad_riesgo
C001,Incumple,Incumple,0.88
C002,Paga,Paga,0.12
C003,Paga,Paga,0.05
C004,Incumple,Paga,0.41
C005,Paga,Incumple,0.62
C006,Paga,Paga,0.18
C007,Incumple,Incumple,0.92
C008,Paga,Paga,0.22
C009,Paga,Paga,0.09
C010,Incumple,Incumple,0.78
C011,Paga,Paga,0.31
C012,Paga,Paga,0.15
C013,Incumple,Incumple,0.84
C014,Paga,Paga,0.04
C015,Paga,Incumple,0.55
C016,Incumple,Incumple,0.95
C017,Paga,Paga,0.28
C018,Paga,Paga,0.11
C019,Incumple,Incumple,0.73
C020,Paga,Paga,0.06
C021,Paga,Paga,0.33
C022,Incumple,Paga,0.47
C023,Paga,Paga,0.19
C024,Paga,Paga,0.08
C025,Incumple,Incumple,0.89
C026,Paga,Paga,0.21
C027,Paga,Paga,0.14
C028,Paga,Paga,0.02
C029,Incumple,Incumple,0.81
C030,Paga,Paga,0.35`,
  },
  {
    id: 'equipment-quality-multiclass',
    name: 'Mantenimiento Industrial (Multiclase 3 Niveles)',
    description: 'Diagnóstico de salud de turbinas: Operativo, Alerta Temprana, Falla Inminente.',
    isMulticlass: true,
    content: `id_motor,estado_real,estado_predicho
M01,Operativo,Operativo
M02,Operativo,Operativo
M03,Alerta_Temprana,Alerta_Temprana
M04,Operativo,Operativo
M05,Falla_Inminente,Falla_Inminente
M06,Alerta_Temprana,Operativo
M07,Operativo,Operativo
M08,Falla_Inminente,Falla_Inminente
M09,Operativo,Alerta_Temprana
M10,Alerta_Temprana,Alerta_Temprana
M11,Operativo,Operativo
M12,Falla_Inminente,Alerta_Temprana
M13,Operativo,Operativo
M14,Alerta_Temprana,Alerta_Temprana
M15,Operativo,Operativo
M16,Operativo,Operativo
M17,Falla_Inminente,Falla_Inminente
M18,Alerta_Temprana,Alerta_Temprana
M19,Operativo,Operativo
M20,Operativo,Operativo
M21,Alerta_Temprana,Alerta_Temprana
M22,Falla_Inminente,Falla_Inminente
M23,Operativo,Operativo
M24,Alerta_Temprana,Operativo
M25,Operativo,Operativo`,
  },
];
