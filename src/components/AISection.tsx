import { Badge } from "@/components/ui/badge";
import { Brain, FileText, Stethoscope, AlertTriangle, FileSpreadsheet, TrendingUp, Sparkles, ShieldAlert } from "lucide-react";

const aiFeatures = [
  {
    icon: FileText,
    emoji: "📝",
    title: "AI Patient Summary",
    description: "Synthesizes complex, lengthy medical histories into structured, actionable clinical overviews in seconds.",
  },
  {
    icon: Stethoscope,
    emoji: "🚑",
    title: "AI-Assisted Triage",
    description: "Prioritizes incoming patients based on symptom urgency to optimize queue ordering and care delivery.",
  },
  {
    icon: AlertTriangle,
    emoji: "⚠️",
    title: "Risk Indicators",
    description: "Flags potential drug interactions, abnormal lab trends, and high-risk patient indicators proactively.",
  },
  {
    icon: FileSpreadsheet,
    emoji: "📄",
    title: "Clinical Documentation",
    description: "Automates consultation transcript summaries and structured chart entries to save physician time.",
  },
  {
    icon: TrendingUp,
    emoji: "📈",
    title: "Demand Prediction",
    description: "Forecasts emergency room visits and outpatient department volume to assist staff scheduling.",
  },
];

const AISection = () => {
  return (
    <section id="ai-section" className="py-20 md:py-28 relative">
      <div className="container">
        
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <Badge variant="outline" className="px-3.5 py-1 border-indigo-500/30 text-indigo-600 bg-indigo-500/10 font-semibold inline-flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            Assistive Intelligence
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-foreground">
            AI That Supports Better Healthcare
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            MediNexus AI uses artificial intelligence to organize information, support patient triage, identify operational patterns, and assist healthcare professionals in making informed decisions.
          </p>
        </div>

        {/* Clinical Co-Pilot Disclaimer Banner */}
        <div className="mt-10 max-w-3xl mx-auto p-4 rounded-xl border border-indigo-500/30 bg-indigo-500/5 text-center flex items-center justify-center gap-3">
          <ShieldAlert className="h-5 w-5 text-indigo-600 shrink-0" />
          <p className="text-xs font-semibold text-foreground">
            Assistive AI Co-Pilot: Designed strictly to empower and support physicians — human clinical decision-making always remains paramount.
          </p>
        </div>

        {/* 5 Feature Cards Grid */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {aiFeatures.map((feature, idx) => (
            <div
              key={feature.title}
              className={`group relative p-6 rounded-2xl border bg-card/60 shadow-sm hover:shadow-xl hover:border-indigo-500/50 transition-all duration-300 ${idx === 4 ? 'sm:col-span-2 lg:col-span-1' : ''}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="h-11 w-11 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <feature.icon className="h-5.5 w-5.5" />
                </div>
                <span className="text-2xl">{feature.emoji}</span>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-indigo-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default AISection;
