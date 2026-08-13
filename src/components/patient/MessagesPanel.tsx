import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MessageSquare, Send, Loader2, Plus, Mail, MailOpen } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface Message {
  id: string;
  patient_id: string;
  sender_id: string;
  sender_type: string;
  subject: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

interface MessagesPanelProps {
  patientId: string;
}

export const MessagesPanel = ({ patientId }: MessagesPanelProps) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessageOpen, setNewMessageOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    fetchMessages();

    const channel = supabase
      .channel("messages-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages", filter: `patient_id=eq.${patientId}` },
        () => fetchMessages()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [patientId]);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("patient_id", patientId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!subject.trim() || !content.trim()) {
      toast.error("Please fill in subject and message");
      return;
    }

    setSending(true);
    try {
      const { error } = await supabase.from("messages").insert({
        patient_id: patientId,
        sender_id: user?.id,
        sender_type: "patient",
        subject: subject,
        content: content,
        is_read: false
      });

      if (error) throw error;

      toast.success("Message sent successfully");
      setNewMessageOpen(false);
      setSubject("");
      setContent("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const unreadCount = messages.filter(m => !m.is_read && m.sender_type === "provider").length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Messages
              {unreadCount > 0 && (
                <Badge variant="destructive">{unreadCount} new</Badge>
              )}
            </CardTitle>
            <CardDescription>Communicate with your healthcare provider</CardDescription>
          </div>
          <Dialog open={newMessageOpen} onOpenChange={setNewMessageOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                New Message
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Send Message to Provider</DialogTitle>
                <DialogDescription>
                  Your message will be reviewed by your healthcare team.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Input
                    placeholder="Subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Textarea
                    placeholder="Type your message..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={5}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setNewMessageOpen(false)}>Cancel</Button>
                <Button onClick={sendMessage} disabled={sending}>
                  {sending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                  Send
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : messages.length > 0 ? (
          <div className="space-y-3">
            {messages.slice(0, 5).map((message) => (
              <div
                key={message.id}
                className={`p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors ${
                  !message.is_read && message.sender_type === "provider" ? "bg-primary/5 border-primary/20" : ""
                }`}
                onClick={() => setSelectedMessage(message)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {message.is_read || message.sender_type === "patient" ? (
                      <MailOpen className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Mail className="h-4 w-4 text-primary" />
                    )}
                    <span className="font-medium text-sm">{message.subject}</span>
                  </div>
                  <Badge variant={message.sender_type === "patient" ? "outline" : "secondary"}>
                    {message.sender_type === "patient" ? "Sent" : "From Provider"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{message.content}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(message.created_at).toLocaleDateString()} at {new Date(message.created_at).toLocaleTimeString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">No messages yet</p>
        )}

        {selectedMessage && (
          <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{selectedMessage.subject}</DialogTitle>
                <DialogDescription>
                  {selectedMessage.sender_type === "patient" ? "Sent by you" : "From your provider"} on{" "}
                  {new Date(selectedMessage.created_at).toLocaleDateString()}
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className="text-sm whitespace-pre-wrap">{selectedMessage.content}</p>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
};
