import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Globe,
  Plus,
  Trash2,
  Upload,
  Clipboard,
  AlertCircle,
  Sparkles,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Award,
  Layers,
  CheckCircle2,
  Wand2
} from 'lucide-react';
import {
  ResumeData,
  WorkExperienceItem,
  ProjectItem,
  EducationItem,
  InternshipItem,
  CertificationItem
} from '../types/resume';

interface ResumeEditorProps {
  resume: ResumeData;
  setResume: React.Dispatch<React.SetStateAction<ResumeData>>;
  onParseRawText: (text: string) => Promise<void>;
  onFileUpload: (file: File) => Promise<void>;
  onImproveSummary: () => void;
  onImproveBulletsForRole: (bullets: string[], tech: string[], title: string, onUpdate: (b: string[]) => void) => void;
  isLoading: boolean;
}

export const ResumeEditor: React.FC<ResumeEditorProps> = ({
  resume,
  setResume,
  onParseRawText,
  onFileUpload,
  onImproveSummary,
  onImproveBulletsForRole,
  isLoading,
}) => {
  const [pasteModalOpen, setPasteModalOpen] = useState(false);
  const [pastedText, setPastedText] = useState('');
  const [activeSection, setActiveSection] = useState<'contact' | 'summary' | 'skills' | 'exp' | 'projects' | 'edu' | 'certs' | 'extra'>('contact');

  const handleContactChange = (field: string, val: string) => {
    setResume(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: val
      }
    }));
  };

  const handleSkillsChange = (category: keyof typeof resume.skills, val: string) => {
    const list = val.split(',').map(s => s.trim()).filter(Boolean);
    setResume(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: list
      }
    }));
  };

  // Add items
  const addWorkExp = () => {
    const newItem: WorkExperienceItem = {
      id: `exp-${Date.now()}`,
      jobTitle: 'Software Engineer',
      company: 'Company Name',
      startDate: 'Jan 2023',
      endDate: 'Present',
      bullets: ['Engineered scalable web service handling requests with high availability.']
    };
    setResume(prev => ({ ...prev, workExperience: [newItem, ...prev.workExperience] }));
  };

  const addProject = () => {
    const newItem: ProjectItem = {
      id: `proj-${Date.now()}`,
      title: 'Full Stack Project',
      technologies: ['React', 'Node.js', 'PostgreSQL'],
      bullets: ['Developed responsive full-stack application with RESTful API integration.']
    };
    setResume(prev => ({ ...prev, projects: [newItem, ...prev.projects] }));
  };

  const addEducation = () => {
    const newItem: EducationItem = {
      id: `edu-${Date.now()}`,
      institution: 'University Name',
      degree: 'B.S. in Computer Science',
      startDate: '2020',
      endDate: '2024'
    };
    setResume(prev => ({ ...prev, education: [...prev.education, newItem] }));
  };

  const addInternship = () => {
    const newItem: InternshipItem = {
      id: `intern-${Date.now()}`,
      title: 'Software Engineering Intern',
      organization: 'Tech Co',
      startDate: 'Jun 2023',
      endDate: 'Aug 2023',
      bullets: ['Collaborated with engineering team to deliver feature components.']
    };
    setResume(prev => ({ ...prev, internships: [newItem, ...prev.internships] }));
  };

  const addCertification = () => {
    const newItem: CertificationItem = {
      id: `cert-${Date.now()}`,
      name: 'Cloud Practitioner / Certificate Name',
      issuingOrg: 'Amazon Web Services / Meta'
    };
    setResume(prev => ({ ...prev, certifications: [...prev.certifications, newItem] }));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Quick Upload & Paste Tools */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Resume Sections & Content Builder
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Modify any section below, upload an existing PDF/DOCX, or paste raw text for automated ATS extraction.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* File Upload */}
          <label className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer transition">
            <Upload className="w-3.5 h-3.5 text-indigo-400" />
            Upload PDF / DOCX
            <input
              type="file"
              accept=".pdf,.docx,.doc,.txt"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onFileUpload(file);
              }}
            />
          </label>

          {/* Paste Text */}
          <button
            type="button"
            onClick={() => setPasteModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            <Clipboard className="w-3.5 h-3.5 text-sky-400" />
            Paste Resume Text
          </button>
        </div>
      </div>

      {/* Missing Information Notice (User Rule: Mark as Missing Information) */}
      {(!resume.contact.email || !resume.contact.phone || resume.missingInformation?.length > 0) && (
        <div className="bg-amber-500/10 border border-amber-500/25 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-200">
            <span className="font-bold text-amber-300">Missing Information Detected: </span>
            {!resume.contact.email && <span className="underline mr-2">Email address missing.</span>}
            {!resume.contact.phone && <span className="underline mr-2">Phone number missing.</span>}
            {resume.missingInformation?.map((info, idx) => (
              <span key={idx} className="block mt-1 font-mono text-[11px] text-amber-300">
                • {info}
              </span>
            ))}
            <span className="block mt-1 text-slate-400">
              ATS parsers require valid contact credentials. Update these fields to prevent automated disqualification.
            </span>
          </div>
        </div>
      )}

      {/* Editor Sub-Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto border-b border-slate-800 pb-2 text-xs no-scrollbar">
        {[
          { id: 'contact', label: '1. Contact Info', icon: User },
          { id: 'summary', label: '2. Professional Summary', icon: Sparkles },
          { id: 'skills', label: '3. Technical Skills', icon: Layers },
          { id: 'exp', label: '4. Work & Internships', icon: Briefcase },
          { id: 'projects', label: '5. Projects', icon: FolderGit2 },
          { id: 'edu', label: '6. Education', icon: GraduationCap },
          { id: 'certs', label: '7. Certifications', icon: Award },
          { id: 'extra', label: '8. Leadership & Achievements', icon: CheckCircle2 }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSection(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* SECTION 1: CONTACT INFO */}
      {activeSection === 'contact' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-400" /> Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Full Name *
              </label>
              <input
                type="text"
                value={resume.contact.fullName}
                onChange={(e) => handleContactChange('fullName', e.target.value)}
                placeholder="Candidate Full Name"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Email Address *
              </label>
              <input
                type="email"
                value={resume.contact.email}
                onChange={(e) => handleContactChange('email', e.target.value)}
                placeholder="name@email.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Phone Number *
              </label>
              <input
                type="text"
                value={resume.contact.phone}
                onChange={(e) => handleContactChange('phone', e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Location (City, State)
              </label>
              <input
                type="text"
                value={resume.contact.location}
                onChange={(e) => handleContactChange('location', e.target.value)}
                placeholder="San Francisco, CA"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                LinkedIn Profile URL
              </label>
              <input
                type="text"
                value={resume.contact.linkedIn || ''}
                onChange={(e) => handleContactChange('linkedIn', e.target.value)}
                placeholder="linkedin.com/in/username"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                GitHub Profile URL
              </label>
              <input
                type="text"
                value={resume.contact.gitHub || ''}
                onChange={(e) => handleContactChange('gitHub', e.target.value)}
                placeholder="github.com/username"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="md:col-span-2 lg:col-span-3">
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Portfolio / Personal Website URL
              </label>
              <input
                type="text"
                value={resume.contact.portfolio || ''}
                onChange={(e) => handleContactChange('portfolio', e.target.value)}
                placeholder="https://portfolio.dev"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: PROFESSIONAL SUMMARY */}
      {activeSection === 'summary' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" /> Professional Summary
            </h3>
            <button
              type="button"
              onClick={onImproveSummary}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/30 transition"
            >
              <Wand2 className="w-3.5 h-3.5" />
              AI Tailor Summary
            </button>
          </div>
          <div>
            <textarea
              rows={4}
              value={resume.professionalSummary}
              onChange={(e) => setResume(prev => ({ ...prev, professionalSummary: e.target.value }))}
              placeholder="Concise 2-3 sentence technical overview highlighting your core stack, experience depth, and primary domain accomplishments..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white leading-relaxed focus:outline-none focus:border-indigo-500"
            />
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5">
              <span>Recommended ATS length: 2-3 concise sentences (150-300 characters).</span>
              <span>{resume.professionalSummary.length} characters</span>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: TECHNICAL SKILLS */}
      {activeSection === 'skills' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" /> Technical Skills (Comma-separated)
            </h3>
            <span className="text-xs text-slate-400">
              Standard ATS categories ensure clean parser indexing
            </span>
          </div>

          <div className="space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Programming Languages
              </label>
              <input
                type="text"
                value={resume.skills.languages.join(', ')}
                onChange={(e) => handleSkillsChange('languages', e.target.value)}
                placeholder="JavaScript, TypeScript, Python, Go, SQL"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Frameworks & Libraries
              </label>
              <input
                type="text"
                value={resume.skills.frameworks.join(', ')}
                onChange={(e) => handleSkillsChange('frameworks', e.target.value)}
                placeholder="React, Next.js, Node.js, Express, Tailwind CSS"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Developer Tools & Testing
              </label>
              <input
                type="text"
                value={resume.skills.developerTools.join(', ')}
                onChange={(e) => handleSkillsChange('developerTools', e.target.value)}
                placeholder="Git, GitHub Actions, Docker, Postman, Jest, Vite"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Databases & Caching
              </label>
              <input
                type="text"
                value={resume.skills.databases.join(', ')}
                onChange={(e) => handleSkillsChange('databases', e.target.value)}
                placeholder="PostgreSQL, MongoDB, Redis, SQLite"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Cloud & DevOps
              </label>
              <input
                type="text"
                value={resume.skills.cloudDevOps.join(', ')}
                onChange={(e) => handleSkillsChange('cloudDevOps', e.target.value)}
                placeholder="AWS (ECS, Lambda, S3, RDS), Vercel, Terraform"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Other Methodologies / Architecture
              </label>
              <input
                type="text"
                value={resume.skills.other.join(', ')}
                onChange={(e) => handleSkillsChange('other', e.target.value)}
                placeholder="RESTful APIs, Microservices, Agile/Scrum, CI/CD"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: WORK EXPERIENCE & INTERNSHIPS */}
      {activeSection === 'exp' && (
        <div className="space-y-6">
          {/* Work Experience */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-400" /> Work Experience
              </h3>
              <button
                type="button"
                onClick={addWorkExp}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition"
              >
                <Plus className="w-3.5 h-3.5" /> Add Experience
              </button>
            </div>

            {resume.workExperience.length === 0 ? (
              <div className="text-xs text-slate-400 bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                No full-time work experience added. (Normal for students and freshers! Focus on Projects & Internships below).
              </div>
            ) : (
              <div className="space-y-4">
                {resume.workExperience.map((exp, expIdx) => (
                  <div key={exp.id} className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-300">Role #{expIdx + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setResume(prev => ({
                            ...prev,
                            workExperience: prev.workExperience.filter(e => e.id !== exp.id)
                          }));
                        }}
                        className="text-slate-500 hover:text-rose-400 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5">
                      <input
                        type="text"
                        value={exp.jobTitle}
                        onChange={(e) => {
                          const val = e.target.value;
                          setResume(prev => ({
                            ...prev,
                            workExperience: prev.workExperience.map(item => item.id === exp.id ? { ...item, jobTitle: val } : item)
                          }));
                        }}
                        placeholder="Job Title"
                        className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => {
                          const val = e.target.value;
                          setResume(prev => ({
                            ...prev,
                            workExperience: prev.workExperience.map(item => item.id === exp.id ? { ...item, company: val } : item)
                          }));
                        }}
                        placeholder="Company"
                        className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                      <input
                        type="text"
                        value={exp.startDate}
                        onChange={(e) => {
                          const val = e.target.value;
                          setResume(prev => ({
                            ...prev,
                            workExperience: prev.workExperience.map(item => item.id === exp.id ? { ...item, startDate: val } : item)
                          }));
                        }}
                        placeholder="Start Date (e.g. Jan 2022)"
                        className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                      <input
                        type="text"
                        value={exp.endDate}
                        onChange={(e) => {
                          const val = e.target.value;
                          setResume(prev => ({
                            ...prev,
                            workExperience: prev.workExperience.map(item => item.id === exp.id ? { ...item, endDate: val } : item)
                          }));
                        }}
                        placeholder="End Date (e.g. Present)"
                        className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>

                    {/* Bullets */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Bullet Points (Action Verb + Task + Tech + Impact):</span>
                        <button
                          type="button"
                          onClick={() => {
                            onImproveBulletsForRole(
                              exp.bullets,
                              [...resume.skills.languages, ...resume.skills.frameworks],
                              exp.jobTitle,
                              (newBullets) => {
                                setResume(prev => ({
                                  ...prev,
                                  workExperience: prev.workExperience.map(item => item.id === exp.id ? { ...item, bullets: newBullets } : item)
                                }));
                              }
                            );
                          }}
                          className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
                        >
                          <Wand2 className="w-3 h-3" /> AI Improve Bullets
                        </button>
                      </div>

                      {exp.bullets.map((b, bIdx) => (
                        <div key={bIdx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={b}
                            onChange={(e) => {
                              const val = e.target.value;
                              setResume(prev => ({
                                ...prev,
                                workExperience: prev.workExperience.map(item => {
                                  if (item.id === exp.id) {
                                    const nextBullets = [...item.bullets];
                                    nextBullets[bIdx] = val;
                                    return { ...item, bullets: nextBullets };
                                  }
                                  return item;
                                })
                              }));
                            }}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setResume(prev => ({
                                ...prev,
                                workExperience: prev.workExperience.map(item => {
                                  if (item.id === exp.id) {
                                    return { ...item, bullets: item.bullets.filter((_, idx) => idx !== bIdx) };
                                  }
                                  return item;
                                })
                              }));
                            }}
                            className="text-slate-500 hover:text-rose-400 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => {
                          setResume(prev => ({
                            ...prev,
                            workExperience: prev.workExperience.map(item => {
                              if (item.id === exp.id) {
                                return { ...item, bullets: [...item.bullets, 'Engineered high-performance module using modern practices.'] };
                              }
                              return item;
                            })
                          }));
                        }}
                        className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 mt-1"
                      >
                        <Plus className="w-3 h-3" /> Add Bullet Point
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Internships Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-sky-400" /> Internships
              </h3>
              <button
                type="button"
                onClick={addInternship}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg bg-sky-600 hover:bg-sky-500 text-white transition"
              >
                <Plus className="w-3.5 h-3.5" /> Add Internship
              </button>
            </div>

            {resume.internships.length === 0 ? (
              <div className="text-xs text-slate-400 bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                No internships recorded.
              </div>
            ) : (
              <div className="space-y-4">
                {resume.internships.map((intern, iIdx) => (
                  <div key={intern.id} className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-sky-300">Internship #{iIdx + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setResume(prev => ({
                            ...prev,
                            internships: prev.internships.filter(item => item.id !== intern.id)
                          }));
                        }}
                        className="text-slate-500 hover:text-rose-400 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5">
                      <input
                        type="text"
                        value={intern.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          setResume(prev => ({
                            ...prev,
                            internships: prev.internships.map(i => i.id === intern.id ? { ...i, title: val } : i)
                          }));
                        }}
                        placeholder="Title"
                        className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                      <input
                        type="text"
                        value={intern.organization}
                        onChange={(e) => {
                          const val = e.target.value;
                          setResume(prev => ({
                            ...prev,
                            internships: prev.internships.map(i => i.id === intern.id ? { ...i, organization: val } : i)
                          }));
                        }}
                        placeholder="Organization / Company"
                        className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                      <input
                        type="text"
                        value={intern.startDate}
                        onChange={(e) => {
                          const val = e.target.value;
                          setResume(prev => ({
                            ...prev,
                            internships: prev.internships.map(i => i.id === intern.id ? { ...i, startDate: val } : i)
                          }));
                        }}
                        placeholder="Start Date"
                        className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                      <input
                        type="text"
                        value={intern.endDate}
                        onChange={(e) => {
                          const val = e.target.value;
                          setResume(prev => ({
                            ...prev,
                            internships: prev.internships.map(i => i.id === intern.id ? { ...i, endDate: val } : i)
                          }));
                        }}
                        placeholder="End Date"
                        className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 5: PROJECTS */}
      {activeSection === 'projects' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-indigo-400" /> Technical Projects
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Crucial for demonstrating practical application of technologies required by the JD.
              </p>
            </div>
            <button
              type="button"
              onClick={addProject}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition"
            >
              <Plus className="w-3.5 h-3.5" /> Add Project
            </button>
          </div>

          <div className="space-y-4">
            {resume.projects.map((proj, pIdx) => (
              <div key={proj.id} className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-300">Project #{pIdx + 1}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setResume(prev => ({
                        ...prev,
                        projects: prev.projects.filter(p => p.id !== proj.id)
                      }));
                    }}
                    className="text-slate-500 hover:text-rose-400 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  <input
                    type="text"
                    value={proj.title}
                    onChange={(e) => {
                      const val = e.target.value;
                      setResume(prev => ({
                        ...prev,
                        projects: prev.projects.map(p => p.id === proj.id ? { ...p, title: val } : p)
                      }));
                    }}
                    placeholder="Project Title"
                    className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={proj.technologies.join(', ')}
                    onChange={(e) => {
                      const list = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                      setResume(prev => ({
                        ...prev,
                        projects: prev.projects.map(p => p.id === proj.id ? { ...p, technologies: list } : p)
                      }));
                    }}
                    placeholder="Technologies (e.g. React, Node.js, SQL)"
                    className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={proj.link || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setResume(prev => ({
                        ...prev,
                        projects: prev.projects.map(p => p.id === proj.id ? { ...p, link: val } : p)
                      }));
                    }}
                    placeholder="GitHub Repo / Demo URL"
                    className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>

                {/* Bullets */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Bullet Points:</span>
                    <button
                      type="button"
                      onClick={() => {
                        onImproveBulletsForRole(
                          proj.bullets,
                          proj.technologies,
                          proj.title,
                          (newBullets) => {
                            setResume(prev => ({
                              ...prev,
                              projects: prev.projects.map(p => p.id === proj.id ? { ...p, bullets: newBullets } : p)
                            }));
                          }
                        );
                      }}
                      className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
                    >
                      <Wand2 className="w-3 h-3" /> AI Improve Project Bullets
                    </button>
                  </div>

                  {proj.bullets.map((b, bIdx) => (
                    <div key={bIdx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={b}
                        onChange={(e) => {
                          const val = e.target.value;
                          setResume(prev => ({
                            ...prev,
                            projects: prev.projects.map(p => {
                              if (p.id === proj.id) {
                                const nextBullets = [...p.bullets];
                                nextBullets[bIdx] = val;
                                return { ...p, bullets: nextBullets };
                              }
                              return p;
                            })
                          }));
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setResume(prev => ({
                            ...prev,
                            projects: prev.projects.map(p => {
                              if (p.id === proj.id) {
                                return { ...p, bullets: p.bullets.filter((_, idx) => idx !== bIdx) };
                              }
                              return p;
                            })
                          }));
                        }}
                        className="text-slate-500 hover:text-rose-400 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => {
                      setResume(prev => ({
                        ...prev,
                        projects: prev.projects.map(p => {
                          if (p.id === proj.id) {
                            return { ...p, bullets: [...p.bullets, 'Engineered core system module with responsive UI.'] };
                          }
                          return p;
                        })
                      }));
                    }}
                    className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 mt-1"
                  >
                    <Plus className="w-3 h-3" /> Add Project Bullet
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 6: EDUCATION */}
      {activeSection === 'edu' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-indigo-400" /> Education
            </h3>
            <button
              type="button"
              onClick={addEducation}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition"
            >
              <Plus className="w-3.5 h-3.5" /> Add Degree
            </button>
          </div>

          <div className="space-y-4">
            {resume.education.map((edu, eduIdx) => (
              <div key={edu.id} className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-300">Degree #{eduIdx + 1}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setResume(prev => ({
                        ...prev,
                        education: prev.education.filter(e => e.id !== edu.id)
                      }));
                    }}
                    className="text-slate-500 hover:text-rose-400 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => {
                      const val = e.target.value;
                      setResume(prev => ({
                        ...prev,
                        education: prev.education.map(item => item.id === edu.id ? { ...item, institution: val } : item)
                      }));
                    }}
                    placeholder="Institution / University"
                    className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => {
                      const val = e.target.value;
                      setResume(prev => ({
                        ...prev,
                        education: prev.education.map(item => item.id === edu.id ? { ...item, degree: val } : item)
                      }));
                    }}
                    placeholder="Degree (e.g. B.S. in Computer Science)"
                    className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={edu.endDate || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setResume(prev => ({
                        ...prev,
                        education: prev.education.map(item => item.id === edu.id ? { ...item, endDate: val } : item)
                      }));
                    }}
                    placeholder="Graduation Date (e.g. Jun 2025)"
                    className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={edu.gpa || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setResume(prev => ({
                        ...prev,
                        education: prev.education.map(item => item.id === edu.id ? { ...item, gpa: val } : item)
                      }));
                    }}
                    placeholder="GPA (optional)"
                    className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Relevant Coursework (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={(edu.coursework || []).join(', ')}
                    onChange={(e) => {
                      const list = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                      setResume(prev => ({
                        ...prev,
                        education: prev.education.map(item => item.id === edu.id ? { ...item, coursework: list } : item)
                      }));
                    }}
                    placeholder="Data Structures, Algorithms, Operating Systems, Database Systems"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 7: CERTIFICATIONS */}
      {activeSection === 'certs' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-400" /> Certifications
            </h3>
            <button
              type="button"
              onClick={addCertification}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition"
            >
              <Plus className="w-3.5 h-3.5" /> Add Certification
            </button>
          </div>

          <div className="space-y-3">
            {resume.certifications.map((cert) => (
              <div key={cert.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
                <input
                  type="text"
                  value={cert.name}
                  onChange={(e) => {
                    const val = e.target.value;
                    setResume(prev => ({
                      ...prev,
                      certifications: prev.certifications.map(c => c.id === cert.id ? { ...c, name: val } : c)
                    }));
                  }}
                  placeholder="Certification Name"
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                />
                <input
                  type="text"
                  value={cert.issuingOrg}
                  onChange={(e) => {
                    const val = e.target.value;
                    setResume(prev => ({
                      ...prev,
                      certifications: prev.certifications.map(c => c.id === cert.id ? { ...c, issuingOrg: val } : c)
                    }));
                  }}
                  placeholder="Issuing Organization"
                  className="w-48 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                />
                <button
                  type="button"
                  onClick={() => {
                    setResume(prev => ({
                      ...prev,
                      certifications: prev.certifications.filter(c => c.id !== cert.id)
                    }));
                  }}
                  className="text-slate-500 hover:text-rose-400 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 8: ACHIEVEMENTS, HACKATHONS, LEADERSHIP */}
      {activeSection === 'extra' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Honors, Hackathons & Leadership
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Achievements & Awards (One per line)
              </label>
              <textarea
                rows={3}
                value={resume.achievements.join('\n')}
                onChange={(e) => {
                  const list = e.target.value.split('\n').filter(Boolean);
                  setResume(prev => ({ ...prev, achievements: list }));
                }}
                placeholder="Won 1st place in university hackathon&#10;Published research paper at IEEE conference"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Hackathons & Competitions (One per line)
              </label>
              <textarea
                rows={3}
                value={resume.hackathons.join('\n')}
                onChange={(e) => {
                  const list = e.target.value.split('\n').filter(Boolean);
                  setResume(prev => ({ ...prev, hackathons: list }));
                }}
                placeholder="CalHacks 2024 — Built automated GitHub PR summarizing utility in 36 hours"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Leadership / Positions of Responsibility (One per line)
              </label>
              <textarea
                rows={3}
                value={resume.leadership.join('\n')}
                onChange={(e) => {
                  const list = e.target.value.split('\n').filter(Boolean);
                  setResume(prev => ({ ...prev, leadership: list }));
                }}
                placeholder="President of Computer Science Student Chapter&#10;Technical Team Lead for 5 engineers"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Paste Resume Text Modal */}
      {pasteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clipboard className="w-4 h-4 text-sky-400" /> Paste Raw Resume Text
              </h3>
              <button
                type="button"
                onClick={() => setPasteModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Paste the plain text from your resume. Our parsing engine will automatically populate all contact info, skills, projects, and employment history without fabricating any data.
            </p>
            <textarea
              rows={10}
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste entire resume text here..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setPasteModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isLoading || !pastedText.trim()}
                onClick={async () => {
                  await onParseRawText(pastedText);
                  setPasteModalOpen(false);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition shadow"
              >
                {isLoading ? 'Extracting...' : 'Parse & Populate Resume'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
