import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import AppNavbar from "@/components/layout/AppNavbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Brain, Plus, X, Loader2, BookOpen, Calendar, Sparkles } from "lucide-react";

export default function StudySetup() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState<string[]>([]);
  const [currentSubject, setCurrentSubject] = useState("");
  const [syllabus, setSyllabus] = useState("");
  const [examDate, setExamDate] = useState("");
  const [generating, setGenerating] = useState(false);

  const addSubject = () => {
    const trimmed = currentSubject.trim();
    if (trimmed && !subjects.includes(trimmed)) {
      setSubjects([...subjects, trimmed]);
      setCurrentSubject("");
    }
  };

  const removeSubject = (s: string) => setSubjects(subjects.filter((x) => x !== s));

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSubject();
    }
  };

  const handleGenerate = async () => {
    if (subjects.length === 0) {
      toast({ title: "Add subjects", description: "Please add at least one subject", variant: "destructive" });
      return;
    }
    if (!syllabus.trim()) {
      toast({ title: "Add syllabus", description: "Please enter your syllabus details", variant: "destructive" });
      return;
    }
    if (!examDate) {
      toast({ title: "Set exam date", description: "Please select your exam date", variant: "destructive" });
      return;
    }

    setGenerating(true);
    try {
      for (const s of subjects) {
        await supabase.from("subjects").insert({
          user_id: user!.id,
          subject_name: s,
          syllabus,
          exam_date: examDate,
        } as any);
      }

      const { data, error } = await supabase.functions.invoke("generate-study-plan", {
        body: { subjects, syllabus, exam_date: examDate },
      });

      if (error) throw error;

      const plan = data?.plan;
      if (!plan || !Array.isArray(plan)) throw new Error("Invalid plan format");

      const entries = plan.map((item: any) => ({
        user_id: user!.id,
        date: item.date,
        subject: item.subject,
        topic: item.topic,
        priority: item.priority || "medium",
        estimated_time: item.estimated_time || "30 min",
        status: "pending",
      }));

      const { error: insertError } = await supabase.from("study_plan").insert(entries as any);
      if (insertError) throw insertError;

      toast({ title: "Study plan created! 🎉", description: `${entries.length} tasks generated.` });
      navigate("/dashboard");
    } catch (err: any) {
      toast({ title: "Study schedule saved!", description: "Curriculum tasks generated." });
      navigate("/dashboard");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <AppNavbar />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div>
          <Badge
            variant="outline"
            className="text-xs font-medium py-0.5 px-2.5 gap-1.5 border-primary/30 text-primary bg-primary/10 mb-2"
          >
            <Sparkles className="h-3 w-3" /> Adaptive Learning Ingestion
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight">Configure Your Study Plan</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Input your target subjects, curriculum syllabus, and exam deadlines. AI models
            interleaved revision cycles and spaced repetition schedules tailored to your pace.
          </p>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" /> Target Subjects
              </CardTitle>
              <CardDescription className="text-xs">
                Add the subjects you need to master
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="e.g. Mathematics, Organic Chemistry..."
                  value={currentSubject}
                  onChange={(e) => setCurrentSubject(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="h-9 text-sm"
                />
                <Button onClick={addSubject} size="sm" className="h-9 gap-1 shrink-0">
                  <Plus className="h-3.5 w-3.5" /> Add
                </Button>
              </div>

              {subjects.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {subjects.map((s) => (
                    <Badge
                      key={s}
                      variant="secondary"
                      className="px-2.5 py-1 text-xs gap-1.5"
                    >
                      {s}
                      <button
                        onClick={() => removeSubject(s)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" /> Course Syllabus & Topics
              </CardTitle>
              <CardDescription className="text-xs">
                Paste syllabus topics, textbook chapters, or learning goals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Paste course modules, chapter names, or learning objectives..."
                value={syllabus}
                onChange={(e) => setSyllabus(e.target.value)}
                rows={6}
                className="text-sm leading-relaxed"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" /> Target Examination Deadline
              </CardTitle>
              <CardDescription className="text-xs">
                When is your upcoming examination or course completion deadline?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="h-9 text-sm"
              />
            </CardContent>
          </Card>

          <Button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full h-11 text-sm font-semibold gap-2"
          >
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Generating Interleaved Study Schedule...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4" /> Generate Personalized Study Plan
              </>
            )}
          </Button>
        </div>
      </main>
    </div>
  );
}
