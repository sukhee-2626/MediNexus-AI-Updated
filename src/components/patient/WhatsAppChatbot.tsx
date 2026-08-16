import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Phone, Send, CheckCheck, Sparkles, ExternalLink, Bot, User, Bell, QrCode, Shield, Check } from "lucide-react";
import { toast } from "sonner";
import { callGeminiApi, hasGeminiApiKey } from "@/lib/gemini";

interface WhatsAppMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  time: string;
}

export const WhatsAppChatbot = () => {
  const [phoneNumber, setPhoneNumber] = useState("+91 98765 43210");
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<WhatsAppMessage[]>([
    {
      id: "1",
      sender: "bot",
      text: "👋 Welcome to MediNexus AI on WhatsApp!\n\nI am your 24/7 Virtual Health Assistant. How can I help you today?",
      time: "10:30 AM"
    },
    {
      id: "2",
      sender: "user",
      text: "Hi! Can you check my live queue status for today's appointment?",
      time: "10:31 AM"
    },
    {
      id: "3",
      sender: "bot",
      text: "🏥 *Live Appointment Update*\nDoctor: Dr. Arjun Mehta (Cardiology)\nQueue Position: *#4*\nEstimated Wait Time: *~12 mins*\nRoom: 204",
      time: "10:31 AM"
    }
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage.trim();
    if (!textToSend || loading) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg: WhatsAppMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: textToSend,
      time: timeStr
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInputMessage("");
    setLoading(true);

    try {
      let botResponse = "";
      if (hasGeminiApiKey()) {
        const prompt = `System: You are MediNexus AI WhatsApp Health Bot. Respond concisely formatted for WhatsApp chat with emojis and bullet points.\nUser message: ${textToSend}`;
        botResponse = await callGeminiApi(textToSend, prompt);
      } else {
        // Fallback intelligent response simulation
        if (textToSend.toLowerCase().includes("queue") || textToSend.toLowerCase().includes("appointment")) {
          botResponse = "📌 *Appointment Status*: Confirmed with Dr. Arjun Mehta at 10:30 AM.\n📍 Location: Room 204, Cardiology Wing.\n⏳ Current Queue: #4";
        } else if (textToSend.toLowerCase().includes("refill") || textToSend.toLowerCase().includes("medicine")) {
          botResponse = "💊 *Prescription Refill Request*: Metformin 500mg (1 Tablet daily). Your request has been sent to City Pharmacy! Status: *Processing*.";
        } else if (textToSend.toLowerCase().includes("pass") || textToSend.toLowerCase().includes("qr")) {
          botResponse = "🛡️ *Digital Health Pass*: Health ID: MNX-10291.\nBlood Type: O+\nSevere Allergies: Penicillin.\nQR Token generated successfully!";
        } else {
          botResponse = `🤖 *MediNexus AI*: I have received your message: "${textToSend}". Our clinical AI is monitoring your query. Please consult a doctor for urgent symptoms!`;
        }
      }

      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: botResponse,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate WhatsApp response");
    } finally {
      setLoading(false);
    }
  };

  const openActualWhatsApp = () => {
    const cleanNumber = phoneNumber.replace(/[^0-9]/g, "");
    const defaultText = encodeURIComponent("Hello MediNexus AI! I would like to receive my health alerts, queue status, and prescriptions on WhatsApp.");
    const url = cleanNumber 
      ? `https://api.whatsapp.com/send?phone=${cleanNumber}&text=${defaultText}`
      : `https://api.whatsapp.com/send?text=${defaultText}`;
    
    window.open(url, "_blank");
    toast.success("Opening WhatsApp with MediNexus AI Bot payload!");
  };

  return (
    <Card className="border-emerald-500/30 shadow-md bg-gradient-to-br from-emerald-500/5 via-card to-background">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow-sm">
              <MessageSquare className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-1.5">
                WhatsApp Health Assistant & Reminders
                <Badge variant="outline" className="border-emerald-500/40 text-emerald-600 bg-emerald-500/10 text-[10px]">
                  LIVE DEMO
                </Badge>
              </CardTitle>
              <CardDescription className="text-xs">
                Receive real-time queue updates, prescription alerts, and AI diagnosis on WhatsApp
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Phone Number Input & WhatsApp Link Bar */}
        <div className="p-3 rounded-xl bg-card border flex flex-col sm:flex-row items-center gap-3">
          <div className="w-full sm:flex-1 space-y-1">
            <label className="text-[11px] font-semibold text-muted-foreground block">
              Your Mobile Number (For WhatsApp Demo Notification):
            </label>
            <div className="flex gap-2">
              <div className="relative w-full">
                <Phone className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input 
                  value={phoneNumber} 
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="pl-8 text-xs font-mono"
                />
              </div>
            </div>
          </div>
          <Button 
            onClick={openActualWhatsApp}
            className="w-full sm:w-auto text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 shrink-0"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Test on Real WhatsApp
          </Button>
        </div>

        {/* WhatsApp Phone Mockup Simulator */}
        <div className="rounded-2xl border-2 border-emerald-500/30 overflow-hidden bg-[#E5DDD5] dark:bg-[#0b141a] shadow-inner max-w-lg mx-auto">
          {/* WhatsApp Header */}
          <div className="bg-[#075E54] dark:bg-[#202c33] text-white p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-full bg-emerald-400 text-emerald-950 font-bold flex items-center justify-center text-xs">
                MN
              </div>
              <div>
                <p className="text-xs font-bold leading-tight flex items-center gap-1">
                  MediNexus Care Bot 
                  <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block"></span>
                </p>
                <p className="text-[10px] text-emerald-100 opacity-90">Official AI Verified Assistant • online</p>
              </div>
            </div>
            <Badge className="bg-emerald-700 text-white border-0 text-[10px]">24/7 Active</Badge>
          </div>

          {/* WhatsApp Chat Body */}
          <div 
            ref={scrollRef}
            className="p-3 space-y-3 h-[280px] overflow-y-auto text-xs font-sans"
            style={{
              backgroundImage: `radial-gradient(rgba(0,0,0,0.03) 1px, transparent 0)`,
              backgroundSize: '16px 16px'
            }}
          >
            {messages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div 
                  className={`p-2.5 rounded-xl max-w-[85%] shadow-xs whitespace-pre-wrap ${
                    msg.sender === "user" 
                      ? "bg-[#DCF8C6] dark:bg-[#005c4b] text-slate-900 dark:text-white rounded-tr-none" 
                      : "bg-white dark:bg-[#202c33] text-slate-900 dark:text-white rounded-tl-none border border-slate-200 dark:border-slate-700"
                  }`}
                >
                  <p className="leading-relaxed text-[11px]">{msg.text}</p>
                  <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-slate-500 dark:text-slate-400">
                    <span>{msg.time}</span>
                    {msg.sender === "user" && <CheckCheck className="h-3 w-3 text-blue-500 inline" />}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="p-2 rounded-lg bg-white dark:bg-[#202c33] text-xs text-muted-foreground animate-pulse">
                  MediNexus Bot typing...
                </div>
              </div>
            )}
          </div>

          {/* Quick Reply Chip Triggers */}
          <div className="p-2 bg-slate-100 dark:bg-[#111b21] border-t flex flex-wrap gap-1.5">
            <button 
              onClick={() => handleSendMessage("Check my live queue position #4")}
              className="px-2 py-1 rounded-full bg-white dark:bg-[#202c33] border text-[10px] text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950 transition"
            >
              📌 Check Queue #4
            </button>
            <button 
              onClick={() => handleSendMessage("Request refill for Metformin 500mg")}
              className="px-2 py-1 rounded-full bg-white dark:bg-[#202c33] border text-[10px] text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950 transition"
            >
              💊 Refill Prescription
            </button>
            <button 
              onClick={() => handleSendMessage("Show my Digital Emergency QR Pass")}
              className="px-2 py-1 rounded-full bg-white dark:bg-[#202c33] border text-[10px] text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950 transition"
            >
              🛡️ Emergency Pass QR
            </button>
          </div>

          {/* WhatsApp Simulator Input */}
          <div className="p-2 bg-[#F0F2F5] dark:bg-[#202c33] flex items-center gap-2">
            <Input 
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type a message to WhatsApp bot..."
              className="text-xs bg-white dark:bg-[#2a3942] border-0 rounded-full h-8 px-3"
            />
            <Button 
              onClick={() => handleSendMessage()}
              disabled={loading || !inputMessage.trim()}
              size="icon" 
              className="h-8 w-8 rounded-full bg-[#075E54] hover:bg-[#064e46] text-white shrink-0"
            >
              <Send className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
