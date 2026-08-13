import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("AI service is not configured");
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    const { patientId } = await req.json();

    console.log(`Generating health insights for patient: ${patientId}`);

    // Fetch patient data
    const { data: patient, error: patientError } = await supabase
      .from("patients")
      .select("*")
      .eq("id", patientId)
      .single();

    if (patientError || !patient) {
      return new Response(
        JSON.stringify({ error: "Patient not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch medical records
    const { data: records } = await supabase
      .from("medical_records")
      .select("*")
      .eq("patient_id", patientId)
      .order("created_at", { ascending: false })
      .limit(20);

    // Fetch AI diagnostics
    const { data: diagnostics } = await supabase
      .from("ai_diagnostics")
      .select("*")
      .eq("patient_id", patientId)
      .order("created_at", { ascending: false })
      .limit(10);

    const age = new Date().getFullYear() - new Date(patient.date_of_birth).getFullYear();

    const patientContext = {
      demographics: {
        age,
        gender: patient.gender,
        bloodType: patient.blood_type,
      },
      allergies: patient.allergies || [],
      chronicConditions: patient.chronic_conditions || [],
      recordsSummary: {
        total: records?.length || 0,
        types: records?.reduce((acc: Record<string, number>, r) => {
          acc[r.record_type] = (acc[r.record_type] || 0) + 1;
          return acc;
        }, {}) || {},
        recentDiagnoses: records?.filter(r => r.diagnosis).slice(0, 5).map(r => ({
          diagnosis: r.diagnosis,
          date: r.created_at,
          treatment: r.treatment
        })) || [],
        medications: records?.flatMap(r => {
          if (r.medications && typeof r.medications === 'object') {
            return Array.isArray(r.medications) ? r.medications : [r.medications];
          }
          return [];
        }) || [],
      },
      aiDiagnosticsCount: diagnostics?.length || 0,
    };

    const systemPrompt = `You are a personalized healthcare insights AI. Analyze patient data to provide tailored health insights, preventive recommendations, and wellness tips. Be empathetic and actionable.`;

    const userPrompt = `Generate personalized health insights for this patient:
${JSON.stringify(patientContext, null, 2)}

Return as JSON:
{
  "personalizedInsights": [{"insight": "string", "category": "lifestyle"|"preventive"|"medication"|"monitoring", "priority": "high"|"medium"|"low"}],
  "riskFactors": [{"factor": "string", "riskLevel": "high"|"medium"|"low", "recommendation": "string"}],
  "preventiveCare": [{"recommendation": "string", "frequency": "string", "importance": "string"}],
  "lifestyleSuggestions": ["string"],
  "medicationReminders": ["string"],
  "nextSteps": ["string"],
  "overallHealthScore": number (1-100),
  "healthSummary": "string"
}`;

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
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error("AI service error");
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content;

    let parsedResponse;
    try {
      const cleaned = aiResponse.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsedResponse = JSON.parse(cleaned);
    } catch {
      parsedResponse = { rawResponse: aiResponse };
    }

    console.log("Health insights generated successfully");

    return new Response(
      JSON.stringify({
        success: true,
        patientId,
        insights: parsedResponse,
        model: "google/gemini-2.5-flash",
        timestamp: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in health-insights function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "An error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
