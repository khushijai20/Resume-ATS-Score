import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { computeATSScore, generateResumeComparison } from './src/utils/atsScorer';
import { ResumeData, JobDescriptionAnalysis } from './src/types/resume';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const MODEL_NAME = 'gemini-3.8-flash';

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// 1. PARSE RESUME (Text or PDF Base64)
app.post('/api/parse-resume', async (req: Request, res: Response) => {
  try {
    const { rawText, fileBase64, mimeType } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(400).json({
        error: 'GEMINI_API_KEY is not configured in environment.',
      });
    }

    const systemPrompt = `You are a professional ATS resume parsing engine and technical recruiter.
Extract and organize the candidate's resume into a precise structured JSON object.
STRICT RULES:
1. Extract exactly what is present in the document.
2. DO NOT INVENT or assume any information that is not provided by the user.
3. If essential information is missing (like missing email, phone, graduation dates, or degree), add the missing item description to the "missingInformation" array with the label "Missing Information: [field name]".
4. Separate Technical Skills cleanly into: languages, frameworks, developerTools, databases, cloudDevOps, other.
5. Extract Projects, Work Experience, Internships, Education, Certifications, Achievements, Hackathons, Leadership, Extracurriculars.
6. Return only valid JSON adhering to the provided schema.`;

    const contents: any[] = [];
    if (fileBase64) {
      const normalizedMime = (mimeType && mimeType !== 'application/octet-stream')
        ? mimeType
        : 'application/pdf';

      contents.push({
        inlineData: {
          mimeType: normalizedMime,
          data: fileBase64,
        },
      });
      contents.push({
        text: 'Extract the resume content from this uploaded document according to the required schema. Accurately identify the candidate name, email, phone, location, LinkedIn/GitHub links, professional summary, technical skills, education, work experience, internships, projects, certifications, and achievements. If any essential contact or education information is missing, mark it in missingInformation as "Missing Information: [field name]". Never invent false experiences or credentials.',
      });
    } else if (rawText) {
      contents.push({
        text: `Here is the raw resume text to parse:\n\n${rawText}`,
      });
    } else {
      return res.status(400).json({ error: 'No rawText or file provided.' });
    }

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fullName: { type: Type.STRING },
            email: { type: Type.STRING },
            phone: { type: Type.STRING },
            location: { type: Type.STRING },
            linkedIn: { type: Type.STRING },
            gitHub: { type: Type.STRING },
            portfolio: { type: Type.STRING },
            professionalSummary: { type: Type.STRING },
            education: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  institution: { type: Type.STRING },
                  degree: { type: Type.STRING },
                  fieldOfStudy: { type: Type.STRING },
                  location: { type: Type.STRING },
                  startDate: { type: Type.STRING },
                  endDate: { type: Type.STRING },
                  gpa: { type: Type.STRING },
                  coursework: { type: Type.ARRAY, items: { type: Type.STRING } },
                  honors: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['institution', 'degree'],
              },
            },
            skills: {
              type: Type.OBJECT,
              properties: {
                languages: { type: Type.ARRAY, items: { type: Type.STRING } },
                frameworks: { type: Type.ARRAY, items: { type: Type.STRING } },
                developerTools: { type: Type.ARRAY, items: { type: Type.STRING } },
                databases: { type: Type.ARRAY, items: { type: Type.STRING } },
                cloudDevOps: { type: Type.ARRAY, items: { type: Type.STRING } },
                other: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
            },
            workExperience: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  jobTitle: { type: Type.STRING },
                  company: { type: Type.STRING },
                  location: { type: Type.STRING },
                  startDate: { type: Type.STRING },
                  endDate: { type: Type.STRING },
                  bullets: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['jobTitle', 'company', 'bullets'],
              },
            },
            internships: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  organization: { type: Type.STRING },
                  location: { type: Type.STRING },
                  startDate: { type: Type.STRING },
                  endDate: { type: Type.STRING },
                  bullets: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['title', 'organization', 'bullets'],
              },
            },
            projects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  technologies: { type: Type.ARRAY, items: { type: Type.STRING } },
                  context: { type: Type.STRING },
                  link: { type: Type.STRING },
                  bullets: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['title', 'bullets'],
              },
            },
            certifications: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  issuingOrg: { type: Type.STRING },
                  issueDate: { type: Type.STRING },
                  expiryDate: { type: Type.STRING },
                  credentialId: { type: Type.STRING },
                  url: { type: Type.STRING },
                },
                required: ['name', 'issuingOrg'],
              },
            },
            achievements: { type: Type.ARRAY, items: { type: Type.STRING } },
            hackathons: { type: Type.ARRAY, items: { type: Type.STRING } },
            leadership: { type: Type.ARRAY, items: { type: Type.STRING } },
            extracurriculars: { type: Type.ARRAY, items: { type: Type.STRING } },
            missingInformation: { type: Type.ARRAY, items: { type: Type.STRING } },
            isFresher: { type: Type.BOOLEAN },
          },
          required: ['fullName', 'skills', 'education'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');

    // Build standardized ResumeData
    const resumeData: ResumeData = {
      id: `resume-${Date.now()}`,
      title: `${parsed.fullName || 'Candidate'} - Resume`,
      isFresher: parsed.isFresher ?? ((parsed.workExperience || []).length === 0),
      contact: {
        fullName: parsed.fullName || 'Missing Information: Candidate Name',
        email: parsed.email || '',
        phone: parsed.phone || '',
        location: parsed.location || '',
        linkedIn: parsed.linkedIn || '',
        gitHub: parsed.gitHub || '',
        portfolio: parsed.portfolio || '',
      },
      professionalSummary: parsed.professionalSummary || '',
      education: (parsed.education || []).map((e: any, idx: number) => ({
        id: `edu-${idx}`,
        institution: e.institution || 'Missing Information: University',
        degree: e.degree || 'Missing Information: Degree',
        fieldOfStudy: e.fieldOfStudy || '',
        location: e.location || '',
        startDate: e.startDate || '',
        endDate: e.endDate || '',
        gpa: e.gpa || '',
        coursework: e.coursework || [],
        honors: e.honors || [],
      })),
      skills: {
        languages: parsed.skills?.languages || [],
        frameworks: parsed.skills?.frameworks || [],
        developerTools: parsed.skills?.developerTools || [],
        databases: parsed.skills?.databases || [],
        cloudDevOps: parsed.skills?.cloudDevOps || [],
        other: parsed.skills?.other || [],
      },
      workExperience: (parsed.workExperience || []).map((w: any, idx: number) => ({
        id: `exp-${idx}`,
        jobTitle: w.jobTitle || 'Role',
        company: w.company || 'Company',
        location: w.location || '',
        startDate: w.startDate || '',
        endDate: w.endDate || 'Present',
        bullets: w.bullets || [],
      })),
      internships: (parsed.internships || []).map((i: any, idx: number) => ({
        id: `intern-${idx}`,
        title: i.title || 'Intern',
        organization: i.organization || 'Organization',
        location: i.location || '',
        startDate: i.startDate || '',
        endDate: i.endDate || '',
        bullets: i.bullets || [],
      })),
      projects: (parsed.projects || []).map((p: any, idx: number) => ({
        id: `proj-${idx}`,
        title: p.title || 'Project',
        technologies: p.technologies || [],
        context: p.context || '',
        link: p.link || '',
        bullets: p.bullets || [],
      })),
      certifications: (parsed.certifications || []).map((c: any, idx: number) => ({
        id: `cert-${idx}`,
        name: c.name || '',
        issuingOrg: c.issuingOrg || '',
        issueDate: c.issueDate || '',
        expiryDate: c.expiryDate || '',
        credentialId: c.credentialId || '',
        url: c.url || '',
      })),
      achievements: parsed.achievements || [],
      hackathons: parsed.hackathons || [],
      leadership: parsed.leadership || [],
      extracurriculars: parsed.extracurriculars || [],
      missingInformation: parsed.missingInformation || [],
    };

    res.json({ success: true, resume: resumeData });
  } catch (error: any) {
    console.error('Error in /api/parse-resume:', error);
    res.status(500).json({ error: error.message || 'Failed to parse resume.' });
  }
});

