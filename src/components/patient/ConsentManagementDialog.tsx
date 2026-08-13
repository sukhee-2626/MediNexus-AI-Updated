import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Tables } from "@/integrations/supabase/types";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Loader2, XCircle } from "lucide-react";

type ConsentGrant = Tables<"consent_grants">;

const consentSchema = z.object({
  granted_to_email: z.string().email("Valid email required"),
  access_level: z.enum(["read", "write", "full"]),
  purpose: z.string().max(500).optional(),
  expires_at: z.string().optional(),
});

type ConsentFormData = z.infer<typeof consentSchema>;

interface ConsentManagementDialogProps {
  patientId: string;
  onSuccess?: () => void;
}

export const GrantConsentDialog = ({ patientId, onSuccess }: ConsentManagementDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const form = useForm<ConsentFormData>({
    resolver: zodResolver(consentSchema),
    defaultValues: {
      granted_to_email: "",
      access_level: "read",
      purpose: "",
      expires_at: "",
    },
  });

  const onSubmit = async (data: ConsentFormData) => {
    if (!user) {
      toast.error("You must be logged in");
      return;
    }

    setIsSubmitting(true);

    try {
      // Find the provider by email
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("user_id")
        .eq("email", data.granted_to_email)
        .single();

      if (profileError || !profile) {
        toast.error("Provider not found with that email");
        setIsSubmitting(false);
        return;
      }

      const { error } = await supabase.from("consent_grants").insert({
        patient_id: patientId,
        granted_to: profile.user_id,
        access_level: data.access_level,
        purpose: data.purpose || null,
        expires_at: data.expires_at || null,
        status: "active",
      });

      if (error) throw error;

      toast.success("Consent granted successfully");
      form.reset();
      setOpen(false);
      onSuccess?.();
    } catch (error: any) {
      console.error("Error granting consent:", error);
      toast.error(error.message || "Failed to grant consent");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Grant
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Grant Data Access</DialogTitle>
          <DialogDescription>
            Allow a healthcare provider to access this patient's medical data.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="granted_to_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provider Email *</FormLabel>
                  <FormControl>
                    <Input placeholder="provider@hospital.com" {...field} />
                  </FormControl>
                  <FormDescription>Email of the healthcare provider</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="access_level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Access Level *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select access level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="read">Read Only</SelectItem>
                      <SelectItem value="write">Read & Write</SelectItem>
                      <SelectItem value="full">Full Access</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Read: View records. Write: Add/edit records. Full: Complete access.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="purpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purpose</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="e.g., Ongoing diabetes treatment" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expires_at"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expiration Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormDescription>Leave empty for indefinite access</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Grant Access
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

interface RevokeConsentButtonProps {
  consent: ConsentGrant;
  onSuccess?: () => void;
}

export const RevokeConsentButton = ({ consent, onSuccess }: RevokeConsentButtonProps) => {
  const [isRevoking, setIsRevoking] = useState(false);

  const handleRevoke = async () => {
    setIsRevoking(true);
    try {
      const { error } = await supabase
        .from("consent_grants")
        .update({
          status: "revoked",
          revoked_at: new Date().toISOString(),
        })
        .eq("id", consent.id);

      if (error) throw error;

      toast.success("Access revoked successfully");
      onSuccess?.();
    } catch (error: any) {
      console.error("Error revoking consent:", error);
      toast.error(error.message || "Failed to revoke access");
    } finally {
      setIsRevoking(false);
    }
  };

  if (consent.status !== "active") return null;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
          <XCircle className="mr-1 h-3 w-3" />
          Revoke
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Revoke Access?</AlertDialogTitle>
          <AlertDialogDescription>
            This will immediately remove the provider's access to this patient's data. 
            This action can be undone by granting new access.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleRevoke}
            disabled={isRevoking}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isRevoking ? "Revoking..." : "Revoke Access"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
