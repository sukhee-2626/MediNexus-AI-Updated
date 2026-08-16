import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, Phone, Clock, MessageSquare, Sparkles, ExternalLink, Play, Square, CheckCircle2, Shield, Zap } from "lucide-react";
import { toast } from "sonner";

export const WhatsAppWebBot = () => {
  const [phoneNumber, setPhoneNumber] = useState("919876543210");
  const [callMeBotApiKey, setCallMeBotApiKey] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("queue");
  const [customMessage, setCustomMessage] = useState("");
  const [autoBotActive, setAutoBotActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(30);
  const [countdown, setCountdown] = useState(0);

  const templates = {
    queue: "🏥 *MediNexus Live Queue Update*\nPatient: Sukhee\nDoctor: Dr. Arjun Mehta (Cardiology)\nQueue Position: *#4*\nEst. Wait: *~12 mins*\nRoom: 204",
    prescription: "💊 *MediNexus Pharmacy Alert*\nPrescription: Metformin 500mg (1 Tablet daily)\nStatus: *READY FOR PICKUP*\nPharmacy: City Care Pharmacy",
    diagnostics: "🤖 *MediNexus AI Health Summary*\nOverall Health Score: *94/100*\nVitals: BP 120/80 (Normal), Heart Rate 72 BPM\nNo critical health alerts detected.",
    emergency: "🚨 *MediNexus Digital Emergency Pass*\nHealth ID: *MNX-10291*\nBlood Group: *O+*\nSevere Allergies: *Penicillin*\nEmergency Contact: +91 98765 43210"
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
      // Trigger notification message
      sendViaWhatsAppWeb();
      toast.success("⏰ Scheduled WhatsApp Bot message triggered!");
      setCountdown(timerSeconds);
    }
    return () => clearInterval(interval);
  }, [autoBotActive, countdown, timerSeconds]);

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
    
    // Check if on mobile browser or desktop
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const finalUrl = isMobile ? mobileUrl : webUrl;

    window.open(finalUrl, "_blank");
    toast.success("Opening WhatsApp Web! Message pre-loaded for 1-click send.");
  };

  const sendViaFreeApi = async () => {
    const cleanPhone = phoneNumber.replace(/[^0-9]/g, "");
    if (!cleanPhone) {
      toast.error("Please enter phone number with country code (e.g. 919876543210)");
      return;
    }

    if (!callMeBotApiKey) {
      toast.info("CallMeBot Free API Key omitted. Launching WhatsApp Web direct mode...");
      sendViaWhatsAppWeb();
      return;
    }

    try {
      toast.loading("Sending automated WhatsApp message via Free API...");
      const apiUrl = `https://api.callmebot.com/whatsapp.php?phone=${cleanPhone}&text=${encodeURIComponent(activeMessageText)}&apikey=${callMeBotApiKey}`;
      
      const res = await fetch(apiUrl, { mode: "no-cors" });
      toast.dismiss();
      toast.success("WhatsApp message dispatched via Free CallMeBot API!");
    } catch (err) {
      console.error(err);
      toast.dismiss();
      toast.error("API call failed. Opening WhatsApp Web fallback...");
      sendViaWhatsAppWeb();
    }
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
                WhatsApp Web Bot & Free Messaging API
                <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white border-0 text-[10px]">
                  ACTIVE DEMO
                </Badge>
              </CardTitle>
              <CardDescription className="text-xs">
                Connect your WhatsApp Web account or use Free CallMeBot API to send real health alerts
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* Setup Configuration */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Phone Number Input */}
          <div className="space-y-1.5 p-3 rounded-xl bg-card border">
            <Label className="text-xs font-semibold flex items-center gap-1.5 text-foreground">
              <Phone className="h-3.5 w-3.5 text-emerald-600" />
              Your WhatsApp Phone Number (with Country Code)
            </Label>
            <Input 
              value={phoneNumber} 
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="e.g. 919876543210 (Country code + Mobile)"
              className="text-xs font-mono"
            />
            <p className="text-[10px] text-muted-foreground">
              Format: <code>91</code> (India) or <code>1</code> (US/CA) followed by 10-digit number.
            </p>
          </div>

          {/* Optional CallMeBot Free API Key */}
          <div className="space-y-1.5 p-3 rounded-xl bg-card border">
            <Label className="text-xs font-semibold flex items-center gap-1.5 text-foreground">
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              Free WhatsApp API Key (CallMeBot / Green API - Optional)
            </Label>
            <Input 
              value={callMeBotApiKey} 
              onChange={(e) => setCallMeBotApiKey(e.target.value)}
              placeholder="Enter free API key or leave blank for WhatsApp Web"
              className="text-xs font-mono"
            />
            <p className="text-[10px] text-muted-foreground">
              If blank, opens WhatsApp Web logged in on your browser to send automatically!
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

        {/* Actions: Send via WhatsApp Web & Scheduled Auto-Bot */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Direct WhatsApp Web Action */}
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <ExternalLink className="h-4 w-4" /> 1-Click WhatsApp Web Sender
              </span>
              <Badge variant="outline" className="border-emerald-500/40 text-emerald-600 text-[10px]">Instant</Badge>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Opens WhatsApp Web with pre-formatted message payload logged in on your browser.
            </p>
            <Button 
              onClick={sendViaWhatsAppWeb}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold gap-2 h-10 shadow-sm"
            >
              <Send className="h-4 w-4" /> Send Now via WhatsApp Web
            </Button>
          </div>

          {/* Timed Auto-Bot Scheduler */}
          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-800 dark:text-blue-300 flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> Timed WhatsApp Auto-Bot
              </span>
              {autoBotActive && (
                <Badge className="bg-amber-500 text-slate-950 font-mono text-[10px] animate-pulse">
                  Timer: {countdown}s
                </Badge>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground">
              Simulates a periodic background health bot sending updates to your WhatsApp number.
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
                  <Play className="h-4 w-4 fill-white" /> Start Auto-Bot
                </Button>
              ) : (
                <Button 
                  onClick={stopAutoBot}
                  variant="destructive"
                  className="flex-1 text-xs font-bold gap-1.5 h-10"
                >
                  <Square className="h-4 w-4 fill-white" /> Stop Auto-Bot
                </Button>
              )}
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};
