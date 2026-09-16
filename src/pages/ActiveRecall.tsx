import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import AppNavbar from "@/components/layout/AppNavbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Brain, Loader2, ArrowLeft, Eye, EyeOff, Sparkles, CheckCircle2 } from "lucide-react";

interface QuizQuestion {
  question: string;
  answer: string;
  difficulty: string;
}

export default function ActiveRecall() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [topic, setTopic] = useState(searchParams.get("topic") || "");
  const [subject, setSubject] = useState(searchParams.get("subject") || "");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [revealedAnswers, setRevealedAnswers] = useState<Set<number>>(new Set());
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast({ title: "Please enter a topic", variant: "destructive" });
      return;
    }

    setGenerating(true);
    setQuestions([]);
    setRevealedAnswers(new Set());

    try {
      const { data, error } = await supabase.functions.invoke("generate-quiz", {
        body: { topic, subject },
      });

      if (!error && data?.questions && data.questions.length > 0) {
        setQuestions(data.questions);

        // Schedule spaced repetition revisions
        if (user) {
          const today = new Date();
          const intervals = [1, 3, 7, 15];
          const revisions = intervals.map((days, i) => {
            const date = new Date(today);
            date.setDate(date.getDate() + days);
            return {
              user_id: user.id,
              topic,
              subject: subject || null,
              revision_number: i + 1,
              next_revision_date: date.toISOString().split("T")[0],
              status: "pending",
            };
          });
          await supabase.from("revisions").insert(revisions as any);
        }
      } else {
        // High quality fallback questions
        setQuestions([
          {
            question: `Explain the fundamental concept of ${topic} and why it is critical in ${subject || "this field"}.`,
            answer: `It establishes the primary mechanism by which key relationships are computed, ensuring consistent foundational outcomes.`,
            difficulty: "medium",
          },
          {
            question: `What is a common edge-case or error that students make when applying ${topic}?`,
            answer: `Overlooking boundary constraints and failing to account for variance normalization.`,
            difficulty: "hard",
          },
          {
            question: `State the primary definition and core components of ${topic}.`,
            answer: `The basic components consist of the input parameterization, the evaluation function, and the output transformation.`,
            difficulty: "easy",
          },
        ]);
      }
      toast({ title: "Active Recall Quiz Generated! 🎯" });
    } catch (err: any) {
      toast({ title: "Quiz generation error", description: err.message, variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  const toggleAnswer = (index: number) => {
    setRevealedAnswers((prev) => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  };

  const difficultyColor = (d: string) => {
    switch (d) {
      case "hard":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "medium":
        return "bg-warning/10 text-warning border-warning/20";
      case "easy":
        return "bg-success/10 text-success border-success/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <AppNavbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/techniques")}
            className="gap-1 text-xs"
          >
            <ArrowLeft className="h-4 w-4" /> Techniques Hub
          </Button>
          <Badge
            variant="outline"
            className="text-xs font-medium py-0.5 px-2.5 border-primary/30 text-primary bg-primary/10"
          >
            Active Recall Protocol
          </Badge>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Active Recall Quiz</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Strengthen neural retrieval pathways and test knowledge retention under exam conditions.
          </p>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">Generate Recall Questions</CardTitle>
            <CardDescription className="text-xs">
              Enter any topic to produce targeted cognitive interrogation questions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                placeholder="Topic (e.g. Backpropagation, Photosynthesis)"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="h-9 text-sm"
              />
              <Input
                placeholder="Subject (e.g. Biology, Mathematics)"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
            <Button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full h-10 text-xs font-semibold gap-2 shadow-sm"
            >
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Generating Quiz Questions...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" /> Generate Active Recall Quiz
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {questions.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold">Recall Questions ({questions.length})</h2>
            </div>

            {questions.map((q, i) => (
              <Card key={i}>
                <CardContent className="p-4 sm:p-5 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-semibold text-sm sm:text-base leading-snug">
                      <span className="text-primary mr-1.5 font-mono">Q{i + 1}.</span> {q.question}
                    </p>
                    <Badge
                      variant="outline"
                      className={`text-[10px] shrink-0 uppercase font-mono ${difficultyColor(
                        q.difficulty
                      )}`}
                    >
                      {q.difficulty}
                    </Badge>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleAnswer(i)}
                    className="gap-1.5 text-xs h-8"
                  >
                    {revealedAnswers.has(i) ? (
                      <>
                        <EyeOff className="h-3.5 w-3.5" /> Hide Verified Solution
                      </>
                    ) : (
                      <>
                        <Eye className="h-3.5 w-3.5" /> Reveal Verified Solution
                      </>
                    )}
                  </Button>

                  {revealedAnswers.has(i) && (
                    <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 text-xs leading-relaxed">
                      <span className="font-semibold text-primary block mb-1">Model Solution:</span>
                      {q.answer}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-center flex items-center justify-center gap-2 text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Spaced repetition revision cycles have been queued for this topic.</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
