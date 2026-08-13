import { Link } from "react-router-dom";
import { Activity } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t bg-card py-12">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-blue-500 text-primary-foreground shadow-md">
                <Activity className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight">MediNexus AI</span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed">
              AI-powered healthcare platform connecting patients, doctors, and hospitals through smart appointments, real-time queue management, and secure records.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-foreground">Navigation</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><a href="/#about" className="hover:text-primary transition-colors">About MediNexus</a></li>
              <li><a href="/#features" className="hover:text-primary transition-colors">Core Features</a></li>
              <li><a href="/#how-it-works" className="hover:text-primary transition-colors">How It Works</a></li>
              <li><a href="/#for-patients" className="hover:text-primary transition-colors">For Patients</a></li>
              <li><a href="/#for-hospitals" className="hover:text-primary transition-colors">For Hospitals</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-foreground">Portals</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><Link to="/patient-auth" className="hover:text-primary transition-colors">Patient Login & Booking</Link></li>
              <li><Link to="/auth" className="hover:text-primary transition-colors">Hospital & Doctor Login</Link></li>
              <li><Link to="/dashboard" className="hover:text-primary transition-colors">Hospital Command Center</Link></li>
              <li><a href="/#migrant-healthcare" className="hover:text-primary transition-colors">Portable Health ID</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-foreground">Security & Trust</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><a href="/#security" className="hover:text-primary transition-colors font-medium text-emerald-600 dark:text-emerald-400">🔒 Secure Data</a></li>
              <li><a href="/#security" className="hover:text-primary transition-colors">Patient-Controlled Access</a></li>
              <li><a href="/#security" className="hover:text-primary transition-colors">Protected Identity (DID)</a></li>
              <li><a href="/#security" className="hover:text-primary transition-colors">FHIR R4 Interoperability</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row">
          <p className="text-xs text-muted-foreground">
            © 2026 MediNexus AI. One Platform. Every Step of Healthcare. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>🔒 End-to-End Encrypted</span>
            <span>✓ HIPAA & FHIR Compliant</span>
            <span>⚡ AI Assistive Co-Pilot</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
