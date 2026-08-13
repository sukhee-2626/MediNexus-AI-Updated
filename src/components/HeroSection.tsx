import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Sparkles, UserCheck, ShieldCheck, Clock, Stethoscope, ArrowRightLeft } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-primary/5 to-background py-16 md:py-24 lg:py-32">
      {/* Background ambient glow shapes */}
      <div className="absolute top-1/4 left-1/2 -z-10 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />
      <div className="absolute bottom-10 right-10 -z-10 h-[300px] w-[300px] rounded-full bg-blue-500/10 blur-[100px]" />

      <div className="container relative z-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8 items-center">
          
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7 flex flex-col space-y-8 text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary w-fit shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Intelligent Healthcare Ecosystem</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-6xl text-foreground leading-[1.15]">
                Healthcare, <br />
                <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Connected and Intelligent
                </span>
              </h1>
              <p className="max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
                MediNexus AI is an AI-powered healthcare platform that connects patients, doctors, and hospitals through smart appointments, real-time queue management, secure medical records, and intelligent healthcare insights.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Button size="lg" asChild className="gap-2 text-base font-semibold shadow-lg shadow-primary/25 h-12 px-6">
                <Link to="/patient-auth">
                  <Calendar className="h-5 w-5" />
                  Book an Appointment
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="gap-2 text-base h-12 px-6 border-border/80 hover:bg-accent">
                <a href="#about">
                  Explore MediNexus
                </a>
              </Button>
            </div>

            {/* Quick feature highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-border/60">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-primary">100%</span>
                <span className="text-xs text-muted-foreground">Connected Platform</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-primary">Real-Time</span>
                <span className="text-xs text-muted-foreground">Queue Tracking</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-primary">AI-Powered</span>
                <span className="text-xs text-muted-foreground">Clinical Insights</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-primary">FHIR Ready</span>
                <span className="text-xs text-muted-foreground">Portable Health ID</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Flow & Live Cards */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-lg rounded-2xl border border-border/80 bg-card/80 p-6 shadow-2xl backdrop-blur-xl space-y-6">
              
              {/* Flow Header */}
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                    Connected Ecosystem Live Flow
                  </span>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary">
                  MediNexus Core
                </span>
              </div>

              {/* Connected Flow Diagram: Patient -> MediNexus AI -> Doctor -> Hospital */}
              <div className="relative py-2">
                <div className="grid grid-cols-4 gap-2 text-center items-center">
                  
                  {/* Step 1: Patient */}
                  <div className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-muted/40 border border-border/50 hover:border-primary/40 transition-all">
                    <div className="h-9 w-9 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-sm">
                      👤
                    </div>
                    <span className="text-xs font-semibold text-foreground">Patient</span>
                  </div>

                  {/* Step 2: MediNexus AI */}
                  <div className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-primary/10 border border-primary/30 shadow-sm">
                    <div className="h-9 w-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                      ⚡
                    </div>
                    <span className="text-xs font-bold text-primary">MediNexus AI</span>
                  </div>

                  {/* Step 3: Doctor */}
                  <div className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-muted/40 border border-border/50 hover:border-primary/40 transition-all">
                    <div className="h-9 w-9 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-sm">
                      🩺
                    </div>
                    <span className="text-xs font-semibold text-foreground">Doctor</span>
                  </div>

                  {/* Step 4: Hospital */}
                  <div className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-muted/40 border border-border/50 hover:border-primary/40 transition-all">
                    <div className="h-9 w-9 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold text-sm">
                      🏥
                    </div>
                    <span className="text-xs font-semibold text-foreground">Hospital</span>
                  </div>

                </div>

                {/* Connecting arrow indicator line */}
                <div className="mt-3 flex items-center justify-center gap-1 text-[10px] text-muted-foreground font-mono">
                  <span>Patient</span>
                  <ArrowRightLeft className="h-3 w-3 text-primary" />
                  <span className="font-bold text-primary">MediNexus AI</span>
                  <ArrowRightLeft className="h-3 w-3 text-primary" />
                  <span>Doctor</span>
                  <ArrowRightLeft className="h-3 w-3 text-primary" />
                  <span>Hospital</span>
                </div>
              </div>

              {/* Small Status Cards */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                
                {/* Card 1: Doctor Available */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <div className="h-9 w-9 rounded-lg bg-emerald-500/20 text-emerald-600 flex items-center justify-center shrink-0">
                    <Stethoscope className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-emerald-950 dark:text-emerald-200">Doctor Available</p>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">12 Specialists Online</p>
                  </div>
                </div>

                {/* Card 2: Appointment Confirmed */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <div className="h-9 w-9 rounded-lg bg-blue-500/20 text-blue-600 flex items-center justify-center shrink-0">
                    <UserCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-blue-950 dark:text-blue-200">Appointment Confirmed</p>
                    <p className="text-[11px] text-blue-700 dark:text-blue-400 font-medium">Slot #A-102 Verified</p>
                  </div>
                </div>

                {/* Card 3: Queue Position #4 */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <div className="h-9 w-9 rounded-lg bg-amber-500/20 text-amber-600 flex items-center justify-center shrink-0">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-amber-950 dark:text-amber-200">Queue Position #4</p>
                    <p className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">Est. Wait: 12 mins</p>
                  </div>
                </div>

                {/* Card 4: Health Record Secured */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                  <div className="h-9 w-9 rounded-lg bg-indigo-500/20 text-indigo-600 flex items-center justify-center shrink-0">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-indigo-950 dark:text-indigo-200">Health Record Secured</p>
                    <p className="text-[11px] text-indigo-700 dark:text-indigo-400 font-medium">Encrypted & FHIR Ready</p>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
