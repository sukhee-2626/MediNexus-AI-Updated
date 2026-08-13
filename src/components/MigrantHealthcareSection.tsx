import { Badge } from "@/components/ui/badge";
import { CreditCard, QrCode, ShieldCheck, MapPin, ArrowRightLeft, Sparkles } from "lucide-react";

const MigrantHealthcareSection = () => {
  return (
    <section id="migrant-healthcare" className="py-20 md:py-28 bg-gradient-to-b from-background via-blue-500/5 to-background relative overflow-hidden">
      <div className="container">
        
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <Badge variant="outline" className="px-3.5 py-1 border-blue-500/30 text-blue-600 bg-blue-500/10 font-semibold inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            Portable Healthcare
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-foreground">
            Your Health Identity Moves With You
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            When people move between cities, states or healthcare providers, their healthcare history shouldn't disappear with them.
          </p>
        </div>

        {/* Feature Highlight: MediNexus Health ID Card */}
        <div className="mt-14 max-w-4xl mx-auto grid lg:grid-cols-12 gap-8 items-center">
          
          {/* Digital Card Preview Visual */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-xs rounded-3xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 p-6 text-white shadow-2xl border border-indigo-500/30 space-y-6 relative overflow-hidden group hover:scale-105 transition-transform duration-300">
              
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-6 w-6 text-primary" />
                  <span className="font-bold tracking-wide text-sm">MediNexus AI</span>
                </div>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  PORTABLE HEALTH ID
                </span>
              </div>

              {/* Card Body */}
              <div className="py-2 space-y-1">
                <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">Global Health Identifier</p>
                <p className="font-mono text-lg font-bold tracking-wider text-blue-200">MNX-8924-7610</p>
                <p className="text-xs text-slate-300 font-semibold pt-1">Patient: Rajesh V. Sharma</p>
              </div>

              {/* Card Footer */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <div className="text-[10px] text-slate-400">
                  <p>Consent: Patient-Controlled</p>
                  <p>Interoperability: FHIR R4</p>
                </div>
                <div className="h-10 w-10 bg-white p-1 rounded-lg shrink-0">
                  <QrCode className="h-full w-full text-slate-900" />
                </div>
              </div>

            </div>
          </div>

          {/* Narrative & PRD Persona Focus */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-500/10 px-3 py-1 rounded-full">
                <Sparkles className="h-3.5 w-3.5" />
                MediNexus Health ID
              </div>
              <h3 className="text-2xl font-bold text-foreground">
                Continuous Care Anywhere, Anytime
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A portable digital health identity designed to help authorized healthcare providers access relevant patient information instantly — regardless of location or network fragmentation.
              </p>
            </div>

            {/* Persona Callout Details */}
            <div className="grid gap-3 pt-2">
              <div className="flex items-start gap-3 p-3.5 rounded-xl border bg-card/60">
                <ArrowRightLeft className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-foreground">Designed for Migrant Workers & Mobile Populations</h4>
                  <p className="text-xs text-muted-foreground">Addresses the core persona requirement for seasonal workers and relocators who frequently switch regional health systems.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl border bg-card/60">
                <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-foreground">Zero Information Loss</h4>
                  <p className="text-xs text-muted-foreground">Maintains verified vaccination records, chronic condition history, and past prescriptions in one consent-secured portable profile.</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default MigrantHealthcareSection;