// 2. ANALYZE JOB DESCRIPTION
app.post('/api/analyze-jd', async (req: Request, res: Response) => {
  try {
    const { targetJobTitle, targetCompany, rawText } = req.body;

    if (!rawText || rawText.trim().length < 15) {
      return res.status(400).json({ error: 'Please provide a valid Job Description text.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(400).json({ error: 'GEMINI_API_KEY is not configured.' });
    }

    const systemPrompt = `You are an expert Technical Recruiter and ATS keyword parser.
Analyze the provided Job Description thoroughly.
Extract:
1. Required Skills (technologies explicitly mandated by employer)
2. Preferred Skills (nice-to-have or bonus qualifications)
3. Keywords grouped into:
   - Technical keywords
   - Soft-skill keywords
   - Tools
   - Programming languages
   - Frameworks
   - Cloud technologies
   - Databases
   - Certifications
   - Job titles
   - Domain-specific terminology
   - Important action verbs
4. Requirements:
   - Education requirements
   - Experience requirements
   - Location requirements
   - Certifications
   - Years of experience
   - Other eligibility criteria
5. Prioritize keywords into:
   - HIGH PRIORITY (dealbreaker skills, core languages/tools)
   - MEDIUM PRIORITY (important secondary skills, frameworks, testing)
   - LOW PRIORITY (nice-to-have, generic methodologies)
Output strictly valid JSON conforming to the schema.`;

    const userPrompt = `Job Title: ${targetJobTitle || 'Not specified'}
Target Company: ${targetCompany || 'Not specified'}

Job Description Text:
${rawText}`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            targetJobTitle: { type: Type.STRING },
            targetCompany: { type: Type.STRING },
            requiredSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            preferredSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            keywords: {
              type: Type.OBJECT,
              properties: {
                technical: { type: Type.ARRAY, items: { type: Type.STRING } },
                softSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                tools: { type: Type.ARRAY, items: { type: Type.STRING } },
                languages: { type: Type.ARRAY, items: { type: Type.STRING } },
                frameworks: { type: Type.ARRAY, items: { type: Type.STRING } },
                cloud: { type: Type.ARRAY, items: { type: Type.STRING } },
                databases: { type: Type.ARRAY, items: { type: Type.STRING } },
                certifications: { type: Type.ARRAY, items: { type: Type.STRING } },
                jobTitles: { type: Type.ARRAY, items: { type: Type.STRING } },
                domainTerms: { type: Type.ARRAY, items: { type: Type.STRING } },
                actionVerbs: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
            },
            requirements: {
              type: Type.OBJECT,
              properties: {
                education: { type: Type.ARRAY, items: { type: Type.STRING } },
                experience: { type: Type.ARRAY, items: { type: Type.STRING } },
                location: { type: Type.ARRAY, items: { type: Type.STRING } },
                certifications: { type: Type.ARRAY, items: { type: Type.STRING } },
                yearsOfExperience: { type: Type.STRING },
                otherCriteria: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
            },
            prioritized: {
              type: Type.OBJECT,
              properties: {
                highPriority: { type: Type.ARRAY, items: { type: Type.STRING } },
                mediumPriority: { type: Type.ARRAY, items: { type: Type.STRING } },
                lowPriority: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
            },
          },
          required: ['requiredSkills', 'keywords', 'prioritized'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    const analysis: JobDescriptionAnalysis = {
      targetJobTitle: parsed.targetJobTitle || targetJobTitle || 'Software Engineer',
      targetCompany: parsed.targetCompany || targetCompany || '',
      rawText: rawText,
      requiredSkills: parsed.requiredSkills || [],
      preferredSkills: parsed.preferredSkills || [],
      keywords: {
        technical: parsed.keywords?.technical || [],
        softSkills: parsed.keywords?.softSkills || [],
        tools: parsed.keywords?.tools || [],
        languages: parsed.keywords?.languages || [],
        frameworks: parsed.keywords?.frameworks || [],
        cloud: parsed.keywords?.cloud || [],
        databases: parsed.keywords?.databases || [],
        certifications: parsed.keywords?.certifications || [],
        jobTitles: parsed.keywords?.jobTitles || [],
        domainTerms: parsed.keywords?.domainTerms || [],
        actionVerbs: parsed.keywords?.actionVerbs || [],
      },
      requirements: {
        education: parsed.requirements?.education || [],
        experience: parsed.requirements?.experience || [],
        location: parsed.requirements?.location || [],
        certifications: parsed.requirements?.certifications || [],
        yearsOfExperience: parsed.requirements?.yearsOfExperience || '',
        otherCriteria: parsed.requirements?.otherCriteria || [],
      },
      prioritized: {
        highPriority: parsed.prioritized?.highPriority || [],
        mediumPriority: parsed.prioritized?.mediumPriority || [],
        lowPriority: parsed.prioritized?.lowPriority || [],
      },
    };

    res.json({ success: true, analysis });
  } catch (error: any) {
    console.error('Error in /api/analyze-jd:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze job description.' });
  }
});

// 3. ATS AUDIT & PROBLEMS DETECTION
app.post('/api/ats-audit', async (req: Request, res: Response) => {
  try {
    const { resume, jd, isFresherMode } = req.body;
    if (!resume || !jd) {
      return res.status(400).json({ error: 'Resume and Job Description are required.' });
    }

    // Baseline deterministic scoring
    const deterministicReport = computeATSScore(resume, jd, isFresherMode);

    // Deep semantic recruiter evaluation via Gemini if key available
    if (process.env.GEMINI_API_KEY) {
      try {
        const recruiterPrompt = `You are a Senior Technical Recruiter and ATS Auditor.
Review this candidate resume against the target Job Description.
Check:
- Keyword relevance, frequency, placement
- Skills alignment & Job-title alignment
- Experience relevance
- Standard section headings & ATS parsing compatibility
- Formatting issues (e.g. non-ATS tables, graphics, contact info)
- Quantifiable achievements & action verbs
- Grammar, spelling, date consistency, length recommendation.

CRITICAL INSTRUCTIONS FOR PROBLEMS:
Categorize problems as:
- 'critical' (🔴 dealbreakers: missing essential skills, missing email/phone, bad parsing)
- 'important' (🟠 lack of metrics, weak action verbs, missing high-priority tech)
- 'recommended' (🟡 generic summary, missing links, formatting polish)
- 'good' (🟢 strengths, clear layout, solid foundation)

For EVERY problem, provide:
1. title
2. whatIsWrong (clear, concise explanation)
3. whyItMatters (ATS or recruiter impact in plain language)
4. howToFixIt (actionable step for the candidate)
5. section (e.g., Summary, Experience, Technical Skills, Education)

Also provide:
- experienceRelevanceExplanation (2-3 sentences explaining why experience matches or lacks relevance)
- topStrengths (3 bullet points)
- recommendedChanges (3 prioritized bullet points)`;

        const response = await ai.models.generateContent({
          model: MODEL_NAME,
          contents: `CANDIDATE RESUME:
${JSON.stringify(resume, null, 2)}

TARGET JOB DESCRIPTION:
${JSON.stringify(jd, null, 2)}

FRESHER MODE: ${Boolean(isFresherMode)}`,
          config: {
            systemInstruction: recruiterPrompt,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                experienceRelevanceExplanation: { type: Type.STRING },
                topStrengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                recommendedChanges: { type: Type.ARRAY, items: { type: Type.STRING } },
                problems: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      severity: { type: Type.STRING, enum: ['critical', 'important', 'recommended', 'good'] },
                      title: { type: Type.STRING },
                      whatIsWrong: { type: Type.STRING },
                      whyItMatters: { type: Type.STRING },
                      howToFixIt: { type: Type.STRING },
                      section: { type: Type.STRING },
                    },
                    required: ['severity', 'title', 'whatIsWrong', 'whyItMatters', 'howToFixIt'],
                  },
                },
                qualityCheck: {
                  type: Type.OBJECT,
                  properties: {
                    grammarIssues: { type: Type.ARRAY, items: { type: Type.STRING } },
                    spellingIssues: { type: Type.ARRAY, items: { type: Type.STRING } },
                    consistencyNotes: { type: Type.ARRAY, items: { type: Type.STRING } },
                    redundancyNotes: { type: Type.ARRAY, items: { type: Type.STRING } },
                    recommendedLength: { type: Type.STRING },
                    professionalismRating: { type: Type.STRING },
                  },
                },
              },
            },
          },
        });

        const aiAudit = JSON.parse(response.text || '{}');

        // Merge AI insights with deterministic rubric
        if (aiAudit.problems && aiAudit.problems.length > 0) {
          deterministicReport.problems = aiAudit.problems;
        }
        if (aiAudit.topStrengths && aiAudit.topStrengths.length > 0) {
          deterministicReport.topStrengths = aiAudit.topStrengths;
        }
        if (aiAudit.recommendedChanges && aiAudit.recommendedChanges.length > 0) {
          deterministicReport.recommendedChanges = aiAudit.recommendedChanges;
        }
        if (aiAudit.experienceRelevanceExplanation) {
          deterministicReport.experienceRelevanceExplanation = aiAudit.experienceRelevanceExplanation;
        }
        if (aiAudit.qualityCheck) {
          deterministicReport.qualityCheck = {
            ...deterministicReport.qualityCheck,
            ...aiAudit.qualityCheck,
          };
        }
      } catch (geminiError) {
        console.warn('Gemini recruiter audit fallback to deterministic scorer:', geminiError);
      }
    }

    res.json({ success: true, report: deterministicReport });
  } catch (error: any) {
    console.error('Error in /api/ats-audit:', error);
    res.status(500).json({ error: error.message || 'Failed to calculate ATS audit.' });
  }
});

