import { Badge } from "@/components/ui/badge";
import { Lock, Key, Shield, FileCheck, Network, LockKeyhole } from "lucide-react";

const securityFeatures = [
  {
    icon: Lock,
    emoji: "🔐",
    title: "Secure Data",
    description: "End-to-end encryption ensures medical data is protected both in transit and at rest.",
    color: "border-blue-500/30 bg-blue-500/5 text-blue-600",
  },
  {
    icon: Key,
    emoji: "🔑",
    title: "Patient-Controlled Access",
    description: "Patients retain master authority to grant or revoke permission for their medical records.",
    color: "border-emerald-500/30 bg-emerald-500/5 text-emerald-600",
  },
  {
    icon: Shield,
    emoji: "🛡️",
    title: "Protected Identity",
    description: "W3C-standard decentralized identifiers shield personal identity from unauthorized tracking.",
    color: "border-indigo-500/30 bg-indigo-500/5 text-indigo-600",
  },
  {
    icon: FileCheck,
    emoji: "📋",
    title: "Consent-Based Sharing",
    description: "Time-boxed and scope-limited consent policies enforced directly through smart audit trails.",
    color: "border-purple-500/30 bg-purple-500/5 text-purple-600",
  },
  {
    icon: Network,
    emoji: "🔗",
    title: "Interoperable Records",
    description: "FHIR-compatible standards enable seamless data exchange across authorized hospitals.",
    color: "border-amber-500/30 bg-amber-500/5 text-amber-600",
  },
];

const SecuritySection = () => {
  return (
    <section id="security" className="py-20 md:py-28 bg-muted/30 relative">
      <div className="container">
        
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <Badge variant="outline" className="px-3.5 py-1 border-emerald-500/30 text-emerald-600 bg-emerald-500/10 font-semibold inline-flex items-center gap-1.5">
            <LockKeyhole className="h-3.5 w-3.5" />
            Security & Trust
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-foreground">
            Built Around Trust
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            Engineered with patient-controlled access, permissioned blockchain infrastructure, and FHIR-compatible interoperability.
          </p>
        </div>

        {/* 5 Security Cards Grid */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {securityFeatures.map((item) => (
            <div
              key={item.title}
              className={`flex flex-col items-center text-center p-6 rounded-2xl border ${item.color} shadow-sm hover:shadow-lg transition-all duration-300 group`}
            >
              <div className="h-12 w-12 rounded-xl flex items-center justify-center bg-card border shadow-sm mb-4 group-hover:scale-110 transition-transform">
                <item.icon className="h-6 w-6" />
              </div>
              <span className="text-xl mb-1">{item.emoji}</span>
              <h3 className="text-base font-bold text-foreground mb-2">{item.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default SecuritySection;
