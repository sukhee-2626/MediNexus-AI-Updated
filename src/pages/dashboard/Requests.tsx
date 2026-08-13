import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import DashboardSidebar from "@/components/dashboard/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Calendar, 
  Pill, 
  MessageSquare, 
  Check, 
  X, 
  Clock, 
  Loader2,
  AlertCircle
} from "lucide-react";

interface Appointment {
  id: string;
  patient_id: string;
  provider_id: string;
  appointment_type: string;
  preferred_date: string;
  preferred_time: string | null;
  status: string;
  notes: string | null;
  created_at: string;
  patients?: { full_name: string };
}

interface RefillRequest {
  id: string;
  patient_id: string;
  medication_name: string;
  dosage: string | null;
  urgency: string;
  status: string;
  provider_notes: string | null;
  created_at: string;
  patients?: { full_name: string };
}

interface Message {
  id: string;
  patient_id: string;
  sender_type: string;
  subject: string;
  content: string;
  is_read: boolean;
  created_at: string;
  patients?: { full_name: string };
}

const Requests = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [refillRequests, setRefillRequests] = useState<RefillRequest[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();

    const appointmentsChannel = supabase
      .channel("appointments-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "appointments" }, fetchAll)
      .subscribe();

    const refillsChannel = supabase
      .channel("refills-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "refill_requests" }, fetchAll)
      .subscribe();

    const messagesChannel = supabase
      .channel("messages-provider")
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, fetchAll)
      .subscribe();

    return () => {
      supabase.removeChannel(appointmentsChannel);
      supabase.removeChannel(refillsChannel);
      supabase.removeChannel(messagesChannel);
    };
  }, []);

  const fetchAll = async () => {
    try {
      const [appointmentsRes, refillsRes, messagesRes] = await Promise.all([
        supabase
          .from("appointments")
          .select("*, patients(full_name)")
          .order("created_at", { ascending: false }),
        supabase
          .from("refill_requests")
          .select("*, patients(full_name)")
          .order("created_at", { ascending: false }),
        supabase
          .from("messages")
          .select("*, patients(full_name)")
          .eq("sender_type", "patient")
          .order("created_at", { ascending: false })
      ]);

      setAppointments(appointmentsRes.data || []);
      setRefillRequests(refillsRes.data || []);
      setMessages(messagesRes.data || []);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("appointments")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
      toast.success(`Appointment ${status}`);
    } catch (error) {
      console.error("Error updating appointment:", error);
      toast.error("Failed to update appointment");
    }
  };

  const updateRefillStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("refill_requests")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
      toast.success(`Refill request ${status}`);
    } catch (error) {
      console.error("Error updating refill request:", error);
      toast.error("Failed to update refill request");
    }
  };

  const markMessageRead = async (id: string) => {
    try {
      await supabase.from("messages").update({ is_read: true }).eq("id", id);
    } catch (error) {
      console.error("Error marking message read:", error);
    }
  };

  const pendingAppointments = appointments.filter(a => a.status === "pending");
  const pendingRefills = refillRequests.filter(r => r.status === "pending");
  const unreadMessages = messages.filter(m => !m.is_read);

  return (
    <>
      <Helmet>
        <title>Patient Requests - MediLedger AI</title>
        <meta name="description" content="Manage patient appointment requests, prescription refills, and messages." />
      </Helmet>
      <div className="flex h-screen bg-background">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto">
          <div className="border-b bg-card px-8 py-4">
            <h1 className="text-2xl font-bold">Patient Requests</h1>
            <p className="text-sm text-muted-foreground">
              Manage appointments, refills, and patient messages
            </p>
          </div>

          <div className="p-8">
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3 mb-8">
              <Card className={pendingAppointments.length > 0 ? "border-primary/50" : ""}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Pending Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pendingAppointments.length}</div>
                </CardContent>
              </Card>
              <Card className={pendingRefills.filter(r => r.urgency === "urgent").length > 0 ? "border-destructive/50" : ""}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Pill className="h-4 w-4" />
                    Pending Refills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pendingRefills.length}</div>
                  {pendingRefills.filter(r => r.urgency === "urgent").length > 0 && (
                    <p className="text-xs text-destructive mt-1">
                      {pendingRefills.filter(r => r.urgency === "urgent").length} urgent
                    </p>
                  )}
                </CardContent>
              </Card>
              <Card className={unreadMessages.length > 0 ? "border-primary/50" : ""}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Unread Messages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{unreadMessages.length}</div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="appointments">
              <TabsList>
                <TabsTrigger value="appointments" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  Appointments
                  {pendingAppointments.length > 0 && (
                    <Badge variant="secondary">{pendingAppointments.length}</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="refills" className="gap-2">
                  <Pill className="h-4 w-4" />
                  Refills
                  {pendingRefills.length > 0 && (
                    <Badge variant="secondary">{pendingRefills.length}</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="messages" className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Messages
                  {unreadMessages.length > 0 && (
                    <Badge variant="secondary">{unreadMessages.length}</Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="appointments" className="mt-6">
                {loading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : appointments.length > 0 ? (
                  <div className="space-y-4">
                    {appointments.map((apt) => (
                      <Card key={apt.id}>
                        <CardContent className="flex items-center justify-between p-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{apt.patients?.full_name || "Unknown Patient"}</span>
                              <Badge variant={apt.status === "pending" ? "default" : apt.status === "confirmed" ? "secondary" : "outline"}>
                                {apt.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {apt.appointment_type} • {new Date(apt.preferred_date).toLocaleDateString()}
                              {apt.preferred_time && ` at ${apt.preferred_time}`}
                            </p>
                            {apt.notes && <p className="text-sm">{apt.notes}</p>}
                          </div>
                          {apt.status === "pending" && (
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => updateAppointmentStatus(apt.id, "confirmed")}>
                                <Check className="h-4 w-4 mr-1" /> Confirm
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => updateAppointmentStatus(apt.id, "cancelled")}>
                                <X className="h-4 w-4 mr-1" /> Decline
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No appointment requests</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="refills" className="mt-6">
                {loading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : refillRequests.length > 0 ? (
                  <div className="space-y-4">
                    {refillRequests.map((req) => (
                      <Card key={req.id} className={req.urgency === "urgent" ? "border-destructive/50" : ""}>
                        <CardContent className="flex items-center justify-between p-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{req.patients?.full_name || "Unknown Patient"}</span>
                              {req.urgency === "urgent" && (
                                <Badge variant="destructive">Urgent</Badge>
                              )}
                              <Badge variant={req.status === "pending" ? "default" : req.status === "approved" ? "secondary" : "outline"}>
                                {req.status}
                              </Badge>
                            </div>
                            <p className="text-sm">
                              <span className="font-medium">{req.medication_name}</span>
                              {req.dosage && ` - ${req.dosage}`}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Requested: {new Date(req.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          {req.status === "pending" && (
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => updateRefillStatus(req.id, "approved")}>
                                <Check className="h-4 w-4 mr-1" /> Approve
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => updateRefillStatus(req.id, "denied")}>
                                <X className="h-4 w-4 mr-1" /> Deny
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Pill className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No refill requests</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="messages" className="mt-6">
                {loading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : messages.length > 0 ? (
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <Card 
                        key={msg.id} 
                        className={!msg.is_read ? "border-primary/50 bg-primary/5" : ""}
                        onClick={() => markMessageRead(msg.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{msg.patients?.full_name || "Unknown Patient"}</span>
                              {!msg.is_read && <Badge>New</Badge>}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(msg.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="font-medium text-sm">{msg.subject}</p>
                          <p className="text-sm text-muted-foreground mt-1">{msg.content}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No patient messages</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </>
  );
};

export default Requests;
