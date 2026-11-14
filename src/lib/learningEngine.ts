import {
  AchievementBadge,
  AgentExecutionLog,
  AgentStatusRecord,
  AssessmentQuestion,
  AssessmentSubmissionResult,
  CareerMatchAnalysis,
  CareerRole,
  LearnerProfileState,
  LearningPaceMode,
  LearningResource,
  ProficiencyScale,
  RoadmapMilestone,
  RoadmapPhaseCategory,
  SkillNode,
  SkillReelItem,
  SkillStatus,
} from '../types/nexora';

export function getProficiencyLabel(level: ProficiencyScale): string {
  switch (level) {
    case 0:
      return 'Unexplored (0/5)';
    case 1:
      return '1. Beginner';
    case 2:
      return '2. Elementary';
    case 3:
      return '3. Intermediate';
    case 4:
      return '4. Advanced';
    case 5:
      return '5. Expert';
  }
}

export function deriveSkillStatus(
  proficiency: ProficiencyScale,
  targetProficiency: ProficiencyScale,
  lastScore?: number
): SkillStatus {
  if (proficiency === 0) return 'missing';
  if (lastScore !== undefined && lastScore < 60) return 'revision';
  if (proficiency >= targetProficiency || proficiency >= 4) return 'mastered';
  return 'weak';
}

export const CAREER_ROLES: CareerRole[] = [
  {
    id: 'fullstack',
    title: 'Full Stack Developer',
    category: 'Software Engineering',
    description:
      'Architect and build end-to-end web applications spanning interactive React frontends, Node.js/Express APIs, relational/NoSQL databases, and cloud deployment pipelines.',
    avgSalaryRange: '$115,000 – $168,000',
    demandGrowth: '+23% YoY Demand',
    requiredTechnicalSkills: [
      { skillId: 'python', skillName: 'Python Programming', category: 'Language', requiredLevel: 4, weight: 12, isCritical: false },
      { skillId: 'html_css', skillName: 'HTML5 & Modern CSS', category: 'Frontend', requiredLevel: 4, weight: 10, isCritical: false },
      { skillId: 'javascript', skillName: 'JavaScript (ES6+ & Async)', category: 'Language', requiredLevel: 4, weight: 16, isCritical: true },
      { skillId: 'react', skillName: 'React & State Architecture', category: 'Frontend', requiredLevel: 4, weight: 16, isCritical: true },
      { skillId: 'nodejs', skillName: 'Node.js Runtime', category: 'Backend', requiredLevel: 4, weight: 14, isCritical: true },
      { skillId: 'express', skillName: 'Express & Middleware', category: 'Backend', requiredLevel: 3, weight: 10, isCritical: true },
      { skillId: 'rest_apis', skillName: 'RESTful APIs & Auth', category: 'Backend', requiredLevel: 4, weight: 12, isCritical: true },
      { skillId: 'sql', skillName: 'SQL & Relational Modeling', category: 'Database', requiredLevel: 4, weight: 10, isCritical: false },
      { skillId: 'git_github', skillName: 'Git & GitHub Workflows', category: 'DevOps & Cloud', requiredLevel: 3, weight: 8, isCritical: true },
    ],
    requiredSoftSkills: ['Systems Thinking', 'API Contract Communication', 'Debugging & Root-Cause Analysis', 'Agile Delivery'],
    languages: ['JavaScript', 'TypeScript', 'Python', 'SQL', 'HTML/CSS'],
    frameworks: ['React', 'Express', 'Next.js', 'Tailwind CSS'],
    tools: ['Git', 'GitHub', 'PostgreSQL', 'Docker', 'Vite', 'Postman'],
    practicalExperience: '2+ end-to-end production-grade web applications with authentication, database persistence, and REST APIs.',
    recommendedProjects: [
      'Multi-Tenant SaaS Task & Analytics Workspace with JWT/OAuth & PostgreSQL',
      'Real-Time Collaborative Code & Document Studio with Express & WebSockets',
      'End-to-End E-Commerce API & React Storefront with Role-Based Access',
    ],
    relevantCertifications: [
      'Meta Front-End / Back-End Developer Professional Certificate',
      'OpenJS Node.js Application Developer (JSNAD)',
      'AWS Certified Developer – Associate',
    ],
  },
  {
    id: 'frontend',
    title: 'Frontend Developer',
    category: 'Software Engineering',
    description:
      'Craft ultra-responsive, accessible, high-performance user interfaces, design systems, and interactive 3D/WebGL web experiences.',
    avgSalaryRange: '$105,000 – $155,000',
    demandGrowth: '+19% YoY Demand',
    requiredTechnicalSkills: [
      { skillId: 'html_css', skillName: 'HTML5 & Modern CSS', category: 'Frontend', requiredLevel: 5, weight: 20, isCritical: true },
      { skillId: 'javascript', skillName: 'JavaScript (ES6+ & Async)', category: 'Language', requiredLevel: 4, weight: 25, isCritical: true },
      { skillId: 'react', skillName: 'React & State Architecture', category: 'Frontend', requiredLevel: 5, weight: 25, isCritical: true },
      { skillId: 'rest_apis', skillName: 'RESTful APIs & Auth', category: 'Backend', requiredLevel: 3, weight: 15, isCritical: false },
      { skillId: 'git_github', skillName: 'Git & GitHub Workflows', category: 'DevOps & Cloud', requiredLevel: 3, weight: 15, isCritical: true },
    ],
    requiredSoftSkills: ['UI/UX Empathy', 'Accessibility Advocacy (WCAG)', 'Design-to-Code Precision'],
    languages: ['JavaScript', 'TypeScript', 'HTML5', 'CSS3'],
    frameworks: ['React', 'Next.js', 'Tailwind CSS', 'Three.js'],
    tools: ['Vite', 'Figma', 'Playwright', 'Chrome DevTools', 'Git'],
    practicalExperience: 'Component library architecture, Core Web Vitals optimization, and complex state management.',
    recommendedProjects: [
      'Accessible Design System & Component Token Library',
      'Interactive 3D Product Configurator with Three.js & React',
    ],
    relevantCertifications: ['W3C Front-End Web Developer', 'Meta Front-End Developer Certificate'],
  },
  {
    id: 'backend',
    title: 'Backend Developer',
    category: 'Software Engineering',
    description:
      'Design high-throughput distributed services, secure APIs, relational schemas, caching layers, and fault-tolerant microservices.',
    avgSalaryRange: '$120,000 – $172,000',
    demandGrowth: '+21% YoY Demand',
    requiredTechnicalSkills: [
      { skillId: 'python', skillName: 'Python Programming', category: 'Language', requiredLevel: 4, weight: 20, isCritical: false },
      { skillId: 'nodejs', skillName: 'Node.js Runtime', category: 'Backend', requiredLevel: 4, weight: 20, isCritical: true },
      { skillId: 'express', skillName: 'Express & Middleware', category: 'Backend', requiredLevel: 4, weight: 15, isCritical: true },
      { skillId: 'rest_apis', skillName: 'RESTful APIs & Auth', category: 'Backend', requiredLevel: 5, weight: 20, isCritical: true },
      { skillId: 'sql', skillName: 'SQL & Relational Modeling', category: 'Database', requiredLevel: 5, weight: 15, isCritical: true },
      { skillId: 'git_github', skillName: 'Git & GitHub Workflows', category: 'DevOps & Cloud', requiredLevel: 3, weight: 10, isCritical: false },
    ],
    requiredSoftSkills: ['Security Mindset', 'Data Integrity Modeling', 'Incident Triage'],
    languages: ['Python', 'JavaScript/TypeScript', 'SQL', 'Go'],
    frameworks: ['Express', 'FastAPI', 'NestJS'],
    tools: ['PostgreSQL', 'Redis', 'Docker', 'Git'],
    practicalExperience: 'High-concurrency API design, database indexing, and authentication middleware.',
    recommendedProjects: ['Distributed Rate-Limited API Gateway', 'Transactional Payment Ledger Service'],
    relevantCertifications: ['OpenJS Node.js Services Developer', 'PostgreSQL Associate Certification'],
  },
  {
    id: 'aiml',
    title: 'AI/ML Engineer',
    category: 'Artificial Intelligence',
    description:
      'Build, fine-tune, and orchestrate multi-agent LLM workflows, deep learning pipelines, vector retrieval systems, and production inference APIs.',
    avgSalaryRange: '$140,000 – $210,000',
    demandGrowth: '+38% YoY Demand',
    requiredTechnicalSkills: [
      { skillId: 'python', skillName: 'Python Programming', category: 'Language', requiredLevel: 5, weight: 25, isCritical: true },
      { skillId: 'machine_learning', skillName: 'Machine Learning & LLMs', category: 'AI & Data', requiredLevel: 5, weight: 30, isCritical: true },
      { skillId: 'sql', skillName: 'SQL & Relational Modeling', category: 'Database', requiredLevel: 4, weight: 15, isCritical: false },
      { skillId: 'rest_apis', skillName: 'RESTful APIs & Auth', category: 'Backend', requiredLevel: 4, weight: 15, isCritical: true },
      { skillId: 'git_github', skillName: 'Git & GitHub Workflows', category: 'DevOps & Cloud', requiredLevel: 3, weight: 15, isCritical: false },
    ],
    requiredSoftSkills: ['Experimental Rigor', 'AI Safety & Evaluation', 'Cross-Functional Communication'],
    languages: ['Python', 'SQL', 'TypeScript'],
    frameworks: ['PyTorch', 'Scikit-Learn', 'Google GenAI SDK', 'FastAPI'],
    tools: ['Jupyter', 'Docker', 'Git', 'Vector Databases'],
    practicalExperience: 'Deploying evaluated ML models and multi-agent LLM pipelines with structured outputs.',
    recommendedProjects: ['Multi-Agent RAG & Tool-Use Orchestrator', 'Real-Time Anomaly Detection Pipeline'],
    relevantCertifications: ['Google Cloud Professional Machine Learning Engineer', 'DeepLearning.AI TensorFlow Developer'],
  },
  {
    id: 'datascientist',
    title: 'Data Scientist',
    category: 'Data & Analytics',
    description: 'Extract predictive insights from complex datasets using statistical modeling, experimentation, and machine learning.',
    avgSalaryRange: '$125,000 – $180,000',
    demandGrowth: '+26% YoY Demand',
    requiredTechnicalSkills: [
      { skillId: 'python', skillName: 'Python Programming', category: 'Language', requiredLevel: 5, weight: 30, isCritical: true },
      { skillId: 'sql', skillName: 'SQL & Relational Modeling', category: 'Database', requiredLevel: 5, weight: 25, isCritical: true },
      { skillId: 'machine_learning', skillName: 'Machine Learning & LLMs', category: 'AI & Data', requiredLevel: 4, weight: 30, isCritical: true },
      { skillId: 'git_github', skillName: 'Git & GitHub Workflows', category: 'DevOps & Cloud', requiredLevel: 3, weight: 15, isCritical: false },
    ],
    requiredSoftSkills: ['Hypothesis Testing', 'Executive Data Storytelling', 'Domain Curiosity'],
    languages: ['Python', 'SQL', 'R'],
    frameworks: ['Pandas', 'Scikit-Learn', 'Statsmodels'],
    tools: ['Jupyter', 'BigQuery', 'Tableau', 'Git'],
    practicalExperience: 'A/B testing design, churn prediction, and causal inference pipelines.',
    recommendedProjects: ['Customer Lifetime Value & Churn Forecasting Engine', 'Causal Inference Experimentation Platform'],
    relevantCertifications: ['Google Advanced Data Analytics Certificate', 'IBM Data Science Professional'],
  },
  {
    id: 'dataanalyst',
    title: 'Data Analyst',
    category: 'Data & Analytics',
    description: 'Transform raw operational data into verified business intelligence dashboards, SQL pipelines, and KPI narratives.',
    avgSalaryRange: '$88,000 – $128,000',
    demandGrowth: '+20% YoY Demand',
    requiredTechnicalSkills: [
      { skillId: 'sql', skillName: 'SQL & Relational Modeling', category: 'Database', requiredLevel: 5, weight: 40, isCritical: true },
      { skillId: 'python', skillName: 'Python Programming', category: 'Language', requiredLevel: 4, weight: 35, isCritical: true },
      { skillId: 'git_github', skillName: 'Git & GitHub Workflows', category: 'DevOps & Cloud', requiredLevel: 2, weight: 25, isCritical: false },
    ],
    requiredSoftSkills: ['Business Acumen', 'Data Visualization Clarity', 'Stakeholder Alignment'],
    languages: ['SQL', 'Python'],
    frameworks: ['Pandas', 'Plotly'],
    tools: ['PostgreSQL', 'BigQuery', 'Looker Studio', 'Excel'],
    practicalExperience: 'Complex SQL window functions, cohort retention analysis, and KPI modeling.',
    recommendedProjects: ['SaaS Cohort Retention & Revenue Attribution Warehouse'],
    relevantCertifications: ['Google Data Analytics Professional Certificate'],
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity Engineer',
    category: 'Security & Infrastructure',
    description: 'Harden application architectures, enforce zero-trust access control, audit code for injection vulnerabilities, and automate threat detection.',
    avgSalaryRange: '$130,000 – $190,000',
    demandGrowth: '+31% YoY Demand',
    requiredTechnicalSkills: [
      { skillId: 'cybersecurity', skillName: 'AppSec & Zero-Trust Security', category: 'Architecture & Soft Skills', requiredLevel: 5, weight: 35, isCritical: true },
      { skillId: 'python', skillName: 'Python Programming', category: 'Language', requiredLevel: 4, weight: 20, isCritical: true },
      { skillId: 'rest_apis', skillName: 'RESTful APIs & Auth', category: 'Backend', requiredLevel: 4, weight: 25, isCritical: true },
      { skillId: 'sql', skillName: 'SQL & Relational Modeling', category: 'Database', requiredLevel: 3, weight: 20, isCritical: false },
    ],
    requiredSoftSkills: ['Adversarial Thinking', 'Incident Response Calmness', 'Compliance Documentation'],
    languages: ['Python', 'JavaScript', 'Bash', 'SQL'],
    frameworks: ['OWASP ASVS', 'NIST Zero Trust'],
    tools: ['Burp Suite', 'Wireshark', 'Git', 'SIEM'],
    practicalExperience: 'Threat modeling, RBAC/ABAC rule hardening, and automated vulnerability scanning.',
    recommendedProjects: ['Zero-Trust RBAC Policy Engine & Security Scanner'],
    relevantCertifications: ['CompTIA Security+', 'CISSP', 'OSCP'],
  },
  {
    id: 'cloud',
    title: 'Cloud Engineer',
    category: 'Security & Infrastructure',
    description: 'Architect scalable cloud-native infrastructure, serverless runtimes, IAM policies, and resilient multi-region networks.',
    avgSalaryRange: '$125,000 – $178,000',
    demandGrowth: '+24% YoY Demand',
    requiredTechnicalSkills: [
      { skillId: 'python', skillName: 'Python Programming', category: 'Language', requiredLevel: 4, weight: 25, isCritical: false },
      { skillId: 'rest_apis', skillName: 'RESTful APIs & Auth', category: 'Backend', requiredLevel: 4, weight: 25, isCritical: true },
      { skillId: 'git_github', skillName: 'Git & GitHub Workflows', category: 'DevOps & Cloud', requiredLevel: 4, weight: 25, isCritical: true },
      { skillId: 'cybersecurity', skillName: 'AppSec & Zero-Trust Security', category: 'Architecture & Soft Skills', requiredLevel: 4, weight: 25, isCritical: true },
    ],
    requiredSoftSkills: ['Cost Optimization', 'High-Availability Planning', 'Documentation'],
    languages: ['Python', 'HCL (Terraform)', 'Bash'],
    frameworks: ['Cloud Run', 'Kubernetes', 'Terraform'],
    tools: ['Google Cloud SDK', 'Docker', 'GitHub Actions'],
    practicalExperience: 'Infrastructure-as-Code provisioning and zero-downtime cloud deployments.',
    recommendedProjects: ['Auto-Scaling Multi-Region Serverless Microservices Platform'],
    relevantCertifications: ['Google Cloud Associate Cloud Engineer', 'AWS Solutions Architect'],
  },
  {
    id: 'devops',
    title: 'DevOps Engineer',
    category: 'Security & Infrastructure',
    description: 'Automate CI/CD pipelines, container orchestration, observability telemetry, and site reliability engineering workflows.',
    avgSalaryRange: '$128,000 – $182,000',
    demandGrowth: '+25% YoY Demand',
    requiredTechnicalSkills: [
      { skillId: 'git_github', skillName: 'Git & GitHub Workflows', category: 'DevOps & Cloud', requiredLevel: 5, weight: 30, isCritical: true },
      { skillId: 'python', skillName: 'Python Programming', category: 'Language', requiredLevel: 4, weight: 25, isCritical: true },
      { skillId: 'nodejs', skillName: 'Node.js Runtime', category: 'Backend', requiredLevel: 3, weight: 20, isCritical: false },
      { skillId: 'cybersecurity', skillName: 'AppSec & Zero-Trust Security', category: 'Architecture & Soft Skills', requiredLevel: 4, weight: 25, isCritical: true },
    ],
    requiredSoftSkills: ['Blameless Postmortems', 'Automation Mindset', 'Cross-Team Collaboration'],
    languages: ['Python', 'Bash', 'YAML', 'Go'],
    frameworks: ['Docker', 'Kubernetes', 'OpenTelemetry'],
    tools: ['GitHub Actions', 'Prometheus', 'Grafana', 'Git'],
    practicalExperience: 'Automated testing gates, container security, and SLO monitoring.',
    recommendedProjects: ['Zero-Downtime GitOps Deployment & Observability Pipeline'],
    relevantCertifications: ['Certified Kubernetes Administrator (CKA)', 'Google Cloud DevOps Engineer'],
  },
  {
    id: 'uiux',
    title: 'UI/UX Designer',
    category: 'Design & Product',
    description: 'Design intuitive user journeys, interactive prototypes, accessible design systems, and spatial 3D interfaces.',
    avgSalaryRange: '$102,000 – $152,000',
    demandGrowth: '+17% YoY Demand',
    requiredTechnicalSkills: [
      { skillId: 'html_css', skillName: 'HTML5 & Modern CSS', category: 'Frontend', requiredLevel: 4, weight: 40, isCritical: true },
      { skillId: 'javascript', skillName: 'JavaScript (ES6+ & Async)', category: 'Language', requiredLevel: 3, weight: 30, isCritical: false },
      { skillId: 'react', skillName: 'React & State Architecture', category: 'Frontend', requiredLevel: 3, weight: 30, isCritical: false },
    ],
    requiredSoftSkills: ['User Research Synthesis', 'Visual Hierarchy', 'Information Architecture'],
    languages: ['HTML5', 'CSS3', 'Design Tokens (JSON)'],
    frameworks: ['Tailwind CSS', 'Figma Auto-Layout', 'WCAG 2.2'],
    tools: ['Figma', 'Storybook', 'Framer'],
    practicalExperience: 'End-to-end usability testing, design token systems, and interactive prototyping.',
    recommendedProjects: ['Multi-Platform Design System with Accessible Component Specs'],
    relevantCertifications: ['Google UX Design Professional Certificate', 'NN/g UX Certification'],
  },
  {
    id: 'pm',
    title: 'Product Manager',
    category: 'Design & Product',
    description: 'Define product vision, prioritize high-impact user problems, analyze cohort metrics, and align engineering and design execution.',
    avgSalaryRange: '$125,000 – $185,000',
    demandGrowth: '+18% YoY Demand',
    requiredTechnicalSkills: [
      { skillId: 'sql', skillName: 'SQL & Relational Modeling', category: 'Database', requiredLevel: 3, weight: 35, isCritical: true },
      { skillId: 'rest_apis', skillName: 'RESTful APIs & Auth', category: 'Backend', requiredLevel: 2, weight: 30, isCritical: false },
      { skillId: 'machine_learning', skillName: 'Machine Learning & LLMs', category: 'AI & Data', requiredLevel: 3, weight: 35, isCritical: true },
    ],
    requiredSoftSkills: ['Prioritization (RICE)', 'Customer Discovery', 'Executive Storytelling'],
    languages: ['SQL', 'Markdown'],
    frameworks: ['Jobs-to-be-Done', 'OKRs', 'Agile Scrum'],
    tools: ['Linear', 'Amplitude', 'Figma', 'BigQuery'],
    practicalExperience: 'PRDs, funnel conversion experiments, and multi-quarter roadmap leadership.',
    recommendedProjects: ['AI Product PRD, Evaluation Rubric & Funnel Telemetry Spec'],
    relevantCertifications: ['Pragmatic Institute Product Management', 'AIPMM Certified Product Manager'],
  },
];

