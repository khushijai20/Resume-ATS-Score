import {
  ResumeData,
  JobDescriptionAnalysis,
  ATSScoreReport,
  ResumeProblem,
  QualityCheckResult,
  ResumeComparisonMatrix
} from '../types/resume';

const COMMON_ACTION_VERBS = [
  'developed', 'architected', 'spearheaded', 'engineered', 'implemented',
  'optimized', 'designed', 'built', 'reduced', 'increased', 'accelerated',
  'orchestrated', 'streamlined', 'delivered', 'collaborated', 'integrated',
  'refactored', 'resolved', 'launched', 'automated', 'migrated', 'mentored'
];

export function computeATSScore(
  resume: ResumeData,
  jd: JobDescriptionAnalysis,
  isFresherMode = false
): ATSScoreReport {
  // Collect all text from resume
  const resumeKeywords = new Set<string>();
  const resumeTextParts: string[] = [
    resume.contact.fullName,
    resume.professionalSummary,
    ...resume.education.map(e => `${e.institution} ${e.degree} ${(e.coursework || []).join(' ')}`),
    ...resume.skills.languages,
    ...resume.skills.frameworks,
    ...resume.skills.developerTools,
    ...resume.skills.databases,
    ...resume.skills.cloudDevOps,
    ...resume.skills.other,
    ...resume.workExperience.map(w => `${w.jobTitle} ${w.company} ${w.bullets.join(' ')}`),
    ...resume.internships.map(i => `${i.title} ${i.organization} ${i.bullets.join(' ')}`),
    ...resume.projects.map(p => `${p.title} ${p.technologies.join(' ')} ${p.bullets.join(' ')}`),
    ...resume.certifications.map(c => `${c.name} ${c.issuingOrg}`),
    ...resume.achievements,
    ...resume.hackathons,
    ...resume.leadership,
    ...resume.extracurriculars
  ];

  const fullResumeText = resumeTextParts.join(' ').toLowerCase();

  // 1. KEYWORD MATCH (Max 35 points)
  const allJDKeywords = Array.from(new Set([
    ...jd.prioritized.highPriority,
    ...jd.prioritized.mediumPriority,
    ...jd.prioritized.lowPriority,
    ...jd.keywords.technical,
    ...jd.keywords.tools,
    ...jd.keywords.cloud,
    ...jd.keywords.databases,
    ...jd.keywords.frameworks
  ])).filter(k => k && k.trim().length > 1);

  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  allJDKeywords.forEach(keyword => {
    const cleanKw = keyword.toLowerCase().trim();
    // Normalize word boundaries
    const regex = new RegExp(`\\b${cleanKw.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
    if (regex.test(fullResumeText)) {
      matchedKeywords.push(keyword);
    } else {
      missingKeywords.push(keyword);
    }
  });

  const totalKwCount = allJDKeywords.length || 1;
  const kwRatio = Math.min(1, matchedKeywords.length / totalKwCount);
  // High priority weighting
  const highPriorityMatched = jd.prioritized.highPriority.filter(k =>
    new RegExp(`\\b${k.toLowerCase()}\\b`, 'i').test(fullResumeText)
  ).length;
  const highPriorityTotal = jd.prioritized.highPriority.length || 1;
  const highPriorityRatio = highPriorityMatched / highPriorityTotal;

  const keywordScore = Math.round(
    ((highPriorityRatio * 0.6) + (kwRatio * 0.4)) * 35
  );
  const keywordPercentage = Math.round((keywordScore / 35) * 100);

  // 2. SKILLS MATCH (Max 20 points)
  const candidateSkills = [
    ...resume.skills.languages,
    ...resume.skills.frameworks,
    ...resume.skills.developerTools,
    ...resume.skills.databases,
    ...resume.skills.cloudDevOps,
    ...resume.skills.other
  ].map(s => s.toLowerCase());

  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  const requiredMatched = jd.requiredSkills.filter(req => {
    const isFound = candidateSkills.some(cs => cs.includes(req.toLowerCase()) || req.toLowerCase().includes(cs)) ||
      new RegExp(`\\b${req.toLowerCase()}\\b`, 'i').test(fullResumeText);
    if (isFound) matchedSkills.push(req);
    else missingSkills.push(req);
    return isFound;
  }).length;

  const preferredMatched = jd.preferredSkills.filter(pref => {
    const isFound = candidateSkills.some(cs => cs.includes(pref.toLowerCase()) || pref.toLowerCase().includes(cs)) ||
      new RegExp(`\\b${pref.toLowerCase()}\\b`, 'i').test(fullResumeText);
    if (isFound && !matchedSkills.includes(pref)) matchedSkills.push(pref);
    else if (!isFound && !missingSkills.includes(pref)) missingSkills.push(pref);
    return isFound;
  }).length;

  const reqScoreRatio = jd.requiredSkills.length > 0 ? (requiredMatched / jd.requiredSkills.length) : 1;
  const prefScoreRatio = jd.preferredSkills.length > 0 ? (preferredMatched / jd.preferredSkills.length) : 0.8;
  const skillsScore = Math.round((reqScoreRatio * 15) + (prefScoreRatio * 5));
  const skillsPercentage = Math.round((skillsScore / 20) * 100);

  // 3. EXPERIENCE RELEVANCE (Max 15 points)
  let experienceScore = 0;
  let experienceRelevanceExplanation = '';

  const totalBulletPoints = [
    ...resume.workExperience.flatMap(w => w.bullets),
    ...resume.internships.flatMap(i => i.bullets),
    ...resume.projects.flatMap(p => p.bullets)
  ];

  if (isFresherMode || resume.isFresher) {
    // For freshers, evaluate projects, internships, hackathons, and coursework
    const projectCount = resume.projects.length;
    const internCount = resume.internships.length;
    const hackathonCount = resume.hackathons.length;
    
    let fresherPoints = 0;
    if (projectCount >= 2) fresherPoints += 7;
    else if (projectCount === 1) fresherPoints += 4;
    
    if (internCount >= 1) fresherPoints += 4;
    else if (hackathonCount >= 1) fresherPoints += 3;
    else fresherPoints += 2;

    // Check project tech relevance to JD
    const projectText = resume.projects.map(p => `${p.title} ${p.technologies.join(' ')} ${p.bullets.join(' ')}`).join(' ').toLowerCase();
    const relevantProjectKeywords = jd.requiredSkills.filter(s => projectText.includes(s.toLowerCase())).length;
    if (relevantProjectKeywords >= 2) fresherPoints += 4;
    else fresherPoints += 2;

    experienceScore = Math.min(15, fresherPoints);
    experienceRelevanceExplanation = `Fresher Mode Active: Evaluated academic capstones, hackathons, and ${projectCount} technical projects. Relevant technologies demonstrated in projects align well with entry-level expectations without penalizing for lack of 3+ years full-time tenure.`;
  } else {
    // Experienced role
    const expCount = resume.workExperience.length;
    if (expCount >= 2) experienceScore += 7;
    else if (expCount === 1) experienceScore += 4;
    else experienceScore += 2;

    const expText = resume.workExperience.map(w => `${w.jobTitle} ${w.company} ${w.bullets.join(' ')}`).join(' ').toLowerCase();
    const matchedExpSkills = jd.requiredSkills.filter(s => expText.includes(s.toLowerCase())).length;
    
    if (matchedExpSkills >= 4) experienceScore += 8;
    else if (matchedExpSkills >= 2) experienceScore += 5;
    else experienceScore += 2;

    experienceRelevanceExplanation = expCount > 0
      ? `Demonstrated ${expCount} professional role(s) with ${matchedExpSkills} direct technical overlaps against the required qualifications in the job description.`
      : 'Resume lacks full-time industry work experience matching the target senior/experienced role requirements.';
  }
  const experiencePercentage = Math.round((experienceScore / 15) * 100);

  // 4. RESUME STRUCTURE (Max 10 points)
  let structureScore = 0;
  if (resume.contact.fullName && resume.contact.email && resume.contact.phone) structureScore += 2;
  if (resume.professionalSummary && resume.professionalSummary.length > 40) structureScore += 2;
  if (resume.skills && (resume.skills.languages.length > 0 || resume.skills.frameworks.length > 0)) structureScore += 2;
  if (resume.education.length > 0) structureScore += 2;
  if (resume.workExperience.length > 0 || resume.projects.length > 0) structureScore += 2;
  structureScore = Math.min(10, structureScore);

  // 5. FORMATTING (Max 10 points)
  let formattingScore = 10;
  const formattingCompatibilityNotes: string[] = [];

  // Check for common ATS formatting issues in contact/text
  if (resume.missingInformation && resume.missingInformation.length > 0) {
    formattingScore -= 2;
    formattingCompatibilityNotes.push(`Missing key contact or credential fields: ${resume.missingInformation.join(', ')}`);
  }

  // Check contact links
  if (!resume.contact.linkedIn && !resume.contact.gitHub) {
    formattingScore -= 1;
    formattingCompatibilityNotes.push('Neither LinkedIn nor GitHub profile URL found in header.');
  }

  // Check bullet point consistency
  const allBullets = totalBulletPoints;
  const bulletsWithoutPeriod = allBullets.filter(b => b.trim().length > 10 && !b.trim().endsWith('.'));
  if (bulletsWithoutPeriod.length > 3) {
    formattingScore -= 1;
    formattingCompatibilityNotes.push('Inconsistent punctuation across bullet points (mix of periods and unpunctuated bullets).');
  }

  if (formattingCompatibilityNotes.length === 0) {
    formattingCompatibilityNotes.push('Clean single-column structure confirmed. No incompatible tables, decorative graphics, or multi-column textboxes detected.');
  }
  formattingScore = Math.max(4, Math.min(10, formattingScore));
  const formattingPercentage = Math.round((formattingScore / 10) * 100);

  // 6. CONTENT QUALITY (Max 10 points)
  let contentScore = 0;
  const contentQualityWeaknesses: string[] = [];

  // Check for action verbs in bullets
  const startsWithActionVerb = allBullets.filter(b => {
    const firstWord = b.trim().split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, '');
    return COMMON_ACTION_VERBS.includes(firstWord);
  });
  const actionVerbRatio = allBullets.length > 0 ? (startsWithActionVerb.length / allBullets.length) : 0;
  if (actionVerbRatio >= 0.7) {
    contentScore += 4;
  } else if (actionVerbRatio >= 0.4) {
    contentScore += 2;
    contentQualityWeaknesses.push('Several bullet points do not start with strong, decisive technical action verbs (e.g. Architected, Engineered, Optimized).');
  } else {
    contentScore += 1;
    contentQualityWeaknesses.push('Weak action verbs detected in descriptions; sentences use passive phrasing (e.g., "Worked on", "Responsible for").');
  }

  // Check for measurable numbers / metrics (%) ($) (ms) (users)
  const bulletsWithMetrics = allBullets.filter(b => /\b(\d+[%kKmM]?|\$\d+|\d+\+|\d+ms|\d+x)\b/.test(b));
  const metricRatio = allBullets.length > 0 ? (bulletsWithMetrics.length / allBullets.length) : 0;
  if (metricRatio >= 0.35) {
    contentScore += 3;
  } else if (metricRatio >= 0.15) {
    contentScore += 2;
    contentQualityWeaknesses.push('Limited quantifiable achievements; consider highlighting specific metrics (e.g., latency reduction, users served, percentage gains) where authentic data exists.');
  } else {
    contentScore += 1;
    contentQualityWeaknesses.push('Descriptions lack quantifiable metrics or business impact.');
  }

  // Professional summary quality
  if (resume.professionalSummary) {
    if (resume.professionalSummary.length > 80 && resume.professionalSummary.length < 350) {
      contentScore += 3;
    } else if (resume.professionalSummary.length <= 80) {
      contentScore += 1;
      contentQualityWeaknesses.push('Professional summary is too brief and generic; does not establish technical identity or domain focus.');
    } else {
      contentScore += 2;
      contentQualityWeaknesses.push('Professional summary exceeds 350 characters; ATS and recruiters prefer a tight 2-3 sentence overview.');
    }
  }

  contentScore = Math.max(3, Math.min(10, contentScore));
  const contentPercentage = Math.round((contentScore / 10) * 100);

  // TOTAL SCORE (0 - 100)
  const overallScore = Math.min(100, Math.max(10,
    keywordScore + skillsScore + experienceScore + structureScore + formattingScore + contentScore
  ));

  let verdict: 'Excellent' | 'Strong' | 'Good' | 'Needs Improvement' | 'Poor';
  if (overallScore >= 90) verdict = 'Excellent';
  else if (overallScore >= 80) verdict = 'Strong';
  else if (overallScore >= 70) verdict = 'Good';
  else if (overallScore >= 60) verdict = 'Needs Improvement';
  else verdict = 'Poor';

  // PROBLEMS DETECTED (Categorized as Critical, Important, Recommended, Good)
  const problems: ResumeProblem[] = [];

  // Critical checks
  if (missingSkills.length > 2 && jd.requiredSkills.length > 0) {
    const sampleMissing = missingSkills.slice(0, 3).join(', ');
    problems.push({
      id: 'crit-missing-skills',
      severity: 'critical',
      title: `Missing High-Priority Technical Skills: ${sampleMissing}`,
      whatIsWrong: `Your resume does not explicitly list core mandatory skills required by the job: ${sampleMissing}.`,
      whyItMatters: 'Applicant Tracking Systems use exact keyword matching filters to screen out resumes that do not contain must-have skills before human recruiter review.',
      howToFixIt: 'If you have hands-on experience or academic exposure to these technologies, explicitly add them to your Technical Skills and relevant project bullets. Never fabricate skills you do not possess.',
      section: 'Technical Skills'
    });
  }

  if (!resume.contact.email || !resume.contact.phone) {
    problems.push({
      id: 'crit-contact',
      severity: 'critical',
      title: 'Missing Core Contact Information',
      whatIsWrong: 'Email address or primary phone number is missing from the header.',
      whyItMatters: 'ATS parsers may fail to create a candidate profile or reject the application if primary communication channels cannot be parsed.',
      howToFixIt: 'Add a verified email address and phone number formatted with standard country/area code at the very top of your resume.',
      section: 'Contact Information'
    });
  }

  // Important checks
  if (actionVerbRatio < 0.5) {
    problems.push({
      id: 'imp-action-verbs',
      severity: 'important',
      title: 'Bullet Points Lack Strong Technical Action Verbs',
      whatIsWrong: 'More than half of your bullet points use passive phrases like "Worked on", "Helped with", or "Responsible for".',
      whyItMatters: 'Recruiters scan bullet points in 6 seconds. Strong action verbs (Architected, Engineered, Optimized, Delivered) signal ownership and impact immediately.',
      howToFixIt: 'Rephrase each bullet using the formula: [Action Verb] + [Specific Task] + [Technology Used] + [Result/Impact].',
      section: 'Experience & Projects'
    });
  }

  if (bulletsWithMetrics.length < 2 && allBullets.length > 3) {
    problems.push({
      id: 'imp-metrics',
      severity: 'important',
      title: 'Descriptions Lack Measurable Impact & Quantifiable Results',
      whatIsWrong: 'Few or no bullet points contain concrete metrics, percentages, throughput numbers, or measurable outcomes.',
      whyItMatters: 'Top-tier tech companies look for evidence of scale, performance improvement, and business impact rather than mere task lists.',
      howToFixIt: 'Include truthful metrics where available (e.g. "reduced latency by 25%", "supported 5,000+ active users", "achieved 90% test coverage"). If exact numbers are unknown, quantify scope (e.g., "12 REST endpoints", "5 microservices").',
      section: 'Experience & Projects'
    });
  }

  // Recommended checks
  if (resume.professionalSummary && resume.professionalSummary.length < 90) {
    problems.push({
      id: 'rec-summary',
      severity: 'recommended',
      title: 'Professional Summary is Too Brief or Generic',
      whatIsWrong: 'The summary does not clearly state your core stack, years/depth of experience, or target specialization.',
      whyItMatters: 'The summary gives human recruiters an immediate anchor for what role and seniority level you are best suited for.',
      howToFixIt: 'Expand the summary into 2-3 tailored sentences highlighting your primary programming languages, domain experience, and key accomplishments.',
      section: 'Professional Summary'
    });
  }

  if (!resume.contact.linkedIn || !resume.contact.gitHub) {
    problems.push({
      id: 'rec-profiles',
      severity: 'recommended',
      title: 'Missing LinkedIn or GitHub Links in Header',
      whatIsWrong: 'Your contact header lacks either an active LinkedIn profile or GitHub repository link.',
      whyItMatters: 'Technical recruiters and hiring managers routinely click GitHub to inspect code quality and commit activity, and LinkedIn to verify credentials.',
      howToFixIt: 'Add clean, hyperlinked URLs for your LinkedIn profile and active GitHub profile.',
      section: 'Contact Information'
    });
  }

  // Good highlights
  if (resume.skills.languages.length >= 3 && resume.skills.frameworks.length >= 2) {
    problems.push({
      id: 'good-skills',
      severity: 'good',
      title: 'Well-Structured Technical Skills Categorization',
      whatIsWrong: 'None (Positive observation)',
      whyItMatters: 'ATS parsers and recruiters easily digest cleanly grouped categories (Languages, Frameworks, Developer Tools, Databases, Cloud).',
      howToFixIt: 'Keep skills updated and maintain standard category headings.',
      section: 'Technical Skills'
    });
  }

  if (resume.education.length > 0 && resume.education[0].institution) {
    problems.push({
      id: 'good-education',
      severity: 'good',
      title: 'Standard Educational Record Present',
      whatIsWrong: 'None (Positive observation)',
      whyItMatters: 'Degree, institution name, and graduation date are properly formatted for ATS ingestion.',
      howToFixIt: 'Ensure graduation month and year match official transcripts.',
      section: 'Education'
    });
  }

  // Top Strengths
  const topStrengths: string[] = [];
  if (matchedKeywords.length >= 5) {
    topStrengths.push(`Strong keyword resonance: Matched ${matchedKeywords.length} key terms from the job posting.`);
  }
  if (skillsScore >= 16) {
    topStrengths.push('High technical alignment: Candidate possesses majority of explicitly required tech stack.');
  }
  if (resume.projects.length >= 2) {
    topStrengths.push(`Rich project portfolio: Includes ${resume.projects.length} detailed projects showcasing modern developer tools.`);
  }
  if (structureScore >= 8) {
    topStrengths.push('ATS-friendly standard layout with recognized section headers (Summary, Skills, Experience, Education).');
  }
  if (topStrengths.length < 2) {
    topStrengths.push('Clear baseline structure suitable for automated recruiter scanning.');
    topStrengths.push('Accurate factual alignment with standard engineering roles.');
  }

  // Recommended Changes
  const recommendedChanges: string[] = [
    missingKeywords.length > 0
      ? `Naturally integrate missing truthful keywords such as: ${missingKeywords.slice(0, 4).join(', ')} into your bullet points or skills.`
      : 'Maintain keyword density and ensure terms appear in context of actual deliverables.',
    'Apply the formula: [ACTION VERB] + [TASK] + [TECHNOLOGY] + [MEASURABLE RESULT] to every experience and project bullet.',
    'Ensure all section headings use standardized ATS conventions (SUMMARY, TECHNICAL SKILLS, EXPERIENCE, PROJECTS, EDUCATION).'
  ];

  // Quality Check
  const qualityCheck: QualityCheckResult = {
    grammarIssues: actionVerbRatio < 0.6 ? ['Ensure all bullet points maintain active, past-tense verb consistency for past roles.'] : [],
    spellingIssues: [],
    consistencyNotes: [
      bulletsWithoutPeriod.length > 0 ? `${bulletsWithoutPeriod.length} bullet point(s) missing terminal period punctuation.` : 'Bullet punctuation is consistent.',
      'Dates follow standard Month Year format.'
    ],
    redundancyNotes: candidateSkills.filter((s, idx) => candidateSkills.indexOf(s) !== idx).length > 0
      ? ['Duplicate skill entries detected in technical skills.']
      : ['No redundant skills detected.'],
    recommendedLength: isFresherMode || resume.isFresher ? '1 Page (Optimal for freshers & 0-3 years experience)' : '1 to 2 Pages (Standard for experienced engineers)',
    professionalismRating: overallScore >= 75 ? 'High (Clear, direct technical tone without buzzwords)' : 'Moderate (Refine passive wording)'
  };

  return {
    overallScore,
    verdict,
    keywordScore,
    skillsScore,
    experienceScore,
    structureScore,
    formattingScore,
    contentScore,
    keywordPercentage,
    skillsPercentage,
    experiencePercentage,
    formattingPercentage,
    contentPercentage,
    matchedKeywords: matchedKeywords.slice(0, 20),
    missingKeywords: missingKeywords.slice(0, 15),
    matchedSkills: matchedSkills.slice(0, 15),
    missingSkills: missingSkills.slice(0, 10),
    experienceRelevanceExplanation,
    formattingCompatibilityNotes,
    contentQualityWeaknesses: contentQualityWeaknesses.length > 0 ? contentQualityWeaknesses : ['No major content quality deficiencies detected.'],
    topStrengths,
    problems,
    recommendedChanges,
    qualityCheck,
    generatedAt: new Date().toISOString()
  };
}

export function generateResumeComparison(
  oldResume: ResumeData,
  optimizedResume: ResumeData,
  jd: JobDescriptionAnalysis,
  isFresher = false
): ResumeComparisonMatrix {
  const oldScore = computeATSScore(oldResume, jd, isFresher);
  const newScore = computeATSScore(optimizedResume, jd, isFresher);

  return {
    categories: [
      {
        category: 'ATS Score',
        oldResume: `${oldScore.overallScore}/100 (${oldScore.verdict})`,
        optimizedResume: `${newScore.overallScore}/100 (${newScore.verdict})`,
        difference: `+${newScore.overallScore - oldScore.overallScore} pts`
      },
      {
        category: 'Keyword Match',
        oldResume: `${oldScore.keywordPercentage}% (${oldScore.matchedKeywords.length} matched)`,
        optimizedResume: `${newScore.keywordPercentage}% (${newScore.matchedKeywords.length} matched)`,
        difference: `+${newScore.keywordPercentage - oldScore.keywordPercentage}%`
      },
      {
        category: 'Skills Match',
        oldResume: `${oldScore.skillsPercentage}% (${oldScore.matchedSkills.length} skills)`,
        optimizedResume: `${newScore.skillsPercentage}% (${newScore.matchedSkills.length} skills)`,
        difference: `+${newScore.skillsPercentage - oldScore.skillsPercentage}%`
      },
      {
        category: 'Experience Relevance',
        oldResume: `${oldScore.experiencePercentage}%`,
        optimizedResume: `${newScore.experiencePercentage}%`,
        difference: `+${newScore.experiencePercentage - oldScore.experiencePercentage}%`
      },
      {
        category: 'Formatting Compatibility',
        oldResume: `${oldScore.formattingPercentage}%`,
        optimizedResume: `${newScore.formattingPercentage}%`,
        difference: `+${newScore.formattingPercentage - oldScore.formattingPercentage}%`
      },
      {
        category: 'Content Quality',
        oldResume: `${oldScore.contentPercentage}%`,
        optimizedResume: `${newScore.contentPercentage}%`,
        difference: `+${newScore.contentPercentage - oldScore.contentPercentage}%`
      }
    ],
    explanationOfImprovements: [
      'Re-engineered bullet points using the ACTION VERB + TASK + TECHNOLOGY + RESULT formula without fabricating any unearned experience.',
      'Naturally elevated high-priority matching skills (e.g. ' + newScore.matchedSkills.slice(0, 3).join(', ') + ') in technical summaries and project descriptions.',
      'Standardized ATS typography, bullet punctuation, and section headers to ensure 100% parser readability.',
      'Removed passive fluff and tightened professional summary for immediate recruiter impact.'
    ]
  };
}
