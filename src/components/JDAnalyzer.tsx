import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  Briefcase,
  Building,
  CheckCircle2,
  AlertCircle,
  Key,
  Shield,
  Clock,
  MapPin,
  GraduationCap,
  Wand2,
  RotateCw
} from 'lucide-react';
import { JobDescriptionAnalysis } from '../types/resume';

interface JDAnalyzerProps {
  jd: JobDescriptionAnalysis;
  setJd: React.Dispatch<React.SetStateAction<JobDescriptionAnalysis>>;
  onAnalyzeJD: (title: string, company: string, text: string) => Promise<void>;
  onCalculateATS: () => void;
  onOptimize: () => void;
  isLoading: boolean;
}

export const JDAnalyzer: React.FC<JDAnalyzerProps> = ({
  jd,
  setJd,
  onAnalyzeJD,
  onCalculateATS,
  onOptimize,
  isLoading,
}) => {
  const [jobTitleInput, setJobTitleInput] = useState(jd.targetJobTitle);
  const [companyInput, setCompanyInput] = useState(jd.targetCompany);
  const [rawTextInput, setRawTextInput] = useState(jd.rawText);

  const handleRunAnalysis = async () => {
    if (!rawTextInput.trim()) return;
    await onAnalyzeJD(jobTitleInput, companyInput, rawTextInput);
  };

  return (
    <div className="space-y-6">
      {/* Target Role Inputs & JD Input Area */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" /> Job Description Analyzer
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Paste the target job posting to extract mandatory qualifications, technical keywords, and prioritized recruiter criteria.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isLoading || !rawTextInput.trim()}
              onClick={handleRunAnalysis}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 transition"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Analyzing JD...' : 'Analyze Job Description'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Target Job Title *
            </label>
            <div className="relative">
              <Briefcase className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                value={jobTitleInput}
                onChange={(e) => setJobTitleInput(e.target.value)}
                placeholder="e.g. Senior Full Stack Engineer"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Target Company (Optional)
            </label>
            <div className="relative">
              <Building className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                value={companyInput}
                onChange={(e) => setCompanyInput(e.target.value)}
                placeholder="e.g. Stripe, Google, Startup"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Job Description Text *
          </label>
          <textarea
            rows={7}
            value={rawTextInput}
            onChange={(e) => setRawTextInput(e.target.value)}
            placeholder="Paste full job posting requirements, responsibilities, and qualifications..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-indigo-500 font-mono"
          />
        </div>
      </div>

      {/* PRIORITIZED KEYWORDS: HIGH / MEDIUM / LOW */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Key className="w-4 h-4 text-amber-400" /> Prioritized ATS Keywords
          </h3>
          <span className="text-xs text-slate-400">
            Categorized by ATS screening priority
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* HIGH PRIORITY */}
          <div className="bg-slate-950 border border-rose-500/20 rounded-xl p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                🔴 HIGH PRIORITY
              </span>
              <span className="text-[10px] font-semibold text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded-full">
                Dealbreakers
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Mandatory technologies & frameworks explicitly required for initial ATS filtering.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {jd.prioritized.highPriority.map((kw, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg bg-rose-500/10 text-rose-200 border border-rose-500/30"
                >
                  {kw}
                </span>
              ))}
              {jd.prioritized.highPriority.length === 0 && (
                <span className="text-xs text-slate-500">None extracted</span>
              )}
            </div>
          </div>

          {/* MEDIUM PRIORITY */}
          <div className="bg-slate-950 border border-amber-500/20 rounded-xl p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                🟠 MEDIUM PRIORITY
              </span>
              <span className="text-[10px] font-semibold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full">
                Preferred
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Secondary tools, databases, automated testing, and CI/CD pipelines.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {jd.prioritized.mediumPriority.map((kw, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg bg-amber-500/10 text-amber-200 border border-amber-500/30"
                >
                  {kw}
                </span>
              ))}
              {jd.prioritized.mediumPriority.length === 0 && (
                <span className="text-xs text-slate-500">None extracted</span>
              )}
            </div>
          </div>

          {/* LOW PRIORITY */}
          <div className="bg-slate-950 border border-sky-500/20 rounded-xl p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                🟡 LOW PRIORITY
              </span>
              <span className="text-[10px] font-semibold text-sky-300 bg-sky-500/10 px-2 py-0.5 rounded-full">
                Nice-to-Have
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Bonus domain familiarity, optional certifications, and general methodologies.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {jd.prioritized.lowPriority.map((kw, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg bg-sky-500/10 text-sky-200 border border-sky-500/30"
                >
                  {kw}
                </span>
              ))}
              {jd.prioritized.lowPriority.length === 0 && (
                <span className="text-xs text-slate-500">None extracted</span>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* REQUIRED SKILLS vs PREFERRED SKILLS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Required Skills */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Explicitly Required Skills
            </h3>
            <span className="text-xs text-emerald-400 font-semibold">
              {jd.requiredSkills.length} Required
            </span>
          </div>
          <div className="space-y-2">
            {jd.requiredSkills.map((skill, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
              >
                <span className="font-semibold text-white">{skill}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-bold">
                  Mandatory
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Preferred Skills */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-400" /> Desirable / Preferred Skills
            </h3>
            <span className="text-xs text-sky-400 font-semibold">
              {jd.preferredSkills.length} Preferred
            </span>
          </div>
          <div className="space-y-2">
            {jd.preferredSkills.map((skill, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
              >
                <span className="font-semibold text-white">{skill}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-400 font-medium">
                  Bonus Advantage
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* REQUIREMENTS BREAKDOWN: Education, Experience, Location, Action Verbs */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-indigo-400" /> Eligibility Criteria & Action Verbs
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5 font-bold text-slate-300 mb-2">
              <GraduationCap className="w-4 h-4 text-indigo-400" /> Education
            </div>
            <div className="space-y-1 text-slate-400">
              {jd.requirements.education.map((e, idx) => (
                <div key={idx}>• {e}</div>
              ))}
            </div>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5 font-bold text-slate-300 mb-2">
              <Clock className="w-4 h-4 text-emerald-400" /> Experience
            </div>
            <div className="space-y-1 text-slate-400">
              <div>Years: <span className="text-white font-medium">{jd.requirements.yearsOfExperience || 'Not specified'}</span></div>
              {jd.requirements.experience.map((exp, idx) => (
                <div key={idx}>• {exp}</div>
              ))}
            </div>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5 font-bold text-slate-300 mb-2">
              <MapPin className="w-4 h-4 text-sky-400" /> Location / Work Mode
            </div>
            <div className="space-y-1 text-slate-400">
              {jd.requirements.location.map((loc, idx) => (
                <div key={idx}>• {loc}</div>
              ))}
            </div>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5 font-bold text-slate-300 mb-2">
              <Wand2 className="w-4 h-4 text-amber-400" /> Target Action Verbs
            </div>
            <div className="flex flex-wrap gap-1">
              {(jd.keywords.actionVerbs || ['Architect', 'Design', 'Deploy', 'Scale', 'Optimize', 'Mentor']).map((verb, idx) => (
                <span key={idx} className="px-2 py-0.5 bg-slate-900 text-slate-300 rounded text-[11px] font-mono">
                  {verb}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
