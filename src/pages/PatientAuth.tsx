import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Shield, User, Loader2, ArrowLeft } from "lucide-react";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const PatientAuth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  useEffect(() => {
    // Check if already logged in
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Check if user is a patient
        const { data: patient } = await supabase
          .from("patients")
          .select("id")
          .eq("user_id", session.user.id)
          .single();

        if (patient) {
          navigate("/patient-portal");
        }
      }
    };
    checkAuth();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate input
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] === "email") fieldErrors.email = err.message;
        if (err.path[0] === "password") fieldErrors.password = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      let { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // Self-heal the demo account if it hasn't been provisioned yet
      if (error && email.trim().toLowerCase() === "patient@mediledger.ai") {
        await supabase.functions.invoke("seed-demo-patient");
        const retry = await supabase.auth.signInWithPassword({ email, password });
        data = retry.data;
        error = retry.error;
      }

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Invalid email or password");
        } else {
          toast.error(error.message);
        }
        return;
      }

      if (data.user) {
        // Verify this user is linked to a patient
        let { data: patient } = await supabase
          .from("patients")
          .select("id")
          .eq("user_id", data.user.id)
          .maybeSingle();

        if (!patient && data.user.email?.toLowerCase() === "patient@mediledger.ai") {
          await supabase.functions.invoke("seed-demo-patient");
          const linked = await supabase
            .from("patients")
            .select("id")
            .eq("user_id", data.user.id)
            .maybeSingle();
          patient = linked.data;
        }

        if (!patient) {
          await supabase.auth.signOut();
          toast.error("This account is not linked to a patient profile. Please use provider login.");
          return;
        }

        // Save logged-in email for live email notifications
        localStorage.setItem("medinexus_patient_email", email.trim());
        toast.success(`Logged in as ${email.trim()}. Live email updates active!`);
        navigate("/patient-portal");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Patient Login - MediLedger AI</title>
        <meta name="description" content="Access your medical records and health information securely." />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
                  <User className="h-8 w-8 text-primary-foreground" />
                </div>
              </div>
              <CardTitle className="text-2xl">Patient Portal</CardTitle>
              <CardDescription>
                Access your medical records and health information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="patient@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password}</p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Sign In to Patient Portal
                </Button>

                {/* Demo Credentials */}
                <div className="mt-4 rounded-lg border border-dashed border-primary/50 bg-primary/5 p-3">
                  <p className="text-xs font-medium text-primary mb-2">🚀 Quick Demo Access</p>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p><span className="font-medium">Email:</span> patient@mediledger.ai</p>
                    <p><span className="font-medium">Password:</span> patient123</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="mt-2 h-7 text-xs w-full"
                    onClick={() => {
                      setEmail("patient@mediledger.ai");
                      setPassword("patient123");
                    }}
                  >
                    Use Demo Credentials
                  </Button>
                </div>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Healthcare provider?{" "}
                  <Link to="/auth" className="text-primary hover:underline">
                    Provider Login
                  </Link>
                </p>
              </div>

              <div className="mt-4 p-4 rounded-lg bg-muted text-sm">
                <p className="font-medium mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Secure Access
                </p>
                <p className="text-muted-foreground">
                  Your health data is protected with enterprise-grade encryption and blockchain verification.
                </p>
              </div>

              {/* Powered by Google Badge */}
              <div className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-accent/50 p-3">
                <svg viewBox="0 0 24 24" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="text-xs text-muted-foreground">
                  Powered by <span className="font-semibold">Google Cloud</span> & <span className="font-semibold">Gemini AI</span>
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default PatientAuth;
