import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AlertTriangle, Bell, X, Loader2, Sparkles } from "lucide-react";

interface HealthAlert {
  id: string;
  patient_id: string;
  alert_type: string;
  severity: string;
  title: string;
  description: string;
  recommendations: string | null;
  is_dismissed: boolean;
  created_at: string;
}

interface HealthAlertsCardProps {
  patientId: string;
}

const severityColors: Record<string, string> = {
  low: "bg-blue-500/10 text-blue-600 border-blue-200",
  medium: "bg-yellow-500/10 text-yellow-600 border-yellow-200",
  high: "bg-orange-500/10 text-orange-600 border-orange-200",
  critical: "bg-red-500/10 text-red-600 border-red-200"
};

const severityBadgeVariants: Record<string, "secondary" | "outline" | "default" | "destructive"> = {
  low: "secondary",
  medium: "outline",
  high: "default",
  critical: "destructive"
};

export const HealthAlertsCard = ({ patientId }: HealthAlertsCardProps) => {
  const [alerts, setAlerts] = useState<HealthAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchAlerts();

    const channel = supabase
      .channel("health-alerts-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "health_alerts", filter: `patient_id=eq.${patientId}` },
        () => fetchAlerts()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [patientId]);

  const fetchAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from("health_alerts")
        .select("*")
        .eq("patient_id", patientId)
        .eq("is_dismissed", false)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAlerts(data || []);
    } catch (error) {
      console.error("Error fetching alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  const dismissAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from("health_alerts")
        .update({ is_dismissed: true })
        .eq("id", alertId);

      if (error) throw error;
      setAlerts(alerts.filter(a => a.id !== alertId));
      toast.success("Alert dismissed");
    } catch (error) {
      console.error("Error dismissing alert:", error);
      toast.error("Failed to dismiss alert");
    }
  };

  const generateAlerts = async () => {
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("predictive-alerts", {
        body: { patientId }
      });

      if (error) throw error;
      toast.success("Health analysis complete");
      fetchAlerts();
    } catch (error) {
      console.error("Error generating alerts:", error);
      toast.error("Failed to analyze health data");
    } finally {
      setGenerating(false);
    }
  };

  const activeAlerts = alerts.filter(a => !a.is_dismissed);
  const criticalCount = activeAlerts.filter(a => a.severity === "critical" || a.severity === "high").length;

  return (
    <Card className={criticalCount > 0 ? "border-destructive/50" : ""}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Health Alerts
              {criticalCount > 0 && (
                <Badge variant="destructive">{criticalCount} urgent</Badge>
              )}
            </CardTitle>
            <CardDescription>AI-powered health monitoring and alerts</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={generateAlerts} disabled={generating}>
            {generating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Analyze
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : activeAlerts.length > 0 ? (
          <div className="space-y-3">
            {activeAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border ${severityColors[alert.severity]}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{alert.title}</span>
                        <Badge variant={severityBadgeVariants[alert.severity]}>
                          {alert.severity}
                        </Badge>
                      </div>
                      <p className="text-sm opacity-90">{alert.description}</p>
                      {alert.recommendations && (
                        <p className="text-sm mt-2 font-medium">
                          Recommendation: {alert.recommendations}
                        </p>
                      )}
                      <p className="text-xs opacity-70 mt-2">
                        {new Date(alert.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => dismissAlert(alert.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Bell className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">No active health alerts</p>
            <p className="text-sm text-muted-foreground mt-1">
              Click "Analyze" to check for potential health concerns
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
