export type ProficiencyScale = 0 | 1 | 2 | 3 | 4 | 5;

export type SkillStatus = 'mastered' | 'weak' | 'missing' | 'revision';

export type SkillCategory =
  | 'Language'
  | 'Frontend'
  | 'Backend'
  | 'Database'
  | 'DevOps & Cloud'
  | 'AI & Data'
  | 'Architecture & Soft Skills';

export type LearningPaceMode =
  | 'Guided Foundations (Step-by-Step)'
  | 'Applied Practice (Hands-On)'
  | 'Accelerated Mastery (Fast-Track)';

export interface SkillNode {
  id: string;
  name: string;
  category: SkillCategory;
  proficiency: ProficiencyScale;
  initialProficiency: ProficiencyScale;
  targetProficiency: ProficiencyScale;
  confidence: number; // 0 to 100
  status: SkillStatus;
  evidence: string[];
  lastScore?: number;
  learningPaceMode?: LearningPaceMode;
  recommendedDifficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  prerequisites: string[];
  orbitRadius: number;
  orbitAngle: number;
  heightOffset: number;
}

export interface SkillReelItem {
  id: string;
  skillId: string;
  skillName: string;
  category: SkillCategory;
  authorHandle: string;
  authorRole: string;
  hookTitle: string;
  psychologyPrinciple: string;
  microConcept: string;
  codeSnippet: string;
  quickQuizQuestion: string;
  quickQuizOptions: string[];
  quickQuizCorrect: string;
  xpReward: number;
  likesCount: number;
  liked?: boolean;
  saved?: boolean;
  completed?: boolean;
}

export interface CareerSkillRequirement {
  skillId: string;
  skillName: string;
  category: SkillCategory;
  requiredLevel: ProficiencyScale;
  weight: number;
  isCritical: boolean;
}

export interface CareerRole {
  id: string;
  title: string;
  category: string;
  description: string;
  avgSalaryRange: string;
  demandGrowth: string;
  requiredTechnicalSkills: CareerSkillRequirement[];
  requiredSoftSkills: string[];
  languages: string[];
  frameworks: string[];
  tools: string[];
  practicalExperience: string;
  recommendedProjects: string[];
  relevantCertifications: string[];
  isCustom?: boolean;
}

export interface CareerMatchAnalysis {
  careerId: string;
  careerTitle: string;
  compatibilityScore: number; // 0 to 100
  readinessLevel: 'Early Explorer' | 'Developing Contender' | 'Implementation Ready' | 'Career Ready';
  masteredSkills: SkillNode[];
  partiallyDevelopedSkills: SkillNode[];
  missingSkills: SkillNode[];
  criticalGaps: SkillNode[];
  recommendedPriorityOrder: {
    skillId: string;
    skillName: string;
    currentLevel: ProficiencyScale;
    requiredLevel: ProficiencyScale;
    priorityScore: number;
    reason: string;
  }[];
  scoreExplanation: string;
}

export type RoadmapPhaseCategory =
  | 'Foundation'
  | 'Core Concepts'
  | 'Intermediate Development'
  | 'Advanced Development'
  | 'Practical Implementation'
  | 'Career Readiness';

export interface RoadmapLesson {
  id: string;
  title: string;
  durationMinutes: number;
  completed: boolean;
}

export interface RoadmapExercise {
  id: string;
  title: string;
  prompt: string;
  completed: boolean;
  submission?: string;
}

export interface RoadmapMilestone {
  id: string;
  phaseNumber: number;
  category: RoadmapPhaseCategory;
  title: string;
  objective: string;
  skillId: string;
  skillName: string;
  estimatedHours: number;
  loggedHours: number;
  status: 'completed' | 'in_progress' | 'unlocked' | 'locked' | 'revision_required';
  lessons: RoadmapLesson[];
  exercises: RoadmapExercise[];
  miniProject: {
    title: string;
    deliverable: string;
    completed: boolean;
  };
  assessmentId: string;
  completionCriteria: string;
  adaptiveNote?: string;
}

export interface LearningResource {
  id: string;
  title: string;
  provider: string;
  topic: string;
  skillId: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  type:
    | 'Video Tutorial'
    | 'Online Course'
    | 'Documentation'
    | 'Interactive Platform'
    | 'Technical Article'
    | 'Practice Problems'
    | 'Certification';
  url: string;
  reason: string;
  bookmarked?: boolean;
}

export type QuestionType = 'Multiple Choice' | 'Coding' | 'Conceptual' | 'Scenario';

