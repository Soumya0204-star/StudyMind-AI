import { useState } from "react";
import { BOSS_BATTLE_INCIDENTS } from "@/data/careerSimulations";
import { BossBattleIncident } from "@/types/careerSimulator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  Flame,
  Terminal,
  Activity,
  ShieldAlert,
  Search,
  CheckCircle2,
  AlertTriangle,
  Award,
  Sparkles,
  RotateCcw,
  Zap,
  Lock,
} from "lucide-react";

export default function CareerBossBattleView() {
  const [selectedIncidentIdx, setSelectedIncidentIdx] = useState<number>(0);
  const incident: BossBattleIncident = BOSS_BATTLE_INCIDENTS[selectedIncidentIdx] || BOSS_BATTLE_INCIDENTS[0];

  const [discoveredDiagnostics, setDiscoveredDiagnostics] = useState<string[]>([]);
  const [selectedMitigation, setSelectedMitigation] = useState<string | null>(null);
  const [mitigationCommitted, setMitigationCommitted] = useState<boolean>(false);
  const [postMortemText, setPostMortemText] = useState<string>("");
  const [clearedVictory, setClearedVictory] = useState<boolean>(false);

  const handleIncidentChange = (idx: number) => {
    setSelectedIncidentIdx(idx);
    setDiscoveredDiagnostics([]);
    setSelectedMitigation(null);
    setMitigationCommitted(false);
    setPostMortemText("");
    setClearedVictory(false);
  };

  const runDiagnostic = (actionId: string) => {
    if (!discoveredDiagnostics.includes(actionId)) {
      setDiscoveredDiagnostics([...discoveredDiagnostics, actionId]);
      toast({
        title: "Diagnostic Telemetry Captured",
        description: "New root-cause traces appended to your investigation log.",
      });
    }
  };

  const handleMitigationCommit = () => {
    if (!selectedMitigation) {
      toast({ title: "Select a mitigation", description: "Choose how you will contain the incident." });
      return;
    }
    setMitigationCommitted(true);
    const chosen = incident.mitigationOptions.find((m) => m.id === selectedMitigation);
    if (chosen?.isOptimal) {
      toast({
        title: "Incident Contained! 🚀",
        description: "Systems stabilizing. Complete your post-mortem defense to earn clearance.",
      });
    } else {
      toast({
        title: "Suboptimal Containment ⚠️",
        description: chosen?.consequence || "Production instability persists.",
        variant: "destructive",
      });
    }
  };

  const handlePostMortemSubmit = () => {
    if (!postMortemText.trim()) {
      toast({ title: "Explanation required", description: "Defend your engineering diagnosis." });
      return;
    }
    const chosen = incident.mitigationOptions.find((m) => m.id === selectedMitigation);
    if (chosen?.isOptimal) {
      setClearedVictory(true);
      toast({
        title: "BOSS BATTLE CLEARED! 🏆",
        description: "Your incident response and root-cause justification verified.",
      });
    } else {
      toast({
        title: "Post-Mortem Rejected",
        description: "Review your initial mitigation approach before clearance.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Threat Banner */}
      <div className="glass-card rounded-2xl p-5 border border-destructive/40 bg-gradient-to-r from-destructive/10 via-card/60 to-destructive/5 shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Badge className="bg-destructive text-destructive-foreground animate-pulse text-xs font-mono font-bold">
                {incident.threatLevel}
              </Badge>
              <span className="text-xs font-mono text-muted-foreground">{incident.environment}</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Flame className="h-6 w-6 text-destructive animate-bounce" />
              <span>Career Boss Battle: Incident Control Room</span>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 max-w-2xl">
              Real-time high-stakes crisis simulation. Inspect live telemetry, trigger diagnostic probes, commit mitigation actions, and defend your post-mortem.
            </p>
          </div>

          {/* Incident Selector */}
          <div className="flex flex-wrap gap-1.5 bg-card/80 p-1.5 rounded-xl border border-border/60">
            {BOSS_BATTLE_INCIDENTS.map((inc, idx) => (
              <button
                key={inc.id}
                onClick={() => handleIncidentChange(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedIncidentIdx === idx
                    ? "bg-destructive text-white font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {inc.roleId.split("-")[0].toUpperCase()} Crisis
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Incident Situation & Live Telemetry Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Situation & Telemetry Chart (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="glass-card border-border/60">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-base flex items-center justify-between">
                <span className="text-foreground font-bold">{incident.title}</span>
                <span className="text-xs text-muted-foreground font-mono">Telemetry Monitor</span>
              </CardTitle>
              <CardDescription className="text-xs leading-relaxed text-foreground/90">
                {incident.situation}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-2 space-y-3">
              {/* Telemetry Chart */}
              <div className="h-56 w-full rounded-xl bg-slate-950 p-2 border border-slate-800">
                <div className="flex items-center justify-between px-2 pb-1 text-[11px] text-slate-400 font-mono">
                  <span className="flex items-center gap-1">
                    <Activity className="h-3 w-3 text-destructive" /> LIVE TELEMETRY SPIKE
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-red-400">● {incident.metricLabels[0]}</span>
                    <span className="text-amber-400">● {incident.metricLabels[1]}</span>
                    <span className="text-cyan-400">● {incident.metricLabels[2]}</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height="88%">
                  <AreaChart data={incident.telemetryData}>
                    <defs>
                      <linearGradient id="colorMetric1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorMetric2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.7} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="time" stroke="#64748b" fontSize={10} />
                    <YAxis stroke="#64748b" fontSize={10} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", fontSize: "11px" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="metric1"
                      name={incident.metricLabels[0]}
                      stroke="#ef4444"
                      fillOpacity={1}
                      fill="url(#colorMetric1)"
                    />
                    <Area
                      type="monotone"
                      dataKey="metric2"
                      name={incident.metricLabels[1]}
                      stroke="#f59e0b"
                      fillOpacity={1}
                      fill="url(#colorMetric2)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Diagnostic Toolkit */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                  <span>Interactive Diagnostic Toolkit (Run Probes):</span>
                  <span className="text-[10px] text-primary font-mono font-normal">
                    {discoveredDiagnostics.length}/{incident.diagnosticActions.length} Probes Executed
                  </span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {incident.diagnosticActions.map((diag) => {
                    const isRun = discoveredDiagnostics.includes(diag.id);
                    return (
                      <Button
                        key={diag.id}
                        variant="outline"
                        size="sm"
                        onClick={() => runDiagnostic(diag.id)}
                        className={`text-xs justify-start h-9 gap-2 transition-all ${
                          isRun
                            ? "bg-primary/10 border-primary/40 text-primary font-semibold"
                            : "hover:border-primary/40"
                        }`}
                      >
                        <Search className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{diag.actionLabel}</span>
                        {isRun && <CheckCircle2 className="h-3.5 w-3.5 ml-auto text-primary shrink-0" />}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Terminal Console (1 col) */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="glass-card border-slate-800 bg-slate-950 text-slate-200 h-full flex flex-col shadow-inner">
            <CardHeader className="p-3.5 pb-2 border-b border-slate-800">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <Terminal className="h-3.5 w-3.5" /> incident-console.log
                </span>
                <span className="text-[10px] text-slate-500">STREAMING</span>
              </div>
            </CardHeader>
            <CardContent className="p-3 font-mono text-xs space-y-2 flex-1 overflow-y-auto max-h-[380px]">
              {incident.initialLogs.map((log, idx) => (
                <div key={idx} className="text-slate-300 leading-relaxed text-[11px]">
                  {log}
                </div>
              ))}

              {discoveredDiagnostics.map((diagId) => {
                const diag = incident.diagnosticActions.find((d) => d.id === diagId);
                if (!diag) return null;
                return (
                  <div key={diagId} className="p-2 rounded-lg bg-slate-900 border border-emerald-500/40 space-y-1">
                    <div className="text-emerald-400 font-bold text-[11px] flex items-center gap-1">
                      <span>✓ {diag.actionLabel}</span>
                    </div>
                    <div className="text-slate-300 text-[10px] leading-snug">{diag.discoveredLog}</div>
                    <div className="text-amber-400 text-[10px] italic">Hint: {diag.revealedHint}</div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mitigation Action & Post-Mortem Defense */}
      <Card className="glass-card border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">Incident Mitigation & Post-Mortem</CardTitle>
          <CardDescription className="text-xs">
            Deploy emergency remediation to stabilize production and submit root-cause justification.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Mitigation Choices */}
          <div className="space-y-2.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Select Production Mitigation Strategy:
            </label>
            {incident.mitigationOptions.map((opt) => {
              const isSelected = selectedMitigation === opt.id;
              let optBorder = "border-border/60 hover:border-primary/40";
              if (mitigationCommitted) {
                if (opt.isOptimal) optBorder = "border-emerald-500/80 bg-emerald-500/10";
                else if (isSelected) optBorder = "border-destructive/80 bg-destructive/10";
              } else if (isSelected) {
                optBorder = "border-primary bg-primary/5 ring-1 ring-primary";
              }

              return (
                <div
                  key={opt.id}
                  onClick={() => !mitigationCommitted && setSelectedMitigation(opt.id)}
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
                      <div className="font-semibold text-xs sm:text-sm text-foreground">{opt.title}</div>
                      <p className="text-xs text-muted-foreground">{opt.description}</p>
                      {mitigationCommitted && (
                        <div
                          className={`text-xs pt-1 font-medium ${
                            opt.isOptimal ? "text-emerald-500" : "text-destructive"
                          }`}
                        >
                          Consequence: {opt.consequence}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Commit Button */}
          {!mitigationCommitted && (
            <Button onClick={handleMitigationCommit} size="sm" className="text-xs gap-1.5">
              <Zap className="h-3.5 w-3.5" /> Execute Mitigation Order
            </Button>
          )}

          {/* Post-Mortem Defense Box */}
          {mitigationCommitted && (
            <div className="space-y-3 pt-3 border-t border-border/40">
              <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                <span>{incident.postMortemPrompt}</span>
                <span className="text-[10px] text-primary">Required for Incident Clearance</span>
              </label>
              <Textarea
                placeholder="Type your root-cause explanation here..."
                value={postMortemText}
                onChange={(e) => setPostMortemText(e.target.value)}
                className="text-xs min-h-[80px]"
                disabled={clearedVictory}
              />

              {!clearedVictory ? (
                <Button onClick={handlePostMortemSubmit} size="sm" className="text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Submit Post-Mortem Defense
                </Button>
              ) : (
                /* Victory Clearance Card */
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 space-y-2 animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-emerald-500" />
                    <span className="font-bold text-sm sm:text-base">
                      INCIDENT TRIAGE CLEARANCE: PASSED
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-foreground/90">
                    You accurately pinpointed the root cause, mitigated the outage, and articulated a sound post-mortem. This counts toward your verified career readiness evidence!
                  </p>
                  <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-muted-foreground border-t border-emerald-500/20">
                    <span>SEV-1 CLEARANCE HASH: #BOSSCLEAR-2026</span>
                    <span>STATUS: RESOLVED</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
