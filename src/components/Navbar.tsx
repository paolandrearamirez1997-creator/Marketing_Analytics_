import React from 'react';
import { Award, Zap, RefreshCw, BookOpen, Layers } from 'lucide-react';
import { UserProgress } from '../types';

interface NavbarProps {
  progress: UserProgress;
  onResetProgress: () => void;
  activeModuleId: string;
  onSelectModule: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  progress,
  onResetProgress,
  activeModuleId,
  onSelectModule,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 lg:px-8 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zona 1: Brand wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onSelectModule('m1')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:bg-indigo-700 transition-colors">
              M
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 block leading-tight">
                MatrizLab
              </span>
              <span className="text-[11px] font-medium text-slate-500 block">
                Evaluación & Métricas de ML
              </span>
            </div>
          </button>
        </div>

        {/* Zona 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => onSelectModule('m1')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 ${
              activeModuleId === 'm1' ? 'text-indigo-600 font-semibold' : ''
            }`}
          >
            Fundamentos
          </button>
          <button
            onClick={() => onSelectModule('m2')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 ${
              activeModuleId === 'm2' ? 'text-indigo-600 font-semibold' : ''
            }`}
          >
            Explorador 2×2
          </button>
          <button
            onClick={() => onSelectModule('m4')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 ${
              activeModuleId === 'm4' ? 'text-indigo-600 font-semibold' : ''
            }`}
          >
            Simulador de Umbrales
          </button>
          <button
            onClick={() => onSelectModule('m6')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 ${
              activeModuleId === 'm6' ? 'text-indigo-600 font-semibold' : ''
            }`}
          >
            Cargar Datos (Lab)
          </button>
          <button
            onClick={() => onSelectModule('m5')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 ${
              activeModuleId === 'm5' ? 'text-indigo-600 font-semibold' : ''
            }`}
          >
            Casos de Negocio
          </button>
          <button
            onClick={() => onSelectModule('m7')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 ${
              activeModuleId === 'm7' ? 'text-indigo-600 font-semibold' : ''
            }`}
          >
            Retos & Insignias
          </button>
        </nav>

        {/* Zona 3: Estado de Gamificación & Acción Principal */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 rounded-lg px-3 py-1.5 text-xs text-slate-700">
            <div className="flex items-center gap-1.5 font-semibold text-indigo-700">
              <Zap className="w-3.5 h-3.5 fill-indigo-600 text-indigo-600" />
              <span className="tabular-nums font-bold">{progress.xp}</span> XP
            </div>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-1 text-slate-600 font-medium">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>{progress.level}</span>
            </div>
          </div>

          <button
            onClick={() => onSelectModule('m8')}
            className="px-3 py-1.5 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 shadow-sm"
          >
            Mi Progreso
          </button>
        </div>
      </div>
    </header>
  );
};
