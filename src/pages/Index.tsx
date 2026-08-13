import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import ForPatientsSection from "@/components/ForPatientsSection";
import ForHospitalsSection from "@/components/ForHospitalsSection";
import AISection from "@/components/AISection";
import MigrantHealthcareSection from "@/components/MigrantHealthcareSection";
import SecuritySection from "@/components/SecuritySection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>MediNexus AI - One Platform. Every Step of Healthcare.</title>
        <meta 
          name="description" 
          content="MediNexus AI connects patients, doctors, and hospitals through smart appointments, real-time queue management, secure medical records, and intelligent healthcare insights." 
        />
      </Helmet>
      <div className="min-h-screen bg-background text-foreground scroll-smooth">
        <Navbar />
        <main>
          <HeroSection />
          <AboutSection />
          <ProblemSection />
          <SolutionSection />
          <FeaturesSection />
          <HowItWorksSection />
          <ForPatientsSection />
          <ForHospitalsSection />
          <AISection />
          <MigrantHealthcareSection />
          <SecuritySection />
          <CTASection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