export const VERIFIED_RESOURCES: LearningResource[] = [
  {
    id: 'res_js_info',
    title: 'The Modern JavaScript Tutorial (Part 1 & Async/Await)',
    provider: 'JavaScript.info',
    topic: 'JavaScript Fundamentals & Asynchronous Programming',
    skillId: 'javascript',
    difficulty: 'Beginner',
    duration: '18 hours',
    type: 'Interactive Platform',
    url: 'https://javascript.info/',
    reason: 'Addresses Alex’s critical JavaScript gap from lexical closures to Promises and Event Loop mechanics.',
  },
  {
    id: 'res_mdn_js',
    title: 'MDN JavaScript Guide & Web APIs Reference',
    provider: 'Mozilla Developer Network',
    topic: 'Core JavaScript & DOM Manipulation',
    skillId: 'javascript',
    difficulty: 'Intermediate',
    duration: '12 hours',
    type: 'Documentation',
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
    reason: 'Authoritative specification reference for ES6+ modules, closures, and fetch APIs.',
  },
  {
    id: 'res_react_dev',
    title: 'React Official Interactive Learn Curriculum',
    provider: 'React.dev',
    topic: 'Modern React Hooks, State & Component Architecture',
    skillId: 'react',
    difficulty: 'Intermediate',
    duration: '16 hours',
    type: 'Documentation',
    url: 'https://react.dev/learn',
    reason: 'Directly closes the Frontend Architecture gap with interactive sandboxes on state, reducers, and effects.',
  },
  {
    id: 'res_node_learn',
    title: 'Node.js Official Getting Started & Event-Driven Architecture',
    provider: 'OpenJS Foundation (nodejs.org)',
    topic: 'Node.js Runtime, Streams & File System',
    skillId: 'nodejs',
    difficulty: 'Intermediate',
    duration: '14 hours',
    type: 'Documentation',
    url: 'https://nodejs.org/en/learn/getting-started/introduction-to-nodejs',
    reason: 'Essential foundation for building scalable server-side JavaScript services.',
  },
  {
    id: 'res_express_guide',
    title: 'Express.js Routing, Middleware & Error Handling Guide',
    provider: 'Express.js Official',
    topic: 'Express Server Architecture & Security Middleware',
    skillId: 'express',
    difficulty: 'Intermediate',
    duration: '10 hours',
    type: 'Documentation',
    url: 'https://expressjs.com/en/guide/routing.html',
    reason: 'Covers production middleware chains, request validation, and modular routing required for Full Stack roles.',
  },
  {
    id: 'res_rest_mdn',
    title: 'HTTP, RESTful API Design & Authentication Patterns',
    provider: 'MDN Web Docs',
    topic: 'REST APIs, Status Codes, CORS & Bearer Auth',
    skillId: 'rest_apis',
    difficulty: 'Intermediate',
    duration: '9 hours',
    type: 'Technical Article',
    url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview',
    reason: 'Bridges frontend React clients and backend Express controllers with standard HTTP contracts.',
  },
  {
    id: 'res_git_book',
    title: 'Pro Git Book — Branching, Rebasing & Pull Request Workflows',
    provider: 'Git-SCM Official',
    topic: 'Version Control & Collaborative Engineering',
    skillId: 'git_github',
    difficulty: 'Beginner',
    duration: '8 hours',
    type: 'Online Course',
    url: 'https://git-scm.com/book/en/v2',
    reason: 'Builds collaborative engineering habits required for every software engineering team.',
  },
  {
    id: 'res_python_docs',
    title: 'Python 3 Official Tutorial & Data Structures',
    provider: 'Python Software Foundation',
    topic: 'Advanced Python & Type Hints',
    skillId: 'python',
    difficulty: 'Intermediate',
    duration: '10 hours',
    type: 'Documentation',
    url: 'https://docs.python.org/3/tutorial/',
    reason: 'Reinforces Alex’s existing Python strength toward backend scripting and AI automation.',
  },
  {
    id: 'res_postgres_tut',
    title: 'PostgreSQL Official Documentation & Indexing Guide',
    provider: 'PostgreSQL Global Development Group',
    topic: 'Relational Schema Design, Joins & Query Tuning',
    skillId: 'sql',
    difficulty: 'Intermediate',
    duration: '11 hours',
    type: 'Documentation',
    url: 'https://www.postgresql.org/docs/current/tutorial.html',
    reason: 'Elevates existing SQL knowledge to production full-stack persistence and transaction isolation.',
  },
  {
    id: 'res_html_webdev',
    title: 'Learn HTML & Responsive CSS Layout Systems',
    provider: 'web.dev by Google',
    topic: 'Semantic HTML5, Accessibility & Flexbox/Grid',
    skillId: 'html_css',
    difficulty: 'Beginner',
    duration: '10 hours',
    type: 'Online Course',
    url: 'https://web.dev/learn/css',
    reason: 'Upgrades Alex’s Basic HTML (Level 2) into modern responsive CSS Grid, Flexbox, and WCAG accessibility.',
  },
  {
    id: 'res_owasp_top10',
    title: 'OWASP Top 10 Web Application Security Risks',
    provider: 'OWASP Foundation',
    topic: 'XSS, Injection Prevention & Zero-Trust Auth',
    skillId: 'cybersecurity',
    difficulty: 'Advanced',
    duration: '8 hours',
    type: 'Certification',
    url: 'https://owasp.org/www-project-top-ten/',
    reason: 'Essential security hardening reference for production full-stack and security engineers.',
  },
  {
    id: 'res_ml_crash',
    title: 'Machine Learning Crash Course with TensorFlow & Python',
    provider: 'Google for Developers',
    topic: 'Supervised Learning, Embeddings & Neural Nets',
    skillId: 'machine_learning',
    difficulty: 'Intermediate',
    duration: '15 hours',
    type: 'Online Course',
    url: 'https://developers.google.com/machine-learning/crash-course',
    reason: 'Interactive engineering curriculum for transitioning Python skills into AI/ML engineering.',
  },
];

