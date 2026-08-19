import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Video, Mic, MicOff, VideoOff, PhoneOff, Monitor, MessageSquare, Send, FileText, Activity, ShieldCheck, User, Sparkles, Maximize2 } from "lucide-react";
import { toast } from "sonner";

interface TelehealthVideoModalProps {
  doctorName?: string;
  specialty?: string;
  appointmentTime?: string;
  triggerButton?: React.ReactNode;
}

export const TelehealthVideoModal = ({
  doctorName = "Dr. Arjun Mehta",
  specialty = "Senior Cardiologist",
  appointmentTime = "Today at 10:30 AM",
  triggerButton
}: TelehealthVideoModalProps) => {
  const [open, setOpen] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [chatMessages, setChatMessages] = useState<{ sender: string; text: string; time: string }[]>([
    { sender: "Dr. Arjun Mehta", text: "Hello! Welcome to your MediNexus HD Telehealth Session.", time: "10:30 AM" },
    { sender: "MediNexus AI Co-Pilot", text: "Patient Vitals Loaded: BP 120/80, SpO2 99%, Heart Rate 72 BPM.", time: "10:30 AM" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [activeTab, setActiveTab] = useState<"video" | "chat" | "notes">("video");

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (open) {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [open]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    setChatMessages((prev) => [
      ...prev,
      { sender: "You (Patient)", text: chatInput.trim(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    setChatInput("");

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { sender: doctorName, text: "I have reviewed your symptoms. Your heart rhythm looks steady.", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);
    }, 1200);
  };

  const handleEndCall = () => {
    setOpen(false);
    toast.success("Telehealth session concluded. Consultation summary saved to your Medical Records!");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white gap-2 font-semibold shadow-md">
            <Video className="h-4 w-4" />
            Join HD Telehealth Consultation
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[90vh] p-0 overflow-hidden bg-slate-950 text-white border-slate-800 flex flex-col">
        {/* Header Bar */}
        <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                {doctorName}
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40 text-[10px]">
                  {specialty}
                </Badge>
              </h3>
              <p className="text-[11px] text-slate-400">Secure TLS Teleconsultation • Duration: <span className="font-mono text-emerald-400 font-bold">{formatTime(callDuration)}</span></p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-blue-500/40 text-blue-400 font-mono text-[10px]">
              Encrypted HD 1080p
            </Badge>
          </div>
        </div>

        {/* Video Workspace */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 overflow-hidden relative">
          
          {/* Main Video Screen */}
          <div className="md:col-span-3 bg-slate-900/90 relative flex flex-col items-center justify-center p-4">
            
            {isVideoOn ? (
              <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 border border-slate-800 flex flex-col items-center justify-center overflow-hidden shadow-2xl">
                {/* Doctor Avatar / Simulated Video Stream */}
                <div className="relative flex flex-col items-center justify-center space-y-4 z-10">
                  <div className="relative">
                    <div className="h-28 w-28 rounded-full bg-gradient-to-tr from-primary to-blue-500 flex items-center justify-center text-4xl shadow-xl border-4 border-slate-700">
                      👨‍⚕️
                    </div>
                    <span className="absolute bottom-1 right-1 h-5 w-5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-[10px]">
                      ✓
                    </span>
                  </div>
                  <div className="text-center">
                    <h4 className="text-lg font-bold text-white">{doctorName}</h4>
                    <p className="text-xs text-slate-400">{specialty} • Apollo Cardiology Center</p>
                  </div>
                </div>

                {/* AI Copilot Overlay */}
                <div className="absolute top-4 left-4 p-3 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-800 max-w-xs space-y-1 z-20">
                  <div className="flex items-center gap-1.5 text-xs text-primary font-bold">
                    <Sparkles className="h-3.5 w-3.5" /> AI Real-Time Clinical Overlay
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-300">
                    <div><span className="text-slate-500 block">BP</span> 120/80</div>
                    <div><span className="text-slate-500 block">HR</span> 72 bpm</div>
                    <div><span className="text-slate-500 block">SpO2</span> 99%</div>
                  </div>
                </div>

                {/* Patient Picture-in-Picture */}
                <div className="absolute bottom-4 right-4 h-28 w-36 rounded-xl bg-slate-950 border-2 border-slate-700 overflow-hidden shadow-xl flex items-center justify-center">
                  <div className="text-center">
                    <User className="h-8 w-8 mx-auto text-slate-400" />
                    <span className="text-[10px] text-slate-400 mt-1 block">You (Patient)</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-3 text-slate-400">
                <VideoOff className="h-12 w-12" />
                <p className="text-xs">Camera Turned Off</p>
              </div>
            )}

            {/* Video Controls Toolbar */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 p-2 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 shadow-2xl z-30">
              <Button
                variant={isMicOn ? "secondary" : "destructive"}
                size="icon"
                className="rounded-xl h-11 w-11"
                onClick={() => { setIsMicOn(!isMicOn); toast.info(isMicOn ? "Microphone Muted" : "Microphone Active"); }}
              >
                {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </Button>

              <Button
                variant={isVideoOn ? "secondary" : "destructive"}
                size="icon"
                className="rounded-xl h-11 w-11"
                onClick={() => { setIsVideoOn(!isVideoOn); toast.info(isVideoOn ? "Camera Turned Off" : "Camera Active"); }}
              >
                {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
              </Button>

              <Button
                variant={isScreenSharing ? "default" : "outline"}
                size="icon"
                className="rounded-xl h-11 w-11 border-slate-700"
                onClick={() => { setIsScreenSharing(!isScreenSharing); toast.info(isScreenSharing ? "Screen Sharing Stopped" : "Screen Sharing Active"); }}
              >
                <Monitor className="h-5 w-5 text-blue-400" />
              </Button>

              <Button
                onClick={handleEndCall}
                variant="destructive"
                className="rounded-xl h-11 px-5 font-bold gap-2 bg-red-600 hover:bg-red-700 text-white"
              >
                <PhoneOff className="h-5 w-5" /> End Call
              </Button>
            </div>
          </div>

          {/* Right Side: Chat & Prescription Notes */}
          <div className="bg-slate-950 border-l border-slate-800 flex flex-col">
            <div className="p-3 border-b border-slate-800 flex items-center justify-between">
              <span className="font-bold text-xs flex items-center gap-1.5 text-slate-200">
                <MessageSquare className="h-4 w-4 text-primary" /> Consultation Chat
              </span>
              <Badge variant="outline" className="border-slate-800 text-[10px] text-slate-400">Live</Badge>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-3 space-y-3 overflow-y-auto text-xs">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-semibold text-primary">{msg.sender}</span>
                    <span>{msg.time}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200">
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendChat} className="p-3 border-t border-slate-800 flex gap-2 bg-slate-900">
              <Input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask doctor a question..."
                className="text-xs bg-slate-950 border-slate-800 text-white"
              />
              <Button type="submit" size="icon" className="bg-primary shrink-0 h-9 w-9">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
};
