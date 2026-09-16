import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  Brain,
  Rocket,
  Flame,
  AlertTriangle,
  Shuffle,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Sun,
  Moon,
  Clock,
  Activity,
  Award,
  Terminal,
  BarChart3,
  Lock,
  Layers,
  Zap,
  BookOpen,
  Search,
  Check,
  Code2,
  TrendingUp,
  ChevronRight,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();
  const { user, signIn, signUp, signInAsGuest } = useAuth();

  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains("dark"));
  const [selectedRolePreview, setSelectedRolePreview] = useState<"ai" | "fullstack" | "cyber" | "data">("ai");
  const [activeProbe, setActiveProbe] = useState<string | null>(null);

  // Auth Dialog State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);

    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) {
        toast({ title: "Sign in failed", description: error.message, variant: "destructive" });
      } else {
        setShowAuthModal(false);
        navigate("/dashboard");
      }
    } else {
      if (!name.trim()) {
        toast({ title: "Name required", description: "Please enter your full name", variant: "destructive" });
        setAuthLoading(false);
        return;
      }
      const { error } = await signUp(email, password, name);
      if (error) {
        toast({ title: "Signup failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Account created!", description: "You can now sign in." });
        setIsLogin(true);
      }
    }
    setAuthLoading(false);
  };

  const handleGuestDemo = () => {
    signInAsGuest();
    toast({ title: "Judge & Demo Access Granted! 🚀", description: "Exploring full StudyMind platform." });
    navigate("/dashboard");
  };

  const handleLaunchSimulator = () => {
    if (!user) {
      signInAsGuest();
    }
    navigate("/simulator");
  };

  const rolePreviews = {
    ai: {
      title: "AI / ML Engineer",
      badge: "Production Drift & Math",
      scenario: "Offline test accuracy was 91.4%. Overnight in production, it plummeted to 67.2%. Isolate root cause.",
      code: `[TELEMETRY MONITOR]
Wasserstein distance: 0.48 (Severe Drift Alert)
Test Mean Age: 34.2 | Live Production Mean Age: 22.1
Finding: University marketing blitz flooded pipeline with unrepresented thin-credit files.`,
      failurePoint: "Tutorial-Project Trap: Candidate can't diagnose covariate shift in production.",
      prescription: "Feynman Technique: Explain Covariate Shift without jargon to master root-cause reasoning.",
    },
    fullstack: {
      title: "Full Stack Software Engineer",
      badge: "Concurrency & Distributed Systems",
      scenario: "Flash checkout: 50,000 users trigger 300% p99 API latency spike and 504 Gateway Timeouts.",
      code: `[APM TELEMETRY]
Active DB Connections: 100/100 (Exhausted)
pg_stat_activity: Mutual ExclusiveLock on tuple (48, 12)
Root Cause: Thread A locks inventory then wallet; Thread B locks wallet then inventory.`,
      failurePoint: "The Timed DSA Blindspot: Accuracy drops 65% under 35-minute interviewer countdown.",
      prescription: "Active Recall: 12-minute timed algorithmic pattern drills to eliminate pressure panic.",
    },
    cyber: {
      title: "Cybersecurity Analyst",
      badge: "Zero-Trust & SIEM Forensics",
      scenario: "IDS flags internal payroll server communicating to unknown IP over port 8443 with high entropy.",
      code: `[SIEM ALERT - DC-01]
Sysmon Event 1: vssadmin.exe delete shadows /all /quiet
Network: Reverse shell socket connected to 194.26.29.111
Remediation: Hard VLAN quarantine + Kerberos ticket revocation + WORM snapshot restore.`,
      failurePoint: "Network Protocol Illiteracy: Memorizes attack definitions but cannot parse raw PCAP flags.",
      prescription: "Active Recall: Hex packet header parsing and socket descriptor drills.",
    },
    data: {
      title: "Data Analyst / Analytics Engineer",
      badge: "Statistical Rigor & Warehousing",
      scenario: "Executive dashboard shows company revenue dropped 18% overnight. Dissect whether churn or cohort mix.",
      code: `[DATA WAREHOUSE AUDIT]
Aggregate Conversion: -18% (Simpson's Paradox detected)
Segmented Breakdown: Mobile web conversion +4%, iOS conversion +2%
Culprit: Traffic acquisition shifted 80% to low-intent ad network.`,
      failurePoint: "Metric Vanity: Relies on aggregate averages without segmenting cohorts.",
      prescription: "Feynman Technique: Explain Simpson's Paradox and statistical power simply.",
    },
  };

  const currentRole = rolePreviews[selectedRolePreview];

  // Telemetry sample data for Boss Battle preview
  const telemetryData = [
    { time: "00:00", metric1: 94, metric2: 24 },
    { time: "00:05", metric1: 88, metric2: 38 },
    { time: "00:10", metric1: 67, metric2: 82 },
    { time: "00:15", metric1: 36, metric2: 96 },
    { time: "00:20", metric1: 29, metric2: 98 },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/25 selection:text-primary bg-mesh-aurora relative">
      {/* Precision Background Dot Matrix Overlay */}
      <div className="bg-dot-grid absolute inset-0 pointer-events-none -z-10" />

      {/* Top Frosted Glass Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate("/")}>
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-sm glow-primary">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-foreground flex items-center gap-1.5">
                StudyMind <span className="text-primary">AI</span>
              </span>
              <span className="hidden sm:block text-[11px] text-muted-foreground font-medium -mt-0.5 tracking-wide">
                Career Simulator & Verified Learning Platform
              </span>
            </div>
          </div>

          {/* Center Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-muted-foreground">
            <a href="#simulator" className="hover:text-primary transition-colors">
              Career Simulator
            </a>
            <a href="#boss-battle" className="hover:text-primary transition-colors">
              Boss Battle
            </a>
            <a href="#failure-map" className="hover:text-primary transition-colors">
              Failure Map
            </a>
            <a href="#pipeline" className="hover:text-primary transition-colors">
              Methodology
            </a>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-8 w-8 text-foreground hover:bg-muted"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Sun className="h-4 w-4 text-warning" /> : <Moon className="h-4 w-4" />}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleGuestDemo}
              className="text-xs h-9 gap-1.5 border-primary/40 bg-primary/5 hover:bg-primary/10 text-primary font-bold hidden sm:flex"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Instant Judge Demo</span>
            </Button>

            <Button
              size="sm"
              onClick={() => setShowAuthModal(true)}
              className="text-xs h-9 bg-primary text-primary-foreground font-semibold shadow-sm hover:opacity-95"
            >
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-14 pb-16 md:pt-20 md:pb-24 overflow-hidden border-b border-border/40">
        {/* Ambient Glow Orbs */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[380px] bg-primary/15 rounded-full blur-[110px] -z-10 pointer-events-none" />
        <div className="absolute top-48 right-12 w-[280px] h-[280px] bg-accent/15 rounded-full blur-[90px] -z-10 pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center space-y-6">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold shadow-xs">
            <Rocket className="h-3.5 w-3.5 animate-bounce" />
            <span>THE STUDENT CAREER CRASH SIMULATOR + ADAPTIVE LEARNING ENGINE</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground max-w-4xl mx-auto leading-[1.12]">
            Test your career path <span className="gradient-text-primary">before</span> you spend 6 months preparing.
          </h1>

          {/* Subheading */}
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed font-normal">
            Before placement season arrives, StudyMind simulates real job emergencies, isolates your preparation failure vectors early, and fixes bottlenecks with scientifically verified cognitive learning techniques.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              size="lg"
              onClick={handleLaunchSimulator}
              className="w-full sm:w-auto h-12 px-7 text-sm font-bold bg-primary text-primary-foreground shadow-md hover:opacity-95 gap-2 glow-primary"
            >
              <Rocket className="h-4 w-4" />
              <span>Launch Career Simulator</span>
              <ArrowRight className="h-4 w-4" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={handleGuestDemo}
              className="w-full sm:w-auto h-12 px-7 text-sm font-semibold border-border hover:bg-muted text-foreground gap-2"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Explore Judge Preview</span>
            </Button>
          </div>

          {/* Trust Signals */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground font-semibold">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>No 100-MCQ quizzes — Real micro-work</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>100% Private Local Edge Vision</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Flame className="h-4 w-4 text-amber-500" />
              <span>Closed-Loop Verification</span>
            </div>
          </div>

          {/* Hero Interactive Command Console Mockup */}
          <div className="pt-8 max-w-4xl mx-auto relative">
            {/* Floating Glass Badges */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl glass-card border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold absolute -top-3 -left-6 z-20 animate-float shadow-xl">
              <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
              <span>+37% Practical Debugging Gain (Sim #1 → #2)</span>
            </div>

            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl glass-card border border-primary/30 text-primary text-xs font-bold absolute -top-3 -right-6 z-20 animate-float-delayed shadow-xl">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              <span>Zero Video Uploads • Local Edge Privacy</span>
            </div>

            {/* Console Shell with Glass Pro & Specular Border */}
            <div className="rounded-2xl glass-pro overflow-hidden text-left border border-border">
              {/* Window Top Bar */}
              <div className="h-10 bg-muted/60 border-b border-border/70 px-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  <span className="text-[11px] font-mono text-muted-foreground font-semibold ml-2">
                    studymind-career-simulation-cluster: ~
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-primary">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>SIMULATION CLUSTER LIVE</span>
                </div>
              </div>

              {/* Console Body */}
              <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Left 2 Cols: Incident Briefing & Code */}
                <div className="md:col-span-2 space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs bg-destructive/10 text-destructive border-destructive/30 font-bold">
                      SEV-1 LIVE CRISIS
                    </Badge>
                    <span className="text-xs font-mono text-muted-foreground font-semibold">TRACK: AI/ML INFRASTRUCTURE</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-foreground">
                    Model Accuracy Collapse (91.4% → 67.2%) Post-Deployment
                  </h3>

                  <div className="rounded-xl bg-slate-950 p-4 font-mono text-xs text-slate-200 border border-slate-800 space-y-1.5 shadow-inner">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pb-1 border-b border-slate-800">
                      <span className="text-emerald-400">● live_feature_drift_telemetry.log</span>
                      <span className="text-[10px] text-slate-500">INSPECTION</span>
                    </div>
                    <pre className="text-[11px] leading-relaxed text-slate-300">
{`Offline Validation: Mean Age = 34.2 | Correlated r=0.88 with target
Live Ingestion: Mean Age = 22.1 | Feature importance dropped 74%
Wasserstein Distance: 0.48 (Severe Distribution Drift Alert)
Remediation: Segment stream; route thin-credit files to alternative risk engine.`}
                    </pre>
                  </div>
                </div>

                {/* Right 1 Col: Scorecard */}
                <div className="p-4 rounded-xl bg-card border border-border space-y-3 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase font-bold text-muted-foreground">
                      Reality Scorecard
                    </span>
                    <div className="text-xl font-bold text-foreground mt-0.5">Career Evidence</div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground font-medium">Practical Debugging:</span>
                      <span className="font-mono font-bold text-emerald-500">78%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground font-medium">Conceptual Math:</span>
                      <span className="font-mono font-bold text-primary">84%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground font-medium">Problem Solving:</span>
                      <span className="font-mono font-bold text-primary">76%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground font-medium">Stress Resilience:</span>
                      <span className="font-mono font-bold text-amber-500">74%</span>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    onClick={handleLaunchSimulator}
                    className="w-full text-xs h-8 bg-primary text-primary-foreground font-semibold gap-1 shadow-xs"
                  >
                    <span>Run Full Sim</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Career Track Switcher */}
      <section id="simulator" className="py-14 md:py-20 bg-muted/20 border-b border-border/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center space-y-1.5">
            <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/30 font-bold">
              INTERACTIVE TRACK TESTER
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Select a Career Track to Inspect Its Reality
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
              Different careers fail at entirely different stages. See what challenges and bottlenecks you will face in each role.
            </p>
          </div>

          {/* Role Switcher Pills */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: "ai", label: "AI / ML Engineer", icon: Brain },
              { id: "fullstack", label: "Full Stack Engineer", icon: Code2 },
              { id: "cyber", label: "Cybersecurity Analyst", icon: ShieldCheck },
              { id: "data", label: "Data Analyst", icon: BarChart3 },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = selectedRolePreview === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedRolePreview(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    active
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Interactive Preview Card */}
          <div className="glass-card-interactive rounded-2xl p-6 border border-border shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
              <div>
                <span className="text-xs font-mono font-bold text-primary uppercase">{currentRole.badge}</span>
                <h3 className="text-lg sm:text-xl font-bold text-foreground mt-0.5">{currentRole.title}</h3>
              </div>
              <Badge className="bg-primary/10 text-primary border-primary/30 text-xs w-fit">
                SIMULATION SCENARIO READY
              </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Scenario Briefing & Code */}
              <div className="space-y-3">
                <p className="text-xs sm:text-sm text-foreground font-medium leading-relaxed">
                  {currentRole.scenario}
                </p>

                <div className="rounded-xl bg-slate-950 p-4 font-mono text-xs text-slate-200 border border-slate-800 space-y-1.5 shadow-inner">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pb-1 border-b border-slate-800">
                    <span className="text-emerald-400">● live_incident_telemetry.trace</span>
                    <span className="text-[10px] text-slate-500">DIAGNOSTIC CAPTURE</span>
                  </div>
                  <pre className="text-[11px] leading-relaxed text-slate-300 whitespace-pre-wrap">
                    {currentRole.code}
                  </pre>
                </div>
              </div>

              {/* Failure Vector & Cognitive Prescription */}
              <div className="space-y-4 flex flex-col justify-between">
                {/* Failure Vector */}
                <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/25 space-y-1.5">
                  <div className="text-xs font-bold text-destructive flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4" /> Predictive Placement Failure Vector
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {currentRole.failurePoint}
                  </p>
                </div>

                {/* Cognitive Prescription */}
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/30 space-y-2">
                  <div className="text-xs font-bold text-primary flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4" /> StudyMind Cognitive Prescription
                  </div>
                  <p className="text-xs text-foreground font-medium leading-relaxed">
                    {currentRole.prescription}
                  </p>

                  <div className="pt-2 flex items-center justify-between border-t border-primary/20">
                    <span className="text-[11px] text-muted-foreground font-mono">Closed-Loop Repair</span>
                    <Button
                      size="sm"
                      onClick={handleLaunchSimulator}
                      className="text-xs h-7 px-3 bg-primary text-primary-foreground font-semibold gap-1"
                    >
                      <span>Simulate This Role</span>
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Boss Battle Interactive Teaser Section */}
      <section id="boss-battle" className="py-14 md:py-20 border-b border-border/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center space-y-1.5">
            <Badge variant="outline" className="text-xs bg-destructive/10 text-destructive border-destructive/30 font-bold">
              SEV-1 LIVE INCIDENT ROOM
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Career Boss Battle: Triage Production Emergencies
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
              Not another multiple choice quiz. Probe live telemetry, deploy real-time mitigations, and defend your post-mortem.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Live Chart Preview (2 cols) */}
            <div className="lg:col-span-2 glass-card rounded-2xl p-5 border border-border space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-foreground">Flash Sale Latency Spike & Deadlock</h3>
                  <p className="text-xs text-muted-foreground">50,000 shoppers checkout concurrently on tickets</p>
                </div>
                <Badge className="bg-destructive text-destructive-foreground text-xs animate-pulse font-mono">
                  OUTAGE ACTIVE
                </Badge>
              </div>

              {/* Real Telemetry Chart */}
              <div className="h-48 w-full rounded-xl bg-slate-950 p-2 border border-slate-800">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={telemetryData}>
                    <defs>
                      <linearGradient id="chartGlow1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" stroke="#64748b" fontSize={10} />
                    <YAxis stroke="#64748b" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", fontSize: "11px" }} />
                    <Area type="monotone" dataKey="metric1" stroke="#ef4444" fill="url(#chartGlow1)" name="p99 Latency (ms)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Interactive Probe Buttons */}
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Run Diagnostic Probes (Interactive):
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setActiveProbe("locks");
                      toast({ title: "Probe Executed", description: "pg_stat_activity shows mutual row lock on inventory table." });
                    }}
                    className={`text-xs justify-start h-8 gap-1.5 ${
                      activeProbe === "locks" ? "border-primary bg-primary/10 text-primary font-bold" : ""
                    }`}
                  >
                    <Search className="h-3 w-3" />
                    <span>Inspect PostgreSQL pg_stat_activity</span>
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setActiveProbe("redis");
                      toast({ title: "Probe Executed", description: "Redis atomic counter cluster is healthy at 8% CPU." });
                    }}
                    className={`text-xs justify-start h-8 gap-1.5 ${
                      activeProbe === "redis" ? "border-primary bg-primary/10 text-primary font-bold" : ""
                    }`}
                  >
                    <Search className="h-3 w-3" />
                    <span>Check Redis Atomic Counter Availability</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Live Terminal Log (1 col) */}
            <div className="lg:col-span-1 rounded-2xl bg-slate-950 text-slate-200 p-4 border border-slate-800 flex flex-col justify-between shadow-inner">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pb-1.5 border-b border-slate-800">
                  <span className="text-emerald-400">● live_console.log</span>
                  <span className="text-[10px] text-slate-500">STREAMING</span>
                </div>
                <div className="font-mono text-xs space-y-1.5 text-slate-300">
                  <div>14:02:11 [FATAL] db-primary: deadlock on tuple (48, 12).</div>
                  <div>14:03:04 [WARN] NodeWorker: DB connection pool 100/100 exhausted.</div>
                  {activeProbe === "locks" && (
                    <div className="text-emerald-400 pt-1">
                      ✓ PROBE: Thread A locks inventory then wallet; Thread B locks wallet then inventory.
                    </div>
                  )}
                  {activeProbe === "redis" && (
                    <div className="text-cyan-400 pt-1">
                      ✓ PROBE: Redis DECR counter available for zero-lock inventory offloading.
                    </div>
                  )}
                </div>
              </div>

              <Button
                size="sm"
                onClick={handleLaunchSimulator}
                className="mt-4 text-xs h-8 bg-destructive text-destructive-foreground font-bold gap-1"
              >
                <Flame className="h-3.5 w-3.5" />
                <span>Play Boss Battle</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Career Failure Map Showcase Section */}
      <section id="failure-map" className="py-14 md:py-20 bg-muted/20 border-b border-border/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center space-y-1.5">
            <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 font-bold">
              PREDICTIVE BOTTLENECK AUDIT
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Career Failure Map: Know Where Preparation Breaks Down
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
              Instead of only showing "What should I learn?", StudyMind shows "Where could my current preparation break down?"
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card-interactive p-5 rounded-2xl border border-border space-y-2.5">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-[10px] text-destructive border-destructive/30 font-bold">
                  Critical Bottleneck
                </Badge>
                <span className="text-[11px] font-mono text-muted-foreground">Full Stack Track</span>
              </div>
              <h3 className="text-sm font-bold text-foreground">The Timed DSA Blindspot</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Candidate solves medium problems when relaxed, but accuracy drops 65% when placed under an interactive 35-minute interviewer timer.
              </p>
              <div className="text-[11px] text-primary font-semibold pt-1 border-t border-border">
                Cognitive Fix: 12-minute timed retrieval drills
              </div>
            </div>

            <div className="glass-card-interactive p-5 rounded-2xl border border-border space-y-2.5">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-[10px] text-amber-500 border-amber-500/30 font-bold">
                  High Probability
                </Badge>
                <span className="text-[11px] font-mono text-muted-foreground">AI / ML Track</span>
              </div>
              <h3 className="text-sm font-bold text-foreground">Tutorial-Project Evidence Trap</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Resume lists standard tutorial classifiers. In interview rounds, candidate freezes when asked to debug data drift or deployment latency.
              </p>
              <div className="text-[11px] text-primary font-semibold pt-1 border-t border-border">
                Cognitive Fix: Feynman production defense drills
              </div>
            </div>

            <div className="glass-card-interactive p-5 rounded-2xl border border-border space-y-2.5">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-[10px] text-blue-500 border-blue-500/30 font-bold">
                  Moderate Friction
                </Badge>
                <span className="text-[11px] font-mono text-muted-foreground">Cybersecurity Track</span>
              </div>
              <h3 className="text-sm font-bold text-foreground">Network Telemetry Illiteracy</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Candidate memorized attack definitions (XSS, DDoS) but cannot parse raw hex packet headers or socket descriptors in Wireshark.
              </p>
              <div className="text-[11px] text-primary font-semibold pt-1 border-t border-border">
                Cognitive Fix: Active Recall packet analysis drills
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The 4-Step Closed Loop Pipeline Graphic */}
      <section id="pipeline" className="py-14 md:py-20 border-b border-border/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center space-y-1.5">
            <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/30 font-bold">
              THE CLOSED-LOOP ADVANTAGE
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              From Diagnosis to Verifiable Proof
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
              We don't just predict whether you will succeed. We test your readiness before the real opportunity arrives.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                step: "01",
                title: "Choose Track",
                desc: "Pick AI/ML, Full Stack, Cybersecurity, or Analytics. Experience authentic day-to-day engineering.",
                icon: Rocket,
                color: "text-primary",
              },
              {
                step: "02",
                title: "Simulate Crisis",
                desc: "Face real production outages, data drift, and unexpected curveballs under timed pressure.",
                icon: Flame,
                color: "text-destructive",
              },
              {
                step: "03",
                title: "Expose Failure",
                desc: "Pinpoint exact placement bottlenecks (timed DSA, debugging, explanation) 6 months in advance.",
                icon: AlertTriangle,
                color: "text-amber-500",
              },
              {
                step: "04",
                title: "Cognitive Repair",
                desc: "Eliminate gaps with Feynman Technique explanations, Active Recall quizzes, and verified study sprints.",
                icon: Sparkles,
                color: "text-emerald-500",
              },
            ].map((st) => {
              const Icon = st.icon;
              return (
                <div
                  key={st.step}
                  className="glass-card-interactive p-5 rounded-2xl border border-border space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-primary">{st.step}</span>
                    <Icon className={`h-4 w-4 ${st.color}`} />
                  </div>
                  <h3 className="text-base font-bold text-foreground">{st.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{st.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bento Grid: Core Innovations */}
      <section className="py-14 md:py-20 bg-muted/20 border-b border-border/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center space-y-1.5">
            <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/30 font-bold">
              WHY STUDYMIND STANDS OUT
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Built for Real Placement Readiness
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
              A comprehensive system uniting career testing, adaptive scheduling, and verified cognitive retention.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card-interactive p-6 rounded-2xl border border-border space-y-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                <Shuffle className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">Career Switch Cost Analyzer</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Want to switch from Full Stack to AI, or Mechanical to Tech? StudyMind identifies your transferable skills: <strong>you don't restart from zero</strong>.
              </p>
            </div>

            <div className="glass-card-interactive p-6 rounded-2xl border border-border space-y-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">Zero-Upload Privacy Edge Vision</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Computer vision runs 100% inside your browser using lightweight MediaPipe models. No camera feeds or images ever touch an external server.
              </p>
            </div>

            <div className="glass-card-interactive p-6 rounded-2xl border border-border space-y-3">
              <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold">
                <BookOpen className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">Feynman & Active Recall Engine</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                AI evaluates your explanations for jargon and conceptual depth, while active recall quizzes strengthen synaptic retrieval pathways before exams.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Auth / Quick Start Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-md mx-auto px-4 sm:px-6">
          <Card className="glass-card border-border shadow-2xl">
            <CardHeader className="text-center pb-4">
              <Badge variant="outline" className="w-fit mx-auto mb-2 text-xs bg-primary/10 text-primary border-primary/30 font-bold">
                EVALUATION & ACCESS
              </Badge>
              <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">
                {isLogin ? "Sign In to Your Workspace" : "Create Student Account"}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                {isLogin
                  ? "Access your verified study plans, career simulations, and performance metrics."
                  : "Join StudyMind to simulate careers and build verified credentials."}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Instant Demo Preview Button for Judges & Students */}
              <Button
                type="button"
                onClick={handleGuestDemo}
                className="w-full h-10 text-xs font-bold bg-primary text-primary-foreground shadow-sm hover:opacity-95 gap-2 glow-primary"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Instant Demo / Judge Mode (1-Click Preview)</span>
              </Button>

              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase">
                  <span className="bg-card px-2 text-muted-foreground font-mono font-bold">Or with email</span>
                </div>
              </div>

              {/* Email Form */}
              <form onSubmit={handleAuthSubmit} className="space-y-3">
                {!isLogin && (
                  <div className="space-y-1">
                    <Label htmlFor="name" className="text-xs font-bold text-foreground">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Alex Chen"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={!isLogin}
                      className="h-9 text-xs bg-background text-foreground border-input"
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <Label htmlFor="email" className="text-xs font-bold text-foreground">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="student@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-9 text-xs bg-background text-foreground border-input"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="password" className="text-xs font-bold text-foreground">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="h-9 text-xs bg-background text-foreground border-input"
                  />
                </div>

                <Button
                  type="submit"
                  variant="outline"
                  className="w-full h-9 text-xs font-bold border-border hover:bg-muted text-foreground mt-2"
                  disabled={authLoading}
                >
                  {authLoading ? "Processing..." : isLogin ? "Sign In with Email" : "Create Account"}
                </Button>
              </form>

              <div className="text-center text-xs pt-1">
                <span className="text-muted-foreground">
                  {isLogin ? "Need a student account?" : "Already registered?"}
                </span>{" "}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary font-bold hover:underline ml-1"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Clean Professional Footer */}
      <footer className="border-t border-border/60 bg-muted/20 py-8 text-xs text-muted-foreground">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-primary" />
            <span className="font-bold text-foreground">StudyMind AI</span>
            <span>• Career Crash Simulator & Verified Learning Platform</span>
          </div>
          <div className="flex items-center gap-4 text-muted-foreground font-medium">
            <button onClick={handleLaunchSimulator} className="hover:text-foreground">Career Simulator</button>
            <button onClick={handleGuestDemo} className="hover:text-foreground">Instant Demo</button>
            <span>100% Private Edge Processing</span>
          </div>
        </div>
      </footer>

      {/* Modal Dialog for Header Sign In button */}
      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
        <DialogContent className="sm:max-w-md glass-card border border-border">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground">
              {isLogin ? "Sign In to StudyMind" : "Create Student Account"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Access career simulations, verified study plans, and performance analytics.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <Button
              type="button"
              onClick={() => {
                setShowAuthModal(false);
                handleGuestDemo();
              }}
              className="w-full h-10 text-xs font-bold bg-primary text-primary-foreground gap-2"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>1-Click Instant Demo Access</span>
            </Button>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-card px-2 text-muted-foreground font-mono font-bold">Or with email</span>
              </div>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-3">
              {!isLogin && (
                <div className="space-y-1">
                  <Label htmlFor="modal-name" className="text-xs font-bold text-foreground">
                    Full Name
                  </Label>
                  <Input
                    id="modal-name"
                    type="text"
                    placeholder="Alex Chen"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={!isLogin}
                    className="h-9 text-xs"
                  />
                </div>
              )}

              <div className="space-y-1">
                <Label htmlFor="modal-email" className="text-xs font-bold text-foreground">
                  Email Address
                </Label>
                <Input
                  id="modal-email"
                  type="email"
                  placeholder="student@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="modal-password" className="text-xs font-bold text-foreground">
                  Password
                </Label>
                <Input
                  id="modal-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="h-9 text-xs"
                />
              </div>

              <Button
                type="submit"
                variant="outline"
                className="w-full h-9 text-xs font-bold border-border mt-2"
                disabled={authLoading}
              >
                {authLoading ? "Processing..." : isLogin ? "Sign In with Email" : "Create Account"}
              </Button>
            </form>

            <div className="text-center text-xs pt-1">
              <span className="text-muted-foreground">
                {isLogin ? "Need a student account?" : "Already registered?"}
              </span>{" "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary font-bold hover:underline ml-1"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
