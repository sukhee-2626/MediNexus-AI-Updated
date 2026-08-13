import { useState } from "react";
import { Helmet } from "react-helmet-async";
import DashboardSidebar from "@/components/dashboard/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { 
  CalendarCheck, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  UserX, 
  Stethoscope, 
  AlertTriangle, 
  Search, 
  Filter, 
  User, 
  FileText, 
  Brain, 
  Sparkles, 
  Plus, 
  ArrowRight,
  Video,
  MapPin,
  ShieldAlert,
  ChevronRight
} from "lucide-react";

interface AppointmentItem {
  id: string;
  patientName: string;
  patientId: string;
  healthId: string;
  age: number;
  gender: string;
  bloodGroup: string;
  phone: string;
  doctorName: string;
  department: string;
  room: string;
  time: string;
  date: string;
  consultationType: "In-person" | "Telemedicine";
  reason: string;
  symptoms: string[];
  duration: string;
  severity: "High" | "Moderate" | "Low";
  status: "Booked" | "Confirmed" | "Checked-in" | "Waiting" | "With Doctor" | "Completed" | "Cancelled" | "No-show";
  queuePosition?: number;
  waitTimeMins?: number;
  priority: "HIGH" | "NORMAL";
  medicalContext: {
    conditions: string[];
    allergies: string[];
    medications: string[];
    previousVisits: number;
  };
  aiInsight: {
    riskAssessment: string;
    suggestedPriority: string;
    expectedDelayMins: number;
  };
}

