import { ResumeData, JobDescriptionAnalysis } from '../types/resume';

export const sampleFresherResume: ResumeData = {
  id: 'fresher-sample-1',
  title: 'Computer Science Graduate Resume',
  isFresher: true,
  contact: {
    fullName: 'Aarav Patel',
    email: 'aarav.patel@email.com',
    phone: '+1 (555) 349-8201',
    location: 'San Jose, CA',
    linkedIn: 'linkedin.com/in/aarav-patel-cs',
    gitHub: 'github.com/aaravpatel-dev',
    portfolio: 'aaravpatel.dev'
  },
  professionalSummary: 'Detail-oriented Computer Science graduate with hands-on foundation in TypeScript, React, and Python. Experienced in building full-stack web applications and collaborating in collegiate hackathons. Seeking an entry-level Software Engineer role to contribute scalable code and learn modern cloud infrastructures.',
  education: [
    {
      id: 'edu-1',
      institution: 'University of California, Davis',
      degree: 'Bachelor of Science in Computer Science',
      location: 'Davis, CA',
      startDate: 'Sep 2021',
      endDate: 'Jun 2025',
      gpa: '3.78/4.00',
      coursework: [
        'Data Structures & Algorithms',
        'Database Management Systems',
        'Operating Systems',
        'Web Applications',
        'Computer Networks',
        'Software Engineering'
      ],
      honors: ["Dean's Honor List (4 quarters)"]
    }
  ],
  skills: {
    languages: ['JavaScript (ES6+)', 'TypeScript', 'Python', 'C++', 'SQL', 'HTML5/CSS3'],
    frameworks: ['React', 'Node.js', 'Express', 'Tailwind CSS', 'Next.js'],
    developerTools: ['Git', 'GitHub', 'VS Code', 'Postman', 'Vite', 'npm'],
    databases: ['PostgreSQL', 'MongoDB', 'SQLite'],
    cloudDevOps: ['Docker (Basics)', 'Vercel', 'AWS S3 (Basics)'],
    other: ['RESTful APIs', 'Agile/Scrum', 'Object-Oriented Programming (OOP)']
  },
  workExperience: [],
  internships: [
    {
      id: 'intern-1',
      title: 'Software Engineering Intern',
      organization: 'TechSprint Solutions',
      location: 'San Francisco, CA (Hybrid)',
      startDate: 'Jun 2024',
      endDate: 'Aug 2024',
      bullets: [
        'Assisted engineering team in developing customer dashboard components using React and TypeScript.',
        'Created 8 reusable UI component modules that reduced styling inconsistencies across the application.',
        'Wrote unit tests using Jest covering 15+ API data-fetching routines.',
        'Participated in daily standups and sprint planning sessions following Agile methodology.'
      ]
    }
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'DevCollab — Real-time Code Workspace',
      technologies: ['React', 'TypeScript', 'Node.js', 'Socket.io', 'Tailwind CSS'],
      context: 'Senior Capstone Project',
      link: 'github.com/aaravpatel-dev/devcollab',
      bullets: [
        'Built full-stack collaborative editor allowing concurrent syntax highlighting and live document synchronization for up to 10 users.',
        'Engineered WebSocket handlers in Node.js to achieve sub-50ms message broadcast latency.',
        'Implemented responsive layout using Tailwind CSS ensuring fluid mobile and desktop usability.'
      ]
    },
    {
      id: 'proj-2',
      title: 'ExpenseTrack — Personal Budgeting Microservice',
      technologies: ['Python', 'FastAPI', 'PostgreSQL', 'Docker'],
      context: 'Personal Project',
      link: 'github.com/aaravpatel-dev/expensetrack',
      bullets: [
        'Architected REST API with 12 endpoints for categorizing transactions and generating monthly expenditure summaries.',
        'Designed normalized relational schema with indexing on user and date fields in PostgreSQL.',
        'Packaged the service with multi-stage Dockerfile to streamline deployment.'
      ]
    }
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'Meta Front-End Developer Professional Certificate',
      issuingOrg: 'Coursera / Meta',
      issueDate: 'Jan 2024'
    }
  ],
  achievements: [
    'Won 2nd Place out of 45 teams at CalHacks 2024 for Best Developer Tool',
    'UC Davis Regents Scholar nominee for academic achievement'
  ],
  hackathons: [
    'CalHacks 2024 — Built automated GitHub PR summarizing utility in 36 hours',
    'Davis HackFest 2023 — Developed campus shuttle schedule tracker'
  ],
  leadership: [
    'Vice President, ACM Student Chapter at UC Davis (Organized 6 technical workshops for 120+ attendees)'
  ],
  extracurriculars: [
    'Competitive Programming Club (Solved 300+ LeetCode problems across algorithms and graphs)',
    'Peer Tutor for introductory Python and Data Structures'
  ],
  missingInformation: []
};

