import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2 } from "lucide-react";

type RecordType = Database["public"]["Enums"]["record_type"];

const recordSchema = z.object({
  record_type: z.enum([
    "consultation",
    "lab_result",
    "prescription",
    "imaging",
    "vaccination",
    "vital_signs",
    "diagnosis",
  ] as const),
  title: z.string().min(2, "Title must be at least 2 characters").max(200),
  description: z.string().max(2000).optional(),
  diagnosis: z.string().max(1000).optional(),
  treatment: z.string().max(1000).optional(),
  medications: z.string().optional(),
  vital_signs: z.string().optional(),
});

type RecordFormData = z.infer<typeof recordSchema>;

interface MedicalRecordFormProps {
  patientId: string;
  onSuccess?: () => void;
}

const recordTypeLabels: Record<RecordType, string> = {
  consultation: "Consultation",
  lab_result: "Lab Result",
  prescription: "Prescription",
  imaging: "Imaging/X-Ray",
  vaccination: "Vaccination",
  vital_signs: "Vital Signs",
  diagnosis: "Diagnosis",
};

const MedicalRecordForm = ({ patientId, onSuccess }: MedicalRecordFormProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const form = useForm<RecordFormData>({
    resolver: zodResolver(recordSchema),
    defaultValues: {
      record_type: "consultation",
      title: "",
      description: "",
      diagnosis: "",
      treatment: "",
      medications: "",
      vital_signs: "",
    },
  });

  const watchRecordType = form.watch("record_type");

  const onSubmit = async (data: RecordFormData) => {
    if (!user) {
      toast.error("You must be logged in");
      return;
    }

    setIsSubmitting(true);

    try {
      // Parse medications if provided
      let medicationsJson = null;
      if (data.medications) {
        const meds = data.medications.split(",").map((m) => m.trim()).filter(Boolean);
        medicationsJson = meds.map((med) => ({ name: med }));
      }

      // Parse vital signs if provided
      let vitalSignsJson = null;
      if (data.vital_signs) {
        try {
          // Try to parse as JSON first
          vitalSignsJson = JSON.parse(data.vital_signs);
        } catch {
          // If not valid JSON, create simple structure
          vitalSignsJson = { notes: data.vital_signs };
        }
      }

      const { error } = await supabase.from("medical_records").insert({
        patient_id: patientId,
        record_type: data.record_type,
        title: data.title,
        description: data.description || null,
        diagnosis: data.diagnosis || null,
        treatment: data.treatment || null,
        medications: medicationsJson,
        vital_signs: vitalSignsJson,
        created_by: user.id,
      });

      if (error) throw error;

      toast.success("Medical record added successfully");
      form.reset();
      setOpen(false);
      onSuccess?.();
    } catch (error: any) {
      console.error("Error adding medical record:", error);
      toast.error(error.message || "Failed to add medical record");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Record
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Medical Record</DialogTitle>
          <DialogDescription>
            Create a new medical record for this patient.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="record_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Record Type *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select record type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(Object.keys(recordTypeLabels) as RecordType[]).map((type) => (
                        <SelectItem key={type} value={type}>
                          {recordTypeLabels[type]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Annual checkup, Blood work results" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Detailed notes about the visit or test..." 
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {(watchRecordType === "consultation" || watchRecordType === "diagnosis") && (
              <FormField
                control={form.control}
                name="diagnosis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Diagnosis</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Clinical diagnosis..." 
                        rows={2}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {(watchRecordType === "consultation" || 
              watchRecordType === "diagnosis" || 
              watchRecordType === "prescription") && (
              <FormField
                control={form.control}
                name="treatment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Treatment Plan</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Recommended treatment..." 
                        rows={2}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {watchRecordType === "prescription" && (
              <FormField
                control={form.control}
                name="medications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medications</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter medications separated by commas (e.g., Metformin 500mg, Lisinopril 10mg)" 
                        rows={2}
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>Separate multiple medications with commas</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {watchRecordType === "vital_signs" && (
              <FormField
                control={form.control}
                name="vital_signs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vital Signs</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="BP: 120/80, HR: 72, Temp: 98.6°F, SpO2: 98%" 
                        rows={3}
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Enter vital measurements
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Record
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MedicalRecordForm;
