import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { subjects, syllabus, exam_date } = await req.json();

    if (!subjects?.length || !syllabus || !exam_date) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: subjects, syllabus, exam_date" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const today = new Date().toISOString().split("T")[0];

    const prompt = `Generate a personalized study plan based on:

Subjects: ${subjects.join(", ")}
Syllabus: ${syllabus}
Today's Date: ${today}
Exam Date: ${exam_date}

Requirements:
- Break into daily tasks from today until the exam date
- Assign topic priority: "easy", "medium", or "hard"
- Allocate estimated_time per topic (e.g. "30 min", "1 hr", "1.5 hrs")
- Ensure full syllabus coverage before exam
- Mix subjects across days (interleaving)
- Schedule harder topics earlier in the plan
- Keep each day manageable (3-5 tasks max)

You MUST respond with ONLY a valid JSON array, no other text. Each item must have exactly these fields:
[
  {
    "date": "YYYY-MM-DD",
    "subject": "subject name",
    "topic": "specific topic",
    "priority": "easy|medium|hard",
    "estimated_time": "time string"
  }
]`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: "You are a study planning AI. You output ONLY valid JSON arrays. No markdown, no explanation, no code blocks. Just the raw JSON array.",
          },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds in Settings." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errText = await response.text();
      console.error("AI Gateway error:", response.status, errText);
      throw new Error(`AI gateway returned ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    let planJson: string = content.trim();
    if (planJson.startsWith("```")) {
      planJson = planJson.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    const plan = JSON.parse(planJson);

    if (!Array.isArray(plan)) {
      throw new Error("AI response is not a JSON array");
    }

    return new Response(
      JSON.stringify({ plan }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error generating study plan:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
