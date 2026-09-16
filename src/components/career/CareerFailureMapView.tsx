import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CAREER_FAILURE_POINTS, CAREER_ROLES } from "@/data/careerSimulations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  ArrowRight,
  Brain,
  Zap,
  BookOpen,
  Calendar,
  Sparkles,
  CheckCircle2,
  Filter,
} from "lucide-react";

export default function CareerFailureMapView() {
  const navigate = useNavigate();
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>("all");

  const filteredPoints =
    selectedRoleFilter === "all"
      ? CAREER_FAILURE_POINTS
      : CAREER_FAILURE_POINTS.filter((p) => p.roleId === selectedRoleFilter);

  const severityColor = (sev: string) => {
    switch (sev) {
      case "Critical Bottleneck":
        return "bg-destructive/10 text-destructive border-destructive/30";
      case "High Probability":
        return "bg-amber-500/10 text-amber-500 border-amber-500/30";
      default:
        return "bg-blue-500/10 text-blue-500 border-blue-500/30";
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-card rounded-2xl p-5 border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-card/60 to-amber-500/5 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Badge className="bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30 text-xs font-semibold">
                PREDICTIVE BREAKDOWN AUDIT
              </Badge>
              <span className="text-xs text-muted-foreground font-mono">Pre-Placement Diagnostic</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-amber-500" />
              <span>Career Failure Map</span>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 max-w-2xl">
              Don't wait until placement season to discover where your preparation breaks down. Pinpoint friction vectors early and eliminate them with cognitive learning drills.
            </p>
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-1.5 bg-card/80 p-1.5 rounded-xl border border-border/60">
            <Filter className="h-3.5 w-3.5 text-muted-foreground ml-1 mr-0.5" />
            <select
              value={selectedRoleFilter}
              onChange={(e) => setSelectedRoleFilter(e.target.value)}
              className="bg-transparent text-xs font-medium text-foreground focus:outline-none cursor-pointer pr-2"
            >
              <option value="all">All Roles</option>
              {CAREER_ROLES.map((r) => (
                <option key={r.id} value={r.id} className="bg-card text-foreground">
                  {r.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Failure Vector Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPoints.map((point) => {
          const role = CAREER_ROLES.find((r) => r.id === point.roleId);
          return (
            <Card
              key={point.id}
              className="glass-card border-border/60 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className={`text-xs font-semibold ${severityColor(point.severity)}`}>
                    {point.severity}
                  </Badge>
                  <span className="text-[11px] text-muted-foreground font-mono">{role?.title}</span>
                </div>
                <CardTitle className="text-base sm:text-lg mt-2 text-foreground font-bold">
                  {point.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3.5 text-xs flex-1">
                {/* Root Cause & Symptom */}
                <div className="space-y-1.5 bg-muted/40 p-3 rounded-xl border border-border/40">
                  <div className="text-muted-foreground leading-relaxed">
                    <span className="font-semibold text-foreground">Root Cause:</span> {point.rootCause}
                  </div>
                  <div className="text-muted-foreground leading-relaxed">
                    <span className="font-semibold text-foreground">Placement Symptom:</span> {point.triggerSymptom}
                  </div>
                </div>

                {/* Placement Season Impact */}
                <div className="p-2.5 rounded-lg bg-destructive/5 border border-destructive/20 text-destructive font-medium leading-snug">
                  ⚠ Placement Impact: {point.placementImpact}
                </div>

                {/* StudyMind Cognitive Fix */}
                <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 space-y-2 mt-auto">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5" /> StudyMind Cognitive Prescription:
                    </span>
                    <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/30">
                      {point.studyMindIntervention.technique.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">{point.studyMindIntervention.interventionPlan}</p>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    Expected Gain: {point.studyMindIntervention.expectedImprovement}
                  </div>

                  {/* Quick Action Button */}
                  <Button
                    size="sm"
                    onClick={() => {
                      if (point.studyMindIntervention.technique === "feynman") {
                        navigate(
                          `/techniques/feynman?topic=${encodeURIComponent(point.studyMindIntervention.topic)}`
                        );
                      } else if (point.studyMindIntervention.technique === "active-recall") {
                        navigate(
                          `/techniques/active-recall?topic=${encodeURIComponent(
                            point.studyMindIntervention.topic
                          )}`
                        );
                      } else {
                        navigate("/setup");
                      }
                    }}
                    className="w-full text-xs h-8 gap-1.5 mt-1 bg-primary text-primary-foreground"
                  >
                    <span>Execute Intervention Drill</span>
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
