import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { 
  Shield, 
  FileText, 
  User, 
  Heart, 
  Calendar, 
  Loader2, 
  LogOut,
  Sparkles,
  AlertCircle,
  CheckCircle,
  Clock,
  Activity,
  MessageSquare,
  Bell,
  Bot,
  CalendarCheck,
  QrCode,
  MapPin,
  Video,
  Stethoscope,
  Pill,
  CreditCard,
  MessageCircle
} from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";
import { AppointmentRequestForm } from "@/components/patient/AppointmentRequestForm";
import { RefillRequestForm } from "@/components/patient/RefillRequestForm";
import { MessagesPanel } from "@/components/patient/MessagesPanel";
import { HealthAlertsCard } from "@/components/patient/HealthAlertsCard";
import { AIChatbot } from "@/components/patient/AIChatbot";
import { EmergencyHealthPass } from "@/components/patient/EmergencyHealthPass";
import { VitalsTrackerCard } from "@/components/patient/VitalsTrackerCard";
import { MedicationTrackerCard } from "@/components/patient/MedicationTrackerCard";
import { InsuranceClaimsCard } from "@/components/patient/InsuranceClaimsCard";
import { WhatsAppChatbot } from "@/components/patient/WhatsAppChatbot";
import { TelehealthVideoModal } from "@/components/patient/TelehealthVideoModal";
import { EmergencyBedTrackerCard } from "@/components/patient/EmergencyBedTrackerCard";
import { AIDiagnosticsScanModal } from "@/components/patient/AIDiagnosticsScanModal";

type Patient = Tables<"patients">;
type MedicalRecord = Tables<"medical_records">;
type ConsentGrant = Tables<"consent_grants">;

interface HealthInsights {
  personalizedInsights?: { insight: string; category: string; priority: string }[];
  riskFactors?: { factor: string; riskLevel: string; recommendation: string }[];
  preventiveCare?: { recommendation: string; frequency: string; importance: string }[];
  lifestyleSuggestions?: string[];
  overallHealthScore?: number;
  healthSummary?: string;
}