export const ASSESSMENT_QUESTION_BANK: AssessmentQuestion[] = [
  // JavaScript
  {
    id: 'q_js_1',
    skillId: 'javascript',
    skillName: 'JavaScript (ES6+ & Async)',
    type: 'Multiple Choice',
    difficulty: 'Beginner',
    prompt: 'What is the output order when executing a resolved Promise.then() callback alongside a synchronous console.log() and a setTimeout(..., 0)?',
    options: [
      'Synchronous log -> Promise.then (Microtask) -> setTimeout (Macrotask)',
      'Synchronous log -> setTimeout (Macrotask) -> Promise.then (Microtask)',
      'Promise.then (Microtask) -> Synchronous log -> setTimeout (Macrotask)',
      'setTimeout (Macrotask) -> Synchronous log -> Promise.then (Microtask)',
    ],
    correctAnswer: 'Synchronous log -> Promise.then (Microtask) -> setTimeout (Macrotask)',
    explanation:
      'The JavaScript Event Loop executes the synchronous call stack first, then drains the Microtask Queue (Promise callbacks) completely before picking the next task from the Macrotask Queue (setTimeout).',
    remediationTip: 'Review Event Loop microtask vs. macrotask scheduling in JavaScript.info.',
  },
  {
    id: 'q_js_2',
    skillId: 'javascript',
    skillName: 'JavaScript (ES6+ & Async)',
    type: 'Coding',
    difficulty: 'Intermediate',
    prompt: 'Write an async JavaScript function `fetchUserSafely(url)` that uses `fetch`, checks `res.ok`, and returns parsed JSON via `await res.json()`.',
    starterCode: 'async function fetchUserSafely(url) {\n  // Implement fetch with res.ok check and await res.json()\n}',
    correctAnswer: 'async function fetchUserSafely(url) { const res = await fetch(url); if (!res.ok) throw new Error("Failed"); return await res.json(); }',
    requiredKeywords: ['async', 'await', 'fetch', '.json'],
    explanation: 'Using async/await with explicit HTTP status verification (`res.ok`) ensures rejected promises and HTTP 4xx/5xx responses are handled cleanly.',
    remediationTip: 'Practice async/await error boundaries and HTTP response handling.',
  },
  {
    id: 'q_js_3',
    skillId: 'javascript',
    skillName: 'JavaScript (ES6+ & Async)',
    type: 'Scenario',
    difficulty: 'Intermediate',
    prompt: 'In a search input handler firing on every keystroke, older network responses occasionally resolve AFTER newer ones, overwriting fresh results. Which pattern prevents this race condition?',
    options: [
      'AbortController signal cancellation + debouncing the input handler',
      'Replacing const with var inside the event listener',
      'Wrapping fetch inside a synchronous while loop',
      'Disabling JSON parsing on the server',
    ],
    correctAnswer: 'AbortController signal cancellation + debouncing the input handler',
    explanation: 'Passing an AbortController signal to `fetch(url, { signal })` cancels stale in-flight requests whenever a newer query is triggered.',
    remediationTip: 'Study AbortController and request cancellation patterns in modern ES6+.',
  },
  // React
  {
    id: 'q_react_1',
    skillId: 'react',
    skillName: 'React & State Architecture',
    type: 'Multiple Choice',
    difficulty: 'Intermediate',
    prompt: 'Why must state updates in React treat arrays and objects as immutable rather than mutating them in place (e.g. `items.push(newItem)`)?',
    options: [
      'React uses Object.is reference comparison to detect state changes and schedule re-renders',
      'JavaScript arrays cannot hold more than 10 elements in strict mode',
      'Mutating objects causes the browser DOM to delete CSS stylesheets',
      'React hooks only accept string primitives',
    ],
    correctAnswer: 'React uses Object.is reference comparison to detect state changes and schedule re-renders',
    explanation: 'If you mutate an existing object reference in place and pass the same reference to `setState`, `Object.is(prev, next)` returns true and React skips re-rendering.',
    remediationTip: 'Review "Updating Objects and Arrays in State" on react.dev.',
  },
  {
    id: 'q_react_2',
    skillId: 'react',
    skillName: 'React & State Architecture',
    type: 'Coding',
    difficulty: 'Intermediate',
    prompt: 'Write a functional React state update using `setSkills` that immutably increments the `proficiency` of a skill matching `targetId` using `.map()`.',
    starterCode: 'setSkills((prev) => \n  // Return a new array using prev.map(...)\n);',
    correctAnswer: 'setSkills((prev) => prev.map((s) => s.id === targetId ? { ...s, proficiency: s.proficiency + 1 } : s));',
    requiredKeywords: ['map', '...', 'proficiency'],
    explanation: 'Mapping over the previous state array and spreading `{ ...s, proficiency: s.proficiency + 1 }` produces a fresh object reference only for the updated item.',
    remediationTip: 'Practice immutable array transformations using `.map()` and `.filter()`.',
  },
  {
    id: 'q_react_3',
    skillId: 'react',
    skillName: 'React & State Architecture',
    type: 'Conceptual',
    difficulty: 'Advanced',
    prompt: 'When integrating a continuous 60fps Three.js WebGL canvas inside a React application, why should mutable frame state be kept in `useRef` instead of calling `useState` every frame?',
    options: [
      'Calling useState at 60Hz triggers full React component reconciliation every 16ms, starving the WebGL render loop',
      'useRef automatically uploads textures to a remote server',
      'useState cannot store numeric values in TypeScript',
      'Three.js requires class components to render geometries',
    ],
    correctAnswer: 'Calling useState at 60Hz triggers full React component reconciliation every 16ms, starving the WebGL render loop',
    explanation: 'Isolating the WebGL `<canvas>` in a stable `useRef` container and keeping per-frame kinematics out of React state prevents costly DOM reconciliation.',
    remediationTip: 'Explore React Escape Hatches and `useRef` lifecycle management.',
  },
  // Node.js & Express
  {
    id: 'q_node_1',
    skillId: 'nodejs',
    skillName: 'Node.js Runtime',
    type: 'Multiple Choice',
    difficulty: 'Intermediate',
    prompt: 'How does Node.js handle thousands of concurrent I/O connections on a single main JavaScript thread without blocking?',
    options: [
      'By delegating non-blocking asynchronous I/O operations to the libuv event loop and OS kernel',
      'By spawning a new operating system process for every incoming HTTP header',
      'By disabling garbage collection during network requests',
      'By compiling JavaScript directly into SQL stored procedures',
    ],
    correctAnswer: 'By delegating non-blocking asynchronous I/O operations to the libuv event loop and OS kernel',
    explanation: 'Node.js offloads network and file I/O to `libuv` and OS epoll/kqueue primitives, executing JavaScript callbacks on the main thread only when I/O completes.',
    remediationTip: 'Read the Node.js Event Loop and Timers guide on nodejs.org.',
  },
  {
    id: 'q_express_1',
    skillId: 'express',
    skillName: 'Express & Middleware',
    type: 'Coding',
    difficulty: 'Intermediate',
    prompt: 'Write an Express middleware function `requireAuth(req, res, next)` that checks `req.headers.authorization` and either calls `next()` or returns `res.status(401).json(...)`.',
    starterCode: 'function requireAuth(req, res, next) {\n  // Validate authorization header\n}',
    correctAnswer: 'function requireAuth(req, res, next) { if (!req.headers.authorization) return res.status(401).json({ error: "Unauthorized" }); next(); }',
    requiredKeywords: ['req', 'res', 'next', '401'],
    explanation: 'Express middleware functions must either terminate the request-response cycle (e.g. `res.status(401).json(...)`) or invoke `next()` to pass control downstream.',
    remediationTip: 'Review Express middleware execution order and error-handling middleware.',
  },
  // REST APIs
  {
    id: 'q_rest_1',
    skillId: 'rest_apis',
    skillName: 'RESTful APIs & Auth',
    type: 'Scenario',
    difficulty: 'Intermediate',
    prompt: 'A client submits a POST `/api/assessments` payload with a missing required `skillId` field. Which HTTP status code and response structure should the server return?',
    options: [
      '400 Bad Request with a structured JSON validation error describing the missing field',
      '200 OK with an empty HTML body',
      '500 Internal Server Error with the raw database stack trace',
      '301 Moved Permanently',
    ],
    correctAnswer: '400 Bad Request with a structured JSON validation error describing the missing field',
    explanation: '400 Bad Request (or 422 Unprocessable Entity) signals client-side validation failure without leaking internal stack traces.',
    remediationTip: 'Study HTTP status code semantics (2xx, 4xx, 5xx) and RESTful error envelopes.',
  },
  // Python & SQL & HTML & Git
  {
    id: 'q_py_1',
    skillId: 'python',
    skillName: 'Python Programming',
    type: 'Multiple Choice',
    difficulty: 'Intermediate',
    prompt: 'Which Python construct creates a memory-efficient lazy iterator rather than allocating a full list in memory at once?',
    options: [
      'A generator expression `(x * x for x in range(1000000))` or `yield` function',
      'A list comprehension `[x * x for x in range(1000000)]`',
      'A global dictionary copy',
      'A nested tuple multiplication',
    ],
    correctAnswer: 'A generator expression `(x * x for x in range(1000000))` or `yield` function',
    explanation: 'Generators compute values on-demand using the iterator protocol, keeping memory footprint O(1) regardless of stream length.',
    remediationTip: 'Review Python iterators, generators, and `itertools`.',
  },
  {
    id: 'q_sql_1',
    skillId: 'sql',
    skillName: 'SQL & Relational Modeling',
    type: 'Multiple Choice',
    difficulty: 'Intermediate',
    prompt: 'Which SQL clause filters aggregated groups AFTER `GROUP BY` has computed aggregate functions like `AVG(score)`?',
    options: ['HAVING', 'WHERE', 'ORDER BY', 'LIMIT'],
    correctAnswer: 'HAVING',
    explanation: '`WHERE` filters individual rows before grouping, whereas `HAVING` filters groups based on aggregate results like `HAVING AVG(score) < 60`.',
    remediationTip: 'Practice SQL query execution order: FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY.',
  },
  {
    id: 'q_html_1',
    skillId: 'html_css',
    skillName: 'HTML5 & Modern CSS',
    type: 'Multiple Choice',
    difficulty: 'Beginner',
    prompt: 'Why should interactive buttons use native `<button>` elements rather than `<div onClick={...}>`?',
    options: [
      'Native <button> provides built-in keyboard navigation (Enter/Space), focusability, and screen-reader role semantics',
      '<div> tags cannot be styled with Tailwind CSS',
      '<button> elements automatically encrypt network traffic',
      '<div> tags are deprecated in HTML5',
    ],
    correctAnswer: 'Native <button> provides built-in keyboard navigation (Enter/Space), focusability, and screen-reader role semantics',
    explanation: 'Accessible HTML relies on native interactive elements so assistive technologies and keyboard users can navigate seamlessly.',
    remediationTip: 'Review WCAG 2.2 keyboard accessibility and semantic HTML landmarks.',
  },
  {
    id: 'q_git_1',
    skillId: 'git_github',
    skillName: 'Git & GitHub Workflows',
    type: 'Multiple Choice',
    difficulty: 'Beginner',
    prompt: 'What is the safest Git workflow before integrating a feature branch into `main` in a collaborative repository?',
    options: [
      'Open a Pull Request, run automated CI/lint/test checks, and complete peer code review before merging',
      'Run git push --force directly to main without pulling',
      'Delete the .git folder and re-initialize the repository',
      'Commit node_modules and .env secrets directly to main',
    ],
    correctAnswer: 'Open a Pull Request, run automated CI/lint/test checks, and complete peer code review before merging',
    explanation: 'Pull Requests with automated CI gates protect `main` from regressions and secret leaks.',
    remediationTip: 'Read Chapter 5 (Distributed Git) of the Pro Git Book.',
  },
];

