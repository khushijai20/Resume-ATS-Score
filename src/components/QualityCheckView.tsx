import React from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Calendar,
  Layers,
  FileCheck,
  FileText,
  ShieldCheck,
  XCircle
} from 'lucide-react';
import { QualityCheckResult } from '../types/resume';

interface QualityCheckViewProps {
  qualityCheck: QualityCheckResult;
  isFresher: boolean;
  onFixFormatting: () => void;
}

export const QualityCheckView: React.FC<QualityCheckViewProps> = ({
  qualityCheck,
  isFresher,
  onFixFormatting,
}) => {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" /> Resume Quality & Grammar Audit
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated linguistic proofreading, tense consistency, date formatting, and ATS layout validation.
          </p>
        </div>
        <button
          type="button"
          onClick={onFixFormatting}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow transition"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          Apply ATS Standard Formatting
        </button>
      </div>

      {/* 6 Key Quality Dimensions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* 1. Grammar & Spelling */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-bold text-white">Grammar & Syntax</h3>
          </div>
          {qualityCheck.grammarIssues.length === 0 ? (
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>No active grammar violations detected. Sentence phrasing is clear.</span>
            </div>
          ) : (
            <div className="space-y-2 text-xs text-slate-300">
              {qualityCheck.grammarIssues.map((issue, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{issue}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 2. Consistency (Dates, Casing, Punctuation) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Formatting Consistency</h3>
          </div>
          <div className="space-y-2 text-xs text-slate-300">
            {qualityCheck.consistencyNotes.map((note, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                <span>{note}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Redundancy & Word Repetition */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-white">Redundancy & Repetition</h3>
          </div>
          <div className="space-y-2 text-xs text-slate-300">
            {qualityCheck.redundancyNotes.map((note, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                <span>{note}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Recommended Length */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Resume Length Target</h3>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            <div className="font-semibold text-white mb-1">
              Target: {qualityCheck.recommendedLength}
            </div>
            <p className="text-slate-400 leading-relaxed">
              {isFresher
                ? 'For undergraduates, freshers, and developers with under 3 years experience, recruiters strongly recommend a focused 1-page resume.'
                : '1 to 2 pages are acceptable for senior engineers with 4+ years of substantive contributions and lead roles.'}
            </p>
          </div>
        </div>

        {/* 5. Professionalism Score */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Professional Tone</h3>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            <div className="font-semibold text-emerald-300 mb-1">
              Rating: {qualityCheck.professionalismRating}
            </div>
            <p className="text-slate-400 leading-relaxed">
              Resumes should communicate with direct, objective, technical terminology without first-person pronouns ("I", "my") or buzzwords.
            </p>
          </div>
        </div>

        {/* 6. ATS Layout Compliance */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <h3 className="text-sm font-bold text-white">ATS Parser Safety</h3>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1.5">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> Single column linear hierarchy
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> Zero graphical tables or skill bars
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> Standard heading conventions
            </div>
          </div>
        </div>

      </div>

      {/* ATS Formatting Best Practices Checklist */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-indigo-400" /> ATS-Friendly Formatting Rules & Best Practices
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-emerald-500/20">
            <div className="font-bold text-emerald-400 mb-2">DO (Recruiter & ATS Recommended):</div>
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Use standard headings: SUMMARY, TECHNICAL SKILLS, EXPERIENCE, PROJECTS, EDUCATION.</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Use single-column layout so ATS text extraction flows in natural sequence.</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Use standard bullet characters and consistent month/year date format.</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Follow the formula: [Action Verb] + [Task] + [Technology] + [Result/Impact].</span>
            </div>
          </div>

          <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-rose-500/20">
            <div className="font-bold text-rose-400 mb-2">DON'T (Causes ATS Parsing Failures):</div>
            <div className="flex items-center gap-2 text-slate-300">
              <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>Never use graphical rating bars (e.g. "React: 4/5 stars" cannot be read by ATS).</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>Never place contact details inside header/footer boxes that get skipped by parsers.</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>Avoid multi-column tables and text boxes that scramble reading order.</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>Never keyword-stuff white text or invisible characters (triggers blacklisting).</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
