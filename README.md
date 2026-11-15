# NEXORA AI — Next-Generation Multi-Agent Personalized Learning Ecosystem

> **Tagline:** Discover your potential. Master your skills. Build your future.

**NEXORA AI** is a production-grade, AI-powered personalized learning ecosystem built for students, working professionals, universities, and organizations. It combines **8 specialized Gemini AI agents**, **Instagram-inspired Dopamine Skill Reels (InstaLearn)**, a **Gemini AI Voice Coach**, and an **Interactive 3D Circuit Skill Universe** to identify existing skills, isolate critical career skill gaps, recommend prerequisite-ordered learning paths, and dynamically adapt learning strategies based on real assessment performance and career goals.

---

## 🎯 Problem Statement Alignment Matrix (100% Coverage)

| Expected Feature / Requirement | Implementation in NEXORA AI | Primary Source Modules |
| :--- | :--- | :--- |
| **1. User Profile**<br>*(Learner details, existing skills, certifications, projects, and career goals)* | Maintains full learner profile (qualification, institution, role, weekly hours, short/long-term goals, certifications held, projects built, and resume/certificate NLP extraction) with **Zero Demo Data** for new users and Google Sign-In persistence. | `src/components/IntelligenceAndAgentViews.tsx` (`SkillAndProfileViews`)<br>`src/components/LandingAndAuthViews.tsx` |
| **2. Skill Analysis**<br>*(Identify strengths and weaknesses based on skills and assessments)* | Evaluates 11+ technical competencies on a 1–5 evidence-backed proficiency scale (`0 = Unexplored`, `1 = Beginner`, `2 = Elementary`, `3 = Intermediate`, `4 = Advanced`, `5 = Expert`) with confidence scores and diagnostic question breakdowns. | `src/lib/learningEngine.ts`<br>`src/components/AssessmentAndRoadmapViews.tsx` |
| **3. Career Matching**<br>*(Compare current skills with the requirements of a selected job role)* | Benchmarks learner competencies against 11 industry career paths (Full Stack Developer, AI/ML Engineer, Data Scientist, Cybersecurity Engineer, Cloud Engineer, DevOps, Frontend, Backend, etc.) plus custom role creation. | `src/lib/learningEngine.ts` (`analyzeCareerCompatibility`)<br>`src/data/nexoraCatalog.ts` |
| **4. Learning Recommendations**<br>*(Suggest relevant courses, tutorials, and practical exercises)* | Recommends a dependency-ordered 8-phase adaptive roadmap with interactive lessons, coding exercises, mini-projects, 60-second Skill Reels, and 12+ verified documentation/course resources. | `src/components/AssessmentAndRoadmapViews.tsx`<br>`src/components/DopamineReelsAndVoiceViews.tsx` |
| **5. Progress Tracking**<br>*(Monitor learning progress and assessment performance)* | Tracks before-and-after skill proficiency deltas, weekly study hours vs. targets, assessment score trajectories, consistency streaks, and unlocked achievement badges. | `src/components/IntelligenceAndAgentViews.tsx` (`ProgressAnalyticsView`) |
| **6. AI Mentor**<br>*(Provide guidance and update learning recommendations based on individual performance)* | Conversational Socratic AI Mentor (`/api/mentor/chat`) + Gemini AI Voice Coach (`/api/voice/assistant`) that automatically posts proactive remediation or fast-track recommendations after every assessment or career change. | `server.ts`<br>`src/components/IntelligenceAndAgentViews.tsx` (`AIMentorAndAgentsView`) |
| **Agentic AI Requirement**<br>*(Multiple specialized AI agents collaborating & adapting to poor performance or career goal changes)* | **8 Collaborating AI Agents** (`Profile Intelligence`, `Skill Assessment`, `Career Intelligence`, `Learning Architect`, `Resource Discovery`, `Assessment Evaluator`, `AI Mentor`, `Progress Intelligence`) automatically re-orchestrate when a learner switches career goals or scores `<60%` / `60–79%` / `>=80%` on an assessment. | `server.ts` (`/api/agents/orchestrate`)<br>`src/App.tsx` |
| **Sample Scenario**<br>*(Student targeting Full Stack Developer; Current: Python, SQL, basic HTML; Missing: JavaScript, React, Node.js)* | Built-in 1-click Sample Scenario (*Alex Rivera*): verifies **Python (4/5)**, **SQL (4/5)**, and **Basic HTML (2/5)**, flags **JavaScript**, **React**, and **Node.js** as critical gaps, sequences an 8-phase roadmap, and tracks progress across the 3D Skill Universe. | `src/data/nexoraCatalog.ts` (`createAlexDemoSkills`, `createAlexEightPhaseRoadmap`) |

