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
    const { messages, patientId } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let patientContext = "";
    
    if (patientId) {
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

      if (patient) {
        patientContext = `
Patient Context:
- Name: ${patient.full_name}
- Age: ${new Date().getFullYear() - new Date(patient.date_of_birth).getFullYear()}
- Gender: ${patient.gender || "Not specified"}
- Blood Type: ${patient.blood_type || "Unknown"}
- Allergies: ${patient.allergies?.join(", ") || "None reported"}
- Chronic Conditions: ${patient.chronic_conditions?.join(", ") || "None reported"}
`;
      }
    }

    const systemPrompt = `You are a helpful medical AI assistant for the MediLedger healthcare platform. 
You provide general health information, answer questions about medical conditions, and help patients understand their health.

Important guidelines:
- Always recommend consulting a healthcare provider for specific medical advice
- Be empathetic and supportive
- Provide accurate, evidence-based information
- If asked about emergencies, always recommend calling emergency services

${patientContext}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages
        ],
        stream: true,
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

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error: unknown) {
    console.error("Error in ai-chat:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
