import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface DiagnosticRequest {
  symptoms: string[];
  patientAge?: number;
  patientGender?: string;
  medicalHistory?: string[];
  vitalSigns?: {
    temperature?: number;
    bloodPressure?: string;
    heartRate?: number;
    respiratoryRate?: number;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("AI service is not configured");
    }

    const { symptoms, patientAge, patientGender, medicalHistory, vitalSigns }: DiagnosticRequest = await req.json();

    if (!symptoms || symptoms.length === 0) {
      return new Response(
        JSON.stringify({ error: "Symptoms are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Processing diagnostic request for symptoms:", symptoms);

    // Build context from patient information
    let patientContext = "";
    if (patientAge) patientContext += `Patient age: ${patientAge} years. `;
    if (patientGender) patientContext += `Gender: ${patientGender}. `;
    if (medicalHistory && medicalHistory.length > 0) {
      patientContext += `Medical history: ${medicalHistory.join(", ")}. `;
    }
    if (vitalSigns) {
      const vitals = [];
      if (vitalSigns.temperature) vitals.push(`Temperature: ${vitalSigns.temperature}°C`);
      if (vitalSigns.bloodPressure) vitals.push(`BP: ${vitalSigns.bloodPressure}`);
      if (vitalSigns.heartRate) vitals.push(`Heart rate: ${vitalSigns.heartRate} bpm`);
      if (vitalSigns.respiratoryRate) vitals.push(`Respiratory rate: ${vitalSigns.respiratoryRate}/min`);
      if (vitals.length > 0) patientContext += `Vital signs: ${vitals.join(", ")}. `;
    }

    const systemPrompt = `You are a medical AI assistant designed to help healthcare providers with differential diagnosis. You provide clinical decision support based on symptoms and patient information.

IMPORTANT DISCLAIMERS:
- Your suggestions are for clinical decision support only
- Always recommend proper clinical examination and diagnostic tests
- Never replace professional medical judgment
- Consider local disease prevalence and epidemiology

When analyzing symptoms, provide:
1. Top differential diagnoses ranked by probability
2. Key distinguishing features for each diagnosis
3. Recommended diagnostic tests or examinations
4. Red flags that require immediate attention
5. General treatment considerations

Format your response as structured JSON.`;

    const userPrompt = `${patientContext}

Presenting symptoms: ${symptoms.join(", ")}

Please analyze these symptoms and provide differential diagnoses with confidence levels, recommended tests, and treatment considerations. Return as JSON with this structure:
{
  "differentialDiagnoses": [
    {
      "condition": "string",
      "confidence": number (0-100),
      "keyFeatures": ["string"],
      "distinguishingFactors": "string"
    }
  ],
  "recommendedTests": ["string"],
  "redFlags": ["string"],
  "generalRecommendations": "string",
  "urgencyLevel": "routine" | "soon" | "urgent" | "emergency"
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
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage limit reached. Please contact administrator." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error("AI service temporarily unavailable");
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content;

    if (!aiResponse) {
      throw new Error("No response from AI service");
    }

    console.log("AI diagnosis completed successfully");

    // Try to parse as JSON, otherwise return as structured text
    let parsedResponse;
    try {
      // Clean up markdown code blocks if present
      const cleanedResponse = aiResponse.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsedResponse = JSON.parse(cleanedResponse);
    } catch {
      parsedResponse = { rawResponse: aiResponse };
    }

    return new Response(
      JSON.stringify({
        success: true,
        analysis: parsedResponse,
        model: "google/gemini-2.5-flash",
        timestamp: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in ai-diagnostics function:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "An unexpected error occurred" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
