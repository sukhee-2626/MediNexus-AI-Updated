import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PatientData {
  full_name: string;
  date_of_birth: string;
  gender?: string;
  blood_type?: string;
  allergies?: string[];
  chronic_conditions?: string[];
  email?: string;
  phone?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const { patients } = await req.json() as { patients: PatientData[] };

    if (!patients || patients.length === 0) {
      return new Response(
        JSON.stringify({ error: "No patients provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const patientSummary = patients.map((p, i) => {
      const age = new Date().getFullYear() - new Date(p.date_of_birth).getFullYear();
      return `${i + 1}. ${p.full_name} - ${age} years old, ${p.gender || 'Not specified'}, Blood Type: ${p.blood_type || 'Unknown'}${p.chronic_conditions?.length ? `, Conditions: ${p.chronic_conditions.join(', ')}` : ''}${p.allergies?.length ? `, Allergies: ${p.allergies.join(', ')}` : ''}`;
    }).join('\n');

    const systemPrompt = `You are a medical data analyst AI assistant. Provide concise, professional summaries of patient cohort data for healthcare providers.

Your summary should include:
1. Overview statistics (total patients, age distribution, gender breakdown)
2. Common health patterns (blood types, chronic conditions, allergies)
3. Key insights and observations
4. Any notable trends or concerns

Keep the summary professional, concise, and actionable. Format with clear sections.`;

    const userPrompt = `Analyze and summarize the following patient cohort (${patients.length} patients):

${patientSummary}

Provide a comprehensive yet concise summary for healthcare providers.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage limit reached. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const summary = data.choices?.[0]?.message?.content || "Unable to generate summary.";

    return new Response(
      JSON.stringify({ summary }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in patient-summary function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
