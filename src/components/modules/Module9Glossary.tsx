import React, { useState } from 'react';
import {
  BookMarked,
  Search,
  HelpCircle,
  BookOpen,
  ChevronDown,
  ExternalLink,
  GraduationCap,
} from 'lucide-react';
import {
  GLOSSARY_ITEMS,
  FAQ_ITEMS,
  BIBLIOGRAPHY_REFERENCES,
} from '../../data/glossaryData';

export const Module9Glossary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<'glossary' | 'faq' | 'bibliography'>('glossary');

  const filteredGlossary = GLOSSARY_ITEMS.filter(
    (item) =>
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Encabezado */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
          <span>MÓDULO 09</span>
          <span aria-hidden="true">·</span>
          <span>DOCUMENTACIÓN & CENTRO DE CONSULTA</span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
          Glosario Estadístico, FAQ y Bibliografía Académica
        </h1>
        <p className="mt-1 text-sm text-slate-600 max-w-3xl leading-relaxed">
          Consulta definiciones rigurosas, resuelve preguntas frecuentes sobre trade-offs y revisa las
          fuentes científicas canónicas que fundamentan cada fórmula de esta plataforma.
        </p>
      </div>

      {/* Navegación por pestañas */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('glossary')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'glossary'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookMarked className="w-3.5 h-3.5" />
          <span>Glosario Técnico ({GLOSSARY_ITEMS.length} términos)</span>
        </button>
        <button
          onClick={() => setActiveTab('faq')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'faq'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:text-slate-900'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Preguntas Frecuentes (FAQ)</span>
        </button>
        <button
          onClick={() => setActiveTab('bibliography')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'bibliography'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:text-slate-900'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Referencias Académicas y Literatura</span>
        </button>
      </div>

      {/* TAB 1: GLOSARIO */}
      {activeTab === 'glossary' && (
        <div className="space-y-4">
          {/* Buscador */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar término estadístico (ej. Precision, Recall, MCC, F1, Umbral)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 shadow-xs focus:outline-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredGlossary.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">{item.term}</h3>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{item.definition}</p>

                {item.formula && (
                  <div className="p-2 bg-slate-50 border border-slate-200 rounded-md font-mono text-[11px] text-indigo-900 font-bold">
                    {item.formula}
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                  <span>Fuente: {item.reference}</span>
                  {item.relatedTerms?.length > 0 && (
                    <span className="truncate max-w-[150px]">
                      Relacionado: {item.relatedTerms.slice(0, 2).join(', ')}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: PREGUNTAS FRECUENTES (FAQ) */}
      {activeTab === 'faq' && (
        <div className="space-y-3">
          {FAQ_ITEMS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                >
                  <span className="text-xs font-bold text-slate-900 leading-snug">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: REFERENCIAS ACADÉMICAS */}
      {activeTab === 'bibliography' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 lg:p-8 shadow-xs space-y-6">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Literatura Primaria y Citas Verificadas
            </h3>
            <p className="text-xs text-slate-500">
              Todas las fórmulas, definiciones y metodologías implementadas en MatrizLab provienen
              estrictamente de las siguientes publicaciones y manuales oficiales:
            </p>
          </div>

          <div className="space-y-4">
            {BIBLIOGRAPHY_REFERENCES.map((ref, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-bold text-indigo-900">{ref.author}</span>
                  <span className="text-[11px] font-semibold text-slate-500">{ref.source}</span>
                </div>
                <div className="text-xs font-semibold text-slate-800">{ref.title}</div>
                <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                  Conceptos clave tratados: <strong>{ref.topics}</strong>
                </p>
              </div>
            ))}
          </div>

          <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100 text-xs text-indigo-950">
            <strong>Reconocimiento a referentes de la disciplina:</strong> Nuestro agradecimiento a
            las obras formativas de <strong>Aurélien Géron</strong>, <strong>Andreas C. Müller</strong> y{' '}
            <strong>Trevor Hastie</strong>, cuyos textos continúan guiando la enseñanza ética y rigurosa
            del aprendizaje automático en todo el mundo.
          </div>
        </div>
      )}
    </div>
  );
};
