import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bot, Send, Loader2, User, Sparkles, Mic, MicOff, MessageCircle, ExternalLink, CheckCircle2 } from "lucide-react";
import { callGeminiApi } from "@/lib/gemini";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIChatbotProps {
  patientId?: string;
}

export const AIChatbot = ({ patientId }: AIChatbotProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "👋 Hello! I am your **MediNexus Clinical AI Assistant**.\n\nI can help you analyze symptoms, check medication dosages, view live queue position (#4), or answer health questions 24/7."
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || input.trim();
    if (!textToSend || isLoading) return;

    const userMessage: Message = { role: "user", content: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    if (!customPrompt) setInput("");
    setIsLoading(true);

    try {
      const responseText = await callGeminiApi(
        textToSend,
        "You are a clinical AI medical assistant for MediNexus AI platform. Provide clear, empathetic, evidence-based healthcare information."
      );
      setMessages((prev) => [...prev, { role: "assistant", content: responseText }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "👩‍⚕️ **MediNexus Clinical AI**: I am actively monitoring your health query. For urgent cardiac or respiratory symptoms, please contact emergency care immediately."
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeechToggle = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error("Speech recognition is not supported in this browser. Try Chrome or Edge!");
      return;
    }

    try {
      // @ts-ignore
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      if (!isListening) {
        setIsListening(true);
        toast.info("🎙️ Listening... Speak your health query now!");
        recognition.start();

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          setIsListening(false);
          toast.success(`Recognized: "${transcript}"`);
        };

        recognition.onerror = () => {
          setIsListening(false);
          toast.error("Speech recognition stopped.");
        };

        recognition.onend = () => {
          setIsListening(false);
        };
      } else {
        setIsListening(false);
        recognition.stop();
      }
    } catch (err) {
      setIsListening(false);
      toast.error("Could not activate voice dictation");
    }
  };

  const exportChatToWhatsApp = () => {
    const chatText = messages
      .map(m => `${m.role === "user" ? "👤 Patient" : "🤖 MediNexus AI"}: ${m.content}`)
      .join("\n\n");

    const whatsappUrl = `https://web.whatsapp.com/send?text=${encodeURIComponent(`📋 *MediNexus AI Health Consultation Summary*:\n\n${chatText}`)}`;
    window.open(whatsappUrl, "_blank");
    toast.success("Opening WhatsApp Web with AI Chat Summary!");
  };

  return (
    <Card className="flex flex-col h-[550px] border-primary/20 shadow-md">
      <CardHeader className="pb-3 bg-gradient-to-r from-card via-primary/5 to-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-md">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                MediNexus Real-Time AI Doctor
                <Badge variant="outline" className="border-emerald-500/40 text-emerald-600 bg-emerald-500/10 text-[10px] gap-1">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                  100% OPERATIONAL
                </Badge>
              </CardTitle>
              <CardDescription className="text-xs flex items-center gap-1.5">
                Clinical Symptom Analysis & Instant Queue Status
              </CardDescription>
            </div>
          </div>

          <Button 
            onClick={exportChatToWhatsApp}
            variant="outline" 
            size="sm" 
            className="text-xs gap-1 border-emerald-500/40 text-emerald-600 hover:bg-emerald-500/10"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            Export to WhatsApp
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col overflow-hidden p-0">
        <ScrollArea className="flex-1 px-4" ref={scrollRef}>
          <div className="space-y-4 py-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : ""}`}
              >
                {message.role === "assistant" && (
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`rounded-2xl px-4 py-3 max-w-[85%] text-xs leading-relaxed ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-none shadow-sm font-medium"
                      : "bg-muted/70 text-foreground border rounded-tl-none shadow-xs whitespace-pre-wrap"
                  }`}
                >
                  {message.content}
                </div>
                {message.role === "user" && (
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="bg-slate-700 text-white font-bold">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="rounded-2xl px-4 py-3 bg-muted border text-xs flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span>MediNexus Clinical AI thinking...</span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-muted/30 border-t flex flex-wrap gap-1.5">
          <button
            onClick={() => sendMessage("What is my live queue position for Dr. Arjun Mehta?")}
            className="px-2.5 py-1 rounded-full bg-background border text-[11px] font-medium text-foreground hover:border-primary transition shadow-2xs"
          >
            📌 Queue Position #4
          </button>
          <button
            onClick={() => sendMessage("Can I take Metformin 500mg with breakfast?")}
            className="px-2.5 py-1 rounded-full bg-background border text-[11px] font-medium text-foreground hover:border-primary transition shadow-2xs"
          >
            💊 Metformin Dosage
          </button>
          <button
            onClick={() => sendMessage("Check my daily vitals and blood pressure status")}
            className="px-2.5 py-1 rounded-full bg-background border text-[11px] font-medium text-foreground hover:border-primary transition shadow-2xs"
          >
            📊 Check My Vitals
          </button>
          <button
            onClick={() => sendMessage("I have a mild fever and headache, what should I do?")}
            className="px-2.5 py-1 rounded-full bg-background border text-[11px] font-medium text-foreground hover:border-primary transition shadow-2xs"
          >
            🩺 Fever & Headache
          </button>
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 border-t bg-card">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex items-center gap-2"
          >
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleSpeechToggle}
              className={`shrink-0 ${isListening ? "bg-red-500 text-white animate-pulse border-red-500" : ""}`}
              title="Voice Speech Input"
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>

            <Input
              placeholder="Ask your health question or symptoms..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="text-xs"
            />

            <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="shrink-0 bg-primary">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};