export function createAlexDemoSkills(): SkillNode[] {
  return [
    {
      id: 'python',
      name: 'Python Programming',
      category: 'Language',
      proficiency: 4,
      initialProficiency: 3,
      targetProficiency: 4,
      confidence: 88,
      status: 'mastered',
      evidence: [
        'Completed University Data Scripting Capstone (Grade: A)',
        'Scored 92% on Python Data Structures & Generators Diagnostic',
      ],
      lastScore: 92,
      prerequisites: [],
      orbitRadius: 7.5,
      orbitAngle: 0.2,
      heightOffset: 1.1,
    },
    {
      id: 'sql',
      name: 'SQL & Relational Modeling',
      category: 'Database',
      proficiency: 4,
      initialProficiency: 3,
      targetProficiency: 4,
      confidence: 84,
      status: 'mastered',
      evidence: [
        'Built Normalized University Library Inventory Schema in PostgreSQL',
        'Scored 86% on SQL Joins, Indexing & Aggregations Evaluation',
      ],
      lastScore: 86,
      prerequisites: [],
      orbitRadius: 8.2,
      orbitAngle: 1.1,
      heightOffset: -0.6,
    },
    {
      id: 'html_css',
      name: 'HTML5 & Modern CSS',
      category: 'Frontend',
      proficiency: 2,
      initialProficiency: 2,
      targetProficiency: 4,
      confidence: 58,
      status: 'weak',
      evidence: [
        'Built static personal portfolio page using basic HTML5 tags',
        'Needs mastery in responsive CSS Grid, Flexbox, and WCAG accessibility',
      ],
      lastScore: 64,
      prerequisites: [],
      orbitRadius: 9.0,
      orbitAngle: 2.0,
      heightOffset: 0.8,
    },
    {
      id: 'javascript',
      name: 'JavaScript (ES6+ & Async)',
      category: 'Language',
      proficiency: 1,
      initialProficiency: 0,
      targetProficiency: 4,
      confidence: 35,
      status: 'weak',
      evidence: [
        'Initial diagnostic score: 45% (Beginner familiarity with variables; gaps in Closures, Promises, and Async/Await)',
      ],
      lastScore: 45,
      prerequisites: ['html_css'],
      orbitRadius: 10.2,
      orbitAngle: 2.9,
      heightOffset: -0.9,
    },
    {
      id: 'react',
      name: 'React & State Architecture',
      category: 'Frontend',
      proficiency: 0,
      initialProficiency: 0,
      targetProficiency: 4,
      confidence: 15,
      status: 'missing',
      evidence: ['No verified project or assessment evidence yet — Critical Full Stack requirement'],
      prerequisites: ['javascript', 'html_css'],
      orbitRadius: 11.4,
      orbitAngle: 3.7,
      heightOffset: 1.4,
    },
    {
      id: 'nodejs',
      name: 'Node.js Runtime',
      category: 'Backend',
      proficiency: 0,
      initialProficiency: 0,
      targetProficiency: 4,
      confidence: 12,
      status: 'missing',
      evidence: ['No verified project or assessment evidence yet — Critical Full Stack requirement'],
      prerequisites: ['javascript'],
      orbitRadius: 12.2,
      orbitAngle: 4.5,
      heightOffset: -1.2,
    },
    {
      id: 'express',
      name: 'Express & Middleware',
      category: 'Backend',
      proficiency: 0,
      initialProficiency: 0,
      targetProficiency: 3,
      confidence: 10,
      status: 'missing',
      evidence: ['No verified project or assessment evidence yet — Required for Phase 4 Backend APIs'],
      prerequisites: ['nodejs'],
      orbitRadius: 13.0,
      orbitAngle: 5.2,
      heightOffset: 0.5,
    },
    {
      id: 'rest_apis',
      name: 'RESTful APIs & Auth',
      category: 'Backend',
      proficiency: 0,
      initialProficiency: 0,
      targetProficiency: 4,
      confidence: 18,
      status: 'missing',
      evidence: ['No verified project or assessment evidence yet — Required for Frontend-Backend integration'],
      prerequisites: ['express', 'sql'],
      orbitRadius: 13.8,
      orbitAngle: 5.9,
      heightOffset: -0.4,
    },
    {
      id: 'git_github',
      name: 'Git & GitHub Workflows',
      category: 'DevOps & Cloud',
      proficiency: 1,
      initialProficiency: 1,
      targetProficiency: 3,
      confidence: 42,
      status: 'weak',
      evidence: ['Basic local commits verified; missing Pull Request, branching, and CI workflow experience'],
      lastScore: 55,
      prerequisites: [],
      orbitRadius: 9.6,
      orbitAngle: 0.7,
      heightOffset: -1.5,
    },
    {
      id: 'cybersecurity',
      name: 'AppSec & Zero-Trust Security',
      category: 'Architecture & Soft Skills',
      proficiency: 1,
      initialProficiency: 1,
      targetProficiency: 3,
      confidence: 40,
      status: 'weak',
      evidence: ['Understands SQL parameterized queries; needs XSS/CSRF and RBAC rule hardening'],
      prerequisites: ['rest_apis'],
      orbitRadius: 14.4,
      orbitAngle: 1.6,
      heightOffset: 1.6,
    },
    {
      id: 'machine_learning',
      name: 'Machine Learning & LLMs',
      category: 'AI & Data',
      proficiency: 2,
      initialProficiency: 1,
      targetProficiency: 3,
      confidence: 52,
      status: 'weak',
      evidence: ['Built basic Python linear regression script; exploring Gemini API structured outputs'],
      prerequisites: ['python'],
      orbitRadius: 14.8,
      orbitAngle: 2.5,
      heightOffset: -1.4,
    },
  ];
}

export function analyzeCareerCompatibility(
  skills: SkillNode[],
  career: CareerRole
): CareerMatchAnalysis {
  const skillMap = new Map<string, SkillNode>(skills.map((s) => [s.id, s]));

  let totalWeight = 0;
  let earnedWeightedScore = 0;

  const masteredSkills: SkillNode[] = [];
  const partiallyDevelopedSkills: SkillNode[] = [];
  const missingSkills: SkillNode[] = [];
  const criticalGaps: SkillNode[] = [];
  const recommendedPriorityOrder: CareerMatchAnalysis['recommendedPriorityOrder'] = [];

  for (const req of career.requiredTechnicalSkills) {
    totalWeight += req.weight;
    const learnerSkill = skillMap.get(req.skillId) || {
      id: req.skillId,
      name: req.skillName,
      category: req.category,
      proficiency: 0 as ProficiencyScale,
      initialProficiency: 0 as ProficiencyScale,
      targetProficiency: req.requiredLevel,
      confidence: 0,
      status: 'missing' as SkillStatus,
      evidence: ['Unexplored skill required for ' + career.title],
      prerequisites: [],
      orbitRadius: 12,
      orbitAngle: 0,
      heightOffset: 0,
    };

    const ratio = Math.min(1, learnerSkill.proficiency / Math.max(1, req.requiredLevel));
    earnedWeightedScore += ratio * req.weight;

    if (learnerSkill.proficiency >= req.requiredLevel) {
      masteredSkills.push(learnerSkill);
    } else if (learnerSkill.proficiency > 0) {
      partiallyDevelopedSkills.push(learnerSkill);
      if (req.isCritical && req.requiredLevel - learnerSkill.proficiency >= 2) {
        criticalGaps.push(learnerSkill);
      }
    } else {
      missingSkills.push(learnerSkill);
      if (req.isCritical) {
        criticalGaps.push(learnerSkill);
      }
    }

    if (learnerSkill.proficiency < req.requiredLevel) {
      const gap = req.requiredLevel - learnerSkill.proficiency;
      const priorityScore = gap * req.weight * (req.isCritical ? 1.5 : 1.0);
      recommendedPriorityOrder.push({
        skillId: req.skillId,
        skillName: req.skillName,
        currentLevel: learnerSkill.proficiency,
        requiredLevel: req.requiredLevel,
        priorityScore: Math.round(priorityScore),
        reason: req.isCritical
          ? `Critical core requirement for ${career.title} (Current: ${learnerSkill.proficiency}/5, Target: ${req.requiredLevel}/5)`
          : `Supporting competency for ${career.title} (+${gap} proficiency levels needed)`,
      });
    }
  }

  recommendedPriorityOrder.sort((a, b) => b.priorityScore - a.priorityScore);

  const compatibilityScore = totalWeight > 0 ? Math.round((earnedWeightedScore / totalWeight) * 100) : 0;

  let readinessLevel: CareerMatchAnalysis['readinessLevel'] = 'Early Explorer';
  if (compatibilityScore >= 85) readinessLevel = 'Career Ready';
  else if (compatibilityScore >= 65) readinessLevel = 'Implementation Ready';
  else if (compatibilityScore >= 35) readinessLevel = 'Developing Contender';

  const masteredNames = masteredSkills.map((s) => s.name).join(', ') || 'None yet';
  const gapNames = criticalGaps.map((s) => s.name).join(', ') || 'No critical gaps remaining';

  const scoreExplanation = `Your ${compatibilityScore}% compatibility with ${career.title} is weighted across ${career.requiredTechnicalSkills.length} role-verified competencies. You have strong evidence in [${masteredNames}], which contributes ${Math.round(earnedWeightedScore)}/${totalWeight} weighted readiness points. To reach Career Readiness (85%+), prioritize closing critical gaps in [${gapNames}].`;

  return {
    careerId: career.id,
    careerTitle: career.title,
    compatibilityScore,
    readinessLevel,
    masteredSkills,
    partiallyDevelopedSkills,
    missingSkills,
    criticalGaps,
    recommendedPriorityOrder,
    scoreExplanation,
  };
}

