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
  ProficiencyScale,
  RoadmapMilestone,
  RoadmapPhaseCategory,
  SkillNode,
  SkillStatus,
} from '../types/nexora';
import {
  ASSESSMENT_QUESTION_BANK,
  CAREER_ROLES,
  INITIAL_SKILL_REELS,
  VERIFIED_RESOURCES,
  createAlexDemoSkills,
  createAlexEightPhaseRoadmap,
} from '../data/nexoraCatalog';

export {
  ASSESSMENT_QUESTION_BANK,
  CAREER_ROLES,
  INITIAL_SKILL_REELS,
  VERIFIED_RESOURCES,
  createAlexDemoSkills,
  createAlexEightPhaseRoadmap,
};

/**
 * Converts a numeric 0-5 proficiency scale into a human-readable competency label.
 */
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

/**
 * Derives the adaptive learning pace and difficulty tier directly from an assessment score percentage.
 * - Score < 60%: Guided Foundations (Step-by-Step)
 * - Score 60-79%: Applied Practice (Hands-On)
 * - Score >= 80%: Accelerated Mastery (Fast-Track)
 */
export function deriveLearningPaceFromScore(scorePercentage: number): {
  paceMode: LearningPaceMode;
  recommendedDifficulty: 'Beginner' | 'Intermediate' | 'Advanced';
} {
  if (scorePercentage >= 80) {
    return {
      paceMode: 'Accelerated Mastery (Fast-Track)',
      recommendedDifficulty: 'Advanced',
    };
  }
  if (scorePercentage >= 60) {
    return {
      paceMode: 'Applied Practice (Hands-On)',
      recommendedDifficulty: 'Intermediate',
    };
  }
  return {
    paceMode: 'Guided Foundations (Step-by-Step)',
    recommendedDifficulty: 'Beginner',
  };
}

/**
 * Derives the status classification ('mastered' | 'weak' | 'revision' | 'missing') for a skill node.
 */
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

/**
 * Computes weighted career compatibility, skill gaps, and prerequisite-ordered priority recommendations.
 */
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

/**
 * Generates an adaptive multi-phase learning roadmap tailored to the learner's current skills,
 * selected career role, and available weekly study hours.
 */
export function generateAdaptiveRoadmap(
  skills: SkillNode[],
  career: CareerRole,
  weeklyHours: number
): RoadmapMilestone[] {
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

/**
 * Evaluates a learner's multi-modal assessment submission, updates proficiency and confidence,
 * and dynamically adapts the learning roadmap based on the score (<60% remediation, >=80% fast-track).
 */
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
  const { paceMode: learningPaceAssigned, recommendedDifficulty } = deriveLearningPaceFromScore(scorePercentage);

  let newProficiency: ProficiencyScale = skill.proficiency;
  let newStatus: SkillStatus = skill.status;
  let xpEarned = 50;
  let nextRecommendedAction = '';
  let roadmapAdapted = false;
  let adaptationSummary = '';

  if (scorePercentage >= 80) {
    newProficiency = Math.min(5, Math.max(skill.proficiency + 1, 4)) as ProficiencyScale;
    newStatus = 'mastered';
    xpEarned = 150;
    nextRecommendedAction = `Excellent performance (${scorePercentage}%)! Learning process switched to Accelerated Mastery (Fast-Track) — ${skill.name} is illuminated in the 3D Skill Universe and advanced system-design modules are unlocked.`;
    roadmapAdapted = true;
    adaptationSummary = `Progress Intelligence Agent switched ${skill.name} to Accelerated Mastery mode (+${xpEarned} XP), marked foundational lessons complete, and unlocked downstream prerequisites.`;
  } else if (scorePercentage >= 60) {
    newProficiency = Math.max(skill.proficiency, 2) as ProficiencyScale;
    newStatus = 'weak';
    xpEarned = 85;
    nextRecommendedAction = `Solid progress (${scorePercentage}%). Learning process calibrated to Applied Practice Mode — focus on hands-on coding exercises and the mini-project to reach Level 4 Mastery.`;
    roadmapAdapted = true;
    adaptationSummary = `Skill proficiency updated to ${getProficiencyLabel(newProficiency)} (+${xpEarned} XP). Calibrated curriculum to Intermediate Applied Coding labs.`;
  } else {
    newProficiency = Math.max(1, skill.proficiency) as ProficiencyScale;
    newStatus = 'revision';
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

/**
 * Strips HTML tags and prompt-injection payloads from uploaded resume or certificate text.
 */
export function sanitizeResumeText(rawText: string): string {
  return rawText
    .replace(/<[^>]*>?/gm, '')
    .replace(/ignore\s+(all\s+)?(previous|prior)\s+instructions/gi, '[REDACTED_INJECTION_ATTEMPT]')
    .replace(/system\s*prompt/gi, '[REDACTED]')
    .slice(0, 6000)
    .trim();
}

/**
 * Extracts verified competencies and suggested proficiency levels from sanitized resume text.
 */
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

/**
 * Initializes all 11 skill nodes at 0/5 ('missing') with zero demo data for a fresh learner account.
 */
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

/**
 * Creates a clean, zero-demo-data learner profile state for newly registered users.
 */
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

/**
 * Initializes the Problem Statement Sample Scenario state for Alex Rivera
 * (Current skills: Python 4/5, SQL 4/5, Basic HTML 2/5; Missing: JavaScript, React, Node.js; Target: Full Stack Developer).
 */
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
