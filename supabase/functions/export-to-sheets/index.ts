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
  email?: string;
  phone?: string;
  allergies?: string[];
  chronic_conditions?: string[];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SHEETS_API_KEY = Deno.env.get("GOOGLE_SHEETS_API_KEY");
    if (!SHEETS_API_KEY) {
      throw new Error("Google Sheets API key not configured");
    }

    const { patients, spreadsheetId } = await req.json() as { 
      patients: PatientData[]; 
      spreadsheetId?: string;
    };

    if (!patients || patients.length === 0) {
      return new Response(
        JSON.stringify({ error: "No patients to export" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Format data for sheets
    const headers = ["Name", "Date of Birth", "Gender", "Blood Type", "Email", "Phone", "Allergies", "Chronic Conditions"];
    const rows = patients.map(p => [
      p.full_name,
      p.date_of_birth,
      p.gender || "",
      p.blood_type || "",
      p.email || "",
      p.phone || "",
      p.allergies?.join(", ") || "",
      p.chronic_conditions?.join(", ") || ""
    ]);

    const values = [headers, ...rows];

    // If no spreadsheetId provided, return the formatted data for client-side handling
    if (!spreadsheetId) {
      return new Response(
        JSON.stringify({ 
          success: true,
          message: "Data formatted for export",
          data: values,
          csvContent: values.map(row => row.map(cell => `"${cell}"`).join(",")).join("\n")
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update existing spreadsheet
    const range = "Sheet1!A1";
    const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?valueInputOption=RAW&key=${SHEETS_API_KEY}`;

    const updateResponse = await fetch(updateUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ values }),
    });

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      console.error("Sheets API error:", errorText);
      // Return CSV format as fallback
      return new Response(
        JSON.stringify({ 
          success: true,
          message: "Spreadsheet update failed, returning CSV format",
          csvContent: values.map(row => row.map(cell => `"${cell}"`).join(",")).join("\n")
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Data exported to Google Sheets",
        spreadsheetId 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in export-to-sheets function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
