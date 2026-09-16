# 🧠 StudyMind AI

> **Next-Gen AI Cognitive Learning Platform & Pre-Placement Career Crash Simulator**  
> *Don't just prepare for a career blindly. Crash-test it in production simulations before you commit months of preparation.*

[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=flat&logo=supabase&logoColor=white)](https://supabase.com/)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FSoumya0204-star%2FStudyMind-AI)

---

## 🌟 Overview

Most placement platforms offer the same generic recipe: generic roadmaps, skill checklists, chatbot advice, and mock interviews. Yet **thousands of students still struggle during placements or join jobs they immediately regret**.

**StudyMind AI** solves this problem at its root through a dual-engine architecture:
1. **The Career Crash Simulator**: Lets students test target career paths (AI/ML Engineer, Full Stack Architect, Cybersecurity Specialist, Data Systems) in high-fidelity simulated work environments before investing months of effort.
2. **The Adaptive Cognitive Learning Suite**: Proprietary cognitive engines (Webcam Vision Posture/Focus Tracking, Spaced Repetition, Feynman Technique, Active Recall & Blurting) that turn simulation-diagnosed weaknesses into mastered competencies.

---

## 🚀 Key Features

### 1. ⚡ Career Crash Simulator (`/simulator`)
- **Stage 1: Micro-Task Reality Check**: Experience what the actual day-to-day job looks like (data pipeline debugging, distributed race conditions, zero-day CVE audits, query execution plans).
- **Stage 2: Production Incident Investigation**: Inspect logs, stack traces, and system telemetry to pinpoint root causes under realistic constraints.
- **Stage 3: Timed Stress Round**: Face real-time countdown scenarios simulating production outages, live interview pressure, and emergency rollbacks.
- **Stage 4: Reality Scorecard**: Comprehensive radar chart evaluation across Composure, Analytical Depth, Architecture Intuition, and Execution Velocity.

### 2. 🚨 Boss Battle Incident War Room
- Real-time SEV-1 production war room with streaming incident telemetry (CPU utilization, memory usage, request throughput, error spikes).
- Interactive diagnostic terminal: execute probes, inspect heap dumps, isolate pods, and apply hotfixes.
- Post-incident post-mortem analysis evaluating decision rationale and time-to-mitigate.

### 3. 🗺️ Pre-Placement Bottleneck & Failure Map
- Predictive audit revealing the exact failure vectors that cause 70%+ of student interview drops for each career path.
- Direct 1-click **cognitive prescriptions** linking diagnosed bottlenecks straight into StudyMind study modules.

### 4. 🔄 Career Switch Cost & Transferable Skills Analyzer
- Visual proof that **you never restart from zero**: calculates transferable skill overlaps (e.g., Python, SQL, distributed systems intuition) between roles.
- Workload estimation and timeline projections for pivoting between tech domains.

### 5. 📊 30-Second Judge Benchmark & Retest Proof
- Side-by-side progression proof comparing:
  - **Sim #1 (Baseline)**: Initial diagnostic score & identified bottlenecks.
  - **7-Day Cognitive Sprint**: Focused remediation using StudyMind tools.
  - **Sim #2 (Retest)**: Verified score improvement and reduced resolution time.

### 6. 🧠 AI Cognitive Study Engine
- **Vision AI Posture & Eye-Tracking**: Real-time webcam focus monitoring detecting slouching, fatigue, and distraction.
- **Feynman Technique Explainer**: Explain complex concepts to an AI student that asks probing questions to expose conceptual gaps.
- **Active Recall & Blurting Canvas**: Timed knowledge retrieval exercises with automated completeness evaluation.
- **Spaced Repetition Flashcards**: SuperMemo-2 algorithmic review scheduling.
- **Verified Certificates**: Cryptographically verifiable credential issuance upon completion.

---

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Bundler & Tooling**: Vite
- **Styling & UI**: Tailwind CSS, Aurora Glassmorphism Design System, Lucide React icons
- **Data Visualization**: Recharts (Radar, Area, Bar, Line charts)
- **State & Routing**: React Router v6, React Context API
- **Backend & Auth**: Supabase (with instant 1-click Guest Mode preview)
- **Audio & Visual Effects**: Web Audio API synthesized telemetry, Canvas Confetti

---

## 📦 Getting Started

### Prerequisites
- Node.js 18+ or 20+
- npm, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Soumya0204-star/StudyMind-AI.git
cd StudyMind-AI
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory (or use default public sandbox credentials):
```env
VITE_SUPABASE_PROJECT_ID="cpszzjmjryygbzsttubm"
VITE_SUPABASE_PUBLISHABLE_KEY="your-supabase-publishable-key"
VITE_SUPABASE_URL="https://cpszzjmjryygbzsttubm.supabase.co"
```

4. Start the local development server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

5. Build for production:
```bash
npm run build
```

---

## 📁 Project Structure

```text
studyy-mind-ai/
├── public/                 # Static assets, audio, favicon
├── src/
│   ├── components/
│   │   ├── career/         # Career Crash Simulator & Boss Battle views
│   │   ├── layout/         # AppNavbar, Footer, Navigation
│   │   ├── ui/             # Radix UI + Tailwind design system components
│   │   └── ...             # Cognitive study tools & vision components
│   ├── contexts/           # AuthContext (includes 1-click Guest Mode)
│   ├── data/               # Simulation datasets, failure maps, switch costs
│   ├── hooks/              # Custom React hooks (useToast, useTheme, etc.)
│   ├── integrations/       # Supabase client and types
│   ├── pages/
│   │   ├── LandingPage.tsx # Hero, features, live interactive sandbox
│   │   ├── CareerSimulator.tsx # Master 6-tab Simulator Hub
│   │   ├── Dashboard.tsx   # Student dashboard & launchpads
│   │   └── ...             # Study planner, certificates, auth
│   ├── types/              # TypeScript definitions for career simulator & app
│   ├── index.css           # Design tokens, mesh aurora, glassmorphism styles
│   └── main.tsx            # Application entry point
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Soumya0204-star/StudyMind-AI/issues).

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
