import React from 'react';
import {
  FileText,
  Sparkles,
  GraduationCap,
  Briefcase,
  Layers,
  Printer,
  Wand2,
  FileCheck2,
  HelpCircle,
  RotateCcw,
  FileUp,
  BarChart3
} from 'lucide-react';
import { ResumeData, JobDescriptionAnalysis } from '../types/resume';
import {
  sampleFresherResume,
  sampleExperiencedResume,
  sampleJobDescriptionFintech,
  sampleJobDescriptionJunior
} from '../utils/sampleData';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isFresherMode: boolean;
  setIsFresherMode: (val: boolean) => void;
  onLoadSample: (resume: ResumeData, jd: JobDescriptionAnalysis, isFresher: boolean) => void;
  onOpenDossier: () => void;
  onPrintResume: () => void;
  hasOptimized: boolean;
  overallScore: number;
  verdict: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isFresherMode,
  setIsFresherMode,
  onLoadSample,
  onOpenDossier,
  onPrintResume,
  hasOptimized,
  overallScore,
  verdict,
}) => {
  return (
    <header className="no-print bg-slate-900/95 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Logo & Platform Identity */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-400 flex items-center justify-center shadow-md shadow-indigo-500/20 ring-1 ring-white/20">
              <FileCheck2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-white tracking-tight">
                  ATS Resume Builder & Recruiter Optimizer
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  v2.0
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span>Multi-factor ATS Scoring (0–100)</span>
                <span aria-hidden="true">·</span>
                <span>Fact-based Optimization</span>
                <span aria-hidden="true">·</span>
                <span>Zero Hallucination</span>
              </div>
            </div>
          </div>

          {/* Quick Score Badge & Action Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            
            {/* Live ATS Score Chip */}
            <div
              onClick={() => setActiveTab('scorecard')}
              className="cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700/80 hover:border-indigo-500/50 transition group"
              title="Click to view ATS Scorecard breakdown"
            >
              <BarChart3 className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
              <div className="text-xs">
                <span className="text-slate-400 font-medium">ATS Score: </span>
                <span className="font-extrabold text-white font-mono">{overallScore}/100</span>
                <span className="text-slate-400 ml-1 font-semibold text-[11px]">({verdict})</span>
              </div>
            </div>

            {/* Mode Switcher (Experienced vs Fresher) */}
            <div className="inline-flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
              <button
                type="button"
                onClick={() => setIsFresherMode(false)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                  !isFresherMode
                    ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                Experienced
              </button>
              <button
                type="button"
                onClick={() => setIsFresherMode(true)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                  isFresherMode
                    ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                Fresher / Student
              </button>
            </div>

            {/* Recruiter Verdict Modal Button */}
            <button
              type="button"
              onClick={onOpenDossier}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Recruiter Dossier
            </button>

            {/* Print / Save ATS PDF Button */}
            <button
              type="button"
              onClick={onPrintResume}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition shadow-md shadow-indigo-600/20"
            >
              <Printer className="w-3.5 h-3.5" />
              Print ATS PDF
            </button>
          </div>
        </div>

        {/* 5-Step Guided Pipeline Navigation */}
        <div className="flex items-center gap-2 mt-3 overflow-x-auto border-t border-slate-800/80 pt-2 text-xs no-scrollbar">
          {[
            { id: 'upload', label: '1. Upload Resume PDF', icon: FileUp },
            { id: 'builder', label: '2. Edit Resume Sections', icon: FileText },
            { id: 'jd', label: '3. Job Description & Keywords', icon: Layers },
            { id: 'scorecard', label: '4. ATS Score & Diagnostics', icon: BarChart3 },
            { id: 'problems', label: '5. Problems Detected (🔴/🟠/🟡/🟢)', icon: HelpCircle },
            { id: 'optimize', label: '6. AI Optimization & Compare', icon: Wand2, badge: hasOptimized ? 'Updated' : null },
            { id: 'preview', label: '7. ATS Preview & PDF Export', icon: Printer }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {tab.label}
                {tab.badge && (
                  <span className="px-1.5 py-0.2 bg-emerald-500/30 text-emerald-200 text-[10px] font-bold rounded-md">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
