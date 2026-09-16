import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import AppNavbar from "@/components/layout/AppNavbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import {
  Brain,
  Plus,
  Calendar,
  Clock,
  BookOpen,
  RefreshCw,
  Zap,
  BarChart3,
  Sparkles,
  Loader2,
  AlertTriangle,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  Activity,
  ArrowRight,
  Rocket,
} from "lucide-react";
import { isToday, isFuture, isPast, parseISO, format } from "date-fns";
import { useStudySessions } from "@/hooks/useStudySessions";
import StudySessionCard from "@/components/StudySessionCard";
import StatsCards from "@/components/StatsCards";

interface StudyTask {
  id: string;
  date: string;
  subject: string;
  topic: string;
  priority: string;
  estimated_time: string | null;
  status: string;
}

interface Revision {
  id: string;
  topic: string;
  subject: string | null;
  revision_number: number;
  next_revision_date: string;
  status: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [revisionsDue, setRevisionsDue] = useState<Revision[]>([]);
  const [loading, setLoading] = useState(true);
  const [optimizing, setOptimizing] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [insightLoading, setInsightLoading] = useState(false);
  const [weakTopics, setWeakTopics] = useState<{ subject: string; topics: string[] }[]>([]);

  const {
    activeSession,
    todayTotal,
    todayActiveTotal,
    weekTotal,
    streak,
    startSession,
    endSession,
  } = useStudySessions();

  useEffect(() => {
    if (user) {
      fetchTasks();
      fetchRevisions();
      fetchWeakTopics();
      fetchDailyInsight();
    }
  }, [user]);

