import { useState } from "react";
import { PROGRESS_PROOF_BENCHMARK } from "@/data/careerSimulations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  TrendingUp,
  Award,
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  FileCheck,
  ShieldCheck,
} from "lucide-react";

export default function ProgressProofView() {
  const data = PROGRESS_PROOF_BENCHMARK;
  const [activeTab, setActiveTab] = useState<"comparison" | "interventions">("comparison");

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-card rounded-2xl p-5 border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-card/60 to-primary/10 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs font-semibold">
                THE 30-SECOND DEMO PROOF
              </Badge>
              <span className="text-xs text-muted-foreground font-mono">
                Closed-Loop Verification
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-emerald-500" />
              <span>Simulate → Expose Failure → Intervene → Prove</span>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 max-w-2xl">
              Witness the verified before-and-after: Simulation #1 exposes the failure vector, StudyMind's cognitive engines repair it, and Simulation #2 proves mastery.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={activeTab === "comparison" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("comparison")}
              className="text-xs h-8"
            >
              Benchmark Delta
            </Button>
            <Button
              variant={activeTab === "interventions" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("interventions")}
              className="text-xs h-8"
            >
              Cognitive Interventions
            </Button>
          </div>
        </div>
      </div>

      {/* Main Benchmark Card */}
      <Card className="glass-card border-border/60 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-xl font-bold text-foreground">
                Career Simulation #1 vs Simulation #2 Delta
              </CardTitle>
              <CardDescription className="text-xs">
                Candidate: {data.studentName} • Target Track: {data.targetRole}
              </CardDescription>
            </div>
            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 text-xs font-mono">
              VERIFIED IMPROVEMENT
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Recharts Comparative Bar Chart */}
          <div className="h-72 w-full rounded-xl bg-card border border-border/60 p-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.radarComparison} margin={{ top: 15, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="subject" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
                <Bar dataKey="baseline" name="Sim #1 Baseline (Pre-Intervention)" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="retest" name="Sim #2 Retest (Post-Intervention)" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Highlights Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-card border border-border/60 text-center space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                Practical Debugging
              </span>
              <div className="text-xl font-black font-mono text-emerald-500">+37%</div>
              <span className="text-[10px] text-muted-foreground">41% → 78%</span>
            </div>

            <div className="p-3 rounded-xl bg-card border border-border/60 text-center space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                Conceptual Math
              </span>
              <div className="text-xl font-black font-mono text-emerald-500">+32%</div>
              <span className="text-[10px] text-muted-foreground">52% → 84%</span>
            </div>

            <div className="p-3 rounded-xl bg-card border border-border/60 text-center space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                Problem Solving
              </span>
              <div className="text-xl font-black font-mono text-emerald-500">+23%</div>
              <span className="text-[10px] text-muted-foreground">53% → 76%</span>
            </div>

            <div className="p-3 rounded-xl bg-card border border-border/60 text-center space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                Stress Resilience
              </span>
              <div className="text-xl font-black font-mono text-emerald-500">+24%</div>
              <span className="text-[10px] text-muted-foreground">50% → 74%</span>
            </div>
          </div>

          {/* Intervention Logs */}
          <div className="p-4 rounded-xl bg-muted/40 border border-border/60 space-y-3">
            <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              Verified 7-Day StudyMind Intervention Audit Trail
            </h4>

            <div className="space-y-2 text-xs">
              {data.interventionDetails.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-card border border-border/40 flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-primary">{item.technique}: </span>
                    <span className="text-foreground">{item.topic}</span>
                  </div>
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 text-xs">
                    {item.scoreGain}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Final Outcome Callout */}
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs sm:text-sm text-foreground leading-relaxed flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">Verifiable Placement Impact: </span>
              {data.keyOutcome}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