// 4. AI RESUME OPTIMIZATION (Strictly Honest, Fact-Based, Action Verb + Task + Tech + Impact)
app.post('/api/optimize-resume', async (req: Request, res: Response) => {
  try {
    const { resume, jd, targetJobTitle, targetCompany, isFresherMode } = req.body;
    if (!resume || !jd) {
      return res.status(400).json({ error: 'Resume and Job Description are required.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(400).json({ error: 'GEMINI_API_KEY is not configured.' });
    }

    const optimizationSystemPrompt = `You are a Professional Technical Recruiter, ATS Optimizer, and Senior Engineering Leader.
Your mission is to improve the candidate's resume for the target job description.

STRICT ETHICAL RULES (NON-NEGOTIABLE):
1. NEVER INVENT EXPERIENCE.
2. NEVER INVENT PROJECTS.
3. NEVER INVENT CERTIFICATIONS.
4. NEVER INVENT EMPLOYMENT OR DEGREES.
5. NEVER ADD SKILLS THAT THE CANDIDATE DOES NOT ACTUALLY HAVE IN THEIR SOURCE RESUME.
6. NEVER FABRICATE NUMBERS, PERCENTAGES, OR ACHIEVEMENTS. Only add measurable results when the user has provided actual numbers or quantifiable scopes in the source resume.
7. PRIORITIZE TRUTHFUL OPTIMIZATION OVER ARTIFICIALLY INFLATING THE ATS SCORE.

YOU MAY AND SHOULD:
- Rewrite weak, passive bullet points to follow the formula:
  [ACTION VERB] + [TASK] + [TECHNOLOGY] + [RESULT/IMPACT]
  Example:
  Weak: "Worked on a weather application."
  Better: "Developed a responsive weather application using React and API integration to display real-time weather information."
- Improve grammar, punctuation, and tense consistency.
- Use stronger, industry-standard action verbs (Architected, Engineered, Optimized, Delivered, Streamlined).
- Make descriptions concise and punchy.
- Reorganize sections and bullet points to elevate existing truthful experiences that directly match the target Job Description (e.g. if the JD asks for Python + SQL + AWS + Docker, make relevant existing Python/SQL/Docker work prominent).
- Improve the professional summary to clearly align candidate's authentic background with the target role.
- Naturally incorporate existing relevant keywords without keyword stuffing.
- Cleanly organize Technical Skills into standard categories: Languages, Frameworks, Developer Tools, Databases, Cloud & DevOps.
- Ensure 100% single-column ATS compatibility.
- In Fresher Mode: give higher prominence to Projects, Internships, Coursework, Hackathons, and Leadership.

Return the complete improved ResumeData object strictly matching the schema.`;

    const userPrompt = `ORIGINAL RESUME DATA:
${JSON.stringify(resume, null, 2)}

TARGET JOB DESCRIPTION:
${JSON.stringify(jd, null, 2)}

TARGET TITLE: ${targetJobTitle || jd.targetJobTitle}
TARGET COMPANY: ${targetCompany || jd.targetCompany || 'Target Employer'}
FRESHER MODE: ${Boolean(isFresherMode)}`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: userPrompt,
      config: {
        systemInstruction: optimizationSystemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            professionalSummary: { type: Type.STRING },
            contact: {
              type: Type.OBJECT,
              properties: {
                fullName: { type: Type.STRING },
                email: { type: Type.STRING },
                phone: { type: Type.STRING },
                location: { type: Type.STRING },
                linkedIn: { type: Type.STRING },
                gitHub: { type: Type.STRING },
                portfolio: { type: Type.STRING },
              },
            },
            skills: {
              type: Type.OBJECT,
              properties: {
                languages: { type: Type.ARRAY, items: { type: Type.STRING } },
                frameworks: { type: Type.ARRAY, items: { type: Type.STRING } },
                developerTools: { type: Type.ARRAY, items: { type: Type.STRING } },
                databases: { type: Type.ARRAY, items: { type: Type.STRING } },
                cloudDevOps: { type: Type.ARRAY, items: { type: Type.STRING } },
                other: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
            },
            education: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  institution: { type: Type.STRING },
                  degree: { type: Type.STRING },
                  fieldOfStudy: { type: Type.STRING },
                  location: { type: Type.STRING },
                  startDate: { type: Type.STRING },
                  endDate: { type: Type.STRING },
                  gpa: { type: Type.STRING },
                  coursework: { type: Type.ARRAY, items: { type: Type.STRING } },
                  honors: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
              },
            },
            workExperience: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  jobTitle: { type: Type.STRING },
                  company: { type: Type.STRING },
                  location: { type: Type.STRING },
                  startDate: { type: Type.STRING },
                  endDate: { type: Type.STRING },
                  bullets: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
              },
            },
            internships: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  organization: { type: Type.STRING },
                  location: { type: Type.STRING },
                  startDate: { type: Type.STRING },
                  endDate: { type: Type.STRING },
                  bullets: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
              },
            },
            projects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  technologies: { type: Type.ARRAY, items: { type: Type.STRING } },
                  context: { type: Type.STRING },
                  link: { type: Type.STRING },
                  bullets: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
              },
            },
            certifications: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  issuingOrg: { type: Type.STRING },
                  issueDate: { type: Type.STRING },
                  expiryDate: { type: Type.STRING },
                  credentialId: { type: Type.STRING },
                  url: { type: Type.STRING },
                },
              },
            },
            achievements: { type: Type.ARRAY, items: { type: Type.STRING } },
            hackathons: { type: Type.ARRAY, items: { type: Type.STRING } },
            leadership: { type: Type.ARRAY, items: { type: Type.STRING } },
            extracurriculars: { type: Type.ARRAY, items: { type: Type.STRING } },
            optimizationNotes: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ['professionalSummary', 'skills'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');

    const optimizedResume: ResumeData = {
      id: `opt-${Date.now()}`,
      title: `${resume.contact.fullName} - ATS Optimized (${targetJobTitle || jd.targetJobTitle})`,
      isFresher: resume.isFresher,
      contact: {
        ...resume.contact,
        ...(parsed.contact || {}),
      },
      professionalSummary: parsed.professionalSummary || resume.professionalSummary,
      education: (parsed.education || resume.education).map((e: any, idx: number) => ({
        id: `edu-opt-${idx}`,
        ...e,
      })),
      skills: {
        languages: parsed.skills?.languages || resume.skills.languages,
        frameworks: parsed.skills?.frameworks || resume.skills.frameworks,
        developerTools: parsed.skills?.developerTools || resume.skills.developerTools,
        databases: parsed.skills?.databases || resume.skills.databases,
        cloudDevOps: parsed.skills?.cloudDevOps || resume.skills.cloudDevOps,
        other: parsed.skills?.other || resume.skills.other,
      },
      workExperience: (parsed.workExperience || resume.workExperience).map((w: any, idx: number) => ({
        id: `exp-opt-${idx}`,
        ...w,
      })),
      internships: (parsed.internships || resume.internships).map((i: any, idx: number) => ({
        id: `intern-opt-${idx}`,
        ...i,
      })),
      projects: (parsed.projects || resume.projects).map((p: any, idx: number) => ({
        id: `proj-opt-${idx}`,
        ...p,
      })),
      certifications: parsed.certifications || resume.certifications,
      achievements: parsed.achievements || resume.achievements,
      hackathons: parsed.hackathons || resume.hackathons,
      leadership: parsed.leadership || resume.leadership,
      extracurriculars: parsed.extracurriculars || resume.extracurriculars,
      missingInformation: resume.missingInformation || [],
    };

    // Generate comparison between original and optimized
    const comparison = generateResumeComparison(resume, optimizedResume, jd, isFresherMode);
    if (parsed.optimizationNotes && parsed.optimizationNotes.length > 0) {
      comparison.explanationOfImprovements = [
        ...parsed.optimizationNotes,
        ...comparison.explanationOfImprovements,
      ];
    }

    res.json({
      success: true,
      optimizedResume,
      comparison,
    });
  } catch (error: any) {
    console.error('Error in /api/optimize-resume:', error);
    res.status(500).json({ error: error.message || 'Failed to optimize resume.' });
  }
});

