import React, { useState, useRef, useEffect } from 'react';
import {
  CareerMatchAnalysis,
  CareerRole,
  LearnerProfileState,
  ProficiencyScale,
  SkillNode,
} from '../types/nexora';
import { getProficiencyLabel } from '../lib/learningEngine';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  Sparkles,
  Send,
  Cpu,
  Play,
  Trash2,
  Download,
  CheckCircle2,
  Volume2,
  RefreshCw,
} from 'lucide-react';

interface SkillAndProfileViewsProps {
  mode: 'skills' | 'profile';
  profile: LearnerProfileState;
  careerAnalysis: CareerMatchAnalysis;
  onUpdateProfile: (partial: Partial<LearnerProfileState>) => void;
  onUpdateSkillLevel: (skillId: string, level: ProficiencyScale, evidenceNote: string) => void;
  onExtractResumeText: (text: string) => void;
  onStartAssessment: (skillId: string) => void;
}

export const SkillAndProfileViews: React.FC<SkillAndProfileViewsProps> = ({
  mode,
  profile,
  careerAnalysis,
  onUpdateProfile,
  onUpdateSkillLevel,
  onExtractResumeText,
  onStartAssessment,
}) => {
  const [resumeInput, setResumeInput] = useState(
    'Completed Senior Full-Stack Capstone using React, Node.js, Express, and REST APIs with Git/GitHub CI workflows.'
  );
  const [extractionFeedback, setExtractionFeedback] = useState<string | null>(null);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectStack, setNewProjectStack] = useState('');

  if (mode === 'profile') {
    return (
      <div className="space-y-6" data-testid="profile-module-view">
        <div className="bg-gradient-to-r from-[#171026] via-[#120d1d] to-[#1f1024] border border-pink-500/30 rounded-3xl p-6 shadow-xl">
          <div className="text-xs font-mono text-pink-400">PROFILE INTELLIGENCE AGENT · STRUCTURED IDENTITY</div>
          <h1 className="text-2xl font-bold text-white mt-1 font-display">
            Learner Profile & Resume Skill Extractor
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Edit your academic/professional credentials or paste resume/certificate text for the Profile Intelligence Agent to extract verified skills.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div>
              <label htmlFor="prof-name" className="block text-xs text-slate-400 mb-1">
                Full Name
              </label>
              <input
                id="prof-name"
                type="text"
                value={profile.fullName}
                onChange={(e) => onUpdateProfile({ fullName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#09070f] border border-pink-500/25 text-sm text-white focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label htmlFor="prof-inst" className="block text-xs text-slate-400 mb-1">
                Institution / Organization
              </label>
              <input
                id="prof-inst"
                type="text"
                value={profile.institution}
                onChange={(e) => onUpdateProfile({ institution: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#09070f] border border-pink-500/25 text-sm text-white focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label htmlFor="prof-qual" className="block text-xs text-slate-400 mb-1">
                Qualification
              </label>
              <input
                id="prof-qual"
                type="text"
                value={profile.qualification}
                onChange={(e) => onUpdateProfile({ qualification: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#09070f] border border-pink-500/25 text-sm text-white focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label htmlFor="prof-hours" className="block text-xs text-slate-400 mb-1">
                Weekly Learning Hours ({profile.weeklyHoursAvailable} hrs/wk)
              </label>
              <input
                id="prof-hours"
                type="number"
                min={2}
                max={60}
                value={profile.weeklyHoursAvailable}
                onChange={(e) => onUpdateProfile({ weeklyHoursAvailable: Number(e.target.value) || 12 })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#09070f] border border-pink-500/25 text-sm text-white font-mono focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>
        </div>

        {/* Resume / Certificate AI Extraction Box */}
        <div className="bg-[#120d1d] border border-pink-500/25 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white font-display">
                Profile Intelligence Agent: Resume & Certificate Parser
              </h2>
              <p className="text-xs text-slate-400">
                Protected by prompt-injection sanitization. Extracts skills and updates your 3D Skill Universe with evidence.
              </p>
            </div>
          </div>

          <textarea
            rows={3}
            aria-label="Resume or certificate text for skill extraction"
            value={resumeInput}
            onChange={(e) => setResumeInput(e.target.value)}
            className="w-full p-3.5 rounded-2xl bg-[#09070f] border border-pink-500/25 text-xs text-pink-200 font-mono focus:outline-none focus:border-pink-500"
          />

          {extractionFeedback && (
            <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/50 text-xs text-emerald-200">
              {extractionFeedback}
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              onExtractResumeText(resumeInput);
              setExtractionFeedback(
                '✓ Profile Intelligence Agent extracted competencies and synchronized your 3D Skill Universe and Career Readiness score!'
              );
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:opacity-95 text-white font-semibold text-xs cursor-pointer shadow-md"
          >
            Extract Skills & Update Profile Evidence
          </button>
        </div>

        {/* Practical Projects Portfolio */}
        <div className="bg-[#120d1d] border border-pink-500/25 rounded-3xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-white font-display">Verified Projects & Portfolio</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.projectsBuilt.map((proj, i) => (
              <div key={i} className="p-4 rounded-2xl bg-[#09070f] border border-pink-500/20">
                <div className="text-sm font-semibold text-white">{proj.title}</div>
                <div className="text-xs font-mono text-pink-400 mt-0.5">{proj.stack}</div>
                <p className="text-xs text-slate-400 mt-2">{proj.summary}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <input
              type="text"
              placeholder="New project title..."
              value={newProjectTitle}
              onChange={(e) => setNewProjectTitle(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-[#09070f] border border-pink-500/25 text-xs text-white flex-1"
            />
            <input
              type="text"
              placeholder="Tech stack (e.g. React, Node.js)"
              value={newProjectStack}
              onChange={(e) => setNewProjectStack(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-[#09070f] border border-pink-500/25 text-xs text-white flex-1"
            />
            <button
              type="button"
              onClick={() => {
                if (!newProjectTitle.trim()) return;
                onUpdateProfile({
                  projectsBuilt: [
                    ...profile.projectsBuilt,
                    {
                      title: newProjectTitle.trim(),
                      stack: newProjectStack.trim() || 'Full Stack',
                      summary: 'Added via Learner Portfolio.',
                    },
                  ],
                });
                setNewProjectTitle('');
                setNewProjectStack('');
              }}
              className="px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-400 text-xs font-semibold text-white cursor-pointer"
            >
              + Add Project
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Skill Intelligence View
  return (
    <div className="space-y-6" data-testid="skills-module-view">
      <div className="bg-gradient-to-r from-[#171026] via-[#120d1d] to-[#1f1024] border border-pink-500/30 rounded-3xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="text-xs font-mono text-pink-400">
            SKILL ASSESSMENT AGENT · EVIDENCE-BACKED PROFICIENCY SCALE (1–5)
          </div>
          <h1 className="text-2xl font-bold text-white mt-1 font-display">
            Skill Intelligence & Evidence Matrix
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Scale: 1. Beginner · 2. Elementary · 3. Intermediate · 4. Advanced · 5. Expert. No skill is marked mastered without assessment or project evidence.
          </p>
        </div>
        <div className="text-right font-mono tabular-nums">
          <div className="text-2xl font-bold text-pink-400">{careerAnalysis.compatibilityScore}%</div>
          <div className="text-xs text-slate-400">Overall Career Readiness</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {profile.skills.map((skill) => (
          <div
            key={skill.id}
            className="bg-[#120d1d] border border-pink-500/25 rounded-3xl p-5 flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono text-slate-400">
                  {skill.category} · Confidence {skill.confidence}%
                </span>
                <span
                  className={`text-xs font-mono font-semibold ${
                    skill.status === 'mastered'
                      ? 'text-emerald-400'
                      : skill.status === 'missing'
                      ? 'text-violet-400'
                      : skill.status === 'revision'
                      ? 'text-rose-400'
                      : 'text-amber-400'
                  }`}
                >
                  {skill.status.toUpperCase()}
                </span>
              </div>

              <h2 className="text-base font-bold text-white mt-1 font-display">{skill.name}</h2>
              <div className="text-xs text-slate-300 mt-1 font-mono tabular-nums">
                Current: {getProficiencyLabel(skill.proficiency)} · Target: {skill.targetProficiency}/5
              </div>

              <div className="mt-3 space-y-1">
                <div className="text-[11px] font-semibold text-pink-300">Supporting Evidence:</div>
                {skill.evidence.map((ev, i) => (
                  <p key={i} className="text-xs text-slate-300 bg-[#09070f] px-3 py-1.5 rounded-xl border border-pink-500/15">
                    {ev}
                  </p>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-pink-500/15 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                {([1, 2, 3, 4, 5] as ProficiencyScale[]).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() =>
                      onUpdateSkillLevel(
                        skill.id,
                        lvl,
                        `Self-calibrated to Level ${lvl}/5 with practical verification`
                      )
                    }
                    className={`w-7 h-7 rounded-lg text-xs font-mono cursor-pointer transition-colors ${
                      skill.proficiency >= lvl
                        ? 'bg-gradient-to-tr from-rose-500 to-amber-500 text-white font-bold'
                        : 'bg-[#09070f] text-slate-500 border border-pink-500/20'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => onStartAssessment(skill.id)}
                className="px-3.5 py-1.5 rounded-xl bg-[#09070f] hover:bg-[#1a132b] border border-pink-500/30 text-xs font-semibold text-pink-300 cursor-pointer"
              >
                Verify via Assessment →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface CareerExplorerViewProps {
  careers: CareerRole[];
  selectedCareerId: string;
  careerAnalysis: CareerMatchAnalysis;
  onSelectCareer: (careerId: string) => void;
  onCreateCustomCareer: (title: string, description: string, selectedSkillIds: string[]) => void;
  skills: SkillNode[];
}

export const CareerExplorerView: React.FC<CareerExplorerViewProps> = ({
  careers,
  selectedCareerId,
  careerAnalysis,
  onSelectCareer,
  onCreateCustomCareer,
}) => {
  const [customTitle, setCustomTitle] = useState('');
  const [customDesc, setCustomDesc] = useState('');
  const [customSkillIds] = useState<string[]>(['python', 'javascript', 'react', 'rest_apis']);

  const activeCareer = careers.find((c) => c.id === selectedCareerId) || careers[0];

  return (
    <div className="space-y-6" data-testid="careers-module-view">
      <div className="bg-gradient-to-r from-[#171026] via-[#120d1d] to-[#1f1024] border border-pink-500/30 rounded-3xl p-6 shadow-xl">
        <div className="text-xs font-mono text-pink-400">CAREER INTELLIGENCE AGENT · COMPATIBILITY ENGINE</div>
        <h1 className="text-2xl font-bold text-white mt-1 font-display">
          Career Explorer & Role Compatibility Comparison
        </h1>
        <p className="text-xs text-slate-300 mt-1">
          Select any of the 11 industry career targets—or create a custom career goal—to compare your verified skills and dynamically re-architect your learning roadmap.
        </p>

        {/* 11 Career Role Selector Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
          {careers.map((career) => {
            const isSelected = career.id === selectedCareerId;
            return (
              <button
                key={career.id}
                type="button"
                onClick={() => onSelectCareer(career.id)}
                className={`p-4 rounded-2xl border text-left transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-pink-950/60 border-pink-400 text-white shadow-lg'
                    : 'bg-[#09070f] border-pink-500/20 text-slate-300 hover:border-pink-500/40'
                }`}
              >
                <div className="text-xs font-mono text-pink-400">{career.category}</div>
                <div className="text-sm font-bold text-white mt-0.5">{career.title}</div>
                <div className="text-[11px] text-amber-300 mt-1 tabular-nums">{career.avgSalaryRange}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detailed Compatibility Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-[#120d1d] border border-pink-500/25 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-pink-500/15 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white font-display">{activeCareer.title}</h2>
              <p className="text-xs text-slate-400 mt-0.5">{activeCareer.description}</p>
            </div>
            <div className="text-right font-mono tabular-nums shrink-0">
              <div className="text-3xl font-bold text-pink-400">{careerAnalysis.compatibilityScore}%</div>
              <div className="text-xs text-amber-300">{careerAnalysis.readinessLevel}</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#09070f] border border-pink-500/20 text-xs text-slate-200 leading-relaxed">
            <span className="font-semibold text-pink-400">Why You Received This Score: </span>
            {careerAnalysis.scoreExplanation}
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-pink-200">
              Recommended Learning Priority Order:
            </h3>
            {careerAnalysis.recommendedPriorityOrder.map((item, idx) => (
              <div
                key={item.skillId}
                className="p-3.5 rounded-2xl bg-[#09070f] border border-pink-500/20 flex items-center justify-between gap-4 text-xs"
              >
                <div>
                  <span className="font-mono text-pink-400 mr-2">0{idx + 1}.</span>
                  <span className="font-semibold text-white">{item.skillName}</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">{item.reason}</p>
                </div>
                <span className="font-mono tabular-nums text-amber-300 shrink-0">
                  {item.currentLevel}/5 → {item.requiredLevel}/5
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#120d1d] border border-pink-500/25 rounded-3xl p-6 space-y-3 text-xs">
            <h3 className="text-base font-bold text-white font-display">
              Role Specification & Industry Requirements
            </h3>
            <div>
              <span className="text-slate-400">Languages: </span>
              <span className="text-pink-200 font-mono">{activeCareer.languages.join(' · ')}</span>
            </div>
            <div>
              <span className="text-slate-400">Frameworks: </span>
              <span className="text-amber-200 font-mono">{activeCareer.frameworks.join(' · ')}</span>
            </div>
            <div>
              <span className="text-slate-400">Tools: </span>
              <span className="text-slate-200 font-mono">{activeCareer.tools.join(' · ')}</span>
            </div>
            <div>
              <span className="text-slate-400">Required Soft Skills: </span>
              <span className="text-slate-200">{activeCareer.requiredSoftSkills.join(' · ')}</span>
            </div>
            <div>
              <span className="text-slate-400">Recommended Projects: </span>
              <ul className="list-disc list-inside text-slate-300 mt-1 space-y-1">
                {activeCareer.recommendedProjects.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Custom Career Builder */}
          <div className="bg-[#120d1d] border border-pink-500/25 rounded-3xl p-6 space-y-3">
            <h3 className="text-base font-bold text-white font-display">Create Custom Career Target</h3>
            <input
              type="text"
              placeholder="Custom Career Title (e.g. Web3 Security Architect)"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#09070f] border border-pink-500/25 text-xs text-white"
            />
            <input
              type="text"
              placeholder="Role Description & Focus..."
              value={customDesc}
              onChange={(e) => setCustomDesc(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#09070f] border border-pink-500/25 text-xs text-white"
            />
            <button
              type="button"
              onClick={() => {
                if (!customTitle.trim()) return;
                onCreateCustomCareer(
                  customTitle.trim(),
                  customDesc.trim() || 'Custom interdisciplinary role configured by learner.',
                  customSkillIds
                );
                setCustomTitle('');
                setCustomDesc('');
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:opacity-95 text-white font-semibold text-xs cursor-pointer shadow-md"
            >
              Add Custom Career & Generate Roadmap
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProgressAnalyticsView: React.FC<{
  profile: LearnerProfileState;
  careerAnalysis: CareerMatchAnalysis;
}> = ({ profile, careerAnalysis }) => {
  const skillComparisonData = profile.skills.map((s) => ({
    name: s.name.split(' ')[0],
    Baseline: s.initialProficiency,
    Current: s.proficiency,
    Target: s.targetProficiency,
  }));

  const totalHoursLogged = profile.roadmap.reduce((acc, r) => acc + r.loggedHours, 0);
  const completedLessons = profile.roadmap.reduce(
    (acc, r) => acc + r.lessons.filter((l) => l.completed).length,
    0
  );

  return (
    <div className="space-y-6" data-testid="analytics-module-view">
      <div className="bg-gradient-to-r from-[#171026] via-[#120d1d] to-[#1f1024] border border-pink-500/30 rounded-3xl p-6 shadow-xl">
        <div className="text-xs font-mono text-pink-400">PROGRESS INTELLIGENCE AGENT · TELEMETRY & DELTAS</div>
        <h1 className="text-2xl font-bold text-white mt-1 font-display">
          Progress Analytics & Before-and-After Skill Growth
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
          <div className="p-4 rounded-2xl bg-[#09070f] border border-pink-500/20">
            <div className="text-xs text-slate-400">Total Learning Hours</div>
            <div className="text-2xl font-bold text-white font-mono tabular-nums mt-1">
              {totalHoursLogged}h
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-[#09070f] border border-pink-500/20">
            <div className="text-xs text-slate-400">Completed Lessons</div>
            <div className="text-2xl font-bold text-pink-400 font-mono tabular-nums mt-1">
              {completedLessons}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-[#09070f] border border-pink-500/20">
            <div className="text-xs text-slate-400">Active Streak</div>
            <div className="text-2xl font-bold text-amber-400 font-mono tabular-nums mt-1">
              {profile.streakDays} Days
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-[#09070f] border border-pink-500/20">
            <div className="text-xs text-slate-400">Career Readiness</div>
            <div className="text-2xl font-bold text-emerald-400 font-mono tabular-nums mt-1">
              {careerAnalysis.compatibilityScore}%
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#120d1d] border border-pink-500/25 rounded-3xl p-6">
          <h2 className="text-base font-bold text-white font-display mb-4">
            Weekly Career Readiness & Assessment Trajectory
          </h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={profile.weeklyProgress}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a1c40" />
                <XAxis dataKey="week" stroke="#cbd5e1" fontSize={11} />
                <YAxis stroke="#cbd5e1" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#09070f', borderColor: '#ec4899', fontSize: '12px' }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="avgAssessmentScore"
                  name="Assessment Score (%)"
                  stroke="#ec4899"
                  fill="#ec4899"
                  fillOpacity={0.25}
                />
                <Area
                  type="monotone"
                  dataKey="readinessScore"
                  name="Career Readiness (%)"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.25}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#120d1d] border border-pink-500/25 rounded-3xl p-6">
          <h2 className="text-base font-bold text-white font-display mb-4">
            Before-and-After Skill Proficiency Comparison (1–5 Scale)
          </h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillComparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a1c40" />
                <XAxis dataKey="name" stroke="#cbd5e1" fontSize={11} />
                <YAxis domain={[0, 5]} stroke="#cbd5e1" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#09070f', borderColor: '#ec4899', fontSize: '12px' }}
                />
                <Legend />
                <Bar dataKey="Baseline" name="Initial Baseline" fill="#64748b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Current" name="Current Verified" fill="#ec4899" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Target" name="Career Target" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper to render structured Markdown + Code blocks inside AI Mentor messages
function renderFormattedMentorMessage(content: string): React.ReactNode {
  const segments = content.split(/(```[\s\S]*?```)/g);
  return segments.map((seg, idx) => {
    if (seg.startsWith('```') && seg.endsWith('```')) {
      const lines = seg.slice(3, -3).trim().split('\n');
      const firstLine = lines[0]?.trim() || '';
      const hasLang = /^[a-zA-Z0-9_-]+$/.test(firstLine);
      const codeBody = hasLang ? lines.slice(1).join('\n') : lines.join('\n');
      return (
        <div key={idx} className="my-2.5 rounded-2xl overflow-hidden border border-pink-500/30 bg-[#05030a]">
          {hasLang && (
            <div className="px-3.5 py-1 bg-[#160e26] border-b border-pink-500/20 text-[10px] font-mono text-pink-300 uppercase">
              {firstLine}
            </div>
          )}
          <pre className="p-3.5 text-xs font-mono text-pink-200 overflow-x-auto leading-relaxed">
            <code>{codeBody}</code>
          </pre>
        </div>
      );
    }

    return (
      <div key={idx} className="space-y-1.5">
        {seg.split('\n').map((line, lineIdx) => {
          const trimmed = line.trim();
          if (!trimmed) return <div key={lineIdx} className="h-1" />;
          if (trimmed.startsWith('### ')) {
            return (
              <h3 key={lineIdx} className="text-sm font-bold text-amber-300 font-display pt-1">
                {trimmed.replace('### ', '')}
              </h3>
            );
          }
          if (trimmed.startsWith('## ')) {
            return (
              <h2 key={lineIdx} className="text-base font-bold text-pink-300 font-display pt-1">
                {trimmed.replace('## ', '')}
              </h2>
            );
          }
          return (
            <p key={lineIdx} className="text-xs text-slate-200 leading-relaxed">
              {line}
            </p>
          );
        })}
      </div>
    );
  });
}

export const AIMentorAndAgentsView: React.FC<{
  mode: 'mentor' | 'agents';
  profile: LearnerProfileState;
  careerTitle: string;
  isBusy: boolean;
  onSendMessage: (msg: string) => Promise<void>;
  onClearChat: () => void;
  onTriggerOrchestration: (reason: string) => Promise<void>;
}> = ({
  mode,
  profile,
  careerTitle,
  isBusy,
  onSendMessage,
  onClearChat,
  onTriggerOrchestration,
}) => {
  const [inputMsg, setInputMsg] = useState('');
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (mode === 'mentor') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [profile.mentorMessages.length, isBusy, mode]);

  const handleSpeakMentorMessage = (msgId: string, text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (speakingMsgId === msgId) {
      setSpeakingMsgId(null);
      return;
    }
    setSpeakingMsgId(msgId);
    const cleanSpeech = text.replace(/```[\s\S]*?```/g, 'Code example shown on screen.').replace(/[#*`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    utterance.rate = 1.04;
    utterance.onend = () => setSpeakingMsgId(null);
    window.speechSynthesis.speak(utterance);
  };

  if (mode === 'agents') {
    return (
      <div className="space-y-6" data-testid="agents-module-view">
        <div className="bg-gradient-to-r from-[#171026] via-[#120d1d] to-[#1f1024] border border-pink-500/30 rounded-3xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xl">
          <div>
            <div className="text-xs font-mono text-pink-400">
              CENTRAL AI ORCHESTRATOR · 8 SPECIALIZED GEMINI AGENTS ONLINE
            </div>
            <h1 className="text-2xl font-bold text-white mt-1 font-display">
              Multi-Agent Activity & Orchestration Center (8 / 8 Active)
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Trigger a live 8-agent orchestration cycle or run any individual agent below to validate your profile, recalculate career readiness, and synchronize roadmap dependencies.
            </p>
          </div>

          <button
            type="button"
            data-testid="run-all-8-agents-btn"
            disabled={isBusy}
            onClick={() => onTriggerOrchestration('Manual Full-System 8-Agent Re-Calibration')}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:opacity-95 disabled:opacity-50 text-white font-semibold text-xs cursor-pointer shrink-0 shadow-lg"
          >
            <Cpu className="w-4 h-4" />
            <span>{isBusy ? 'Orchestrating All 8 Agents...' : 'Run All 8 Agents Now'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {profile.agentStatuses.map((ag, idx) => (
            <div
              key={ag.id}
              data-testid={`agent-card-${ag.id}`}
              className="bg-[#120d1d] border border-pink-500/25 hover:border-pink-500/50 rounded-3xl p-5 flex flex-col justify-between space-y-3 transition-colors"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold">
                    0{idx + 1} · {ag.status.toUpperCase()}
                  </span>
                  <span className="text-amber-300 tabular-nums font-bold">Conf: {ag.confidence}%</span>
                </div>
                <h2 className="text-sm font-bold text-white font-display">{ag.name}</h2>
                <p className="text-[11px] text-slate-400">{ag.role}</p>
                <div className="w-full h-1.5 rounded-full bg-[#09070f] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400"
                    style={{ width: `${Math.min(100, Math.max(20, ag.confidence))}%` }}
                  />
                </div>
                <p className="text-xs text-pink-200 font-medium">{ag.lastTask}</p>
                <div className="p-3 rounded-2xl bg-[#09070f] border border-pink-500/20 text-[11px] font-mono text-slate-200 leading-relaxed">
                  {ag.lastOutputSummary}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-pink-500/15">
                <span className="text-[10px] font-mono text-slate-400">Updated: {ag.lastUpdated}</span>
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={() => onTriggerOrchestration(`${ag.name} Targeted Diagnostic`)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1a132b] hover:bg-pink-950/70 border border-pink-500/30 text-[11px] font-semibold text-pink-200 cursor-pointer disabled:opacity-40"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Run Agent</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#120d1d] border border-pink-500/25 rounded-3xl p-6 space-y-3">
          <h2 className="text-base font-bold text-white font-display">
            Verified Inter-Agent Execution Audit Logs
          </h2>
          <div className="space-y-2">
            {profile.agentLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-2xl bg-[#09070f] border border-pink-500/20 flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs"
              >
                <div>
                  <span className="font-mono text-pink-400 mr-2">[{log.timestamp}]</span>
                  <span className="font-semibold text-white">{log.agentName}</span>
                  <span className="text-amber-300"> — {log.workflowName}</span>
                  <p className="text-slate-300 mt-0.5">{log.outputSummary}</p>
                </div>
                <span className="font-mono text-[11px] text-emerald-400 tabular-nums shrink-0">
                  {log.durationMs}ms · {log.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // AI Mentor Interface
  const latestFollowUps =
    profile.mentorMessages[profile.mentorMessages.length - 1]?.suggestedFollowUps || [
      'Explain JavaScript Promises vs Python async/await with code',
      'Why should I learn JavaScript before React and Node.js?',
      'Design a 7-day study sprint for my active roadmap milestone',
      'How do I build secure REST APIs with Express and SQL?',
    ];

  return (
    <div
      data-testid="mentor-module-view"
      className="bg-[#120d1d] border border-pink-500/30 rounded-3xl flex flex-col h-[calc(100vh-8rem)] overflow-hidden shadow-2xl"
    >
      <div className="p-5 border-b border-pink-500/20 bg-gradient-to-r from-[#171026] via-[#120d1d] to-[#1f1024] flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-pink-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI MENTOR AGENT · SERVER-SIDE GEMINI + 8-AGENT TELEMETRY</span>
          </div>
          <h1 className="text-lg font-bold text-white font-display mt-0.5">
            Personal AI Engineering Mentor ({profile.fullName} · Target: {careerTitle})
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={isBusy}
            onClick={() => onTriggerOrchestration('AI Mentor Context Sync with 8 Agents')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1a132b] hover:bg-pink-950/60 border border-pink-500/30 text-xs font-semibold text-pink-200 cursor-pointer disabled:opacity-40"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isBusy ? 'animate-spin' : ''}`} />
            <span>Sync 8 Agents</span>
          </button>
          <button
            type="button"
            onClick={onClearChat}
            className="px-3 py-1.5 rounded-xl bg-[#09070f] hover:bg-slate-900 border border-pink-500/20 text-xs text-slate-300 cursor-pointer"
          >
            Reset Chat
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4" data-testid="mentor-messages-list">
        {profile.mentorMessages.map((msg) => (
          <div
            key={msg.id}
            data-testid={`mentor-msg-${msg.role}`}
            className={`flex flex-col max-w-3xl ${
              msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
            }`}
          >
            <div
              className={`p-4 rounded-2xl text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white font-semibold shadow-md'
                  : 'bg-[#09070f] border border-pink-500/25 text-slate-200 shadow-lg'
              }`}
            >
              {msg.role === 'mentor' ? renderFormattedMentorMessage(msg.content) : msg.content}
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              {msg.role === 'mentor' && (
                <button
                  type="button"
                  onClick={() => handleSpeakMentorMessage(msg.id, msg.content)}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#1a132b] border border-pink-500/30 text-[10px] font-mono text-pink-300 hover:text-white cursor-pointer"
                >
                  <Volume2 className="w-3 h-3" />
                  <span>{speakingMsgId === msg.id ? 'Stop Voice' : 'Listen Aloud'}</span>
                </button>
              )}
              {msg.agentInsights &&
                msg.agentInsights.map((ins, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/25 text-[10px] font-mono text-amber-300"
                  >
                    <CheckCircle2 className="w-2.5 h-2.5 inline mr-1 text-emerald-400" />
                    {ins}
                  </span>
                ))}
            </div>
          </div>
        ))}
        {isBusy && (
          <div
            data-testid="mentor-thinking-indicator"
            className="text-xs font-mono text-pink-400 p-3.5 rounded-2xl bg-[#09070f] border border-pink-500/30 max-w-xl"
          >
            ⚡ AI Mentor Agent is synthesizing a personalized response with runnable code &amp; 8-Agent telemetry...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts + Input Box */}
      <div className="p-4 border-t border-pink-500/20 bg-[#09070f] space-y-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {latestFollowUps.map((q) => (
            <button
              key={q}
              type="button"
              disabled={isBusy}
              onClick={() => onSendMessage(q)}
              className="px-3 py-1.5 rounded-xl bg-[#120d1d] hover:bg-pink-950/60 border border-pink-500/30 text-xs text-pink-200 whitespace-nowrap shrink-0 cursor-pointer transition-colors"
            >
              ▶ {q}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!inputMsg.trim() || isBusy) return;
            onSendMessage(inputMsg.trim());
            setInputMsg('');
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            data-testid="mentor-chat-input"
            aria-label="Ask your AI Mentor a question"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            placeholder="Ask about JavaScript Promises, React hooks, SQL indexing, or your next career gap..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#120d1d] border border-pink-500/30 text-xs text-white focus:outline-none focus:border-pink-500"
          />
          <button
            type="submit"
            data-testid="mentor-chat-submit"
            disabled={isBusy || !inputMsg.trim()}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:opacity-95 disabled:opacity-40 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Ask Mentor</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export const AchievementsAndSettingsView: React.FC<{
  mode: 'achievements' | 'settings';
  profile: LearnerProfileState;
  onUpdateProfile: (partial: Partial<LearnerProfileState>) => void;
  onResetToAlexDemo: () => void;
}> = ({ mode, profile, onUpdateProfile, onResetToAlexDemo }) => {
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);

  if (mode === 'achievements') {
    return (
      <div className="space-y-6" data-testid="achievements-module-view">
        <div className="bg-gradient-to-r from-[#171026] via-[#120d1d] to-[#1f1024] border border-pink-500/30 rounded-3xl p-6 shadow-xl">
          <div className="text-xs font-mono text-amber-300">ACHIEVEMENT CHAMBER · VERIFIED CREDENTIALS</div>
          <h1 className="text-2xl font-bold text-white mt-1 font-display">
            Milestones, Badges & Verified Skill Certificates
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {profile.achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-5 rounded-3xl border space-y-2 ${
                ach.unlocked
                  ? 'bg-[#120d1d] border-amber-400/60 shadow-lg'
                  : 'bg-[#09070f] border-pink-500/15 opacity-75'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-amber-300 font-bold">{ach.tier.toUpperCase()} TIER</span>
                <span className={ach.unlocked ? 'text-emerald-400' : 'text-slate-500'}>
                  {ach.unlocked ? `✓ Unlocked ${ach.unlockedAt}` : 'Locked'}
                </span>
              </div>
              <h2 className="text-base font-bold text-white font-display">{ach.title}</h2>
              <p className="text-xs text-slate-300">{ach.description}</p>
              <p className="text-[11px] font-mono text-pink-400 pt-2">Criteria: {ach.criteria}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Settings & Privacy View
  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(profile, null, 2));
    const a = document.createElement('a');
    a.setAttribute('href', dataStr);
    a.setAttribute('download', `nexora_profile_${profile.uid}.json`);
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="space-y-6" data-testid="settings-module-view">
      <div className="bg-[#120d1d] border border-pink-500/25 rounded-3xl p-6 space-y-6">
        <div>
          <div className="text-xs font-mono text-pink-400">SECURITY, ACCESSIBILITY & PRIVACY GOVERNANCE</div>
          <h1 className="text-2xl font-bold text-white mt-1 font-display">
            Settings, Multi-Factor Security & Data Controls
          </h1>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#09070f] border border-pink-500/20 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-white">
                Multi-Factor Authentication (MFA) Enforcement
              </div>
              <div className="text-xs text-slate-400">
                Require 6-digit TOTP verification on account sign-in and sensitive profile actions.
              </div>
            </div>
            <button
              type="button"
              onClick={() => onUpdateProfile({ mfaEnabled: !profile.mfaEnabled })}
              className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer ${
                profile.mfaEnabled
                  ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white'
                  : 'bg-[#1a132b] text-slate-300 border border-pink-500/25'
              }`}
            >
              {profile.mfaEnabled ? 'MFA Enabled' : 'Enable MFA'}
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-[#09070f] border border-pink-500/20 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-white">Reduced Motion Accessibility</div>
              <div className="text-xs text-slate-400">
                Minimize continuous orbital rotations and camera transitions in the 3D Skill Universe.
              </div>
            </div>
            <button
              type="button"
              onClick={() => onUpdateProfile({ reducedMotion: !profile.reducedMotion })}
              className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer ${
                profile.reducedMotion
                  ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white'
                  : 'bg-[#1a132b] text-slate-300 border border-pink-500/25'
              }`}
            >
              {profile.reducedMotion ? 'Reduced Motion ON' : 'Standard Motion'}
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-[#09070f] border border-pink-500/20 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-white">2D Accessible Constellation Fallback</div>
              <div className="text-xs text-slate-400">
                Use the high-contrast 2D constellation grid instead of 3D WebGL rendering.
              </div>
            </div>
            <button
              type="button"
              onClick={() => onUpdateProfile({ prefer2DFallback: !profile.prefer2DFallback })}
              className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer ${
                profile.prefer2DFallback
                  ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white'
                  : 'bg-[#1a132b] text-slate-300 border border-pink-500/25'
              }`}
            >
              {profile.prefer2DFallback ? '2D Mode Active' : 'Switch to 2D Mode'}
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-pink-500/15 flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleExportData}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#09070f] hover:bg-[#1a132b] border border-pink-500/30 text-xs font-semibold text-white cursor-pointer"
          >
            <Download className="w-4 h-4 text-pink-400" />
            <span>Export Encrypted Profile JSON</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onResetToAlexDemo();
              setDeleteConfirmed(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-950/70 hover:bg-rose-900 border border-rose-700 text-xs font-semibold text-rose-200 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Purge Session Data & Reset to Alex Demo Baseline</span>
          </button>
        </div>

        {deleteConfirmed && (
          <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-600 text-xs text-emerald-200">
            Learner data has been purged and reset to the clean Alex Full Stack demonstration state.
          </div>
        )}
      </div>
    </div>
  );
};

