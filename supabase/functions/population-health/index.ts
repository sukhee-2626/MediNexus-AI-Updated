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

    console.log("Generating population health analysis");

    // Fetch comprehensive data
    const [patientsRes, recordsRes] = await Promise.all([
      supabase.from("patients").select("*").limit(500),
      supabase.from("medical_records").select("*").limit(1000),
    ]);

    const patients = patientsRes.data || [];
    const records = recordsRes.data || [];

    // Build population health metrics
    const populationData = {
      totalPopulation: patients.length,
      demographics: {
        ageDistribution: patients.reduce((acc: Record<string, number>, p) => {
          const age = new Date().getFullYear() - new Date(p.date_of_birth).getFullYear();
          const group = age < 18 ? "Pediatric (0-17)" : age < 35 ? "Young Adult (18-34)" : 
                       age < 50 ? "Middle Age (35-49)" : age < 65 ? "Pre-Senior (50-64)" : "Senior (65+)";
          acc[group] = (acc[group] || 0) + 1;
          return acc;
        }, {}),
        genderDistribution: patients.reduce((acc: Record<string, number>, p) => {
          acc[p.gender || "Not specified"] = (acc[p.gender || "Not specified"] || 0) + 1;
          return acc;
        }, {}),
        bloodTypeDistribution: patients.reduce((acc: Record<string, number>, p) => {
          acc[p.blood_type || "Unknown"] = (acc[p.blood_type || "Unknown"] || 0) + 1;
          return acc;
        }, {}),
      },
      chronicConditions: {
        prevalence: patients.flatMap(p => p.chronic_conditions || []).reduce((acc: Record<string, number>, c) => {
          acc[c] = (acc[c] || 0) + 1;
          return acc;
        }, {}),
        patientsWithConditions: patients.filter(p => p.chronic_conditions?.length > 0).length,
      },
      allergies: {
        common: patients.flatMap(p => p.allergies || []).reduce((acc: Record<string, number>, a) => {
          acc[a] = (acc[a] || 0) + 1;
          return acc;
        }, {}),
        patientsWithAllergies: patients.filter(p => p.allergies?.length > 0).length,
      },
      recordMetrics: {
        totalRecords: records.length,
        recordTypeBreakdown: records.reduce((acc: Record<string, number>, r) => {
          acc[r.record_type] = (acc[r.record_type] || 0) + 1;
          return acc;
        }, {}),
        recordsPerPatient: patients.length > 0 ? (records.length / patients.length).toFixed(1) : 0,
      },
      diagnosisPatterns: records.filter(r => r.diagnosis).reduce((acc: Record<string, number>, r) => {
        const diag = r.diagnosis?.toLowerCase().trim() || "";
        if (diag) acc[diag] = (acc[diag] || 0) + 1;
        return acc;
      }, {}),
    };

    const systemPrompt = `You are a public health analytics AI. Analyze population health data to identify trends, disparities, and actionable insights for healthcare administrators and public health officials.`;

    const userPrompt = `Analyze this population health data and provide comprehensive insights:
${JSON.stringify(populationData, null, 2)}

Return as JSON:
{
  "populationHealthScore": number (1-100),
  "executiveSummary": "string",
  "demographicInsights": [{"insight": "string", "implication": "string"}],
  "chronicDiseaseAnalysis": {"summary": "string", "topConditions": [{"condition": "string", "prevalence": "string", "recommendation": "string"}]},
  "riskStratification": {"highRisk": number, "mediumRisk": number, "lowRisk": number, "factors": ["string"]},
  "healthDisparities": [{"disparity": "string", "affectedGroup": "string", "recommendation": "string"}],
  "resourceRecommendations": [{"resource": "string", "priority": "high"|"medium"|"low", "rationale": "string"}],
  "preventivePrograms": [{"program": "string", "targetPopulation": "string", "expectedImpact": "string"}],
  "keyPerformanceIndicators": [{"kpi": "string", "currentValue": "string", "target": "string", "status": "on-track"|"needs-attention"|"critical"}]
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

    console.log("Population health analysis completed");

    return new Response(
      JSON.stringify({
        success: true,
        analysis: parsedResponse,
        dataSnapshot: populationData,
        model: "google/gemini-2.5-flash",
        timestamp: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in population-health function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "An error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
