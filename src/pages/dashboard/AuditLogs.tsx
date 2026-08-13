import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import DashboardSidebar from "@/components/dashboard/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Shield, 
  Search, 
  Filter, 
  FileText, 
  User, 
  Edit, 
  Eye, 
  Loader2,
  Calendar,
  Activity
} from "lucide-react";

interface ActivityLog {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: unknown;
  ip_address: string | null;
  created_at: string;
}

const actionColors: Record<string, string> = {
  create: "bg-green-500/10 text-green-600",
  update: "bg-blue-500/10 text-blue-600",
  delete: "bg-red-500/10 text-red-600",
  view: "bg-gray-500/10 text-gray-600",
  login: "bg-purple-500/10 text-purple-600",
  logout: "bg-orange-500/10 text-orange-600"
};

const entityIcons: Record<string, any> = {
  patient: User,
  medical_record: FileText,
  consent: Shield,
  user: User,
  default: Activity
};

const AuditLogs = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [entityFilter, setEntityFilter] = useState("all");
  const [actionFilter, setActionFilter] = useState("all");

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase
        .from("activity_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error("Error fetching logs:", error);
      toast.error("Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entity_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.details && JSON.stringify(log.details).toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesEntity = entityFilter === "all" || log.entity_type === entityFilter;
    const matchesAction = actionFilter === "all" || log.action === actionFilter;
    
    return matchesSearch && matchesEntity && matchesAction;
  });

  const uniqueEntities = [...new Set(logs.map(l => l.entity_type))];
  const uniqueActions = [...new Set(logs.map(l => l.action))];

  const getActionIcon = (action: string) => {
    switch (action) {
      case "create": return <Edit className="h-4 w-4" />;
      case "update": return <Edit className="h-4 w-4" />;
      case "view": return <Eye className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Audit Logs - MediLedger AI</title>
        <meta name="description" content="View activity logs and audit trail for security compliance." />
      </Helmet>
      <div className="flex h-screen bg-background">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto">
          <div className="border-b bg-card px-8 py-4">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Shield className="h-6 w-6" />
              Audit Logs
            </h1>
            <p className="text-sm text-muted-foreground">
              View all system activity for security and compliance
            </p>
          </div>

          <div className="p-8">
            {/* Filters */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search logs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <Select value={entityFilter} onValueChange={setEntityFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Entity type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Entities</SelectItem>
                      {uniqueEntities.map(entity => (
                        <SelectItem key={entity} value={entity}>
                          {entity.replace("_", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={actionFilter} onValueChange={setActionFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Action type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Actions</SelectItem>
                      {uniqueActions.map(action => (
                        <SelectItem key={action} value={action}>
                          {action}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" onClick={fetchLogs}>
                    Refresh
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Logs List */}
            <Card>
              <CardHeader>
                <CardTitle>Activity History</CardTitle>
                <CardDescription>
                  Showing {filteredLogs.length} of {logs.length} log entries
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : filteredLogs.length > 0 ? (
                  <div className="space-y-3">
                    {filteredLogs.map((log) => {
                      const EntityIcon = entityIcons[log.entity_type] || entityIcons.default;
                      return (
                        <div
                          key={log.id}
                          className="p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-lg ${actionColors[log.action] || "bg-muted"}`}>
                                {getActionIcon(log.action)}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium capitalize">{log.action}</span>
                                  <Badge variant="outline" className="gap-1">
                                    <EntityIcon className="h-3 w-3" />
                                    {log.entity_type.replace("_", " ")}
                                  </Badge>
                                </div>
                                {log.details && (
                                  <p className="text-sm text-muted-foreground">
                                    {typeof log.details === "object" 
                                      ? Object.entries(log.details)
                                          .map(([k, v]) => `${k}: ${v}`)
                                          .join(", ")
                                      : String(log.details)}
                                  </p>
                                )}
                                {log.ip_address && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    IP: {log.ip_address}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(log.created_at).toLocaleDateString()}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(log.created_at).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Shield className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No audit logs found</p>
                    <p className="text-sm mt-1">Activity will appear here as users interact with the system</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
};

export default AuditLogs;
