import { Badge } from "@/components/ui/badge";
import { User, Search, CalendarCheck, QrCode, Clock, Stethoscope, FileText, HeartPulse, Building2, LineChart, ArrowRight, ArrowDown } from "lucide-react";

const flowSteps = [
  { stage: "PATIENT", label: "Patient Starts Journey", icon: User, type: "entity", color: "bg-blue-600 text-white" },
  { stage: "Find a Doctor", label: "Search & Filter Specialists", icon: Search, type: "action", color: "bg-card text-foreground border-blue-500/30" },
  { stage: "Book Appointment", label: "Select Available Time Slot", icon: CalendarCheck, type: "action", color: "bg-card text-foreground border-blue-500/30" },
  { stage: "Smart Check-In", label: "Digital Token Verification", icon: QrCode, type: "action", color: "bg-card text-foreground border-blue-500/30" },
  { stage: "Live Queue", label: "Real-Time Wait Tracking", icon: Clock, type: "action", color: "bg-card text-foreground border-amber-500/30" },
  { stage: "DOCTOR", label: "Consultation Stage", icon: Stethoscope, type: "entity", color: "bg-emerald-600 text-white" },
  { stage: "Patient Information", label: "Authorized History Access", icon: FileText, type: "action", color: "bg-card text-foreground border-emerald-500/30" },
  { stage: "Better Care", label: "AI Assisted Diagnosis", icon: HeartPulse, type: "action", color: "bg-card text-foreground border-emerald-500/30" },
  { stage: "HOSPITAL", label: "Hospital Command Center", icon: Building2, type: "entity", color: "bg-purple-600 text-white" },
  { stage: "Analytics & Insights", label: "Operational & Health Analytics", icon: LineChart, type: "action", color: "bg-card text-foreground border-purple-500/30" },
];

const SolutionSection = () => {
  return (
    <section id="solution" className="py-20 md:py-28 bg-muted/30 relative overflow-hidden">
      <div className="container">
        
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <Badge variant="outline" className="px-3.5 py-1 border-emerald-500/30 text-emerald-600 bg-emerald-500/10 font-semibold">
            Our Solution
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-foreground">
            A Smarter Way to Experience Healthcare
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            MediNexus AI connects the complete healthcare journey seamlessly from patient discovery to hospital intelligence.
          </p>
        </div>

        {/* Responsive Connected Journey Pipeline */}
        <div className="mt-16 max-w-5xl mx-auto">
          
          {/* Desktop Horizontal/Grid Flow */}
          <div className="hidden lg:grid grid-cols-5 gap-4 items-center relative">
            {flowSteps.slice(0, 5).map((step, idx) => (
              <div key={step.stage} className="flex flex-col items-center text-center relative group">
                <div className={`w-full p-4 rounded-2xl border shadow-sm transition-all duration-300 ${step.color} ${step.type === 'entity' ? 'shadow-lg scale-105' : 'hover:border-primary'}`}>
                  <step.icon className={`h-6 w-6 mx-auto mb-2 ${step.type === 'entity' ? 'text-white' : 'text-primary'}`} />
                  <p className="font-bold text-sm">{step.stage}</p>
                  <p className="text-[11px] opacity-80 mt-0.5">{step.label}</p>
                </div>
                {idx < 4 && (
                  <ArrowRight className="absolute -right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary z-10 hidden lg:block" />
                )}
              </div>
            ))}
          </div>

          <div className="hidden lg:flex justify-end my-4 pr-10">
            <div className="flex items-center gap-2 text-xs font-semibold text-primary font-mono bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
              <span>Next Care Stage</span>
              <ArrowDown className="h-4 w-4" />
            </div>
          </div>

          <div className="hidden lg:grid grid-cols-5 gap-4 items-center">
            {flowSteps.slice(5, 10).map((step, idx) => (
              <div key={step.stage} className="flex flex-col items-center text-center relative group">
                <div className={`w-full p-4 rounded-2xl border shadow-sm transition-all duration-300 ${step.color} ${step.type === 'entity' ? 'shadow-lg scale-105' : 'hover:border-primary'}`}>
                  <step.icon className={`h-6 w-6 mx-auto mb-2 ${step.type === 'entity' ? 'text-white' : 'text-primary'}`} />
                  <p className="font-bold text-sm">{step.stage}</p>
                  <p className="text-[11px] opacity-80 mt-0.5">{step.label}</p>
                </div>
                {idx < 4 && (
                  <ArrowRight className="absolute -right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary z-10" />
                )}
              </div>
            ))}
          </div>

          {/* Mobile Vertical Flow Timeline */}
          <div className="lg:hidden flex flex-col items-center space-y-3 max-w-sm mx-auto">
            {flowSteps.map((step, idx) => (
              <div key={step.stage} className="w-full flex flex-col items-center">
                <div className={`w-full p-4 rounded-xl border text-center transition-all ${step.color} ${step.type === 'entity' ? 'shadow-md ring-2 ring-primary/20' : ''}`}>
                  <step.icon className={`h-6 w-6 mx-auto mb-1 ${step.type === 'entity' ? 'text-white' : 'text-primary'}`} />
                  <p className="font-bold text-sm">{step.stage}</p>
                  <p className="text-xs opacity-80">{step.label}</p>
                </div>
                {idx < flowSteps.length - 1 && (
                  <ArrowDown className="h-5 w-5 text-primary my-1 animate-bounce" />
                )}
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};

export default SolutionSection;
