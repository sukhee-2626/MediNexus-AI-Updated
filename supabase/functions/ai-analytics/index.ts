import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AnalyticsRequest {
  analysisType: "trends" | "predictions" | "anomalies" | "summary";
  dateRange?: { start: string; end: string };
}

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
    const { analysisType, dateRange }: AnalyticsRequest = await req.json();

    console.log(`Processing AI analytics: ${analysisType}`);

    // Fetch data for analysis
    const [patientsRes, recordsRes, diagnosticsRes, consentsRes] = await Promise.all([
      supabase.from("patients").select("*").order("created_at", { ascending: false }).limit(100),
      supabase.from("medical_records").select("*").order("created_at", { ascending: false }).limit(200),
      supabase.from("ai_diagnostics").select("*").order("created_at", { ascending: false }).limit(50),
      supabase.from("consent_grants").select("*").eq("status", "active"),
    ]);

    const patients = patientsRes.data || [];
    const records = recordsRes.data || [];
    const diagnostics = diagnosticsRes.data || [];
    const consents = consentsRes.data || [];

    // Build analysis context
    const dataContext = {
      totalPatients: patients.length,
      totalRecords: records.length,
      totalDiagnostics: diagnostics.length,
      activeConsents: consents.length,
      recordTypes: records.reduce((acc: Record<string, number>, r) => {
        acc[r.record_type] = (acc[r.record_type] || 0) + 1;
        return acc;
      }, {}),
      patientAgeGroups: patients.reduce((acc: Record<string, number>, p) => {
        const age = new Date().getFullYear() - new Date(p.date_of_birth).getFullYear();
        const group = age < 18 ? "0-17" : age < 35 ? "18-34" : age < 50 ? "35-49" : age < 65 ? "50-64" : "65+";
        acc[group] = (acc[group] || 0) + 1;
        return acc;
      }, {}),
      genderDistribution: patients.reduce((acc: Record<string, number>, p) => {
        acc[p.gender || "Unknown"] = (acc[p.gender || "Unknown"] || 0) + 1;
        return acc;
      }, {}),
      recentActivityDays: 7,
      commonDiagnoses: records.filter(r => r.diagnosis).slice(0, 10).map(r => r.diagnosis),
      commonAllergies: patients.flatMap(p => p.allergies || []).reduce((acc: Record<string, number>, a) => {
        acc[a] = (acc[a] || 0) + 1;
        return acc;
      }, {}),
      chronicConditions: patients.flatMap(p => p.chronic_conditions || []).reduce((acc: Record<string, number>, c) => {
        acc[c] = (acc[c] || 0) + 1;
        return acc;
      }, {}),
    };

    let systemPrompt = "";
    let userPrompt = "";

    switch (analysisType) {
      case "trends":
        systemPrompt = `You are a healthcare analytics AI that identifies trends in patient data. Analyze patterns and provide actionable insights for healthcare providers. Be concise but thorough.`;
        userPrompt = `Analyze these healthcare metrics and identify key trends:
${JSON.stringify(dataContext, null, 2)}

Provide analysis as JSON:
{
  "keyTrends": [{"trend": "string", "impact": "positive"|"negative"|"neutral", "details": "string"}],
  "patientDemographics": {"summary": "string", "insights": ["string"]},
  "recordPatterns": {"summary": "string", "recommendations": ["string"]},
  "overallHealth": "string"
}`;
        break;

      case "predictions":
        systemPrompt = `You are a predictive healthcare analytics AI. Based on current data patterns, forecast future trends and potential needs. Focus on actionable predictions.`;
        userPrompt = `Based on current healthcare data, provide predictions:
${JSON.stringify(dataContext, null, 2)}

Return as JSON:
{
  "shortTermPredictions": [{"prediction": "string", "confidence": "high"|"medium"|"low", "timeframe": "string"}],
  "resourceNeeds": [{"resource": "string", "projectedNeed": "string", "priority": "high"|"medium"|"low"}],
  "riskAreas": [{"area": "string", "riskLevel": "high"|"medium"|"low", "mitigation": "string"}],
  "growthProjections": {"patients": "string", "records": "string"}
}`;
        break;

      case "anomalies":
        systemPrompt = `You are a healthcare data analyst AI that detects anomalies and unusual patterns. Flag potential issues and suggest investigations.`;
        userPrompt = `Analyze this healthcare data for anomalies:
${JSON.stringify(dataContext, null, 2)}

Return as JSON:
{
  "anomalies": [{"type": "string", "description": "string", "severity": "critical"|"warning"|"info", "recommendation": "string"}],
  "dataQualityIssues": [{"issue": "string", "affectedArea": "string", "suggestion": "string"}],
  "unusualPatterns": [{"pattern": "string", "possibleCause": "string"}]
}`;
        break;

      case "summary":
      default:
        systemPrompt = `You are a healthcare executive summary AI. Provide concise, actionable summaries of healthcare data for decision-makers.`;
        userPrompt = `Generate an executive summary of this healthcare data:
${JSON.stringify(dataContext, null, 2)}

Return as JSON:
{
  "executiveSummary": "string (2-3 sentences)",
  "keyMetrics": [{"metric": "string", "value": "string", "status": "good"|"warning"|"critical"}],
  "actionItems": [{"action": "string", "priority": "high"|"medium"|"low", "impact": "string"}],
  "highlights": ["string"],
  "recommendations": ["string"]
}`;
        break;
    }

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
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage limit reached." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error("AI service temporarily unavailable");
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

    console.log(`AI analytics completed: ${analysisType}`);

    return new Response(
      JSON.stringify({
        success: true,
        analysisType,
        analysis: parsedResponse,
        dataSnapshot: {
          totalPatients: dataContext.totalPatients,
          totalRecords: dataContext.totalRecords,
          totalDiagnostics: dataContext.totalDiagnostics,
        },
        model: "google/gemini-2.5-flash",
        timestamp: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in ai-analytics function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "An error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