const mockAppointments: AppointmentItem[] = [
  {
    id: "APT-10245",
    patientName: "Kumar Rajesh",
    patientId: "P-8821",
    healthId: "MNX-10291",
    age: 34,
    gender: "Male",
    bloodGroup: "O+",
    phone: "+91 98765 43210",
    doctorName: "Dr. Arjun Mehta",
    department: "Cardiology",
    room: "Room 204",
    time: "10:30 AM",
    date: "Today",
    consultationType: "In-person",
    reason: "Chest pain and dizziness",
    symptoms: ["Chest pain", "Shortness of breath", "Dizziness"],
    duration: "2 days",
    severity: "High",
    status: "Waiting",
    queuePosition: 1,
    waitTimeMins: 18,
    priority: "HIGH",
    medicalContext: {
      conditions: ["Hypertension", "Borderline Cholesterol"],
      allergies: ["Penicillin"],
      medications: ["Amlodipine 5mg", "Aspirin 75mg"],
      previousVisits: 3,
    },
    aiInsight: {
      riskAssessment: "High-risk acute symptom combination. Requires prompt physician evaluation.",
      suggestedPriority: "HIGH",
      expectedDelayMins: 5,
    },
  },
  {
    id: "APT-10246",
    patientName: "Priya Sharma",
    patientId: "P-8822",
    healthId: "MNX-10292",
    age: 29,
    gender: "Female",
    bloodGroup: "A+",
    phone: "+91 98123 45678",
    doctorName: "Dr. Sarah Connor",
    department: "General Medicine",
    room: "Room 102",
    time: "10:45 AM",
    date: "Today",
    consultationType: "Telemedicine",
    reason: "High fever and persistent cough",
    symptoms: ["Fever (101°F)", "Dry Cough", "Body ache"],
    duration: "4 days",
    severity: "Moderate",
    status: "Checked-in",
    queuePosition: 2,
    waitTimeMins: 11,
    priority: "NORMAL",
    medicalContext: {
      conditions: ["Mild Asthma"],
      allergies: ["Dust Mites"],
      medications: ["Inhaler (as needed)"],
      previousVisits: 1,
    },
    aiInsight: {
      riskAssessment: "Seasonal respiratory viral symptoms. Standard outpatient protocol recommended.",
      suggestedPriority: "NORMAL",
      expectedDelayMins: 10,
    },
  },
  {
    id: "APT-10247",
    patientName: "Ravi Kumar",
    patientId: "P-8823",
    healthId: "MNX-10293",
    age: 52,
    gender: "Male",
    bloodGroup: "B+",
    phone: "+91 97654 32109",
    doctorName: "Dr. Ananya Roy",
    department: "Orthopedics",
    room: "Room 305",
    time: "11:00 AM",
    date: "Today",
    consultationType: "In-person",
    reason: "Severe knee joint stiffness after injury",
    symptoms: ["Joint pain", "Swelling", "Difficulty walking"],
    duration: "1 week",
    severity: "Moderate",
    status: "With Doctor",
    waitTimeMins: 25,
    priority: "NORMAL",
    medicalContext: {
      conditions: ["Type 2 Diabetes"],
      allergies: ["Sulfa drugs"],
      medications: ["Metformin 500mg"],
      previousVisits: 5,
    },
    aiInsight: {
      riskAssessment: "Post-traumatic joint inflammation. X-ray / MRI evaluation advised.",
      suggestedPriority: "NORMAL",
      expectedDelayMins: 0,
    },
  },
  {
    id: "APT-10248",
    patientName: "Meena Patel",
    patientId: "P-8824",
    healthId: "MNX-10294",
    age: 45,
    gender: "Female",
    bloodGroup: "AB+",
    phone: "+91 98989 12345",
    doctorName: "Dr. Vikram Seth",
    department: "Pediatrics",
    room: "Room 108",
    time: "11:30 AM",
    date: "Today",
    consultationType: "In-person",
    reason: "Routine growth checkup & vaccination",
    symptoms: ["None - Preventive"],
    duration: "N/A",
    severity: "Low",
    status: "Booked",
    priority: "NORMAL",
    medicalContext: {
      conditions: ["None"],
      allergies: ["None known"],
      medications: ["Multivitamins"],
      previousVisits: 2,
    },
    aiInsight: {
      riskAssessment: "Preventive routine visit. Zero risk indicators.",
      suggestedPriority: "NORMAL",
      expectedDelayMins: 0,
    },
  },
  {
    id: "APT-10249",
    patientName: "Suresh Verma",
    patientId: "P-8825",
    healthId: "MNX-10295",
    age: 61,
    gender: "Male",
    bloodGroup: "O-",
    phone: "+91 94567 89012",
    doctorName: "Dr. Arjun Mehta",
    department: "Cardiology",
    room: "Room 204",
    time: "09:30 AM",
    date: "Today",
    consultationType: "In-person",
    reason: "Hypertension follow-up consultation",
    symptoms: ["Occasional headache"],
    duration: "Chronic",
    severity: "Low",
    status: "Completed",
    priority: "NORMAL",
    medicalContext: {
      conditions: ["Hypertension"],
      allergies: ["None"],
      medications: ["Telmisartan 40mg"],
      previousVisits: 8,
    },
    aiInsight: {
      riskAssessment: "Blood pressure stabilized. Routine prescription refill verified.",
      suggestedPriority: "NORMAL",
      expectedDelayMins: 0,
    },
  },
];

