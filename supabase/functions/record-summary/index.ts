import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RecordSummaryRequest {
  recordType: string;
  recordContent: string;
  patientAge?: number;
  patientGender?: string;
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

    const { recordType, recordContent, patientAge, patientGender }: RecordSummaryRequest = await req.json();

    if (!recordContent) {
      return new Response(
        JSON.stringify({ error: 'Record content is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const patientContext = [
      patientAge ? `Patient Age: ${patientAge}` : null,
      patientGender ? `Gender: ${patientGender}` : null,
    ].filter(Boolean).join(', ');

    const systemPrompt = `You are a medical record summarizer AI assistant. Your role is to analyze medical records and provide clear, concise summaries for healthcare providers.

Guidelines:
- Extract key findings, diagnoses, and recommendations
- Highlight critical information that requires immediate attention
- Use medical terminology appropriately
- Keep summaries professional and actionable
- Include any follow-up recommendations

Always respond in JSON format with this structure:
{
  "summary": "Brief 2-3 sentence overview",
  "keyFindings": ["finding1", "finding2"],
  "criticalAlerts": ["alert1"] or [],
  "recommendations": ["recommendation1", "recommendation2"],
  "followUpNeeded": true/false
}`;

    const userPrompt = `Summarize this ${recordType || 'medical'} record:

${patientContext ? `Patient Info: ${patientContext}\n\n` : ''}Record Content:
${recordContent}`;

    console.log('Calling Lovable AI for record summary...');

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
        parsedResponse = {
          summary: aiResponse,
          keyFindings: [],
          criticalAlerts: [],
          recommendations: [],
          followUpNeeded: false
        };
      }
    } catch (e) {
      parsedResponse = {
        summary: aiResponse,
        keyFindings: [],
        criticalAlerts: [],
        recommendations: [],
        followUpNeeded: false
      };
    }

    return new Response(
      JSON.stringify({ success: true, data: parsedResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Record summary error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
