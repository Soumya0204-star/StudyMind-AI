import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { type, topic, subject, user_text } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    let systemPrompt = "";
    let userPrompt = "";

    if (type === "feynman") {
      systemPrompt = "You are a Feynman Technique evaluator. Assess the student's explanation and provide constructive feedback. Return structured JSON.";
      userPrompt = `Evaluate this explanation of "${topic}":

"${user_text}"

Assess:
- Simplicity (1-10): Is it explained in simple terms?
- Accuracy (1-10): Is the explanation correct?
- Completeness (1-10): Are key concepts covered?
- Missing concepts: What important points are missing?
- Suggestions: How can they improve their understanding?`;
    } else if (type === "blurting") {
      systemPrompt = "You are a knowledge gap analyzer using the Blurting Method. Compare what the student remembers with what they should know. Return structured JSON.";
      userPrompt = `The student was asked to write everything they remember about "${topic}"${subject ? ` (${subject})` : ""}.

They wrote:
"${user_text}"

Analyze:
- What key concepts did they remember correctly?
- What important concepts are missing?
- What was inaccurate?
- Overall retention score (1-10)
- Study recommendations`;
    } else {
      throw new Error("Invalid type. Use 'feynman' or 'blurting'.");
    }

    const tools = type === "feynman" ? [
      {
        type: "function",
        function: {
          name: "return_evaluation",
          description: "Return Feynman technique evaluation",
          parameters: {
            type: "object",
            properties: {
              simplicity: { type: "number" },
              accuracy: { type: "number" },
              completeness: { type: "number" },
              missing_concepts: { type: "array", items: { type: "string" } },
              strengths: { type: "array", items: { type: "string" } },
              suggestions: { type: "array", items: { type: "string" } },
              overall_feedback: { type: "string" }
            },
            required: ["simplicity", "accuracy", "completeness", "missing_concepts", "strengths", "suggestions", "overall_feedback"],
            additionalProperties: false
          }
        }
      }
    ] : [
      {
        type: "function",
        function: {
          name: "return_analysis",
          description: "Return blurting method analysis",
          parameters: {
            type: "object",
            properties: {
              remembered_correctly: { type: "array", items: { type: "string" } },
              missing_concepts: { type: "array", items: { type: "string" } },
              inaccuracies: { type: "array", items: { type: "string" } },
              retention_score: { type: "number" },
              recommendations: { type: "array", items: { type: "string" } },
              overall_feedback: { type: "string" }
            },
            required: ["remembered_correctly", "missing_concepts", "inaccuracies", "retention_score", "recommendations", "overall_feedback"],
            additionalProperties: false
          }
        }
      }
    ];

    const toolChoice = type === "feynman"
      ? { type: "function", function: { name: "return_evaluation" } }
      : { type: "function", function: { name: "return_analysis" } };

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        tools,
        tool_choice: toolChoice
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
    const result = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("evaluate-technique error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
