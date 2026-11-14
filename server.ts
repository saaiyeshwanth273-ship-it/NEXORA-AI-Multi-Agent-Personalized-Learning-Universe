import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '512kb' }));

// Sliding-window rate limiter per IP for API protection
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
app.use('/api', (req, res, next) => {
  const ip = req.ip || 'local';
  const now = Date.now();
  const windowMs = 60_000;
  const maxRequests = 90;
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return next();
  }
  if (entry.count >= maxRequests) {
    return res.status(429).json({
      error: 'Rate limit exceeded. Please wait a moment before triggering additional AI agent runs.',
    });
  }
  entry.count += 1;
  next();
});

function sanitizeInput(text: unknown, maxLen = 4000): string {
  if (typeof text !== 'string') return '';
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/ignore\s+(all\s+)?(previous|prior)\s+instructions/gi, '[REDACTED]')
    .slice(0, maxLen)
    .trim();
}

function parseJsonSafe(rawText: string | undefined): any | null {
  if (!rawText) return null;
  const cleaned = rawText
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/, '')
    .trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

function getGenAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Helper to build rich, evidence-backed 8-Agent outputs for any learner state
function buildDeterministicEightAgents(
  safeName: string,
  safeCareer: string,
  weeklyHours: number,
  safeReason: string,
  skillsArray: any[]
) {
  const mastered = skillsArray.filter((s) => Number(s.proficiency) >= 4 || s.status === 'mastered');
  const weakOrRev = skillsArray.filter(
    (s) => s.status === 'weak' || s.status === 'revision' || (Number(s.proficiency) > 0 && Number(s.proficiency) < 4)
  );
  const missing = skillsArray.filter((s) => Number(s.proficiency) === 0 || s.status === 'missing');

  const masteredNames = mastered.map((s) => s.name).join(', ') || 'None verified yet (0/5 clean baseline)';
  const weakNames = weakOrRev.map((s) => s.name).join(', ') || 'No weak skills flagged yet';
  const missingNames = missing.slice(0, 4).map((s) => s.name).join(', ') || 'Core stack complete';
  const topFocusSkill = weakOrRev[0]?.name || missing[0]?.name || 'JavaScript (ES6+ & Async)';

  const readinessPct =
    skillsArray.length > 0
      ? Math.round(
          (skillsArray.reduce((acc, s) => acc + Math.min(4, Number(s.proficiency) || 0), 0) /
            (skillsArray.length * 4)) *
            100
        )
      : 0;

  return {
    executiveSummary: `All 8 NEXORA AI agents completed "${safeReason}" for ${safeName} targeting ${safeCareer}. Current Readiness: ${readinessPct}%. Mastered: [${masteredNames}]. Priority bottleneck isolated in ${topFocusSkill} — roadmap calibrated for ${weeklyHours} hrs/week.`,
    agentOutputs: [
      {
        agentId: 'profile_agent',
        agentName: 'Profile Intelligence Agent',
        taskPerformed: `Audited ${safeName}'s learner profile, portfolio & skill evidence (${safeReason})`,
        outputSummary: `Verified ${mastered.length} mastered skills (${masteredNames}) and mapped ${missing.length} unexplored nodes for ${safeCareer}.`,
        confidence: 97,
      },
      {
        agentId: 'skill_assessment_agent',
        agentName: 'Skill Assessment Agent',
        taskPerformed: 'Evaluated 1–5 proficiency levels, test scores & confidence intervals',
        outputSummary: `Readiness at ${readinessPct}%. Flagged [${weakNames}] for targeted practice and [${missingNames}] as critical gaps.`,
        confidence: 96,
      },
      {
        agentId: 'career_agent',
        agentName: 'Career Intelligence Agent',
        taskPerformed: `Benchmarked verified skills against ${safeCareer} industry rubric`,
        outputSummary: `Ranked ${topFocusSkill} as #1 highest-leverage skill to unlock ${safeCareer} compatibility.`,
        confidence: 95,
      },
      {
        agentId: 'learning_architect_agent',
        agentName: 'Learning Architect Agent',
        taskPerformed: `Synthesized 8-phase adaptive roadmap at ${weeklyHours} hrs/week pace`,
        outputSummary: `Sequenced ${topFocusSkill} at the front of the active milestone queue with test-driven pace calibration.`,
        confidence: 98,
      },
      {
        agentId: 'resource_discovery_agent',
        agentName: 'Resource Discovery Agent',
        taskPerformed: `Curated verified documentation & interactive labs for ${topFocusSkill}`,
        outputSummary: `Matched official MDN, React.dev, Node.js, PostgreSQL, and OWASP guides to ${safeName}'s active phase.`,
        confidence: 94,
      },
      {
        agentId: 'assessment_evaluator_agent',
        agentName: 'Assessment Evaluator Agent',
        taskPerformed: `Armed multi-modal diagnostic checkpoints for ${topFocusSkill}`,
        outputSummary: `Configured MCQ, coding & architecture scenario tests (<60% -> Guided Foundations, >=80% -> Accelerated Fast-Track).`,
        confidence: 96,
      },
      {
        agentId: 'ai_mentor_agent',
        agentName: 'AI Mentor Agent',
        taskPerformed: `Prepared Socratic code walkthroughs & analogies for ${safeName}`,
        outputSummary: `Ready to teach ${topFocusSkill} using analogies connected to ${safeName}'s current baseline.`,
        confidence: 98,
      },
      {
        agentId: 'progress_intelligence_agent',
        agentName: 'Progress Intelligence Agent',
        taskPerformed: 'Evaluated learning velocity, streak momentum & test score deltas',
        outputSummary: `Synchronized 3D Skill Universe globes, Skill Reels XP rewards, and adaptive difficulty tiers.`,
        confidence: 95,
      },
    ],
    priorityActions: [
      `Focus on ${topFocusSkill} in your active roadmap phase (${weeklyHours} hrs/week target)`,
      `Take the ${topFocusSkill} Assessment to calibrate your learning pace and illuminate its 3D Globe`,
      `Complete a 60-second Skill Reel micro-quiz to boost confidence and earn Dopamine XP`,
    ],
  };
}

