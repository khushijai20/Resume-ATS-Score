import React from 'react';
import {
  RotateCcw,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Wand2,
  FileText
} from 'lucide-react';
import { ResumeComparisonMatrix, ResumeData } from '../types/resume';

interface ComparisonViewProps {
  comparison: ResumeComparisonMatrix;
  oldResume: ResumeData;
  optimizedResume: ResumeData | null;
  onOptimize: () => void;
  onNavigateTab: (tab: string) => void;
  isLoading: boolean;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  comparison,
  oldResume,
  optimizedResume,
  onOptimize,
  onNavigateTab,
  isLoading,
}) => {
  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-indigo-400" /> Resume Comparison & Optimization Matrix
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Side-by-side quantitative benchmarking between your source resume and the ATS-tailored version.
          </p>
        </div>

        <button
          type="button"
          onClick={onOptimize}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-lg shadow-indigo-600/25 transition"
        >
          <Wand2 className="w-3.5 h-3.5" />
          {optimizedResume ? 'Re-Optimize Resume' : 'Generate Optimized Resume'}
        </button>
      </div>

      {/* Comparison Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-5">Category</th>
                <th className="py-3.5 px-5">Original Resume</th>
                <th className="py-3.5 px-5 text-indigo-300">ATS Optimized Resume</th>
                <th className="py-3.5 px-5 text-emerald-400">Improvement Delta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {comparison.categories.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition">
                  <td className="py-3.5 px-5 font-semibold text-white">
                    {row.category}
                  </td>
                  <td className="py-3.5 px-5 text-slate-400 font-mono">
                    {row.oldResume}
                  </td>
                  <td className="py-3.5 px-5 text-indigo-200 font-mono font-semibold">
                    {row.optimizedResume}
                  </td>
                  <td className="py-3.5 px-5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <TrendingUp className="w-3 h-3" />
                      {row.difference}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* What Improved Narrative */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white">Detailed Explanation of Improvements</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {comparison.explanationOfImprovements.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5"
            >
              <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="leading-relaxed">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Side-by-Side Summary Comparison */}
      {optimizedResume && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Original Professional Summary
            </span>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3.5 rounded-xl border border-slate-800 italic">
              "{oldResume.professionalSummary || 'No summary provided'}"
            </p>
          </div>

          <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-5 space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Optimized Professional Summary
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md">
                Keyword Targeted
              </span>
            </div>
            <p className="text-xs text-slate-100 leading-relaxed bg-slate-950 p-3.5 rounded-xl border border-indigo-500/20">
              "{optimizedResume.professionalSummary}"
            </p>
          </div>
        </div>
      )}

      {/* View Optimized Resume Button */}
      <div className="flex items-center justify-center pt-2">
        <button
          type="button"
          onClick={() => onNavigateTab('preview')}
          className="flex items-center gap-2 px-6 py-2.5 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg transition"
        >
          <FileText className="w-4 h-4" />
          Preview Full ATS Printable Resume
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
