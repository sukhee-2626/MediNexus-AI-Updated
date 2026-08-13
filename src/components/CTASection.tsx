import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Building2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section id="contact" className="relative overflow-hidden bg-gradient-to-tr from-primary via-blue-600 to-indigo-700 py-20 md:py-28 text-white">
      {/* Subtle SVG overlay pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djJoLTJ2LTJoMnptMC00aDJ2MmgtMnYtMnptLTQgMHYyaC0ydi0yaDJ6bTIgMGgydjJoLTJ2LTJ6bS02IDBoMnYyaC0ydi0yem0yLTRoMnYyaC0ydi0yem0yIDBoMnYyaC0ydi0yeiIvPjwvZz48L2c+PC9zdmc+')] opacity-25" />
      
      <div className="container relative z-10">
        <div className="mx-auto max-w-3xl text-center space-y-6">
          
          <div className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold backdrop-blur border border-white/20">
            <Sparkles className="h-4 w-4 text-amber-300" />
            <span>MediNexus AI Healthcare Ecosystem</span>
          </div>
          
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl text-white leading-tight">
            A Smarter Healthcare Experience Starts Here
          </h2>
          
          <p className="text-base sm:text-lg text-white/90 leading-relaxed max-w-2xl mx-auto">
            Connect with better healthcare through intelligent appointments, real-time hospital operations and secure digital health information.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              variant="secondary"
              className="gap-2 text-base font-bold h-12 px-8 shadow-xl text-primary bg-white hover:bg-white/90"
              asChild
            >
              <Link to="/patient-auth">
                <Calendar className="h-5 w-5" />
                Book an Appointment
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            <Button 
              size="lg" 
              variant="outline"
              className="gap-2 text-base font-semibold h-12 px-8 border-white/40 text-white bg-white/10 hover:bg-white/20 backdrop-blur"
              asChild
            >
              <Link to="/auth">
                <Building2 className="h-5 w-5" />
                Get Started
              </Link>
            </Button>
          </div>

          <p className="text-xs text-white/70 pt-4">
            Instant digital access • HIPAA & FHIR Compliant • Secure Patient-Controlled Consent
          </p>

        </div>
      </div>
    </section>
  );
};

export default CTASection;
