import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PatientData {
  name: string;
  age?: number;
  gender?: string;
  conditions?: string[];
  medications?: string[];
  recentVitals?: {
    bloodPressure?: string;
    heartRate?: number;
    temperature?: number;
  };
  medicalHistory?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const { patients }: { patients: PatientData[] } = await req.json();

    if (!patients || patients.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Patient data is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = `You are a medical risk assessment AI. Analyze patient data and provide risk assessments for each patient.

For each patient, assess:
1. Overall risk level (low, medium, high, critical)
2. Specific risk factors identified
3. Recommended actions

Consider:
- Age-related risks
- Existing conditions and their interactions
- Medication interactions
- Vital signs abnormalities
- Medical history patterns

Always respond in JSON format:
{
  "assessments": [
    {
      "patientName": "name",
      "riskLevel": "low|medium|high|critical",
      "riskScore": 0-100,
      "riskFactors": ["factor1", "factor2"],
      "recommendations": ["action1", "action2"],
      "urgentAttentionNeeded": true/false
    }
  ]
}`;

    const patientSummaries = patients.map((p, i) => {
      const details = [
        `Patient ${i + 1}: ${p.name}`,
        p.age ? `Age: ${p.age}` : null,
        p.gender ? `Gender: ${p.gender}` : null,
        p.conditions?.length ? `Conditions: ${p.conditions.join(', ')}` : null,
        p.medications?.length ? `Medications: ${p.medications.join(', ')}` : null,
        p.recentVitals ? `Vitals: BP ${p.recentVitals.bloodPressure || 'N/A'}, HR ${p.recentVitals.heartRate || 'N/A'}, Temp ${p.recentVitals.temperature || 'N/A'}` : null,
        p.medicalHistory ? `History: ${p.medicalHistory}` : null,
      ].filter(Boolean).join('\n');
      return details;
    }).join('\n\n---\n\n');

    const userPrompt = `Analyze the following patients and provide risk assessments:\n\n${patientSummaries}`;

    console.log('Calling Lovable AI for risk assessment...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Usage limit reached. Please add credits.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content;

    console.log('AI Response received:', aiResponse);

    let parsedResponse;
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0]);
      } else {
        parsedResponse = { assessments: [] };
      }
    } catch (e) {
      console.error('Failed to parse AI response:', e);
      parsedResponse = { assessments: [] };
    }

    return new Response(
      JSON.stringify({ success: true, data: parsedResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Risk assessment error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
