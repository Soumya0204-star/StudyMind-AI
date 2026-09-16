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

    // 1. Detect triggers - fetch data in parallel
    const [tasksRes, performanceRes, sessionsRes] = await Promise.all([
      supabase
        .from("study_plan")
        .select("*")
        .eq("user_id", userId)
        .order("date", { ascending: true }),
      supabase
        .from("performance")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(10),
      supabase
        .from("study_sessions")
        .select("*")
        .eq("user_id", userId)
        .order("start_time", { ascending: false })
        .limit(30),
    ]);

    const allTasks = (tasksRes.data || []) as any[];
    const performanceRecords = (performanceRes.data || []) as any[];
    const sessions = (sessionsRes.data || []) as any[];

    // Detect missed tasks (past date, still pending)
    const missedTasks = allTasks.filter(
      (t: any) => t.date < today && t.status === "pending"
    );

    // Detect weak subjects from performance
    const weakSubjects = performanceRecords
      .filter((p: any) => p.ai_analysis?.score_category === "critical" || p.ai_analysis?.score_category === "needs_improvement")
      .map((p: any) => ({
        subject: p.subject,
        marks: p.marks,
        total_marks: p.total_marks,
        weak_areas: p.ai_analysis?.weak_areas || [],
      }));

    // Calculate average daily total and actual ACTIVE study time (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const recentSessions = sessions.filter(
      (s: any) => new Date(s.start_time) >= weekAgo && s.duration
    );
    const avgDailyTotalMinutes = recentSessions.length > 0
      ? (recentSessions.reduce((sum: number, s: any) => sum + (s.duration || 0), 0) / 7) / 60
      : 0;
    const avgDailyActiveMinutes = recentSessions.length > 0
      ? (recentSessions.reduce((sum: number, s: any) => sum + (s.active_duration ?? s.duration ?? 0), 0) / 7) / 60
      : 0;
    const monitoredSessions = recentSessions.filter((s: any) => s.monitoring_enabled);
    const avgPresenceRatio = monitoredSessions.length > 0
      ? (monitoredSessions.reduce((sum: number, s: any) => sum + (s.presence_ratio ?? 1), 0) / monitoredSessions.length) * 100
      : null;

    // Future pending tasks that can be adjusted
    const futurePendingTasks = allTasks.filter(
      (t: any) => t.date >= today && t.status === "pending"
    );

    if (futurePendingTasks.length === 0) {
      return new Response(JSON.stringify({
        message: "No future tasks to optimize. Create a new study plan first.",
        changes: 0,
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // 2. Call AI for plan adjustment
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const subjects = [...new Set(futurePendingTasks.map((t: any) => t.subject))];

    const prompt = `You are an adaptive study plan optimizer. Analyze the student's data and rebalance their upcoming study tasks.

CURRENT DATA:
- Missed tasks (${missedTasks.length}): ${missedTasks.length > 0 ? missedTasks.map((t: any) => `${t.topic} (${t.subject}, ${t.date})`).join("; ") : "None"}
- Weak subjects: ${weakSubjects.length > 0 ? weakSubjects.map((w: any) => `${w.subject}: ${w.marks}/${w.total_marks}`).join("; ") : "None identified"}
- Observed active study capacity: ${Math.round(avgDailyActiveMinutes)} active minutes/day (Total session duration: ${Math.round(avgDailyTotalMinutes)} min/day)${avgPresenceRatio !== null ? `, average desk presence ratio: ${Math.round(avgPresenceRatio)}%` : ""}
- Subjects: ${subjects.join(", ")}

UPCOMING TASKS TO OPTIMIZE (${futurePendingTasks.length} tasks):
${futurePendingTasks.map((t: any) => `- ID: ${t.id} | Date: ${t.date} | Subject: ${t.subject} | Topic: ${t.topic} | Priority: ${t.priority} | Est. Time: ${t.estimated_time || "unknown"}`).join("\n")}

Instructions:
- Increase priority for weak subjects and missed topics
- Redistribute topics for better spacing (interleaving)
- Adjust estimated time based on observed study capacity (${Math.round(avgDailyActiveMinutes)} active min/day) to prevent burnout
- Reschedule missed task topics into future dates
- Keep the same task IDs, only modify priority and estimated_time
- Return ONLY the tasks that need changes`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are an intelligent study plan optimizer." },
          { role: "user", content: prompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "return_adjustments",
              description: "Return optimized task adjustments and a summary",
              parameters: {
                type: "object",
                properties: {
                  summary: { type: "string", description: "Brief explanation of what was changed and why" },
                  adjustments: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        task_id: { type: "string" },
                        new_priority: { type: "string", enum: ["easy", "medium", "hard"] },
                        new_estimated_time: { type: "string", description: "e.g. 45 min, 1 hour" },
                      },
                      required: ["task_id", "new_priority", "new_estimated_time"],
                      additionalProperties: false,
                    },
                  },
                  new_tasks: {
                    type: "array",
                    description: "New tasks to add (e.g. rescheduled missed topics)",
                    items: {
                      type: "object",
                      properties: {
                        date: { type: "string", description: "YYYY-MM-DD" },
                        subject: { type: "string" },
                        topic: { type: "string" },
                        priority: { type: "string", enum: ["easy", "medium", "hard"] },
                        estimated_time: { type: "string" },
                      },
                      required: ["date", "subject", "topic", "priority", "estimated_time"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["summary", "adjustments", "new_tasks"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "return_adjustments" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const aiData = await response.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    const result = JSON.parse(toolCall.function.arguments);

    // 3. Apply adjustments
    let changeCount = 0;

    // Update existing tasks
    for (const adj of result.adjustments) {
      const validTask = futurePendingTasks.find((t: any) => t.id === adj.task_id);
      if (!validTask) continue;

      const { error } = await supabase
        .from("study_plan")
        .update({
          priority: adj.new_priority,
          estimated_time: adj.new_estimated_time,
        })
        .eq("id", adj.task_id)
        .eq("user_id", userId);

      if (!error) changeCount++;
    }

    // Insert new tasks (rescheduled missed topics)
    if (result.new_tasks?.length > 0) {
      const newRows = result.new_tasks.map((t: any) => ({
        user_id: userId,
        date: t.date,
        subject: t.subject,
        topic: t.topic,
        priority: t.priority,
        estimated_time: t.estimated_time,
        status: "pending",
      }));

      const { error } = await supabase.from("study_plan").insert(newRows);
      if (!error) changeCount += newRows.length;
    }

    // Mark missed tasks as "missed"
    if (missedTasks.length > 0) {
      const missedIds = missedTasks.map((t: any) => t.id);
      await supabase
        .from("study_plan")
        .update({ status: "missed" })
        .in("id", missedIds)
        .eq("user_id", userId);
    }

    return new Response(JSON.stringify({
      summary: result.summary,
      changes: changeCount,
      missed_marked: missedTasks.length,
      new_tasks_added: result.new_tasks?.length || 0,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("adapt-study-plan error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
