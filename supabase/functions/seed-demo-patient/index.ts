import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const DEMO_EMAIL = "patient@mediledger.ai";
const DEMO_PASSWORD = "patient123";
const DEMO_PATIENT_ID = "a0000001-0000-0000-0000-000000000001";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = Deno.env.get("SUPABASE_URL")!;
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const adminHeaders = {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  };

  try {
    // 1. Find or create the demo patient auth user
    let userId: string | null = null;

    const listRes = await fetch(
      `${url}/auth/v1/admin/users?page=1&per_page=200`,
      { headers: adminHeaders },
    );
    const list = await listRes.json();
    const existing = (list.users ?? []).find(
      (u: { id: string; email: string }) => u.email?.toLowerCase() === DEMO_EMAIL,
    );

    if (existing) {
      userId = existing.id;
      // reset password / confirm email so demo login always works
      await fetch(`${url}/auth/v1/admin/users/${userId}`, {
        method: "PUT",
        headers: adminHeaders,
        body: JSON.stringify({
          password: DEMO_PASSWORD,
          email_confirm: true,
          user_metadata: { full_name: "Aarav Sharma" },
        }),
      });
    } else {
      const createRes = await fetch(`${url}/auth/v1/admin/users`, {
        method: "POST",
        headers: adminHeaders,
        body: JSON.stringify({
          email: DEMO_EMAIL,
          password: DEMO_PASSWORD,
          email_confirm: true,
          user_metadata: { full_name: "Aarav Sharma" },
        }),
      });
      const created = await createRes.json();
      if (!createRes.ok) throw new Error(created.msg || "Failed to create demo user");
      userId = created.id;
    }

    if (!userId) throw new Error("Could not resolve demo user id");

    // 2. Make sure the role is patient (trigger defaults to provider)
    await fetch(`${url}/rest/v1/user_roles?user_id=eq.${userId}`, {
      method: "DELETE",
      headers: adminHeaders,
    });
    await fetch(`${url}/rest/v1/user_roles`, {
      method: "POST",
      headers: adminHeaders,
      body: JSON.stringify({ user_id: userId, role: "patient" }),
    });

    // 3. Link a patient record to this user
    const patientRes = await fetch(
      `${url}/rest/v1/patients?id=eq.${DEMO_PATIENT_ID}&select=id`,
      { headers: adminHeaders },
    );
    const patientRows = await patientRes.json();

    let patientId = patientRows?.[0]?.id ?? null;

    if (patientId) {
      await fetch(`${url}/rest/v1/patients?id=eq.${patientId}`, {
        method: "PATCH",
        headers: adminHeaders,
        body: JSON.stringify({
          user_id: userId,
          email: DEMO_EMAIL,
          patient_did: `did:mediledger:${patientId.slice(0, 8)}`,
        }),
      });
    } else {
      // fall back: reuse any patient already linked, else create a fresh one
      const linkedRes = await fetch(
        `${url}/rest/v1/patients?user_id=eq.${userId}&select=id`,
        { headers: adminHeaders },
      );
      const linked = await linkedRes.json();
      if (linked?.[0]?.id) {
        patientId = linked[0].id;
      } else {
        const insertRes = await fetch(`${url}/rest/v1/patients`, {
          method: "POST",
          headers: { ...adminHeaders, Prefer: "return=representation" },
          body: JSON.stringify({
            user_id: userId,
            full_name: "Aarav Sharma",
            date_of_birth: "1988-04-12",
            gender: "male",
            blood_type: "O+",
            phone: "+91 98765 43210",
            email: DEMO_EMAIL,
            address: "Village Rampur, Uttar Pradesh",
            emergency_contact_name: "Kavita Sharma",
            emergency_contact_phone: "+91 98765 11111",
            allergies: ["Penicillin"],
            chronic_conditions: ["Type 2 Diabetes"],
            registered_by: userId,
          }),
        });
        const inserted = await insertRes.json();
        if (!insertRes.ok) throw new Error(inserted.message || "Failed to create patient");
        patientId = inserted[0].id;
      }
    }

    // 4. Ensure the patient has at least a few records to view
    const recRes = await fetch(
      `${url}/rest/v1/medical_records?patient_id=eq.${patientId}&select=id`,
      { headers: adminHeaders },
    );
    const recs = await recRes.json();

    if (!Array.isArray(recs) || recs.length === 0) {
      await fetch(`${url}/rest/v1/medical_records`, {
        method: "POST",
        headers: adminHeaders,
        body: JSON.stringify([
          {
            patient_id: patientId,
            record_type: "consultation",
            title: "Routine Diabetes Follow-up",
            description: "Quarterly check-up at the rural health centre.",
            diagnosis: "Type 2 Diabetes Mellitus - controlled",
            treatment: "Continue Metformin, dietary counselling",
            vital_signs: { bp: "128/82", pulse: 78, temp: "98.4F", spo2: 97 },
            created_by: userId,
          },
          {
            patient_id: patientId,
            record_type: "prescription",
            title: "Metformin Prescription",
            description: "3 month supply",
            medications: [
              { name: "Metformin", dosage: "500mg", frequency: "Twice daily" },
              { name: "Vitamin D3", dosage: "60000 IU", frequency: "Weekly" },
            ],
            created_by: userId,
          },
          {
            patient_id: patientId,
            record_type: "lab_result",
            title: "HbA1c Panel",
            description: "HbA1c 6.9% - within target range",
            created_by: userId,
          },
        ]),
      });
    }

    return new Response(
      JSON.stringify({ success: true, email: DEMO_EMAIL, patientId }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error: unknown) {
    console.error("seed-demo-patient error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