---

## ✨ Key Architectural Highlights

### 1. Interactive 3D Circuit Skill Universe (Portfolio 3D Command Hub Mechanism)
- **3D Neural Core & Grounded Station Pedestals:** Built with Three.js (`WebGLRenderer`, zero-allocation render loop) featuring a central Neural Processor IC connected to skill stations via orthogonal PCB circuit conduits and traveling data pulse spheres.
- **3D-to-2D Projected HUD Reticles:** Real-time projected floating station reticles (`data-testid="station-reticles-layer"`) with live proficiency badges, top-right `FPS` telemetry HUD, `HIGH QUALITY ON/OFF`, and `SOUND ON/OFF` Web Audio synthesizer chimes.
- **Click-to-Fly & Scroll-to-Model:** Clicking any 3D skill globe or floating HUD reticle smoothly flies the camera to that station and scrolls the viewport directly to its corresponding **Skill Globe Model Card** (`#skill-globe-model-{id}`).
- **2D Accessible Constellation Fallback:** One-click accessible 2D matrix mode and `prefers-reduced-motion` support.

### 2. Test-Calibrated Adaptive Learning Engine
- **Score < 60%:** Switches skill to **Guided Foundations (Step-by-Step)**, injects a `[Guided Step-by-Step Remediation]` walkthrough lesson into the active roadmap phase, and triggers a proactive AI Mentor remediation plan.
- **Score 60–79%:** Switches skill to **Applied Practice (Hands-On)** at Intermediate difficulty.
- **Score ≥ 80%:** Promotes skill to **Level 4–5 Mastered**, activates **Accelerated Mastery (Fast-Track)**, completes foundational lessons, unlocks the next roadmap phase, and illuminates the 3D Skill Globe in emerald-cyan.

---

## 🛡️ 6-Parameter Quality Assurance Summary

1. **Code Quality:** Strict TypeScript (`"strict": true`, `"noImplicitReturns": true`, `"noFallthroughCasesInSwitch": true`, zero `any` types), modular single-responsibility architecture (`nexoraCatalog.ts`, `learningEngine.ts`, `DashboardCommandCenterView.tsx`, `ErrorBoundary.tsx`), and top-level React `ErrorBoundary`.
2. **Security:** Zero client-side API keys (`GEMINI_API_KEY` isolated in `server.ts`), OWASP ASVS security headers (`Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Permissions-Policy`, `Referrer-Policy`, `x-powered-by` disabled), sliding-window IP rate limiting, XSS/prompt-injection sanitization, and verified Zero-Trust `firestore.rules`.
3. **Efficiency:** Zero-GC pre-allocated Three.js vectors in `requestAnimationFrame`, direct DOM `translate3d` HUD reticle projection, capped device pixel ratio, complete WebGL geometry/material/texture disposal on unmount, and 3.5s `AbortController` API timeouts.
4. **Testing:** 15 automated unit, boundary, and security rule tests (`npm test`) via Node's native test runner (`node:test`) and `@firebase/rules-unit-testing`.
5. **Accessibility:** WCAG 2.2 AA compliant with Skip-to-Main-Content links, `:focus-visible` keyboard rings, `aria-live="polite"` status regions, semantic landmarks, 2D Constellation fallback, and `prefers-reduced-motion` media queries.
6. **Problem Statement Alignment:** 100% alignment with all 6 Expected Features, 8-Agent collaboration, dynamic adaptation on poor test performance or career change, and the Full Stack Developer Sample Scenario.

---

## 🚀 Getting Started Locally

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/<your-username>/NEXORA-AI-Multi-Agent-Personalized-Learning-Universe.git
cd NEXORA-AI-Multi-Agent-Personalized-Learning-Universe
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and set your Gemini API Key:
```bash
cp .env.example .env
```
```env
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
APP_URL="http://localhost:3000"
```

### 3. Run Automated Unit & Security Tests
```bash
npm test
```

### 4. Start the Full-Stack Development Server
```bash
npm run dev
```

### 5. Production Typecheck & Build
```bash
npm run lint
npm run build
```
