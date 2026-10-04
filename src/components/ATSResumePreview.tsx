import React, { useState } from 'react';
import {
  Printer,
  Copy,
  Download,
  Check,
  Sparkles,
  FileText,
  FileCode,
  ShieldCheck,
  RotateCw
} from 'lucide-react';
import { ResumeData } from '../types/resume';

interface ATSResumePreviewProps {
  originalResume: ResumeData;
  optimizedResume: ResumeData | null;
  onPrint: () => void;
  onOptimize: () => void;
  isLoading: boolean;
}

export const ATSResumePreview: React.FC<ATSResumePreviewProps> = ({
  originalResume,
  optimizedResume,
  onPrint,
  onOptimize,
  isLoading,
}) => {
  const [selectedVersion, setSelectedVersion] = useState<'optimized' | 'original'>(
    optimizedResume ? 'optimized' : 'original'
  );
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const currentResume = selectedVersion === 'optimized' && optimizedResume ? optimizedResume : originalResume;

  // Build plain text version for ATS copy / .txt download
  const generatePlainText = (res: ResumeData): string => {
    let out = `${res.contact.fullName.toUpperCase()}\n`;
    const contactLine = [
      res.contact.email,
      res.contact.phone,
      res.contact.location,
      res.contact.linkedIn,
      res.contact.gitHub,
      res.contact.portfolio
    ].filter(Boolean).join(' | ');
    out += `${contactLine}\n\n`;

    if (res.professionalSummary) {
      out += `PROFESSIONAL SUMMARY\n${'-'.repeat(40)}\n${res.professionalSummary}\n\n`;
    }

    if (
      res.skills.languages.length ||
      res.skills.frameworks.length ||
      res.skills.developerTools.length ||
      res.skills.databases.length ||
      res.skills.cloudDevOps.length
    ) {
      out += `TECHNICAL SKILLS\n${'-'.repeat(40)}\n`;
      if (res.skills.languages.length) out += `• Languages: ${res.skills.languages.join(', ')}\n`;
      if (res.skills.frameworks.length) out += `• Frameworks: ${res.skills.frameworks.join(', ')}\n`;
      if (res.skills.developerTools.length) out += `• Developer Tools: ${res.skills.developerTools.join(', ')}\n`;
      if (res.skills.databases.length) out += `• Databases: ${res.skills.databases.join(', ')}\n`;
      if (res.skills.cloudDevOps.length) out += `• Cloud & DevOps: ${res.skills.cloudDevOps.join(', ')}\n`;
      if (res.skills.other.length) out += `• Methodologies: ${res.skills.other.join(', ')}\n`;
      out += '\n';
    }

    if (res.workExperience.length) {
      out += `WORK EXPERIENCE\n${'-'.repeat(40)}\n`;
      res.workExperience.forEach(w => {
        out += `${w.jobTitle} | ${w.company} | ${w.startDate} - ${w.endDate}\n`;
        w.bullets.forEach(b => {
          out += `  • ${b}\n`;
        });
        out += '\n';
      });
    }

    if (res.internships.length) {
      out += `INTERNSHIPS\n${'-'.repeat(40)}\n`;
      res.internships.forEach(i => {
        out += `${i.title} | ${i.organization} | ${i.startDate} - ${i.endDate}\n`;
        i.bullets.forEach(b => {
          out += `  • ${b}\n`;
        });
        out += '\n';
      });
    }

    if (res.projects.length) {
      out += `PROJECTS\n${'-'.repeat(40)}\n`;
      res.projects.forEach(p => {
        out += `${p.title} (${p.technologies.join(', ')}) ${p.link ? `| ${p.link}` : ''}\n`;
        p.bullets.forEach(b => {
          out += `  • ${b}\n`;
        });
        out += '\n';
      });
    }

    if (res.education.length) {
      out += `EDUCATION\n${'-'.repeat(40)}\n`;
      res.education.forEach(e => {
        out += `${e.degree} | ${e.institution} | Graduated: ${e.endDate || 'N/A'}\n`;
        if (e.gpa) out += `  • GPA: ${e.gpa}\n`;
        if (e.coursework && e.coursework.length) out += `  • Relevant Coursework: ${e.coursework.join(', ')}\n`;
        if (e.honors && e.honors.length) out += `  • Honors: ${e.honors.join(', ')}\n`;
        out += '\n';
      });
    }

    if (res.certifications.length) {
      out += `CERTIFICATIONS\n${'-'.repeat(40)}\n`;
      res.certifications.forEach(c => {
        out += `• ${c.name} — ${c.issuingOrg} (${c.issueDate || 'Verified'})\n`;
      });
      out += '\n';
    }

    if (res.achievements.length) {
      out += `ACHIEVEMENTS\n${'-'.repeat(40)}\n`;
      res.achievements.forEach(a => {
        out += `• ${a}\n`;
      });
      out += '\n';
    }

    if (res.hackathons.length) {
      out += `HACKATHONS & COMPETITIONS\n${'-'.repeat(40)}\n`;
      res.hackathons.forEach(h => {
        out += `• ${h}\n`;
      });
      out += '\n';
    }

    if (res.leadership.length) {
      out += `LEADERSHIP & POSITIONS OF RESPONSIBILITY\n${'-'.repeat(40)}\n`;
      res.leadership.forEach(l => {
        out += `• ${l}\n`;
      });
      out += '\n';
    }

    return out;
  };

  const handleCopy = (type: 'text' | 'markdown') => {
    const text = generatePlainText(currentResume);
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleDownloadTxt = () => {
    const text = generatePlainText(currentResume);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentResume.contact.fullName.replace(/\s+/g, '_')}_ATS_Resume.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar (Hidden during print) */}
      <div className="no-print bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Version Switcher */}
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setSelectedVersion('optimized')}
              disabled={!optimizedResume}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedVersion === 'optimized' && optimizedResume
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              ATS Optimized
              {optimizedResume && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 ml-0.5 animate-pulse" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setSelectedVersion('original')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedVersion === 'original'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Original Version
            </button>
          </div>

          {!optimizedResume && (
            <button
              type="button"
              onClick={onOptimize}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/30 transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Generate Optimized Version
            </button>
          )}
        </div>

        {/* Export and Print Buttons */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => handleCopy('text')}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition"
          >
            {copiedType === 'text' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedType === 'text' ? 'Copied Plain Text!' : 'Copy ATS Plain Text'}
          </button>
          <button
            type="button"
            onClick={handleDownloadTxt}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition"
          >
            <Download className="w-3.5 h-3.5" />
            Save .txt
          </button>
          <button
            type="button"
            onClick={onPrint}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/25 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            Print / Save ATS PDF
          </button>
        </div>
      </div>

      {/* ATS Verified Single Column Document Container */}
      <div className="flex justify-center">
        <div className="ats-print-container w-full max-w-4xl bg-white text-slate-900 rounded-xl shadow-2xl p-8 sm:p-12 font-sans border border-slate-200 leading-normal selection:bg-indigo-100 selection:text-slate-900">
          
          {/* 1. Header & Contact */}
          <div className="text-center border-b border-slate-300 pb-4 mb-5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 uppercase">
              {currentResume.contact.fullName || 'Candidate Name'}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 mt-2 text-[12px] text-slate-700 font-medium">
              {currentResume.contact.email && <span>{currentResume.contact.email}</span>}
              {currentResume.contact.phone && <span>• {currentResume.contact.phone}</span>}
              {currentResume.contact.location && <span>• {currentResume.contact.location}</span>}
              {currentResume.contact.linkedIn && <span>• {currentResume.contact.linkedIn}</span>}
              {currentResume.contact.gitHub && <span>• {currentResume.contact.gitHub}</span>}
              {currentResume.contact.portfolio && <span>• {currentResume.contact.portfolio}</span>}
            </div>
          </div>

          {/* 2. Professional Summary */}
          {currentResume.professionalSummary && (
            <div className="mb-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-900 pb-0.5 mb-2 font-mono">
                PROFESSIONAL SUMMARY
              </h2>
              <p className="text-[12.5px] text-slate-800 leading-relaxed text-justify">
                {currentResume.professionalSummary}
              </p>
            </div>
          )}

          {/* 3. Technical Skills */}
          {(
            currentResume.skills.languages.length > 0 ||
            currentResume.skills.frameworks.length > 0 ||
            currentResume.skills.developerTools.length > 0 ||
            currentResume.skills.databases.length > 0 ||
            currentResume.skills.cloudDevOps.length > 0
          ) && (
            <div className="mb-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-900 pb-0.5 mb-2 font-mono">
                TECHNICAL SKILLS
              </h2>
              <div className="text-[12px] text-slate-800 space-y-1">
                {currentResume.skills.languages.length > 0 && (
                  <div>
                    <span className="font-bold text-slate-950">Programming Languages: </span>
                    <span>{currentResume.skills.languages.join(', ')}</span>
                  </div>
                )}
                {currentResume.skills.frameworks.length > 0 && (
                  <div>
                    <span className="font-bold text-slate-950">Frameworks & Libraries: </span>
                    <span>{currentResume.skills.frameworks.join(', ')}</span>
                  </div>
                )}
                {currentResume.skills.developerTools.length > 0 && (
                  <div>
                    <span className="font-bold text-slate-950">Developer Tools: </span>
                    <span>{currentResume.skills.developerTools.join(', ')}</span>
                  </div>
                )}
                {currentResume.skills.databases.length > 0 && (
                  <div>
                    <span className="font-bold text-slate-950">Databases: </span>
                    <span>{currentResume.skills.databases.join(', ')}</span>
                  </div>
                )}
                {currentResume.skills.cloudDevOps.length > 0 && (
                  <div>
                    <span className="font-bold text-slate-950">Cloud & DevOps: </span>
                    <span>{currentResume.skills.cloudDevOps.join(', ')}</span>
                  </div>
                )}
                {currentResume.skills.other.length > 0 && (
                  <div>
                    <span className="font-bold text-slate-950">Methodologies & Concepts: </span>
                    <span>{currentResume.skills.other.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 4. Work Experience */}
          {currentResume.workExperience.length > 0 && (
            <div className="mb-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-900 pb-0.5 mb-2.5 font-mono">
                EXPERIENCE
              </h2>
              <div className="space-y-4">
                {currentResume.workExperience.map((exp) => (
                  <div key={exp.id} className="text-[12.5px]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between font-bold text-slate-950">
                      <span>{exp.jobTitle} — <span className="font-semibold text-slate-800">{exp.company}</span></span>
                      <span className="text-[11.5px] font-medium text-slate-700">{exp.startDate} – {exp.endDate}</span>
                    </div>
                    <ul className="list-disc list-outside pl-4 space-y-1 mt-1 text-[12px] text-slate-800">
                      {exp.bullets.map((b, idx) => (
                        <li key={idx} className="leading-snug">{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. Internships */}
          {currentResume.internships.length > 0 && (
            <div className="mb-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-900 pb-0.5 mb-2.5 font-mono">
                INTERNSHIPS
              </h2>
              <div className="space-y-3">
                {currentResume.internships.map((intern) => (
                  <div key={intern.id} className="text-[12.5px]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between font-bold text-slate-950">
                      <span>{intern.title} — <span className="font-semibold text-slate-800">{intern.organization}</span></span>
                      <span className="text-[11.5px] font-medium text-slate-700">{intern.startDate} – {intern.endDate}</span>
                    </div>
                    <ul className="list-disc list-outside pl-4 space-y-1 mt-1 text-[12px] text-slate-800">
                      {intern.bullets.map((b, idx) => (
                        <li key={idx} className="leading-snug">{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. Projects */}
          {currentResume.projects.length > 0 && (
            <div className="mb-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-900 pb-0.5 mb-2.5 font-mono">
                PROJECTS
              </h2>
              <div className="space-y-3.5">
                {currentResume.projects.map((proj) => (
                  <div key={proj.id} className="text-[12.5px]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between font-bold text-slate-950">
                      <div>
                        <span>{proj.title}</span>
                        {proj.technologies.length > 0 && (
                          <span className="text-slate-700 font-normal text-[11.5px] ml-2">
                            | {proj.technologies.join(', ')}
                          </span>
                        )}
                      </div>
                      {proj.link && (
                        <span className="text-[11px] font-mono text-slate-600">{proj.link}</span>
                      )}
                    </div>
                    <ul className="list-disc list-outside pl-4 space-y-1 mt-1 text-[12px] text-slate-800">
                      {proj.bullets.map((b, idx) => (
                        <li key={idx} className="leading-snug">{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. Education */}
          {currentResume.education.length > 0 && (
            <div className="mb-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-900 pb-0.5 mb-2.5 font-mono">
                EDUCATION
              </h2>
              <div className="space-y-2">
                {currentResume.education.map((edu) => (
                  <div key={edu.id} className="text-[12px]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between font-bold text-slate-950">
                      <span>{edu.degree} — <span className="font-semibold text-slate-800">{edu.institution}</span></span>
                      <span className="text-[11.5px] font-medium text-slate-700">{edu.endDate || 'Present'}</span>
                    </div>
                    <div className="text-slate-700 text-[11.5px] mt-0.5 space-y-0.5">
                      {edu.gpa && <div>Cumulative GPA: {edu.gpa}</div>}
                      {edu.coursework && edu.coursework.length > 0 && (
                        <div>Relevant Coursework: {edu.coursework.join(', ')}</div>
                      )}
                      {edu.honors && edu.honors.length > 0 && (
                        <div>Honors: {edu.honors.join(', ')}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8. Certifications */}
          {currentResume.certifications.length > 0 && (
            <div className="mb-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-900 pb-0.5 mb-2 font-mono">
                CERTIFICATIONS
              </h2>
              <ul className="list-disc list-outside pl-4 space-y-0.5 text-[12px] text-slate-800">
                {currentResume.certifications.map((cert) => (
                  <li key={cert.id}>
                    <span className="font-semibold text-slate-950">{cert.name}</span> — {cert.issuingOrg} {cert.issueDate ? `(${cert.issueDate})` : ''}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 9. Achievements & Hackathons */}
          {(currentResume.achievements.length > 0 || currentResume.hackathons.length > 0) && (
            <div className="mb-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-900 pb-0.5 mb-2 font-mono">
                ACHIEVEMENTS & HACKATHONS
              </h2>
              <ul className="list-disc list-outside pl-4 space-y-0.5 text-[12px] text-slate-800">
                {currentResume.achievements.map((item, idx) => (
                  <li key={`ach-${idx}`}>{item}</li>
                ))}
                {currentResume.hackathons.map((item, idx) => (
                  <li key={`hack-${idx}`}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* 10. Leadership */}
          {currentResume.leadership.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-900 pb-0.5 mb-2 font-mono">
                LEADERSHIP & POSITIONS OF RESPONSIBILITY
              </h2>
              <ul className="list-disc list-outside pl-4 space-y-0.5 text-[12px] text-slate-800">
                {currentResume.leadership.map((item, idx) => (
                  <li key={`lead-${idx}`}>{item}</li>
                ))}
              </ul>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
