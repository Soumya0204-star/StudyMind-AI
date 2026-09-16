import { useNavigate } from "react-router-dom";
import AppNavbar from "@/components/layout/AppNavbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  Zap,
  BookOpen,
  PenTool,
  RefreshCw,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const techniques = [
  {
    title: "Active Recall",
    badge: "High Retention",
    description:
      "Generate calibrated quiz questions from any topic to test your memory and strengthen synaptic retrieval pathways under exam conditions.",
    icon: Zap,
    path: "/techniques/active-recall",
    color: "text-primary",
    bg: "bg-primary/10 border-primary/20",
  },
  {
    title: "Feynman Technique",
    badge: "Deep Understanding",
    description:
      "Explain a topic in simple terms as if teaching a child. AI analyzes your explanation for hidden jargon, factual accuracy, and conceptual completeness.",
    icon: BookOpen,
    path: "/techniques/feynman",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
  {
    title: "Blurting Method",
    badge: "Knowledge Gap Audit",
    description:
      "Write everything you can remember about a topic without consulting notes. AI audits your output against reference knowledge to find overlooked concepts.",
    icon: PenTool,
    path: "/techniques/blurting",
    color: "text-amber-500",
    bg: "bg-amber-500/10 border-amber-500/20",
  },
  {
    title: "Spaced Repetition Planner",
    badge: "Long-Term Recall",
    description:
      "Automated revision cycles mapped to the Ebbinghaus forgetting curve (Day 1 → 3 → 7 → 15) to prevent study fade before final examinations.",
    icon: RefreshCw,
    path: "/dashboard",
    color: "text-blue-500",
    bg: "bg-blue-500/10 border-blue-500/20",
  },
];

export default function Techniques() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <AppNavbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div>
          <Badge
            variant="outline"
            className="text-xs font-medium py-0.5 px-2.5 gap-1.5 border-primary/30 text-primary bg-primary/10 mb-2"
          >
            <Sparkles className="h-3 w-3" /> Cognitive Retention Frameworks
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight">Scientifically Proven Study Techniques</h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Methods clinically proven to maximize comprehension, eliminate passive highlighting, and
            halt forgetting curves.
          </p>
        </div>

        <div className="grid gap-4">
          {techniques.map((t) => {
            const Icon = t.icon;
            return (
              <Card
                key={t.title}
                className="border hover:border-primary/40 cursor-pointer transition-all hover:shadow-md group"
                onClick={() => navigate(t.path)}
              >
                <CardContent className="p-5 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${t.bg} border shrink-0 transition-transform group-hover:scale-105`}>
                      <Icon className={`h-6 w-6 ${t.color}`} />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base sm:text-lg group-hover:text-primary transition-colors">
                          {t.title}
                        </CardTitle>
                        <Badge variant="outline" className="text-[10px]">
                          {t.badge}
                        </Badge>
                      </div>
                      <CardDescription className="text-xs sm:text-sm leading-relaxed">
                        {t.description}
                      </CardDescription>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 mt-2" />
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