export function createAlexEightPhaseRoadmap(): RoadmapMilestone[] {
  return [
    {
      id: 'phase_1_js_fund',
      phaseNumber: 1,
      category: 'Foundation',
      title: 'Phase 1: JavaScript Fundamentals & DOM Architecture',
      objective: 'Transition from Python syntax to ES6+ lexical scoping, closures, array methods, and semantic DOM manipulation.',
      skillId: 'javascript',
      skillName: 'JavaScript (ES6+ & Async)',
      estimatedHours: 14,
      loggedHours: 6,
      status: 'in_progress',
      lessons: [
        { id: 'l_1_1', title: 'ES6+ Block Scoping, Destructuring & Spread Operators', durationMinutes: 55, completed: true },
        { id: 'l_1_2', title: 'Higher-Order Array Transformations (map, filter, reduce)', durationMinutes: 65, completed: true },
        { id: 'l_1_3', title: 'Lexical Closures, Hoisting & Execution Contexts', durationMinutes: 75, completed: false },
        { id: 'l_1_4', title: 'Semantic HTML5 & Event Delegation Patterns', durationMinutes: 60, completed: false },
      ],
      exercises: [
        {
          id: 'ex_1_1',
          title: 'Immutable Data Pipeline Transformer',
          prompt: 'Transform an array of learner skill records into a grouped summary map using `.filter()` and `.reduce()` without mutating inputs.',
          completed: true,
          submission: 'const summary = skills.filter(s => s.proficiency > 0).reduce((acc, s) => ({ ...acc, [s.id]: s.proficiency }), {});',
        },
      ],
      miniProject: {
        title: 'Interactive Skill Matrix Filter Engine',
        deliverable: 'Vanilla ES6+ module with live search, keyboard shortcuts, and zero global variables.',
        completed: false,
      },
      assessmentId: 'javascript',
      completionCriteria: 'Complete all 4 lessons and score >= 70% on the JavaScript Assessment.',
    },
    {
      id: 'phase_2_js_async',
      phaseNumber: 2,
      category: 'Core Concepts',
      title: 'Phase 2: Advanced JavaScript & Asynchronous Programming',
      objective: 'Master the Event Loop, Microtask vs. Macrotask queues, Promises, async/await error boundaries, and AbortController.',
      skillId: 'javascript',
      skillName: 'JavaScript (ES6+ & Async)',
      estimatedHours: 12,
      loggedHours: 0,
      status: 'unlocked',
      lessons: [
        { id: 'l_2_1', title: 'The Event Loop: Call Stack, Microtasks & Task Queue', durationMinutes: 60, completed: false },
        { id: 'l_2_2', title: 'Promise Combinators (Promise.all, allSettled, race)', durationMinutes: 65, completed: false },
        { id: 'l_2_3', title: 'Async/Await Error Boundaries & AbortController Cancellation', durationMinutes: 70, completed: false },
      ],
      exercises: [
        {
          id: 'ex_2_1',
          title: 'Resilient Fetch Utility with Exponential Backoff',
          prompt: 'Implement an async wrapper that retries failed HTTP 503 requests up to 3 times with AbortController timeout support.',
          completed: false,
        },
      ],
      miniProject: {
        title: 'Concurrent Telemetry Poller & Cache',
        deliverable: 'Asynchronous data fetcher that deduplicates concurrent requests and cancels stale queries.',
        completed: false,
      },
      assessmentId: 'javascript',
      completionCriteria: 'Score >= 80% on the JavaScript Assessment including async coding & race-condition scenarios.',
    },
    {
      id: 'phase_3_react',
      phaseNumber: 3,
      category: 'Intermediate Development',
      title: 'Phase 3: React & Modern Frontend Development',
      objective: 'Build modular, accessible component hierarchies with hooks, immutable state architecture, and responsive Tailwind CSS.',
      skillId: 'react',
      skillName: 'React & State Architecture',
      estimatedHours: 20,
      loggedHours: 0,
      status: 'unlocked',
      lessons: [
        { id: 'l_3_1', title: 'Declarative UI, JSX & Unidirectional Data Flow', durationMinutes: 60, completed: false },
        { id: 'l_3_2', title: 'Immutable State Architecture with useState & useReducer', durationMinutes: 75, completed: false },
        { id: 'l_3_3', title: 'Synchronizing External Systems with useEffect & useRef', durationMinutes: 80, completed: false },
        { id: 'l_3_4', title: 'Custom Hooks, Context Performance & Accessible Forms', durationMinutes: 70, completed: false },
      ],
      exercises: [
        {
          id: 'ex_3_1',
          title: 'Accessible Multi-Step Onboarding Hook',
          prompt: 'Create a custom hook `useStepWizard` with validation guards and keyboard navigation.',
          completed: false,
        },
      ],
      miniProject: {
        title: 'Real-Time Skill Constellation Dashboard in React',
        deliverable: 'Interactive React SPA with live client-side filtering, accessible modals, and persistent state.',
        completed: false,
      },
      assessmentId: 'react',
      completionCriteria: 'Complete the React mini-project and achieve >= 80% on the React Architecture Assessment.',
    },
    {
      id: 'phase_4_node_express',
      phaseNumber: 4,
      category: 'Intermediate Development',
      title: 'Phase 4: Node.js & Express Server Engineering',
      objective: 'Architect non-blocking Node.js services, Express middleware pipelines, request validation, and structured logging.',
      skillId: 'nodejs',
      skillName: 'Node.js Runtime',
      estimatedHours: 16,
      loggedHours: 0,
      status: 'locked',
      lessons: [
        { id: 'l_4_1', title: 'Node.js Streams, Buffers & Module Resolution', durationMinutes: 60, completed: false },
        { id: 'l_4_2', title: 'Express Routing, Controllers & Middleware Chains', durationMinutes: 70, completed: false },
        { id: 'l_4_3', title: 'Centralized Error Handling & Rate Limiting', durationMinutes: 65, completed: false },
      ],
      exercises: [
        {
          id: 'ex_4_1',
          title: 'Zero-Trust Request Validator & Auth Guard Middleware',
          prompt: 'Write an Express middleware that validates request schemas and enforces Bearer token authentication.',
          completed: false,
        },
      ],
      miniProject: {
        title: 'Modular Express Learning Microservice',
        deliverable: 'TypeScript Express server with health checks, rate limiting, and unit-tested route handlers.',
        completed: false,
      },
      assessmentId: 'nodejs',
      completionCriteria: 'Pass both Node.js and Express assessments with >= 75% accuracy.',
    },
    {
      id: 'phase_5_rest_apis',
      phaseNumber: 5,
      category: 'Advanced Development',
      title: 'Phase 5: REST APIs & Backend Architecture',
      objective: 'Design idempotent RESTful endpoints, pagination, HTTP status semantics, CORS policies, and OpenAPI contracts.',
      skillId: 'rest_apis',
      skillName: 'RESTful APIs & Auth',
      estimatedHours: 14,
      loggedHours: 0,
      status: 'locked',
      lessons: [
        { id: 'l_5_1', title: 'RESTful Resource Modeling, Idempotency & Status Codes', durationMinutes: 60, completed: false },
        { id: 'l_5_2', title: 'Bearer Authentication, OAuth 2.0 Flows & CORS Hardening', durationMinutes: 75, completed: false },
        { id: 'l_5_3', title: 'Cursor Pagination, Filtering & Rate-Limit Headers', durationMinutes: 65, completed: false },
      ],
      exercises: [
        {
          id: 'ex_5_1',
          title: 'Idempotent Assessment Submission Endpoint',
          prompt: 'Design a POST `/api/assessments/submit` contract that prevents duplicate grading using idempotency keys.',
          completed: false,
        },
      ],
      miniProject: {
        title: 'Secure Career Intelligence REST API',
        deliverable: 'Full CRUD + Analytical REST API with 100% schema validation and integration tests.',
        completed: false,
      },
      assessmentId: 'rest_apis',
      completionCriteria: 'Score >= 80% on RESTful API Design & Security Assessment.',
    },
    {
      id: 'phase_6_db_auth',
      phaseNumber: 6,
      category: 'Advanced Development',
      title: 'Phase 6: Database Integration & Zero-Trust Authentication',
      objective: 'Connect Alex’s existing SQL & Python strengths to Node.js/Firestore with transactional integrity and ABAC security rules.',
      skillId: 'sql',
      skillName: 'SQL & Relational Modeling',
      estimatedHours: 14,
      loggedHours: 4,
      status: 'unlocked',
      lessons: [
        { id: 'l_6_1', title: 'Connection Pooling, Parameterized Queries & SQL Injection Defense', durationMinutes: 60, completed: true },
        { id: 'l_6_2', title: 'ACID Transactions, Indexing & Query Execution Plans', durationMinutes: 70, completed: false },
        { id: 'l_6_3', title: 'Zero-Trust Firestore Security Rules & Multi-Factor Auth', durationMinutes: 65, completed: false },
      ],
      exercises: [
        {
          id: 'ex_6_1',
          title: 'Relational vs. Document Schema Migration',
          prompt: 'Write a transactional query that atomically updates a learner’s skill score and inserts an audit log row.',
          completed: false,
        },
      ],
      miniProject: {
        title: 'Multi-Role Persistence Layer with Audit Logging',
        deliverable: 'Isolated user data store with automated security rule verification tests.',
        completed: false,
      },
      assessmentId: 'sql',
      completionCriteria: 'Complete all database security exercises and maintain >= 85% SQL proficiency.',
    },
    {
      id: 'phase_7_fullstack_capstone',
      phaseNumber: 7,
      category: 'Practical Implementation',
      title: 'Phase 7: End-to-End Full-Stack Project Development',
      objective: 'Synthesize React, Node.js, Express, REST APIs, and SQL/Firestore into a production-grade full-stack application.',
      skillId: 'react',
      skillName: 'React & State Architecture',
      estimatedHours: 24,
      loggedHours: 0,
      status: 'locked',
      lessons: [
        { id: 'l_7_1', title: 'Full-Stack Monorepo Type Sharing (Client <-> Server)', durationMinutes: 75, completed: false },
        { id: 'l_7_2', title: 'Optimistic UI Updates, Caching & Error Recovery', durationMinutes: 80, completed: false },
        { id: 'l_7_3', title: 'End-to-End Automated Testing with Node Test Runner & Playwright', durationMinutes: 85, completed: false },
      ],
      exercises: [
        {
          id: 'ex_7_1',
          title: 'Full-Stack Feature Vertical Slice',
          prompt: 'Wire a React form through an Express API endpoint into persistent storage with full validation.',
          completed: false,
        },
      ],
      miniProject: {
        title: 'Full-Stack AI Collaborative Learning Workspace',
        deliverable: 'Deployed full-stack application with authentication, real-time analytics, and test suite.',
        completed: false,
      },
      assessmentId: 'react',
      completionCriteria: 'Submit full-stack capstone project and pass all unit/integration checks.',
    },
    {
      id: 'phase_8_deployment_career',
      phaseNumber: 8,
      category: 'Career Readiness',
      title: 'Phase 8: Cloud Deployment, Git Workflows & Career Readiness',
      objective: 'Master Git/GitHub PR workflows, containerized Cloud Run deployment, technical system design interviews, and portfolio defense.',
      skillId: 'git_github',
      skillName: 'Git & GitHub Workflows',
      estimatedHours: 12,
      loggedHours: 0,
      status: 'locked',
      lessons: [
        { id: 'l_8_1', title: 'Git Branching Strategies, Interactive Rebase & CI Pipelines', durationMinutes: 60, completed: false },
        { id: 'l_8_2', title: 'Production Builds, Environment Security & Cloud Deployment', durationMinutes: 65, completed: false },
        { id: 'l_8_3', title: 'Full-Stack System Design & Behavioral Architecture Review', durationMinutes: 70, completed: false },
      ],
      exercises: [
        {
          id: 'ex_8_1',
          title: 'Production Readiness & Security Checklist Audit',
          prompt: 'Audit a full-stack repo for secret hygiene, CSP headers, and build reproducibility.',
          completed: false,
        },
      ],
      miniProject: {
        title: 'Verified Full-Stack Engineering Portfolio & Live Demo',
        deliverable: 'Publicly verifiable engineering portfolio with architecture diagrams and live deployment.',
        completed: false,
      },
      assessmentId: 'git_github',
      completionCriteria: 'Reach >= 85% overall Full Stack Developer Career Readiness Score.',
    },
  ];
}

export function generateAdaptiveRoadmap(
  skills: SkillNode[],
  career: CareerRole,
  weeklyHours: number
): RoadmapMilestone[] {
  // If career is Full Stack and matches Alex's baseline, start with the 8-phase roadmap and adapt statuses to current skill levels
  if (career.id === 'fullstack') {
    const base = createAlexEightPhaseRoadmap();
    const skillMap = new Map(skills.map((s) => [s.id, s]));
    return base.map((phase) => {
      const s = skillMap.get(phase.skillId);
      if (!s) return phase;
      if (s.status === 'revision') {
        return {
          ...phase,
          status: 'revision_required',
          adaptiveNote: `Adapted by Learning Architect Agent: Recent assessment score (${s.lastScore ?? 0}%) triggered targeted fundamentals revision.`,
        };
      }
      if (s.proficiency >= 4 && phase.phaseNumber <= 6) {
        return {
          ...phase,
          status: 'completed',
          loggedHours: phase.estimatedHours,
          lessons: phase.lessons.map((l) => ({ ...l, completed: true })),
          adaptiveNote: `Verified Mastery (${s.proficiency}/5): Phase accelerated by Progress Intelligence Agent.`,
        };
      }
      return phase;
    });
  }

  // Dynamic personalized generation for any other selected or custom career
  const analysis = analyzeCareerCompatibility(skills, career);
  const categories: RoadmapPhaseCategory[] = [
    'Foundation',
    'Core Concepts',
    'Intermediate Development',
    'Advanced Development',
    'Practical Implementation',
    'Career Readiness',
  ];

  const orderedGaps =
    analysis.recommendedPriorityOrder.length > 0
      ? analysis.recommendedPriorityOrder
      : career.requiredTechnicalSkills.map((req) => ({
          skillId: req.skillId,
          skillName: req.skillName,
          currentLevel: 3 as ProficiencyScale,
          requiredLevel: req.requiredLevel,
          priorityScore: req.weight,
          reason: `Core mastery reinforcement for ${career.title}`,
        }));

  const phases: RoadmapMilestone[] = [];
  const totalPhases = Math.max(6, Math.min(8, orderedGaps.length + 2));

  for (let i = 0; i < totalPhases; i++) {
    const gapItem = orderedGaps[i % orderedGaps.length];
    const category = categories[Math.min(categories.length - 1, Math.floor((i / totalPhases) * categories.length))];
    const hours = Math.max(8, Math.round((14 * 12) / Math.max(6, weeklyHours)));

    phases.push({
      id: `phase_${career.id}_${i + 1}`,
      phaseNumber: i + 1,
      category,
      title: `Phase ${i + 1}: ${gapItem.skillName} — ${category}`,
      objective: `${gapItem.reason}. Elevate proficiency from ${gapItem.currentLevel}/5 to ${gapItem.requiredLevel}/5 for ${career.title}.`,
      skillId: gapItem.skillId,
      skillName: gapItem.skillName,
      estimatedHours: hours,
      loggedHours: i === 0 ? 2 : 0,
      status: i === 0 ? 'in_progress' : i === 1 ? 'unlocked' : 'locked',
      lessons: [
        {
          id: `l_${career.id}_${i}_1`,
          title: `${gapItem.skillName}: Core Mental Models & Architecture`,
          durationMinutes: 60,
          completed: i === 0,
        },
        {
          id: `l_${career.id}_${i}_2`,
          title: `Applied ${gapItem.skillName} Patterns for ${career.title}`,
          durationMinutes: 75,
          completed: false,
        },
        {
          id: `l_${career.id}_${i}_3`,
          title: `Production Debugging, Security & Edge Cases in ${gapItem.skillName}`,
          durationMinutes: 65,
          completed: false,
        },
      ],
      exercises: [
        {
          id: `ex_${career.id}_${i}_1`,
          title: `${gapItem.skillName} Practical Verification Lab`,
          prompt: `Implement a production-grade ${gapItem.skillName} solution aligned with ${career.title} requirements.`,
          completed: false,
        },
      ],
      miniProject: {
        title: `${career.title} Milestone Deliverable #${i + 1}`,
        deliverable: `Verified ${gapItem.skillName} module with unit tests and architectural documentation.`,
        completed: false,
      },
      assessmentId: gapItem.skillId,
      completionCriteria: `Complete all lessons and achieve >= 80% on the ${gapItem.skillName} assessment.`,
    });
  }

  return phases;
}