export const sampleExperiencedResume: ResumeData = {
  id: 'exp-sample-1',
  title: 'Full Stack Software Engineer (4 YOE)',
  isFresher: false,
  contact: {
    fullName: 'Elena Rostova',
    email: 'elena.rostova@techmail.io',
    phone: '+1 (415) 890-4122',
    location: 'Seattle, WA',
    linkedIn: 'linkedin.com/in/elena-rostova-eng',
    gitHub: 'github.com/erostova-dev',
    portfolio: 'elenarostova.dev'
  },
  professionalSummary: 'Full Stack Software Engineer with 4 years of experience designing and scaling microservices, real-time web applications, and cloud data pipelines. Proficient in TypeScript, React, Node.js, Go, PostgreSQL, and AWS (ECS, Lambda, RDS). Proven track record of improving system latency by 35% and mentoring junior developers.',
  education: [
    {
      id: 'edu-exp-1',
      institution: 'University of Washington',
      degree: 'B.S. in Computer Science & Systems',
      location: 'Seattle, WA',
      startDate: 'Sep 2017',
      endDate: 'Jun 2021',
      gpa: '3.82/4.00'
    }
  ],
  skills: {
    languages: ['TypeScript', 'JavaScript', 'Go', 'Python', 'SQL'],
    frameworks: ['React', 'Next.js', 'Node.js', 'Express', 'NestJS', 'GraphQL', 'Tailwind CSS'],
    developerTools: ['Git', 'Docker', 'Kubernetes (Basics)', 'Terraform', 'Postman', 'Webpack', 'Vite'],
    databases: ['PostgreSQL', 'Redis', 'DynamoDB', 'MongoDB'],
    cloudDevOps: ['AWS (ECS, Lambda, S3, RDS, CloudWatch)', 'CI/CD (GitHub Actions)', 'Datadog'],
    other: ['Microservices', 'System Design', 'Event-Driven Architecture', 'Kafka (Basics)', 'REST API Design']
  },
  workExperience: [
    {
      id: 'exp-1',
      jobTitle: 'Software Engineer II',
      company: 'OmniStream Cloud',
      location: 'Seattle, WA',
      startDate: 'Jul 2022',
      endDate: 'Present',
      bullets: [
        'Spearheaded redesign of core billing and analytics pipeline using Node.js and PostgreSQL, processing $12M+ monthly transaction volume.',
        'Migrated monolithic data aggregation endpoint to distributed Go microservice with Redis caching, reducing p99 response times from 420ms to 95ms (77% decrease).',
        'Provisioned containerized services on AWS ECS via Terraform and configured automated zero-downtime deployment pipelines in GitHub Actions.',
        'Mentored 3 junior software engineers through architectural design reviews and structured code pair programming.'
      ]
    },
    {
      id: 'exp-2',
      jobTitle: 'Software Engineer I',
      company: 'Apex Media Labs',
      location: 'Seattle, WA',
      startDate: 'Jul 2021',
      endDate: 'Jun 2022',
      bullets: [
        'Developed interactive analytics dashboards in React and TypeScript for 25,000 active content creators.',
        'Integrated GraphQL query batching and optimistic UI updates to eliminate user-perceived loading delays on heavy data tables.',
        'Wrote robust test suite using Cypress and React Testing Library, lifting test coverage from 54% to 88% across frontend modules.'
      ]
    }
  ],
  internships: [],
  projects: [
    {
      id: 'proj-exp-1',
      title: 'KubePulse — Open-Source Pod Resource Visualizer',
      technologies: ['TypeScript', 'React', 'Go', 'Docker', 'Prometheus'],
      context: 'Open Source',
      link: 'github.com/erostova-dev/kubepulse',
      bullets: [
        'Developed lightweight CLI and dashboard application to monitor Kubernetes namespace resource saturation; collected 450+ GitHub stars.',
        'Optimized telemetry polling interval to preserve sub-1% CPU overhead on host cluster nodes.'
      ]
    }
  ],
  certifications: [
    {
      id: 'cert-exp-1',
      name: 'AWS Certified Solutions Architect – Associate',
      issuingOrg: 'Amazon Web Services',
      issueDate: 'Nov 2023',
      expiryDate: 'Nov 2026'
    }
  ],
  achievements: [
    'Awarded OmniStream Engineering Spot Bonus for resolving critical data synchronization bottleneck ahead of enterprise client audit'
  ],
  hackathons: [],
  leadership: [
    'Lead organizer for Seattle Women in Tech bi-monthly JavaScript meetups'
  ],
  extracurriculars: [],
  missingInformation: []
};

