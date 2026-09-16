import { useState } from "react";
import { CAREER_SWITCH_PROFILES } from "@/data/careerSimulations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Shuffle,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
} from "lucide-react";

export default function CareerSwitchCostView() {
  const [selectedProfileIdx, setSelectedProfileIdx] = useState<number>(0);
  const profile = CAREER_SWITCH_PROFILES[selectedProfileIdx] || CAREER_SWITCH_PROFILES[0];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-card rounded-2xl p-5 border border-primary/30 bg-gradient-to-r from-primary/10 via-card/60 to-accent/10 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Badge className="bg-primary/20 text-primary border-primary/30 text-xs font-semibold">
                TRANSFERABLE SKILLS ENGINE
              </Badge>
              <span className="text-xs text-muted-foreground font-mono">
                Smart Career Transition Audit
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Shuffle className="h-6 w-6 text-primary" />
              <span>Career Switch Cost & Transferable Skills</span>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 max-w-2xl">
              Switching paths shouldn't mean restarting from scratch. Quantify your transferable competencies, isolate true missing foundations, and measure the exact workload required.
            </p>
          </div>

          {/* Profile Switcher */}
          <div className="flex flex-wrap gap-1.5 bg-card/80 p-1.5 rounded-xl border border-border/60">
            {CAREER_SWITCH_PROFILES.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => setSelectedProfileIdx(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedProfileIdx === idx
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {p.currentRole.split(" ")[0]} → {p.targetRole.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Switch Analytics Card */}
      <Card className="glass-card border-border/60 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <span>{profile.currentRole}</span>
                <ArrowRight className="h-4 w-4 text-primary" />
                <span className="font-bold text-foreground">{profile.targetRole}</span>
              </div>
              <CardTitle className="text-xl sm:text-2xl text-foreground">
                Career Transition Workload: {profile.totalEstimatedWeeks} Weeks
              </CardTitle>
            </div>

            {/* Transferable Percentage Pill */}
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-right">
              <div className="text-2xl font-black font-mono">
                {profile.transferablePercentage}%
              </div>
              <div className="text-[11px] font-medium">Head Start Unlocked</div>
            </div>
          </div>

          <CardDescription className="text-xs sm:text-sm mt-2 leading-relaxed">
            {profile.switchRecommendation}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Workload Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-foreground">Estimated Study & Project Workload:</span>
              <span className="text-primary font-mono">{profile.learningWorkloadBar}% Intensity</span>
            </div>
            <Progress value={profile.learningWorkloadBar} className="h-2.5" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Transferable Skills */}
            <div className="space-y-3 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> Transferable Skills Unlocked
                </h3>
                <span className="text-[10px] text-muted-foreground">You do NOT restart from zero</span>
              </div>

              <div className="space-y-2.5">
                {profile.transferableSkills.map((ts, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-card border border-emerald-500/20 space-y-1">
                    <div className="font-semibold text-xs text-foreground flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {ts.skill}
                    </div>
                    <div className="text-[11px] text-muted-foreground leading-snug pl-3">
                      {ts.howItApplies}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Missing Foundations */}
            <div className="space-y-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4" /> Missing Specialized Foundations
                </h3>
                <span className="text-[10px] text-muted-foreground">Focus your hours here</span>
              </div>

              <div className="space-y-2.5">
                {profile.missingFoundations.map((mf, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-card border border-amber-500/20 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-foreground">{mf.skill}</span>
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${
                          mf.difficulty === "Steep"
                            ? "text-destructive border-destructive/30"
                            : "text-amber-500 border-amber-500/30"
                        }`}
                      >
                        {mf.difficulty}
                      </Badge>
                    </div>
                    <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span>~{mf.estimatedHours} Hours of Active Practice</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
