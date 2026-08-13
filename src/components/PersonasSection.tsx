import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Quote } from "lucide-react";

const personas = [
  {
    name: "Dr. Asha Devi",
    role: "Rural Healthcare Provider",
    age: 45,
    initials: "AD",
    quote: "If I could see a patient's full medical history instantly, I could save more lives and treat them better.",
    goals: [
      "Quick access to complete patient histories",
      "Accurate diagnoses with AI support",
      "Reduced administrative burden",
    ],
    gradient: "from-primary/20 to-primary/5",
  },
  {
    name: "Mr. Ram Kumar",
    role: "Rural Patient",
    age: 62,
    initials: "RK",
    quote: "I wish my doctors knew everything about my health without me having to remember it all.",
    goals: [
      "Securely store all medical data",
      "Easy sharing with different doctors",
      "Privacy and trust in the system",
    ],
    gradient: "from-chart-2/20 to-chart-2/5",
  },
  {
    name: "Ms. Priya Sharma",
    role: "Public Health Official",
    age: 38,
    initials: "PS",
    quote: "Aggregated, anonymous health data could transform our public health strategies and save countless lives.",
    goals: [
      "Real-time disease surveillance",
      "Optimized resource allocation",
      "Ethical data use protocols",
    ],
    gradient: "from-chart-3/20 to-chart-3/5",
  },
];

const PersonasSection = () => {
  return (
    <section id="personas" className="py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Built for Real Healthcare Heroes
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Understanding the unique challenges of rural healthcare stakeholders 
            guides every feature we build.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {personas.map((persona) => (
            <Card 
              key={persona.name}
              className={`relative overflow-hidden bg-gradient-to-br ${persona.gradient}`}
            >
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14 border-2 border-primary">
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
                      {persona.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{persona.name}</CardTitle>
                    <CardDescription>{persona.role}, Age {persona.age}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative rounded-lg bg-card/50 p-4">
                  <Quote className="absolute -top-2 -left-2 h-6 w-6 text-primary/30" />
                  <p className="text-sm italic text-muted-foreground">
                    "{persona.quote}"
                  </p>
                </div>
                <div>
                  <p className="mb-2 text-sm font-semibold">Key Goals:</p>
                  <ul className="space-y-1">
                    {persona.goals.map((goal, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        {goal}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PersonasSection;
