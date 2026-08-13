import { Helmet } from "react-helmet-async";
import DashboardSidebar from "@/components/dashboard/Sidebar";
import StatsCard from "@/components/dashboard/StatsCard";
import PatientsList from "@/components/dashboard/PatientsList";
import AIAssistant from "@/components/dashboard/AIAssistant";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import { Users, FileText, Shield, Brain } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Dashboard = () => {
  const { user } = useAuth();

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Provider";

  return (
    <>
      <Helmet>
        <title>Provider Dashboard - MediLedger AI</title>
        <meta name="description" content="Access patient records, AI diagnostics, and blockchain-verified medical data in your MediLedger AI dashboard." />
      </Helmet>
      <div className="flex h-screen bg-background">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto">
          <div className="border-b bg-card px-8 py-4">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome back, {displayName}</p>
          </div>

          <div className="p-8 space-y-8">
            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Total Patients"
                value={0}
                description="registered patients"
                icon={Users}
              />
              <StatsCard
                title="Medical Records"
                value={0}
                description="blockchain verified"
                icon={FileText}
              />
              <StatsCard
                title="Active Consents"
                value={0}
                description="data access permissions"
                icon={Shield}
              />
              <StatsCard
                title="AI Analyses"
                value={0}
                description="diagnostic requests"
                icon={Brain}
              />
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <PatientsList />
              </div>
              <div className="space-y-6">
                <AIAssistant />
                <ActivityFeed />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
