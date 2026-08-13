import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, UserCheck, Clock, FileText, Brain, BarChart3, ShieldCheck, CreditCard } from "lucide-react";

const coreFeatures = [
  {
    icon: Calendar,
    title: "Smart Appointment Booking",
    description: "Find doctors and book available appointment slots effortlessly across departments and clinics.",
    category: "Patients & Clinics",
  },
  {
    icon: UserCheck,
    title: "Doctor Availability",
    description: "View doctor schedules, consultation hours, and real-time available consultation slots.",
    category: "Scheduling",
  },
  {
    icon: Clock,
    title: "Smart Queue Management",
    description: "Track queue position and estimated waiting time in real time on mobile devices.",
    category: "Real-Time Tracking",
  },
  {
    icon: FileText,
    title: "Patient Health Profile",
    description: "Access authorized medical history, previous visits, diagnostic tests, and relevant health information.",
    category: "Medical Records",
  },
  {
    icon: Brain,
    title: "AI-Powered Insights",
    description: "Assist healthcare professionals with concise patient summaries, risk indicators, and operational insights.",
    category: "Clinical AI",
  },
  {
    icon: BarChart3,
    title: "Hospital Analytics",
    description: "Help administrators understand appointments, queues, doctor workload, and overall patient flow.",
    category: "Hospital Ops",
  },
  {
    icon: ShieldCheck,
    title: "Secure Health Records",
    description: "Give patients greater control over how their sensitive health information is accessed and shared.",
    category: "Security & Consent",
  },
  {
    icon: CreditCard,
    title: "Portable Health Identity",
    description: "Help patients maintain access to their authorized health information across connected healthcare providers.",
    category: "Interoperability",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 md:py-28 relative">
      <div className="container">
        
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <Badge variant="outline" className="px-3.5 py-1 border-primary/30 text-primary font-semibold">
            Core Features
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-foreground">
            Everything Connected in One Platform
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            Powerful features built to simplify operations for hospitals while empowering patients with seamless healthcare access.
          </p>
        </div>

        {/* 8 Features Grid */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {coreFeatures.map((feature, index) => (
            <Card
              key={feature.title}
              className="group relative overflow-hidden border-border/80 bg-card/60 backdrop-blur transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="absolute top-0 right-0 p-3">
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  0{index + 1}
                </span>
              </div>
              <CardHeader className="pt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="h-6 w-6" />
                </div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  {feature.category}
                </div>
                <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-xs leading-relaxed text-muted-foreground">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FeaturesSection;