export function evaluateAssessmentSubmission(
  skill: SkillNode,
  questions: AssessmentQuestion[],
  answers: Record<string, string>,
  currentRoadmap: RoadmapMilestone[]
): {
  result: AssessmentSubmissionResult;
  updatedSkill: SkillNode;
  updatedRoadmap: RoadmapMilestone[];
} {
  let totalPoints = 0;
  const strengthsIdentified: string[] = [];
  const areasRequiringImprovement: string[] = [];

  const questionBreakdown = questions.map((q) => {
    const rawAnswer = (answers[q.id] || '').trim();
    let isCorrect = false;
    let scoreAwarded = 0;
    let mistakeAnalysis: string | undefined;

    if (q.type === 'Coding') {
      const keywords = q.requiredKeywords || [];
      const matched = keywords.filter((kw) => rawAnswer.toLowerCase().includes(kw.toLowerCase()));
      const ratio = keywords.length > 0 ? matched.length / keywords.length : rawAnswer.length > 15 ? 1 : 0;
      if (ratio >= 0.75) {
        isCorrect = true;
        scoreAwarded = 100;
      } else if (ratio >= 0.4) {
        isCorrect = false;
        scoreAwarded = 50;
        mistakeAnalysis = `Partial solution: included [${matched.join(', ')}], but missed key constructs [${keywords
          .filter((k) => !matched.includes(k))
          .join(', ')}].`;
      } else {
        isCorrect = false;
        scoreAwarded = 0;
        mistakeAnalysis = `Code submission lacked required constructs (${keywords.join(', ')}).`;
      }
    } else {
      isCorrect = rawAnswer.toLowerCase() === q.correctAnswer.trim().toLowerCase();
      scoreAwarded = isCorrect ? 100 : 0;
      if (!isCorrect) {
        mistakeAnalysis = rawAnswer
          ? `Selected "${rawAnswer}" instead of "${q.correctAnswer}". ${q.remediationTip}`
          : `No answer provided. ${q.remediationTip}`;
      }
    }

    totalPoints += scoreAwarded;
    if (isCorrect) {
      strengthsIdentified.push(`${q.type} mastery verified: ${q.prompt.slice(0, 68)}...`);
    } else {
      areasRequiringImprovement.push(`${q.type} gap: ${q.remediationTip}`);
    }

    return {
      questionId: q.id,
      prompt: q.prompt,
      type: q.type,
      learnerAnswer: rawAnswer || '(No response)',
      correctAnswer: q.correctAnswer,
      isCorrect,
      scoreAwarded,
      explanation: q.explanation,
      mistakeAnalysis,
    };
  });

  const scorePercentage = questions.length > 0 ? Math.round(totalPoints / questions.length) : 0;

  let newProficiency: ProficiencyScale = skill.proficiency;
  let newStatus: SkillStatus = skill.status;
  let learningPaceAssigned: LearningPaceMode = 'Applied Practice (Hands-On)';
  let recommendedDifficulty: 'Beginner' | 'Intermediate' | 'Advanced' = 'Intermediate';
  let xpEarned = 50;
  let nextRecommendedAction = '';
  let roadmapAdapted = false;
  let adaptationSummary = '';

  if (scorePercentage >= 80) {
    newProficiency = Math.min(5, Math.max(skill.proficiency + 1, 4)) as ProficiencyScale;
    newStatus = 'mastered';
    learningPaceAssigned = 'Accelerated Mastery (Fast-Track)';
    recommendedDifficulty = 'Advanced';
    xpEarned = 150;
    nextRecommendedAction = `Excellent performance (${scorePercentage}%)! Learning process switched to Accelerated Mastery (Fast-Track) — ${skill.name} is illuminated in the 3D Skill Universe and advanced system-design modules are unlocked.`;
    roadmapAdapted = true;
    adaptationSummary = `Progress Intelligence Agent switched ${skill.name} to Accelerated Mastery mode (+${xpEarned} XP), marked foundational lessons complete, and unlocked downstream prerequisites.`;
  } else if (scorePercentage >= 60) {
    newProficiency = Math.max(skill.proficiency, 2) as ProficiencyScale;
    newStatus = 'weak';
    learningPaceAssigned = 'Applied Practice (Hands-On)';
    recommendedDifficulty = 'Intermediate';
    xpEarned = 85;
    nextRecommendedAction = `Solid progress (${scorePercentage}%). Learning process calibrated to Applied Practice Mode — focus on hands-on coding exercises and the mini-project to reach Level 4 Mastery.`;
    roadmapAdapted = true;
    adaptationSummary = `Skill proficiency updated to ${getProficiencyLabel(newProficiency)} (+${xpEarned} XP). Calibrated curriculum to Intermediate Applied Coding labs.`;
  } else {
    newProficiency = Math.max(1, skill.proficiency) as ProficiencyScale;
    newStatus = 'revision';
    learningPaceAssigned = 'Guided Foundations (Step-by-Step)';
    recommendedDifficulty = 'Beginner';
    xpEarned = 40;
    nextRecommendedAction = `Diagnostic Alert (${scorePercentage}%): Learning Architect Agent switched your learning process to Guided Foundations (Step-by-Step) Mode with visual analogies, bite-sized Skill Reels, and a remedial walkthrough for ${skill.name}.`;
    roadmapAdapted = true;
    adaptationSummary = `Triggered Guided Foundations Protocol for ${skill.name} (+${xpEarned} Effort XP): lowered complexity to Beginner, injected a Step-by-Step Visual Mental Model walkthrough, and flagged phase for guided revision.`;
  }

  const newEvidence = `${skill.name} Assessment Completed (${scorePercentage}% score · ${learningPaceAssigned} on ${new Date().toLocaleDateString()})`;
  const updatedSkill: SkillNode = {
    ...skill,
    proficiency: newProficiency,
    confidence: Math.min(98, Math.max(25, Math.round(scorePercentage * 0.92))),
    status: newStatus,
    lastScore: scorePercentage,
    learningPaceMode: learningPaceAssigned,
    recommendedDifficulty,
    evidence: [newEvidence, ...skill.evidence.filter((e) => !e.startsWith('Unassessed')).slice(0, 3)],
  };

  let unlockedNext = false;
  const updatedRoadmap = currentRoadmap.map((phase) => {
    if (phase.skillId === skill.id) {
      if (scorePercentage >= 80) {
        unlockedNext = true;
        return {
          ...phase,
          status: 'completed' as const,
          loggedHours: Math.max(phase.loggedHours, phase.estimatedHours),
          lessons: phase.lessons.map((l) => ({ ...l, completed: true })),
          adaptiveNote: `Completed via ${scorePercentage}% Assessment Mastery (${learningPaceAssigned}). Advanced material unlocked.`,
        };
      }
      if (scorePercentage < 60) {
        const remedialId = `rem_${phase.id}`;
        const hasRemedial = phase.lessons.some((l) => l.id === remedialId);
        const adaptedLessons = hasRemedial
          ? phase.lessons
          : [
              {
                id: remedialId,
                title: `[Guided Step-by-Step Remediation] ${skill.name} Visual Mental Models & First Principles`,
                durationMinutes: 25,
                completed: false,
              },
              ...phase.lessons,
            ];
        return {
          ...phase,
          status: 'revision_required' as const,
          lessons: adaptedLessons,
          adaptiveNote: `Adaptive Remediation Active (${scorePercentage}% score · ${learningPaceAssigned}): Added step-by-step foundational walkthrough for ${
            areasRequiringImprovement[0] || 'core concepts'
          }.`,
        };
      }
      return {
        ...phase,
        adaptiveNote: `Calibrated to ${learningPaceAssigned} (${scorePercentage}% test score). Complete hands-on coding exercises next.`,
      };
    } else if (unlockedNext && phase.status === 'locked') {
      unlockedNext = false;
      return {
        ...phase,
        status: 'unlocked' as const,
        adaptiveNote: `Unlocked early by Progress Intelligence Agent after mastering ${skill.name}.`,
      };
    }
    return phase;
  });

  const result: AssessmentSubmissionResult = {
    id: `sub_${Date.now()}`,
    skillId: skill.id,
    skillName: skill.name,
    timestamp: new Date().toISOString(),
    scorePercentage,
    previousProficiency: skill.proficiency,
    newProficiency,
    previousStatus: skill.status,
    newStatus,
    learningPaceAssigned,
    recommendedDifficulty,
    xpEarned,
    questionBreakdown,
    strengthsIdentified:
      strengthsIdentified.length > 0 ? strengthsIdentified : ['Completed diagnostic attempt — baseline established.'],
    areasRequiringImprovement:
      areasRequiringImprovement.length > 0
        ? areasRequiringImprovement
        : ['Ready for advanced architectural edge cases and system design.'],
    nextRecommendedAction,
    roadmapAdapted,
    adaptationSummary,
  };

  return { result, updatedSkill, updatedRoadmap };
}

export function sanitizeResumeText(rawText: string): string {
  // Strip prompt-injection patterns and HTML tags
  return rawText
    .replace(/<[^>]*>?/gm, '')
    .replace(/ignore\s+(all\s+)?(previous|prior)\s+instructions/gi, '[REDACTED_INJECTION_ATTEMPT]')
    .replace(/system\s*prompt/gi, '[REDACTED]')
    .slice(0, 6000)
    .trim();
}

export function extractSkillsFromText(
  rawText: string,
  existingSkills: SkillNode[]
): {
  sanitizedText: string;
  extractedSkills: { skillId: string; name: string; suggestedLevel: ProficiencyScale; evidence: string }[];
  updatedSkills: SkillNode[];
} {
  const sanitizedText = sanitizeResumeText(rawText);
  const lower = sanitizedText.toLowerCase();

  const patterns: { skillId: string; name: string; keywords: string[]; defaultLevel: ProficiencyScale }[] = [
    { skillId: 'python', name: 'Python Programming', keywords: ['python', 'fastapi', 'django', 'flask', 'pandas'], defaultLevel: 3 },
    { skillId: 'sql', name: 'SQL & Relational Modeling', keywords: ['sql', 'postgresql', 'postgres', 'mysql', 'database'], defaultLevel: 3 },
    { skillId: 'html_css', name: 'HTML5 & Modern CSS', keywords: ['html', 'css', 'tailwind', 'flexbox'], defaultLevel: 3 },
    { skillId: 'javascript', name: 'JavaScript (ES6+ & Async)', keywords: ['javascript', 'es6', 'typescript', 'ecmascript'], defaultLevel: 3 },
    { skillId: 'react', name: 'React & State Architecture', keywords: ['react', 'redux', 'next.js', 'jsx', 'hooks'], defaultLevel: 3 },
    { skillId: 'nodejs', name: 'Node.js Runtime', keywords: ['node.js', 'nodejs', 'npm', 'libuv'], defaultLevel: 3 },
    { skillId: 'express', name: 'Express & Middleware', keywords: ['express', 'expressjs', 'middleware'], defaultLevel: 3 },
    { skillId: 'rest_apis', name: 'RESTful APIs & Auth', keywords: ['rest api', 'restful', 'graphql', 'oauth', 'jwt'], defaultLevel: 3 },
    { skillId: 'git_github', name: 'Git & GitHub Workflows', keywords: ['git', 'github', 'gitlab', 'pull request', 'ci/cd'], defaultLevel: 3 },
    { skillId: 'cybersecurity', name: 'AppSec & Zero-Trust Security', keywords: ['security', 'owasp', 'encryption', 'rbac', 'zero-trust'], defaultLevel: 3 },
    { skillId: 'machine_learning', name: 'Machine Learning & LLMs', keywords: ['machine learning', 'pytorch', 'tensorflow', 'llm', 'gemini', 'scikit'], defaultLevel: 3 },
  ];

  const isSenior = /senior|lead|principal|5\+\s*years|expert|architect/i.test(sanitizedText);
  const extractedSkills: { skillId: string; name: string; suggestedLevel: ProficiencyScale; evidence: string }[] = [];

  for (const pat of patterns) {
    const matchedKw = pat.keywords.filter((kw) => lower.includes(kw));
    if (matchedKw.length > 0) {
      const level = (isSenior ? Math.min(5, pat.defaultLevel + 1) : pat.defaultLevel) as ProficiencyScale;
      extractedSkills.push({
        skillId: pat.skillId,
        name: pat.name,
        suggestedLevel: level,
        evidence: `Extracted by Profile Intelligence Agent from resume/certificate keywords: [${matchedKw.join(', ')}]`,
      });
    }
  }

  const extractedMap = new Map(extractedSkills.map((e) => [e.skillId, e]));
  const updatedSkills = existingSkills.map((skill) => {
    const found = extractedMap.get(skill.id);
    if (!found) return skill;
    const newProf = Math.max(skill.proficiency, found.suggestedLevel) as ProficiencyScale;
    return {
      ...skill,
      proficiency: newProf,
      confidence: Math.max(skill.confidence, 75),
      status: deriveSkillStatus(newProf, skill.targetProficiency, skill.lastScore),
      evidence: [found.evidence, ...skill.evidence.filter((e) => !e.startsWith('No verified project'))],
    };
  });

  return { sanitizedText, extractedSkills, updatedSkills };
}

