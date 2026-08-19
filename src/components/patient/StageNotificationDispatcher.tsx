import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Send, Mail, MessageSquare, CheckCircle2, Clock, Phone, Sparkles, AlertCircle, Copy, Code, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface StageNotificationDispatcherProps {
  patientEmail?: string;
  patientPhone?: string;
}

export const StageNotificationDispatcher = ({
  patientEmail = "patient.sukhee@gmail.com",
  patientPhone = "919865881000"
}: StageNotificationDispatcherProps) => {
  const [email, setEmail] = useState(patientEmail);
  const [phone, setPhone] = useState(patientPhone);
  const [appsScriptUrl, setAppsScriptUrl] = useState("");
  const [currentStage, setCurrentStage] = useState<number>(4);
  const [loadingStage, setLoadingStage] = useState<number | null>(null);

  const stages = [
    {
      id: 1,
      title: "Step 01: Appointment Booked",
      badge: "Booked",
      desc: "Initial request received & record created",
      whatsappMsg: "🏥 *MediNexus Stage 1 Alert*\nHello! Your appointment request has been BOOKED for Cardiology. Health ID: *MNX-10291*.",
      emailSubject: "MediNexus AI: Appointment Request Received (Stage 1)",
      emailBody: "Your appointment request for Cardiology has been successfully received and recorded under Health ID MNX-10291."
    },
    {
      id: 2,
      title: "Step 02: Doctor Confirmed",
      badge: "Confirmed",
      desc: "Doctor & Room assigned",
      whatsappMsg: "👨‍⚕️ *MediNexus Stage 2 Alert*\nAppointment CONFIRMED with Dr. Arjun Mehta (Cardiology).\nDate: Today at 10:30 AM (Room 204).",
      emailSubject: "MediNexus AI: Appointment Confirmed with Dr. Arjun Mehta (Stage 2)",
      emailBody: "Your appointment with Dr. Arjun Mehta has been CONFIRMED for Today at 10:30 AM in Room 204, Cardiology Department."
    },
    {
      id: 3,
      title: "Step 03: Hospital Checked-In",
      badge: "Checked-In",
      desc: "QR Scanned at hospital desk",
      whatsappMsg: "📲 *MediNexus Stage 3 Alert*\nCHECK-IN COMPLETE at Hospital Desk! Token #4 issued. Please wait near Room 204 waiting lounge.",
      emailSubject: "MediNexus AI: Hospital Check-In Verified (Stage 3)",
      emailBody: "Hospital Check-In Verified! Token #4 has been issued. Please proceed to Room 204 waiting area."
    },
    {
      id: 4,
      title: "Step 04: Waiting Queue (Current)",
      badge: "In Queue",
      desc: "Live Position #4 in Queue",
      whatsappMsg: "⏳ *MediNexus Stage 4 Alert*\nLive Queue Update: You are *Position #4 in Queue* for Dr. Arjun Mehta. Est. wait time: *~12 mins*.",
      emailSubject: "MediNexus AI: Live Queue Update - Position #4 (Stage 4)",
      emailBody: "Live Queue Update: You are currently Position #4 in line for Dr. Arjun Mehta. Estimated wait time is approximately 12 minutes."
    },
    {
      id: 5,
      title: "Step 05: Consultation & Prescription",
      badge: "Completed",
      desc: "Visit complete & Rx issued",
      whatsappMsg: "✅ *MediNexus Stage 5 Alert*\nConsultation COMPLETE! Doctor issued Prescription for Metformin 500mg & Invoice TXN-99821. Health summary updated.",
      emailSubject: "MediNexus AI: Consultation Completed & Prescription Issued (Stage 5)",
      emailBody: "Your consultation with Dr. Arjun Mehta is COMPLETE. Prescription (Metformin 500mg) and Tax Invoice TXN-99821 are now available in your portal."
    }
  ];

  const triggerStageNotification = async (stageId: number) => {
    setLoadingStage(stageId);
    setCurrentStage(stageId);

    const targetStage = stages.find(s => s.id === stageId)!;
    const cleanPhone = phone.replace(/[^0-9]/g, "");

    // 1. WhatsApp Web / API Trigger
    const waUrl = `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(targetStage.whatsappMsg)}`;
    
    // 2. Google Apps Script Email Trigger if URL present, else fallback toast + simulation
    if (appsScriptUrl.trim()) {
      try {
        await fetch(appsScriptUrl.trim(), {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            recipientEmail: email,
            subject: targetStage.emailSubject,
            stageName: targetStage.title,
            patientName: "Sukhee",
            details: targetStage.emailBody
          })
        });
        toast.success(`✉️ Stage ${stageId} Email sent via Google Apps Script to ${email}!`);
      } catch (err) {
        console.error(err);
        toast.error("Google Apps Script API call failed. Check Web App URL permissions.");
      }
    } else {
      toast.info(`✉️ [Simulated] Stage ${stageId} Email dispatched to ${email}! (Enter Apps Script Web App URL below for real Gmail sending).`);
    }

    // Launch WhatsApp Web
    window.open(waUrl, "_blank");
    toast.success(`📲 Stage ${stageId} WhatsApp notification prepared for +${cleanPhone}!`);
    setLoadingStage(null);
  };

  const copyAppsScriptCode = () => {
    const code = `function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var recipient = data.recipientEmail || "patient.sukhee@gmail.com";
    var subject = data.subject || "MediNexus AI Health Notification";
    var stageName = data.stageName || "Appointment Notification";
    var patientName = data.patientName || "Patient";
    var details = data.details || "Your healthcare notification details.";

    var htmlBody = "" +
      "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px;'>" +
        "<h2 style='color: #0284c7; margin-bottom: 5px;'>🏥 MediNexus AI Healthcare</h2>" +
        "<h4 style='color: #0369a1; border-bottom: 2px solid #0284c7; padding-bottom: 8px;'>" + stageName + "</h4>" +
        "<p>Dear <strong>" + patientName + "</strong>,</p>" +
        "<p>" + details + "</p>" +
        "<div style='background: #f1f5f9; padding: 12px; border-radius: 8px; font-size: 13px; margin: 15px 0;'>" +
          "<strong>Health ID:</strong> MNX-10291<br>" +
          "<strong>Doctor:</strong> Dr. Arjun Mehta (Cardiology)<br>" +
          "<strong>Status:</strong> Active Stage Notification" +
        "</div>" +
        "<p style='font-size: 12px; color: #64748b;'>This is an automated notification from MediNexus AI Platform.</p>" +
      "</div>";

    MailApp.sendEmail({
      to: recipient,
      subject: subject,
      htmlBody: htmlBody
    });

    return ContentService.createTextOutput(JSON.stringify({ status: "SUCCESS", message: "Email sent successfully" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "ERROR", error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;
    navigator.clipboard.writeText(code);
    toast.success("Google Apps Script (Code.gs) copied to clipboard!");
  };

  return (
    <Card className="border-sky-500/40 bg-gradient-to-br from-sky-500/10 via-card to-background shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold shadow-md">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                Multi-Stage WhatsApp & Google Apps Script Email Bot
                <Badge className="bg-sky-600 hover:bg-sky-700 text-white border-0 text-[10px]">
                  5 STAGES ACTIVE
                </Badge>
              </CardTitle>
              <CardDescription className="text-xs">
                Automatic WhatsApp & Gmail notification dispatch for every stage of patient appointment flow
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Contact Inputs */}
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1 p-3 rounded-xl bg-card border">
            <Label className="text-xs font-semibold flex items-center gap-1">
              <Mail className="h-3.5 w-3.5 text-sky-600" /> Target Patient Email
            </Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="patient.sukhee@gmail.com"
              className="text-xs font-mono"
            />
          </div>

          <div className="space-y-1 p-3 rounded-xl bg-card border">
            <Label className="text-xs font-semibold flex items-center gap-1">
              <Phone className="h-3.5 w-3.5 text-emerald-600" /> Target WhatsApp Number
            </Label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="919865881000"
              className="text-xs font-mono"
            />
          </div>
        </div>

        {/* Google Apps Script Web App URL Input */}
        <div className="p-3 rounded-xl bg-card border space-y-1.5">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Code className="h-4 w-4 text-sky-600" /> Google Apps Script Web App URL (Free Gmail Webhook API)
            </Label>
            <Button size="sm" variant="outline" className="h-6 text-[10px] gap-1 border-sky-500/40 text-sky-600" onClick={copyAppsScriptCode}>
              <Copy className="h-3 w-3" /> Copy Apps Script Code.gs
            </Button>
          </div>
          <Input
            value={appsScriptUrl}
            onChange={(e) => setAppsScriptUrl(e.target.value)}
            placeholder="https://script.google.com/macros/s/AKfycbx.../exec (Deploy as Web App)"
            className="text-xs font-mono"
          />
          <p className="text-[10px] text-muted-foreground">
            Optional: Paste your deployed Google Apps Script URL above for automatic live Gmail delivery!
          </p>
        </div>

        {/* 5-Stage Stepper Buttons */}
        <div className="space-y-2">
          <Label className="text-xs font-bold text-foreground block">Trigger Stage-by-Stage Notifications:</Label>
          <div className="grid gap-2.5">
            {stages.map((stg) => (
              <div
                key={stg.id}
                className={`p-3 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-3 transition-all ${
                  currentStage === stg.id 
                    ? "bg-sky-500/10 border-sky-500 shadow-sm" 
                    : "bg-card hover:border-sky-500/40"
                }`}
              >
                <div className="space-y-0.5 w-full sm:w-auto text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-foreground">{stg.title}</span>
                    <Badge variant={currentStage === stg.id ? "default" : "outline"} className={currentStage === stg.id ? "bg-sky-600 text-white" : ""}>
                      {stg.badge}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{stg.desc}</p>
                </div>

                <Button
                  onClick={() => triggerStageNotification(stg.id)}
                  disabled={loadingStage === stg.id}
                  size="sm"
                  className={`w-full sm:w-auto text-xs font-bold gap-1.5 ${
                    currentStage === stg.id ? "bg-sky-600 hover:bg-sky-700 text-white" : "bg-muted text-foreground hover:bg-sky-600 hover:text-white"
                  }`}
                >
                  <Send className="h-3.5 w-3.5" /> Dispatch Stage {stg.id} Alerts (WhatsApp & Email)
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
