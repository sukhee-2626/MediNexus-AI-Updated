import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import DashboardSidebar from "@/components/dashboard/Sidebar";
import PatientProfileCard from "@/components/patient/PatientProfileCard";
import MedicalHistoryCard from "@/components/patient/MedicalHistoryCard";
import ConsentStatusCard from "@/components/patient/ConsentStatusCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

type Patient = Tables<"patients">;
type MedicalRecord = Tables<"medical_records">;
type ConsentGrant = Tables<"consent_grants">;

const PatientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [consents, setConsents] = useState<ConsentGrant[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMedicalRecords = async () => {
    if (!id) return;
    const { data, error } = await supabase
      .from("medical_records")
      .select("*")
      .eq("patient_id", id)
      .order("created_at", { ascending: false });
    if (!error) setMedicalRecords(data || []);
  };

  const fetchConsents = async () => {
    if (!id) return;
    const { data, error } = await supabase
      .from("consent_grants")
      .select("*")
      .eq("patient_id", id)
      .order("granted_at", { ascending: false });
    if (!error) setConsents(data || []);
  };

  useEffect(() => {
    if (!id) return;

    const fetchPatientData = async () => {
      try {
        const { data: patientData, error: patientError } = await supabase
          .from("patients")
          .select("*")
          .eq("id", id)
          .single();

        if (patientError) throw patientError;
        setPatient(patientData);

        await Promise.all([fetchMedicalRecords(), fetchConsents()]);
      } catch (error: any) {
        console.error("Error fetching patient data:", error);
        toast.error("Failed to load patient data");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();

    // Subscribe to real-time changes
    const recordsChannel = supabase
      .channel(`records-${id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "medical_records", filter: `patient_id=eq.${id}` },
        () => fetchMedicalRecords()
      )
      .subscribe();

    const consentsChannel = supabase
      .channel(`consents-${id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "consent_grants", filter: `patient_id=eq.${id}` },
        () => fetchConsents()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(recordsChannel);
      supabase.removeChannel(consentsChannel);
    };
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <DashboardSidebar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </main>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex h-screen bg-background">
        <DashboardSidebar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Patient not found</p>
        </main>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{patient.full_name} - Patient Profile | MediLedger AI</title>
        <meta name="description" content={`View patient profile, medical history, and consent status for ${patient.full_name}`} />
      </Helmet>
      <div className="flex h-screen bg-background">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto">
          <div className="border-b bg-card px-8 py-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard")}
              className="mb-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold">{patient.full_name}</h1>
            <p className="text-sm text-muted-foreground">Patient Profile & Medical History</p>
          </div>

          <div className="p-8 space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <PatientProfileCard patient={patient} />
                <MedicalHistoryCard records={medicalRecords} patientId={patient.id} onRefresh={fetchMedicalRecords} />
              </div>
              <div>
                <ConsentStatusCard consents={consents} patientId={patient.id} onRefresh={fetchConsents} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default PatientDetail;
