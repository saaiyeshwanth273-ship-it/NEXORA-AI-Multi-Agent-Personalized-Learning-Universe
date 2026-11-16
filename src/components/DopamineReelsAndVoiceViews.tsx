import React, { useState, useRef } from 'react';
import {
  LearnerProfileState,
  SkillReelItem,
} from '../types/nexora';
import { INITIAL_SKILL_REELS } from '../lib/learningEngine';
import {
  Heart,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Flame,
  Zap,
  Play,
  Globe,
} from 'lucide-react';

interface GeminiVoiceAssistantWidgetProps {
  profile: LearnerProfileState;
  careerTitle: string;
  onEarnDopamineXp: (xp: number, reason: string) => void;
}

export const GeminiVoiceAssistantWidget: React.FC<GeminiVoiceAssistantWidgetProps> = ({
  profile,
  careerTitle,
  onEarnDopamineXp,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceName, setVoiceName] = useState<'Kore' | 'Puck' | 'Zephyr'>('Kore');
  const [voicePrompt, setVoicePrompt] = useState('');
  const [transcript, setTranscript] = useState<string>(
    `Tap any prompt below or use your microphone to talk with your Gemini AI Voice Coach (${voiceName}).`
  );
  const [statusBadge, setStatusBadge] = useState<string>('Gemini 3.8 TTS + Web Speech Ready');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const triggerVoiceAssistant = async (promptToAsk: string) => {
    stopAudio();
    setIsSpeaking(true);
    setStatusBadge('Synthesizing Gemini Voice...');

    const lastTest = profile.assessmentHistory[0];
    const lastTestSummary = lastTest
      ? `${lastTest.skillName}: ${lastTest.scorePercentage}% (${lastTest.learningPaceAssigned || 'Calibrated'})`
      : 'No test taken yet — baseline learner';

    const skillsSummary = profile.skills
      .map((s) => `${s.name}: ${s.proficiency}/5 (${s.status})`)
      .join(', ');

    try {
      const res = await fetch('/api/voice/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Nexora-Client': 'nexora-web-v1',
        },
        body: JSON.stringify({
          prompt: promptToAsk,
          voiceName,
          profileContext: {
            fullName: profile.fullName || 'Learner',
            targetCareer: careerTitle,
            skillsSummary,
            lastTestSummary,
          },
        }),
      });
      const data = await res.json();
      const spokenText =
        data.transcript ||
        'Keep your learning streak alive! Complete your next Skill Reel or Assessment to illuminate your 3D Skill Universe.';
      setTranscript(spokenText);
      onEarnDopamineXp(25, 'Gemini Voice Coaching Session');

      if (data.base64Audio) {
        setStatusBadge(`Playing Gemini TTS (${data.voiceName || voiceName})`);
        const audio = new Audio(`data:${data.audioMimeType || 'audio/wav'};base64,${data.base64Audio}`);
        audioRef.current = audio;
        audio.onended = () => {
          setIsSpeaking(false);
          setStatusBadge('Voice Coaching Complete (+25 XP)');
        };
        audio.onerror = () => {
          setIsSpeaking(false);
        };
        await audio.play();
      } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        setStatusBadge('Speaking via Neural Browser Voice (+25 XP)');
        const utterance = new SpeechSynthesisUtterance(spokenText);
        utterance.rate = 1.04;
        utterance.pitch = 1.05;
        utterance.onend = () => {
          setIsSpeaking(false);
          setStatusBadge('Voice Coaching Complete (+25 XP)');
        };
        utterance.onerror = () => {
          setIsSpeaking(false);
        };
        window.speechSynthesis.speak(utterance);
      } else {
        setIsSpeaking(false);
        setStatusBadge('Transcript Ready (+25 XP)');
      }
    } catch {
      setIsSpeaking(false);
      setStatusBadge('Voice Transcript Ready');
    }
  };

  const handleStartMicRecognition = (): void => {
    interface SpeechRecognitionResultEvent {
      results?: {
        [index: number]: {
          [subIndex: number]: {
            transcript?: string;
          };
        };
      };
    }

    interface SpeechRecognitionInstance {
      lang: string;
      interimResults: boolean;
      maxAlternatives: number;
      onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
      onerror: (() => void) | null;
      onend: (() => void) | null;
      start: () => void;
    }

    interface WindowWithSpeech extends Window {
      SpeechRecognition?: new () => SpeechRecognitionInstance;
      webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
    }

    const win = window as WindowWithSpeech;
    const SpeechRec = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (!SpeechRec) {
      const fallbackQ = 'How should I adjust my study plan based on my latest test results?';
      setVoicePrompt(fallbackQ);
      triggerVoiceAssistant(fallbackQ);
      return;
    }
    try {
      const recognition = new SpeechRec();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      setIsListening(true);
      setStatusBadge('Listening to Microphone...');
      recognition.onresult = (event: SpeechRecognitionResultEvent) => {
        const heard = event.results?.[0]?.[0]?.transcript || '';
        setIsListening(false);
        if (heard) {
          setVoicePrompt(heard);
          triggerVoiceAssistant(heard);
        }
      };
      recognition.onerror = () => {
        setIsListening(false);
        setStatusBadge('Mic fallback — tap a voice prompt');
      };
      recognition.onend = () => {
        setIsListening(false);
      };
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {!isOpen ? (
        <button
          type="button"
          data-testid="open-voice-assistant-btn"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white font-semibold text-xs shadow-2xl shadow-pink-500/40 hover:scale-105 transition-transform cursor-pointer border border-white/20"
        >
          <Volume2 className="w-4 h-4" />
          <span>Gemini AI Voice Coach</span>
        </button>
      ) : (
        <div
          data-testid="voice-assistant-panel"
          className="w-[350px] sm:w-[390px] bg-[#120d1d] border border-pink-500/40 rounded-3xl p-5 shadow-2xl space-y-4 text-slate-100"
        >
          <div className="flex items-center justify-between border-b border-pink-500/20 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-fuchsia-600 flex items-center justify-center text-white">
                <Volume2 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white font-display">Gemini AI Voice Assistant</div>
                <div className="text-[11px] font-mono text-pink-400">{statusBadge}</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                stopAudio();
                setIsOpen(false);
              }}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded-lg bg-[#1c142e] cursor-pointer"
            >
              Close
            </button>
          </div>

          {/* Voice Persona Selector */}
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="text-slate-400">Gemini TTS Voice:</span>
            <div className="flex items-center gap-1.5">
              {(['Kore', 'Puck', 'Zephyr'] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setVoiceName(v)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer ${
                    voiceName === v
                      ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold'
                      : 'bg-[#1a132b] text-slate-300 hover:text-white'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Spoken Transcript Output Box */}
          <div className="p-3.5 rounded-2xl bg-[#09070f] border border-pink-500/25 text-xs text-slate-200 leading-relaxed space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-amber-300">
              <span>{isSpeaking ? '🔊 SPEAKING ALOUD NOW...' : '💬 VOICE TRANSCRIPT'}</span>
              {isSpeaking && (
                <button
                  type="button"
                  onClick={stopAudio}
                  className="text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                >
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Mute</span>
                </button>
              )}
            </div>
            <p data-testid="voice-assistant-transcript">{transcript}</p>
          </div>

          {/* Quick One-Tap Dopamine Voice Prompts */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-mono text-slate-400">INSTANT VOICE COACHING PROMPTS:</div>
            <div className="flex flex-wrap gap-1.5">
              {[
                'Analyze my latest test results & adjust my study pace',
                'Give me a 30-second dopamine summary of my next skill gap',
                'Explain JavaScript Promises vs Python async aloud',
              ].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    setVoicePrompt(preset);
                    triggerVoiceAssistant(preset);
                  }}
                  className="text-left px-3 py-1.5 rounded-xl bg-[#1a132b] hover:bg-pink-950/60 border border-pink-500/20 text-[11px] text-pink-200 transition-colors cursor-pointer"
                >
                  ▶ {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Voice / Text Input + Mic Capture */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (voicePrompt.trim()) {
                triggerVoiceAssistant(voicePrompt.trim());
              }
            }}
            className="flex items-center gap-2 pt-1"
          >
            <button
              type="button"
              onClick={handleStartMicRecognition}
              title="Speak into Microphone"
              aria-label="Speak into Microphone"
              className={`p-2.5 rounded-xl border cursor-pointer transition-colors ${
                isListening
                  ? 'bg-rose-500 border-rose-300 text-white'
                  : 'bg-[#1a132b] border-pink-500/30 text-pink-300 hover:text-white'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
            <input
              type="text"
              aria-label="Ask Gemini Voice Coach"
              value={voicePrompt}
              onChange={(e) => setVoicePrompt(e.target.value)}
              placeholder="Ask or tap Mic to speak..."
              className="flex-1 px-3 py-2 rounded-xl bg-[#09070f] border border-slate-800 text-xs text-white focus:outline-none focus:border-pink-500"
            />
            <button
              type="submit"
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white font-semibold text-xs cursor-pointer"
            >
              Speak
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

interface DopamineReelsFeedViewProps {
  profile: LearnerProfileState;
  onCompleteReelQuiz: (reelId: string, skillId: string, xpReward: number) => void;
  onToggleLikeReel: (reelId: string) => void;
  onJumpToSkillGlobe: (skillId: string) => void;
  onStartSkillAssessment: (skillId: string) => void;
}

export const DopamineReelsFeedView: React.FC<DopamineReelsFeedViewProps> = ({
  profile,
  onCompleteReelQuiz,
  onToggleLikeReel,
  onJumpToSkillGlobe,
  onStartSkillAssessment,
}) => {
  const reels: SkillReelItem[] =
    profile.skillReels && profile.skillReels.length > 0 ? profile.skillReels : INITIAL_SKILL_REELS;

  const [selectedStorySkillId, setSelectedStorySkillId] = useState<string>('All');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [rewardBurstMessage, setRewardBurstMessage] = useState<string | null>(null);
  const [speakingReelId, setSpeakingReelId] = useState<string | null>(null);

  const filteredReels =
    selectedStorySkillId === 'All'
      ? reels
      : reels.filter((r) => r.skillId === selectedStorySkillId);

  const handleAnswerMicroQuiz = (reel: SkillReelItem, option: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [reel.id]: option }));
    if (option === reel.quickQuizCorrect && !reel.completed) {
      onCompleteReelQuiz(reel.id, reel.skillId, reel.xpReward);
      setRewardBurstMessage(
        `🔥 DOPAMINE HIT! +${reel.xpReward} XP Earned · ${reel.skillName} Confidence Boosted!`
      );
      setTimeout(() => setRewardBurstMessage(null), 4000);
    }
  };

  const handleReadReelAloud = (reel: SkillReelItem) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (speakingReelId === reel.id) {
      setSpeakingReelId(null);
      return;
    }
    setSpeakingReelId(reel.id);
    const utterance = new SpeechSynthesisUtterance(
      `${reel.hookTitle}. ${reel.microConcept} Quiz question: ${reel.quickQuizQuestion}`
    );
    utterance.rate = 1.05;
    utterance.onend = () => setSpeakingReelId(null);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Instagram-Style Stories Bar (Color Psychology & Zeigarnik Progress Rings) */}
      <div className="bg-[#120d1d] border border-pink-500/25 rounded-3xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-xs font-mono text-pink-400 uppercase tracking-wider">
              INSTALEARN DOPAMINE ENGINE · HEALTHY NEURO-REWARD SCROLLING
            </span>
            <h1 className="text-2xl font-bold text-white font-display mt-0.5">
              Skill Stories & 60-Second Addictive Learning Reels
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs font-bold font-mono">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>{profile.streakDays}d Streak</span>
            </div>
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-pink-500/15 border border-pink-400/40 text-pink-300 text-xs font-bold font-mono">
              <Zap className="w-4 h-4 text-pink-400 fill-pink-400" />
              <span>{profile.dopamineXp || 0} XP</span>
            </div>
          </div>
        </div>

        {/* Horizontal Instagram-Style Circular Story Rings */}
        <div className="flex items-center gap-4 overflow-x-auto py-2">
          <button
            type="button"
            onClick={() => setSelectedStorySkillId('All')}
            className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
          >
            <div
              className={`w-16 h-16 rounded-full p-[3px] ${
                selectedStorySkillId === 'All'
                  ? 'bg-gradient-to-tr from-amber-400 via-rose-500 to-fuchsia-600'
                  : 'bg-slate-800'
              }`}
            >
              <div className="w-full h-full rounded-full bg-[#09070f] flex items-center justify-center text-xs font-bold text-white">
                ALL
              </div>
            </div>
            <span className="text-[11px] font-medium text-slate-200">All Reels</span>
          </button>

          {profile.skills.map((skill) => {
            const isSelected = selectedStorySkillId === skill.id;
            return (
              <button
                key={skill.id}
                type="button"
                onClick={() => setSelectedStorySkillId(skill.id)}
                className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <div
                  className={`w-16 h-16 rounded-full p-[3px] transition-transform hover:scale-105 ${
                    isSelected || skill.status === 'mastered'
                      ? 'bg-gradient-to-tr from-amber-400 via-rose-500 to-fuchsia-600'
                      : skill.status === 'weak' || skill.status === 'revision'
                      ? 'bg-gradient-to-tr from-amber-500 to-rose-600'
                      : 'bg-gradient-to-tr from-violet-600 to-indigo-800'
                  }`}
                >
                  <div className="w-full h-full rounded-full bg-[#09070f] flex flex-col items-center justify-center text-white">
                    <span className="text-xs font-mono font-bold">{skill.proficiency}/5</span>
                    <span className="text-[9px] text-pink-300">{skill.confidence}%</span>
                  </div>
                </div>
                <span className="text-[11px] font-medium text-slate-200 max-w-[74px] truncate">
                  {skill.name.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dopamine XP Burst Banner */}
      {rewardBurstMessage && (
        <div
          data-testid="dopamine-xp-burst"
          className="p-4 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white font-bold text-sm text-center shadow-xl"
        >
          {rewardBurstMessage}
        </div>
      )}

      {/* Vertical Addictive Scrollable Reels Cards */}
      <div className="space-y-6">
        {filteredReels.map((reel, idx) => {
          const picked = selectedAnswers[reel.id];
          const isCorrect = picked === reel.quickQuizCorrect || reel.completed;
          const matchingSkill = profile.skills.find((s) => s.id === reel.skillId);

          return (
            <article
              key={reel.id}
              data-testid={`skill-reel-${reel.id}`}
              onDoubleClick={() => onToggleLikeReel(reel.id)}
              className="relative bg-gradient-to-b from-[#171026] via-[#120d1d] to-[#0d0917] border border-pink-500/30 rounded-3xl overflow-hidden shadow-2xl"
            >
              {/* Top Story Segmented Progress Bar (Zeigarnik Effect) */}
              <div className="flex gap-1.5 px-5 pt-4">
                {filteredReels.map((r, barIdx) => (
                  <div key={r.id} className="h-1 flex-1 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full ${
                        barIdx <= idx
                          ? 'bg-gradient-to-r from-amber-400 via-rose-500 to-fuchsia-500'
                          : 'bg-transparent'
                      }`}
                    />
                  </div>
                ))}
              </div>

              <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Main Reel Content (10 cols) */}
                <div className="lg:col-span-10 space-y-4">
                  {/* Creator Header */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-fuchsia-600 p-[2px]">
                        <div className="w-full h-full rounded-full bg-[#09070f] flex items-center justify-center text-xs font-bold text-white">
                          AI
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{reel.authorHandle}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-pink-500/20 text-pink-300 border border-pink-500/30">
                            {reel.authorRole}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {reel.skillName} · Psychology Hook: {reel.psychologyPrinciple}
                        </div>
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-mono font-bold">
                      +{reel.xpReward} XP Drop
                    </span>
                  </div>

                  {/* Hook Headline */}
                  <h2 className="text-xl sm:text-2xl font-bold text-white font-display leading-snug">
                    {reel.hookTitle}
                  </h2>

                  {/* Bite-Sized Explanation */}
                  <p className="text-sm text-slate-200 leading-relaxed">{reel.microConcept}</p>

                  {/* High-Contrast Code / Visual Card */}
                  <pre className="p-4 rounded-2xl bg-[#07050c] border border-pink-500/25 text-xs font-mono text-pink-200 overflow-x-auto">
                    <code>{reel.codeSnippet}</code>
                  </pre>

                  {/* 1-Tap Dopamine Micro-Quiz */}
                  <div className="p-4 rounded-2xl bg-[#09070f] border border-pink-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-amber-300">
                        ⚡ 10-SECOND DOPAMINE CHECKPOINT
                      </span>
                      {isCorrect && (
                        <span className="text-xs font-mono text-emerald-400 font-semibold">
                          ✓ Verified (+{reel.xpReward} XP)
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-white">{reel.quickQuizQuestion}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {reel.quickQuizOptions.map((opt) => {
                        const isPicked = picked === opt;
                        const isRightOpt = opt === reel.quickQuizCorrect;
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => handleAnswerMicroQuiz(reel, opt)}
                            className={`p-3 rounded-xl border text-xs font-medium text-left transition-all cursor-pointer ${
                              isPicked && isRightOpt
                                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 border-emerald-300 text-white font-bold'
                                : isPicked && !isRightOpt
                                ? 'bg-rose-950/80 border-rose-500 text-rose-200'
                                : 'bg-[#140e24] border-slate-800 text-slate-200 hover:border-pink-500/50'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right-Side Instagram Reels Action Column (2 cols) */}
                <div className="lg:col-span-2 flex lg:flex-col items-center justify-around lg:justify-start gap-4 pt-2 border-t lg:border-t-0 lg:border-l border-slate-800/80 lg:pl-4">
                  <button
                    type="button"
                    onClick={() => onToggleLikeReel(reel.id)}
                    className="flex flex-col items-center gap-1 text-xs text-slate-300 hover:text-rose-400 cursor-pointer"
                  >
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center border ${
                        reel.liked
                          ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                          : 'bg-[#1a132b] border-slate-800 text-slate-300'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${reel.liked ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </div>
                    <span className="font-mono text-[11px]">{reel.likesCount + (reel.liked ? 1 : 0)}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleReadReelAloud(reel)}
                    className="flex flex-col items-center gap-1 text-xs text-slate-300 hover:text-pink-400 cursor-pointer"
                  >
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center border ${
                        speakingReelId === reel.id
                          ? 'bg-pink-500 text-white border-pink-300'
                          : 'bg-[#1a132b] border-slate-800 text-pink-300'
                      }`}
                    >
                      <Volume2 className="w-5 h-5" />
                    </div>
                    <span className="text-[11px]">{speakingReelId === reel.id ? 'Speaking' : 'Voice'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onJumpToSkillGlobe(reel.skillId)}
                    className="flex flex-col items-center gap-1 text-xs text-slate-300 hover:text-amber-300 cursor-pointer"
                  >
                    <div className="w-11 h-11 rounded-full bg-[#1a132b] border border-slate-800 flex items-center justify-center text-amber-300">
                      <Globe className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] text-center">3D Globe</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onStartSkillAssessment(reel.skillId)}
                    className="flex flex-col items-center gap-1 text-xs text-slate-300 hover:text-emerald-300 cursor-pointer"
                  >
                    <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-md">
                      <Play className="w-4 h-4 fill-current" />
                    </div>
                    <span className="text-[11px] font-semibold text-pink-300">Test ({matchingSkill?.proficiency ?? 0}/5)</span>
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

