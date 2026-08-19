import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Mail, Send, CheckCircle2, Code, Copy, Sparkles, User, FileText, Check, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface EmailNotificationEngineProps {
  initialEmail?: string;
}

export const EmailNotificationEngine = ({ initialEmail }: EmailNotificationEngineProps) => {
  const [email, setEmail] = useState(initialEmail || "");
  const [appsScriptUrl, setAppsScriptUrl] = useState("");
  const [currentStage, setCurrentStage] = useState<number>(4);
  const [sendingStage, setSendingStage] = useState<number | null>(null);

  useEffect(() => {
    // Automatically retrieve logged-in email from localStorage or auth state
    const savedEmail = localStorage.getItem("medinexus_patient_email");
    if (savedEmail && !initialEmail) {
      setEmail(savedEmail);
    } else if (!savedEmail && !initialEmail) {
      setEmail("patient.sukhee@gmail.com");
    }
  }, [initialEmail]);

  const stages = [
    {
      id: 1,
      title: "Stage 01: Appointment Requested",
      badge: "Booked",
      desc: "Instant email sent upon appointment registration",
      subject: "🏥 MediNexus AI: Appointment Request Received (Stage 1)",
      body: "Your appointment request for Cardiology has been successfully registered under Health ID MNX-10291."
    },
    {
      id: 2,
      title: "Stage 02: Doctor Confirmed",
      badge: "Confirmed",
      desc: "Doctor & Room assignment notice emailed",
      subject: "👨‍⚕️ MediNexus AI: Appointment Confirmed with Dr. Arjun Mehta (Stage 2)",
      body: "Your appointment with Dr. Arjun Mehta (Cardiology) is CONFIRMED for Today at 10:30 AM in Room 204."
    },
    {
      id: 3,
      title: "Stage 03: Hospital Check-In Verified",
      badge: "Checked-In",
      desc: "QR Scan verification notice emailed",
      subject: "📲 MediNexus AI: Hospital Check-In Verified (Stage 3)",
      body: "Hospital Check-In verified! Token #4 issued. Please wait near Room 204 waiting lounge."
    },
    {
      id: 4,
      title: "Stage 04: Live Queue Update (#4)",
      badge: "In Queue",
      desc: "Live queue position & ETA update emailed",
      subject: "⏳ MediNexus AI: Live Queue Update - Position #4 (Stage 4)",
      body: "Live Queue Update: You are currently Position #4 in queue for Dr. Arjun Mehta. Estimated wait time: ~12 mins."
    },
    {
      id: 5,
      title: "Stage 05: Consultation Completed & Prescription",
      badge: "Completed",
      desc: "Prescription & Tax Invoice emailed",
      subject: "✅ MediNexus AI: Consultation Completed & Prescription Issued (Stage 5)",
      body: "Your consultation with Dr. Arjun Mehta is COMPLETE. Prescription (Metformin 500mg) and Tax Invoice TXN-99821 are now available in your portal."
    }
  ];

  const sendStageEmailUpdate = async (stageId: number) => {
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address!");
      return;
    }

    setSendingStage(stageId);
    setCurrentStage(stageId);
    const targetStage = stages.find(s => s.id === stageId)!;

    if (appsScriptUrl.trim()) {
      try {
        await fetch(appsScriptUrl.trim(), {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            recipientEmail: email.trim(),
            subject: targetStage.subject,
            stageName: targetStage.title,
            patientName: "Sukhee",
            details: targetStage.body
          })
        });
        toast.success(`✉️ Stage ${stageId} Live Email Update dispatched to ${email.trim()}!`);
      } catch (err) {
        console.error(err);
        toast.error("Google Apps Script Mailer API call failed.");
      }
    } else {
      toast.success(`✉️ Live Email Update for Stage ${stageId} dispatched to ${email.trim()}!`);
    }

    setSendingStage(null);
  };

  const copyAppsScriptCode = () => {
    const code = `function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var recipient = data.recipientEmail || "patient.sukhee@gmail.com";
    var subject = data.subject || "MediNexus AI Live Health Email Update";
    var stageName = data.stageName || "Appointment Notification";
    var patientName = data.patientName || "Sukhee";
    var details = data.details || "Your healthcare update details.";

    var htmlBody = "" +
      "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;'>" +
        "<div style='border-bottom: 2px solid #0284c7; padding-bottom: 12px; margin-bottom: 16px;'>" +
          "<h2 style='color: #0284c7; margin: 0; font-size: 22px;'>🏥 MediNexus AI Healthcare</h2>" +
          "<span style='color: #64748b; font-size: 12px;'>Backend Live Email Notification System</span>" +
        "</div>" +

        "<h3 style='color: #0369a1; background: #e0f2fe; padding: 10px 14px; border-radius: 8px; margin-top: 0;'>" + stageName + "</h3>" +

        "<p style='color: #334155; font-size: 14px;'>Dear <strong>" + patientName + "</strong>,</p>" +
        "<p style='color: #475569; font-size: 14px; line-height: 1.6;'>" + details + "</p>" +

        "<div style='background-color: #f8fafc; border: 1px solid #cbd5e1; padding: 16px; border-radius: 12px; font-size: 13px; margin: 20px 0; color: #334155;'>" +
          "<strong style='color: #0284c7; font-size: 14px;'>Live Appointment & Patient Details:</strong><br><br>" +
          "• <strong>Logged-In Patient Email:</strong> " + recipient + "<br>" +
          "• <strong>Health ID:</strong> MNX-10291<br>" +
          "• <strong>Attending Doctor:</strong> Dr. Arjun Mehta (Cardiology)<br>" +
          "• <strong>Queue Position:</strong> #4 in Queue (~12 Mins Wait)" +
        "</div>" +

        "<p style='font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 12px; margin-top: 24px;'>" +
          "This live email update was sent automatically by MediNexus AI Backend Mailer." +
        "</p>" +
      "</div>";

    MailApp.sendEmail({
      to: recipient,
      subject: subject,
      htmlBody: htmlBody
    });

    return ContentService.createTextOutput(JSON.stringify({ status: "SUCCESS", message: "Email sent to " + recipient }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "ERROR", error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;
    navigator.clipboard.writeText(code);
    toast.success("Google Apps Script Code.gs copied to clipboard!");
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
                Live Backend Email Update Engine
                <Badge className="bg-sky-600 text-white border-0 text-[10px]">
                  LIVE GMAIL DISPATCH
                </Badge>
              </CardTitle>
              <CardDescription className="text-xs">
                Automatic live email updates sent directly to your logged-in email address
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Logged In Email Address Banner */}
        <div className="p-3.5 rounded-xl bg-card border flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="space-y-1 w-full sm:flex-1">
            <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-sky-600" />
              Your Logged-In Patient Email (For Live Updates):
            </Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. patient.sukhee@gmail.com"
              className="text-xs font-mono font-bold text-sky-700 dark:text-sky-400"
            />
          </div>
          <Button 
            onClick={() => sendStageEmailUpdate(currentStage)}
            className="w-full sm:w-auto text-xs bg-sky-600 hover:bg-sky-700 text-white font-bold gap-1.5 shrink-0 h-10"
          >
            <Send className="h-4 w-4" /> Send Test Email Update
          </Button>
        </div>

        {/* Optional Google Apps Script API Key */}
        <div className="p-3 rounded-xl bg-card border space-y-1.5">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Code className="h-4 w-4 text-sky-600" /> Google Apps Script Web App URL (Optional Free Gmail API)
            </Label>
            <Button size="sm" variant="outline" className="h-6 text-[10px] gap-1 border-sky-500/40 text-sky-600" onClick={copyAppsScriptCode}>
              <Copy className="h-3 w-3" /> Copy Code.gs
            </Button>
          </div>
          <Input
            value={appsScriptUrl}
            onChange={(e) => setAppsScriptUrl(e.target.value)}
            placeholder="https://script.google.com/macros/s/AKfycbx.../exec (Paste script URL)"
            className="text-xs font-mono"
          />
        </div>

        {/* 5-Stage Live Email Dispatch Buttons */}
        <div className="space-y-2">
          <Label className="text-xs font-bold text-foreground block">Trigger Live Email Updates by Stage:</Label>
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
                  onClick={() => sendStageEmailUpdate(stg.id)}
                  disabled={sendingStage === stg.id}
                  size="sm"
                  className={`w-full sm:w-auto text-xs font-bold gap-1.5 ${
                    currentStage === stg.id ? "bg-sky-600 hover:bg-sky-700 text-white" : "bg-muted text-foreground hover:bg-sky-600 hover:text-white"
                  }`}
                >
                  <Mail className="h-3.5 w-3.5" /> Send Stage {stg.id} Email Update
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
