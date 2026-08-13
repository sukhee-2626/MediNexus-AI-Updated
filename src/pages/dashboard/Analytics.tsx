import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import DashboardSidebar from "@/components/dashboard/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Shield, Brain, TrendingUp, Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";

interface Stats {
  totalPatients: number;
  totalRecords: number;
  activeConsents: number;
  aiDiagnostics: number;
}

interface TrendData {
  date: string;
  patients: number;
  records: number;
}

interface RecordTypeCount {
  type: string;
  count: number;
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))', 'hsl(var(--accent))'];

const Analytics = () => {
  const [stats, setStats] = useState<Stats>({
    totalPatients: 0,
    totalRecords: 0,
    activeConsents: 0,
    aiDiagnostics: 0,
  });
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [recordTypes, setRecordTypes] = useState<RecordTypeCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();

    // Real-time subscriptions
    const patientsChannel = supabase
      .channel('analytics-patients')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'patients' }, () => {
        fetchAnalytics();
      })
      .subscribe();

    const recordsChannel = supabase
      .channel('analytics-records')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'medical_records' }, () => {
        fetchAnalytics();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(patientsChannel);
      supabase.removeChannel(recordsChannel);
    };
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Fetch counts
      const [patientsRes, recordsRes, consentsRes, diagnosticsRes] = await Promise.all([
        supabase.from("patients").select("id", { count: "exact", head: true }),
        supabase.from("medical_records").select("id", { count: "exact", head: true }),
        supabase.from("consent_grants").select("id", { count: "exact", head: true }).eq("status", "active"),
        supabase.from("ai_diagnostics").select("id", { count: "exact", head: true }),
      ]);

      setStats({
        totalPatients: patientsRes.count || 0,
        totalRecords: recordsRes.count || 0,
        activeConsents: consentsRes.count || 0,
        aiDiagnostics: diagnosticsRes.count || 0,
      });

      // Fetch trend data (last 7 days)
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d.toISOString().split('T')[0];
      });

      const { data: patientsData } = await supabase
        .from('patients')
        .select('created_at')
        .gte('created_at', last7Days[0]);

      const { data: recordsData } = await supabase
        .from('medical_records')
        .select('created_at')
        .gte('created_at', last7Days[0]);

      const trends = last7Days.map(date => {
        const patientCount = patientsData?.filter(p => p.created_at?.startsWith(date)).length || 0;
        const recordCount = recordsData?.filter(r => r.created_at?.startsWith(date)).length || 0;
        return {
          date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
          patients: patientCount,
          records: recordCount,
        };
      });

      setTrendData(trends);

      // Fetch record types distribution
      const { data: records } = await supabase
        .from("medical_records")
        .select("record_type");

      if (records) {
        const typeCounts: Record<string, number> = {};
        records.forEach((r) => {
          typeCounts[r.record_type] = (typeCounts[r.record_type] || 0) + 1;
        });
        setRecordTypes(
          Object.entries(typeCounts).map(([type, count]) => ({
            type: type.replace("_", " "),
            count,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const chartConfig = {
    patients: { label: "Patients", color: "hsl(var(--primary))" },
    records: { label: "Records", color: "hsl(var(--chart-2))" },
  };

  const statsCards = [
    { title: "Total Patients", value: stats.totalPatients, icon: Users, description: "Real-time count" },
    { title: "Medical Records", value: stats.totalRecords, icon: FileText, description: "Blockchain verified" },
    { title: "Active Consents", value: stats.activeConsents, icon: Shield, description: "Data permissions" },
    { title: "AI Diagnostics", value: stats.aiDiagnostics, icon: Brain, description: "Analyses performed" },
  ];

  return (
    <>
      <Helmet>
        <title>Analytics - MediLedger AI</title>
        <meta name="description" content="View real-time analytics and insights for your MediLedger AI dashboard." />
      </Helmet>
      <div className="flex h-screen bg-background">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto">
          <div className="border-b bg-card px-8 py-4">
            <h1 className="text-2xl font-bold">Analytics</h1>
            <p className="text-sm text-muted-foreground">Real-time patient data and trends</p>
          </div>

          <div className="p-8 space-y-8">
            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {statsCards.map((stat) => (
                <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{loading ? "-" : stat.value}</div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Charts Grid */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Activity Trend Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Activity Trends (7 Days)
                  </CardTitle>
                  <CardDescription>New patients and records over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <AreaChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="date" className="text-xs" />
                      <YAxis className="text-xs" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="patients"
                        stackId="1"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.3}
                      />
                      <Area
                        type="monotone"
                        dataKey="records"
                        stackId="2"
                        stroke="hsl(var(--chart-2))"
                        fill="hsl(var(--chart-2))"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Record Types Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Record Distribution
                  </CardTitle>
                  <CardDescription>Percentage breakdown by type</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    {recordTypes.length > 0 ? (
                      <PieChart>
                        <Pie
                          data={recordTypes}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ type, percent }) => `${type} (${(percent * 100).toFixed(0)}%)`}
                          outerRadius={100}
                          dataKey="count"
                        >
                          {recordTypes.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    ) : (
                      <div className="flex h-full items-center justify-center text-muted-foreground">
                        No data available
                      </div>
                    )}
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Daily Bar Chart */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Daily Activity</CardTitle>
                  <CardDescription>Patients and records added per day</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[250px]">
                    <BarChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="date" className="text-xs" />
                      <YAxis className="text-xs" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="patients" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="records" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
                <CardDescription>Quick overview of your healthcare data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">Records per Patient</p>
                    <p className="text-2xl font-bold">
                      {stats.totalPatients > 0
                        ? (stats.totalRecords / stats.totalPatients).toFixed(1)
                        : "0"}
                    </p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">Consent Rate</p>
                    <p className="text-2xl font-bold">
                      {stats.totalPatients > 0
                        ? `${Math.round((stats.activeConsents / stats.totalPatients) * 100)}%`
                        : "0%"}
                    </p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">AI Usage</p>
                    <p className="text-2xl font-bold">{stats.aiDiagnostics} analyses</p>
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

export default Analytics;
