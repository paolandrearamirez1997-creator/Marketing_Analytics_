import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Module1Learn } from './components/modules/Module1Learn';
import { Module2Explorer } from './components/modules/Module2Explorer';
import { Module3Metrics } from './components/modules/Module3Metrics';
import { Module4Simulator } from './components/modules/Module4Simulator';
import { Module5Sectors } from './components/modules/Module5Sectors';
import { Module6Lab } from './components/modules/Module6Lab';
import { Module7Gamification } from './components/modules/Module7Gamification';
import { Module8Progress } from './components/modules/Module8Progress';
import { Module9Glossary } from './components/modules/Module9Glossary';
import { BinaryConfusionMatrix, UserProgress } from './types';
import {
  loadUserProgress,
  saveUserProgress,
  calculateLevel,
  INITIAL_PROGRESS,
} from './utils/storage';
import { verifyEngineIntegrity } from './utils/metrics';
import { Zap, Award, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeModuleId, setActiveModuleId] = useState<string>('m1');
  const [progress, setProgress] = useState<UserProgress>(loadUserProgress);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'xp' | 'badge' } | null>(
    null
  );

  // Matriz compartida para el explorador y la calculadora
  const [sharedMatrix, setSharedMatrix] = useState<BinaryConfusionMatrix>({
    tp: 85,
    fn: 15,
    fp: 12,
    tn: 88,
  });

  // Verificación formal de fórmulas al inicio
  useEffect(() => {
    const { passed, testCasesCount } = verifyEngineIntegrity();
    if (!passed) {
      console.warn('Alerta: Las pruebas de integridad de fórmulas estadísticas no pasaron el umbral de tolerancia.');
    }
  }, []);

  // Guardar progreso cada vez que cambia
  useEffect(() => {
    saveUserProgress(progress);
  }, [progress]);

  const showToast = (text: string, type: 'xp' | 'badge' = 'xp') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleAwardXP = (amount: number, reason: string) => {
    setProgress((prev) => {
      const newXP = prev.xp + amount;
      const newLevel = calculateLevel(newXP);
      return {
        ...prev,
        xp: newXP,
        level: newLevel,
      };
    });
    showToast(`+${amount} XP: ${reason}`, 'xp');
  };

  const handleUnlockBadge = (badgeId: string) => {
    setProgress((prev) => {
      if (prev.badges.includes(badgeId)) return prev;
      return {
        ...prev,
        badges: [...prev.badges, badgeId],
      };
    });
    showToast(`¡Nueva Insignia Desbloqueada!`, 'badge');
  };

  const handleRecordSectorCompleted = (sectorId: string) => {
    setProgress((prev) => {
      if (prev.completedSectorExercises.includes(sectorId)) return prev;
      return {
        ...prev,
        completedSectorExercises: [...prev.completedSectorExercises, sectorId],
      };
    });
  };

  const handleUpdateStudentName = (name: string) => {
    setProgress((prev) => ({ ...prev, studentName: name }));
  };

  const handleCompleteFinalExam = (score: number) => {
    setProgress((prev) => ({
      ...prev,
      finalExamCompleted: true,
      finalExamScore: score,
    }));
  };

  const handleResetProgress = () => {
    if (window.confirm('¿Deseas reiniciar todo tu progreso, puntos e insignias de MatrizLab?')) {
      setProgress(INITIAL_PROGRESS);
      saveUserProgress(INITIAL_PROGRESS);
      showToast('Progreso reiniciado a cero.', 'xp');
    }
  };

  const handleExportProgress = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(progress, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `matrizlab_progreso_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportProgress = (jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (typeof parsed.xp === 'number') {
        setProgress(parsed);
        saveUserProgress(parsed);
        showToast('Progreso importado con éxito.', 'xp');
      } else {
        alert('Archivo JSON no válido.');
      }
    } catch (e) {
      alert('Error al leer el archivo JSON.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-slate-900 antialiased selection:bg-indigo-100 selection:text-indigo-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 text-xs flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-3 duration-300">
          {toastMessage.type === 'xp' ? (
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
          ) : (
            <Award className="w-4 h-4 text-indigo-400" />
          )}
          <span className="font-semibold">{toastMessage.text}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        progress={progress}
        onResetProgress={handleResetProgress}
        activeModuleId={activeModuleId}
        onSelectModule={setActiveModuleId}
      />

      {/* Layout Principal: Sidebar + Vista de Módulo */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto">
        <Sidebar
          activeModuleId={activeModuleId}
          onSelectModule={setActiveModuleId}
        />

        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {activeModuleId === 'm1' && (
            <Module1Learn
              onAwardXP={handleAwardXP}
              onUnlockBadge={handleUnlockBadge}
              onGoToExplorer={() => setActiveModuleId('m2')}
            />
          )}

          {activeModuleId === 'm2' && (
            <Module2Explorer
              matrix={sharedMatrix}
              onChangeMatrix={setSharedMatrix}
              onGoToMetrics={() => setActiveModuleId('m3')}
              onAwardXP={handleAwardXP}
              onUnlockBadge={handleUnlockBadge}
            />
          )}

          {activeModuleId === 'm3' && (
            <Module3Metrics
              matrix={sharedMatrix}
              onUpdateMatrix={setSharedMatrix}
              onAwardXP={handleAwardXP}
            />
          )}

          {activeModuleId === 'm4' && (
            <Module4Simulator
              onAwardXP={handleAwardXP}
              onUnlockBadge={handleUnlockBadge}
            />
          )}

          {activeModuleId === 'm5' && (
            <Module5Sectors
              onAwardXP={handleAwardXP}
              onRecordSectorCompleted={handleRecordSectorCompleted}
              completedSectors={progress.completedSectorExercises}
            />
          )}

          {activeModuleId === 'm6' && (
            <Module6Lab
              onAwardXP={handleAwardXP}
              onUnlockBadge={handleUnlockBadge}
            />
          )}

          {activeModuleId === 'm7' && (
            <Module7Gamification
              progress={progress}
              onAwardXP={handleAwardXP}
              onUnlockBadge={handleUnlockBadge}
              onUpdateStudentName={handleUpdateStudentName}
              onCompleteFinalExam={handleCompleteFinalExam}
            />
          )}

          {activeModuleId === 'm8' && (
            <Module8Progress
              progress={progress}
              onResetProgress={handleResetProgress}
              onExportProgress={handleExportProgress}
              onImportProgress={handleImportProgress}
              onSelectModule={setActiveModuleId}
            />
          )}

          {activeModuleId === 'm9' && <Module9Glossary />}
        </main>
      </div>
    </div>
  );
}
