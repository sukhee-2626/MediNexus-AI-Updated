import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Pill, Loader2 } from "lucide-react";

interface RefillRequestFormProps {
  patientId: string;
  medications?: { name: string; dosage: string }[];
  onSuccess?: () => void;
}

export const RefillRequestForm = ({ patientId, medications = [], onSuccess }: RefillRequestFormProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [medicationName, setMedicationName] = useState("");
  const [dosage, setDosage] = useState("");
  const [urgency, setUrgency] = useState("normal");

  const handleSubmit = async () => {
    if (!medicationName) {
      toast.error("Please enter medication name");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("refill_requests").insert({
        patient_id: patientId,
        medication_name: medicationName,
        dosage: dosage || null,
        urgency: urgency,
        status: "pending"
      });

      if (error) throw error;

      toast.success("Refill request submitted successfully");
      setOpen(false);
      setMedicationName("");
      setDosage("");
      setUrgency("normal");
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting refill request:", error);
      toast.error("Failed to submit refill request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Pill className="h-4 w-4" />
          Request Refill
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request Prescription Refill</DialogTitle>
          <DialogDescription>
            Submit a request to refill your prescription medication.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {medications.length > 0 ? (
            <div className="space-y-2">
              <Label>Select Medication</Label>
              <Select value={medicationName} onValueChange={(val) => {
                setMedicationName(val);
                const med = medications.find(m => m.name === val);
                if (med) setDosage(med.dosage);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose from your prescriptions" />
                </SelectTrigger>
                <SelectContent>
                  {medications.map((med) => (
                    <SelectItem key={med.name} value={med.name}>
                      {med.name} - {med.dosage}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="space-y-2">
              <Label>Medication Name</Label>
              <Input
                placeholder="Enter medication name"
                value={medicationName}
                onChange={(e) => setMedicationName(e.target.value)}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>Dosage</Label>
            <Input
              placeholder="e.g., 500mg"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Urgency</Label>
            <Select value={urgency} onValueChange={setUrgency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal - Within a week</SelectItem>
                <SelectItem value="urgent">Urgent - Need within 24-48 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Request
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
