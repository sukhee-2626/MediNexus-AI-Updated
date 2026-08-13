import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Appointments from "./pages/dashboard/Appointments";
import DoctorAvailability from "./pages/dashboard/DoctorAvailability";
import ProblemAnalytics from "./pages/dashboard/ProblemAnalytics";
import Patients from "./pages/dashboard/Patients";
import Records from "./pages/dashboard/Records";
import Requests from "./pages/dashboard/Requests";
import Analytics from "./pages/dashboard/Analytics";
import AIAnalytics from "./pages/dashboard/AIAnalytics";
import Backup from "./pages/dashboard/Backup";
import AuditLogs from "./pages/dashboard/AuditLogs";
import Settings from "./pages/dashboard/Settings";
import PatientDetail from "./pages/PatientDetail";
import PatientAuth from "./pages/PatientAuth";
import PatientPortal from "./pages/PatientPortal";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/appointments"
                element={
                  <ProtectedRoute>
                    <Appointments />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/doctor-availability"
                element={
                  <ProtectedRoute>
                    <DoctorAvailability />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/problem-analytics"
                element={
                  <ProtectedRoute>
                    <ProblemAnalytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/patients"
                element={
                  <ProtectedRoute>
                    <Patients />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/records"
                element={
                  <ProtectedRoute>
                    <Records />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/analytics"
                element={
                  <ProtectedRoute>
                    <Analytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/ai-analytics"
                element={
                  <ProtectedRoute>
                    <AIAnalytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/backup"
                element={
                  <ProtectedRoute>
                    <Backup />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/requests"
                element={
                  <ProtectedRoute>
                    <Requests />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/audit-logs"
                element={
                  <ProtectedRoute>
                    <AuditLogs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patient/:id"
                element={
                  <ProtectedRoute>
                    <PatientDetail />
                  </ProtectedRoute>
                }
              />
              <Route path="/patient-auth" element={<PatientAuth />} />
              <Route
                path="/patient-portal"
                element={
                  <ProtectedRoute>
                    <PatientPortal />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
