import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { subject, marks, totalMarks, weakTopics } = await req.json();

    if (!subject || marks === undefined || totalMarks === undefined) {
      return new Response(JSON.stringify({ error: "subject, marks, and totalMarks are required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const percentage = ((marks / totalMarks) * 100).toFixed(1);

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
            content: "You are an expert academic performance analyst. Provide actionable, encouraging feedback to help students improve."
          },
          {
            role: "user",
            content: `Analyze this exam performance:

Subject: ${subject}
Marks: ${marks}/${totalMarks} (${percentage}%)
${weakTopics?.length ? `Weak Topics: ${weakTopics.join(", ")}` : "No specific weak topics provided"}

Identify:
- Weak areas and why they might be weak
- Strong areas to build upon
- Mistake patterns:
  - Conceptual errors
  - Silly/careless mistakes
  - Time management issues
- Specific improvement suggestions with actionable steps`
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "return_analysis",
              description: "Return structured performance analysis",
              parameters: {
                type: "object",
                properties: {
                  overall_assessment: { type: "string", description: "Brief overall assessment of performance" },
                  score_category: { type: "string", enum: ["excellent", "good", "average", "needs_improvement", "critical"] },
                  weak_areas: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        area: { type: "string" },
                        reason: { type: "string" }
                      },
                      required: ["area", "reason"],
                      additionalProperties: false
                    }
                  },
                  strong_areas: {
                    type: "array",
                    items: { type: "string" }
                  },
                  mistake_patterns: {
                    type: "object",
                    properties: {
                      conceptual_errors: { type: "array", items: { type: "string" } },
                      careless_mistakes: { type: "array", items: { type: "string" } },
                      time_management: { type: "array", items: { type: "string" } }
                    },
                    required: ["conceptual_errors", "careless_mistakes", "time_management"],
                    additionalProperties: false
                  },
                  improvement_suggestions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        suggestion: { type: "string" },
                        priority: { type: "string", enum: ["high", "medium", "low"] }
                      },
                      required: ["suggestion", "priority"],
                      additionalProperties: false
                    }
                  }
                },
                required: ["overall_assessment", "score_category", "weak_areas", "strong_areas", "mistake_patterns", "improvement_suggestions"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "return_analysis" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again shortly." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      const t = await response.text();
      console.error("AI error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    const analysis = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-performance error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