export const INITIAL_SKILL_REELS: SkillReelItem[] = [
  {
    id: 'reel_js_event_loop',
    skillId: 'javascript',
    skillName: 'JavaScript (ES6+ & Async)',
    category: 'Language',
    authorHandle: '@nexora.architect',
    authorRole: 'Learning Architect Agent',
    hookTitle: 'Why Promise.then() beats setTimeout(fn, 0) every single time ⚡',
    psychologyPrinciple: 'Zeigarnik Effect + Instant Curiosity Resolution',
    microConcept:
      'Think of the JavaScript Event Loop like an airport VIP lane: Synchronous code boards first, then the entire VIP Microtask Queue (Promises) clears BEFORE a single Macrotask (setTimeout) is allowed through the gate!',
    codeSnippet: `console.log("1. Sync Call Stack");
setTimeout(() => console.log("3. Macrotask Queue"), 0);
Promise.resolve().then(() => console.log("2. VIP Microtask!"));
// Output: 1 -> 2 -> 3`,
    quickQuizQuestion: 'Which queue drains immediately after synchronous code finishes?',
    quickQuizOptions: ['Microtask Queue (Promises)', 'Macrotask Queue (setTimeout)', 'DOM Paint Queue'],
    quickQuizCorrect: 'Microtask Queue (Promises)',
    xpReward: 75,
    likesCount: 1420,
  },
  {
    id: 'reel_react_immutability',
    skillId: 'react',
    skillName: 'React & State Architecture',
    category: 'Frontend',
    authorHandle: '@nexora.frontend',
    authorRole: 'Skill Assessment Agent',
    hookTitle: 'Stop mutating arrays in React! Use this 1-line spread pattern 🔥',
    psychologyPrinciple: 'Visual Contrast & Variable-Ratio Dopamine Reward',
    microConcept:
      'React compares state using `Object.is(prev, next)`. If you `.push()` into an existing array, the memory address stays identical and React ignores your update. Spread `[...prev, item]` creates a fresh reference that triggers an instant render!',
    codeSnippet: `// ❌ Bug: Same memory reference, zero re-render
items.push(newSkill);
setItems(items);

// ✅ Dopamine Clean: Fresh reference triggers UI update
setItems(prev => [...prev, newSkill]);`,
    quickQuizQuestion: 'Why does `items.push()` fail to trigger a React re-render?',
    quickQuizOptions: [
      'The array memory reference stays identical under Object.is',
      'JavaScript arrays are read-only in browsers',
      'useState only supports strings',
    ],
    quickQuizCorrect: 'The array memory reference stays identical under Object.is',
    xpReward: 90,
    likesCount: 2180,
  },
  {
    id: 'reel_node_nonblocking',
    skillId: 'nodejs',
    skillName: 'Node.js Runtime',
    category: 'Backend',
    authorHandle: '@nexora.systems',
    authorRole: 'Career Intelligence Agent',
    hookTitle: 'How 1 single Node.js thread serves 10,000 concurrent users 🚀',
    psychologyPrinciple: 'Cognitive Chunking & Mental Model Anchoring',
    microConcept:
      'Node.js never waits around for slow database queries. It hands I/O off to the C++ `libuv` worker pool and OS kernel, freeing the main thread to serve thousands of other requests until the callback signals completion.',
    codeSnippet: `// Non-blocking I/O: Main thread stays 100% responsive
app.get('/api/profile/:id', async (req, res) => {
  const data = await db.query('SELECT * FROM learners WHERE id = $1', [req.params.id]);
  res.json(data.rows[0]);
});`,
    quickQuizQuestion: 'What C++ subsystem powers Node.js non-blocking asynchronous I/O?',
    quickQuizOptions: ['libuv + OS kernel epoll/kqueue', ' CSS Flexbox Engine', 'WebGL Fragment Shader'],
    quickQuizCorrect: 'libuv + OS kernel epoll/kqueue',
    xpReward: 80,
    likesCount: 980,
  },
  {
    id: 'reel_sql_having',
    skillId: 'sql',
    skillName: 'SQL & Relational Modeling',
    category: 'Database',
    authorHandle: '@nexora.data',
    authorRole: 'Profile Intelligence Agent',
    hookTitle: 'WHERE vs. HAVING in 30 seconds — never mix them up again 💎',
    psychologyPrinciple: 'Dual-Coding & Pattern Recognition',
    microConcept:
      '`WHERE` filters raw table rows BEFORE grouping happens. `HAVING` filters the aggregated buckets AFTER `GROUP BY` has calculated `AVG()` or `COUNT()`.',
    codeSnippet: `SELECT skill_id, AVG(score) AS avg_score
FROM assessments
WHERE passed_validation = true
GROUP BY skill_id
HAVING AVG(score) >= 80;`,
    quickQuizQuestion: 'Which SQL clause filters aggregated groups AFTER GROUP BY?',
    quickQuizOptions: ['HAVING', 'WHERE', 'TRUNCATE'],
    quickQuizCorrect: 'HAVING',
    xpReward: 65,
    likesCount: 1640,
  },
  {
    id: 'reel_rest_idempotency',
    skillId: 'rest_apis',
    skillName: 'RESTful APIs & Auth',
    category: 'Backend',
    authorHandle: '@nexora.security',
    authorRole: 'AI Mentor Agent',
    hookTitle: 'What makes PUT idempotent while POST is not? 🛡️',
    psychologyPrinciple: 'Micro-Mastery Loop',
    microConcept:
      'Calling an idempotent operation (`GET`, `PUT`, `DELETE`) 1 time or 10 times produces the exact same server state. Calling `POST /orders` 10 times creates 10 separate orders unless guarded by an Idempotency-Key!',
    codeSnippet: `// PUT replaces the target resource state deterministically
app.put('/api/learners/:id/career', requireAuth, async (req, res) => {
  await setTargetCareer(req.params.id, req.body.careerId);
  res.status(200).json({ status: 'updated' });
});`,
    quickQuizQuestion: 'Which HTTP method is NOT idempotent by default?',
    quickQuizOptions: ['POST', 'GET', 'PUT'],
    quickQuizCorrect: 'POST',
    xpReward: 85,
    likesCount: 1190,
  },
];

export function createBlankLearnerSkills(): SkillNode[] {
  const template = createAlexDemoSkills();
  return template.map((s) => ({
    ...s,
    proficiency: 0 as ProficiencyScale,
    initialProficiency: 0 as ProficiencyScale,
    confidence: 0,
    status: 'missing' as SkillStatus,
    evidence: ['Unassessed baseline — Complete Onboarding or take a Skill Test to verify your level.'],
    lastScore: undefined,
    learningPaceMode: 'Guided Foundations (Step-by-Step)',
    recommendedDifficulty: 'Beginner',
  }));
}

export function createBlankLearnerState(
  uid = 'new_learner',
  fullName = '',
  email = '',
  targetCareerId = 'fullstack'
): LearnerProfileState {
  const blankSkills = createBlankLearnerSkills();
  const defaultCareer = CAREER_ROLES.find((c) => c.id === targetCareerId) || CAREER_ROLES[0];
  const initialRoadmap = generateAdaptiveRoadmap(blankSkills, defaultCareer, 10).map((phase, idx) => ({
    ...phase,
    loggedHours: 0,
    status: (idx === 0 ? 'in_progress' : 'locked') as RoadmapMilestone['status'],
    lessons: phase.lessons.map((l) => ({ ...l, completed: false })),
    exercises: phase.exercises.map((e) => ({ ...e, completed: false, submission: '' })),
    miniProject: { ...phase.miniProject, completed: false },
  }));

  const cleanAgentStatuses: AgentStatusRecord[] = [
    {
      id: 'profile_agent',
      name: 'Profile Intelligence Agent',
      role: 'Extracts structured competencies & experience from learner profiles and resumes.',
      status: 'idle',
      lastTask: 'Awaiting new learner onboarding & baseline skill selection',
      lastOutputSummary: 'No demo data loaded — ready to analyze your real skills and resume.',
      lastUpdated: 'Just now',
      confidence: 100,
    },
    {
      id: 'skill_assessment_agent',
      name: 'Skill Assessment Agent',
      role: 'Evaluates proficiency levels, confidence scores, and evidence-backed knowledge gaps.',
      status: 'idle',
      lastTask: 'Awaiting first diagnostic skill test',
      lastOutputSummary: '0/11 skills verified. Take any test in the Assessment Center to calibrate your level.',
      lastUpdated: 'Just now',
      confidence: 100,
    },
    {
      id: 'career_agent',
      name: 'Career Intelligence Agent',
      role: 'Benchmarks learner capabilities against industry role requirements and calculates compatibility.',
      status: 'idle',
      lastTask: 'Ready to compare your verified skills against 11 career paths',
      lastOutputSummary: 'Select your target career in Onboarding to compute real compatibility.',
      lastUpdated: 'Just now',
      confidence: 100,
    },
    {
      id: 'learning_architect_agent',
      name: 'Learning Architect Agent',
      role: 'Constructs prerequisite-ordered, adaptive 8-phase learning roadmaps.',
      status: 'idle',
      lastTask: 'Initialized baseline learning sequence',
      lastOutputSummary: 'Will dynamically adjust pace (Guided, Applied, or Fast-Track) after your first test.',
      lastUpdated: 'Just now',
      confidence: 100,
    },
    {
      id: 'resource_discovery_agent',
      name: 'Resource Discovery Agent',
      role: 'Curates verified documentation, interactive labs, and courses mapped to skill gaps.',
      status: 'idle',
      lastTask: 'Indexed 12 verified documentation sources',
      lastOutputSummary: 'Ready to recommend resources matched to your test results.',
      lastUpdated: 'Just now',
      confidence: 100,
    },
    {
      id: 'assessment_evaluator_agent',
      name: 'Assessment Evaluator Agent',
      role: 'Generates multi-modal evaluations, grades submissions, and triggers remediation.',
      status: 'idle',
      lastTask: 'Diagnostic question bank armed',
      lastOutputSummary: 'Ready to grade your first test and adapt your learning process.',
      lastUpdated: 'Just now',
      confidence: 100,
    },
    {
      id: 'ai_mentor_agent',
      name: 'AI Mentor Agent',
      role: 'Provides personalized Socratic explanations, voice coaching, and study guidance.',
      status: 'idle',
      lastTask: 'Gemini AI Voice & Text Mentor online',
      lastOutputSummary: 'Ask any question or tap the Gemini Voice Assistant for spoken guidance.',
      lastUpdated: 'Just now',
      confidence: 100,
    },
    {
      id: 'progress_intelligence_agent',
      name: 'Progress Intelligence Agent',
      role: 'Monitors velocity, consistency streaks, and adapts roadmap sequences after assessments.',
      status: 'idle',
      lastTask: 'Tracking Day 1 streak & dopamine XP',
      lastOutputSummary: 'Complete Skill Reels or Assessments to earn XP and build your streak.',
      lastUpdated: 'Just now',
      confidence: 100,
    },
  ];

  const cleanAchievements: AchievementBadge[] = [
    {
      id: 'ach_first_reel',
      title: 'First Dopamine Spark',
      description: 'Complete your first interactive micro-quiz in the Skill Reels feed.',
      category: 'Consistency',
      unlocked: false,
      criteria: 'Answer 1 Skill Reel micro-quiz correctly.',
      tier: 'Bronze',
    },
    {
      id: 'ach_js_quantum',
      title: 'Asynchronous JavaScript Navigator',
      description: 'Master the Event Loop, Promises, and Async/Await in the 3D Skill Universe.',
      category: 'Assessment',
      unlocked: false,
      criteria: 'Score >= 80% on the JavaScript (ES6+ & Async) Assessment.',
      tier: 'Quantum',
    },
    {
      id: 'ach_fullstack_portal',
      title: 'Career Portal Pioneer',
      description: 'Reach 85% compatibility with your target career and unlock the Career Portal.',
      category: 'Career Milestone',
      unlocked: false,
      criteria: 'Achieve 85%+ Career Compatibility.',
      tier: 'Quantum',
    },
  ];

  return {
    uid,
    isDemo: false,
    fullName: fullName.trim(),
    email: email.trim(),
    role: 'Student',
    qualification: '',
    institution: '',
    level: 'Entry / Baseline Learner',
    targetCareerId: defaultCareer.id,
    careerInterests: [defaultCareer.title],
    learningStyle: 'Visual & Interactive 3D',
    weeklyHoursAvailable: 10,
    shortTermGoal: '',
    longTermGoal: '',
    certificationsHeld: [],
    projectsBuilt: [],
    workExperience: '',
    mfaEnabled: false,
    reducedMotion: false,
    prefer2DFallback: false,
    streakDays: 1,
    dopamineXp: 0,
    skills: blankSkills,
    skillReels: INITIAL_SKILL_REELS.map((r) => ({ ...r })),
    customCareers: [],
    roadmap: initialRoadmap,
    resources: VERIFIED_RESOURCES.map((r) => ({ ...r, bookmarked: false })),
    assessmentHistory: [],
    weeklyProgress: [
      { week: 'Week 1 (Current)', hoursLogged: 0, targetHours: 10, lessonsCompleted: 0, avgAssessmentScore: 0, readinessScore: 0 },
    ],
    achievements: cleanAchievements,
    agentStatuses: cleanAgentStatuses,
    agentLogs: [],
    mentorMessages: [
      {
        id: 'msg_clean_welcome',
        role: 'mentor',
        content: `Welcome to **NEXORA AI**${fullName ? `, ${fullName}` : ''}! Your account is initialized with **zero pre-filled demo data** so your 3D Skill Universe, Career Compatibility, and Adaptive Roadmap reflect 100% your own verified skills and test results.\n\n1. Complete your **Onboarding Profile** or jump straight into **Skill Reels** for bite-sized dopamine micro-learning.\n2. Take any diagnostic test in the **Assessment Center** — our 8 AI agents will automatically adjust your learning pace (**Guided Foundations**, **Applied Practice**, or **Accelerated Fast-Track**) based on your test score!`,
        timestamp: 'Just now',
        agentInsights: [
          'Zero Demo Data Policy: Clean baseline initialized',
          'Adaptive Engine: Ready to calibrate from your first test result',
        ],
        suggestedFollowUps: [
          'Which skill test should I take first to calibrate my roadmap?',
          'How does NEXORA adjust my learning process based on test scores?',
          'Give me a quick 60-second beginner coding concept',
        ],
      },
    ],
  };
}

