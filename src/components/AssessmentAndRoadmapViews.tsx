import React, { useState } from 'react';
import {
  AssessmentQuestion,
  AssessmentSubmissionResult,
  LearningResource,
  RoadmapMilestone,
  SkillNode,
} from '../types/nexora';
import { ASSESSMENT_QUESTION_BANK, getProficiencyLabel } from '../lib/learningEngine';
import {
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Sparkles,
  ExternalLink,
  Bookmark,
  Search,
  Flame,
} from 'lucide-react';

interface RoadmapViewProps {
  roadmap: RoadmapMilestone[];
  targetCareerTitle: string;
  weeklyHours: number;
  onToggleLesson: (milestoneId: string, lessonId: string) => void;
  onSubmitExercise: (milestoneId: string, exerciseId: string, code: string) => void;
  onToggleMiniProject: (milestoneId: string) => void;
  onLogHours: (milestoneId: string, hoursToAdd: number) => void;
  onReorderPhase: (index: number, direction: 'up' | 'down') => void;
  onRegenerateRoadmap: () => void;
  onStartAssessmentForSkill: (skillId: string) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  roadmap,
  targetCareerTitle,
  weeklyHours,
  onToggleLesson,
  onSubmitExercise,
  onToggleMiniProject,
  onLogHours,
  onReorderPhase,
  onRegenerateRoadmap,
  onStartAssessmentForSkill,
}) => {
  const [exerciseDrafts, setExerciseDrafts] = useState<Record<string, string>>({});
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(roadmap.map((r) => r.category)))];
  const filteredRoadmap =
    activeCategoryFilter === 'All'
      ? roadmap
      : roadmap.filter((r) => r.category === activeCategoryFilter);

  const totalHours = roadmap.reduce((acc, r) => acc + r.estimatedHours, 0);
  const completedHours = roadmap.reduce((acc, r) => acc + r.loggedHours, 0);
  const estimatedWeeks = Math.max(1, Math.round(totalHours / Math.max(1, weeklyHours)));

  return (
    <div className="space-y-6" data-testid="roadmap-module-view">
      <div className="bg-gradient-to-r from-[#171026] via-[#120d1d] to-[#1f1024] border border-pink-500/30 rounded-3xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-mono text-pink-400">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>LEARNING ARCHITECT AGENT · DOPAMINE ADAPTIVE SEQUENCE</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1 font-display">
            Personalized Roadmap: {targetCareerTitle}
          </h1>
          <p className="text-xs text-slate-300 mt-1 tabular-nums">
            {roadmap.length} Phases · {completedHours}/{totalHours} Hours Logged · Est. {estimatedWeeks} Weeks at {weeklyHours} hrs/week
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onRegenerateRoadmap}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:opacity-95 text-white font-semibold text-xs transition-opacity cursor-pointer shadow-md"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Re-Synthesize Adaptive Roadmap</span>
          </button>
        </div>
      </div>

      {/* Interactive Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-[#120d1d] border border-pink-500/25 rounded-2xl overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategoryFilter(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 transition-all cursor-pointer ${
              activeCategoryFilter === cat
                ? 'bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-[#1a132b]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Phase Cards */}
      <div className="space-y-4">
        {filteredRoadmap.map((phase, idx) => {
          const completedLessons = phase.lessons.filter((l) => l.completed).length;
          return (
            <div
              key={phase.id}
              className={`rounded-3xl border p-6 transition-colors ${
                phase.status === 'revision_required'
                  ? 'bg-rose-950/25 border-rose-500/60'
                  : phase.status === 'completed'
                  ? 'bg-[#120d1d] border-emerald-500/40'
                  : 'bg-[#120d1d] border-pink-500/25'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-pink-500/15 pb-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 font-mono">
                    <span className="text-pink-400 font-semibold">{phase.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-amber-300">Skill: {phase.skillName}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">
                      {phase.loggedHours}/{phase.estimatedHours} hrs
                    </span>
                    <span aria-hidden="true">·</span>
                    <span
                      className={
                        phase.status === 'completed'
                          ? 'text-emerald-400 font-semibold'
                          : phase.status === 'revision_required'
                          ? 'text-rose-400 font-semibold'
                          : 'text-amber-300 font-semibold'
                      }
                    >
                      {phase.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-white font-display">{phase.title}</h2>
                  <p className="text-xs text-slate-300">{phase.objective}</p>
                  {phase.adaptiveNote && (
                    <p className="text-xs text-amber-300 font-mono pt-1">{phase.adaptiveNote}</p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => onLogHours(phase.id, 2)}
                    className="px-3 py-1.5 rounded-xl bg-[#09070f] hover:bg-[#1a132b] border border-pink-500/30 text-xs text-pink-200 cursor-pointer whitespace-nowrap"
                  >
                    +2h Study Log
                  </button>
                  <button
                    type="button"
                    onClick={() => onStartAssessmentForSkill(phase.skillId)}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:opacity-95 text-white font-semibold text-xs cursor-pointer whitespace-nowrap"
                  >
                    Take Phase Assessment
                  </button>
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => onReorderPhase(idx, 'up')}
                    aria-label={`Move ${phase.title} up`}
                    className="p-1.5 rounded-xl bg-[#09070f] border border-pink-500/20 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === filteredRoadmap.length - 1}
                    onClick={() => onReorderPhase(idx, 'down')}
                    aria-label={`Move ${phase.title} down`}
                    className="p-1.5 rounded-xl bg-[#09070f] border border-pink-500/20 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4">
                {/* Interactive Lessons Checklist */}
                <div className="lg:col-span-6 space-y-2">
                  <div className="text-xs font-semibold text-pink-200 tabular-nums">
                    Interactive Lessons ({completedLessons}/{phase.lessons.length} Completed · +20 XP each)
                  </div>
                  {phase.lessons.map((lesson) => (
                    <button
                      key={lesson.id}
                      type="button"
                      onClick={() => onToggleLesson(phase.id, lesson.id)}
                      className={`w-full text-left p-3 rounded-2xl border text-xs flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                        lesson.completed
                          ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200'
                          : 'bg-[#09070f] border-pink-500/20 text-slate-200 hover:border-pink-500/50'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <CheckCircle2
                          className={`w-4 h-4 shrink-0 ${
                            lesson.completed ? 'text-emerald-400' : 'text-pink-400/50'
                          }`}
                        />
                        <span>{lesson.title}</span>
                      </span>
                      <span className="font-mono text-[11px] text-amber-300 tabular-nums shrink-0">
                        {lesson.durationMinutes}m
                      </span>
                    </button>
                  ))}
                </div>

                {/* Practical Exercise & Mini-Project */}
                <div className="lg:col-span-6 space-y-3">
                  {phase.exercises.map((ex) => (
                    <div
                      key={ex.id}
                      className="p-4 rounded-2xl bg-[#09070f] border border-pink-500/20 space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-white">Exercise: {ex.title}</span>
                        <span className="font-mono text-[11px] text-pink-400">
                          {ex.completed ? '✓ Submitted (+40 XP)' : 'Pending'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{ex.prompt}</p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          aria-label={`Code submission for ${ex.title}`}
                          value={exerciseDrafts[ex.id] ?? ex.submission ?? ''}
                          onChange={(e) =>
                            setExerciseDrafts((prev) => ({ ...prev, [ex.id]: e.target.value }))
                          }
                          placeholder="Paste solution code or expression..."
                          className="flex-1 px-3 py-1.5 rounded-xl bg-[#120d1d] border border-pink-500/25 text-xs font-mono text-pink-200 focus:outline-none focus:border-pink-500"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            onSubmitExercise(
                              phase.id,
                              ex.id,
                              exerciseDrafts[ex.id] || 'Verified exercise implementation'
                            )
                          }
                          className="px-3.5 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-400 text-xs font-semibold text-white cursor-pointer"
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="p-4 rounded-2xl bg-[#09070f] border border-pink-500/20 flex items-center justify-between gap-4">
                    <div>
                      <div className="text-xs font-semibold text-white">
                        Mini-Project: {phase.miniProject.title}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {phase.miniProject.deliverable}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onToggleMiniProject(phase.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 cursor-pointer ${
                        phase.miniProject.completed
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                          : 'bg-[#1a132b] border border-pink-500/30 text-pink-200 hover:bg-pink-950/60'
                      }`}
                    >
                      {phase.miniProject.completed ? '✓ Verified' : 'Mark Built'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface AssessmentCenterViewProps {
  skills: SkillNode[];
  selectedSkillId: string;
  onSelectSkillId: (skillId: string) => void;
  assessmentHistory: AssessmentSubmissionResult[];
  onSubmitAssessment: (skillId: string, answers: Record<string, string>) => AssessmentSubmissionResult;
  onOpen3DUniverseAfterAssessment: () => void;
}

export const AssessmentCenterView: React.FC<AssessmentCenterViewProps> = ({
  skills,
  selectedSkillId,
  onSelectSkillId,
  onSubmitAssessment,
  onOpen3DUniverseAfterAssessment,
}) => {
  const activeSkill = skills.find((s) => s.id === selectedSkillId) || skills[3] || skills[0];
  const questions = ASSESSMENT_QUESTION_BANK.filter((q) => q.skillId === activeSkill.id);
  const activeQuestions: AssessmentQuestion[] =
    questions.length > 0
      ? questions
      : [
          {
            id: `q_gen_${activeSkill.id}`,
            skillId: activeSkill.id,
            skillName: activeSkill.name,
            type: 'Multiple Choice',
            difficulty: 'Intermediate',
            prompt: `Which architectural practice best demonstrates production-grade ${activeSkill.name} competency?`,
            options: [
              'Automated verification, modular boundaries, and explicit error handling',
              'Hardcoding credentials and skipping input validation',
              'Disabling type checks and ignoring edge cases',
              'Storing unencrypted state in global variables',
            ],
            correctAnswer: 'Automated verification, modular boundaries, and explicit error handling',
            explanation: `Production ${activeSkill.name} requires modular design, automated testing, and defensive error handling.`,
            remediationTip: `Review core ${activeSkill.name} architecture patterns in the Knowledge Library.`,
          },
        ];

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [latestResult, setLatestResult] = useState<AssessmentSubmissionResult | null>(null);

  const handleSelectSkill = (id: string) => {
    onSelectSkillId(id);
    setAnswers({});
    setLatestResult(null);
  };

  const handleFillMasteryDemo = () => {
    const filled: Record<string, string> = {};
    activeQuestions.forEach((q) => {
      filled[q.id] = q.correctAnswer;
    });
    setAnswers(filled);
  };

  const handleFillStrugglingDemo = () => {
    const filled: Record<string, string> = {};
    activeQuestions.forEach((q) => {
      filled[q.id] = 'Incorrect placeholder response';
    });
    setAnswers(filled);
  };

  const handleGradeSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    const res = onSubmitAssessment(activeSkill.id, answers);
    setLatestResult(res);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6" data-testid="assessments-module-view">
      <div className="bg-gradient-to-r from-[#171026] via-[#120d1d] to-[#1f1024] border border-pink-500/30 rounded-3xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="text-xs font-mono text-pink-400">
            ASSESSMENT EVALUATOR AGENT · MULTI-MODAL DIAGNOSTICS
          </div>
          <h1 className="text-2xl font-bold text-white mt-1 font-display">
            Skill Verification & Adaptive Evaluation Center
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Completing an assessment updates your evidence-backed skill score, adapts your roadmap pace, and illuminates stations in the 3D Skill Universe.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleFillMasteryDemo}
            className="px-3.5 py-2 rounded-xl bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-200 text-xs font-semibold cursor-pointer"
          >
            Auto-Fill Mastery Answers (100%)
          </button>
          <button
            type="button"
            onClick={handleFillStrugglingDemo}
            className="px-3.5 py-2 rounded-xl bg-amber-950/70 hover:bg-amber-900 border border-amber-500/50 text-amber-200 text-xs font-semibold cursor-pointer"
          >
            Simulate Poor Score (&lt;60% Remediation)
          </button>
        </div>
      </div>

      {/* Skill Selector Strip */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {skills.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => handleSelectSkill(s.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 transition-all cursor-pointer ${
              s.id === activeSkill.id
                ? 'bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white font-semibold shadow-md'
                : 'bg-[#120d1d] border border-pink-500/25 text-slate-300 hover:text-white'
            }`}
          >
            {s.name} ({s.proficiency}/5)
          </button>
        ))}
      </div>

      {/* Latest Evaluation Result Banner */}
      {latestResult && (
        <div
          data-testid="assessment-result-card"
          className={`rounded-3xl border p-6 space-y-4 ${
            latestResult.scorePercentage >= 80
              ? 'bg-emerald-950/30 border-emerald-500/60'
              : latestResult.scorePercentage < 60
              ? 'bg-rose-950/30 border-rose-500/60'
              : 'bg-amber-950/30 border-amber-500/60'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="text-xs font-mono text-pink-300">
                EVALUATION COMPLETE · LEARNING PROCESS DYNAMICALLY RE-CALIBRATED FROM TEST RESULTS
              </div>
              <h2 className="text-xl font-bold text-white font-display">
                {latestResult.skillName}: {latestResult.scorePercentage}% Score ({getProficiencyLabel(latestResult.newProficiency)})
              </h2>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span
                  data-testid="assigned-learning-pace-badge"
                  className="px-3 py-1 rounded-full bg-pink-500/20 border border-pink-400/40 text-xs font-mono font-bold text-pink-200"
                >
                  Assigned Learning Mode: {latestResult.learningPaceAssigned || 'Applied Practice (Hands-On)'}
                </span>
                <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-xs font-mono font-bold text-amber-200">
                  Calibrated Difficulty: {latestResult.recommendedDifficulty || 'Intermediate'}
                </span>
              </div>
              <p className="text-xs text-slate-200 pt-1">{latestResult.nextRecommendedAction}</p>
              <p className="text-xs font-mono text-amber-300">{latestResult.adaptationSummary}</p>
            </div>

            <button
              type="button"
              onClick={onOpen3DUniverseAfterAssessment}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:opacity-95 text-white font-semibold text-xs cursor-pointer shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              <span>View Illuminated Globe in 3D Skill Universe</span>
            </button>
          </div>

          <div className="space-y-2 pt-3 border-t border-pink-500/20">
            {latestResult.questionBreakdown.map((qb, i) => (
              <div key={qb.questionId} className="p-3.5 rounded-2xl bg-[#09070f] border border-pink-500/20 text-xs space-y-1">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-white">
                    Q{i + 1} ({qb.type}): {qb.isCorrect ? '✓ Correct (+100%)' : `Needs Improvement (${qb.scoreAwarded}%)`}
                  </span>
                </div>
                <p className="text-slate-300">Reference Solution: {qb.correctAnswer}</p>
                <p className="text-slate-400">{qb.explanation}</p>
                {qb.mistakeAnalysis && <p className="text-amber-300 font-mono">{qb.mistakeAnalysis}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Assessment Form */}
      <form onSubmit={handleGradeSubmission} className="space-y-4">
        {activeQuestions.map((q, idx) => (
          <div key={q.id} className="bg-[#120d1d] border border-pink-500/25 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="text-pink-400 font-semibold">
                QUESTION 0{idx + 1} · {q.type.toUpperCase()}
              </span>
              <span className="text-amber-300">Difficulty: {q.difficulty}</span>
            </div>

            <h3 className="text-base font-semibold text-white">{q.prompt}</h3>

            {q.options ? (
              <div className="space-y-2">
                {q.options.map((opt) => {
                  const checked = answers[q.id] === opt;
                  return (
                    <label
                      key={opt}
                      className={`flex items-center gap-3 p-3.5 rounded-2xl border text-xs cursor-pointer transition-colors ${
                        checked
                          ? 'bg-pink-950/60 border-pink-400 text-white font-semibold'
                          : 'bg-[#09070f] border-pink-500/20 text-slate-300 hover:border-pink-500/40'
                      }`}
                    >
                      <input
                        type="radio"
                        name={q.id}
                        value={opt}
                        checked={checked}
                        onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: opt }))}
                        className="accent-pink-500"
                      />
                      <span>{opt}</span>
                    </label>
                  );
                })}
              </div>
            ) : (
              <div>
                <label htmlFor={`code-${q.id}`} className="block text-xs text-slate-400 mb-1.5 font-mono">
                  Write your solution code below:
                </label>
                <textarea
                  id={`code-${q.id}`}
                  rows={4}
                  value={answers[q.id] ?? q.starterCode ?? ''}
                  onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                  className="w-full p-3.5 rounded-2xl bg-[#09070f] border border-pink-500/25 font-mono text-xs text-pink-200 focus:outline-none focus:border-pink-500"
                />
              </div>
            )}
          </div>
        ))}

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:opacity-95 text-white font-semibold text-sm transition-opacity cursor-pointer shadow-lg"
          >
            Submit Assessment for AI Evaluation
          </button>
        </div>
      </form>
    </div>
  );
};

interface ResourceLibraryViewProps {
  resources: LearningResource[];
  skills: SkillNode[];
  onToggleBookmark: (resourceId: string) => void;
}

export const ResourceLibraryView: React.FC<ResourceLibraryViewProps> = ({
  resources,
  skills,
  onToggleBookmark,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string>('All');

  const filtered = resources.filter((r) => {
    const matchesQuery =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.provider.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDiff = selectedDifficulty === 'All' || r.difficulty === selectedDifficulty;
    const matchesSkill = selectedSkillFilter === 'All' || r.skillId === selectedSkillFilter;
    return matchesQuery && matchesDiff && matchesSkill;
  });

  return (
    <div className="space-y-6" data-testid="resources-module-view">
      <div className="bg-gradient-to-r from-[#171026] via-[#120d1d] to-[#1f1024] border border-pink-500/30 rounded-3xl p-6 shadow-xl">
        <div className="text-xs font-mono text-pink-400">RESOURCE DISCOVERY AGENT · VERIFIED SOURCES</div>
        <h1 className="text-2xl font-bold text-white mt-1 font-display">
          Verified Knowledge Library & Course Archives
        </h1>
        <p className="text-xs text-slate-300 mt-1">
          Every learning resource is verified from authoritative documentation and official engineering platforms (MDN, React.dev, OpenJS, PostgreSQL, OWASP, Google Developers).
        </p>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mt-5">
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-pink-400 absolute left-3.5 top-3" />
            <input
              type="text"
              aria-label="Search verified learning resources"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, provider, or technology..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#09070f] border border-pink-500/25 text-xs text-white focus:outline-none focus:border-pink-500"
            />
          </div>

          <div className="md:col-span-3">
            <select
              aria-label="Filter by difficulty"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#09070f] border border-pink-500/25 text-xs text-white"
            >
              <option value="All">All Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              aria-label="Filter by skill"
              value={selectedSkillFilter}
              onChange={(e) => setSelectedSkillFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#09070f] border border-pink-500/25 text-xs text-white"
            >
              <option value="All">All Target Skills</option>
              {skills.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((res) => (
          <div
            key={res.id}
            className="bg-[#120d1d] border border-pink-500/25 hover:border-pink-500/45 rounded-3xl p-5 flex flex-col justify-between space-y-4 transition-colors"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono text-pink-300">
                  {res.provider} · {res.type} · {res.difficulty} · {res.duration}
                </span>
                <button
                  type="button"
                  onClick={() => onToggleBookmark(res.id)}
                  aria-label={`Bookmark ${res.title}`}
                  className={`p-1 rounded cursor-pointer ${
                    res.bookmarked ? 'text-amber-400' : 'text-slate-500 hover:text-white'
                  }`}
                >
                  <Bookmark className="w-4 h-4 fill-current" />
                </button>
              </div>
              <h2 className="text-base font-bold text-white font-display">{res.title}</h2>
              <p className="text-xs text-slate-300">{res.reason}</p>
            </div>

            <div className="pt-3 border-t border-pink-500/15 flex items-center justify-between">
              <span className="text-[11px] font-mono text-amber-300 truncate max-w-[240px]">
                {res.url}
              </span>
              <a
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#09070f] hover:bg-[#1a132b] border border-pink-500/30 text-xs font-semibold text-white transition-colors"
              >
                <span>Open Verified Source</span>
                <ExternalLink className="w-3.5 h-3.5 text-pink-400" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

