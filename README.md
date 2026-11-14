# NEXORA AI — Next-Generation Multi-Agent Personalized Learning Ecosystem

> **Tagline:** Discover your potential. Master your skills. Build your future.

**NEXORA AI** is an AI-powered personalized learning ecosystem that combines **8 specialized Gemini AI agents**, **Instagram-inspired Dopamine Skill Reels (InstaLearn)**, a **Gemini AI Voice Coach**, and an **Interactive 3D Circuit Skill Universe** to identify skill gaps, dynamically calibrate learning roadmaps from real assessment scores, and accelerate career mastery.

---

## ✨ Key Architectural Highlights

### 1. Interactive 3D Circuit Skill Universe (Portfolio 3D Command Hub Mechanism)
- **3D Neural Core & Grounded Station Pedestals:** Built with Three.js (`WebGLRenderer`, `InstancedMesh`, zero-allocation render loop) featuring a central Neural Processor IC connected to 8 skill stations via orthogonal PCB circuit conduits and traveling data pulse spheres.
- **3D-to-2D Projected HUD Reticles:** Real-time projected floating station reticles (`data-testid="station-reticles-layer"`) with live proficiency badges, top-right `FPS` telemetry HUD, `HIGH QUALITY ON/OFF`, and `SOUND ON/OFF` Web Audio synthesizer chimes.
- **Click-to-Fly & Scroll-to-Model:** Clicking any 3D skill globe or floating HUD reticle smoothly flies the camera to that station and scrolls the viewport directly to its corresponding **Skill Globe Model Card** (`#skill-globe-model-{id}`).
- **2D Accessible Constellation Fallback:** One-click accessible 2D matrix mode and Reduced Motion support.

### 2. Eight Collaborating AI Agents (`/api/agents/orchestrate`)
1. **Profile Intelligence Agent:** Extracts verified competencies from learner credentials, resumes, and certificates with prompt-injection sanitization.
2. **Skill Assessment Agent:** Evaluates proficiency on a strict 1–5 evidence-backed scale (`0 = Unexplored`, `1 = Beginner`, `2 = Elementary`, `3 = Intermediate`, `4 = Advanced`, `5 = Expert`).
3. **Career Intelligence Agent:** Calculates weighted compatibility scores across 11+ industry roles (Full Stack Developer, AI Engineer, Data Scientist, Cybersecurity Analyst, Cloud Architect, etc.) and custom career targets.
4. **Learning Architect Agent:** Generates dependency-ordered, multi-phase adaptive learning roadmaps tailored to weekly study hours.
5. **Resource Discovery Agent:** Curates verified documentation, courses, and practice labs from authoritative sources (MDN, React.dev, OpenJS, PostgreSQL, OWASP, Google Developers).
6. **Assessment Evaluator Agent:** Grades multi-modal diagnostic assessments and dynamically recalibrates the learner's pace:
   - **Score < 60%:** Assigns *Guided Foundations (Step-by-Step)* & injects remediation drills.
   - **Score 60–79%:** Assigns *Applied Practice (Hands-On)*.
   - **Score ≥ 80%:** Unlocks *Accelerated Mastery (Fast-Track)*.
7. **Progress Intelligence Agent:** Tracks before-and-after skill deltas, study hours, streaks, and readiness trajectories.
8. **AI Mentor Agent (`/api/mentor/chat`):** Provides context-aware engineering mentorship with runnable code examples, architecture explanations, voice read-aloud, and 8-agent telemetry insights.

### 3. Neuro-Design & Healthy Dopamine Learning Loop (InstaLearn)
- **Color Psychology Palette:** Deep OLED Obsidian (`#09070f` / `#120d1d`) paired with Sunset Coral (`#ff3040`), Hyper Magenta (`#ec4899`), Dopamine Amber (`#f59e0b`), and Verification Emerald (`#10b981`).
- **60-Second Skill Stories & Reels:** Bite-sized vertical code cards with Zeigarnik progress rings and 10-second micro-quizzes that award instant Dopamine XP bursts.
- **Gemini AI Voice Assistant (`/api/voice/assistant`):** Powered by `gemini-3.8-flash-lite-tts` (`Kore`, `Puck`, `Zephyr` voice personas) + Web Speech synthesis and microphone speech recognition.

### 4. Clean Zero-Demo New-User Onboarding & Security
- **Zero Demo Data for New Learners:** New users signing in via Google OAuth (`signInWithPopup`) or creating a clean learner profile start with all skills at `0/5 (Unexplored)` and zero fake history.
- **Sample Scenario Mode:** Includes a 1-click preview of the Problem Statement sample scenario (*Alex Rivera — Python, SQL, HTML mastered; missing JavaScript, React, Node.js for Full Stack Developer*).
- **Zero-Trust Security:** Hardened `firestore.rules` enforcing document ownership (`isOwner`), email verification, strict schema validation, server-side Gemini API key isolation, IP rate limiting, and prompt-injection sanitization.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Three.js (WebGL), Recharts, Lucide Icons
- **Backend:** Node.js, Express (`server.ts`), `@google/genai` SDK (`gemini-4-hydrogen`, `gemini-3.8-flash-lite-tts`)
- **Authentication & Database:** Firebase Authentication (Google Sign-In) & Cloud Firestore
- **Testing & Verification:** Node.js native test runner (`node:test`), `@firebase/rules-unit-testing`, Playwright CLI

---

## 🚀 Getting Started Locally

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/saaiyeshwanth273-ship-it/NEXORA-AI-Multi-Agent-Personalized-Learning-Universe.git
cd NEXORA-AI-Multi-Agent-Personalized-Learning-Universe
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and provide your Gemini API Key:
```bash
cp .env.example .env
```
```env
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
APP_URL="http://localhost:3000"
```

### 3. Start the Full-Stack Development Server
```bash
npm run dev
```
The Express + Vite server will launch at `http://localhost:3000`.

### 4. Run Automated Unit & Security Tests
```bash
npx tsx --test src/lib/learningEngine.test.ts firestore.rules.test.ts
```

### 5. Production Build & Typecheck
```bash
npm run lint
npm run build
```

---

## 📁 Project Structure

```text
├── server.ts                                  # Express server + Gemini 8-Agent, AI Mentor & TTS Voice API routes
├── firestore.rules                            # Zero-Trust Firestore Security Rules
├── firestore.rules.test.ts                    # Adversarial Firestore Security Rules test suite
├── src/
│   ├── App.tsx                                # Main application shell, navigation & Firebase state sync
│   ├── firebase.ts                            # Firebase Auth & Firestore client initialization
│   ├── types/nexora.ts                        # Strict TypeScript domain interfaces
│   ├── lib/
│   │   ├── learningEngine.ts                  # Pure domain logic: compatibility math, adaptive roadmap, grading
│   │   └── learningEngine.test.ts             # Unit test suite for all learning & security logic
│   └── components/
│       ├── NexoraUniverse3D.tsx               # Interactive 3D Circuit Skill Universe + HUD Reticles + Model Cards
│       ├── LandingAndAuthViews.tsx            # Gateway Landing, Learner Google Auth & Clean Onboarding Wizard
│       ├── DopamineReelsAndVoiceViews.tsx     # Instagram-style Skill Reels Feed & Gemini AI Voice Coach
│       ├── AssessmentAndRoadmapViews.tsx      # Adaptive Roadmap, Assessment Center & Verified Knowledge Library
│       └── IntelligenceAndAgentViews.tsx      # Skill Matrix, Career Explorer, Analytics, AI Mentor & 8-Agent Center
└── README.md
```