export const sampleJobDescriptionFintech: JobDescriptionAnalysis = {
  targetJobTitle: 'Senior Full Stack Engineer',
  targetCompany: 'NovaPay Financial',
  rawText: `About NovaPay:
NovaPay is a high-growth fintech building modern payment infrastructure for cross-border commerce. We are looking for an experienced Senior Full Stack Engineer to build high-scale transaction systems, merchant dashboards, and resilient API services.

Key Responsibilities:
- Design, build, and deploy production-grade web applications and distributed microservices handling millions of financial operations.
- Collaborate with product designers and backend engineers to deliver intuitive, accessible merchant portals using React, TypeScript, and Tailwind CSS.
- Architect robust backend APIs with Node.js / Express / NestJS and Go, leveraging PostgreSQL for ACID transactional data and Redis for high-speed caching.
- Build reliable CI/CD pipelines with Docker and GitHub Actions, deploying into cloud environments on AWS (ECS, Lambda, SQS, CloudWatch).
- Ensure banking-grade security, adherence to OWASP standards, and data integrity across all distributed touchpoints.
- Mentor junior engineers and champion clean code, automated testing, and comprehensive documentation.

Required Qualifications & Technical Skills:
- 3+ years of professional software engineering experience building production web applications.
- Strong proficiency in modern JavaScript/TypeScript, React, and Node.js.
- Strong practical knowledge of relational databases (PostgreSQL, MySQL) and complex query optimization.
- Experience with Cloud platforms (AWS or GCP) including container orchestration with Docker.
- Solid understanding of RESTful API architecture and microservice communication.
- Proven experience with automated unit, integration, and end-to-end testing (Jest, Cypress).

Preferred Qualifications:
- Familiarity with FinTech, payment gateways (Stripe, Adyen), or PCI-DSS compliance requirements.
- Hands-on experience with Go or Python for backend microservices.
- Experience with message queues (Kafka, AWS SQS/SNS, or RabbitMQ).
- AWS Certified Developer or Solutions Architect credential.
- Experience in agile environments with rapid bi-weekly release cycles.`,
  requiredSkills: [
    'TypeScript',
    'React',
    'Node.js',
    'PostgreSQL',
    'Docker',
    'AWS',
    'RESTful APIs',
    'Microservices',
    'Unit Testing (Jest)',
    'Git'
  ],
  preferredSkills: [
    'Go',
    'FinTech / Payment Gateways',
    'Redis',
    'AWS SQS/SNS',
    'Kafka',
    'Tailwind CSS',
    'AWS Certification',
    'PCI-DSS Compliance',
    'GraphQL'
  ],
  keywords: {
    technical: [
      'TypeScript',
      'React',
      'Node.js',
      'PostgreSQL',
      'Microservices',
      'Distributed Systems',
      'ACID transactions',
      'REST APIs',
      'Caching'
    ],
    softSkills: [
      'Mentorship',
      'Collaboration',
      'Cross-functional communication',
      'Problem-solving',
      'Agile delivery'
    ],
    tools: [
      'Git',
      'GitHub Actions',
      'Docker',
      'Postman',
      'Jest',
      'Cypress'
    ],
    languages: [
      'TypeScript',
      'JavaScript',
      'Go',
      'Python',
      'SQL'
    ],
    frameworks: [
      'React',
      'Express',
      'NestJS',
      'Next.js',
      'Tailwind CSS'
    ],
    cloud: [
      'AWS ECS',
      'AWS Lambda',
      'AWS SQS',
      'CloudWatch',
      'Docker'
    ],
    databases: [
      'PostgreSQL',
      'Redis',
      'MySQL'
    ],
    certifications: [
      'AWS Certified Developer',
      'AWS Solutions Architect'
    ],
    jobTitles: [
      'Senior Full Stack Engineer',
      'Full Stack Software Engineer',
      'Backend Engineer'
    ],
    domainTerms: [
      'Fintech',
      'Cross-border payments',
      'Transaction processing',
      'PCI-DSS',
      'High-scale infrastructure'
    ],
    actionVerbs: [
      'Architect',
      'Design',
      'Deploy',
      'Spearhead',
      'Scale',
      'Optimize',
      'Mentor',
      'Engineer'
    ]
  },
  requirements: {
    education: ['Bachelor’s degree in Computer Science, Software Engineering, or equivalent experience'],
    experience: ['3+ years professional software engineering experience', 'Experience with high-scale web apps'],
    location: ['Remote or Hybrid'],
    certifications: ['AWS certification is a plus'],
    yearsOfExperience: '3+ years',
    otherCriteria: ['Financial systems experience desirable', 'Strong code review & testing ethic']
  },
  prioritized: {
    highPriority: [
      'TypeScript',
      'React',
      'Node.js',
      'PostgreSQL',
      'AWS',
      'Docker',
      'RESTful APIs',
      'Microservices'
    ],
    mediumPriority: [
      'Redis',
      'Go',
      'CI/CD (GitHub Actions)',
      'Automated Testing (Jest/Cypress)',
      'Fintech / Payment Processing',
      'Tailwind CSS'
    ],
    lowPriority: [
      'Kafka / SQS',
      'AWS Certification',
      'GraphQL',
      'PCI-DSS',
      'NestJS'
    ]
  }
};

