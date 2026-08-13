import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Calendar as CalendarIcon, Plus, Loader2, Brain, Sparkles, Video, MapPin, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { generateGeminiPreTriage, hasGeminiApiKey } from "@/lib/gemini";

interface AppointmentRequestFormProps {
  patientId: string;
  onSuccess?: () => void;
}

const departments = [
  "General Medicine",
  "Cardiology",
  "Orthopedics",
  "Pediatrics",
  "Neurology",
  "Dermatology",
  "ENT & Allergy"
];

const doctorsByDept: Record<string, string[]> = {
  "Cardiology": ["Dr. Arjun Mehta (Senior Cardiologist)", "Dr. Preeti Nair"],
  "General Medicine": ["Dr. Sarah Connor (General Physician)", "Dr. Ramesh Gupta"],
  "Orthopedics": ["Dr. Ananya Roy (Orthopedic Surgeon)"],
  "Pediatrics": ["Dr. Vikram Seth (Pediatric Specialist)"],
  "Neurology": ["Dr. Rajesh Gupta (Neurologist)"],
  "Dermatology": ["Dr. Kavita Nair (Dermatologist)"],
  "ENT & Allergy": ["Dr. Alok Nath"],
};

const timeSlots = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM"
];

export const AppointmentRequestForm = ({ patientId, onSuccess }: AppointmentRequestFormProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzingAi, setIsAnalyzingAi] = useState(false);
  const [date, setDate] = useState<Date>();
  const [department, setDepartment] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [consultationType, setConsultationType] = useState<"In-person" | "Telemedicine">("In-person");
  const [preferredTime, setPreferredTime] = useState("");
  const [symptomsInput, setSymptomsInput] = useState("");
  const [aiRecommendation, setAiRecommendation] = useState<string | null>(null);

  const handleSymptomsBlur = async () => {
    if (!symptomsInput.trim()) return;
    setIsAnalyzingAi(true);
    try {
      const triage = await generateGeminiPreTriage(symptomsInput);
      setDepartment(triage.department);
      setAiRecommendation(`Gemini AI Pre-Triage: Recommended Department → ${triage.department} (${triage.urgency} Priority). ${triage.reasoning}`);
      toast.success(`Gemini AI pre-triage: ${triage.department} selected`);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzingAi(false);
    }
  };

  const handleSubmit = async () => {
    if (!date || !department) {
      toast.error("Please select a department and preferred date");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: providers } = await supabase
        .from("profiles")
        .select("user_id")
        .limit(1);

      const providerId = providers?.[0]?.user_id || "00000000-0000-0000-0000-000000000000";

      const { error } = await supabase.from("appointments").insert({
        patient_id: patientId,
        provider_id: providerId,
        appointment_type: `${department} (${consultationType})`,
        preferred_date: format(date, "yyyy-MM-dd"),
        preferred_time: preferredTime || "10:00 AM",
        notes: symptomsInput || null,
        status: "pending"
      });

      if (error) throw error;

      toast.success("Smart Appointment request booked successfully! Check live queue status in portal.");
      setOpen(false);
      setDate(undefined);
      setDepartment("");
      setSelectedDoctor("");
      setPreferredTime("");
      setSymptomsInput("");
      setAiRecommendation(null);
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting appointment:", error);
      toast.error("Failed to submit appointment request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 shadow-md shadow-primary/20">
          <Plus className="h-4 w-4" />
          Book Smart Appointment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Book Smart Appointment & Gemini AI Pre-Triage
          </DialogTitle>
          <DialogDescription className="text-xs">
            Select department, doctor availability, consultation mode, and symptoms for AI routing.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-3 text-xs">
          
          {/* Symptoms & Visit Reason */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold">Symptoms / Reason for Visit</Label>
              {isAnalyzingAi && (
                <span className="text-[10px] text-primary flex items-center gap-1 font-semibold animate-pulse">
                  <Brain className="h-3 w-3 animate-spin" /> Gemini AI Triage Analyzing...
                </span>
              )}
            </div>
            <Textarea
              placeholder="e.g. Chest pain with mild dizziness for 2 days..."
              value={symptomsInput}
              onChange={(e) => setSymptomsInput(e.target.value)}
              onBlur={handleSymptomsBlur}
              rows={2}
              className="text-xs"
            />
          </div>

          {/* AI Pre-Triage Recommendation Banner */}
          {aiRecommendation && (
            <div className="p-3 rounded-lg border border-primary/30 bg-primary/10 flex items-start gap-2 text-primary">
              <Brain className="h-4 w-4 shrink-0 mt-0.5" />
              <span className="font-medium text-[11px] leading-relaxed">{aiRecommendation}</span>
            </div>
          )}

          {/* Consultation Type Selector */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Consultation Mode</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setConsultationType("In-person")}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-semibold transition-all ${
                  consultationType === "In-person" ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground"
                }`}
              >
                <MapPin className="h-4 w-4" /> In-person Hospital Visit
              </button>
              <button
                type="button"
                onClick={() => setConsultationType("Telemedicine")}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-semibold transition-all ${
                  consultationType === "Telemedicine" ? "border-indigo-500 bg-indigo-500/10 text-indigo-600" : "border-border bg-card text-muted-foreground"
                }`}
              >
                <Video className="h-4 w-4" /> Telemedicine Video Call
              </button>
            </div>
          </div>

          {/* Department Selector */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Medical Department</Label>
            <Select value={department} onValueChange={(val) => { setDepartment(val); setSelectedDoctor(""); }}>
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Doctor Selector */}
          {department && doctorsByDept[department] && (
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Select Available Doctor</Label>
              <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                <SelectTrigger className="text-xs">
                  <SelectValue placeholder="Select Available Specialist" />
                </SelectTrigger>
                <SelectContent>
                  {doctorsByDept[department].map((doc) => (
                    <SelectItem key={doc} value={doc}>{doc}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Preferred Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Preferred Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left text-xs font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                    {date ? format(date, "PPP") : "Pick date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(d) => d < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Available Time Slot</Label>
              <Select value={preferredTime} onValueChange={setPreferredTime}>
                <SelectTrigger className="text-xs">
                  <SelectValue placeholder="Select Time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

        </div>

        <div className="flex justify-end gap-2 pt-2 border-t">
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
          <Button size="sm" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm & Join Queue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