// 1. Central Multi-Agent Orchestrator Endpoint
app.post('/api/agents/orchestrate', async (req, res) => {
  const startTime = Date.now();
  try {
    const { learnerName, targetCareer, skills, weeklyHours, triggerReason } = req.body || {};
    const safeName = sanitizeInput(learnerName || 'Alex', 120);
    const safeCareer = sanitizeInput(targetCareer || 'Full Stack Developer', 100);
    const safeReason = sanitizeInput(triggerReason || 'Manual Multi-Agent Orchestration', 200);
    const hours = Math.min(80, Math.max(2, Number(weeklyHours) || 12));
    const skillsList = Array.isArray(skills) ? skills.slice(0, 15) : [];

    const skillSummary =
      skillsList.length > 0
        ? skillsList
            .map(
              (s: any) =>
                `${sanitizeInput(s.name, 50)}: ${Number(s.proficiency) || 0}/5 (${sanitizeInput(
                  s.status,
                  20
                )})`
            )
            .join(', ')
        : 'Python: 4/5, SQL: 4/5, HTML: 2/5, JavaScript: 1/5, React: 0/5, Node.js: 0/5';

    const fallbackPayload = buildDeterministicEightAgents(
      safeName,
      safeCareer,
      hours,
      safeReason,
      skillsList
    );

    const ai = getGenAIClient();
    if (ai) {
      try {
        const prompt = `You are the NEXORA AI Central Multi-Agent Orchestrator coordinating 8 specialized agents for learner "${safeName}".
Target Career: ${safeCareer}
Available Weekly Hours: ${hours}
Trigger Event: ${safeReason}
Current Verified Skill Matrix: ${skillSummary}

Generate a coordinated multi-agent execution synthesis with specific, evidence-backed outputs for all 8 agents:
1. profile_agent (Profile Intelligence Agent)
2. skill_assessment_agent (Skill Assessment Agent)
3. career_agent (Career Intelligence Agent)
4. learning_architect_agent (Learning Architect Agent)
5. resource_discovery_agent (Resource Discovery Agent)
6. assessment_evaluator_agent (Assessment Evaluator Agent)
7. ai_mentor_agent (AI Mentor Agent)
8. progress_intelligence_agent (Progress Intelligence Agent)

Also provide an executiveSummary and 3 concrete priorityActions.`;

        const response = await ai.models.generateContent({
          model: 'gemini-4-hydrogen',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                executiveSummary: { type: Type.STRING },
                agentOutputs: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      agentId: { type: Type.STRING },
                      agentName: { type: Type.STRING },
                      taskPerformed: { type: Type.STRING },
                      outputSummary: { type: Type.STRING },
                      confidence: { type: Type.INTEGER },
                    },
                  },
                },
                priorityActions: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
            },
          },
        });

        const parsed = parseJsonSafe(response.text);
        if (parsed && Array.isArray(parsed.agentOutputs) && parsed.agentOutputs.length > 0) {
          return res.json({
            mode: 'live_gemini',
            durationMs: Date.now() - startTime,
            executiveSummary: parsed.executiveSummary || fallbackPayload.executiveSummary,
            agentOutputs: parsed.agentOutputs,
            priorityActions: parsed.priorityActions || fallbackPayload.priorityActions,
          });
        }
      } catch (geminiError) {
        console.warn('Gemini live orchestrate fallback to deterministic 8-agent engine:', geminiError);
      }
    }

    return res.json({
      mode: 'deterministic_engine',
      durationMs: Date.now() - startTime,
      ...fallbackPayload,
    });
  } catch (error) {
    console.error('Orchestrator error:', error);
    const fallbackPayload = buildDeterministicEightAgents(
      'Learner',
      'Full Stack Developer',
      12,
      'System Recovery Sync',
      []
    );
    return res.status(200).json({
      mode: 'deterministic_engine',
      durationMs: Date.now() - startTime,
      ...fallbackPayload,
    });
  }
});

