import { Badge } from "@/components/ui/badge";
import { Users, Stethoscope, Building2, FileSpreadsheet, Brain, Compass } from "lucide-react";

const stakeholders = [
  {
    icon: Users,
    title: "Patients",
    description: "Empowered with portable health records, real-time queue tracking, and effortless appointment scheduling.",
    color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  },
  {
    icon: Stethoscope,
    title: "Doctors",
    description: "Streamlined consultation workflows, instant clinical context access, and AI-driven diagnostic assistance.",
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  },
  {
    icon: Building2,
    title: "Hospital Administrators",
    description: "Unified command center for real-time occupancy monitoring, staff loading, and queue optimization.",
    color: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  },
  {
    icon: FileSpreadsheet,
    title: "Healthcare Records",
    description: "Interoperable, consent-managed FHIR medical history accessible anywhere across authorized networks.",
    color: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  },
  {
    icon: Brain,
    title: "AI-Powered Insights",
    description: "Intelligent triage recommendations, clinical summaries, and predictive operational analytics.",
    color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
  },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-20 md:py-28 bg-muted/20 relative">
      <div className="container">
        
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <Badge variant="outline" className="px-3.5 py-1 border-primary/30 text-primary font-semibold">
            About MediNexus AI
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-foreground">
            One Platform. Every Step of Healthcare.
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            MediNexus AI is designed to simplify the healthcare journey from finding a doctor and booking an appointment to managing patient information and hospital operations.
          </p>
        </div>

        {/* Brings Together Grid */}
        <div className="mt-14">
          <p className="text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-8">
            Bringing together every healthcare stakeholder into one connected platform:
          </p>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {stakeholders.map((item) => (
              <div
                key={item.title}
                className="group relative flex flex-col items-center text-center p-6 rounded-2xl border bg-card hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center border mb-4 ${item.color}`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Product Vision Card */}
        <div className="mt-16 mx-auto max-w-4xl rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-blue-500/10 to-primary/5 p-8 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="h-14 w-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-md">
              <Compass className="h-7 w-7" />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Product Vision
              </span>
              <h3 className="text-xl font-bold text-foreground">
                Portable Intelligent Health Identity & Patient Flow Visibility
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The product vision is to give patients a portable, intelligent health identity while giving hospitals better visibility into patient flow.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutSection;
