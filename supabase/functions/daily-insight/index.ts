import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = user.id;
    const today = new Date().toISOString().split("T")[0];

    const [tasksRes, sessionsRes, streakRes, revisionsRes] = await Promise.all([
      supabase.from("study_plan").select("*").eq("user_id", userId).eq("date", today),
      supabase.from("study_sessions").select("*").eq("user_id", userId).gte("start_time", `${today}T00:00:00`).not("duration", "is", null),
      supabase.from("streaks").select("*").eq("user_id", userId).single(),
      supabase.from("revisions").select("*").eq("user_id", userId).eq("status", "pending").lte("next_revision_date", today),
    ]);

    const todayTasks = (tasksRes.data || []) as any[];
    const todaySessions = (sessionsRes.data || []) as any[];
    const streak = streakRes.data as any;
    const revisionsDue = (revisionsRes.data || []) as any[];

    const completedToday = todayTasks.filter((t: any) => t.status === "completed").length;
    const totalToday = todayTasks.length;
    const totalStudyMinutes = Math.round(todaySessions.reduce((s: number, sess: any) => s + (sess.duration || 0), 0) / 60);
    const subjects = [...new Set(todayTasks.map((t: any) => t.subject))].join(", ");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          { role: "system", content: "You are a motivational study coach. Be concise, encouraging, and specific. Max 2-3 short sentences." },
          {
            role: "user",
            content: `Summarize this student's study day:
- Tasks: ${completedToday}/${totalToday} completed
- Study time: ${totalStudyMinutes} minutes
- Streak: ${streak?.current_streak || 0} days
- Subjects today: ${subjects || "None"}
- Revisions due: ${revisionsDue.length}
Give a brief motivational insight about their day.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      throw new Error("AI gateway error");
    }

    const aiData = await response.json();
    const insight = aiData.choices?.[0]?.message?.content || "Keep up the great work!";

    return new Response(JSON.stringify({ insight }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("daily-insight error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