// Comprehensive context-aware Socratic Mentor response builder
function buildContextualMentorResponse(
  safeMessage: string,
  safeName: string,
  safeCareer: string,
  safeMilestone: string,
  safeSkills: string
) {
  const lowerQ = safeMessage.toLowerCase();

  if (lowerQ.includes('promise') || lowerQ.includes('async') || lowerQ.includes('event loop') || lowerQ.includes('javascript')) {
    return {
      reply: `### Mastering JavaScript Promises & Async/Await for **${safeName}**\n\nBecause your target role is **${safeCareer}** (Active Milestone: *${safeMilestone}*), understanding non-blocking concurrency in JavaScript is essential:\n\n1. **Why Promises Beat Callbacks**: A \`Promise\` is a state machine (\`pending\` → \`fulfilled\` or \`rejected\`). Crucially, Promise callbacks (\`.then()\` / \`await\`) execute in the **Microtask Queue**, which drains *completely* right after the synchronous call stack before a single \`setTimeout\` (Macrotask) runs.\n2. **Production Pattern with Error Boundaries & Timeout Cancellation**:\n\n\`\`\`javascript\n// Production-grade async fetch with AbortController & HTTP status check\nexport async function fetchLearnerSkillMatrix(userId, timeoutMs = 5000) {\n  const controller = new AbortController();\n  const timer = setTimeout(() => controller.abort(), timeoutMs);\n\n  try {\n    const res = await fetch(\`/api/learners/\${encodeURIComponent(userId)}/skills\`, {\n      signal: controller.signal,\n    });\n    if (!res.ok) {\n      throw new Error(\`Skill API failed with HTTP \${res.status}\`);\n    }\n    const data = await res.json();\n    return data.skills.filter((s) => s.proficiency >= 3);\n  } finally {\n    clearTimeout(timer);\n  }\n}\n\`\`\`\n\n### 10-Minute Action Step\nOpen the **Assessment Center**, select **JavaScript (ES6+ & Async)**, and submit the 3-question evaluation. Scoring **80%+** switches your JavaScript learning mode to **Accelerated Mastery (Fast-Track)** and illuminates the JavaScript globe in your **3D Skill Universe**!`,
      agentInsights: [
        `Skill Assessment Agent: Synced explanation with your current matrix (${safeSkills.slice(0, 90)}...)`,
        `Learning Architect Agent: Connected directly to ${safeMilestone}`,
      ],
      suggestedFollowUps: [
        'Why should I learn JavaScript before React and Node.js?',
        'Explain React useState and useEffect hooks with a code example',
        'How do I build a secure REST API in Node.js and Express?',
      ],
    };
  }

  if (lowerQ.includes('react') || lowerQ.includes('hook') || lowerQ.includes('state') || lowerQ.includes('frontend') || lowerQ.includes('before')) {
    return {
      reply: `### React Component Architecture & Why JavaScript Comes First (**${safeName}**)\n\nOur **Learning Architect Agent** sequences **JavaScript (ES6+)** right before **React & State Architecture** on your **${safeCareer}** roadmap for three concrete engineering reasons:\n\n1. **JSX & Closures**: Every React component is a standard JavaScript function. Hooks like \`useEffect\` and event handlers capture variables from their lexical render scope.\n2. **Immutable State Updates**: React detects state changes by reference equality (\`Object.is\`), which requires ES6 spread syntax (\`[...prev, item]\`) and array methods (\`.map()\`, \`.filter()\`).\n\n\`\`\`tsx\nimport React, { useState, useMemo } from 'react';\n\ninterface SkillItem {\n  id: string;\n  name: string;\n  proficiency: number;\n}\n\nexport function AdaptiveSkillTracker({ initialSkills }: { initialSkills: SkillItem[] }) {\n  const [skills, setSkills] = useState<SkillItem[]>(initialSkills);\n\n  const masteredCount = useMemo(\n    () => skills.filter((s) => s.proficiency >= 4).length,\n    [skills]\n  );\n\n  const promoteSkill = (id: string) => {\n    setSkills((prev) =>\n      prev.map((s) => (s.id === id ? { ...s, proficiency: Math.min(5, s.proficiency + 1) } : s))\n    );\n  };\n\n  return (\n    <div>\n      <h4>Mastered Skills: {masteredCount} / {skills.length}</h4>\n      {skills.map((skill) => (\n        <button key={skill.id} onClick={() => promoteSkill(skill.id)}>\n          {skill.name} ({skill.proficiency}/5)\n        </button>\n      ))}\n    </div>\n  );\n}\n\`\`\`\n\n### Next Step\nClick the **React & State Architecture** globe in the **3D Skill Universe** or take its diagnostic test in the **Assessment Center** to verify your proficiency!`,
      agentInsights: [
        `Career Intelligence Agent: React accounts for 18% of ${safeCareer} role weighting`,
        `Resource Discovery Agent: Linked React.dev Official Interactive Learn in Knowledge Library`,
      ],
      suggestedFollowUps: [
        'How do I connect a React frontend to a Node.js & Express REST API?',
        'Explain SQL indexing and joins for Full Stack interviews',
        'Give me a 15-minute practice exercise for my active milestone',
      ],
    };
  }

  if (lowerQ.includes('node') || lowerQ.includes('express') || lowerQ.includes('api') || lowerQ.includes('rest') || lowerQ.includes('backend')) {
    return {
      reply: `### Production Node.js, Express & REST API Architecture for **${safeName}**\n\nTo reach **${safeCareer}** readiness, your backend layer needs clean middleware separation, schema validation, and parameterized database queries:\n\n1. **Non-Blocking Event-Driven I/O**: Node.js handles thousands of concurrent requests on a single thread by delegating database and network I/O to the kernel (\`libuv\`) and resolving Promises when data returns.\n2. **Zero-Trust Input Validation & Error Middleware**:\n\n\`\`\`typescript\nimport express, { Request, Response, NextFunction } from 'express';\n\nconst router = express.Router();\n\n// Centralized async error wrapper\nconst asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) =>\n  Promise.resolve(fn(req, res, next)).catch(next);\n\nrouter.post('/api/assessments/submit', asyncHandler(async (req: Request, res: Response) => {\n  const { skillId, scorePercentage } = req.body;\n  if (typeof skillId !== 'string' || typeof scorePercentage !== 'number') {\n    return res.status(400).json({ error: 'Invalid payload schema' });\n  }\n  const paceMode = scorePercentage >= 80\n    ? 'Accelerated Mastery (Fast-Track)'\n    : scorePercentage >= 60\n    ? 'Applied Practice (Hands-On)'\n    : 'Guided Foundations (Step-by-Step)';\n\n  return res.status(200).json({ skillId, scorePercentage, paceMode });\n}));\n\`\`\`\n\n### Next Step\nComplete the **Node.js Runtime** or **RESTful APIs & Auth** checkpoint in the **Assessment Center** to unlock the backend phases of your roadmap!`,
      agentInsights: [
        `Profile Intelligence Agent: Connected backend architecture to your SQL & Python knowledge`,
        `Assessment Evaluator Agent: Backend API scenario questions ready in Assessment Center`,
      ],
      suggestedFollowUps: [
        'How do I prevent SQL injection and XSS in a Full Stack app?',
        'Explain JWT authentication vs session cookies',
        'How can I raise my Career Readiness score above 75%?',
      ],
    };
  }

  if (lowerQ.includes('sql') || lowerQ.includes('database') || lowerQ.includes('python') || lowerQ.includes('security') || lowerQ.includes('xss') || lowerQ.includes('injection')) {
    return {
      reply: `### High-Performance SQL & Zero-Trust AppSec Guide for **${safeName}**\n\nWhen building production systems for **${safeCareer}**, database performance and security go hand in hand:\n\n1. **Composite B-Tree Indexing**: If your query filters by \`WHERE user_id = $1 ORDER BY created_at DESC\`, create a composite index on \`(user_id, created_at DESC)\` so PostgreSQL performs a single Index Scan instead of a full table scan + sort.\n2. **Parameterized Queries (Zero SQL Injection)**: Never interpolate user strings into SQL. Always pass parameters separately:\n\n\`\`\`sql\n-- 1. Create a high-efficiency composite B-Tree index\nCREATE INDEX CONCURRENTLY idx_assessments_user_created\nON learner_assessments (user_id, created_at DESC);\n\n-- 2. Parameterized query ($1, $2) prevents SQL injection completely\nSELECT skill_id, score_percentage, learning_pace_mode\nFROM learner_assessments\nWHERE user_id = $1 AND score_percentage >= $2\nORDER BY created_at DESC\nLIMIT 20;\n\`\`\`\n\n### Next Step\nTest your **SQL & Relational Modeling** or **AppSec & Zero-Trust Security** globe in the **Assessment Center** to boost your verified readiness score!`,
      agentInsights: [
        `Skill Assessment Agent: Verified SQL & Security patterns against ${safeCareer}`,
        `Progress Intelligence Agent: Completing 1 assessment awards +120 Dopamine XP`,
      ],
      suggestedFollowUps: [
        'Explain JavaScript Promises vs Python async/await for my background',
        'How do I connect React to a Node.js & Express backend?',
        'What is my highest-priority skill gap right now?',
      ],
    };
  }

  // Default comprehensive personalized response for any custom prompt or study strategy question
  return {
    reply: `### Personalized AI Mentor Strategy for **${safeName}** (Target: **${safeCareer}**)\n\nI analyzed your question (*"${safeMessage}"*) alongside your live skill profile (**${safeSkills}**) and active milestone (**${safeMilestone}**):\n\n1. **Your Highest-Leverage Focus Right Now**: Prioritize **${safeMilestone}**. Every lesson or exercise you complete in the **Adaptive Roadmap** directly increases your **${safeCareer}** readiness score.\n2. **How Your Test Results Adapt Your Pace**:\n   - Scoring **< 60%** activates **Guided Foundations (Step-by-Step)** and injects a remedial drill at the top of your phase.\n   - Scoring **60%–79%** activates **Applied Practice (Hands-On)**.\n   - Scoring **≥ 80%** unlocks **Accelerated Mastery (Fast-Track)**, marks foundational lessons complete, and illuminates that skill's 3D Globe in the **3D Skill Universe**!\n\n\`\`\`javascript\n// Quick 10-Minute Daily Momentum Loop in NEXORA AI\nconst dailyLearningLoop = [\n  '1. Watch & answer one 60-second Skill Reel (+75 XP)',\n  '2. Complete active lesson in ${safeMilestone} (+20 XP)',\n  '3. Pass the 3-question Skill Assessment (>=80% -> Fast-Track Mastery!)',\n];\n\`\`\`\n\nAsk me about any specific language, framework, algorithm, or career interview topic below!`,
    agentInsights: [
      `Central Orchestrator: Synchronized all 8 agents for ${safeName} (${safeCareer})`,
      `Learning Architect Agent: Focused on ${safeMilestone}`,
    ],
    suggestedFollowUps: [
      'Explain JavaScript Promises vs Python async/await for my background',
      'Explain React useState and useEffect hooks with a code example',
      'How do I build a secure REST API in Node.js and Express?',
    ],
  };
}

