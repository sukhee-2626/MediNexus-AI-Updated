import { useState } from "react";
import { Helmet } from "react-helmet-async";
import DashboardSidebar from "@/components/dashboard/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { 
  Stethoscope, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Plus, 
  Search, 
  Video, 
  MapPin, 
  Building2, 
  Ban, 
  AlertCircle, 
  Edit3, 
  Sliders
} from "lucide-react";

interface DoctorSchedule {
  id: string;
  name: string;
  specialty: string;
  department: string;
  room: string;
  status: "Available" | "On Break" | "On Leave" | "Emergency Duty";
  workingHours: string;
  breakHours: string;
  totalSlots: number;
  bookedSlots: number;
  availableSlots: number;
  telemedicineEnabled: boolean;
  maxPatientsPerSession: number;
  todayShift: string;
}

const mockDoctors: DoctorSchedule[] = [
  {
    id: "DOC-101",
    name: "Dr. Arjun Mehta",
    specialty: "Senior Cardiologist",
    department: "Cardiology",
    room: "Room 204",
    status: "Available",
    workingHours: "09:00 AM – 01:00 PM",
    breakHours: "01:00 PM – 02:00 PM",
    totalSlots: 20,
    bookedSlots: 12,
    availableSlots: 8,
    telemedicineEnabled: true,
    maxPatientsPerSession: 20,
    todayShift: "Morning Shift",
  },
  {
    id: "DOC-102",
    name: "Dr. Sarah Connor",
    specialty: "General Physician",
    department: "General Medicine",
    room: "Room 102",
    status: "Available",
    workingHours: "10:00 AM – 04:00 PM",
    breakHours: "01:30 PM – 02:30 PM",
    totalSlots: 25,
    bookedSlots: 18,
    availableSlots: 7,
    telemedicineEnabled: true,
    maxPatientsPerSession: 25,
    todayShift: "Day Shift",
  },
  {
    id: "DOC-103",
    name: "Dr. Ananya Roy",
    specialty: "Orthopedic Surgeon",
    department: "Orthopedics",
    room: "Room 305",
    status: "Available",
    workingHours: "08:30 AM – 02:00 PM",
    breakHours: "12:00 PM – 12:30 PM",
    totalSlots: 15,
    bookedSlots: 15,
    availableSlots: 0,
    telemedicineEnabled: false,
    maxPatientsPerSession: 15,
    todayShift: "Morning Shift",
  },
  {
    id: "DOC-104",
    name: "Dr. Vikram Seth",
    specialty: "Pediatric Specialist",
    department: "Pediatrics",
    room: "Room 108",
    status: "On Break",
    workingHours: "11:00 AM – 05:00 PM",
    breakHours: "01:00 PM – 02:00 PM",
    totalSlots: 18,
    bookedSlots: 9,
    availableSlots: 9,
    telemedicineEnabled: true,
    maxPatientsPerSession: 18,
    todayShift: "Afternoon Shift",
  },
  {
    id: "DOC-105",
    name: "Dr. Rajesh Gupta",
    specialty: "Neurologist",
    department: "Neurology",
    room: "Room 401",
    status: "On Leave",
    workingHours: "09:00 AM – 01:00 PM",
    breakHours: "N/A",
    totalSlots: 0,
    bookedSlots: 0,
    availableSlots: 0,
    telemedicineEnabled: false,
    maxPatientsPerSession: 0,
    todayShift: "On Leave Today",
  },
  {
    id: "DOC-106",
    name: "Dr. Kavita Nair",
    specialty: "Dermatologist",
    department: "Dermatology",
    room: "Room 210",
    status: "Emergency Duty",
    workingHours: "24/7 On-Call",
    breakHours: "As per shift",
    totalSlots: 10,
    bookedSlots: 4,
    availableSlots: 6,
    telemedicineEnabled: true,
    maxPatientsPerSession: 10,
    todayShift: "Emergency Call",
  },
];

