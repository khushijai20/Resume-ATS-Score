import React, { useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Lightbulb,
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { ResumeProblem, ProblemSeverity } from '../types/resume';

interface ProblemsViewProps {
  problems: ResumeProblem[];
  onOptimize: () => void;
  onNavigateTab: (tab: string) => void;
}

export const ProblemsView: React.FC<ProblemsViewProps> = ({
  problems,
  onOptimize,
  onNavigateTab,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | ProblemSeverity>('all');
  const [plainLanguageMode, setPlainLanguageMode] = useState<boolean>(true);

  const getSeverityBadge = (severity: ProblemSeverity) => {
    switch (severity) {
      case 'critical':
        return {
          label: '🔴 Critical',
          badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
          borderClass: 'border-l-4 border-l-rose-500',
          icon: AlertCircle
        };
      case 'important':
        return {
          label: '🟠 Important',
          badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          borderClass: 'border-l-4 border-l-amber-500',
          icon: AlertTriangle
        };
      case 'recommended':
        return {
          label: '🟡 Recommended',
          badgeClass: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
          borderClass: 'border-l-4 border-l-sky-500',
          icon: Info
        };
      case 'good':
        return {
          label: '🟢 Good',
          badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          borderClass: 'border-l-4 border-l-emerald-500',
          icon: CheckCircle2
        };
    }
  };

  const filteredProblems = problems.filter(p => {
    if (selectedFilter === 'all') return true;
    return p.severity === selectedFilter;
  });

  const criticalCount = problems.filter(p => p.severity === 'critical').length;
  const importantCount = problems.filter(p => p.severity === 'important').length;
  const recommendedCount = problems.filter(p => p.severity === 'recommended').length;
  const goodCount = problems.filter(p => p.severity === 'good').length;

  return (
    <div className="space-y-6">
      {/* Header with Mode Toggle */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-indigo-400" /> Problems Detected & Recruiter Audit
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Transparent breakdown of every issue detected by the ATS parser and technical recruiters.
          </p>
        </div>

        {/* AI Explanation Mode Toggle */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold text-slate-200">
              Plain English Mode:
            </span>
            <button
              type="button"
              onClick={() => setPlainLanguageMode(!plainLanguageMode)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                plainLanguageMode ? 'bg-indigo-600' : 'bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  plainLanguageMode ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <button
            type="button"
            onClick={onOptimize}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-sm hover:from-indigo-500 hover:to-indigo-400 transition"
          >
            <Zap className="w-3.5 h-3.5" />
            Auto-Fix with Optimizer
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <button
          type="button"
          onClick={() => setSelectedFilter('all')}
          className={`px-3 py-1.5 rounded-xl font-semibold border transition ${
            selectedFilter === 'all'
              ? 'bg-slate-800 text-white border-slate-700 shadow-sm'
              : 'text-slate-400 border-transparent hover:bg-slate-800/50'
          }`}
        >
          All Issues ({problems.length})
        </button>
        <button
          type="button"
          onClick={() => setSelectedFilter('critical')}
          className={`px-3 py-1.5 rounded-xl font-semibold border transition ${
            selectedFilter === 'critical'
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              : 'text-rose-400/80 border-transparent hover:bg-rose-500/10'
          }`}
        >
          🔴 Critical ({criticalCount})
        </button>
        <button
          type="button"
          onClick={() => setSelectedFilter('important')}
          className={`px-3 py-1.5 rounded-xl font-semibold border transition ${
            selectedFilter === 'important'
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'text-amber-400/80 border-transparent hover:bg-amber-500/10'
          }`}
        >
          🟠 Important ({importantCount})
        </button>
        <button
          type="button"
          onClick={() => setSelectedFilter('recommended')}
          className={`px-3 py-1.5 rounded-xl font-semibold border transition ${
            selectedFilter === 'recommended'
              ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
              : 'text-sky-400/80 border-transparent hover:bg-sky-500/10'
          }`}
        >
          🟡 Recommended ({recommendedCount})
        </button>
        <button
          type="button"
          onClick={() => setSelectedFilter('good')}
          className={`px-3 py-1.5 rounded-xl font-semibold border transition ${
            selectedFilter === 'good'
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : 'text-emerald-400/80 border-transparent hover:bg-emerald-500/10'
          }`}
        >
          🟢 Good ({goodCount})
        </button>
      </div>

      {/* Problems Cards */}
      <div className="space-y-4">
        {filteredProblems.map((prob) => {
          const config = getSeverityBadge(prob.severity);
          const Icon = config.icon;

          return (
            <div
              key={prob.id}
              className={`bg-slate-900 border border-slate-800 rounded-2xl p-5 ${config.borderClass} transition hover:border-slate-700 shadow-sm`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${config.badgeClass}`}>
                    {config.label}
                  </span>
                  <h3 className="text-sm font-bold text-white tracking-tight">
                    {prob.title}
                  </h3>
                </div>
                {prob.section && (
                  <span className="text-[11px] font-semibold text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded-md self-start sm:self-auto">
                    Section: {prob.section}
                  </span>
                )}
              </div>

              {/* 3 Step Breakdown: 1. What is wrong, 2. Why it matters, 3. How to fix it */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-3 border-t border-slate-800/80 text-xs">
                
                {/* 1. WHAT IS WRONG */}
                <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-1.5 font-bold text-rose-400 mb-1.5">
                    <AlertCircle className="w-3.5 h-3.5" /> 1. What is wrong:
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {prob.whatIsWrong}
                  </p>
                </div>

                {/* 2. WHY IT MATTERS */}
                <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-1.5 font-bold text-amber-400 mb-1.5">
                    <Info className="w-3.5 h-3.5" /> 2. Why it matters:
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {prob.whyItMatters}
                  </p>
                </div>

                {/* 3. HOW TO FIX IT */}
                <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-400 mb-1.5">
                    <Lightbulb className="w-3.5 h-3.5" /> 3. How to fix it:
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {prob.howToFixIt}
                  </p>
                </div>

              </div>

              {prob.severity !== 'good' && (
                <div className="mt-3.5 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => onNavigateTab('builder')}
                    className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                  >
                    Edit in Resume Builder <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
