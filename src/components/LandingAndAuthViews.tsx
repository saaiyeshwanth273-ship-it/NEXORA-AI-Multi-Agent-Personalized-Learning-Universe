import React, { useState } from 'react';
import {
  AppPage,
  CareerMatchAnalysis,
  CareerRole,
  LearnerProfileState,
  UniverseZone,
} from '../types/nexora';
import { NexoraUniverse3D } from './NexoraUniverse3D';
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Flame,
} from 'lucide-react';

interface LandingViewProps {
  profile: LearnerProfileState;
  careerAnalysis: CareerMatchAnalysis;
  activeZone: UniverseZone;
  onZoneChange: (zone: UniverseZone) => void;
  onEnterDemoMode: () => void;
  onOpenUserAuth: () => void;
  onSelectSkillForAssessment: (skillId: string) => void;
  onNavigateToPage: (page: AppPage) => void;
  onToggle2DFallback: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  profile,
  careerAnalysis,
  activeZone,
  onZoneChange,
  onEnterDemoMode,
  onOpenUserAuth,
  onSelectSkillForAssessment,
  onNavigateToPage,
  onToggle2DFallback,
}) => {
  return (
    <div id="top" className="min-h-screen bg-[#09070f] text-slate-100 flex flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:rounded-xl focus:bg-pink-600 focus:text-white focus:text-xs focus:font-bold"
      >
        Skip to main content
      </a>

      {/* Top Bar Contract: Zone 1 (Wordmark) — Zone 2 (4 single-line links) — Zone 3 (Learner Login CTA) */}
      <header className="flex items-center justify-between gap-6 px-6 lg:px-12 py-4 border-b border-pink-500/20 bg-[#09070f]/95 sticky top-0 z-30">
        <a
          href="#top"
          className="text-lg font-bold tracking-tight bg-gradient-to-r from-amber-400 via-rose-500 to-fuchsia-500 bg-clip-text text-transparent font-display whitespace-nowrap shrink-0"
        >
          NEXORA AI
        </a>

        <nav
          aria-label="Primary Gateway Navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300"
        >
          <a
            href="#universe-showcase"
            className="hover:text-pink-400 transition-colors whitespace-nowrap shrink-0"
          >
            3D Skill Universe
          </a>
          <a
            href="#dopamine-psychology"
            className="hover:text-pink-400 transition-colors whitespace-nowrap shrink-0"
          >
            Dopamine Learning Reels
          </a>
          <a
            href="#multi-agent-architecture"
            className="hover:text-pink-400 transition-colors whitespace-nowrap shrink-0"
          >
            8-Agent Architecture
          </a>
          <a
            href="#visual-architecture"
            className="hover:text-pink-400 transition-colors whitespace-nowrap shrink-0"
          >
            Adaptive Pathway
          </a>
        </nav>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onEnterDemoMode}
            data-testid="try-demo-scenario"
            className="hidden sm:inline-flex px-3.5 py-2 text-xs font-semibold text-pink-200 bg-[#171026] hover:bg-pink-950/60 border border-pink-500/30 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Explore Sample Scenario
          </button>
          <button
            type="button"
            onClick={onOpenUserAuth}
            data-testid="open-user-login-btn"
            className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:opacity-95 rounded-xl transition-opacity whitespace-nowrap shrink-0 cursor-pointer shadow-md"
          >
            Learner Login / Sign Up
          </button>
        </div>
      </header>

      {/* Hero Split Section + Interactive 3D Gateway Preview */}
      <main id="main-content" tabIndex={-1} className="flex-1">
        <section className="max-w-[1380px] mx-auto px-6 lg:px-12 pt-10 pb-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6 bg-gradient-to-b from-[#171026] via-[#120d1d] to-[#0d0917] border border-pink-500/30 rounded-3xl p-7 lg:p-9 shadow-2xl">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/15 border border-pink-500/30 text-xs font-mono text-pink-300 tracking-wide">
                  <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>DOPAMINE-ENGINEERED MULTI-AGENT LEARNING</span>
                </div>

                <h1
                  className="text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-white leading-[1.12] font-display"
                  style={{ textWrap: 'balance' }}
                >
                  Discover your potential. Master your skills. Build your future.
                </h1>

                <p className="text-slate-200 text-base leading-relaxed">
                  Turn mindless scrolling into career mastery. NEXORA AI combines <span className="text-pink-300 font-semibold">Instagram-style 60-second Skill Reels</span>, a <span className="text-amber-300 font-semibold">Gemini AI Voice Coach</span>, and an <span className="text-fuchsia-300 font-semibold">Interactive 3D Circuit Skill Universe</span> that adapts your learning pace from every test score.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={onOpenUserAuth}
                    className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:opacity-95 text-white font-semibold text-sm transition-opacity cursor-pointer whitespace-nowrap shrink-0 shadow-lg"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Start Fresh Learner Account (No Demo Data)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={onEnterDemoMode}
                    className="px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-700 font-medium text-xs transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Preview Sample Scenario (Alex · Full Stack)
                  </button>
                </div>
              </div>

              <div className="pt-6 border-t border-pink-500/20 grid grid-cols-3 gap-4 text-left">
                <div>
                  <div className="text-xl font-bold text-white font-mono tabular-nums">8 Agents</div>
                  <div className="text-xs text-pink-300/80 mt-0.5">+ Gemini Voice Coach</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-amber-400 font-mono tabular-nums">Skill Reels</div>
                  <div className="text-xs text-pink-300/80 mt-0.5">Healthy Dopamine Loop</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-pink-400 font-mono tabular-nums">3D Globes</div>
                  <div className="text-xs text-pink-300/80 mt-0.5">Circuit Hub + Reticles</div>
                </div>
              </div>
            </div>

            {/* Live Interactive 3D Skill Universe in Hero */}
            <div id="universe-showcase" className="lg:col-span-7 flex flex-col">
              <NexoraUniverse3D
                skills={profile.skills}
                roadmap={profile.roadmap}
                careerAnalysis={careerAnalysis}
                activeZone={activeZone}
                onZoneChange={onZoneChange}
                onSelectSkillForAssessment={(skillId) => {
                  onSelectSkillForAssessment(skillId);
                }}
                onNavigateToPage={onNavigateToPage}
                reducedMotion={profile.reducedMotion}
                prefer2DFallback={profile.prefer2DFallback}
                onToggle2DFallback={onToggle2DFallback}
                compactMode={true}
              />
            </div>
          </div>
        </section>

        {/* Human Psychology, Color Psychology & Dopamine Functionality Section */}
        <section id="dopamine-psychology" className="max-w-[1380px] mx-auto px-6 lg:px-12 py-12 border-t border-pink-500/15">
          <div className="bg-gradient-to-r from-[#171026] via-[#120d1d] to-[#1f1024] border border-pink-500/30 rounded-3xl p-6 lg:p-8 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-pink-500/20 pb-5">
              <div>
                <div className="text-xs font-mono text-amber-300">
                  NEURO-DESIGN · HUMAN PSYCHOLOGY · COLOR PSYCHOLOGY · DOPAMINE LOOP
                </div>
                <h2 className="text-2xl font-bold text-white mt-1 font-display">
                  Why NEXORA AI Feels as Effortless as Scrolling Instagram — With Real Career Outcomes
                </h2>
              </div>
              <button
                type="button"
                onClick={onOpenUserAuth}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white font-semibold text-xs whitespace-nowrap shrink-0 cursor-pointer"
              >
                Create Clean Learner Profile →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-[#09070f] border border-pink-500/25 space-y-2">
                <div className="text-xs font-mono text-rose-400">01. COLOR PSYCHOLOGY PALETTE</div>
                <h3 className="text-base font-bold text-white">Sunset Coral, Magenta & Gold</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Warm electric coral (<span className="font-mono text-rose-400">#ff3040</span>) triggers attentional alertness, magenta-violet (<span className="font-mono text-pink-400">#ec4899</span>) stimulates creative curiosity, and amber gold (<span className="font-mono text-amber-300">#f59e0b</span>) signals reward completion in the brain’s striatum.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#09070f] border border-pink-500/25 space-y-2">
                <div className="text-xs font-mono text-amber-300">02. ZEIGARNIK & VARIABLE REWARDS</div>
                <h3 className="text-base font-bold text-white">60-Second Skill Stories & Micro-Quizzes</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Glowing circular Skill Story rings create constructive closure tension (Zeigarnik Effect). Every vertical Reel ends with a 1-tap micro-quiz that delivers instant XP bursts and confidence boosts.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#09070f] border border-pink-500/25 space-y-2">
                <div className="text-xs font-mono text-emerald-400">03. TEST-CALIBRATED ADAPTATION</div>
                <h3 className="text-base font-bold text-white">Dynamic Pace From Your Test Results</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Scoring &lt;60% shifts your roadmap into <span className="text-amber-300">Guided Foundations (Step-by-Step)</span>; 60–79% activates <span className="text-pink-300">Applied Practice</span>; ≥80% unlocks <span className="text-emerald-300">Accelerated Mastery Fast-Track</span>.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Visual Architecture & Triptych Reference Integration */}
        <section id="visual-architecture" className="max-w-[1380px] mx-auto px-6 lg:px-12 py-12 border-t border-pink-500/15">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <div className="text-xs font-mono text-pink-400">SPATIAL LEARNING ARCHITECTURE</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white font-display" style={{ textWrap: 'balance' }}>
                Click Any 3D Skill Globe or HUD Reticle to Fly & Scroll Directly to Its Model Card
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Every skill station is connected to the Central Neural Processor via glowing PCB circuit conduits and rendered with 3D-to-2D projected HUD reticles. Clicking a globe or reticle flies the camera and smoothly scrolls the page to that specific skill model card.
              </p>
              <div className="space-y-2.5 pt-2 text-xs text-slate-300">
                <div className="p-3 rounded-xl bg-[#120d1d] border border-pink-500/25">
                  <span className="font-semibold text-pink-400">01. Mastered Globes Illuminate:</span> Verified skills (Level 4–5) glow in radiant emerald-cyan and gold across the circuit hub.
                </div>
                <div className="p-3 rounded-xl bg-[#120d1d] border border-pink-500/25">
                  <span className="font-semibold text-amber-400">02. Weak Globes Pulse for Revision:</span> Skills scoring below 60% inject step-by-step remediation drills.
                </div>
                <div className="p-3 rounded-xl bg-[#120d1d] border border-pink-500/25">
                  <span className="font-semibold text-fuchsia-400">03. Clean Zero-Demo New Users:</span> New learners begin with all globes at 0/5 (Unexplored) and build real verified evidence.
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-3xl overflow-hidden border border-pink-500/30 bg-[#120d1d] relative">
                <img
                  src="/assets/aistudio/Futuristic_Learning_Journey_Triptych_e0362fc3.png"
                  alt="NEXORA AI Futuristic Learning Journey Triptych: Gateway Citadel, Neural Core Constellation, and Floating Island Learning Pathway"
                  referrerPolicy="no-referrer"
                  className="w-full h-[360px] object-cover"
                />
                <div className="p-4 bg-[#09070f]/95 border-t border-pink-500/25 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-300">
                  <span>Nexora Gateway · Neural Core Skill Globes · Floating Milestone Pathway</span>
                  <button
                    type="button"
                    onClick={() => {
                      onNavigateToPage('universe');
                    }}
                    className="text-pink-400 hover:text-pink-300 font-semibold cursor-pointer"
                  >
                    Explore Full-Screen 3D Skill Universe →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 8-Agent Architecture Grid */}
        <section id="multi-agent-architecture" className="max-w-[1380px] mx-auto px-6 lg:px-12 py-12 border-t border-pink-500/15">
          <div className="max-w-2xl mb-8">
            <div className="text-xs font-mono text-pink-400">CENTRAL MULTI-AGENT ORCHESTRATION</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1 font-display">
              Eight Specialized AI Agents Collaborating in Real Time
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {profile.agentStatuses.map((agent, index) => (
              <div
                key={agent.id}
                className="p-5 rounded-2xl bg-[#120d1d] border border-pink-500/25 flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-mono text-amber-400">0{index + 1}. AGENT MODULE</div>
                  <h3 className="text-base font-semibold text-white mt-1">{agent.name}</h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{agent.role}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-pink-200 font-mono">
                  Output: {agent.lastOutputSummary}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-pink-500/20 px-6 lg:px-12 py-6 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-4">
        <span>NEXORA AI — Dopamine-Engineered Multi-Agent Learning Ecosystem</span>
        <div className="flex items-center gap-6">
          <button type="button" onClick={onOpenUserAuth} className="hover:text-white cursor-pointer">
            Learner Login (No Demo Data)
          </button>
          <button type="button" onClick={onEnterDemoMode} className="hover:text-white cursor-pointer">
            Sample Alex Scenario
          </button>
        </div>
      </footer>
    </div>
  );
};

interface AuthAndOnboardingProps {
  mode: 'user-auth' | 'onboarding';
  profile: LearnerProfileState;
  careers: CareerRole[];
  isAuthenticated: boolean;
  authError: string | null;
  onGoogleSignInForUser: () => Promise<void>;
  onStartNewBlankLearner: (fullName: string, email: string, targetCareerId: string) => void;
  onSaveOnboardingProfile: (updated: Partial<LearnerProfileState>, selectedSkillIds: string[]) => void;
  onBackToLanding: () => void;
}

export const AuthAndOnboardingView: React.FC<AuthAndOnboardingProps> = ({
  mode,
  profile,
  careers,
  authError,
  onGoogleSignInForUser,
  onStartNewBlankLearner,
  onSaveOnboardingProfile,
  onBackToLanding,
}) => {
  // User Auth State (Clean Zero-Demo Initialization)
  const [userTab, setUserTab] = useState<'login' | 'signup'>('signup');
  const [learnerNameInput, setLearnerNameInput] = useState('');
  const [learnerEmailInput, setLearnerEmailInput] = useState('');
  const [learnerPasswordInput, setLearnerPasswordInput] = useState('');
  const [learnerCareerId, setLearnerCareerId] = useState(careers[0]?.id || 'fullstack');
  const [formError, setFormError] = useState<string | null>(null);

  // Onboarding Wizard State
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [fullName, setFullName] = useState(profile.fullName);
  const [role, setRole] = useState<LearnerProfileState['role']>(profile.role);
  const [qualification, setQualification] = useState(profile.qualification);
  const [institution, setInstitution] = useState(profile.institution);
  const [level, setLevel] = useState(profile.level);
  const [targetCareerId, setTargetCareerId] = useState(profile.targetCareerId);
  const [learningStyle, setLearningStyle] = useState<LearnerProfileState['learningStyle']>(profile.learningStyle);
  const [weeklyHours, setWeeklyHours] = useState(profile.weeklyHoursAvailable);
  const [shortTermGoal, setShortTermGoal] = useState(profile.shortTermGoal);
  const [longTermGoal, setLongTermGoal] = useState(profile.longTermGoal);
  const [workExperience, setWorkExperience] = useState(profile.workExperience);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    profile.skills.filter((s) => s.proficiency >= 2).map((s) => s.id)
  );

  const toggleSkillSelection = (id: string) => {
    setSelectedSkills((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  // 1. DEDICATED LEARNER LOGIN / SIGN-UP PAGE (ZERO DEMO DATA FOR NEW USERS)
  if (mode === 'user-auth') {
    const handleCleanLearnerSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setFormError(null);
      if (!learnerEmailInput.trim() || !learnerEmailInput.includes('@')) {
        setFormError('Please enter a valid learner email address.');
        return;
      }
      if (learnerPasswordInput.trim().length < 4) {
        setFormError('Please enter a password (at least 4 characters).');
        return;
      }
      const cleanName =
        learnerNameInput.trim() ||
        learnerEmailInput.split('@')[0].replace(/[._-]/g, ' ') ||
        'New Learner';
      onStartNewBlankLearner(cleanName, learnerEmailInput.trim(), learnerCareerId);
    };

    return (
      <div
        className="min-h-screen bg-[#09070f] text-slate-100 flex flex-col justify-center items-center p-6"
        data-testid="user-login-page"
      >
        <div className="w-full max-w-md bg-gradient-to-b from-[#171026] to-[#120d1d] border border-pink-500/35 rounded-3xl p-7 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-mono text-pink-400">
                LEARNER PORTAL · ZERO DEMO DATA FOR NEW USERS
              </div>
              <h1 className="text-2xl font-bold text-white mt-1 font-display">
                Learner Login & Sign Up
              </h1>
            </div>
            <button
              type="button"
              onClick={onBackToLanding}
              className="text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              ← Gateway
            </button>
          </div>

          {/* Primary Google OAuth Login Button */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={onGoogleSignInForUser}
              data-testid="google-user-login-btn"
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:opacity-95 text-xs font-bold text-white flex items-center justify-center gap-2.5 transition-opacity cursor-pointer shadow-lg"
            >
              <ShieldCheck className="w-4 h-4 text-white" />
              <span>Continue with Google Login (Firebase Auth)</span>
            </button>
            <p className="text-[11px] text-slate-400 text-center">
              New Google accounts automatically initialize a clean, zero-demo-data skill profile.
            </p>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono">
            <div className="h-px flex-1 bg-slate-800" />
            <span>OR CREATE CLEAN LEARNER SESSION</span>
            <div className="h-px flex-1 bg-slate-800" />
          </div>

          {/* Login / Sign Up Switcher */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-[#09070f] rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => {
                setUserTab('signup');
                setFormError(null);
              }}
              className={`py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                userTab === 'signup'
                  ? 'bg-pink-500 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              New Learner (Clean Profile)
            </button>
            <button
              type="button"
              onClick={() => {
                setUserTab('login');
                setFormError(null);
              }}
              className={`py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                userTab === 'login'
                  ? 'bg-pink-500 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Existing Learner Sign In
            </button>
          </div>

          {(authError || formError) && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-700 text-xs text-rose-200">
              {formError || authError}
            </div>
          )}

          <form onSubmit={handleCleanLearnerSubmit} className="space-y-3.5">
            {userTab === 'signup' && (
              <div>
                <label htmlFor="learner-name" className="block text-xs font-medium text-slate-300 mb-1">
                  Your Full Name
                </label>
                <input
                  id="learner-name"
                  type="text"
                  value={learnerNameInput}
                  onChange={(e) => setLearnerNameInput(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#09070f] border border-slate-800 text-sm text-white focus:outline-none focus:border-pink-500"
                />
              </div>
            )}

            <div>
              <label htmlFor="learner-email" className="block text-xs font-medium text-slate-300 mb-1">
                Learner Email Address
              </label>
              <input
                id="learner-email"
                type="email"
                value={learnerEmailInput}
                onChange={(e) => setLearnerEmailInput(e.target.value)}
                placeholder="you@university.edu"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#09070f] border border-slate-800 text-sm text-white focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label htmlFor="learner-password" className="block text-xs font-medium text-slate-300 mb-1">
                Password
              </label>
              <input
                id="learner-password"
                type="password"
                value={learnerPasswordInput}
                onChange={(e) => setLearnerPasswordInput(e.target.value)}
                placeholder="Enter password (min 4 chars)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#09070f] border border-slate-800 text-sm text-white focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label htmlFor="learner-career" className="block text-xs font-medium text-slate-300 mb-1">
                Desired Career Target
              </label>
              <select
                id="learner-career"
                value={learnerCareerId}
                onChange={(e) => setLearnerCareerId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#09070f] border border-slate-800 text-sm text-white"
              >
                {careers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              data-testid="start-clean-learner-btn"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:opacity-95 text-white font-semibold text-sm transition-opacity cursor-pointer shadow-md"
            >
              {userTab === 'signup'
                ? 'Start Clean Profile (Zero Demo Data)'
                : 'Sign In to Learner Workspace'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. ONBOARDING WIZARD VIEW (FOR NEW USERS STARTING WITH ZERO DEMO DATA)
  return (
    <div className="min-h-screen bg-[#09070f] text-slate-100 py-10 px-6 flex flex-col items-center">
      <div className="w-full max-w-3xl bg-[#120d1d] border border-pink-500/30 rounded-3xl p-7 lg:p-9 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="text-xs font-mono text-pink-400">
              STEP {step} OF 3 · CLEAN PROFILE ONBOARDING (ZERO DEMO DATA)
            </div>
            <h1 className="text-2xl font-bold text-white mt-1 font-display">
              Configure Your Personalized Learning Profile
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((sNum) => (
              <button
                key={sNum}
                type="button"
                onClick={() => setStep(sNum as 1 | 2 | 3)}
                className={`px-3 py-1 rounded-lg text-xs font-mono cursor-pointer ${
                  step === sNum
                    ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold'
                    : 'bg-slate-900 text-slate-400'
                }`}
              >
                0{sNum}
              </button>
            ))}
          </div>
        </div>

        {step === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="onb-name" className="block text-xs font-medium text-slate-300 mb-1">
                Full Name
              </label>
              <input
                id="onb-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#09070f] border border-slate-800 text-sm text-white"
              />
            </div>

            <div>
              <label htmlFor="onb-role" className="block text-xs font-medium text-slate-300 mb-1">
                Account Role
              </label>
              <select
                id="onb-role"
                value={role}
                onChange={(e) => setRole(e.target.value as LearnerProfileState['role'])}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#09070f] border border-slate-800 text-sm text-white"
              >
                <option value="Student">Student</option>
                <option value="Working Professional">Working Professional</option>
                <option value="University Scholar">University Scholar</option>
                <option value="Organization Lead">Organization Lead</option>
              </select>
            </div>

            <div>
              <label htmlFor="onb-qual" className="block text-xs font-medium text-slate-300 mb-1">
                Educational Qualification
              </label>
              <input
                id="onb-qual"
                type="text"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                placeholder="e.g., B.S. Computer Science / Self-Taught"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#09070f] border border-slate-800 text-sm text-white"
              />
            </div>

            <div>
              <label htmlFor="onb-inst" className="block text-xs font-medium text-slate-300 mb-1">
                Institution or Organization
              </label>
              <input
                id="onb-inst"
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="Your university or company"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#09070f] border border-slate-800 text-sm text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="onb-exp" className="block text-xs font-medium text-slate-300 mb-1">
                Work & Practical Project Experience
              </label>
              <input
                id="onb-exp"
                type="text"
                value={workExperience}
                onChange={(e) => setWorkExperience(e.target.value)}
                placeholder="Describe any projects or internships (leave blank if complete beginner)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#09070f] border border-slate-800 text-sm text-white"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <p className="text-xs text-slate-300">
              Select only the skills you already possess. Leave all unselected to start at 0/5 across every node and let diagnostic tests calibrate your pace:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {profile.skills.map((skill) => {
                const active = selectedSkills.includes(skill.id);
                return (
                  <button
                    key={skill.id}
                    type="button"
                    onClick={() => toggleSkillSelection(skill.id)}
                    className={`p-3.5 rounded-xl border text-left transition-colors cursor-pointer flex items-center justify-between ${
                      active
                        ? 'bg-pink-950/60 border-pink-400 text-white'
                        : 'bg-[#09070f] border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold">{skill.name}</div>
                      <div className="text-[11px] text-slate-400">{skill.category}</div>
                    </div>
                    <span className="text-xs font-mono">{active ? 'Have Basics' : '0/5 Blank'}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="onb-career" className="block text-xs font-medium text-slate-300 mb-1">
                Target Career Goal
              </label>
              <select
                id="onb-career"
                value={targetCareerId}
                onChange={(e) => setTargetCareerId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#09070f] border border-slate-800 text-sm text-white"
              >
                {careers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} ({c.category})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="onb-style" className="block text-xs font-medium text-slate-300 mb-1">
                Preferred Learning Style
              </label>
              <select
                id="onb-style"
                value={learningStyle}
                onChange={(e) => setLearningStyle(e.target.value as LearnerProfileState['learningStyle'])}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#09070f] border border-slate-800 text-sm text-white"
              >
                <option value="Visual & Interactive 3D">Visual & Interactive 3D</option>
                <option value="Project-First">Project-First</option>
                <option value="Documentation & Deep Dive">Documentation & Deep Dive</option>
                <option value="Balanced Adaptive">Balanced Adaptive</option>
              </select>
            </div>

            <div>
              <label htmlFor="onb-hours" className="block text-xs font-medium text-slate-300 mb-1">
                Available Learning Hours / Week ({weeklyHours} hrs)
              </label>
              <input
                id="onb-hours"
                type="range"
                min={4}
                max={40}
                value={weeklyHours}
                onChange={(e) => setWeeklyHours(Number(e.target.value))}
                className="w-full accent-pink-500"
              />
            </div>

            <div>
              <label htmlFor="onb-level" className="block text-xs font-medium text-slate-300 mb-1">
                Current Level
              </label>
              <input
                id="onb-level"
                type="text"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#09070f] border border-slate-800 text-sm text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="onb-short" className="block text-xs font-medium text-slate-300 mb-1">
                Short-Term Learning Goal (Next 6 Weeks)
              </label>
              <input
                id="onb-short"
                type="text"
                value={shortTermGoal}
                onChange={(e) => setShortTermGoal(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#09070f] border border-slate-800 text-sm text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="onb-long" className="block text-xs font-medium text-slate-300 mb-1">
                Long-Term Career Objective
              </label>
              <input
                id="onb-long"
                type="text"
                value={longTermGoal}
                onChange={(e) => setLongTermGoal(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#09070f] border border-slate-800 text-sm text-white"
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}
              className="px-4 py-2 rounded-xl bg-slate-900 text-slate-300 text-xs font-medium cursor-pointer"
            >
              Previous Step
            </button>
          ) : (
            <button
              type="button"
              onClick={onBackToLanding}
              className="px-4 py-2 rounded-xl bg-slate-900 text-slate-300 text-xs font-medium cursor-pointer"
            >
              Go to Workspace
            </button>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s + 1) as 1 | 2 | 3)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-semibold text-xs cursor-pointer"
            >
              Continue →
            </button>
          ) : (
            <button
              type="button"
              onClick={() =>
                onSaveOnboardingProfile(
                  {
                    fullName: fullName.trim() || 'New Learner',
                    role,
                    qualification,
                    institution,
                    level,
                    targetCareerId,
                    learningStyle,
                    weeklyHoursAvailable: weeklyHours,
                    shortTermGoal,
                    longTermGoal,
                    workExperience,
                  },
                  selectedSkills
                )
              }
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white font-semibold text-xs cursor-pointer"
            >
              Synthesize Adaptive Roadmap & Launch Universe
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

