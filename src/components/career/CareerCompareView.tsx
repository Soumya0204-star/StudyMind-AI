import { useState } from "react";
import { CAREER_COMPARISONS } from "@/data/careerSimulations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Scale,
  ArrowRight,
  HelpCircle,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
} from "lucide-react";

export default function CareerCompareView() {
  const [selectedPairIdx, setSelectedPairIdx] = useState<number>(0);
  const comparison = CAREER_COMPARISONS[selectedPairIdx] || CAREER_COMPARISONS[0];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-card rounded-2xl p-5 border border-primary/30 bg-gradient-to-r from-primary/10 via-card/60 to-purple-500/10 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Badge className="bg-primary/20 text-primary border-primary/30 text-xs font-semibold">
                OBJECTIVE TRADE-OFF ENGINE
              </Badge>
              <span className="text-xs text-muted-foreground font-mono">
                Decide with Real Data
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Scale className="h-6 w-6 text-primary" />
              <span>"What If I Choose Wrong?" Path Comparison</span>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 max-w-2xl">
              We don't tell you what career to pick with fake percentages. We simulate both paths side-by-side so you can evaluate the exact day-to-day trade-offs.
            </p>
          </div>

          {/* Pair Switcher */}
          <div className="flex flex-wrap gap-1.5 bg-card/80 p-1.5 rounded-xl border border-border/60">
            {CAREER_COMPARISONS.map((pair, idx) => (
              <button
                key={pair.id}
                onClick={() => setSelectedPairIdx(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedPairIdx === idx
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {pair.roleA.title.split(" ")[0]} vs {pair.roleB.title.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Side-by-Side Hero Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Role A Card */}
        <Card className="glass-card border-border/60 shadow-sm">
          <CardHeader className="pb-3 border-b border-border/40">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-500 border-blue-500/30 font-semibold">
                PATH A
              </Badge>
              <span className="text-xs font-mono text-muted-foreground">{comparison.roleA.avgSalary}</span>
            </div>
            <CardTitle className="text-xl font-bold text-foreground mt-1">
              {comparison.roleA.title}
            </CardTitle>
            <CardDescription className="text-xs">{comparison.roleA.tagline}</CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-2 text-xs">
            <div className="text-muted-foreground leading-relaxed">
              {comparison.roleA.description}
            </div>
            <div className="pt-2 border-t border-border/40">
              <span className="font-semibold text-foreground">Market Demand: </span>
              <span className="text-primary font-medium">{comparison.roleA.marketDemand}</span>
            </div>
          </CardContent>
        </Card>

        {/* Role B Card */}
        <Card className="glass-card border-border/60 shadow-sm">
          <CardHeader className="pb-3 border-b border-border/40">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs bg-purple-500/10 text-purple-500 border-purple-500/30 font-semibold">
                PATH B
              </Badge>
              <span className="text-xs font-mono text-muted-foreground">{comparison.roleB.avgSalary}</span>
            </div>
            <CardTitle className="text-xl font-bold text-foreground mt-1">
              {comparison.roleB.title}
            </CardTitle>
            <CardDescription className="text-xs">{comparison.roleB.tagline}</CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-2 text-xs">
            <div className="text-muted-foreground leading-relaxed">
              {comparison.roleB.description}
            </div>
            <div className="pt-2 border-t border-border/40">
              <span className="font-semibold text-foreground">Market Demand: </span>
              <span className="text-primary font-medium">{comparison.roleB.marketDemand}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trade-Off Comparison Matrix */}
      <Card className="glass-card border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">Direct Trade-Off Dimension Matrix</CardTitle>
          <CardDescription className="text-xs">
            Comparing the critical friction points, day-to-day realities, and campus hiring realities.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3.5">
          {comparison.dimensionComparisons.map((dim, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-card border border-border/60 space-y-2 text-xs"
            >
              <div className="font-bold text-sm text-foreground flex items-center justify-between">
                <span>{dim.dimension}</span>
                <span className="text-[11px] font-mono font-normal text-primary">Dimension #{idx + 1}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                <div className="p-2.5 rounded-lg bg-blue-500/5 border border-blue-500/20 text-muted-foreground leading-relaxed">
                  <span className="font-semibold text-foreground block mb-0.5">{comparison.roleA.title}:</span>
                  {dim.roleANote}
                </div>
                <div className="p-2.5 rounded-lg bg-purple-500/5 border border-purple-500/20 text-muted-foreground leading-relaxed">
                  <span className="font-semibold text-foreground block mb-0.5">{comparison.roleB.title}:</span>
                  {dim.roleBNote}
                </div>
              </div>

              <div className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 pt-1 border-t border-border/40 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                <span>Verdict: {dim.verdict}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Common Mistake & Clarifying Question Callouts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Common Pitfall */}
        <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20 text-xs space-y-1.5">
          <div className="font-bold text-destructive flex items-center gap-1.5 text-sm">
            <AlertTriangle className="h-4 w-4" /> Common Student Trap
          </div>
          <p className="text-muted-foreground leading-relaxed">{comparison.commonMistake}</p>
        </div>

        {/* Clarifying Question */}
        <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-xs space-y-1.5">
          <div className="font-bold text-primary flex items-center gap-1.5 text-sm">
            <HelpCircle className="h-4 w-4" /> Self-Reflection Calibration
          </div>
          <p className="text-foreground font-medium leading-relaxed italic">
            "{comparison.clarifyingQuestion}"
          </p>
        </div>
      </div>
    </div>
  );
}
