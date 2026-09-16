import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CAREER_ROLES,
  SIMULATION_DATASETS,
} from "@/data/careerSimulations";
import { CareerRoleId, CareerSimulationDataset } from "@/types/careerSimulator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import {
  BrainCircuit,
  Code2,
  ShieldAlert,
  BarChart3,
  CloudLightning,
  Layers,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Flame,
  Zap,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Terminal,
} from "lucide-react";

export default function CareerSimulatorView() {
  const navigate = useNavigate();

  const [selectedRoleId, setSelectedRoleId] = useState<CareerRoleId>("ai-ml-engineer");
  const [currentStage, setCurrentStage] = useState<1 | 2 | 3 | 4>(1);

  // Stage 1 State
  const [microTaskIdx, setMicroTaskIdx] = useState(0);
  const [selectedMicroOption, setSelectedMicroOption] = useState<string | null>(null);
  const [microSubmitted, setMicroSubmitted] = useState(false);
  const [stage1Score, setStage1Score] = useState(0);

  // Stage 2 State
  const [selectedHypothesis, setSelectedHypothesis] = useState<string | null>(null);
  const [hypothesisSubmitted, setHypothesisSubmitted] = useState(false);
  const [userReasoning, setUserReasoning] = useState("");

  // Stage 3 State
  const [countdown, setCountdown] = useState<number>(180);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [selectedCurveballOption, setSelectedCurveballOption] = useState<string | null>(null);
  const [curveballSubmitted, setCurveballSubmitted] = useState(false);

  const dataset: CareerSimulationDataset =
    SIMULATION_DATASETS[selectedRoleId] || SIMULATION_DATASETS["ai-ml-engineer"];

  // Reset simulation when role changes
  const handleRoleChange = (roleId: CareerRoleId) => {
    setSelectedRoleId(roleId);
    setCurrentStage(1);
    setMicroTaskIdx(0);
    setSelectedMicroOption(null);
    setMicroSubmitted(false);
    setStage1Score(0);
    setSelectedHypothesis(null);
    setHypothesisSubmitted(false);
    setUserReasoning("");
    setCountdown(180);
    setTimerRunning(false);
    setSelectedCurveballOption(null);
    setCurveballSubmitted(false);
  };

  // Timer effect for Stage 3
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (currentStage === 3 && timerRunning && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0 && timerRunning) {
      setTimerRunning(false);
      toast({
        title: "⏰ Time Expired!",
        description: "Under high pressure, auto-submitting current triage posture.",
        variant: "destructive",
      });
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentStage, timerRunning, countdown]);

  const currentMicroTask = dataset.stage1MicroTasks[microTaskIdx] || dataset.stage1MicroTasks[0];

  const handleMicroSubmit = () => {
    if (!selectedMicroOption) {
      toast({ title: "Select an answer", description: "Please pick your diagnostic approach." });
      return;
    }
    setMicroSubmitted(true);
    const chosen = currentMicroTask.options.find((o) => o.id === selectedMicroOption);
    if (chosen?.isCorrect) {
      setStage1Score((prev) => prev + 50);
      toast({ title: "Precision Diagnostic! ✅", description: "Accurate root cause identified." });
    } else {
      toast({ title: "Diagnosis Flawed ❌", description: "See the technical explanation below.", variant: "destructive" });
    }
  };

  const handleNextMicroTask = () => {
    if (microTaskIdx + 1 < dataset.stage1MicroTasks.length) {
      setMicroTaskIdx((prev) => prev + 1);
      setSelectedMicroOption(null);
      setMicroSubmitted(false);
    } else {
      setCurrentStage(2);
      toast({ title: "Stage 1 Passed", description: "Advancing to Realistic Job Scenario (Stage 2)." });
    }
  };

  const handleHypothesisSubmit = () => {
    if (!selectedHypothesis) {
      toast({ title: "Select a hypothesis", description: "Choose which incident diagnosis you will defend." });
      return;
    }
    setHypothesisSubmitted(true);
    const chosen = dataset.stage2Scenario.hypotheses.find((h) => h.id === selectedHypothesis);
    if (chosen?.isCorrect) {
      toast({ title: "Incident Triage Approved! 🚀", description: "Correct root cause and remediation strategy identified." });
    } else {
      toast({ title: "Investigation Diverged", description: "Review why this diagnosis fails in production.", variant: "destructive" });
    }
  };

  const startStage3 = () => {
    setCurrentStage(3);
    setTimerRunning(true);
    setCountdown(dataset.stage3Curveball.timeLimitSeconds);
  };

  const handleCurveballSubmit = () => {
    if (!selectedCurveballOption) {
      toast({ title: "Select an immediate action", description: "High-priority incident requires prompt decision." });
      return;
    }
    setTimerRunning(false);
    setCurveballSubmitted(true);
    toast({ title: "Crisis Posture Recorded! 🛡️", description: "Aggregating simulation evidence dossier..." });
  };

  const radarData = [
    {
      subject: "Conceptual Foundation",
      score: dataset.defaultRealityEvidence.conceptualFoundation,
      fullMark: 100,
    },
    {
      subject: "Practical Debugging",
      score: dataset.defaultRealityEvidence.practicalDebugging,
      fullMark: 100,
    },
    {
      subject: "Problem Solving",
      score: dataset.defaultRealityEvidence.problemSolving,
      fullMark: 100,
    },
    {
      subject: "Communication",
      score: dataset.defaultRealityEvidence.technicalCommunication,
      fullMark: 100,
    },
    {
      subject: "Stress Resilience",
      score: dataset.defaultRealityEvidence.timePressureResilience,
      fullMark: 100,
    },
  ];

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="space-y-6">
      {/* Role Selector Header */}
      <div className="glass-card rounded-2xl p-5 border border-border/60 bg-gradient-to-br from-card/80 via-card/50 to-primary/5 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/30 font-semibold">
                STAGE {currentStage} OF 4
              </Badge>
              <span className="text-xs text-muted-foreground font-mono">
                {currentStage === 1 && "Skill Reality Check"}
                {currentStage === 2 && "Real Work Simulation"}
                {currentStage === 3 && "Stress & Curveball Round"}
                {currentStage === 4 && "Career Reality Evidence Dossier"}
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <span>Career Crash Simulator</span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-mono">
                {dataset.role.title}
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Experience the actual technical challenges, production crises, and pressures before committing months of preparation.
            </p>
          </div>

          {/* Role Pill Switcher */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-muted/50 rounded-xl border border-border/50">
            {CAREER_ROLES.slice(0, 3).map((r) => {
              const active = r.id === selectedRoleId;
              return (
                <button
                  key={r.id}
                  onClick={() => handleRoleChange(r.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    active
                      ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {r.title.split(" ")[0]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Stage Progress Bar */}
        <div className="mt-4 pt-3 border-t border-border/40 grid grid-cols-4 gap-2 text-center text-xs">
          {[
            { step: 1, title: "1. Skill Check" },
            { step: 2, title: "2. Work Sim" },
            { step: 3, title: "3. Stress Test" },
            { step: 4, title: "4. Reality Score" },
          ].map((item) => (
            <div
              key={item.step}
              onClick={() => {
                if (item.step <= currentStage || currentStage === 4) setCurrentStage(item.step as any);
              }}
              className={`cursor-pointer pb-1 border-b-2 font-medium transition-all ${
                currentStage === item.step
                  ? "border-primary text-primary font-bold"
                  : currentStage > item.step
                  ? "border-emerald-500 text-emerald-600 dark:text-emerald-400 font-semibold"
                  : "border-transparent text-muted-foreground font-medium hover:text-foreground"
              }`}
            >
              {item.title}
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================================
          STAGE 1: SKILL REALITY CHECK
      ========================================================================== */}
      {currentStage === 1 && (
        <Card className="border-border/60 shadow-sm glass-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs">
                  {currentMicroTask.category}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Task {microTaskIdx + 1} of {dataset.stage1MicroTasks.length}
                </span>
              </div>
              <span className="text-xs font-mono font-semibold text-muted-foreground">
                Score: {stage1Score} pts
              </span>
            </div>
            <CardTitle className="text-lg sm:text-xl mt-2">{currentMicroTask.title}</CardTitle>
            <CardDescription className="text-xs sm:text-sm">{currentMicroTask.scenario}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Code Snippet Box */}
            {currentMicroTask.codeSnippet && (
              <div className="rounded-xl bg-slate-950 p-3.5 sm:p-4 font-mono text-xs text-slate-200 border border-slate-800 overflow-x-auto shadow-inner">
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2 pb-1.5 border-b border-slate-800">
                  <span className="flex items-center gap-1.5">
                    <Terminal className="h-3 w-3 text-primary" /> source_inspection.py
                  </span>
                  <span className="text-[10px] text-muted-foreground">Read-Only Diagnostic</span>
                </div>
                <pre className="leading-relaxed whitespace-pre-wrap">{currentMicroTask.codeSnippet}</pre>
              </div>
            )}

            {/* Diagnostic Options */}
            <div className="space-y-2.5">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Select Technical Solution / Diagnosis:
              </label>
              {currentMicroTask.options.map((opt) => {
                const isSelected = selectedMicroOption === opt.id;
                let optBorder = "border-border/60 hover:border-primary/40 hover:bg-muted/30";
                if (microSubmitted) {
                  if (opt.isCorrect) optBorder = "border-emerald-500/80 bg-emerald-500/10";
                  else if (isSelected) optBorder = "border-destructive/80 bg-destructive/10";
                } else if (isSelected) {
                  optBorder = "border-primary bg-primary/5 ring-1 ring-primary";
                }

                return (
                  <div
                    key={opt.id}
                    onClick={() => !microSubmitted && setSelectedMicroOption(opt.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${optBorder}`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`h-4 w-4 mt-0.5 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40"
                        }`}
                      >
                        {isSelected && <div className="h-2 w-2 rounded-full bg-white" />}
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs sm:text-sm font-medium text-foreground leading-snug">{opt.text}</p>
                        {microSubmitted && (
                          <p className={`text-xs mt-1 ${opt.isCorrect ? "text-emerald-500 font-medium" : "text-muted-foreground"}`}>
                            {opt.explanation}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="pt-3 flex items-center justify-end gap-3 border-t border-border/40">
              {!microSubmitted ? (
                <Button onClick={handleMicroSubmit} size="sm" className="text-xs gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Submit Diagnosis
                </Button>
              ) : (
                <Button onClick={handleNextMicroTask} size="sm" className="text-xs gap-1.5 bg-primary">
                  <span>
                    {microTaskIdx + 1 < dataset.stage1MicroTasks.length
                      ? "Next Micro-Task"
                      : "Proceed to Work Simulation"}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* =========================================================================
          STAGE 2: WORK SIMULATION
      ========================================================================== */}
      {currentStage === 2 && (
        <Card className="border-border/60 shadow-sm glass-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 text-xs font-semibold">
                🚨 {dataset.stage2Scenario.urgency}
              </Badge>
              <span className="text-xs text-muted-foreground font-mono">Simulated Production Incident</span>
            </div>
            <CardTitle className="text-lg sm:text-xl mt-2">{dataset.stage2Scenario.title}</CardTitle>
            <CardDescription className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
              {dataset.stage2Scenario.briefing}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            {/* Live Telemetry Monitor */}
            <div className="rounded-xl bg-card border border-border/70 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-primary">
                <span className="flex items-center gap-1.5">
                  <BarChart3 className="h-3.5 w-3.5" /> Incident Telemetry Stream
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">LIVE CLUSTER CAPTURE</span>
              </div>
              <div className="bg-slate-950 rounded-lg p-3 text-xs font-mono text-emerald-400 border border-slate-800 leading-relaxed overflow-x-auto">
                <pre>{dataset.stage2Scenario.telemetrySnippet}</pre>
              </div>
            </div>

            {/* Hypotheses Choices */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Investigate & Choose Your Primary Remediation Hypothesis:
              </label>
              {dataset.stage2Scenario.hypotheses.map((h) => {
                const isSelected = selectedHypothesis === h.id;
                let borderClass = "border-border/60 hover:border-primary/40 hover:bg-muted/30";
                if (hypothesisSubmitted) {
                  if (h.isCorrect) borderClass = "border-emerald-500/80 bg-emerald-500/10";
                  else if (isSelected) borderClass = "border-destructive/80 bg-destructive/10";
                } else if (isSelected) {
                  borderClass = "border-primary bg-primary/5 ring-1 ring-primary";
                }

                return (
                  <div
                    key={h.id}
                    onClick={() => !hypothesisSubmitted && setSelectedHypothesis(h.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${borderClass}`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`h-4 w-4 mt-1 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40"
                        }`}
                      >
                        {isSelected && <div className="h-2 w-2 rounded-full bg-white" />}
                      </div>
                      <div className="space-y-1.5">
                        <div className="font-semibold text-sm text-foreground">{h.label}</div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{h.diagnosis}</p>
                        <div className="text-xs text-primary/90 font-medium">
                          <span className="font-bold">Action:</span> {h.remediationAction}
                        </div>
                        {hypothesisSubmitted && (
                          <div className="text-[11px] text-amber-500/90 italic pt-1 border-t border-border/40">
                            Trade-off audit: {h.tradeoffs}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Technical Justification */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                <span>Defend Your Engineering Decision (Feynman Reasoning):</span>
                <span className="text-[10px] text-muted-foreground">Evaluates technical communication</span>
              </label>
              <Textarea
                placeholder="Explain in 2-3 sentences why this root cause triggered the metric collapse, and what safeguard you would institute..."
                value={userReasoning}
                onChange={(e) => setUserReasoning(e.target.value)}
                className="text-xs min-h-[75px]"
                disabled={hypothesisSubmitted}
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-border/40">
              <Button variant="outline" size="sm" onClick={() => setCurrentStage(1)} className="text-xs gap-1.5">
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Stage 1
              </Button>

              {!hypothesisSubmitted ? (
                <Button onClick={handleHypothesisSubmit} size="sm" className="text-xs gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Commit Remediation
                </Button>
              ) : (
                <Button onClick={startStage3} size="sm" className="text-xs gap-1.5 bg-destructive text-destructive-foreground">
                  <Flame className="h-3.5 w-3.5" /> Enter Stress Simulation (Stage 3)
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* =========================================================================
          STAGE 3: STRESS SIMULATION & CURVEBALL
      ========================================================================== */}
      {currentStage === 3 && (
        <Card className="border-destructive/40 shadow-sm glass-card bg-destructive/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-destructive/30 animate-pulse" />
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="bg-destructive/20 text-destructive border-destructive/40 text-xs font-semibold animate-pulse">
                ⚡ DYNAMIC STRESS EVENT
              </Badge>
              {/* Countdown Meter */}
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-destructive/10 border border-destructive/30 text-destructive font-mono font-bold text-sm">
                <Clock className="h-4 w-4 animate-spin" />
                <span>{formatTime(countdown)}</span>
              </div>
            </div>
            <CardTitle className="text-lg sm:text-xl text-foreground mt-2">
              {dataset.stage3Curveball.title}
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-foreground/90">
              {dataset.stage3Curveball.triggerMessage}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="p-3.5 rounded-xl bg-card border border-destructive/30 text-xs sm:text-sm text-foreground leading-relaxed">
              <span className="font-bold text-destructive">UNEXPECTED CONDITION:</span>{" "}
              {dataset.stage3Curveball.unexpectedCondition}
            </div>

            <div className="space-y-2.5">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Select Your Emergency Intervention Under Time Constraint:
              </label>
              {dataset.stage3Curveball.choices.map((choice) => {
                const isSelected = selectedCurveballOption === choice.id;
                let cBorder = "border-border/60 hover:border-destructive/40 hover:bg-muted/30";
                if (curveballSubmitted) {
                  if (choice.score >= 80) cBorder = "border-emerald-500/80 bg-emerald-500/10";
                  else cBorder = "border-destructive/80 bg-destructive/10";
                } else if (isSelected) {
                  cBorder = "border-destructive bg-destructive/10 ring-1 ring-destructive";
                }

                return (
                  <div
                    key={choice.id}
                    onClick={() => !curveballSubmitted && setSelectedCurveballOption(choice.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${cBorder}`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`h-4 w-4 mt-0.5 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? "border-destructive bg-destructive text-white" : "border-muted-foreground/40"
                        }`}
                      >
                        {isSelected && <div className="h-2 w-2 rounded-full bg-white" />}
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs sm:text-sm font-medium text-foreground">{choice.text}</p>
                        {curveballSubmitted && (
                          <div className="text-xs text-muted-foreground mt-1 flex items-center justify-between">
                            <span>{choice.impact}</span>
                            <Badge variant="outline" className="text-[10px]">
                              {choice.score}/100 pts
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-border/40">
              <Button variant="outline" size="sm" onClick={() => setCurrentStage(2)} className="text-xs">
                Back
              </Button>
              {!curveballSubmitted ? (
                <Button onClick={handleCurveballSubmit} size="sm" className="text-xs gap-1.5 bg-destructive text-destructive-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Confirm Emergency Action
                </Button>
              ) : (
                <Button
                  onClick={() => setCurrentStage(4)}
                  size="sm"
                  className="text-xs gap-1.5 bg-primary text-primary-foreground font-semibold"
                >
                  <Sparkles className="h-3.5 w-3.5" /> View Career Reality Evidence Dossier
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* =========================================================================
          STAGE 4: CAREER REALITY SCORE & EVIDENCE DOSSIER
      ========================================================================== */}
      {currentStage === 4 && (
        <div className="space-y-6">
          {/* Top Dossier Banner */}
          <Card className="glass-card border-primary/30 shadow-md">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-xs mb-1">
                    VERIFIED CAREER REALITY AUDIT
                  </Badge>
                  <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
                    <span>{dataset.role.title}</span>
                    <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 text-xs font-mono">
                      {dataset.defaultRealityEvidence.overallReadiness}
                    </Badge>
                  </CardTitle>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRoleChange(selectedRoleId)}
                  className="text-xs gap-1.5 h-8"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Re-Run Simulation
                </Button>
              </div>
              <CardDescription className="text-xs sm:text-sm mt-1">
                Concrete multi-dimensional evidence based on your micro-task diagnostics, production incident triage, and stress performance.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Radar Chart + Metric Breakdown Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Recharts Radar Chart */}
                <div className="h-[280px] w-full flex items-center justify-center p-2 rounded-xl bg-card/60 border border-border/40">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                      <PolarGrid stroke="hsl(var(--muted-foreground)/0.25)" />
                      <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: "hsl(var(--foreground))", fontSize: 11 }}
                      />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="hsl(var(--muted-foreground)/0.3)" />
                      <Radar
                        name="Student Performance"
                        dataKey="score"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.45}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                {/* Score Meters */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Performance Competency Breakdown
                  </h4>
                  {radarData.map((item) => (
                    <div key={item.subject} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-foreground">{item.subject}</span>
                        <span className="font-mono font-bold text-primary">{item.score}%</span>
                      </div>
                      <Progress value={item.score} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Identified Evidence Gaps */}
              <div className="space-y-3 pt-4 border-t border-border/40">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold flex items-center gap-1.5 text-foreground">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    <span>Identified Evidence Gaps Before Placement Season</span>
                  </h3>
                  <span className="text-[11px] text-muted-foreground">
                    Targeted interventions via StudyMind Engine
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {dataset.defaultRealityEvidence.evidenceGaps.map((gap, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl border border-warning/30 bg-warning/5 space-y-2 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-xs text-foreground">{gap.skill}</span>
                          <Badge
                            variant="outline"
                            className={`text-[10px] ${
                              gap.severity === "Critical"
                                ? "bg-destructive/10 text-destructive border-destructive/30"
                                : "bg-warning/10 text-warning border-warning/30"
                            }`}
                          >
                            {gap.severity} Gap
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{gap.description}</p>
                      </div>

                      {/* Direct Bridge to StudyMind Cognitive Engines */}
                      <div className="pt-2 border-t border-warning/20 flex items-center justify-between">
                        <span className="text-[10px] text-muted-foreground font-mono">
                          Fix with {gap.recommendedTechnique.toUpperCase()}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            if (gap.recommendedTechnique === "feynman") {
                              navigate(`/techniques/feynman?topic=${encodeURIComponent(gap.studyTopic)}`);
                            } else if (gap.recommendedTechnique === "active-recall") {
                              navigate(`/techniques/active-recall?topic=${encodeURIComponent(gap.studyTopic)}`);
                            } else {
                              navigate("/setup");
                            }
                          }}
                          className="h-7 text-[11px] px-2.5 gap-1 text-primary border-primary/30 hover:bg-primary/10"
                        >
                          <span>Launch Fix</span>
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Next Practical Experiment */}
              <div className="p-4 rounded-xl bg-primary/10 border border-primary/30 flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-primary mb-0.5">Recommended Next Experiment</h4>
                  <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                    {dataset.defaultRealityEvidence.recommendedNextExperiment}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
