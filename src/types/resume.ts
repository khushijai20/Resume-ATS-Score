export interface ContactInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedIn?: string;
  gitHub?: string;
  portfolio?: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  gpa?: string;
  coursework?: string[];
  honors?: string[];
}

export interface TechnicalSkills {
  languages: string[];
  frameworks: string[];
  developerTools: string[];
  databases: string[];
  cloudDevOps: string[];
  other: string[];
}

export interface WorkExperienceItem {
  id: string;
  jobTitle: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string; // or 'Present'
  bullets: string[];
}

export interface InternshipItem {
  id: string;
  title: string;
  organization: string;
  location?: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  technologies: string[];
  context?: string; // e.g. Academic, Personal, Hackathon, Open Source
  link?: string;
  bullets: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuingOrg: string;
  issueDate?: string;
  expiryDate?: string;
  credentialId?: string;
  url?: string;
}

export interface ResumeData {
  id: string;
  title: string;
  contact: ContactInfo;
  professionalSummary: string;
  education: EducationItem[];
  skills: TechnicalSkills;
  workExperience: WorkExperienceItem[];
  internships: InternshipItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  achievements: string[];
  hackathons: string[];
  leadership: string[];
  extracurriculars: string[];
  missingInformation: string[];
  isFresher?: boolean;
}

export interface PriorityKeywords {
  highPriority: string[];
  mediumPriority: string[];
  lowPriority: string[];
}

export interface JobDescriptionAnalysis {
  targetJobTitle: string;
  targetCompany: string;
  rawText: string;
  requiredSkills: string[];
  preferredSkills: string[];
  keywords: {
    technical: string[];
    softSkills: string[];
    tools: string[];
    languages: string[];
    frameworks: string[];
    cloud: string[];
    databases: string[];
    certifications: string[];
    jobTitles: string[];
    domainTerms: string[];
    actionVerbs: string[];
  };
  requirements: {
    education: string[];
    experience: string[];
    location: string[];
    certifications: string[];
    yearsOfExperience?: string;
    otherCriteria: string[];
  };
  prioritized: PriorityKeywords;
}

export type ProblemSeverity = 'critical' | 'important' | 'recommended' | 'good';

export interface ResumeProblem {
  id: string;
  severity: ProblemSeverity;
  title: string;
  whatIsWrong: string;
  whyItMatters: string;
  howToFixIt: string;
  section?: string;
}

export interface QualityCheckResult {
  grammarIssues: string[];
  spellingIssues: string[];
  consistencyNotes: string[];
  redundancyNotes: string[];
  recommendedLength: string;
  professionalismRating: string;
}

export interface ATSScoreReport {
  overallScore: number; // 0 - 100
  verdict: 'Excellent' | 'Strong' | 'Good' | 'Needs Improvement' | 'Poor';
  
  // Breakdown
  keywordScore: number; // 0 - 35
  skillsScore: number; // 0 - 20
  experienceScore: number; // 0 - 15
  structureScore: number; // 0 - 10
  formattingScore: number; // 0 - 10
  contentScore: number; // 0 - 10

  // Percentages for dashboard
  keywordPercentage: number;
  skillsPercentage: number;
  experiencePercentage: number;
  formattingPercentage: number;
  contentPercentage: number;

  matchedKeywords: string[];
  missingKeywords: string[];
  matchedSkills: string[];
  missingSkills: string[];

  experienceRelevanceExplanation: string;
  formattingCompatibilityNotes: string[];
  contentQualityWeaknesses: string[];

  topStrengths: string[];
  problems: ResumeProblem[];
  recommendedChanges: string[];
  qualityCheck: QualityCheckResult;

  generatedAt: string;
}

export interface ResumeComparisonMatrix {
  categories: {
    category: string;
    oldResume: string | number;
    optimizedResume: string | number;
    difference: string;
  }[];
  explanationOfImprovements: string[];
}