  const fetchTasks = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("study_plan")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: true });

    if (error) {
      toast({ title: "Error loading tasks", description: error.message, variant: "destructive" });
    } else {
      setTasks((data as any[]) || []);
    }
    setLoading(false);
  };

  const fetchRevisions = async () => {
    if (!user) return;
    const today = new Date().toISOString().split("T")[0];
    const { data } = await supabase
      .from("revisions")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "pending")
      .lte("next_revision_date", today)
      .order("next_revision_date", { ascending: true });

    setRevisionsDue((data as any[]) || []);
  };

  const fetchWeakTopics = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("performance")
      .select("subject, weak_topics, ai_analysis")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    if (data) {
      const weakMap = new Map<string, Set<string>>();
      (data as any[]).forEach((p) => {
        if (
          p.ai_analysis?.score_category === "critical" ||
          p.ai_analysis?.score_category === "needs_improvement"
        ) {
          const topics = new Set(weakMap.get(p.subject) || []);
          (p.weak_topics || []).forEach((t: string) => topics.add(t));
          (p.ai_analysis?.weak_areas || []).forEach((w: any) => topics.add(w.area));
          if (topics.size > 0) weakMap.set(p.subject, topics);
        }
      });
      setWeakTopics(
        Array.from(weakMap.entries()).map(([subject, topics]) => ({
          subject,
          topics: Array.from(topics).slice(0, 5),
        }))
      );
    }
  };

  const fetchDailyInsight = async () => {
    setInsightLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("daily-insight");
      if (!error && data?.insight) {
        setAiInsight(data.insight);
      }
    } catch {
      // Graceful fallback
    } finally {
      setInsightLoading(false);
    }
  };

  const completeRevision = async (rev: Revision) => {
    await supabase.from("revisions").update({ status: "completed" } as any).eq("id", rev.id);
    setRevisionsDue((prev) => prev.filter((r) => r.id !== rev.id));
    toast({ title: "Revision completed! ✅" });
  };

  const toggleTask = async (task: StudyTask) => {
    const newStatus = task.status === "completed" ? "pending" : "completed";
    const { error } = await supabase
      .from("study_plan")
      .update({ status: newStatus } as any)
      .eq("id", task.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setTasks(tasks.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t)));
    }
  };

  const optimizePlan = async () => {
    setOptimizing(true);
    try {
      const { data, error } = await supabase.functions.invoke("adapt-study-plan");
      if (error) throw error;
      if (data.error) {
        toast({ title: "Optimization failed", description: data.error, variant: "destructive" });
        return;
      }
      toast({
        title: "Your plan has been optimized! ✨",
        description: data.summary || `${data.changes} changes made based on your active study pace.`,
      });
      await fetchTasks();
    } catch (e: any) {
      toast({
        title: "Optimization failed",
        description: e.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setOptimizing(false);
    }
  };

  const todayTasks = tasks.filter((t) => isToday(parseISO(t.date)));
  const upcomingTasks = tasks
    .filter((t) => isFuture(parseISO(t.date)) && !isToday(parseISO(t.date)))
    .slice(0, 10);
  const completedCount = tasks.filter((t) => t.status === "completed").length;
  const progress = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;
  const uniqueSubjects = [...new Set(tasks.map((t) => t.subject))];
  const missedCount = tasks.filter(
    (t) =>
      t.status === "missed" ||
      (isPast(parseISO(t.date)) && !isToday(parseISO(t.date)) && t.status === "pending")
  ).length;

  const priorityColor = (p: string) => {
    switch (p) {
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

  const TaskItem = ({ task, showDate = false }: { task: StudyTask; showDate?: boolean }) => (
    <div
      className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
        task.status === "completed"
          ? "opacity-60 bg-muted/30 border-border/40"
          : task.status === "missed"
          ? "opacity-50 bg-destructive/5 border-destructive/20"
          : "bg-card hover:shadow-xs border-border/60"
      }`}
    >
      <Checkbox
        checked={task.status === "completed"}
        onCheckedChange={() => toggleTask(task)}
        className="mt-0.5 shrink-0"
        disabled={task.status === "missed"}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`font-medium text-sm sm:text-base ${
              task.status === "completed" ? "line-through text-muted-foreground" : "text-foreground"
            }`}
          >
            {task.topic}
          </span>
          <Badge variant="outline" className={`text-[10px] sm:text-xs ${priorityColor(task.priority)}`}>
            {task.priority}
          </Badge>
          {task.status === "missed" && (
            <Badge
              variant="outline"
              className="text-[10px] sm:text-xs bg-destructive/10 text-destructive border-destructive/20"
            >
              missed
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
          <span className="flex items-center gap-1">
            <BookOpen className="h-3 w-3 shrink-0" />
            {task.subject}
          </span>
          {task.estimated_time && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3 shrink-0" />
              {task.estimated_time}
            </span>
          )}
          {showDate && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3 shrink-0" />
              {format(parseISO(task.date), "EEE, MMM d")}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-sm text-muted-foreground flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading your study workspace...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <AppNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Top Header & Workload Optimizer Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Study Workspace</h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Verified active learning hours, adaptive scheduling, and ergonomic posture wellness.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate("/setup")}
              className="text-xs h-9 gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" /> Plan Syllabus
            </Button>
            {tasks.length > 0 && (
              <Button
                size="sm"
                onClick={optimizePlan}
                disabled={optimizing}
                className="text-xs h-9 gap-1.5 bg-primary text-primary-foreground shadow-sm"
              >
                {optimizing ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Balancing Schedule...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" /> Adaptive Balance
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Career Crash Simulator Hero Launchpad */}
        <Card className="glass-card border-primary/40 bg-gradient-to-r from-primary/15 via-card/70 to-purple-500/10 shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl -z-10 pointer-events-none" />
          <CardContent className="p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <Badge className="bg-primary/20 text-primary border-primary/30 text-xs font-semibold">
                  <Rocket className="h-3 w-3 mr-1" /> CAREER CRASH SIMULATOR
                </Badge>
                <span className="text-xs text-muted-foreground font-mono">Pre-Placement Diagnostic</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <span>Test Your Career Path Before Committing 6 Months</span>
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Experience the authentic day-to-day work, discover your failure points early, and fix preparation bottlenecks with StudyMind's cognitive learning engines.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 w-full md:w-auto">
              <Button
                onClick={() => navigate("/simulator")}
                className="w-full md:w-auto text-xs h-9 gap-2 bg-primary text-primary-foreground font-semibold shadow-sm hover:opacity-95"
              >
                <span>Launch Simulator</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards (Progress, Active vs Total Hours, Streak) */}
        <StatsCards
          progress={progress}
          completedCount={completedCount}
          totalTasks={tasks.length}
          todayTaskCount={todayTasks.length}
          todayStudyTime={todayTotal}
          todayActiveStudyTime={todayActiveTotal}
          weekStudyTime={weekTotal}
          currentStreak={streak.current_streak || 0}
        />

        {/* AI Daily Insight */}
        {(aiInsight || insightLoading) && (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-3.5 sm:p-4 flex items-start gap-3">
              <MessageCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-primary mb-0.5">AI Learning Insight</p>
                {insightLoading ? (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Loader2 className="h-3 w-3 animate-spin" /> Generating daily recommendation...
                  </div>
                ) : (
                  <p className="text-xs sm:text-sm text-foreground leading-relaxed">{aiInsight}</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Weak Topics Alert */}
        {weakTopics.length > 0 && (
          <Card className="border-destructive/30 bg-destructive/5">
            <CardHeader className="pb-2 pt-3 px-4">
              <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                Priority Knowledge Focus
              </CardTitle>
              <CardDescription className="text-xs">
                Recommended revision areas identified from your recent assessments
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-3">
              <div className="flex flex-wrap gap-2">
                {weakTopics.map((wt) =>
                  wt.topics.map((topic) => (
                    <Badge
                      key={`${wt.subject}-${topic}`}
                      variant="outline"
                      className="bg-destructive/10 text-destructive border-destructive/20 text-xs"
                    >
                      {wt.subject}: {topic}
                    </Badge>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Revisions Due (Spaced Repetition) */}
        {revisionsDue.length > 0 && (
          <Card className="border-warning/30 bg-warning/5">
            <CardHeader className="pb-2 pt-3 px-4">
              <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-warning" />
                Spaced Repetition Due Today ({revisionsDue.length})
              </CardTitle>
              <CardDescription className="text-xs">
                Review on schedule (Day 1 → 3 → 7 → 15) to convert short-term study into long-term recall
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 px-4 pb-4">
              {revisionsDue.map((rev) => (
                <div
                  key={rev.id}
                  className="flex items-center justify-between p-2.5 rounded-xl border bg-card gap-2"
                >
                  <div className="min-w-0">
                    <span className="font-medium text-sm">{rev.topic}</span>
                    {rev.subject && (
                      <span className="text-xs text-muted-foreground ml-1.5">({rev.subject})</span>
                    )}
                    <Badge variant="outline" className="ml-2 text-[10px]">
                      Cycle #{rev.revision_number}
                    </Badge>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => completeRevision(rev)}
                    className="text-xs h-7"
                  >
                    Done
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Main Grid: Smart Session on Left, Task Queue on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Smart Webcam Study Session Card */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <StudySessionCard
              activeSession={activeSession}
              subjects={uniqueSubjects}
              onStart={startSession}
              onEnd={endSession}
            />
          </div>

          {/* Right Column: Tasks Queue */}
          <div className="lg:col-span-2 order-1 lg:order-2 space-y-4">
            {tasks.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent className="space-y-3">
                  <Brain className="h-12 w-12 text-muted-foreground/30 mx-auto" />
                  <h3 className="text-lg font-semibold">No study schedule configured yet</h3>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    Input your subjects, syllabus, and exam date to generate an adaptive learning
                    calendar.
                  </p>
                  <Button onClick={() => navigate("/setup")} className="text-xs gap-1.5 mt-2">
                    <Plus className="h-3.5 w-3.5" /> Set Up Study Schedule
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Today's Tasks */}
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" /> Today's Focus Tasks
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {todayTasks.filter((t) => t.status === "completed").length}/{todayTasks.length} Completed
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 p-4 pt-1">
                    {todayTasks.length > 0 ? (
                      todayTasks.map((t) => <TaskItem key={t.id} task={t} />)
                    ) : (
                      <p className="text-xs text-muted-foreground py-4 text-center">
                        All set for today! 🎉
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Upcoming Tasks */}
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" /> Upcoming Tasks
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 p-4 pt-1">
                    {upcomingTasks.length > 0 ? (
                      upcomingTasks.map((t) => <TaskItem key={t.id} task={t} showDate />)
                    ) : (
                      <p className="text-xs text-muted-foreground py-4 text-center">
                        No upcoming tasks queued.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
