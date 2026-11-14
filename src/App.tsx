import React, { useEffect, useMemo, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import {
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType,
} from './firebase';
import {
  AppPage,
  AssessmentSubmissionResult,
  CareerRole,
  LearnerProfileState,
  ProficiencyScale,
  UniverseZone,
} from './types/nexora';
import {
  ASSESSMENT_QUESTION_BANK,
  CAREER_ROLES,
  INITIAL_SKILL_REELS,
  analyzeCareerCompatibility,
  createBlankLearnerState,
  createInitialAlexState,
  deriveSkillStatus,
  evaluateAssessmentSubmission,
  extractSkillsFromText,
  generateAdaptiveRoadmap,
} from './lib/learningEngine';
import { NexoraUniverse3D } from './components/NexoraUniverse3D';
import {
  LandingView,
  AuthAndOnboardingView,
} from './components/LandingAndAuthViews';
import {
  RoadmapView,
  AssessmentCenterView,
  ResourceLibraryView,
} from './components/AssessmentAndRoadmapViews';
import {
  SkillAndProfileViews,
  CareerExplorerView,
  ProgressAnalyticsView,
  AIMentorAndAgentsView,
  AchievementsAndSettingsView,
} from './components/IntelligenceAndAgentViews';
import {
  GeminiVoiceAssistantWidget,
  DopamineReelsFeedView,
} from './components/DopamineReelsAndVoiceViews';
import {
  LayoutDashboard,
  Sparkles,
  UserCircle,
  BrainCircuit,
  Compass,
  Route,
  BookOpen,
  ClipboardCheck,
  BarChart3,
  MessageSquareCode,
  Cpu,
  Award,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  Flame,
} from 'lucide-react';

const LOCAL_STORAGE_KEY = 'nexora_ai_learner_state_v2';

export default function App() {
  const [profile, setProfile] = useState<LearnerProfileState>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.skills) && Array.isArray(parsed.roadmap)) {
          return {
            ...parsed,
            skillReels: parsed.skillReels || INITIAL_SKILL_REELS,
            dopamineXp: typeof parsed.dopamineXp === 'number' ? parsed.dopamineXp : 150,
          };
        }
      }
    } catch {
      // Fallback to initial state
    }
    return createInitialAlexState();
  });

  const [activePage, setActivePage] = useState<AppPage>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('autostart') === '1' ? 'dashboard' : 'landing';
  });

  const [activeZone, setActiveZone] = useState<UniverseZone>('skill_universe');
  const [selectedAssessmentSkillId, setSelectedAssessmentSkillId] = useState<string>('javascript');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAiBusy, setIsAiBusy] = useState<boolean>(false);
  const [isMentorBusy, setIsMentorBusy] = useState<boolean>(false);

  const allCareers = useMemo(
    () => [...CAREER_ROLES, ...(profile.customCareers || [])],
    [profile.customCareers]
  );

  const currentCareer = useMemo(
    () => allCareers.find((c) => c.id === profile.targetCareerId) || allCareers[0],
    [allCareers, profile.targetCareerId]
  );

  const careerAnalysis = useMemo(
    () => analyzeCareerCompatibility(profile.skills, currentCareer),
    [profile.skills, currentCareer]
  );

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // Ignore storage quota errors
    }
  }, [profile]);

  const persistProfileToFirestore = async (nextState: LearnerProfileState, user: User | null) => {
    if (!user || !user.emailVerified) return;
    const path = `learners/${user.uid}`;
    try {
      const ref = doc(db, 'learners', user.uid);
      const snap = await getDoc(ref);
      const payload = {
        uid: user.uid,
        fullName: nextState.fullName.slice(0, 120),
        qualification: (nextState.qualification || '').slice(0, 160),
        institution: (nextState.institution || '').slice(0, 160),
        level: (nextState.level || '').slice(0, 80),
        targetCareerId: nextState.targetCareerId.slice(0, 80),
        learningStyle: (nextState.learningStyle || '').slice(0, 60),
        weeklyHoursAvailable: Math.min(100, Math.max(1, Number(nextState.weeklyHoursAvailable) || 12)),
        shortTermGoal: (nextState.shortTermGoal || '').slice(0, 500),
        longTermGoal: (nextState.longTermGoal || '').slice(0, 500),
        mfaEnabled: Boolean(nextState.mfaEnabled),
        statePayload: {
          skills: nextState.skills,
          roadmap: nextState.roadmap,
          assessmentHistory: nextState.assessmentHistory.slice(0, 20),
          weeklyProgress: nextState.weeklyProgress,
          achievements: nextState.achievements,
        },
        updatedAt: serverTimestamp(),
      };

      if (!snap.exists()) {
        await setDoc(ref, { ...payload, createdAt: serverTimestamp() });
      } else {
        await setDoc(ref, payload, { merge: true });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        const path = `learners/${user.uid}`;
        try {
          const snap = await getDoc(doc(db, 'learners', user.uid));
          if (snap.exists()) {
            const data = snap.data();
            setProfile((prev) => ({
              ...prev,
              uid: user.uid,
              isDemo: false,
              fullName: data.fullName || user.displayName || prev.fullName,
              email: user.email || prev.email,
              targetCareerId: data.targetCareerId || prev.targetCareerId,
              weeklyHoursAvailable: data.weeklyHoursAvailable || prev.weeklyHoursAvailable,
              skills: data.statePayload?.skills || prev.skills,
              roadmap: data.statePayload?.roadmap || prev.roadmap,
            }));
          } else {
            // Brand-new authenticated Google user -> Initialize 100% CLEAN profile with ZERO demo data!
            const cleanBlankState = createBlankLearnerState(
              user.uid,
              user.displayName || 'New Learner',
              user.email || '',
              'fullstack'
            );
            setProfile(cleanBlankState);
            await persistProfileToFirestore(cleanBlankState, user);
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, path);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const updateProfileState = (updater: (prev: LearnerProfileState) => LearnerProfileState) => {
    setProfile((prev) => {
      const next = updater(prev);
      if (firebaseUser) {
        persistProfileToFirestore(next, firebaseUser).catch(() => {});
      }
      return next;
    });
  };

  const handleGoogleSignInForUser = async () => {
    setAuthError(null);
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const user = cred.user;
      const snap = await getDoc(doc(db, 'learners', user.uid));
      if (!snap.exists()) {
        const cleanBlank = createBlankLearnerState(
          user.uid,
          user.displayName || 'New Learner',
          user.email || '',
          'fullstack'
        );
        setProfile(cleanBlank);
        await persistProfileToFirestore(cleanBlank, user);
      }
      setActivePage('dashboard');
    } catch (err) {
      setAuthError(
        err instanceof Error
          ? `${err.message} — Or fill the New Learner form below to start a clean profile immediately.`
          : 'Google Sign-In popup closed. You can also start a clean profile below.'
      );
    }
  };

  const handleStartNewBlankLearner = (
    fullName: string,
    email: string,
    targetCareerId: string
  ) => {
    const cleanProfile = createBlankLearnerState(
      `learner_${Date.now()}`,
      fullName,
      email,
      targetCareerId
    );
    setProfile(cleanProfile);
    setActivePage('dashboard');
  };

  const handleEarnDopamineXp = (xpToAdd: number, _reason: string) => {
    updateProfileState((prev) => ({
      ...prev,
      dopamineXp: (prev.dopamineXp || 0) + xpToAdd,
    }));
  };

  const handleTriggerOrchestration = async (reason: string) => {
    setIsAiBusy(true);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3500);
    try {
      const response = await fetch('/api/agents/orchestrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          learnerName: profile.fullName,
          targetCareer: currentCareer.title,
          skills: profile.skills,
          weeklyHours: profile.weeklyHoursAvailable,
          triggerReason: reason,
        }),
      });
      const data = await response.json();
      const nowTime = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      updateProfileState((prev) => {
        const updatedAgents = prev.agentStatuses.map((ag) => {
          const found = Array.isArray(data.agentOutputs)
            ? data.agentOutputs.find((o: any) => o.agentId === ag.id)
            : null;
          if (!found) {
            return { ...ag, status: 'completed' as const, lastUpdated: 'Just now' };
          }
          return {
            ...ag,
            status: 'completed' as const,
            lastTask: found.taskPerformed || ag.lastTask,
            lastOutputSummary: found.outputSummary || ag.lastOutputSummary,
            confidence: found.confidence || ag.confidence,
            lastUpdated: 'Just now',
          };
        });

        const newLog = {
          id: `log_${Date.now()}`,
          timestamp: nowTime,
          workflowName: reason,
          agentId: 'learning_architect_agent' as const,
          agentName: 'Central Multi-Agent Orchestrator',
          inputSummary: `${prev.fullName} · ${currentCareer.title} (${prev.weeklyHoursAvailable}h/wk)`,
          outputSummary: data.executiveSummary || 'Synchronized 8 agents and roadmap priorities.',
          durationMs: Number(data.durationMs) || 450,
          status: (data.mode === 'live_gemini' ? 'verified' : 'reconciled') as
            | 'verified'
            | 'reconciled',
        };

        return {
          ...prev,
          dopamineXp: (prev.dopamineXp || 0) + 15,
          agentStatuses: updatedAgents,
          agentLogs: [newLog, ...prev.agentLogs.slice(0, 14)],
        };
      });
    } catch {
      const nowTime = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      updateProfileState((prev) => ({
        ...prev,
        dopamineXp: (prev.dopamineXp || 0) + 15,
        agentStatuses: prev.agentStatuses.map((ag) => ({
          ...ag,
          status: 'completed' as const,
          lastUpdated: 'Just now',
        })),
        agentLogs: [
          {
            id: `log_${Date.now()}`,
            timestamp: nowTime,
            workflowName: reason,
            agentId: 'learning_architect_agent' as const,
            agentName: 'Central Multi-Agent Orchestrator',
            inputSummary: `${prev.fullName} · ${currentCareer.title} (${prev.weeklyHoursAvailable}h/wk)`,
            outputSummary: `All 8 NEXORA Agents synchronized (${reason}) and calibrated your ${currentCareer.title} pathway.`,
            durationMs: 420,
            status: 'reconciled' as const,
          },
          ...prev.agentLogs.slice(0, 14),
        ],
      }));
    } finally {
      clearTimeout(timer);
      setIsAiBusy(false);
    }
  };

  const handleSelectCareer = (careerId: string) => {
    const chosen = allCareers.find((c) => c.id === careerId);
    if (!chosen) return;
    updateProfileState((prev) => ({
      ...prev,
      targetCareerId: careerId,
      roadmap: generateAdaptiveRoadmap(prev.skills, chosen, prev.weeklyHoursAvailable),
    }));
    handleTriggerOrchestration(`Target Career Switched to ${chosen.title}`);
  };

  const handleSubmitAssessment = (
    skillId: string,
    answers: Record<string, string>
  ): AssessmentSubmissionResult => {
    const targetSkill = profile.skills.find((s) => s.id === skillId) || profile.skills[0];
    const questions = ASSESSMENT_QUESTION_BANK.filter((q) => q.skillId === targetSkill.id);
    const effectiveQuestions =
      questions.length > 0
        ? questions
        : [
            {
              id: `q_gen_${targetSkill.id}`,
              skillId: targetSkill.id,
              skillName: targetSkill.name,
              type: 'Multiple Choice' as const,
              difficulty: 'Intermediate' as const,
              prompt: `Which architectural practice best demonstrates production-grade ${targetSkill.name} competency?`,
              options: [
                'Automated verification, modular boundaries, and explicit error handling',
                'Hardcoding credentials and skipping input validation',
              ],
              correctAnswer:
                'Automated verification, modular boundaries, and explicit error handling',
              explanation: `Production ${targetSkill.name} requires modular design and automated testing.`,
              remediationTip: `Review ${targetSkill.name} in the Knowledge Library.`,
            },
          ];

    const { result, updatedSkill, updatedRoadmap } = evaluateAssessmentSubmission(
      targetSkill,
      effectiveQuestions,
      answers,
      profile.roadmap
    );

    updateProfileState((prev) => {
      const nextSkills = prev.skills.map((s) => (s.id === updatedSkill.id ? updatedSkill : s));
      const nextCompatibility = analyzeCareerCompatibility(
        nextSkills,
        currentCareer
      ).compatibilityScore;

      const nextAchievements = prev.achievements.map((ach) => {
        if (
          ach.id === 'ach_js_quantum' &&
          updatedSkill.id === 'javascript' &&
          result.scorePercentage >= 80
        ) {
          return { ...ach, unlocked: true, unlockedAt: new Date().toLocaleDateString() };
        }
        if (ach.id === 'ach_fullstack_portal' && nextCompatibility >= 85) {
          return { ...ach, unlocked: true, unlockedAt: new Date().toLocaleDateString() };
        }
        return ach;
      });

      const updatedWeekly = prev.weeklyProgress.map((wp, idx) =>
        idx === prev.weeklyProgress.length - 1
          ? {
              ...wp,
              avgAssessmentScore: result.scorePercentage,
              readinessScore: nextCompatibility,
            }
          : wp
      );

      return {
        ...prev,
        skills: nextSkills,
        roadmap: updatedRoadmap,
        assessmentHistory: [result, ...prev.assessmentHistory],
        achievements: nextAchievements,
        weeklyProgress: updatedWeekly,
        dopamineXp: (prev.dopamineXp || 0) + (result.scorePercentage >= 80 ? 120 : 50),
      };
    });

    return result;
  };

  const handleSendMentorMessage = async (userText: string) => {
    const userMsg = {
      id: `m_u_${Date.now()}`,
      role: 'user' as const,
      content: userText,
      timestamp: 'Just now',
    };

    updateProfileState((prev) => ({
      ...prev,
      mentorMessages: [...prev.mentorMessages, userMsg],
    }));

    setIsMentorBusy(true);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3500);
    const activeMilestone =
      profile.roadmap.find((r) => r.status === 'in_progress' || r.status === 'revision_required')
        ?.title || profile.roadmap[0]?.title || 'Phase 1: Core Foundations';

    const skillsSummary = profile.skills
      .map((s) => `${s.name} (${s.proficiency}/5 ${s.status})`)
      .join(', ');

    try {
      const res = await fetch('/api/mentor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          message: userText,
          profileContext: {
            fullName: profile.fullName,
            targetCareer: currentCareer.title,
            currentMilestone: activeMilestone,
            skillsSummary,
          },
          history: profile.mentorMessages.slice(-5),
        }),
      });
      const data = await res.json();
      const mentorMsg = {
        id: `m_a_${Date.now()}`,
        role: 'mentor' as const,
        content: data.reply || 'Here is your personalized guidance.',
        timestamp: 'Just now',
        agentInsights: data.agentInsights,
        suggestedFollowUps: data.suggestedFollowUps,
      };

      updateProfileState((prev) => ({
        ...prev,
        dopamineXp: (prev.dopamineXp || 0) + 20,
        mentorMessages: [...prev.mentorMessages, mentorMsg],
      }));
    } catch {
      const fallbackMsg = {
        id: `m_a_${Date.now()}`,
        role: 'mentor' as const,
        content: `### Personalized Guidance for **${profile.fullName}** (${currentCareer.title})\n\nBased on your current milestone (**${activeMilestone}**) and verified skills, here is your recommended strategy:\n\n1. **Sequence Prerequisites First**: Master asynchronous **JavaScript (Promises & Event Loop)** before diving into **React State Hooks** and **Node.js/Express REST APIs**.\n2. **Runnable Pattern**:\n\n\`\`\`javascript\nexport async function syncSkillProgress(skillId, score) {\n  const pace = score >= 80 ? 'Fast-Track' : score >= 60 ? 'Hands-On' : 'Step-by-Step';\n  return { skillId, score, pace, verifiedAt: new Date().toISOString() };\n}\n\`\`\`\n\n### Next Step\nComplete the 3-question diagnostic in the **Assessment Center** to calibrate your learning pace and illuminate your **3D Skill Universe** globe!`,
        timestamp: 'Just now',
        agentInsights: [
          `Skill Assessment Agent: Calibrated response to ${currentCareer.title}`,
          `Learning Architect Agent: Aligned with ${activeMilestone}`,
        ],
        suggestedFollowUps: [
          'Explain JavaScript Promises vs Python async/await for my background',
          'Explain React useState and useEffect hooks with a code example',
          'How do I build a secure REST API in Node.js and Express?',
        ],
      };
      updateProfileState((prev) => ({
        ...prev,
        dopamineXp: (prev.dopamineXp || 0) + 20,
        mentorMessages: [...prev.mentorMessages, fallbackMsg],
      }));
    } finally {
      clearTimeout(timer);
      setIsMentorBusy(false);
    }
  };

  if (activePage === 'landing') {
    return (
      <LandingView
        profile={profile}
        careerAnalysis={careerAnalysis}
        activeZone={activeZone}
        onZoneChange={setActiveZone}
        onEnterDemoMode={() => {
          setProfile(createInitialAlexState());
          setActivePage('dashboard');
        }}
        onOpenUserAuth={() => {
          setAuthError(null);
          setActivePage('user-auth');
        }}
        onSelectSkillForAssessment={(skillId) => {
          setSelectedAssessmentSkillId(skillId);
          setActivePage('assessments');
        }}
        onNavigateToPage={setActivePage}
        onToggle2DFallback={() =>
          updateProfileState((prev) => ({ ...prev, prefer2DFallback: !prev.prefer2DFallback }))
        }
      />
    );
  }

  if (
    activePage === 'auth' ||
    activePage === 'user-auth' ||
    activePage === 'onboarding'
  ) {
    const resolvedAuthMode =
      activePage === 'onboarding'
        ? 'onboarding'
        : 'user-auth';

    return (
      <AuthAndOnboardingView
        mode={resolvedAuthMode}
        profile={profile}
        careers={allCareers}
        isAuthenticated={Boolean(firebaseUser)}
        authError={authError}
        onGoogleSignInForUser={handleGoogleSignInForUser}
        onStartNewBlankLearner={handleStartNewBlankLearner}
        onSaveOnboardingProfile={(partial, selectedSkillIds) => {
          const chosenCareer =
            allCareers.find((c) => c.id === (partial.targetCareerId || profile.targetCareerId)) ||
            currentCareer;
          updateProfileState((prev) => {
            const updatedSkills = prev.skills.map((s) => {
              const hasIt = selectedSkillIds.includes(s.id);
              const prof = (hasIt ? Math.max(s.proficiency, 2) : 0) as ProficiencyScale;
              return {
                ...s,
                proficiency: prof,
                status: deriveSkillStatus(prof, s.targetProficiency, s.lastScore),
              };
            });
            return {
              ...prev,
              ...partial,
              isDemo: false,
              skills: updatedSkills,
              roadmap: generateAdaptiveRoadmap(
                updatedSkills,
                chosenCareer,
                partial.weeklyHoursAvailable || prev.weeklyHoursAvailable
              ),
            };
          });
          setActivePage('dashboard');
          handleTriggerOrchestration('Completed Clean Learner Onboarding Wizard');
        }}
        onBackToLanding={() => setActivePage('landing')}
      />
    );
  }

  const navItems: { id: AppPage; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Command Center', icon: <LayoutDashboard className="w-4 h-4" /> },
    {
      id: 'reels',
      label: 'Skill Reels (InstaLearn)',
      icon: <Flame className="w-4 h-4 text-rose-400" />,
    },
    {
      id: 'universe',
      label: '3D Skill Universe',
      icon: <Sparkles className="w-4 h-4 text-amber-400" />,
    },
    { id: 'assessments', label: 'Assessment Center', icon: <ClipboardCheck className="w-4 h-4" /> },
    { id: 'roadmap', label: 'Adaptive Roadmap', icon: <Route className="w-4 h-4" /> },
    { id: 'skills', label: 'Skill Intelligence', icon: <BrainCircuit className="w-4 h-4" /> },
    { id: 'careers', label: 'Career Explorer', icon: <Compass className="w-4 h-4" /> },
    { id: 'resources', label: 'Knowledge Library', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'analytics', label: 'Progress Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'mentor', label: 'AI Mentor', icon: <MessageSquareCode className="w-4 h-4" /> },
    { id: 'agents', label: '8-Agent Activity', icon: <Cpu className="w-4 h-4" /> },
    { id: 'profile', label: 'Learner Profile', icon: <UserCircle className="w-4 h-4" /> },
    { id: 'achievements', label: 'Achievements', icon: <Award className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings & Privacy', icon: <Settings className="w-4 h-4" /> },
  ];

  const activeMilestone =
    profile.roadmap.find((r) => r.status === 'revision_required') ||
    profile.roadmap.find((r) => r.status === 'in_progress') ||
    profile.roadmap[0];

  return (
    <div className="min-h-screen bg-[#09070f] text-slate-100 flex relative">
      {/* Collapsible Instagram-Obsidian Navigation Sidebar */}
      <aside
        className={`${
          sidebarCollapsed
            ? 'w-14 md:w-16'
            : 'fixed inset-y-0 left-0 w-64 md:static shadow-2xl md:shadow-none'
        } shrink-0 bg-[#120d1d] border-r border-pink-500/20 flex flex-col justify-between transition-all duration-150 z-30`}
      >
        <div>
          <div className="h-16 px-4 flex items-center justify-between border-b border-pink-500/20">
            {!sidebarCollapsed && (
              <button
                type="button"
                onClick={() => setActivePage('landing')}
                className="text-base font-bold tracking-tight bg-gradient-to-r from-amber-400 via-rose-500 to-fuchsia-500 bg-clip-text text-transparent font-display whitespace-nowrap cursor-pointer"
              >
                NEXORA AI
              </button>
            )}
            <button
              type="button"
              onClick={() => setSidebarCollapsed((c) => !c)}
              aria-label={sidebarCollapsed ? 'Expand navigation sidebar' : 'Collapse navigation sidebar'}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 cursor-pointer"
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen className="w-4 h-4" />
              ) : (
                <PanelLeftClose className="w-4 h-4" />
              )}
            </button>
          </div>

          <nav className="p-2.5 space-y-1 max-h-[calc(100vh-170px)] overflow-y-auto">
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActivePage(item.id)}
                  title={item.label}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white font-semibold shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-[#1a132b]'
                  }`}
                >
                  <span className="shrink-0">{item.icon}</span>
                  {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-3 border-t border-pink-500/20 space-y-2">
          {!sidebarCollapsed && (
            <button
              type="button"
              onClick={() => setActivePage('user-auth')}
              className="w-full px-3 py-2 rounded-xl bg-[#1a132b] hover:bg-pink-950/60 border border-pink-500/25 text-[11px] font-semibold text-pink-200 cursor-pointer truncate"
            >
              Learner Login / Switch Account
            </button>
          )}
          <button
            type="button"
            onClick={async () => {
              if (firebaseUser) {
                await signOut(auth);
              }
              setActivePage('landing');
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-[#1a132b] cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && <span>Exit to Gateway</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Workspace Top Header with Dopamine Streak & XP */}
        <header className="h-16 px-6 border-b border-pink-500/20 bg-[#120d1d]/95 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-300 truncate">
            <span className="font-bold text-white">{profile.fullName}</span>
            <span aria-hidden="true">/</span>
            <span className="text-pink-400 font-semibold">{currentCareer.title}</span>
            <span aria-hidden="true">/</span>
            <span className="font-mono tabular-nums text-amber-300">
              Readiness: {careerAnalysis.compatibilityScore}%
            </span>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setActivePage('reels')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-mono font-bold cursor-pointer"
            >
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>{profile.streakDays}d · {profile.dopamineXp || 0} XP</span>
            </button>
            <button
              type="button"
              onClick={() => setActivePage('universe')}
              className="px-3.5 py-1.5 rounded-xl bg-[#1a132b] hover:bg-pink-950/60 border border-pink-500/30 text-xs font-semibold text-pink-200 whitespace-nowrap shrink-0 cursor-pointer"
            >
              3D Skill Universe
            </button>
            <button
              type="button"
              onClick={() => setActivePage('assessments')}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:opacity-95 text-white text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer"
            >
              Take Skill Test
            </button>
          </div>
        </header>

        {/* Active Page Body */}
        <main className="flex-1 overflow-y-auto pb-20">
          {activePage === 'universe' ? (
            <NexoraUniverse3D
              skills={profile.skills}
              roadmap={profile.roadmap}
              careerAnalysis={careerAnalysis}
              activeZone={activeZone}
              onZoneChange={setActiveZone}
              onSelectSkillForAssessment={(skillId) => {
                setSelectedAssessmentSkillId(skillId);
                setActivePage('assessments');
              }}
              onNavigateToPage={setActivePage}
              reducedMotion={profile.reducedMotion}
              prefer2DFallback={profile.prefer2DFallback}
              onToggle2DFallback={() =>
                updateProfileState((prev) => ({
                  ...prev,
                  prefer2DFallback: !prev.prefer2DFallback,
                }))
              }
            />
          ) : (
            <div className="max-w-[1320px] mx-auto p-6 lg:p-8 space-y-6">
              {activePage === 'dashboard' && (
                <>
                  {/* Instagram-Style Skill Stories Bar on Dashboard */}
                  <div className="bg-[#120d1d] border border-pink-500/30 rounded-3xl p-5 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Flame className="w-4 h-4 text-rose-500 fill-rose-500" />
                        <span className="text-xs font-mono font-bold text-pink-300">
                          DAILY SKILL STORIES · TAP A RING FOR 60-SECOND DOPAMINE REELS
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActivePage('reels')}
                        className="text-xs font-semibold text-amber-300 hover:underline cursor-pointer"
                      >
                        Open Full Skill Reels Feed →
                      </button>
                    </div>

                    <div className="flex items-center gap-4 overflow-x-auto py-1">
                      {profile.skills.map((skill) => (
                        <button
                          key={skill.id}
                          type="button"
                          onClick={() => setActivePage('reels')}
                          className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group"
                        >
                          <div
                            className={`w-14 h-14 rounded-full p-[2.5px] transition-transform group-hover:scale-105 ${
                              skill.status === 'mastered'
                                ? 'bg-gradient-to-tr from-emerald-400 via-teal-400 to-cyan-500'
                                : skill.status === 'weak' || skill.status === 'revision'
                                ? 'bg-gradient-to-tr from-amber-400 via-rose-500 to-fuchsia-600'
                                : 'bg-gradient-to-tr from-violet-600 to-pink-600'
                            }`}
                          >
                            <div className="w-full h-full rounded-full bg-[#09070f] flex flex-col items-center justify-center text-white">
                              <span className="text-xs font-mono font-bold">{skill.proficiency}/5</span>
                              <span className="text-[9px] text-pink-300">
                                {skill.lastScore !== undefined ? `${skill.lastScore}%` : 'New'}
                              </span>
                            </div>
                          </div>
                          <span className="text-[11px] font-medium text-slate-200 max-w-[70px] truncate">
                            {skill.name.split(' ')[0]}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Personalized Greeting & Career Readiness Hero Card */}
                  <div className="bg-gradient-to-r from-[#171026] via-[#120d1d] to-[#1f1024] border border-pink-500/30 rounded-3xl p-6 lg:p-7 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="space-y-2 max-w-2xl">
                      <div className="text-xs font-mono text-pink-400">
                        NEXORA COMMAND CENTER ·{' '}
                        {profile.isDemo
                          ? 'SAMPLE SCENARIO: ALEX'
                          : 'CLEAN PERSONALIZED LEARNER SESSION (ZERO DEMO DATA)'}
                      </div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-white font-display">
                        Welcome, {profile.fullName}
                      </h1>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                        Target Career:{' '}
                        <span className="font-semibold text-white">{currentCareer.title}</span> ·
                        Active Milestone:{' '}
                        <span className="text-amber-300">{activeMilestone?.title}</span>
                      </p>
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setActivePage('user-auth')}
                          className="px-3 py-1.5 rounded-xl bg-[#09070f] hover:bg-pink-950/60 border border-pink-500/30 text-xs font-semibold text-pink-300 cursor-pointer"
                        >
                          Switch / Create Clean User Account
                        </button>
                        <button
                          type="button"
                          onClick={() => setActivePage('mentor')}
                          className="px-3 py-1.5 rounded-xl bg-[#09070f] hover:bg-amber-950/60 border border-amber-500/30 text-xs font-semibold text-amber-300 cursor-pointer"
                        >
                          Open AI Mentor & Code Coach
                        </button>
                        <button
                          type="button"
                          onClick={() => setActivePage('agents')}
                          className="px-3 py-1.5 rounded-xl bg-[#09070f] hover:bg-emerald-950/60 border border-emerald-500/30 text-xs font-semibold text-emerald-300 cursor-pointer"
                        >
                          8-Agent Activity Center
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 shrink-0 bg-[#09070f] px-6 py-4 rounded-2xl border border-pink-500/25">
                      <div className="font-mono tabular-nums">
                        <div className="text-3xl font-bold text-pink-400">
                          {careerAnalysis.compatibilityScore}%
                        </div>
                        <div className="text-xs text-slate-400">Career Readiness</div>
                      </div>
                      <div className="h-10 w-px bg-slate-800" />
                      <div className="font-mono tabular-nums">
                        <div className="text-3xl font-bold text-amber-400">
                          {careerAnalysis.masteredSkills.length}/
                          {currentCareer.requiredTechnicalSkills.length}
                        </div>
                        <div className="text-xs text-slate-400">Core Skills Verified</div>
                      </div>
                    </div>
                  </div>

                  {/* Interactive 3D Skill Universe Signature Viewport on Dashboard */}
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h2 className="text-lg font-bold text-white font-display">
                          Interactive 3D Circuit Skill Universe (Click Any Globe or HUD Reticle to Zoom & Scroll)
                        </h2>
                        <p className="text-xs text-slate-400">
                          Click any 3D skill globe or floating HUD reticle to fly the camera to that station and scroll directly to its 3D Model Card below.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActivePage('universe')}
                        className="text-xs font-semibold text-pink-400 hover:text-pink-300 cursor-pointer"
                      >
                        Expand Full-Screen 3D Viewport →
                      </button>
                    </div>

                    <NexoraUniverse3D
                      skills={profile.skills}
                      roadmap={profile.roadmap}
                      careerAnalysis={careerAnalysis}
                      activeZone={activeZone}
                      onZoneChange={setActiveZone}
                      onSelectSkillForAssessment={(skillId) => {
                        setSelectedAssessmentSkillId(skillId);
                        setActivePage('assessments');
                      }}
                      onNavigateToPage={setActivePage}
                      reducedMotion={profile.reducedMotion}
                      prefer2DFallback={profile.prefer2DFallback}
                      onToggle2DFallback={() =>
                        updateProfileState((prev) => ({
                          ...prev,
                          prefer2DFallback: !prev.prefer2DFallback,
                        }))
                      }
                      compactMode={true}
                    />
                  </div>

                  {/* Test-Driven Adaptive Learning Process Calibration Summary */}
                  <div className="bg-[#120d1d] border border-pink-500/25 rounded-3xl p-6 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-mono text-amber-300">
                          TEST-DRIVEN ADAPTIVE ENGINE · PERSONALIZED PACE CALIBRATION
                        </div>
                        <h3 className="text-lg font-bold text-white font-display">
                          How Your Test Results Adjust Your Learning Process
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActivePage('assessments')}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-semibold text-xs cursor-pointer"
                      >
                        Take Skill Diagnostic Test →
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {profile.skills.slice(0, 6).map((skill) => (
                        <div
                          key={skill.id}
                          className="p-4 rounded-2xl bg-[#09070f] border border-slate-800 space-y-1.5"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-white">{skill.name}</span>
                            <span className="font-mono text-pink-400">
                              {skill.lastScore !== undefined ? `Test: ${skill.lastScore}%` : 'Unassessed'}
                            </span>
                          </div>
                          <div className="text-[11px] text-amber-300 font-mono">
                            Pace: {skill.learningPaceMode || 'Guided Foundations (Step-by-Step)'}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Difficulty Tier: {skill.recommendedDifficulty || 'Beginner'} · Level {skill.proficiency}/5
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {activePage === 'reels' && (
                <DopamineReelsFeedView
                  profile={profile}
                  onCompleteReelQuiz={(reelId, skillId, xpReward) => {
                    updateProfileState((prev) => ({
                      ...prev,
                      dopamineXp: (prev.dopamineXp || 0) + xpReward,
                      skillReels: (prev.skillReels || INITIAL_SKILL_REELS).map((r) =>
                        r.id === reelId ? { ...r, completed: true } : r
                      ),
                      skills: prev.skills.map((s) =>
                        s.id === skillId
                          ? { ...s, confidence: Math.min(100, s.confidence + 10) }
                          : s
                      ),
                    }));
                  }}
                  onToggleLikeReel={(reelId) => {
                    updateProfileState((prev) => ({
                      ...prev,
                      skillReels: (prev.skillReels || INITIAL_SKILL_REELS).map((r) =>
                        r.id === reelId ? { ...r, liked: !r.liked } : r
                      ),
                    }));
                  }}
                  onJumpToSkillGlobe={(skillId) => {
                    setSelectedAssessmentSkillId(skillId);
                    setActiveZone('skill_universe');
                    setActivePage('universe');
                  }}
                  onStartSkillAssessment={(skillId) => {
                    setSelectedAssessmentSkillId(skillId);
                    setActivePage('assessments');
                  }}
                />
              )}

              {activePage === 'roadmap' && (
                <RoadmapView
                  roadmap={profile.roadmap}
                  targetCareerTitle={currentCareer.title}
                  weeklyHours={profile.weeklyHoursAvailable}
                  onToggleLesson={(milestoneId, lessonId) => {
                    updateProfileState((prev) => ({
                      ...prev,
                      dopamineXp: (prev.dopamineXp || 0) + 20,
                      roadmap: prev.roadmap.map((m) =>
                        m.id !== milestoneId
                          ? m
                          : {
                              ...m,
                              lessons: m.lessons.map((l) =>
                                l.id === lessonId ? { ...l, completed: !l.completed } : l
                              ),
                            }
                      ),
                    }));
                  }}
                  onSubmitExercise={(milestoneId, exerciseId, submission) => {
                    updateProfileState((prev) => ({
                      ...prev,
                      dopamineXp: (prev.dopamineXp || 0) + 40,
                      roadmap: prev.roadmap.map((m) =>
                        m.id !== milestoneId
                          ? m
                          : {
                              ...m,
                              exercises: m.exercises.map((ex) =>
                                ex.id === exerciseId ? { ...ex, completed: true, submission } : ex
                              ),
                            }
                      ),
                    }));
                  }}
                  onToggleMiniProject={(milestoneId) => {
                    updateProfileState((prev) => ({
                      ...prev,
                      roadmap: prev.roadmap.map((m) =>
                        m.id !== milestoneId
                          ? m
                          : {
                              ...m,
                              miniProject: {
                                ...m.miniProject,
                                completed: !m.miniProject.completed,
                              },
                            }
                      ),
                    }));
                  }}
                  onLogHours={(milestoneId, hrs) => {
                    updateProfileState((prev) => ({
                      ...prev,
                      roadmap: prev.roadmap.map((m) =>
                        m.id === milestoneId ? { ...m, loggedHours: m.loggedHours + hrs } : m
                      ),
                    }));
                  }}
                  onReorderPhase={(idx, dir) => {
                    updateProfileState((prev) => {
                      const arr = [...prev.roadmap];
                      const targetIdx = dir === 'up' ? idx - 1 : idx + 1;
                      if (targetIdx < 0 || targetIdx >= arr.length) return prev;
                      const temp = arr[idx];
                      arr[idx] = arr[targetIdx];
                      arr[targetIdx] = temp;
                      return {
                        ...prev,
                        roadmap: arr.map((item, i) => ({ ...item, phaseNumber: i + 1 })),
                      };
                    });
                  }}
                  onRegenerateRoadmap={() => {
                    updateProfileState((prev) => ({
                      ...prev,
                      roadmap: generateAdaptiveRoadmap(
                        prev.skills,
                        currentCareer,
                        prev.weeklyHoursAvailable
                      ),
                    }));
                    handleTriggerOrchestration('Regenerated Personalized Adaptive Roadmap');
                  }}
                  onStartAssessmentForSkill={(skillId) => {
                    setSelectedAssessmentSkillId(skillId);
                    setActivePage('assessments');
                  }}
                />
              )}

              {activePage === 'assessments' && (
                <AssessmentCenterView
                  skills={profile.skills}
                  selectedSkillId={selectedAssessmentSkillId}
                  onSelectSkillId={setSelectedAssessmentSkillId}
                  assessmentHistory={profile.assessmentHistory}
                  onSubmitAssessment={handleSubmitAssessment}
                  onOpen3DUniverseAfterAssessment={() => {
                    setActiveZone('skill_universe');
                    setActivePage('universe');
                  }}
                />
              )}

              {activePage === 'resources' && (
                <ResourceLibraryView
                  resources={profile.resources}
                  skills={profile.skills}
                  onToggleBookmark={(resId) => {
                    updateProfileState((prev) => ({
                      ...prev,
                      resources: prev.resources.map((r) =>
                        r.id === resId ? { ...r, bookmarked: !r.bookmarked } : r
                      ),
                    }));
                  }}
                />
              )}

              {(activePage === 'skills' || activePage === 'profile') && (
                <SkillAndProfileViews
                  mode={activePage}
                  profile={profile}
                  careerAnalysis={careerAnalysis}
                  onUpdateProfile={(partial) =>
                    updateProfileState((prev) => ({ ...prev, ...partial }))
                  }
                  onUpdateSkillLevel={(skillId, level, note) => {
                    updateProfileState((prev) => ({
                      ...prev,
                      skills: prev.skills.map((s) =>
                        s.id === skillId
                          ? {
                              ...s,
                              proficiency: level,
                              status: deriveSkillStatus(level, s.targetProficiency, s.lastScore),
                              evidence: [note, ...s.evidence.slice(0, 2)],
                            }
                          : s
                      ),
                    }));
                  }}
                  onExtractResumeText={(rawText) => {
                    updateProfileState((prev) => {
                      const { updatedSkills } = extractSkillsFromText(rawText, prev.skills);
                      return {
                        ...prev,
                        skills: updatedSkills,
                        roadmap: generateAdaptiveRoadmap(
                          updatedSkills,
                          currentCareer,
                          prev.weeklyHoursAvailable
                        ),
                      };
                    });
                  }}
                  onStartAssessment={(skillId) => {
                    setSelectedAssessmentSkillId(skillId);
                    setActivePage('assessments');
                  }}
                />
              )}

              {activePage === 'careers' && (
                <CareerExplorerView
                  careers={allCareers}
                  selectedCareerId={profile.targetCareerId}
                  careerAnalysis={careerAnalysis}
                  onSelectCareer={handleSelectCareer}
                  skills={profile.skills}
                  onCreateCustomCareer={(title, description, skillIds) => {
                    const newId = `custom_${Date.now()}`;
                    const customRole: CareerRole = {
                      id: newId,
                      title,
                      category: 'Custom Career Path',
                      description,
                      avgSalaryRange: '$120,000 – $175,000',
                      demandGrowth: 'Custom Target',
                      requiredTechnicalSkills: skillIds.map((sid) => {
                        const found = profile.skills.find((s) => s.id === sid);
                        return {
                          skillId: sid,
                          skillName: found?.name || sid,
                          category: found?.category || 'Language',
                          requiredLevel: 4,
                          weight: 25,
                          isCritical: true,
                        };
                      }),
                      requiredSoftSkills: ['Problem Solving', 'System Architecture'],
                      languages: ['Python', 'JavaScript/TypeScript', 'SQL'],
                      frameworks: ['React', 'Express'],
                      tools: ['Git', 'Docker'],
                      practicalExperience: 'Custom capstone portfolio verified in NEXORA AI.',
                      recommendedProjects: [`End-to-End ${title} Architecture Capstone`],
                      relevantCertifications: ['NEXORA Verified Career Readiness Credential'],
                      isCustom: true,
                    };
                    updateProfileState((prev) => ({
                      ...prev,
                      customCareers: [...(prev.customCareers || []), customRole],
                      targetCareerId: newId,
                      roadmap: generateAdaptiveRoadmap(
                        prev.skills,
                        customRole,
                        prev.weeklyHoursAvailable
                      ),
                    }));
                  }}
                />
              )}

              {activePage === 'analytics' && (
                <ProgressAnalyticsView
                  profile={profile}
                  careerAnalysis={careerAnalysis}
                />
              )}

              {(activePage === 'mentor' || activePage === 'agents') && (
                <AIMentorAndAgentsView
                  mode={activePage}
                  profile={profile}
                  careerTitle={currentCareer.title}
                  isBusy={activePage === 'mentor' ? isMentorBusy : isAiBusy}
                  onSendMessage={handleSendMentorMessage}
                  onClearChat={() =>
                    updateProfileState((prev) => ({
                      ...prev,
                      mentorMessages: prev.mentorMessages.slice(0, 1),
                    }))
                  }
                  onTriggerOrchestration={handleTriggerOrchestration}
                />
              )}

              {(activePage === 'achievements' || activePage === 'settings') && (
                <AchievementsAndSettingsView
                  mode={activePage}
                  profile={profile}
                  onUpdateProfile={(partial) =>
                    updateProfileState((prev) => ({ ...prev, ...partial }))
                  }
                  onResetToAlexDemo={async () => {
                    localStorage.removeItem(LOCAL_STORAGE_KEY);
                    if (firebaseUser) {
                      try {
                        await deleteDoc(doc(db, 'learners', firebaseUser.uid));
                      } catch {
                        // Ignore if doc doesn't exist
                      }
                    }
                    setProfile(createInitialAlexState());
                  }}
                />
              )}
            </div>
          )}
        </main>
      </div>

      {/* Floating Gemini AI Voice Assistant Widget Across Workspace */}
      <GeminiVoiceAssistantWidget
        profile={profile}
        careerTitle={currentCareer.title}
        onEarnDopamineXp={handleEarnDopamineXp}
      />
    </div>
  );
}
