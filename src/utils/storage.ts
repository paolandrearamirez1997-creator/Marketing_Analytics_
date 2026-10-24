/**
 * Persistencia en LocalStorage para Gamificación y Progreso del Usuario
 */

import { UserProgress } from '../types';

const STORAGE_KEY = 'matrizlab_user_progress_v1';

export const INITIAL_PROGRESS: UserProgress = {
  xp: 0,
  level: 'Principiante',
  streakDays: 1,
  badges: [],
  completedChallenges: [],
  completedSectorExercises: [],
  quizScores: {},
  finalExamCompleted: false,
  finalExamScore: 0,
  studentName: '',
};

export function loadUserProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_PROGRESS;
    const parsed = JSON.parse(raw);
    return { ...INITIAL_PROGRESS, ...parsed };
  } catch (err) {
    console.error('Error al cargar progreso de usuario:', err);
    return INITIAL_PROGRESS;
  }
}

export function saveUserProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (err) {
    console.error('Error al guardar progreso en localStorage:', err);
  }
}

export function calculateLevel(xp: number): 'Principiante' | 'Explorador' | 'Analista' | 'Experto' {
  if (xp >= 1000) return 'Experto';
  if (xp >= 500) return 'Analista';
  if (xp >= 200) return 'Explorador';
  return 'Principiante';
}

export function getNextLevelXP(xp: number): { nextLevel: string; xpNeeded: number; progressPct: number } {
  if (xp >= 1000) {
    return { nextLevel: 'Nivel Máximo (Experto)', xpNeeded: 0, progressPct: 100 };
  }
  if (xp >= 500) {
    const needed = 1000 - xp;
    const pct = ((xp - 500) / 500) * 100;
    return { nextLevel: 'Experto', xpNeeded: needed, progressPct: Math.min(100, Math.max(0, pct)) };
  }
  if (xp >= 200) {
    const needed = 500 - xp;
    const pct = ((xp - 200) / 300) * 100;
    return { nextLevel: 'Analista', xpNeeded: needed, progressPct: Math.min(100, Math.max(0, pct)) };
  }
  const needed = 200 - xp;
  const pct = (xp / 200) * 100;
  return { nextLevel: 'Explorador', xpNeeded: needed, progressPct: Math.min(100, Math.max(0, pct)) };
}