// 5. IMPROVE SUMMARY
app.post('/api/improve-summary', async (req: Request, res: Response) => {
  try {
    const { currentSummary, skills, targetJobTitle, targetCompany } = req.body;
    if (!process.env.GEMINI_API_KEY) {
      return res.status(400).json({ error: 'GEMINI_API_KEY is not configured.' });
    }

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Current Summary: "${currentSummary}"
Candidate Skills: ${JSON.stringify(skills)}
Target Role: ${targetJobTitle || 'Software Engineer'} at ${targetCompany || 'Target Employer'}`,
      config: {
        systemInstruction: `You are an expert resume writer. Rewrite the candidate's professional summary in 2-3 sentences.
Rules:
- NEVER invent facts, degrees, or skills not listed.
- Use strong professional phrasing.
- Make it ATS-friendly and concise (under 50 words).
- Highlight genuine domain focus and core skills.
Return JSON: { "improvedSummary": "..." }`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            improvedSummary: { type: Type.STRING },
          },
          required: ['improvedSummary'],
        },
      },
    });

    const result = JSON.parse(response.text || '{}');
    res.json({ success: true, improvedSummary: result.improvedSummary });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to improve summary.' });
  }
});

// 6. IMPROVE BULLETS
app.post('/api/improve-bullets', async (req: Request, res: Response) => {
  try {
    const { bullets, technologies, roleTitle } = req.body;
    if (!bullets || !Array.isArray(bullets)) {
      return res.status(400).json({ error: 'Array of bullets is required.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(400).json({ error: 'GEMINI_API_KEY is not configured.' });
    }

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Raw Bullets: ${JSON.stringify(bullets)}
Technologies: ${JSON.stringify(technologies || [])}
Context / Role: ${roleTitle || 'Project'}`,
      config: {
        systemInstruction: `You are an ATS resume editor. Rewrite each bullet point strictly applying the formula:
[ACTION VERB] + [TASK] + [TECHNOLOGY] + [RESULT/IMPACT]
Rules:
- Do not fabricate false statistics. If source bullet had numbers, retain or clarify them. If no numbers existed, highlight technical outcome/functionality.
- Use active past-tense verbs (e.g. Developed, Architected, Engineered, Optimized).
- Return JSON: { "improvedBullets": ["...", "..."] }`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            improvedBullets: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ['improvedBullets'],
        },
      },
    });

    const result = JSON.parse(response.text || '{}');
    res.json({ success: true, improvedBullets: result.improvedBullets || bullets });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to improve bullets.' });
  }
});

// Full-stack Vite integration:
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`ATS Resume Builder Server running on port ${PORT}`);
  });
}

startServer();
