import { Badge } from "@/components/ui/badge";
import { CheckCircle2, User, Globe, WifiOff, ShieldCheck, HeartHandshake } from "lucide-react";

const patientPerks = [
  "Easy appointment booking",
  "Doctor availability",
  "Live queue tracking",
  "Appointment reminders",
  "Digital health profile",
  "Secure record access",
  "Multilingual support",
  "Portable health identity",
];

const ForPatientsSection = () => {
  return (
    <section id="for-patients" className="py-20 md:py-28 relative">
      <div className="container">
        
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <Badge variant="outline" className="px-3.5 py-1 border-blue-500/30 text-blue-600 bg-blue-500/10 font-semibold">
            For Patients
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-foreground">
            Healthcare That Puts Patients First
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            Designed to give patients full visibility, control, and accessibility over every healthcare interaction.
          </p>
        </div>

        {/* Perks Grid */}
        <div className="mt-14 max-w-4xl mx-auto grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {patientPerks.map((perk) => (
            <div
              key={perk}
              className="flex items-center gap-3 p-4 rounded-xl border bg-card/60 shadow-sm hover:border-primary/50 transition-all"
            >
              <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
              <span className="text-sm font-semibold text-foreground">{perk}</span>
            </div>
          ))}
        </div>

        {/* PRD Highlight Box */}
        <div className="mt-12 max-w-3xl mx-auto rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="h-12 w-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Core Patient Empowerment Principles
              </p>
              <p className="text-sm text-foreground font-medium">
                MediNexus AI specifically emphasizes patient control, accessibility, multilingual support, and offline capability to ensure equal care access for everyone.
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-muted-foreground font-medium">
                <span className="flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-blue-600" /> Patient Control</span>
                <span className="flex items-center gap-1"><Globe className="h-3.5 w-3.5 text-blue-600" /> Multilingual Support</span>
                <span className="flex items-center gap-1"><WifiOff className="h-3.5 w-3.5 text-blue-600" /> Offline Capability</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ForPatientsSection;
