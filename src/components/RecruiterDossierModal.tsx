import React, { useState } from 'react';
import { Copy, Check, X, Sparkles, Printer, FileText } from 'lucide-react';
import { ATSScoreReport, ResumeData, JobDescriptionAnalysis } from '../types/resume';

interface RecruiterDossierModalProps {
  report: ATSScoreReport;
  resume: ResumeData;
  optimizedResume: ResumeData | null;
  jd: JobDescriptionAnalysis;
  onClose: () => void;
  onPrint: () => void;
}

export const RecruiterDossierModal: React.FC<RecruiterDossierModalProps> = ({
  report,
  resume,
  optimizedResume,
  jd,
  onClose,
  onPrint,
}) => {
  const [copied, setCopied] = useState(false);

  // Generate ASCII / Structured Text Output as requested in Section 17
  const displayResume = optimizedResume || resume;

  const generateASCIIReport = () => {
    let text = `━━━━━━━━━━━━━━━━━━━━━━
ATS RESUME ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━

ATS SCORE
${report.overallScore}/100

RECRUITER VERDICT
${report.verdict}

KEYWORD MATCH
${report.keywordPercentage}%

SKILLS MATCH
${report.skillsPercentage}%

EXPERIENCE MATCH
${report.experiencePercentage}%

FORMATTING
${report.formattingPercentage}%

CONTENT QUALITY
${report.contentPercentage}%

━━━━━━━━━━━━━━━━━━━━━━
TOP STRENGTHS
━━━━━━━━━━━━━━━━━━━━━━
${report.topStrengths.map((s, i) => `${i + 1}. ${s}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━
TOP PROBLEMS
━━━━━━━━━━━━━━━━━━━━━━
${report.problems
  .filter(p => p.severity !== 'good')
  .map(p => {
    const symbol = p.severity === 'critical' ? '🔴' : p.severity === 'important' ? '🟠' : '🟡';
    return `${symbol} ${p.title}\n   • Issue: ${p.whatIsWrong}\n   • Impact: ${p.whyItMatters}\n   • Fix: ${p.howToFixIt}`;
  })
  .join('\n\n')}

━━━━━━━━━━━━━━━━━━━━━━
MISSING KEYWORDS
━━━━━━━━━━━━━━━━━━━━━━
${report.missingKeywords.length > 0 ? report.missingKeywords.map(k => `- ${k}`).join('\n') : '- None (All critical keywords represented)'}

━━━━━━━━━━━━━━━━━━━━━━
RECOMMENDED CHANGES
━━━━━━━━━━━━━━━━━━━━━━
${report.recommendedChanges.map((c, i) => `${i + 1}. ${c}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━
OPTIMIZED RESUME
━━━━━━━━━━━━━━━━━━━━━━

${displayResume.contact.fullName.toUpperCase()}
${[displayResume.contact.email, displayResume.contact.phone, displayResume.contact.location].filter(Boolean).join(' | ')}
${[displayResume.contact.linkedIn, displayResume.contact.gitHub].filter(Boolean).join(' | ')}

PROFESSIONAL SUMMARY
${displayResume.professionalSummary}

TECHNICAL SKILLS
Languages: ${displayResume.skills.languages.join(', ')}
Frameworks: ${displayResume.skills.frameworks.join(', ')}
Tools: ${displayResume.skills.developerTools.join(', ')}
Databases: ${displayResume.skills.databases.join(', ')}
Cloud/DevOps: ${displayResume.skills.cloudDevOps.join(', ')}

EXPERIENCE / PROJECTS
${displayResume.workExperience.map(w => `${w.jobTitle} - ${w.company} (${w.startDate} - ${w.endDate})\n${w.bullets.map(b => `  • ${b}`).join('\n')}`).join('\n\n')}
${displayResume.projects.map(p => `${p.title} (${p.technologies.join(', ')})\n${p.bullets.map(b => `  • ${b}`).join('\n')}`).join('\n\n')}

EDUCATION
${displayResume.education.map(e => `${e.degree} - ${e.institution} (${e.endDate || 'N/A'})`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━
`;
    return text;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateASCIIReport());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">
                Section 17: Official ATS Resume Analysis Dossier
              </h2>
              <p className="text-[11px] text-slate-400">
                Formatted Recruiter Verdict & Export Output
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied Dossier!' : 'Copy Dossier Text'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto font-mono text-xs text-slate-200 leading-relaxed bg-slate-950 selection:bg-indigo-500/40">
          <pre className="whitespace-pre-wrap font-mono text-xs">
            {generateASCIIReport()}
          </pre>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs">
          <span className="text-slate-500 text-[11px]">
            Strict rule enforced: Prioritizes truthful optimization over artificially inflating ATS score.
          </span>
          <button
            type="button"
            onClick={onPrint}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow transition"
          >
            <Printer className="w-3.5 h-3.5" />
            Print ATS Resume Sheet
          </button>
        </div>

      </div>
    </div>
  );
};
