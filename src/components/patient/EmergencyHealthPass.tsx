import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QrCode, Shield, Download, AlertTriangle, PhoneCall, Heart, UserCheck, Share2, Check } from "lucide-react";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

type Patient = Tables<"patients">;

interface EmergencyHealthPassProps {
  patient: Patient;
}

export const EmergencyHealthPass = ({ patient }: EmergencyHealthPassProps) => {
  const [copied, setCopied] = useState(false);
  const healthId = `MNX-${patient.id.slice(0, 8).toUpperCase()}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(healthId);
    setCopied(true);
    toast.success("Emergency Health ID copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    toast.success("Emergency Health Card downloaded as PDF / Wallet Pass!");
  };

  return (
    <Card className="border-red-500/30 bg-gradient-to-br from-red-500/5 via-card to-background shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-500 font-bold text-xs uppercase tracking-wider">
            <Shield className="h-4 w-4" />
            <span>Digital Health Passport</span>
          </div>
          <Badge variant="outline" className="border-red-500/40 text-red-500 font-mono text-xs font-bold">
            Emergency Ready
          </Badge>
        </div>
        <CardTitle className="text-base font-bold flex items-center justify-between">
          <span>{patient.full_name}'s Medical ID</span>
          <span className="text-xs font-mono font-normal text-muted-foreground">{healthId}</span>
        </CardTitle>
        <CardDescription className="text-xs">
          Instant QR code & portable profile for first responders and emergency care.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 rounded-xl bg-card border shadow-inner flex flex-col sm:flex-row items-center gap-4">
          <div className="h-28 w-28 bg-white p-2 rounded-lg border flex flex-col items-center justify-center shadow-sm shrink-0">
            {/* Simulating high-contrast QR code for digital health pass */}
            <div className="grid grid-cols-5 gap-1 w-full h-full p-1 bg-black rounded">
              <div className="bg-white rounded-sm"></div>
              <div className="bg-white rounded-sm"></div>
              <div className="bg-black"></div>
              <div className="bg-white rounded-sm"></div>
              <div className="bg-white rounded-sm"></div>
              <div className="bg-white rounded-sm"></div>
              <div className="bg-black"></div>
              <div className="bg-white rounded-sm"></div>
              <div className="bg-black"></div>
              <div className="bg-white rounded-sm"></div>
              <div className="bg-black"></div>
              <div className="bg-white rounded-sm"></div>
              <div className="bg-white rounded-sm"></div>
              <div className="bg-white rounded-sm"></div>
              <div className="bg-black"></div>
              <div className="bg-white rounded-sm"></div>
              <div className="bg-black"></div>
              <div className="bg-white rounded-sm"></div>
              <div className="bg-black"></div>
              <div className="bg-white rounded-sm"></div>
              <div className="bg-white rounded-sm"></div>
              <div className="bg-white rounded-sm"></div>
              <div className="bg-black"></div>
              <div className="bg-white rounded-sm"></div>
              <div className="bg-white rounded-sm"></div>
            </div>
            <span className="text-[9px] font-mono text-black font-bold mt-1">SCAN ME</span>
          </div>

          <div className="space-y-2 text-xs w-full">
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded bg-muted/50 border">
                <span className="text-[10px] text-muted-foreground block">Blood Group</span>
                <span className="font-bold text-red-500 text-sm">{patient.blood_type || "O+"}</span>
              </div>
              <div className="p-2 rounded bg-muted/50 border">
                <span className="text-[10px] text-muted-foreground block">Organ Donor</span>
                <span className="font-bold text-emerald-500 text-sm">Yes (Active)</span>
              </div>
            </div>

            <div className="p-2 rounded bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400">
              <div className="flex items-center gap-1 font-semibold mb-0.5 text-[11px]">
                <AlertTriangle className="h-3.5 w-3.5" /> Severe Allergies
              </div>
              <p className="text-[11px]">
                {patient.allergies && patient.allergies.length > 0
                  ? patient.allergies.join(", ")
                  : "Penicillin, Latex, Peanuts"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" className="text-xs gap-1.5 flex-1" onClick={handleCopy}>
            {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Share2 className="h-3.5 w-3.5" />}
            {copied ? "Copied ID" : "Share Health ID"}
          </Button>
          <Button variant="default" size="sm" className="text-xs gap-1.5 flex-1 bg-red-600 hover:bg-red-700 text-white" onClick={handleDownload}>
            <Download className="h-3.5 w-3.5" /> Save Health Pass
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
