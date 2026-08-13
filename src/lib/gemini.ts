/**
 * Google Gemini AI Integration Service for MediNexus AI
 * Connects directly to Google Gemini models (gemini-1.5-flash / gemini-2.5-flash)
 */

export interface GeminiMessage {
  role: "user" | "model" | "system";
  content: string;
}

export const getGeminiApiKey = (): string | null => {
  return import.meta.env.VITE_GEMINI_API_KEY || null;
};

export const hasGeminiApiKey = (): boolean => {
  return Boolean(getGeminiApiKey());
};

/**
 * Call Google Gemini REST API directly
 */
export const callGeminiApi = async (prompt: string, systemInstruction?: string): Promise<string> => {
  const apiKey = getGeminiApiKey();

  if (!apiKey) {
    throw new Error("VITE_GEMINI_API_KEY is not configured in .env file");
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const contents: any[] = [];
  
  if (systemInstruction) {
    contents.push({
      role: "user",
      parts: [{ text: `SYSTEM INSTRUCTION: ${systemInstruction}\n\nUSER REQUEST: ${prompt}` }]
    });
  } else {
    contents.push({
      role: "user",
      parts: [{ text: prompt }]
    });
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents,
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 1000,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API Error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("No text response received from Gemini AI model.");
  }

  return text;
};

/**
 * AI Pre-Triage Symptom Classifier powered by Gemini
 */
export const generateGeminiPreTriage = async (symptoms: string): Promise<{ department: string; urgency: "HIGH" | "NORMAL"; reasoning: string }> => {
  const apiKey = getGeminiApiKey();

  if (!apiKey) {
    // Intelligent offline fallback rule-based classifier
    const s = symptoms.toLowerCase();
    if (s.includes("chest") || s.includes("heart") || s.includes("dizzy")) {
      return { department: "Cardiology", urgency: "HIGH", reasoning: "Chest pain and cardiovascular symptom combination detected." };
    }
    if (s.includes("joint") || s.includes("bone") || s.includes("fracture") || s.includes("knee")) {
      return { department: "Orthopedics", urgency: "NORMAL", reasoning: "Joint and musculoskeletal symptoms detected." };
    }
    if (s.includes("fever") || s.includes("cough") || s.includes("headache")) {
      return { department: "General Medicine", urgency: "NORMAL", reasoning: "General viral / respiratory symptoms detected." };
    }
    return { department: "General Medicine", urgency: "NORMAL", reasoning: "Standard general consultation recommendation." };
  }

  try {
    const systemPrompt = `You are a clinical pre-triage AI assistant for MediNexus AI. Analyze the patient's symptoms and classify into:
1. Recommended Department (Choose one: Cardiology, General Medicine, Orthopedics, Pediatrics, Neurology, Dermatology, ENT & Allergy)
2. Urgency Priority (HIGH or NORMAL)
3. Brief clinical reasoning (1 short sentence)

Respond in JSON format: {"department": "...", "urgency": "...", "reasoning": "..."}`;

    const rawResponse = await callGeminiApi(symptoms, systemPrompt);
    const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return { department: "General Medicine", urgency: "NORMAL", reasoning: rawResponse };
  } catch (error) {
    console.warn("Gemini Pre-triage fallback triggered:", error);
    return { department: "General Medicine", urgency: "NORMAL", reasoning: "General triage routing." };
  }
};

/**
 * AI Clinical Case Summarizer for Physicians
 */
export const generateGeminiCaseSummary = async (patientName: string, reason: string, symptoms: string[], history: string[]): Promise<string> => {
  if (!hasGeminiApiKey()) {
    return `Patient ${patientName} presented with ${reason}. Context indicates symptoms (${symptoms.join(", ")}) alongside reported medical history (${history.join(", ")}). Recommend standard physician evaluation.`;
  }

  const prompt = `Synthesize a concise, 2-sentence clinical case summary for doctor review prior to consultation:
Patient: ${patientName}
Reason for Visit: ${reason}
Symptoms: ${symptoms.join(", ")}
Past History: ${history.join(", ")}`;

  const system = "You are a clinical AI diagnostic co-pilot for MediNexus AI. Keep summaries objective, professional, and assistive.";

  try {
    return await callGeminiApi(prompt, system);
  } catch (err) {
    return `Clinical summary for ${patientName}: Presenting with ${reason}. Review patient history and current vitals.`;
  }
};
