import React from 'react';
import {
  BarChart3,
  Award,
  Zap,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Download,
  Upload,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Target,
} from 'lucide-react';
import { UserProgress } from '../../types';
import { SECTOR_CASES } from '../../data/sectorCases';
import { BADGES_LIST } from '../../data/challenges';
import { getNextLevelXP } from '../../utils/storage';

interface Module8ProgressProps {
  progress: UserProgress;
  onResetProgress: () => void;
  onExportProgress: () => void;
  onImportProgress: (jsonStr: string) => void;
  onSelectModule: (id: string) => void;
}

export const Module8Progress: React.FC<Module8ProgressProps> = ({
  progress,
  onResetProgress,
  onExportProgress,
  onImportProgress,
  onSelectModule,
}) => {
  const levelInfo = getNextLevelXP(progress.xp);

  const completedSectorsCount = progress.completedSectorExercises.length;
  const totalSectorsCount = SECTOR_CASES.length;
  const sectorsProgressPct = Math.round((completedSectorsCount / totalSectorsCount) * 100);

  // Estimación de competencias
  const competencies = [
    {
      name: 'Anatomía de la Matriz & Cuadrantes (TP, TN, FP, FN)',
      pct: progress.xp > 30 ? 100 : Math.round((progress.xp / 30) * 100),
      moduleLink: 'm1',
    },
    {
      name: 'Trade-off entre Precisión y Recall',
      pct: progress.xp > 100 ? 100 : Math.round((progress.xp / 100) * 100),
      moduleLink: 'm3',
    },
    {
      name: 'Detección de la Paradoja de la Exactitud en Desbalance',
      pct: progress.badges.includes('badge-paradox-hunter') ? 100 : 25,
      moduleLink: 'm1',
    },
    {
      name: 'Optimización de Umbrales (τ) y Curvas',
      pct: progress.badges.includes('badge-threshold-tuner') ? 100 : 30,
      moduleLink: 'm4',
    },
    {
      name: 'Evaluación de Costos Asimétricos de Negocio',
      pct: Math.min(100, completedSectorsCount * 20),
      moduleLink: 'm5',
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) onImportProgress(content);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Encabezado */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
          <span>MÓDULO 08</span>
          <span aria-hidden="true">·</span>
          <span>PANEL DE PROGRESO & ANALÍTICA</span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
          Tu Trayectoria y Competencias de Aprendizaje
        </h1>
        <p className="mt-1 text-sm text-slate-600 max-w-3xl leading-relaxed">
          Revisa las habilidades estadísticas dominadas, los sectores empresariales completados y las
          recomendaciones personalizadas para consolidar tu conocimiento en evaluación de modelos.
        </p>
      </div>

      {/* Tarjetas de Resumen KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Nivel Actual</span>
            <Award className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl font-black text-slate-900">{progress.level}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Próximo: {levelInfo.nextLevel}
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">XP Acumulados</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-black text-slate-900 tabular-nums">{progress.xp} XP</div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {levelInfo.xpNeeded > 0 ? `${levelInfo.xpNeeded} XP para subir` : 'Nivel máximo'}
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Insignias</span>
            <Award className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-black text-slate-900 tabular-nums">
            {progress.badges.length} / {BADGES_LIST.length}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {Math.round((progress.badges.length / BADGES_LIST.length) * 100)}% desbloqueadas
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Casos Sectoriales</span>
            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl font-black text-slate-900 tabular-nums">
            {completedSectorsCount} / {totalSectorsCount}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {sectorsProgressPct}% del catálogo
          </span>
        </div>
      </div>

      {/* Radar de Competencias Dominadas */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 lg:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Diagnóstico de Competencias Estadísticas
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">Calculado a partir de tu interacción</span>
        </div>

        <div className="space-y-4">
          {competencies.map((c, i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800">{c.name}</span>
                <span className="font-bold text-indigo-700 tabular-nums">{c.pct}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                  style={{ width: `${c.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progreso por Sector Económico */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Avance en Casos Prácticos Sectoriales
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {SECTOR_CASES.map((sc) => {
            const isCompleted = progress.completedSectorExercises.includes(sc.id);
            return (
              <div
                key={sc.id}
                className={`p-3.5 rounded-lg border text-xs flex items-center justify-between ${
                  isCompleted
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <div>
                  <span className="font-bold block text-slate-900">{sc.sector}</span>
                  <span className="text-[11px] text-slate-500 truncate block max-w-[170px]">
                    {sc.title}
                  </span>
                </div>
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <button
                    onClick={() => onSelectModule('m5')}
                    className="text-[11px] text-indigo-600 font-semibold hover:underline"
                  >
                    Resolver →
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recomendación del Siguiente Paso */}
      <div className="bg-indigo-50 border border-indigo-200/80 rounded-xl p-6 flex items-center justify-between flex-wrap gap-4">
        <div className="space-y-1 max-w-xl">
          <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
            Recomendación de Aprendizaje Personalizada
          </span>
          <p className="text-xs text-indigo-950 leading-relaxed">
            {!progress.badges.includes('badge-threshold-tuner')
              ? 'Te sugerimos explorar el Módulo 04 (Simulador de Umbrales) para ver cómo las variaciones en el punto de corte τ impactan directamente la sensibilidad y la tasa de falsas alarmas.'
              : completedSectorsCount < totalSectorsCount
              ? `Aún te faltan ${totalSectorsCount - completedSectorsCount} casos prácticos por resolver en el Módulo 05. Completa el caso de Salud o Manufactura para desbloquear la insignia de Estratega de Costos.`
              : '¡Has dominado los módulos principales! Dirígete al Módulo 07 para realizar el Desafío Integrador Final y generar tu Certificado de Competencia.'}
          </p>
        </div>

        <button
          onClick={() =>
            onSelectModule(
              !progress.badges.includes('badge-threshold-tuner')
                ? 'm4'
                : completedSectorsCount < totalSectorsCount
                ? 'm5'
                : 'm7'
            )
          }
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs shrink-0"
        >
          <span>Ir al Siguiente Módulo</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Gestión de Datos y Persistencia */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex items-center justify-between flex-wrap gap-3">
        <div>
          <span className="text-xs font-bold text-slate-800 block">Gestión del Almacenamiento Local</span>
          <span className="text-[11px] text-slate-500">
            Tu progreso se guarda automáticamente en este dispositivo.
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onExportProgress}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 border border-slate-200"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar JSON</span>
          </button>

          <label className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 border border-slate-200 cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span>Importar</span>
            <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
          </label>

          <button
            onClick={onResetProgress}
            className="px-3 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors flex items-center gap-1.5 border border-rose-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reiniciar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