const DoctorAvailability = () => {
  const [doctors, setDoctors] = useState<DoctorSchedule[]>(mockDoctors);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorSchedule | null>(null);

  const filteredDoctors = doctors.filter((doc) => {
    const matchesDept = departmentFilter === "all" || doc.department.toLowerCase() === departmentFilter.toLowerCase();
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const handleToggleTelemedicine = (id: string) => {
    setDoctors((prev) =>
      prev.map((doc) =>
        doc.id === id ? { ...doc, telemedicineEnabled: !doc.telemedicineEnabled } : doc
      )
    );
    toast.success("Telemedicine availability updated");
  };

  const handleToggleStatus = (id: string, status: DoctorSchedule["status"]) => {
    setDoctors((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, status } : doc))
    );
    toast.success(`Doctor status changed to ${status}`);
  };

  const getStatusBadge = (status: DoctorSchedule["status"]) => {
    switch (status) {
      case "Available":
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">Available</Badge>;
      case "On Break":
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/30">On Break</Badge>;
      case "On Leave":
        return <Badge variant="destructive">On Leave</Badge>;
      case "Emergency Duty":
        return <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/30">Emergency Duty</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <>
      <Helmet>
        <title>Doctor Availability & Schedules - MediNexus AI</title>
        <meta name="description" content="Manage doctor schedules, working hours, break times, and slot limits." />
      </Helmet>

      <div className="flex h-screen bg-background overflow-hidden">
        <DashboardSidebar />

        <main className="flex-1 overflow-y-auto">
          
          {/* Header Bar */}
          <div className="border-b bg-card px-8 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Doctor Availability & Slot Management</h1>
              <p className="text-xs text-muted-foreground">
                Set working hours, weekly schedules, leave blocks, and session slot capacities
              </p>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Add Doctor Schedule
            </Button>
          </div>

          <div className="p-8 space-y-8">

            {/* Overview Stats */}
            <div className="grid gap-4 sm:grid-cols-4">
              <Card className="border-border/80 shadow-sm">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Available Doctors</p>
                    <p className="text-2xl font-black text-emerald-600 mt-1">24 Active</p>
                  </div>
                  <div className="h-9 w-9 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/80 shadow-sm">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">On Break / Leave</p>
                    <p className="text-2xl font-black text-amber-600 mt-1">8 Doctors</p>
                  </div>
                  <div className="h-9 w-9 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                    <Clock className="h-5 w-5" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/80 shadow-sm">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Total Open Slots</p>
                    <p className="text-2xl font-black text-primary mt-1">88 Available</p>
                  </div>
                  <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Calendar className="h-5 w-5" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/80 shadow-sm">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Telemedicine Enabled</p>
                    <p className="text-2xl font-black text-purple-600 mt-1">18 Doctors</p>
                  </div>
                  <div className="h-9 w-9 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
                    <Video className="h-5 w-5" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filter controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search doctor or department..."
                    className="pl-9 h-9 text-xs"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="w-48 h-9 text-xs">
                    <SelectValue placeholder="Department" />
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
            </div>

            {/* Doctor Cards Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredDoctors.map((doc) => (
                <Card key={doc.id} className="relative border-border/80 hover:shadow-lg transition-all">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-11 w-11 border">
                          <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                            {doc.name.slice(4, 6).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base font-bold">{doc.name}</CardTitle>
                          <CardDescription className="text-xs">{doc.specialty}</CardDescription>
                        </div>
                      </div>
                      {getStatusBadge(doc.status)}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4 text-xs">
                    
                    <div className="p-3 rounded-xl bg-muted/40 space-y-2 border">
                      <div className="flex justify-between items-center text-muted-foreground">
                        <span>Department / Room:</span>
                        <span className="font-semibold text-foreground">{doc.department} ({doc.room})</span>
                      </div>
                      <div className="flex justify-between items-center text-muted-foreground">
                        <span>Working Hours:</span>
                        <span className="font-semibold text-foreground">{doc.workingHours}</span>
                      </div>
                      <div className="flex justify-between items-center text-muted-foreground">
                        <span>Break Window:</span>
                        <span className="font-semibold text-foreground">{doc.breakHours}</span>
                      </div>
                    </div>

                    {/* Slot Utilization Bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between font-medium">
                        <span>Session Slots</span>
                        <span className="text-primary font-bold">{doc.bookedSlots} / {doc.totalSlots} Booked ({doc.availableSlots} Left)</span>
                      </div>
                      <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            doc.availableSlots === 0 ? "bg-red-500" : "bg-primary"
                          }`}
                          style={{ width: `${(doc.bookedSlots / (doc.totalSlots || 1)) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Telemedicine & Actions Controls */}
                    <div className="pt-2 border-t flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={doc.telemedicineEnabled}
                          onCheckedChange={() => handleToggleTelemedicine(doc.id)}
                        />
                        <span className="text-[11px] text-muted-foreground font-medium">Telemedicine</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 text-xs gap-1"
                          onClick={() => handleToggleStatus(doc.id, doc.status === "Available" ? "On Break" : "Available")}
                        >
                          {doc.status === "Available" ? "Set Break" : "Set Active"}
                        </Button>
                      </div>
                    </div>

                  </CardContent>
                </Card>
              ))}
            </div>

          </div>
        </main>
      </div>
    </>
  );
};

export default DoctorAvailability;