// 2. Conversational AI Mentor Endpoint
app.post('/api/mentor/chat', async (req, res) => {
  try {
    const { message, profileContext, history } = req.body || {};
    const safeMessage = sanitizeInput(message, 2000);
    if (!safeMessage) {
      return res.status(400).json({ error: 'Message content is required.' });
    }

    const safeName = sanitizeInput(profileContext?.fullName || 'Alex', 80);
    const safeCareer = sanitizeInput(profileContext?.targetCareer || 'Full Stack Developer', 80);
    const safeMilestone = sanitizeInput(
      profileContext?.currentMilestone || 'Phase 1: JavaScript Fundamentals',
      140
    );
    const safeSkills = sanitizeInput(
      profileContext?.skillsSummary || 'Python (4/5), SQL (4/5), HTML (2/5), JS (1/5)',
      600
    );

    const contextualFallback = buildContextualMentorResponse(
      safeMessage,
      safeName,
      safeCareer,
      safeMilestone,
      safeSkills
    );

    const ai = getGenAIClient();
    if (ai) {
      try {
        const historyText = Array.isArray(history)
          ? history
              .slice(-6)
              .map(
                (m: any) =>
                  `${m.role === 'user' ? 'Learner' : 'NEXORA Mentor'}: ${sanitizeInput(
                    m.content,
                    500
                  )}`
              )
              .join('\n')
          : '';

        const systemInstruction = `You are the NEXORA AI Mentor Agent—an encouraging, deeply technical senior engineering mentor inside the NEXORA 3D Personalized Learning Ecosystem.
Learner Profile:
- Name: ${safeName}
- Target Career: ${safeCareer}
- Verified Skills & Levels: ${safeSkills}
- Current Roadmap Milestone: ${safeMilestone}

Guidelines:
- Tailor explanations directly to ${safeName}'s existing profile and target career (${safeCareer}).
- Provide concise, runnable code examples in Markdown fenced blocks when explaining technical concepts.
- Suggest a concrete 10-minute practice exercise or assessment step.
- Coordinate with the other 7 NEXORA agents in your insights.`;

        const response = await ai.models.generateContent({
          model: 'gemini-4-hydrogen',
          contents: `${
            historyText ? `Recent Conversation:\n${historyText}\n\n` : ''
          }Learner Question: ${safeMessage}`,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                reply: {
                  type: Type.STRING,
                  description:
                    'Markdown formatted mentor response with code examples and tailored advice.',
                },
                agentInsights: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description:
                    '2 short notes showing coordination with Skill Assessment, Career, or Learning Architect agents.',
                },
                suggestedFollowUps: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: '3 concise follow-up questions the learner can click next.',
                },
              },
            },
          },
        });

        const parsed = parseJsonSafe(response.text);
        if (parsed && typeof parsed.reply === 'string' && parsed.reply.trim().length > 10) {
          return res.json({
            mode: 'live_gemini',
            reply: parsed.reply,
            agentInsights:
              Array.isArray(parsed.agentInsights) && parsed.agentInsights.length > 0
                ? parsed.agentInsights
                : contextualFallback.agentInsights,
            suggestedFollowUps:
              Array.isArray(parsed.suggestedFollowUps) && parsed.suggestedFollowUps.length > 0
                ? parsed.suggestedFollowUps
                : contextualFallback.suggestedFollowUps,
          });
        }
      } catch (geminiErr) {
        console.warn('Gemini Mentor chat fallback to contextual mentor engine:', geminiErr);
      }
    }

    return res.json({
      mode: 'context_engine',
      ...contextualFallback,
    });
  } catch (error) {
    console.error('Mentor chat error:', error);
    const fallback = buildContextualMentorResponse(
      String(req.body?.message || 'study plan'),
      'Learner',
      'Full Stack Developer',
      'Phase 1: Core Foundations',
      'Baseline Profile'
    );
    return res.status(200).json({
      mode: 'context_engine',
      ...fallback,
    });
  }
});

