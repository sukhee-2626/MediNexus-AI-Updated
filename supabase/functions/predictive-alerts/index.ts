import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { patientId } = await req.json();
    
    if (!patientId) {
      return new Response(
        JSON.stringify({ error: "Patient ID is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Fetch patient data
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const patientRes = await fetch(`${supabaseUrl}/rest/v1/patients?id=eq.${patientId}`, {
      headers: {
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`,
      },
    });
    const patients = await patientRes.json();
    const patient = patients[0];

    const recordsRes = await fetch(`${supabaseUrl}/rest/v1/medical_records?patient_id=eq.${patientId}&order=created_at.desc&limit=10`, {
      headers: {
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`,
      },
    });
    const records = await recordsRes.json();

    const prompt = `Analyze this patient's health data and generate predictive health alerts.

Patient Information:
- Name: ${patient?.full_name || "Unknown"}
- Age: ${patient?.date_of_birth ? new Date().getFullYear() - new Date(patient.date_of_birth).getFullYear() : "Unknown"}
- Gender: ${patient?.gender || "Unknown"}
- Blood Type: ${patient?.blood_type || "Unknown"}
- Allergies: ${patient?.allergies?.join(", ") || "None reported"}
- Chronic Conditions: ${patient?.chronic_conditions?.join(", ") || "None reported"}

Recent Medical Records:
${records.map((r: any) => `- ${r.title} (${r.record_type}): ${r.diagnosis || r.description || "No details"}`).join("\n")}

Generate 1-3 health alerts based on this patient's profile. For each alert, provide:
1. A clear, actionable title
2. Severity (low, medium, high, or critical)
3. Description of the health concern
4. Specific recommendation

Focus on:
- Preventive care needs based on age and conditions
- Medication interactions or concerns
- Lifestyle recommendations
- Follow-up care reminders

Return as JSON array with objects containing: alert_type, severity, title, description, recommendations`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are a medical AI assistant specialized in preventive care and health risk assessment. Return only valid JSON." },
          { role: "user", content: prompt }
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
          JSON.stringify({ error: "AI credits exhausted. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "[]";
    
    // Parse the AI response
    let alerts = [];
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        alerts = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error("Failed to parse AI response:", e);
      alerts = [{
        alert_type: "general",
        severity: "low",
        title: "Health Check Recommended",
        description: "Consider scheduling a routine health checkup.",
        recommendations: "Visit your healthcare provider for a comprehensive wellness exam."
      }];
    }

    // Insert alerts into database
    for (const alert of alerts) {
      await fetch(`${supabaseUrl}/rest/v1/health_alerts`, {
        method: "POST",
        headers: {
          "apikey": supabaseKey,
          "Authorization": `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
          "Prefer": "return=minimal"
        },
        body: JSON.stringify({
          patient_id: patientId,
          alert_type: alert.alert_type || "general",
          severity: alert.severity || "low",
          title: alert.title,
          description: alert.description,
          recommendations: alert.recommendations,
          generated_by: "ai"
        })
      });
    }

    return new Response(
      JSON.stringify({ success: true, alertsGenerated: alerts.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error in predictive-alerts:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