export function createInitialAlexState(): LearnerProfileState {
  const skills = createAlexDemoSkills();
  const roadmap = createAlexEightPhaseRoadmap();
  const agentStatuses: AgentStatusRecord[] = [
    {
      id: 'profile_agent',
      name: 'Profile Intelligence Agent',
      role: 'Extracts structured competencies & experience from learner profiles and resumes.',
      status: 'completed',
      lastTask: 'Analyzed Alex’s Computer Science profile & project portfolio',
      lastOutputSummary: 'Verified Python (4/5), SQL (4/5), and Basic HTML (2/5). Flagged 6 missing/weak Full Stack skills.',
      lastUpdated: '2 mins ago',
      confidence: 96,
    },
    {
      id: 'skill_assessment_agent',
      name: 'Skill Assessment Agent',
      role: 'Evaluates proficiency levels, confidence scores, and evidence-backed knowledge gaps.',
      status: 'completed',
      lastTask: 'Synthesized diagnostic scores across 11 technical competencies',
      lastOutputSummary: 'Overall Full Stack Readiness: 31%. Critical bottleneck identified in Asynchronous JavaScript & React.',
      lastUpdated: '2 mins ago',
      confidence: 94,
    },
    {
      id: 'career_agent',
      name: 'Career Intelligence Agent',
      role: 'Benchmarks learner capabilities against industry role requirements and calculates compatibility.',
      status: 'completed',
      lastTask: 'Matched Alex’s profile against Full Stack Developer specification',
      lastOutputSummary: '31% Career Compatibility. Prioritized JavaScript -> React -> Node.js -> Express -> REST APIs.',
      lastUpdated: '1 min ago',
      confidence: 95,
    },
    {
      id: 'learning_architect_agent',
      name: 'Learning Architect Agent',
      role: 'Constructs prerequisite-ordered, adaptive 8-phase learning roadmaps.',
      status: 'completed',
      lastTask: 'Generated 8-Phase Full Stack Developer Roadmap (126 total hours)',
      lastOutputSummary: 'Sequenced Phase 1 (JS Fundamentals) -> Phase 8 (Cloud Deployment) at 12 hrs/week pace.',
      lastUpdated: '1 min ago',
      confidence: 97,
    },
    {
      id: 'resource_discovery_agent',
      name: 'Resource Discovery Agent',
      role: 'Curates verified documentation, interactive labs, and courses mapped to skill gaps.',
      status: 'completed',
      lastTask: 'Matched 12 verified resources (MDN, React.dev, Node.js, PostgreSQL)',
      lastOutputSummary: 'Prioritized JavaScript.info Async curriculum and React.dev Interactive Learn.',
      lastUpdated: '1 min ago',
      confidence: 93,
    },
    {
      id: 'assessment_evaluator_agent',
      name: 'Assessment Evaluator Agent',
      role: 'Generates multi-modal evaluations, grades submissions, and triggers remediation.',
      status: 'completed',
      lastTask: 'Prepared adaptive MCQ, Coding & Scenario evaluations for JavaScript & React',
      lastOutputSummary: 'Ready to evaluate Alex’s Phase 1 JavaScript Fundamentals submission.',
      lastUpdated: 'Just now',
      confidence: 95,
    },
    {
      id: 'ai_mentor_agent',
      name: 'AI Mentor Agent',
      role: 'Provides personalized Socratic explanations, code reviews, and study guidance.',
      status: 'completed',
      lastTask: 'Synthesized personalized welcome briefing for Alex',
      lastOutputSummary: 'Explained how Alex’s Python & SQL strengths accelerate Node.js/Express backend mastery.',
      lastUpdated: 'Just now',
      confidence: 98,
    },
    {
      id: 'progress_intelligence_agent',
      name: 'Progress Intelligence Agent',
      role: 'Monitors velocity, consistency streaks, and adapts roadmap sequences after assessments.',
      status: 'completed',
      lastTask: 'Audited 6-week learning velocity & before/after skill delta',
      lastOutputSummary: '5-day active streak; +18% readiness gain over last 4 weeks.',
      lastUpdated: 'Just now',
      confidence: 94,
    },
  ];

  const agentLogs: AgentExecutionLog[] = [
    {
      id: 'log_1',
      timestamp: '20:28:10',
      workflowName: 'Initial Learner Onboarding & Gap Synthesis',
      agentId: 'profile_agent',
      agentName: 'Profile Intelligence Agent',
      inputSummary: 'Learner: Alex | Target: Full Stack Developer | Existing: Python, SQL, Basic HTML',
      outputSummary: 'Extracted 3 verified skills with project evidence and 6 unverified Full Stack prerequisites.',
      durationMs: 420,
      status: 'verified',
    },
    {
      id: 'log_2',
      timestamp: '20:28:12',
      workflowName: 'Career Compatibility Benchmarking',
      agentId: 'career_agent',
      agentName: 'Career Intelligence Agent',
      inputSummary: '11 Skill Nodes vs. Full Stack Developer Role Matrix',
      outputSummary: 'Computed 31% weighted compatibility; flagged JavaScript, React, Node.js, Express, REST APIs as top priority.',
      durationMs: 380,
      status: 'verified',
    },
    {
      id: 'log_3',
      timestamp: '20:28:15',
      workflowName: '8-Phase Adaptive Roadmap Generation',
      agentId: 'learning_architect_agent',
      agentName: 'Learning Architect Agent',
      inputSummary: 'Priority Gaps + 12 hrs/week availability',
      outputSummary: 'Constructed 8 sequential phases from JavaScript Fundamentals to Full-Stack Deployment.',
      durationMs: 610,
      status: 'reconciled',
    },
  ];

  const achievements: AchievementBadge[] = [
    {
      id: 'ach_sql_architect',
      title: 'Relational Data Architect',
      description: 'Verified Level 4 Mastery in SQL & Relational Modeling with >85% assessment score.',
      category: 'Skill Mastery',
      unlocked: true,
      unlockedAt: '2026-11-04',
      criteria: 'Reach Proficiency Level 4 in SQL & Relational Modeling.',
      tier: 'Gold',
    },
    {
      id: 'ach_python_core',
      title: 'Pythonic Systems Engineer',
      description: 'Demonstrated Advanced Python proficiency across data structures and generators.',
      category: 'Skill Mastery',
      unlocked: true,
      unlockedAt: '2026-10-29',
      criteria: 'Score >= 90% on Python Programming Evaluation.',
      tier: 'Gold',
    },
    {
      id: 'ach_streak_5',
      title: 'Neural Momentum (5-Day Streak)',
      description: 'Maintained 5 consecutive days of active skill building and roadmap execution.',
      category: 'Consistency',
      unlocked: true,
      unlockedAt: '2026-11-12',
      criteria: 'Log learning sessions across 5 consecutive days.',
      tier: 'Silver',
    },
    {
      id: 'ach_js_quantum',
      title: 'Asynchronous JavaScript Navigator',
      description: 'Master the Event Loop, Promises, and Async/Await in the 3D Skill Universe.',
      category: 'Assessment',
      unlocked: false,
      criteria: 'Score >= 80% on the JavaScript (ES6+ & Async) Assessment.',
      tier: 'Quantum',
    },
    {
      id: 'ach_fullstack_portal',
      title: 'Full Stack Portal Pioneer',
      description: 'Reach 85% compatibility with Full Stack Developer and unlock the Career Portal.',
      category: 'Career Milestone',
      unlocked: false,
      criteria: 'Achieve 85%+ Career Compatibility in Full Stack Development.',
      tier: 'Quantum',
    },
  ];

  return {
    uid: 'demo_alex',
    isDemo: true,
    fullName: 'Alex Rivera',
    email: 'alex.rivera@nexora.academy',
    role: 'Student',
    qualification: 'B.S. in Computer Science (Junior Year)',
    institution: 'Nexora Institute of Technology',
    level: 'Undergraduate / Aspiring Software Engineer',
    targetCareerId: 'fullstack',
    careerInterests: ['Full Stack Developer', 'Backend Developer', 'AI/ML Engineer'],
    learningStyle: 'Visual & Interactive 3D',
    weeklyHoursAvailable: 12,
    shortTermGoal: 'Master Modern JavaScript (ES6+) and React component architecture within 6 weeks.',
    longTermGoal: 'Become a production-ready Full Stack Developer building AI-enabled web platforms.',
    certificationsHeld: ['Python for Data Science Verified Certificate', 'PostgreSQL Fundamentals Badge'],
    projectsBuilt: [
      {
        title: 'University Library SQL Inventory Engine',
        stack: 'Python, PostgreSQL, Basic HTML',
        summary: 'CLI and static HTML reporting tool tracking 14,000 book loans with normalized relational tables.',
      },
      {
        title: 'Automated CSV Grade Normalizer',
        stack: 'Python 3, Pandas',
        summary: 'Command-line script automating departmental grading rubrics and outlier detection.',
      },
    ],
    workExperience: 'Teaching Assistant for Intro to Databases & Python Scripting (1 Semester)',
    mfaEnabled: true,
    reducedMotion: false,
    prefer2DFallback: false,
    streakDays: 5,
    dopamineXp: 420,
    skills,
    skillReels: INITIAL_SKILL_REELS.map((r) => ({ ...r })),
    customCareers: [],
    roadmap,
    resources: VERIFIED_RESOURCES,
    assessmentHistory: [
      {
        id: 'sub_init_py',
        skillId: 'python',
        skillName: 'Python Programming',
        timestamp: '2026-10-29T14:20:00Z',
        scorePercentage: 92,
        previousProficiency: 3,
        newProficiency: 4,
        previousStatus: 'weak',
        newStatus: 'mastered',
        learningPaceAssigned: 'Accelerated Mastery (Fast-Track)',
        recommendedDifficulty: 'Advanced',
        xpEarned: 150,
        questionBreakdown: [],
        strengthsIdentified: ['Generator expressions and lazy evaluation mastered'],
        areasRequiringImprovement: ['Explore asyncio concurrency'],
        nextRecommendedAction: 'Leverage Python backend concepts when learning Node.js & Express.',
        roadmapAdapted: false,
        adaptationSummary: 'Verified Level 4 Mastery in Python Programming.',
      },
    ],
    weeklyProgress: [
      { week: 'Week 1', hoursLogged: 8.5, targetHours: 12, lessonsCompleted: 3, avgAssessmentScore: 62, readinessScore: 24 },
      { week: 'Week 2', hoursLogged: 10.0, targetHours: 12, lessonsCompleted: 4, avgAssessmentScore: 70, readinessScore: 28 },
      { week: 'Week 3', hoursLogged: 11.5, targetHours: 12, lessonsCompleted: 5, avgAssessmentScore: 76, readinessScore: 32 },
      { week: 'Week 4', hoursLogged: 12.5, targetHours: 12, lessonsCompleted: 6, avgAssessmentScore: 84, readinessScore: 35 },
      { week: 'Week 5', hoursLogged: 11.0, targetHours: 12, lessonsCompleted: 5, avgAssessmentScore: 86, readinessScore: 37 },
      { week: 'Week 6 (Current)', hoursLogged: 10.0, targetHours: 12, lessonsCompleted: 6, avgAssessmentScore: 89, readinessScore: 39 },
    ],
    achievements,
    agentStatuses,
    agentLogs,
    mentorMessages: [
      {
        id: 'msg_welcome',
        role: 'mentor',
        content:
          "Welcome to NEXORA AI, Alex! Our 8-agent orchestration layer has analyzed your profile. Because you already possess strong **Python (Level 4)** and **SQL (Level 4)** foundations plus **Basic HTML (Level 2)**, you don't need to start from zero. Your highest-leverage path to **Full Stack Developer** is bridging **JavaScript (ES6+ & Async)** first, then **React**, **Node.js**, **Express**, and **REST APIs**.\n\nTry taking the **JavaScript Assessment** in the Assessment Center or click any globe in the **3D Skill Universe**—clicking a globe now zooms directly to that 3D model and scrolls to its interactive inspection deck!",
        timestamp: 'Just now',
        agentInsights: [
          'Career Agent: 31% Full Stack compatibility (Python & SQL verified)',
          'Learning Architect: Phase 1 (JavaScript Fundamentals) active now',
        ],
        suggestedFollowUps: [
          'Explain JavaScript Promises vs Python async/await for my background',
          'Why should I learn JavaScript before React and Node.js?',
          'Give me a 15-minute practice exercise for Phase 1',
        ],
      },
    ],
  };
}