// 3. Gemini AI Voice Assistant & TTS Audio Endpoint
app.post('/api/voice/assistant', async (req, res) => {
  try {
    const { prompt, profileContext, voiceName } = req.body || {};
    const safePrompt = sanitizeInput(
      prompt || 'Give me a quick 30-second voice coaching update on my learning progress.',
      1200
    );
    const safeName = sanitizeInput(profileContext?.fullName || 'Learner', 80);
    const safeCareer = sanitizeInput(profileContext?.targetCareer || 'Full Stack Developer', 80);
    const safeSkills = sanitizeInput(profileContext?.skillsSummary || 'Unassessed baseline', 600);
    const safeLastTest = sanitizeInput(
      profileContext?.lastTestSummary || 'No tests completed yet',
      300
    );
    const selectedVoice = ['Kore', 'Puck', 'Charon', 'Fenrir', 'Zephyr'].includes(voiceName)
      ? voiceName
      : 'Kore';

    let spokenScript = `Hey ${safeName}! Keep your learning streak alive. Based on your ${safeCareer} goal and latest test metrics (${safeLastTest}), your highest-dopamine win right now is completing one 60-second Skill Reel and taking the adaptive checkpoint to illuminate your next 3D Skill Globe!`;

    const ai = getGenAIClient();
    let base64WavAudio: string | null = null;
    let mode: 'live_gemini_tts' | 'voice_synthesis_engine' = 'voice_synthesis_engine';

    if (ai) {
      try {
        const textResponse = await ai.models.generateContent({
          model: 'gemini-4-hydrogen',
          contents: `Learner "${safeName}" targeting "${safeCareer}".
Current skills: ${safeSkills}.
Latest test result: ${safeLastTest}.
Learner voice prompt: "${safePrompt}"

Write an energetic, warm, spoken-aloud coaching response (2 to 3 sentences max, plain spoken English, no markdown bullets or code blocks) that adjusts their learning strategy based on their test results and triggers positive momentum.`,
        });
        if (textResponse.text) {
          spokenScript = textResponse.text.replace(/[*#`]/g, '').trim();
        }
      } catch (textErr) {
        console.warn('Voice assistant text step fallback:', textErr);
      }

      try {
        const ttsResponse = await ai.models.generateContent({
          model: 'gemini-3.8-flash-lite-tts',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: spokenScript,
                  speechMetadata: {
                    style: 'Warm, encouraging, energetic AI learning coach',
                  },
                },
              ],
            },
          ],
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: selectedVoice },
              },
            },
          },
        });

        const inlineAudio = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (inlineAudio) {
          base64WavAudio = inlineAudio;
          mode = 'live_gemini_tts';
        }
      } catch (ttsErr) {
        console.warn('Gemini TTS audio fallback to browser speechSynthesis:', ttsErr);
      }
    }

    return res.json({
      mode,
      voiceName: selectedVoice,
      transcript: spokenScript,
      audioMimeType: base64WavAudio ? 'audio/wav' : null,
      base64Audio: base64WavAudio,
      dopamineTip: '+25 XP Voice Coaching Synced to Adaptive Roadmap',
    });
  } catch (error) {
    console.error('Voice assistant error:', error);
    return res.status(200).json({
      mode: 'voice_synthesis_engine',
      voiceName: 'Kore',
      transcript:
        'Your adaptive learning roadmap is calibrated to your latest test scores. Focus on your active skill globe to unlock the next milestone!',
      audioMimeType: null,
      base64Audio: null,
      dopamineTip: '+25 XP Voice Coaching Synced',
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NEXORA AI Server running on http://localhost:${PORT}`);
  });
}

startServer();
