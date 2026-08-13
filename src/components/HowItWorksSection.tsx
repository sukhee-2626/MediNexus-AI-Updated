import { Badge } from "@/components/ui/badge";
import { Search, CalendarCheck, QrCode, Clock, Stethoscope, ShieldCheck } from "lucide-react";

const steps = [
  {
    step: "01",
    action: "Discover",
    title: "Find the appropriate doctor or department",
    description: "Search by specialty, location, or availability to select the exact medical care required.",
    icon: Search,
  },
  {
    step: "02",
    action: "Book",
    title: "Choose an available time slot",
    description: "Reserve a convenient consultation time instantly with real-time slot synchronization.",
    icon: CalendarCheck,
  },
  {
    step: "03",
    action: "Check In",
    title: "Use digital check-in and join the queue",
    description: "Arrival verification via QR token or phone check-in to automatically register presence.",
    icon: QrCode,
  },
  {
    step: "04",
    action: "Track",
    title: "See your live queue position & wait time",
    description: "Monitor live queue updates on your device to avoid sitting unnecessarily in waiting rooms.",
    icon: Clock,
  },
  {
    step: "05",
    action: "Consult",
    title: "Doctor accesses authorized information",
    description: "The clinician securely reviews relevant medical history and AI summaries for accurate care.",
    icon: Stethoscope,
  },
  {
    step: "06",
    action: "Continue Care",
    title: "Health info available for future care",
    description: "Updated records, prescriptions, and advice remain securely accessible in your portable profile.",
    icon: ShieldCheck,
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="bg-muted/30 py-20 md:py-28 relative">
      <div className="container">
        
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <Badge variant="outline" className="px-3.5 py-1 border-primary/30 text-primary font-semibold">
            How MediNexus Works
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-foreground">
            Simple for Patients. Powerful for Hospitals.
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            A 6-step streamlined workflow bridging patient convenience with hospital operational efficiency.
          </p>
        </div>

        {/* 6 Steps Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((item) => (
            <div
              key={item.step}
              className="group relative rounded-2xl border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-primary/50 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-black font-mono text-primary/30 group-hover:text-primary transition-colors">
                    {item.step}
                  </span>
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <item.icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-primary mb-1">
                  {item.action}
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HowItWorksSection;