const PatientPortal = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [consents, setConsents] = useState<ConsentGrant[]>([]);
  const [insights, setInsights] = useState<HealthInsights | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);

  useEffect(() => {
    if (user) {
      fetchPatientData();
    }
  }, [user]);

  const fetchPatientData = async () => {
    try {
      const { data: patientData, error: patientError } = await supabase
        .from("patients")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      if (patientError || !patientData) {
        toast.error("No patient profile found for this account");
        setLoading(false);
        return;
      }

      setPatient(patientData);

      const { data: recordsData } = await supabase
        .from("medical_records")
        .select("*")
        .eq("patient_id", patientData.id)
        .order("created_at", { ascending: false });

      setRecords(recordsData || []);

      const { data: consentsData } = await supabase
        .from("consent_grants")
        .select("*")
        .eq("patient_id", patientData.id);

      setConsents(consentsData || []);
    } catch (error) {
      console.error("Error fetching patient data:", error);
      toast.error("Failed to load patient data");
    } finally {
      setLoading(false);
    }
  };

  const fetchHealthInsights = async () => {
    if (!patient) return;
    
    setLoadingInsights(true);
    try {
      const { data, error } = await supabase.functions.invoke("health-insights", {
        body: { patientId: patient.id }
      });

      if (error) throw error;
      setInsights(data.insights);
      toast.success("Health insights generated");
    } catch (error) {
      console.error("Error fetching insights:", error);
      toast.error("Failed to generate health insights");
    } finally {
      setLoadingInsights(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const calculateAge = (dob: string) => {
    return new Date().getFullYear() - new Date(dob).getFullYear();
  };

  const getRecordTypeIcon = (type: string) => {
    switch (type) {
      case "consultation": return <User className="h-4 w-4" />;
      case "lab_result": return <Activity className="h-4 w-4" />;
      case "prescription": return <FileText className="h-4 w-4" />;
      case "diagnosis": return <Heart className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              No Patient Profile
            </CardTitle>
            <CardDescription>
              Your account is not linked to a patient profile. Please contact your healthcare provider.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleSignOut} variant="outline" className="w-full">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Patient Portal - MediNexus AI</title>
        <meta name="description" content="Manage appointments, view medical records, track live queues, and access portable health ID." />
      </Helmet>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card px-6 py-4">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-tr from-primary to-blue-500 text-primary-foreground shadow-md">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold">MediNexus Patient Portal</h1>
                <p className="text-sm text-muted-foreground">Welcome, {patient.full_name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                  {patient.full_name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto p-6 space-y-6">
          
          {/* Active Live Queue & Upcoming Appointment Banner */}
          <Card className="border-primary/30 bg-gradient-to-r from-primary/10 via-blue-500/10 to-primary/5 shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary">Live Queue Status</span>
                </div>
                <Badge variant="outline" className="border-primary/40 text-primary font-bold">Health ID: MNX-10291</Badge>
              </div>
              <CardTitle className="text-lg font-bold">Today's Appointment with Dr. Arjun Mehta</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Cardiology Department • Room 204 • Today at 10:30 AM (In-person)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              
              {/* Stepper */}
              <div className="grid grid-cols-5 gap-2 text-center text-xs">
                <div className="p-2 rounded-lg bg-primary/20 text-primary border border-primary/30 font-semibold">
                  <p className="text-[9px]">Step 01</p>
                  <p>Booked</p>
                </div>
                <div className="p-2 rounded-lg bg-primary/20 text-primary border border-primary/30 font-semibold">
                  <p className="text-[9px]">Step 02</p>
                  <p>Confirmed</p>
                </div>
                <div className="p-2 rounded-lg bg-primary/20 text-primary border border-primary/30 font-semibold">
                  <p className="text-[9px]">Step 03</p>
                  <p>Checked-in</p>
                </div>
                <div className="p-2 rounded-lg bg-primary text-primary-foreground font-bold shadow-md animate-pulse">
                  <p className="text-[9px] opacity-80">Step 04</p>
                  <p>Waiting Queue</p>
                </div>
                <div className="p-2 rounded-lg bg-muted/50 text-muted-foreground font-medium">
                  <p className="text-[9px]">Step 05</p>
                  <p>With Doctor</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl bg-card border gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-black text-xl shrink-0">
                    #4
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">You are Position #4 in Queue</p>
                    <p className="text-xs text-muted-foreground">Estimated Wait Time: <span className="font-bold text-amber-600">~12 minutes</span></p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <TelehealthVideoModal doctorName="Dr. Arjun Mehta" specialty="Senior Cardiologist" />
                  <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                    <QrCode className="h-4 w-4" /> QR Token
                  </Button>
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Emergency ICU Bed & Hospital Capacity Tracker */}
          <EmergencyBedTrackerCard />

          {/* Profile & Digital Health Passport Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Your Portable Health Profile
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Age</p>
                      <p className="font-medium">{calculateAge(patient.date_of_birth)} years</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Gender</p>
                      <p className="font-medium">{patient.gender || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Blood Type</p>
                      <p className="font-medium">{patient.blood_type || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{patient.phone || "Not provided"}</p>
                    </div>
                  </div>
                  
                  {(patient.allergies?.length > 0 || patient.chronic_conditions?.length > 0) && (
                    <div className="grid gap-4 md:grid-cols-2 mt-6">
                      {patient.allergies && patient.allergies.length > 0 && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Allergies</p>
                          <div className="flex flex-wrap gap-2">
                            {patient.allergies.map((allergy, i) => (
                              <Badge key={i} variant="destructive">{allergy}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {patient.chronic_conditions && patient.chronic_conditions.length > 0 && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Chronic Conditions</p>
                          <div className="flex flex-wrap gap-2">
                            {patient.chronic_conditions.map((condition, i) => (
                              <Badge key={i} variant="secondary">{condition}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div>
              <EmergencyHealthPass patient={patient} />
            </div>
          </div>

          {/* Live Vitals & Pill Schedule Interactive Section */}
          <div className="grid gap-6 lg:grid-cols-2">
            <VitalsTrackerCard />
            <MedicationTrackerCard />
          </div>

          {/* WhatsApp AI Care Assistant & Demo Module */}
          <WhatsAppChatbot />

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <AppointmentRequestForm patientId={patient.id} />
            <RefillRequestForm 
              patientId={patient.id} 
              medications={records
                .filter(r => r.record_type === "prescription" && r.medications)
                .flatMap(r => (r.medications as { name: string; dosage: string }[]) || [])
              }
            />
            <AIDiagnosticsScanModal />
          </div>

          {/* Health Alerts */}
          <HealthAlertsCard patientId={patient.id} />

          <Tabs defaultValue="whatsapp">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 h-auto p-1 gap-1">
              <TabsTrigger value="whatsapp" className="flex items-center gap-1.5 text-xs py-2 bg-emerald-500/10 text-emerald-600 font-bold">
                <MessageCircle className="h-3.5 w-3.5" />
                WhatsApp AI
              </TabsTrigger>
              <TabsTrigger value="vitals" className="flex items-center gap-1.5 text-xs py-2">
                <Activity className="h-3.5 w-3.5" />
                Vitals
              </TabsTrigger>
              <TabsTrigger value="pills" className="flex items-center gap-1.5 text-xs py-2">
                <Pill className="h-3.5 w-3.5" />
                Pills
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-1.5 text-xs py-2">
                <Activity className="h-3.5 w-3.5" />
                History
              </TabsTrigger>
              <TabsTrigger value="prescriptions" className="flex items-center gap-1.5 text-xs py-2">
                <FileText className="h-3.5 w-3.5" />
                Prescriptions
              </TabsTrigger>
              <TabsTrigger value="insurance" className="flex items-center gap-1.5 text-xs py-2">
                <CreditCard className="h-3.5 w-3.5" />
                Insurance
              </TabsTrigger>
              <TabsTrigger value="messages" className="flex items-center gap-1.5 text-xs py-2">
                <MessageSquare className="h-3.5 w-3.5" />
                Messages
              </TabsTrigger>
              <TabsTrigger value="ai" className="flex items-center gap-1.5 text-xs py-2">
                <Bot className="h-3.5 w-3.5" />
                AI Doctor
              </TabsTrigger>
            </TabsList>

            {/* WhatsApp Tab */}
            <TabsContent value="whatsapp" className="space-y-4 pt-2">
              <WhatsAppChatbot />
            </TabsContent>

            {/* Vitals Tab */}
            <TabsContent value="vitals" className="space-y-4 pt-2">
              <VitalsTrackerCard />
            </TabsContent>

            {/* Pills Tab */}
            <TabsContent value="pills" className="space-y-4 pt-2">
              <MedicationTrackerCard />
            </TabsContent>

            {/* Insurance Tab */}
            <TabsContent value="insurance" className="space-y-4 pt-2">
              <InsuranceClaimsCard />
            </TabsContent>

            {/* Medical History Tab */}
            <TabsContent value="history" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Your Medical History</CardTitle>
                  <CardDescription>
                    {records.filter(r => r.record_type !== "prescription").length} records found
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {records.filter(r => r.record_type !== "prescription").length > 0 ? (
                    <div className="space-y-4">
                      {records
                        .filter(r => r.record_type !== "prescription")
                        .map((record) => (
                          <div key={record.id} className="p-4 rounded-lg border">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                {getRecordTypeIcon(record.record_type)}
                                <span className="font-medium">{record.title}</span>
                                <Badge variant="outline">{record.record_type.replace("_", " ")}</Badge>
                              </div>
                              <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(record.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            {record.description && (
                              <p className="text-sm text-muted-foreground mb-2">{record.description}</p>
                            )}
                            {record.diagnosis && (
                              <p className="text-sm"><strong>Diagnosis:</strong> {record.diagnosis}</p>
                            )}
                            {record.treatment && (
                              <p className="text-sm"><strong>Treatment:</strong> {record.treatment}</p>
                            )}
                            {record.blockchain_hash && (
                              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                Verified on blockchain
                              </p>
                            )}
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No medical history found
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Prescriptions Tab */}
            <TabsContent value="prescriptions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Your Prescriptions</CardTitle>
                  <CardDescription>
                    {records.filter(r => r.record_type === "prescription").length} prescriptions found
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {records.filter(r => r.record_type === "prescription").length > 0 ? (
                    <div className="space-y-4">
                      {records
                        .filter(r => r.record_type === "prescription")
                        .map((record) => (
                          <div key={record.id} className="p-4 rounded-lg border bg-muted/30">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-primary" />
                                <span className="font-medium">{record.title}</span>
                              </div>
                              <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(record.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            {record.description && (
                              <p className="text-sm text-muted-foreground mb-2">{record.description}</p>
                            )}
                            {record.medications && (
                              <div className="mt-3">
                                <p className="text-sm font-medium mb-2">Medications:</p>
                                <div className="space-y-2">
                                  {(record.medications as { name: string; dosage: string; frequency: string }[]).map((med, idx) => (
                                    <div key={idx} className="p-2 rounded bg-background border text-sm">
                                      <span className="font-medium">{med.name}</span> - {med.dosage} ({med.frequency})
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            {record.blockchain_hash && (
                              <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                Verified on blockchain
                              </p>
                            )}
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No prescriptions found
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Consents Tab */}
            <TabsContent value="consents" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Data Access Permissions</CardTitle>
                  <CardDescription>Manage who can access your health data</CardDescription>
                </CardHeader>
                <CardContent>
                  {consents.length > 0 ? (
                    <div className="space-y-4">
                      {consents.map((consent) => (
                        <div key={consent.id} className="p-4 rounded-lg border flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant={consent.status === "active" ? "default" : "secondary"}>
                                {consent.status}
                              </Badge>
                              <Badge variant="outline">{consent.access_level}</Badge>
                            </div>
                            {consent.purpose && (
                              <p className="text-sm text-muted-foreground">{consent.purpose}</p>
                            )}
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Granted: {new Date(consent.granted_at).toLocaleDateString()}
                              {consent.expires_at && ` • Expires: ${new Date(consent.expires_at).toLocaleDateString()}`}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No data access consents found
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Messages Tab */}
            <TabsContent value="messages" className="space-y-4">
              <MessagesPanel patientId={patient.id} />
            </TabsContent>

            {/* AI Assistant Tab */}
            <TabsContent value="ai" className="space-y-4">
              <AIChatbot patientId={patient.id} />
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      AI Health Analysis
                    </span>
                    <Button onClick={fetchHealthInsights} disabled={loadingInsights}>
                      {loadingInsights ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Sparkles className="h-4 w-4 mr-2" />
                      )}
                      Generate Insights
                    </Button>
                  </CardTitle>
                  <CardDescription>AI-powered health recommendations by Google Gemini</CardDescription>
                </CardHeader>
                <CardContent>
                  {insights ? (
                    <div className="space-y-6">
                      {insights.overallHealthScore && (
                        <div className="text-center p-6 rounded-lg bg-muted">
                          <p className="text-sm text-muted-foreground mb-2">Overall Health Score</p>
                          <p className="text-5xl font-bold text-primary">{insights.overallHealthScore}</p>
                          <p className="text-sm text-muted-foreground mt-2">/100</p>
                        </div>
                      )}

                      {insights.healthSummary && (
                        <p className="text-lg">{insights.healthSummary}</p>
                      )}

                      {insights.personalizedInsights && (
                        <div>
                          <h4 className="font-semibold mb-3">Personalized Insights</h4>
                          <div className="space-y-2">
                            {insights.personalizedInsights.map((item, i) => (
                              <div key={i} className="p-3 rounded-lg border">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge variant="outline">{item.category}</Badge>
                                  <Badge variant={item.priority === "high" ? "destructive" : "secondary"}>
                                    {item.priority}
                                  </Badge>
                                </div>
                                <p className="text-sm">{item.insight}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Sparkles className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                      <p className="text-muted-foreground">
                        Click "Generate Insights" for personalized health analysis
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </>
  );
};

export default PatientPortal;
