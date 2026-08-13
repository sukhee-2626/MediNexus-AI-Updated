import { Helmet } from "react-helmet-async";
import DashboardSidebar from "@/components/dashboard/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PieChart, BarChart2, Activity, TrendingUp, Users, AlertTriangle, ArrowUpRight } from "lucide-react";

const problemBreakdown = [
  { category: "Respiratory / Cough & Fever", percentage: 32, count: "793 Cases", color: "bg-blue-600", trend: "+8%" },
  { category: "General Consultation / Routine", percentage: 21, count: "520 Cases", color: "bg-emerald-600", trend: "+3%" },
  { category: "Diabetes & Metabolic", percentage: 14, count: "347 Cases", color: "bg-purple-600", trend: "+5%" },
  { category: "Cardiology & Chest Complaints", percentage: 11, count: "272 Cases", color: "bg-red-600", trend: "+12%" },
  { category: "Orthopedics & Joint Pain", percentage: 9, count: "223 Cases", color: "bg-amber-500", trend: "-2%" },
  { category: "Skin / Dermatology & Other", percentage: 13, count: "322 Cases", color: "bg-slate-500", trend: "+1%" },
];

const ProblemAnalytics = () => {
  return (
    <>
      <Helmet>
        <title>Patient Problem & Case Analytics - MediNexus AI</title>
        <meta name="description" content="Analyze why patients are booking appointments and explore clinical disease patterns." />
      </Helmet>

      <div className="flex h-screen bg-background overflow-hidden">
        <DashboardSidebar />

        <main className="flex-1 overflow-y-auto">
          
          {/* Header Bar */}
          <div className="border-b bg-card px-8 py-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Patient Problem & Case Analytics</h1>
                <Badge variant="outline" className="text-xs border-indigo-500/30 text-indigo-600 bg-indigo-500/10">
                  AI Disease Intelligence
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                "Why are patients booking?" • Categorization, age trends, repeat visits & hospital operational forecasting
              </p>
            </div>
          </div>

          <div className="p-8 space-y-8">

            {/* Top Cards */}
            <div className="grid gap-4 sm:grid-cols-4">
              <Card className="border-border/80 shadow-sm">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Top Category</p>
                    <p className="text-xl font-extrabold text-blue-600 mt-1">Respiratory (32%)</p>
                    <p className="text-[11px] text-muted-foreground">793 monthly bookings</p>
                  </div>
                  <div className="h-9 w-9 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                    <Activity className="h-5 w-5" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/80 shadow-sm">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Repeat Visit Rate</p>
                    <p className="text-xl font-extrabold text-emerald-600 mt-1">24.5%</p>
                    <p className="text-[11px] text-muted-foreground">Chronic & follow-up care</p>
                  </div>
                  <div className="h-9 w-9 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/80 shadow-sm">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Emergency Conversion</p>
                    <p className="text-xl font-extrabold text-red-600 mt-1">4.2%</p>
                    <p className="text-[11px] text-red-600 font-semibold">Triage acute escalation</p>
                  </div>
                  <div className="h-9 w-9 rounded-lg bg-red-500/10 text-red-600 flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/80 shadow-sm">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Avg Consultation Time</p>
                    <p className="text-xl font-extrabold text-purple-600 mt-1">14.2 min</p>
                    <p className="text-[11px] text-muted-foreground">Optimal clinician workflow</p>
                  </div>
                  <div className="h-9 w-9 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
                    <BarChart2 className="h-5 w-5" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Why Patients Are Booking Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-indigo-600" />
                  Top Patient Booking Reasons & Categories (This Month)
                </CardTitle>
                <CardDescription className="text-xs">
                  Aggregate analysis of booking reasons, symptom descriptions, and pre-triage entries
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                <div className="space-y-4">
                  {problemBreakdown.map((item) => (
                    <div key={item.category} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-semibold">
                        <span className="text-foreground flex items-center gap-2">
                          {item.category}
                          <span className="text-[10px] font-mono text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                            {item.trend}
                          </span>
                        </span>
                        <span className="text-muted-foreground">{item.count} ({item.percentage}%)</span>
                      </div>
                      <div className="h-3.5 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full ${item.color} transition-all duration-500`}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Drill-down insight cards */}
                <div className="grid sm:grid-cols-3 gap-4 pt-4 border-t text-xs">
                  <div className="p-4 rounded-xl border bg-muted/20 space-y-1">
                    <p className="font-bold text-foreground">Respiratory Deep-Dive</p>
                    <p className="text-muted-foreground">62% of respiratory cases are in age 0-14 and 60+. Peaks on Monday morning.</p>
                  </div>
                  <div className="p-4 rounded-xl border bg-muted/20 space-y-1">
                    <p className="font-bold text-foreground">Cardiology Alert</p>
                    <p className="text-muted-foreground">12% increase in chest pain symptom entries. Recommended: allocate 2 extra morning slots.</p>
                  </div>
                  <div className="p-4 rounded-xl border bg-muted/20 space-y-1">
                    <p className="font-bold text-foreground">Telemedicine Utilization</p>
                    <p className="text-muted-foreground">41% of general follow-ups conducted via telemedicine, saving 35m avg wait time.</p>
                  </div>
                </div>

              </CardContent>
            </Card>

          </div>
        </main>
      </div>
    </>
  );
};

export default ProblemAnalytics;