const Appointments = () => {
  const [appointments, setAppointments] = useState<AppointmentItem[]>(mockAppointments);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentItem | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [userRole, setUserRole] = useState<"admin" | "receptionist" | "doctor">("admin");

  const filteredAppointments = appointments.filter((apt) => {
    const matchesStatus = statusFilter === "all" || apt.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesDept = departmentFilter === "all" || apt.department.toLowerCase() === departmentFilter.toLowerCase();
    const matchesSearch = apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          apt.healthId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          apt.doctorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesDept && matchesSearch;
  });

  const handleUpdateStatus = (id: string, newStatus: AppointmentItem["status"]) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: newStatus } : apt))
    );
    if (selectedAppointment && selectedAppointment.id === id) {
      setSelectedAppointment({ ...selectedAppointment, status: newStatus });
    }
    toast.success(`Appointment status updated to ${newStatus}`);
  };

  const getStatusBadge = (status: AppointmentItem["status"]) => {
    switch (status) {
      case "Waiting":
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/30">Waiting</Badge>;
      case "Checked-in":
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/30">Checked-in</Badge>;
      case "With Doctor":
        return <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/30">With Doctor</Badge>;
      case "Completed":
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">Completed</Badge>;
      case "Booked":
        return <Badge variant="outline" className="text-muted-foreground">Booked</Badge>;
      case "Cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <>
      <Helmet>
        <title>Appointments & Doctor Availability - MediNexus AI</title>
        <meta name="description" content="Manage appointments, live patient queues, doctor schedules, and patient case analysis." />
      </Helmet>

      <div className="flex h-screen bg-background overflow-hidden">
        <DashboardSidebar />

        <main className="flex-1 overflow-y-auto">
          
          {/* Header Bar */}
          <div className="border-b bg-card px-8 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Appointments & Doctor Management</h1>
                <Badge variant="outline" className="text-xs border-primary/30 text-primary">Live Queue Active</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Hospital Command Center • Smart Queue & Patient Case Intelligence
              </p>
            </div>

            {/* Role Switcher Preview */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-muted-foreground">Role View:</span>
              <Select value={userRole} onValueChange={(v: any) => setUserRole(v)}>
                <SelectTrigger className="w-[160px] h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Hospital Admin</SelectItem>
                  <SelectItem value="receptionist">Receptionist</SelectItem>
                  <SelectItem value="doctor">Doctor Command View</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="p-8 space-y-8">

            {/* Top Metric Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="border-border/80 shadow-sm">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Today's Appointments</p>
                    <p className="text-2xl font-black text-foreground mt-1">248</p>
                    <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">+14% vs yesterday</p>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                    <CalendarCheck className="h-5 w-5" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/80 shadow-sm">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Completed / Waiting</p>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl font-black text-emerald-600">162</span>
                      <span className="text-sm font-bold text-amber-600">/ 31 waiting</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">31 in live waiting queue</p>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                    <Clock className="h-5 w-5" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/80 shadow-sm">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Available Doctors</p>
                    <p className="text-2xl font-black text-purple-600 mt-1">24 / 32</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">8 doctors currently in break/leave</p>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                    <Stethoscope className="h-5 w-5" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/80 shadow-sm">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Emergency / Avg Wait</p>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl font-black text-red-600">5 High</span>
                      <span className="text-sm font-bold text-foreground">/ 27m wait</span>
                    </div>
                    <p className="text-[11px] text-red-600 font-semibold mt-0.5">5 acute triage cases</p>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-red-500/10 text-red-600 flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filter & Search Bar */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg font-bold">Live Appointment Queue & Cases</CardTitle>
                    <CardDescription className="text-xs">
                      Monitor patient status, queue order, priority triage, and clinical case summaries
                    </CardDescription>
                  </div>
                  <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" /> Book New Appointment
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                
                {/* Search & Select Controls */}
                <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search patient, Health ID, doctor..."
                      className="pl-9 h-9 text-xs"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="waiting">Waiting in Queue</SelectItem>
                      <SelectItem value="checked-in">Checked-in</SelectItem>
                      <SelectItem value="with doctor">With Doctor</SelectItem>
                      <SelectItem value="booked">Booked</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Filter by department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="cardiology">Cardiology</SelectItem>
                      <SelectItem value="general medicine">General Medicine</SelectItem>
                      <SelectItem value="orthopedics">Orthopedics</SelectItem>
                      <SelectItem value="pediatrics">Pediatrics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Table */}
                <div className="rounded-xl border overflow-hidden">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-muted/50 border-b text-muted-foreground font-semibold">
                        <th className="py-3 px-4">APT ID / Priority</th>
                        <th className="py-3 px-4">Patient Info</th>
                        <th className="py-3 px-4">Doctor & Dept</th>
                        <th className="py-3 px-4">Time & Room</th>
                        <th className="py-3 px-4">Reason / Symptoms</th>
                        <th className="py-3 px-4">Status & Queue</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredAppointments.map((apt) => (
                        <tr
                          key={apt.id}
                          className="hover:bg-muted/30 transition-colors cursor-pointer"
                          onClick={() => setSelectedAppointment(apt)}
                        >
                          <td className="py-3.5 px-4">
                            <div className="flex flex-col gap-1">
                              <span className="font-mono font-bold text-foreground">{apt.id}</span>
                              {apt.priority === "HIGH" ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20 w-fit">
                                  <AlertTriangle className="h-3 w-3" /> HIGH PRIORITY
                                </span>
                              ) : (
                                <span className="text-[10px] text-muted-foreground">Normal</span>
                              )}
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                                  {apt.patientName.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-bold text-foreground">{apt.patientName}</p>
                                <p className="text-[10px] font-mono text-muted-foreground">{apt.healthId} • {apt.age}y/{apt.gender}</p>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <p className="font-semibold text-foreground">{apt.doctorName}</p>
                            <p className="text-[11px] text-muted-foreground">{apt.department}</p>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5 text-foreground font-medium">
                              {apt.consultationType === "Telemedicine" ? (
                                <Video className="h-3.5 w-3.5 text-indigo-500" />
                              ) : (
                                <MapPin className="h-3.5 w-3.5 text-emerald-500" />
                              )}
                              <span>{apt.time}</span>
                            </div>
                            <p className="text-[10px] text-muted-foreground">{apt.room}</p>
                          </td>

                          <td className="py-3.5 px-4 max-w-[200px]">
                            <p className="font-semibold truncate text-foreground">{apt.reason}</p>
                            <div className="flex flex-wrap gap-1 mt-0.5">
                              {apt.symptoms.slice(0, 2).map((s, idx) => (
                                <span key={idx} className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex flex-col gap-1">
                              {getStatusBadge(apt.status)}
                              {apt.queuePosition && (
                                <span className="text-[10px] text-muted-foreground font-medium">
                                  Pos #{apt.queuePosition} • Est. {apt.waitTimeMins}m wait
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 text-xs gap-1"
                              onClick={() => setSelectedAppointment(apt)}
                            >
                              View Case
                              <ChevronRight className="h-3.5 w-3.5" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </CardContent>
            </Card>

          </div>
        </main>
      </div>

      {/* Patient Case View & Appointment Detail Modal */}
      {selectedAppointment && (
        <Dialog open={!!selectedAppointment} onOpenChange={() => setSelectedAppointment(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-6">
            
            {/* Modal Header */}
            <DialogHeader className="border-b pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold px-2.5 py-1 rounded bg-muted text-foreground">
                    {selectedAppointment.id}
                  </span>
                  {selectedAppointment.priority === "HIGH" && (
                    <Badge variant="destructive" className="gap-1">
                      <AlertTriangle className="h-3.5 w-3.5" /> HIGH PRIORITY CASE
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(selectedAppointment.status)}
                </div>
              </div>
              <DialogTitle className="text-xl font-bold mt-2">
                Patient Case Summary & Appointment Details
              </DialogTitle>
              <DialogDescription className="text-xs">
                Comprehensive patient medical context, reason for visit, AI triage insights, and queue management
              </DialogDescription>
            </DialogHeader>

            {/* Status Stepper Progress Bar */}
            <div className="py-4 border-b">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                Appointment Journey Stepper
              </p>
              <div className="grid grid-cols-5 gap-2 text-center text-xs">
                {["Booked", "Checked-in", "Waiting", "With Doctor", "Completed"].map((st, idx) => {
                  const isCurrent = selectedAppointment.status === st;
                  const isPast = ["Booked", "Checked-in", "Waiting", "With Doctor", "Completed"].indexOf(selectedAppointment.status) > idx;
                  return (
                    <div
                      key={st}
                      className={`p-2 rounded-lg border font-semibold transition-all ${
                        isCurrent ? "bg-primary text-primary-foreground shadow" : isPast ? "bg-primary/10 text-primary border-primary/30" : "bg-muted/40 text-muted-foreground"
                      }`}
                    >
                      <p className="text-[10px] opacity-75">Step 0{idx + 1}</p>
                      <p>{st}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-6 py-4">

              {/* Patient Basic Profile Card */}
              <div className="p-4 rounded-xl border bg-muted/20 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <p className="text-muted-foreground">Patient Name</p>
                  <p className="font-bold text-sm text-foreground">{selectedAppointment.patientName}</p>
                  <p className="font-mono text-[11px] text-primary">{selectedAppointment.healthId}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Age / Gender</p>
                  <p className="font-semibold text-foreground">{selectedAppointment.age} Yrs • {selectedAppointment.gender}</p>
                  <p className="text-muted-foreground">Blood: <span className="font-bold text-foreground">{selectedAppointment.bloodGroup}</span></p>
                </div>
                <div>
                  <p className="text-muted-foreground">Assigned Doctor</p>
                  <p className="font-bold text-foreground">{selectedAppointment.doctorName}</p>
                  <p className="text-muted-foreground">{selectedAppointment.department} • {selectedAppointment.room}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Appointment Slot</p>
                  <p className="font-bold text-foreground">{selectedAppointment.time} ({selectedAppointment.date})</p>
                  <p className="text-xs text-indigo-600 font-medium">{selectedAppointment.consultationType}</p>
                </div>
              </div>

              {/* Current Problem & Symptoms View */}
              <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-3">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-xs">
                  <AlertTriangle className="h-4 w-4" />
                  CURRENT VISIT REASON & SYMPTOMS
                </div>
                <div className="grid sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-muted-foreground">Reason for Visit:</p>
                    <p className="font-bold text-foreground text-sm">{selectedAppointment.reason}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Symptoms & Duration:</p>
                    <p className="font-semibold text-foreground">{selectedAppointment.symptoms.join(", ")} ({selectedAppointment.duration})</p>
                  </div>
                </div>
              </div>

              {/* Medical Context (Existing Conditions, Allergies, Medications) */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Medical Context & History
                </h4>
                <div className="grid sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-lg border bg-card">
                    <p className="font-semibold text-muted-foreground mb-1">Existing Conditions</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedAppointment.medicalContext.conditions.map((c, i) => (
                        <Badge key={i} variant="secondary">{c}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg border bg-card">
                    <p className="font-semibold text-red-600 mb-1">Allergies Warning</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedAppointment.medicalContext.allergies.map((a, i) => (
                        <Badge key={i} variant="destructive">{a}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg border bg-card">
                    <p className="font-semibold text-muted-foreground mb-1">Current Medications</p>
                    <p className="text-foreground">{selectedAppointment.medicalContext.medications.join(", ")}</p>
                  </div>
                </div>
              </div>

              {/* AI Operational & Clinical Insights */}
              <div className="p-4 rounded-xl border border-indigo-500/30 bg-indigo-500/5 space-y-2">
                <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs">
                  <Brain className="h-4 w-4" />
                  AI OPERATIONAL & CLINICAL INSIGHT
                </div>
                <p className="text-xs text-foreground font-medium">
                  {selectedAppointment.aiInsight.riskAssessment}
                </p>
                <div className="flex items-center gap-4 text-[11px] text-muted-foreground pt-1">
                  <span>Priority Recommendation: <strong className="text-primary">{selectedAppointment.aiInsight.suggestedPriority}</strong></span>
                  <span>Estimated Delay: <strong>{selectedAppointment.aiInsight.expectedDelayMins} mins</strong></span>
                </div>
              </div>

              {/* Quick Status Action Buttons */}
              <div className="pt-4 border-t flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant={selectedAppointment.status === "Checked-in" ? "default" : "outline"}
                    onClick={() => handleUpdateStatus(selectedAppointment.id, "Checked-in")}
                  >
                    Check In Patient
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedAppointment.status === "Waiting" ? "default" : "outline"}
                    onClick={() => handleUpdateStatus(selectedAppointment.id, "Waiting")}
                  >
                    Set to Waiting Queue
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedAppointment.status === "With Doctor" ? "default" : "outline"}
                    onClick={() => handleUpdateStatus(selectedAppointment.id, "With Doctor")}
                  >
                    Call to Doctor Room
                  </Button>
                  <Button
                    size="sm"
                    variant="emerald"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => handleUpdateStatus(selectedAppointment.id, "Completed")}
                  >
                    Mark Consultation Completed
                  </Button>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedAppointment(null)}>
                  Close
                </Button>
              </div>

            </div>

          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default Appointments;
