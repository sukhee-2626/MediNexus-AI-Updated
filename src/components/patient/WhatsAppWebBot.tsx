import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Send, Phone, Clock, MessageSquare, ExternalLink, Play, Square, CheckCircle2, Zap, HelpCircle, Copy, Info } from "lucide-react";
import { toast } from "sonner";

export const WhatsAppWebBot = () => {
  // Pre-filled with user's Indian number: 919865881000
  const [phoneNumber, setPhoneNumber] = useState("919865881000");
  const [callMeBotApiKey, setCallMeBotApiKey] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("queue");
  const [customMessage, setCustomMessage] = useState("");
  const [autoBotActive, setAutoBotActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(30);
  const [countdown, setCountdown] = useState(0);
  const [showSetupGuide, setShowSetupGuide] = useState(true);

  const templates = {
    queue: "🏥 *MediNexus Live Queue Update*\nPatient: Sukhee\nDoctor: Dr. Arjun Mehta (Cardiology)\nQueue Position: *#4*\nEst. Wait: *~12 mins*\nRoom: 204",
    prescription: "💊 *MediNexus Pharmacy Alert*\nPrescription: Metformin 500mg (1 Tablet daily)\nStatus: *READY FOR PICKUP*\nPharmacy: City Care Pharmacy",
    diagnostics: "🤖 *MediNexus AI Health Summary*\nOverall Health Score: *94/100*\nVitals: BP 120/80 (Normal), Heart Rate 72 BPM\nNo critical health alerts detected.",
    emergency: "🚨 *MediNexus Digital Emergency Pass*\nHealth ID: *MNX-10291*\nBlood Group: *O+*\nSevere Allergies: *Penicillin*\nEmergency Contact: +91 9865881000"
  };

  const activeMessageText = customMessage.trim() || templates[selectedTemplate as keyof typeof templates];

  // Auto-bot timer handler
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoBotActive && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (autoBotActive && countdown === 0) {
      if (callMeBotApiKey) {
        sendViaFreeApi();
      } else {
        sendViaWhatsAppWeb();
      }
      toast.success("⏰ Scheduled WhatsApp Bot message triggered!");
      setCountdown(timerSeconds);
    }
    return () => clearInterval(interval);
  }, [autoBotActive, countdown, timerSeconds, callMeBotApiKey]);

  const startAutoBot = () => {
    if (!phoneNumber) {
      toast.error("Please enter a valid mobile number for WhatsApp");
      return;
    }
    setAutoBotActive(true);
    setCountdown(timerSeconds);
    toast.success(`WhatsApp Bot scheduled! Firing every ${timerSeconds} seconds.`);
  };

  const stopAutoBot = () => {
    setAutoBotActive(false);
    setCountdown(0);
    toast.info("WhatsApp Bot timer stopped.");
  };

  const sendViaWhatsAppWeb = () => {
    const cleanPhone = phoneNumber.replace(/[^0-9]/g, "");
    const encodedText = encodeURIComponent(activeMessageText);
    
    // WhatsApp Web Direct URL format
    const webUrl = `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;
    const mobileUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;
    
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const finalUrl = isMobile ? mobileUrl : webUrl;

    window.open(finalUrl, "_blank");
    toast.success("Opening WhatsApp Web with pre-loaded message!");
  };

  const sendViaFreeApi = async () => {
    const cleanPhone = phoneNumber.replace(/[^0-9]/g, "");
    if (!cleanPhone) {
      toast.error("Please enter phone number with country code (e.g. 919865881000)");
      return;
    }

    if (!callMeBotApiKey) {
      toast.info("CallMeBot API Key omitted. Launching WhatsApp Web direct sender...");
      sendViaWhatsAppWeb();
      return;
    }

    try {
      toast.loading("Sending automated WhatsApp message via CallMeBot Free API...");
      const apiUrl = `https://api.callmebot.com/whatsapp.php?phone=+${cleanPhone}&text=${encodeURIComponent(activeMessageText)}&apikey=${callMeBotApiKey}`;
      
      await fetch(apiUrl, { mode: "no-cors" });
      toast.dismiss();
      toast.success(`WhatsApp message sent via CallMeBot API to +${cleanPhone}!`);
    } catch (err) {
      console.error(err);
      toast.dismiss();
      toast.error("API call failed. Opening WhatsApp Web fallback...");
      sendViaWhatsAppWeb();
    }
  };

  const copyCallMeBotActivationText = () => {
    navigator.clipboard.writeText("I allow callmebot to send me messages");
    toast.success("Copied activation message: 'I allow callmebot to send me messages'");
  };

  const openCallMeBotContact = () => {
    const url = `https://api.whatsapp.com/send?phone=+34694234184&text=${encodeURIComponent("I allow callmebot to send me messages")}`;
    window.open(url, "_blank");
    toast.info("Opening WhatsApp chat with CallMeBot (+34 694 23 41 84)...");
  };

  return (
    <Card className="border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 via-card to-background shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-md">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                WhatsApp Web Bot & CallMeBot Free API
                <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white border-0 text-[10px]">
                  +91 9865881000
                </Badge>
              </CardTitle>
              <CardDescription className="text-xs">
                Direct WhatsApp Web 1-click messaging & CallMeBot automated API controller
              </CardDescription>
            </div>
          </div>

          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs gap-1 text-emerald-700 border-emerald-500/40 hover:bg-emerald-500/10"
            onClick={() => setShowSetupGuide(!showSetupGuide)}
          >
            <HelpCircle className="h-3.5 w-3.5" />
            {showSetupGuide ? "Hide Setup Guide" : "CallMeBot API Setup"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* Step-by-Step CallMeBot Free API Setup Instructions */}
        {showSetupGuide && (
          <div className="p-4 rounded-xl bg-card border-2 border-emerald-500/30 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 text-xs">
                <Info className="h-4 w-4" /> 
                How to get your Free CallMeBot API Key (2-Minute Setup):
              </span>
              <Badge variant="secondary" className="text-[10px]">Personal Free Use</Badge>
            </div>

            <ol className="space-y-2 list-decimal list-inside text-muted-foreground leading-relaxed">
              <li>
                <strong className="text-foreground">Add Contact on WhatsApp</strong>: Add <code>+34 694 23 41 84</code> to your WhatsApp contacts.
              </li>
              <li>
                <strong className="text-foreground">Send Activation Message</strong>: Send this exact message to <code>+34 694 23 41 84</code> on WhatsApp:
                <div className="mt-1.5 flex items-center gap-2">
                  <code className="p-1.5 rounded bg-muted text-foreground font-mono font-bold text-[11px]">
                    I allow callmebot to send me messages
                  </code>
                  <Button size="sm" variant="outline" className="h-7 text-[11px] gap-1" onClick={copyCallMeBotActivationText}>
                    <Copy className="h-3 w-3" /> Copy Text
                  </Button>
                  <Button size="sm" className="h-7 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white gap-1" onClick={openCallMeBotContact}>
                    <ExternalLink className="h-3 w-3" /> Open in WhatsApp
                  </Button>
                </div>
              </li>
              <li>
                <strong className="text-foreground">Get Your APIKey</strong>: Wait ~1 minute. CallMeBot will reply with: 
                <span className="text-emerald-600 font-mono font-bold"> "API Activated for your phone number. Your APIKEY is XXXXXX"</span>.
              </li>
              <li>
                <strong className="text-foreground">Paste APIKey below</strong>: Enter the received APIKey into the APIKey field below!
              </li>
            </ol>
          </div>
        )}

        {/* Phone & API Key Form */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Phone Number Input */}
          <div className="space-y-1.5 p-3 rounded-xl bg-card border">
            <Label className="text-xs font-semibold flex items-center gap-1.5 text-foreground">
              <Phone className="h-3.5 w-3.5 text-emerald-600" />
              Your WhatsApp Mobile Number (Target: Indian +91 9865881000)
            </Label>
            <Input 
              value={phoneNumber} 
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="919865881000"
              className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400"
            />
            <p className="text-[10px] text-muted-foreground">
              Format: Country code + 10 digit number (e.g. <code>919865881000</code>).
            </p>
          </div>

          {/* CallMeBot API Key Input */}
          <div className="space-y-1.5 p-3 rounded-xl bg-card border">
            <Label className="text-xs font-semibold flex items-center gap-1.5 text-foreground">
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              CallMeBot APIKey (Optional for Automated API Call)
            </Label>
            <Input 
              value={callMeBotApiKey} 
              onChange={(e) => setCallMeBotApiKey(e.target.value)}
              placeholder="e.g. xGuN3MwvSA6L (From CallMeBot activation)"
              className="text-xs font-mono"
            />
            <p className="text-[10px] text-muted-foreground">
              If blank, use <strong>WhatsApp Web 1-Click Sender</strong> to send directly from browser!
            </p>
          </div>
        </div>

        {/* Message Payload Selector */}
        <div className="space-y-2 p-4 rounded-xl bg-muted/40 border">
          <Label className="text-xs font-bold text-foreground block">Select Health Message Payload to Send:</Label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Button 
              type="button" 
              variant={selectedTemplate === "queue" ? "default" : "outline"}
              className={`text-xs h-9 ${selectedTemplate === "queue" ? "bg-emerald-600 hover:bg-emerald-700" : ""}`}
              onClick={() => { setSelectedTemplate("queue"); setCustomMessage(""); }}
            >
              📌 Live Queue #4
            </Button>
            <Button 
              type="button" 
              variant={selectedTemplate === "prescription" ? "default" : "outline"}
              className={`text-xs h-9 ${selectedTemplate === "prescription" ? "bg-emerald-600 hover:bg-emerald-700" : ""}`}
              onClick={() => { setSelectedTemplate("prescription"); setCustomMessage(""); }}
            >
              💊 Pill Refill
            </Button>
            <Button 
              type="button" 
              variant={selectedTemplate === "diagnostics" ? "default" : "outline"}
              className={`text-xs h-9 ${selectedTemplate === "diagnostics" ? "bg-emerald-600 hover:bg-emerald-700" : ""}`}
              onClick={() => { setSelectedTemplate("diagnostics"); setCustomMessage(""); }}
            >
              🤖 AI Health Score
            </Button>
            <Button 
              type="button" 
              variant={selectedTemplate === "emergency" ? "default" : "outline"}
              className={`text-xs h-9 ${selectedTemplate === "emergency" ? "bg-emerald-600 hover:bg-emerald-700" : ""}`}
              onClick={() => { setSelectedTemplate("emergency"); setCustomMessage(""); }}
            >
              🚨 Emergency Pass
            </Button>
          </div>

          <div className="pt-2">
            <textarea 
              value={activeMessageText}
              onChange={(e) => setCustomMessage(e.target.value)}
              rows={4}
              className="w-full p-2.5 rounded-lg border bg-background text-xs font-mono text-foreground focus:ring-1 focus:ring-emerald-500"
              placeholder="Or write a custom message to send via WhatsApp..."
            />
          </div>
        </div>

        {/* Action Buttons: CallMeBot API & WhatsApp Web Direct */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Send via CallMeBot API */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                <Zap className="h-4 w-4" /> Send via CallMeBot API
              </span>
              <Badge variant="outline" className="border-amber-500/40 text-amber-600 text-[10px]">Automated</Badge>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Calls <code>api.callmebot.com/whatsapp.php</code> with your APIKey directly.
            </p>
            <Button 
              onClick={sendViaFreeApi}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold gap-2 h-10 shadow-sm"
            >
              <Zap className="h-4 w-4" /> Send Automated WhatsApp API Msg
            </Button>
          </div>

          {/* Direct WhatsApp Web Action */}
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <ExternalLink className="h-4 w-4" /> 1-Click WhatsApp Web Sender
              </span>
              <Badge variant="outline" className="border-emerald-500/40 text-emerald-600 text-[10px]">No APIKey Needed</Badge>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Opens WhatsApp Web with pre-formatted payload to send to <strong>+{phoneNumber}</strong>.
            </p>
            <Button 
              onClick={sendViaWhatsAppWeb}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold gap-2 h-10 shadow-sm"
            >
              <Send className="h-4 w-4" /> Send via WhatsApp Web (1-Click)
            </Button>
          </div>
        </div>

        {/* Timed Auto-Bot Scheduler */}
        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-800 dark:text-blue-300 flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> Timed WhatsApp Auto-Bot Scheduler
            </span>
            {autoBotActive && (
              <Badge className="bg-amber-500 text-slate-950 font-mono text-[10px] animate-pulse">
                Timer: {countdown}s
              </Badge>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground">
            Schedules periodic automated health alerts to be sent to your mobile number <strong>+{phoneNumber}</strong>.
          </p>
          <div className="flex items-center gap-2">
            <select 
              value={timerSeconds} 
              onChange={(e) => setTimerSeconds(Number(e.target.value))}
              disabled={autoBotActive}
              className="h-10 px-2 rounded-lg border bg-background text-xs font-medium shrink-0"
            >
              <option value={15}>Every 15 Seconds</option>
              <option value={30}>Every 30 Seconds</option>
              <option value={60}>Every 1 Minute</option>
              <option value={300}>Every 5 Minutes</option>
            </select>

            {!autoBotActive ? (
              <Button 
                onClick={startAutoBot}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold gap-1.5 h-10"
              >
                <Play className="h-4 w-4 fill-white" /> Start Auto-Bot Timer
              </Button>
            ) : (
              <Button 
                onClick={stopAutoBot}
                variant="destructive"
                className="flex-1 text-xs font-bold gap-1.5 h-10"
              >
                <Square className="h-4 w-4 fill-white" /> Stop Auto-Bot Timer
              </Button>
            )}
          </div>
        </div>

      </CardContent>
    </Card>
  );
};
