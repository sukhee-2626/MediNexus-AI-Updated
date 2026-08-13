import { Badge } from "@/components/ui/badge";
import { Clock, CalendarX, FileWarning, Globe2 } from "lucide-react";

const problems = [
  {
    icon: Clock,
    emoji: "⏱️",
    title: "Long Waiting Times",
    description: "Patients often don't know when they will actually see a doctor, leading to overcrowded waiting rooms and patient dissatisfaction.",
    gradient: "from-amber-500/10 to-orange-500/5 border-amber-500/20",
    iconColor: "text-amber-600 bg-amber-500/10",
  },
  {
    icon: CalendarX,
    emoji: "📅",
    title: "Difficult Appointment Management",
    description: "Doctor schedules and available consultation slots can be difficult to manage efficiently across facilities.",
    gradient: "from-red-500/10 to-rose-500/5 border-red-500/20",
    iconColor: "text-red-600 bg-red-500/10",
  },
  {
    icon: FileWarning,
    emoji: "📂",
    title: "Fragmented Medical Records",
    description: "Patient information can be spread across different healthcare providers with no unified single source of truth.",
    gradient: "from-blue-500/10 to-cyan-500/5 border-blue-500/20",
    iconColor: "text-blue-600 bg-blue-500/10",
  },
  {
    icon: Globe2,
    emoji: "🌍",
    title: "Interrupted Healthcare",
    description: "People who move between cities or regions may struggle to maintain continuity of their health history across care centers.",
    gradient: "from-purple-500/10 to-indigo-500/5 border-purple-500/20",
    iconColor: "text-purple-600 bg-purple-500/10",
  },
];

const ProblemSection = () => {
  return (
    <section id="problem" className="py-20 md:py-28 relative">
      <div className="container">
        
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <Badge variant="destructive" className="px-3.5 py-1 bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/20">
            The Healthcare Challenge
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-foreground">
            Healthcare Shouldn't Be This Complicated
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            Traditional healthcare systems create unnecessary friction for both patients seeking care and hospitals delivering it.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {problems.map((item) => (
            <div
              key={item.title}
              className={`relative flex flex-col p-6 rounded-2xl border bg-gradient-to-b ${item.gradient} hover:shadow-xl transition-all duration-300 group`}
            >
              <div className="flex items-center justify-between mb-6">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${item.iconColor}`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <span className="text-2xl">{item.emoji}</span>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ProblemSection;
