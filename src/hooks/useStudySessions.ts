import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { startOfDay, startOfWeek, endOfDay, endOfWeek } from "date-fns";

export interface StudySession {
  id: string;
  user_id: string;
  start_time: string;
  end_time: string | null;
  duration: number | null;
  subject: string | null;
  monitoring_enabled?: boolean | null;
  active_duration?: number | null;
  paused_duration?: number | null;
  pause_events?: number | null;
  presence_ratio?: number | null;
  drowsiness_events?: number | null;
}

export interface EndSessionMetrics {
  activeDuration?: number;
  pausedDuration?: number;
  pauseEvents?: number;
  presenceRatio?: number;
  drowsinessEvents?: number;
}

interface Streak {
  current_streak: number;
  longest_streak: number;
  last_study_date: string | null;
}

export function useStudySessions() {
  const { user } = useAuth();
  const [activeSession, setActiveSession] = useState<StudySession | null>(null);
  const [todayTotal, setTodayTotal] = useState(0);
  const [todayActiveTotal, setTodayActiveTotal] = useState(0);
  const [weekTotal, setWeekTotal] = useState(0);
  const [streak, setStreak] = useState<Streak>({ current_streak: 0, longest_streak: 0, last_study_date: null });
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    if (!user) return;
    const now = new Date();
    const dayStart = startOfDay(now).toISOString();
    const dayEnd = endOfDay(now).toISOString();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 }).toISOString();
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 }).toISOString();

    const { data: active } = await supabase
      .from("study_sessions")
      .select("*")
      .eq("user_id", user.id)
      .is("end_time", null)
      .limit(1)
      .maybeSingle();

    setActiveSession(active as StudySession | null);

    let { data: todaySessions, error: todayError } = await supabase
      .from("study_sessions")
      .select("duration, active_duration")
      .eq("user_id", user.id)
      .gte("start_time", dayStart)
      .lte("start_time", dayEnd)
      .not("duration", "is", null);

    if (todayError && todayError.message?.includes("active_duration")) {
      const fallback = await supabase
        .from("study_sessions")
        .select("duration")
        .eq("user_id", user.id)
        .gte("start_time", dayStart)
        .lte("start_time", dayEnd)
        .not("duration", "is", null);
      todaySessions = fallback.data as any;
    }

    const todayList = (todaySessions as any[]) || [];
    setTodayTotal(todayList.reduce((sum, s) => sum + (s.duration || 0), 0));
    setTodayActiveTotal(
      todayList.reduce((sum, s) => sum + (s.active_duration ?? s.duration ?? 0), 0)
    );

    const { data: weekSessions } = await supabase
      .from("study_sessions")
      .select("duration")
      .eq("user_id", user.id)
      .gte("start_time", weekStart)
      .lte("start_time", weekEnd)
      .not("duration", "is", null);

    setWeekTotal(((weekSessions as any[]) || []).reduce((sum, s) => sum + (s.duration || 0), 0));

    const { data: streakData } = await supabase
      .from("streaks")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (streakData) {
      setStreak(streakData as Streak);
    }

    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const startSession = async (subject?: string, monitoringEnabled = false) => {
    if (!user) return;
    let { data, error } = await supabase
      .from("study_sessions")
      .insert({
        user_id: user.id,
        subject: subject || null,
        monitoring_enabled: monitoringEnabled,
      } as any)
      .select()
      .single();

    // If remote database does not have the 'monitoring_enabled' column in schema cache yet,
    // gracefully fall back to base insert so session starts without interruption.
    if (
      error &&
      (error.message?.includes("monitoring_enabled") ||
        error.code === "PGRST204" ||
        error.code === "42703")
    ) {
      const fallback = await supabase
        .from("study_sessions")
        .insert({
          user_id: user.id,
          subject: subject || null,
        } as any)
        .select()
        .single();
      data = fallback.data;
      error = fallback.error;
    }

    if (error) {
      toast({ title: "Error starting session", description: error.message, variant: "destructive" });
      return;
    }

    const sessionObj: StudySession = {
      ...(data as StudySession),
      monitoring_enabled: monitoringEnabled,
    };
    setActiveSession(sessionObj);
    toast({
      title: "Study session started! 📚",
      description: subject ? `Studying: ${subject}` : "Let's go!",
    });
  };

  const endSession = async (metrics?: EndSessionMetrics) => {
    if (!user || !activeSession) return;
    const endTime = new Date();
    const startTime = new Date(activeSession.start_time);
    const duration = Math.round((endTime.getTime() - startTime.getTime()) / 1000);
    const active_duration = metrics?.activeDuration ?? duration;
    const paused_duration = metrics?.pausedDuration ?? 0;
    const pause_events = metrics?.pauseEvents ?? 0;
    const presence_ratio =
      metrics?.presenceRatio ?? (duration > 0 ? active_duration / duration : 1.0);
    const drowsiness_events = metrics?.drowsinessEvents ?? 0;

    let { error } = await supabase
      .from("study_sessions")
      .update({
        end_time: endTime.toISOString(),
        duration,
        active_duration,
        paused_duration,
        pause_events,
        presence_ratio,
        drowsiness_events,
      } as any)
      .eq("id", activeSession.id);

    // If remote schema has not been migrated with the new columns yet, fall back to base columns
    if (
      error &&
      (error.message?.includes("column") ||
        error.code === "PGRST204" ||
        error.code === "42703")
    ) {
      const fallback = await supabase
        .from("study_sessions")
        .update({
          end_time: endTime.toISOString(),
          duration,
        } as any)
        .eq("id", activeSession.id);
      error = fallback.error;
    }

    if (error) {
      toast({ title: "Error ending session", description: error.message, variant: "destructive" });
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    const { data: existingStreak } = await supabase
      .from("streaks")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existingStreak) {
      const lastDate = existingStreak.last_study_date;
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
      let newStreak = existingStreak.current_streak;

      if (lastDate === today) {
        // Already studied today
      } else if (lastDate === yesterday) {
        newStreak += 1;
      } else {
        newStreak = 1;
      }

      const longest = Math.max(newStreak, existingStreak.longest_streak);
      await supabase
        .from("streaks")
        .update({ current_streak: newStreak, longest_streak: longest, last_study_date: today } as any)
        .eq("user_id", user.id);
    } else {
      await supabase
        .from("streaks")
        .insert({ user_id: user.id, current_streak: 1, longest_streak: 1, last_study_date: today } as any);
    }

    setActiveSession(null);
    toast({
      title: "Session ended! ✅",
      description: `Active Study Time: ${formatDuration(active_duration)} (Total: ${formatDuration(duration)})`,
    });
    await fetchStats();
  };

  return {
    activeSession,
    todayTotal,
    todayActiveTotal,
    weekTotal,
    streak,
    loading,
    startSession,
    endSession,
    fetchStats,
  };
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const hrs = Math.floor(mins / 60);
  if (hrs > 0) return `${hrs}h ${mins % 60}m`;
  return `${mins}m`;
}