export interface AssessmentQuestion {
  id: string;
  skillId: string;
  skillName: string;
  type: QuestionType;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  prompt: string;
  options?: string[];
  correctAnswer: string;
  starterCode?: string;
  requiredKeywords?: string[];
  explanation: string;
  remediationTip: string;
}

export interface AssessmentSubmissionResult {
  id: string;
  skillId: string;
  skillName: string;
  timestamp: string;
  scorePercentage: number;
  previousProficiency: ProficiencyScale;
  newProficiency: ProficiencyScale;
  previousStatus: SkillStatus;
  newStatus: SkillStatus;
  learningPaceAssigned?: LearningPaceMode;
  recommendedDifficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  xpEarned?: number;
  questionBreakdown: {
    questionId: string;
    prompt: string;
    type: QuestionType;
    learnerAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    scoreAwarded: number;
    explanation: string;
    mistakeAnalysis?: string;
  }[];
  strengthsIdentified: string[];
  areasRequiringImprovement: string[];
  nextRecommendedAction: string;
  roadmapAdapted: boolean;
  adaptationSummary: string;
}

export type AgentId =
  | 'profile_agent'
  | 'skill_assessment_agent'
  | 'career_agent'
  | 'learning_architect_agent'
  | 'resource_discovery_agent'
  | 'assessment_evaluator_agent'
  | 'ai_mentor_agent'
  | 'progress_intelligence_agent';

export interface AgentStatusRecord {
  id: AgentId;
  name: string;
  role: string;
  status: 'idle' | 'working' | 'completed' | 'warning';
  lastTask: string;
  lastOutputSummary: string;
  lastUpdated: string;
  confidence: number;
}

export interface AgentExecutionLog {
  id: string;
  timestamp: string;
  workflowName: string;
  agentId: AgentId;
  agentName: string;
  inputSummary: string;
  outputSummary: string;
  durationMs: number;
  status: 'verified' | 'reconciled' | 'fallback';
}

export interface WeeklyProgressPoint {
  week: string;
  hoursLogged: number;
  targetHours: number;
  lessonsCompleted: number;
  avgAssessmentScore: number;
  readinessScore: number;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  category: 'Skill Mastery' | 'Consistency' | 'Architecture' | 'Assessment' | 'Career Milestone';
  unlocked: boolean;
  unlockedAt?: string;
  criteria: string;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Quantum';
}

export interface MentorMessage {
  id: string;
  role: 'user' | 'mentor';
  content: string;
  timestamp: string;
  agentInsights?: string[];
  suggestedFollowUps?: string[];
}

export interface LearnerProfileState {
  uid: string;
  isDemo: boolean;
  fullName: string;
  email: string;
  role: 'Student' | 'Working Professional' | 'University Scholar' | 'Organization Lead';
  qualification: string;
  institution: string;
  level: string;
  targetCareerId: string;
  careerInterests: string[];
  learningStyle: 'Visual & Interactive 3D' | 'Project-First' | 'Documentation & Deep Dive' | 'Balanced Adaptive';
  weeklyHoursAvailable: number;
  shortTermGoal: string;
  longTermGoal: string;
  certificationsHeld: string[];
  projectsBuilt: { title: string; stack: string; summary: string }[];
  workExperience: string;
  mfaEnabled: boolean;
  reducedMotion: boolean;
  prefer2DFallback: boolean;
  streakDays: number;
  dopamineXp: number;
  skills: SkillNode[];
  skillReels?: SkillReelItem[];
  customCareers: CareerRole[];
  roadmap: RoadmapMilestone[];
  resources: LearningResource[];
  assessmentHistory: AssessmentSubmissionResult[];
  weeklyProgress: WeeklyProgressPoint[];
  achievements: AchievementBadge[];
  agentStatuses: AgentStatusRecord[];
  agentLogs: AgentExecutionLog[];
  mentorMessages: MentorMessage[];
}

export type UniverseZone =
  | 'gateway'
  | 'neural_core'
  | 'skill_universe'
  | 'career_portal'
  | 'learning_pathway'
  | 'knowledge_library'
  | 'achievement_chamber';

export type AppPage =
  | 'landing'
  | 'auth'
  | 'user-auth'
  | 'onboarding'
  | 'reels'
  | 'dashboard'
  | 'universe'
  | 'profile'
  | 'skills'
  | 'careers'
  | 'roadmap'
  | 'resources'
  | 'assessments'
  | 'analytics'
  | 'mentor'
  | 'agents'
  | 'achievements'
  | 'settings';
