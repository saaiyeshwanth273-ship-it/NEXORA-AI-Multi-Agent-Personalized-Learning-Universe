import React from 'react';
import { Flame } from 'lucide-react';
import {
  AppPage,
  CareerMatchAnalysis,
  CareerRole,
  LearnerProfileState,
  RoadmapMilestone,
  UniverseZone,
} from '../types/nexora';
import { NexoraUniverse3D } from './NexoraUniverse3D';

interface DashboardCommandCenterProps {
  profile: LearnerProfileState;
  currentCareer: CareerRole;
  careerAnalysis: CareerMatchAnalysis;
  activeMilestone?: RoadmapMilestone;
  activeZone: UniverseZone;
  onZoneChange: (zone: UniverseZone) => void;
  onNavigateToPage: (page: AppPage) => void;
  onSelectSkillForAssessment: (skillId: string) => void;
  onToggle2DFallback: () => void;
}

/**
 * Primary NEXORA AI Command Center Dashboard featuring Daily Skill Stories,
 * Career Readiness telemetry, embedded 3D Circuit Skill Universe, and Test-Calibrated Pace cards.
 */
export const DashboardCommandCenterView: React.FC<DashboardCommandCenterProps> = ({
  profile,
  currentCareer,
  careerAnalysis,
  activeMilestone,
  activeZone,
  onZoneChange,
  onNavigateToPage,
  onSelectSkillForAssessment,
  onToggle2DFallback,
}) => {
  return (
    <div className="space-y-6">
      {/* Instagram-Style Skill Stories Bar on Dashboard */}
      <section
        aria-label="Daily Skill Stories"
        className="bg-[#120d1d] border border-pink-500/30 rounded-3xl p-5 space-y-3"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-rose-500 fill-rose-500" aria-hidden="true" />
            <span className="text-xs font-mono font-bold text-pink-300">
              DAILY SKILL STORIES · TAP A RING FOR 60-SECOND DOPAMINE REELS
            </span>
          </div>
          <button
            type="button"
            onClick={() => onNavigateToPage('reels')}
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
              aria-label={`Open ${skill.name} Story Reel (${skill.proficiency} of 5)`}
              onClick={() => onNavigateToPage('reels')}
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
      </section>

      {/* Personalized Greeting & Career Readiness Hero Card */}
      <section
        aria-label="Learner Readiness Overview"
        className="bg-gradient-to-r from-[#171026] via-[#120d1d] to-[#1f1024] border border-pink-500/30 rounded-3xl p-6 lg:p-7 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
      >
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
            Target Career: <span className="font-semibold text-white">{currentCareer.title}</span> ·
            Active Milestone:{' '}
            <span className="text-amber-300">{activeMilestone?.title || 'Phase 1'}</span>
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => onNavigateToPage('user-auth')}
              className="px-3 py-1.5 rounded-xl bg-[#09070f] hover:bg-pink-950/60 border border-pink-500/30 text-xs font-semibold text-pink-300 cursor-pointer"
            >
              Switch / Create Clean User Account
            </button>
            <button
              type="button"
              onClick={() => onNavigateToPage('mentor')}
              className="px-3 py-1.5 rounded-xl bg-[#09070f] hover:bg-amber-950/60 border border-amber-500/30 text-xs font-semibold text-amber-300 cursor-pointer"
            >
              Open AI Mentor & Code Coach
            </button>
            <button
              type="button"
              onClick={() => onNavigateToPage('agents')}
              className="px-3 py-1.5 rounded-xl bg-[#09070f] hover:bg-emerald-950/60 border border-emerald-500/30 text-xs font-semibold text-emerald-300 cursor-pointer"
            >
              8-Agent Activity Center
            </button>
          </div>
        </div>

        <div
          role="status"
          aria-live="polite"
          className="flex items-center gap-6 shrink-0 bg-[#09070f] px-6 py-4 rounded-2xl border border-pink-500/25"
        >
          <div className="font-mono tabular-nums">
            <div className="text-3xl font-bold text-pink-400">
              {careerAnalysis.compatibilityScore}%
            </div>
            <div className="text-xs text-slate-400">Career Readiness</div>
          </div>
          <div className="h-10 w-px bg-slate-800" aria-hidden="true" />
          <div className="font-mono tabular-nums">
            <div className="text-3xl font-bold text-amber-400">
              {careerAnalysis.masteredSkills.length}/{currentCareer.requiredTechnicalSkills.length}
            </div>
            <div className="text-xs text-slate-400">Core Skills Verified</div>
          </div>
        </div>
      </section>

      {/* Interactive 3D Skill Universe Signature Viewport on Dashboard */}
      <section aria-label="Interactive 3D Circuit Skill Universe" className="space-y-3">
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
            onClick={() => onNavigateToPage('universe')}
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
          onZoneChange={onZoneChange}
          onSelectSkillForAssessment={onSelectSkillForAssessment}
          onNavigateToPage={onNavigateToPage}
          reducedMotion={profile.reducedMotion}
          prefer2DFallback={profile.prefer2DFallback}
          onToggle2DFallback={onToggle2DFallback}
          compactMode={true}
        />
      </section>

      {/* Test-Driven Adaptive Learning Process Calibration Summary */}
      <section
        aria-label="Test-Driven Adaptive Learning Pace Calibration"
        className="bg-[#120d1d] border border-pink-500/25 rounded-3xl p-6 space-y-4"
      >
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
            onClick={() => onNavigateToPage('assessments')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-semibold text-xs cursor-pointer"
          >
            Take Skill Diagnostic Test →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {profile.skills.slice(0, 6).map((skill) => (
            <div
              key={skill.id}
              className="p-4 rounded-2xl bg-[#09070f] border border-pink-500/20 space-y-1.5"
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
      </section>
    </div>
  );
};
