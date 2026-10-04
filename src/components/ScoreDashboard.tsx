import React from 'react';
import {
  Award,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileSearch,
  Wand2,
  Key,
  Layers,
  FileCheck,
  RotateCw,
  Download,
  AlertCircle
} from 'lucide-react';
import { ATSScoreReport, JobDescriptionAnalysis, ResumeData } from '../types/resume';

interface ScoreDashboardProps {
  report: ATSScoreReport;
  jd: JobDescriptionAnalysis;
  resume: ResumeData;
  isFresherMode: boolean;
  onRunAudit: () => void;
  onOptimize: () => void;
  onImproveSummary: () => void;
  onImproveBullets: () => void;
  onFindKeywords: () => void;
  onFixFormatting: () => void;
  onCompare: () => void;
  onNavigateTab: (tab: string) => void;
  isLoading: boolean;
}

export const ScoreDashboard: React.FC<ScoreDashboardProps> = ({
  report,
  jd,
  resume,
  isFresherMode,
  onRunAudit,
  onOptimize,
  onImproveSummary,
  onImproveBullets,
  onFindKeywords,
  onFixFormatting,
  onCompare,
  onNavigateTab,
  isLoading,
}) => {
  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'Excellent':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'Strong':
        return 'text-sky-400 bg-sky-500/10 border-sky-500/30';
      case 'Good':
        return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30';
      case 'Needs Improvement':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      default:
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    }
  };

  const getScoreCircleColor = (score: number) => {
    if (score >= 90) return 'stroke-emerald-400 text-emerald-400';
    if (score >= 80) return 'stroke-sky-400 text-sky-400';
    if (score >= 70) return 'stroke-indigo-400 text-indigo-400';
    if (score >= 60) return 'stroke-amber-400 text-amber-400';
    return 'stroke-rose-400 text-rose-400';
  };

  return (
    <div className="space-y-6">
      {/* Target Role & Scope Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-xs font-semibold bg-indigo-500/20 text-indigo-300 rounded-md">
              Target Position
            </span>
            {isFresherMode && (
              <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-500/20 text-emerald-300 rounded-md">
                🎓 Fresher Mode Active
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            {jd.targetJobTitle || 'Software Engineer'}
            {jd.targetCompany ? ` at ${jd.targetCompany}` : ''}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Candidate: <span className="text-slate-200 font-medium">{resume.contact.fullName}</span> • Analyzing against {jd.requiredSkills.length} mandatory qualifications & {jd.prioritized.highPriority.length} high-priority keywords.
          </p>
        </div>

        {/* Action button cluster */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onRunAudit}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Recalculate ATS Score
          </button>
          <button
            type="button"
            onClick={onOptimize}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-lg shadow-indigo-500/25 transition"
          >
            <Wand2 className="w-3.5 h-3.5" />
            Optimize Resume with AI
          </button>
        </div>
      </div>

      {/* Main Score & Metric Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ATS Main Score Card (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-44 h-44 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                ATS Compatibility Score
              </span>
              <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${getVerdictColor(report.verdict)}`}>
                {report.verdict}
              </span>
            </div>

            {/* Score Ring Display */}
            <div className="flex items-center justify-center my-4">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    className="stroke-slate-800"
                    strokeWidth="8"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className={`transition-all duration-1000 ease-out ${getScoreCircleColor(report.overallScore)}`}
                    strokeWidth="8"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * report.overallScore) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-extrabold text-white tracking-tight">
                    {report.overallScore}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase">
                    / 100
                  </span>
                </div>
              </div>
            </div>

            {/* Rating scale explainer */}
            <div className="grid grid-cols-5 gap-1 text-center text-[10px] text-slate-400 pt-2 border-t border-slate-800/80">
              <div className="flex flex-col">
                <span className="text-rose-400 font-bold">&lt;60</span>
                <span>Poor</span>
              </div>
              <div className="flex flex-col">
                <span className="text-amber-400 font-bold">60-69</span>
                <span>Needs Imp.</span>
              </div>
              <div className="flex flex-col">
                <span className="text-indigo-400 font-bold">70-79</span>
                <span>Good</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sky-400 font-bold">80-89</span>
                <span>Strong</span>
              </div>
              <div className="flex flex-col">
                <span className="text-emerald-400 font-bold">90-100</span>
                <span>Excellent</span>
              </div>
            </div>
          </div>

          {/* Legal / ATS Notice */}
          <div className="mt-4 pt-3 border-t border-slate-800/60 text-[11px] text-slate-500 leading-relaxed">
            <span className="font-semibold text-slate-400">Important ATS Notice:</span> This is an estimated compatibility score based on ATS lexical scanning models and technical recruiter criteria, prioritizing honest and fact-based matching over artificial keyword stuffing.
          </div>
        </div>

        {/* 6 Rubric Breakdown Cards (8 cols) */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          
          {/* 1. Keyword Match (35 pts) */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-indigo-400" /> Keyword Match
                </span>
                <span className="font-bold text-white">{report.keywordScore}/35 pts</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
                <div
                  className="bg-indigo-500 h-full rounded-full transition-all duration-700"
                  style={{ width: `${report.keywordPercentage}%` }}
                />
              </div>
              <div className="text-xs text-slate-400">
                <span className="text-white font-semibold">{report.keywordPercentage}%</span> natural alignment with high-priority JD keywords.
              </div>
            </div>
            <button
              type="button"
              onClick={onFindKeywords}
              className="mt-3 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 self-start"
            >
              Inspect keywords <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* 2. Skills Match (20 pts) */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1.5">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" /> Skills Match
                </span>
                <span className="font-bold text-white">{report.skillsScore}/20 pts</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
                <div
                  className="bg-sky-500 h-full rounded-full transition-all duration-700"
                  style={{ width: `${report.skillsPercentage}%` }}
                />
              </div>
              <div className="text-xs text-slate-400">
                <span className="text-white font-semibold">{report.skillsPercentage}%</span> coverage of required & preferred tech stack.
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('jd')}
              className="mt-3 text-[11px] font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1 self-start"
            >
              View skill matrix <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* 3. Experience Relevance (15 pts) */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1.5">
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Experience Relevance
                </span>
                <span className="font-bold text-white">{report.experienceScore}/15 pts</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-700"
                  style={{ width: `${report.experiencePercentage}%` }}
                />
              </div>
              <div className="text-xs text-slate-400 line-clamp-2">
                {isFresherMode ? 'Evaluated based on projects & internships.' : `${report.experiencePercentage}% relevance to target engineering scope.`}
              </div>
            </div>
            <span className="mt-3 text-[11px] text-slate-500">
              {isFresherMode ? 'Fresher normalized' : 'Domain alignment'}
            </span>
          </div>

          {/* 4. Resume Structure (10 pts) */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-purple-400" /> Resume Structure
                </span>
                <span className="font-bold text-white">{report.structureScore}/10 pts</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
                <div
                  className="bg-purple-500 h-full rounded-full transition-all duration-700"
                  style={{ width: `${(report.structureScore / 10) * 100}%` }}
                />
              </div>
              <div className="text-xs text-slate-400">
                Standard sections recognized (Summary, Skills, Exp, Education).
              </div>
            </div>
            <span className="mt-3 text-[11px] text-emerald-400 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Standard Headings
            </span>
          </div>

          {/* 5. Formatting (10 pts) */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1.5">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Formatting
                </span>
                <span className="font-bold text-white">{report.formattingScore}/10 pts</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-700"
                  style={{ width: `${report.formattingPercentage}%` }}
                />
              </div>
              <div className="text-xs text-slate-400">
                Single-column, zero parsing-trap tables or graphics.
              </div>
            </div>
            <button
              type="button"
              onClick={onFixFormatting}
              className="mt-3 text-[11px] font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 self-start"
            >
              Fix formatting <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* 6. Content Quality (10 pts) */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-teal-400" /> Content Quality
                </span>
                <span className="font-bold text-white">{report.contentScore}/10 pts</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
                <div
                  className="bg-teal-500 h-full rounded-full transition-all duration-700"
                  style={{ width: `${report.contentPercentage}%` }}
                />
              </div>
              <div className="text-xs text-slate-400">
                Strong action verbs, concise bullets & quantifiable metrics.
              </div>
            </div>
            <button
              type="button"
              onClick={onImproveBullets}
              className="mt-3 text-[11px] font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1 self-start"
            >
              Improve bullets <ArrowRight className="w-3 h-3" />
            </button>
          </div>

        </div>
      </div>

      {/* Recruiter Quick Actions Bar (All 14 Core Triggers Accessible) */}
      <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
          <Wand2 className="w-4 h-4 text-indigo-400" /> Quick ATS Actions & Recruiter Tools
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            type="button"
            onClick={() => onNavigateTab('builder')}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700/80 transition flex items-center gap-1.5"
          >
            <FileSearch className="w-3.5 h-3.5 text-sky-400" />
            [Analyze Resume]
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab('jd')}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700/80 transition flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            [Analyze Job Description]
          </button>
          <button
            type="button"
            onClick={onRunAudit}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700/80 transition flex items-center gap-1.5"
          >
            <RotateCw className="w-3.5 h-3.5 text-emerald-400" />
            [Calculate ATS Score]
          </button>
          <button
            type="button"
            onClick={onOptimize}
            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow transition flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            [Optimize Resume]
          </button>
          <button
            type="button"
            onClick={onImproveSummary}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700/80 transition flex items-center gap-1.5"
          >
            <FileCheck className="w-3.5 h-3.5 text-purple-400" />
            [Improve Summary]
          </button>
          <button
            type="button"
            onClick={onImproveBullets}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700/80 transition flex items-center gap-1.5"
          >
            <Wand2 className="w-3.5 h-3.5 text-teal-400" />
            [Improve Bullet Points]
          </button>
          <button
            type="button"
            onClick={onFindKeywords}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700/80 transition flex items-center gap-1.5"
          >
            <Key className="w-3.5 h-3.5 text-amber-400" />
            [Find Missing Keywords]
          </button>
          <button
            type="button"
            onClick={onFixFormatting}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700/80 transition flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            [Fix Formatting]
          </button>
          <button
            type="button"
            onClick={onCompare}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700/80 transition flex items-center gap-1.5"
          >
            <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
            [Compare Resumes]
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab('preview')}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700/80 transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            [Download Resume]
          </button>
        </div>
      </div>

      {/* Two Column Section: Top Strengths & Missing Keywords */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Top Strengths */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">Top Candidate Strengths</h3>
          </div>
          <div className="space-y-2.5">
            {report.topStrengths.map((strength, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 bg-slate-800/50 p-2.5 rounded-xl border border-slate-800">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{strength}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Missing Important Keywords */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400">
                <Key className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Missing Important Keywords</h3>
            </div>
            <span className="text-xs text-rose-400 font-semibold">
              {report.missingKeywords.length} unrepresented
            </span>
          </div>

          {report.missingKeywords.length === 0 ? (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-300">
              All high-priority keywords from the Job Description are represented in your resume.
            </div>
          ) : (
            <div className="space-y-2.5">
              <div className="flex flex-wrap gap-1.5">
                {report.missingKeywords.slice(0, 10).map((kw, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 text-xs font-medium rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/20"
                  >
                    + {kw}
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                <span className="font-semibold text-slate-300">Recruiter Rule:</span> Only integrate these keywords into your skills or projects if you have genuine experience with them. Never keyword-stuff.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Recommended Changes Prioritized */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
            <TrendingUp className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white">Recommended Changes (High Impact)</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {report.recommendedChanges.map((change, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 mb-1 block">
                  Action Item {idx + 1}
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">{change}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