export const sampleJobDescriptionJunior: JobDescriptionAnalysis = {
  targetJobTitle: 'Associate Software Engineer / Junior Frontend Developer',
  targetCompany: 'CloudScale Dynamics',
  rawText: `CloudScale Dynamics is hiring an enthusiastic Associate Software Engineer / Junior Frontend Developer.
We welcome recent graduates, bootcamp alumni, and developers with 0-2 years of experience!

What You Will Do:
- Build interactive user interfaces with React, TypeScript, and modern CSS/Tailwind.
- Connect frontend components with backend REST APIs and write clean unit tests.
- Collaborate with designers to translate wireframes into accessible, high-performance web pages.
- Participate in code reviews, bug fixes, and feature prototyping.

Qualifications:
- Bachelor's in CS, IT, or related degree, or equivalent portfolio of real projects.
- Solid understanding of JavaScript (ES6+), HTML, and CSS fundamentals.
- Familiarity with React or other component-based frontend frameworks.
- Basic experience with Git / GitHub version control.
- Eagerness to learn, strong problem-solving ability, and good communication skills.

Bonus Skills:
- Experience with TypeScript, Next.js, or Tailwind CSS.
- Basic knowledge of Node.js or SQL databases.
- Prior internship, academic capstone, or open-source project contributions.`,
  requiredSkills: [
    'JavaScript',
    'React',
    'HTML5',
    'CSS3',
    'Git',
    'REST APIs'
  ],
  preferredSkills: [
    'TypeScript',
    'Tailwind CSS',
    'Node.js',
    'SQL',
    'Unit Testing'
  ],
  keywords: {
    technical: ['JavaScript', 'React', 'HTML5', 'CSS3', 'REST APIs', 'Git', 'Responsive Design'],
    softSkills: ['Eagerness to learn', 'Communication', 'Problem-solving', 'Team player'],
    tools: ['Git', 'GitHub', 'VS Code', 'npm'],
    languages: ['JavaScript', 'TypeScript', 'HTML', 'CSS', 'SQL'],
    frameworks: ['React', 'Next.js', 'Tailwind CSS'],
    cloud: ['Vercel', 'Basic Cloud awareness'],
    databases: ['PostgreSQL', 'SQLite', 'MongoDB'],
    certifications: [],
    jobTitles: ['Associate Software Engineer', 'Junior Frontend Developer', 'Frontend Engineer Intern'],
    domainTerms: ['Responsive Design', 'Web Accessibility', 'Component Architecture'],
    actionVerbs: ['Develop', 'Collaborate', 'Build', 'Integrate', 'Debug']
  },
  requirements: {
    education: ["Bachelor's in Computer Science or equivalent hands-on portfolio"],
    experience: ['0-2 years (Freshers & recent graduates strongly encouraged)'],
    location: ['San Francisco / Hybrid / Remote'],
    certifications: [],
    yearsOfExperience: '0-2 years',
    otherCriteria: ['Portfolio projects or internship experience']
  },
  prioritized: {
    highPriority: ['JavaScript', 'React', 'HTML5/CSS3', 'Git', 'REST APIs'],
    mediumPriority: ['TypeScript', 'Tailwind CSS', 'Responsive UI', 'Unit Testing'],
    lowPriority: ['Node.js', 'PostgreSQL', 'Next.js']
  }
};
