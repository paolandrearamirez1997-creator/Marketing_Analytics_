import React from 'react';
import {
  BookOpen,
  Grid,
  Calculator,
  Sliders,
  Briefcase,
  FileSpreadsheet,
  Trophy,
  BarChart3,
  BookMarked,
  CheckCircle2,
} from 'lucide-react';

interface SidebarProps {
  activeModuleId: string;
  onSelectModule: (id: string) => void;
  completedModulesCount?: number;
}

export const MODULES_CONFIG = [
  {
    id: 'm1',
    number: '01',
    title: 'Aprende desde Cero',
    subtitle: 'Fundamentos, anatomía y paradoja',
    icon: BookOpen,
  },
  {
    id: 'm2',
    number: '02',
    title: 'Explorador 2×2',
    subtitle: 'Matriz dinámica & normalización',
    icon: Grid,
  },
  {
    id: 'm3',
    number: '03',
    title: 'Calculadora de Métricas',
    subtitle: '11 métricas con fórmulas paso a paso',
    icon: Calculator,
  },
  {
    id: 'm4',
    number: '04',
    title: 'Simulador de Decisiones',
    subtitle: 'Ajuste de umbrales y costos A/B',
    icon: Sliders,
  },
  {
    id: 'm5',
    number: '05',
    title: 'Casos Sectoriales',
    subtitle: 'Finanzas, salud, telco y 3 más',
    icon: Briefcase,
  },
  {
    id: 'm6',
    number: '06',
    title: 'Laboratorio de Datos',
    subtitle: 'Carga CSV y multiclase N×N',
    icon: FileSpreadsheet,
  },
  {
    id: 'm7',
    number: '07',
    title: 'Gamificación & Retos',
    subtitle: 'Quizzes, insignias y examen final',
    icon: Trophy,
  },
  {
    id: 'm8',
    number: '08',
    title: 'Panel de Progreso',
    subtitle: 'Radar de competencias & analítica',
    icon: BarChart3,
  },
  {
    id: 'm9',
    number: '09',
    title: 'Glosario & Referencias',
    subtitle: 'Citas académicas (Bishop, Fawcett)',
    icon: BookMarked,
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeModuleId, onSelectModule }) => {
  return (
    <aside className="w-full lg:w-72 shrink-0 bg-white border-r border-slate-200/80 p-4 flex flex-col gap-1.5 overflow-y-auto">
      <div className="px-3 py-2 text-xs font-semibold text-slate-400 tracking-wider">
        MÓDULOS DE APRENDIZAJE
      </div>

      <nav className="flex flex-col gap-1">
        {MODULES_CONFIG.map((mod) => {
          const Icon = mod.icon;
          const isActive = activeModuleId === mod.id;

          return (
            <button
              key={mod.id}
              onClick={() => onSelectModule(mod.id)}
              className={`w-full flex items-start gap-3 p-2.5 rounded-lg text-left transition-all relative ${
                isActive
                  ? 'bg-indigo-50/80 text-indigo-950 font-medium border border-indigo-200/60 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 text-xs font-semibold mt-0.5 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-mono text-slate-400 font-normal">{mod.number}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0"></span>
                  )}
                </div>
                <div className="text-sm font-semibold truncate leading-snug text-slate-900">
                  {mod.title}
                </div>
                <div className="text-[11px] text-slate-500 truncate leading-normal">
                  {mod.subtitle}
                </div>
              </div>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-slate-100 text-[11px] text-slate-400 px-3 leading-relaxed">
        Rigor estadístico scikit-learn & Fawcett (2006) · 100% privado en memoria local
      </div>
    </aside>
  );
};
