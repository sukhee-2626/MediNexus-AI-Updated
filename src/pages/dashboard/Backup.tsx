import { useState } from "react";
import { Helmet } from "react-helmet-async";
import DashboardSidebar from "@/components/dashboard/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Cloud, 
  Database, 
  Users, 
  FileText, 
  Loader2, 
  CheckCircle,
  Clock,
  HardDrive,
  Shield
} from "lucide-react";

interface BackupResult {
  success: boolean;
  backupId: string;
  timestamp: string;
  summary: {
    patientsBackedUp: number;
    recordsBackedUp: number;
    totalEntities: number;
    backupType: string;
    storageLocation: string;
    estimatedSizeKB: number;
  };
}

interface BackupHistory {
  id: string;
  timestamp: string;
  type: string;
  entities: number;
  status: "completed" | "failed";
}

const Backup = () => {
  const [backupType, setBackupType] = useState<"patients" | "records" | "all">("all");
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lastBackup, setLastBackup] = useState<BackupResult | null>(null);
  const [backupHistory, setBackupHistory] = useState<BackupHistory[]>([]);

  const runBackup = async () => {
    setIsBackingUp(true);
    setProgress(10);

    try {
      setProgress(30);
      
      const { data, error } = await supabase.functions.invoke("cloud-backup", {
        body: { backupType, includeMetadata }
      });

      setProgress(70);

      if (error) throw error;

      setProgress(100);
      setLastBackup(data);
      
      // Add to history
      setBackupHistory(prev => [{
        id: data.backupId,
        timestamp: data.timestamp,
        type: backupType,
        entities: data.summary.totalEntities,
        status: "completed"
      }, ...prev.slice(0, 9)]);

      toast.success(`Backup completed! ${data.summary.totalEntities} entities backed up.`);
    } catch (error) {
      console.error("Backup error:", error);
      toast.error("Backup failed. Please try again.");
      
      setBackupHistory(prev => [{
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        type: backupType,
        entities: 0,
        status: "failed"
      }, ...prev.slice(0, 9)]);
    } finally {
      setIsBackingUp(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  return (
    <>
      <Helmet>
        <title>Data Backup - MediLedger AI</title>
        <meta name="description" content="Backup patient data to Google Cloud Datastore for secure archival." />
      </Helmet>
      <div className="flex h-screen bg-background">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto">
          <div className="border-b bg-card px-8 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Cloud className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Data Backup</h1>
                <p className="text-sm text-muted-foreground">
                  Export to Google Cloud Datastore
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Backup Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Backup Configuration
                  </CardTitle>
                  <CardDescription>Select data to backup</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <RadioGroup 
                    value={backupType} 
                    onValueChange={(v) => setBackupType(v as "patients" | "records" | "all")}
                  >
                    <div className="flex items-center space-x-3 p-3 rounded-lg border">
                      <RadioGroupItem value="all" id="all" />
                      <Label htmlFor="all" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <HardDrive className="h-4 w-4" />
                          <span className="font-medium">Full Backup</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          All patients and medical records
                        </p>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-lg border">
                      <RadioGroupItem value="patients" id="patients" />
                      <Label htmlFor="patients" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span className="font-medium">Patients Only</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Patient profiles and demographics
                        </p>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-lg border">
                      <RadioGroupItem value="records" id="records" />
                      <Label htmlFor="records" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span className="font-medium">Records Only</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Medical records and diagnoses
                        </p>
                      </Label>
                    </div>
                  </RadioGroup>

                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <Label htmlFor="metadata">Include Metadata</Label>
                      <p className="text-sm text-muted-foreground">
                        Add backup info and timestamps
                      </p>
                    </div>
                    <Switch 
                      id="metadata" 
                      checked={includeMetadata}
                      onCheckedChange={setIncludeMetadata}
                    />
                  </div>

                  {progress > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Backup progress</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} />
                    </div>
                  )}

                  <Button 
                    onClick={runBackup} 
                    disabled={isBackingUp}
                    className="w-full"
                    size="lg"
                  >
                    {isBackingUp ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Backing up...
                      </>
                    ) : (
                      <>
                        <Cloud className="h-4 w-4 mr-2" />
                        Start Backup
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Last Backup Result */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Last Backup
                  </CardTitle>
                  <CardDescription>Most recent backup summary</CardDescription>
                </CardHeader>
                <CardContent>
                  {lastBackup ? (
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-muted">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="default">Completed</Badge>
                          <span className="text-sm text-muted-foreground">
                            {new Date(lastBackup.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs font-mono text-muted-foreground">
                          ID: {lastBackup.backupId}
                        </p>
                      </div>

                      <div className="grid gap-3">
                        <div className="flex justify-between p-3 rounded-lg border">
                          <span className="text-sm flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Patients
                          </span>
                          <span className="font-medium">{lastBackup.summary.patientsBackedUp}</span>
                        </div>
                        <div className="flex justify-between p-3 rounded-lg border">
                          <span className="text-sm flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Records
                          </span>
                          <span className="font-medium">{lastBackup.summary.recordsBackedUp}</span>
                        </div>
                        <div className="flex justify-between p-3 rounded-lg border">
                          <span className="text-sm flex items-center gap-2">
                            <HardDrive className="h-4 w-4" />
                            Size
                          </span>
                          <span className="font-medium">{lastBackup.summary.estimatedSizeKB} KB</span>
                        </div>
                        <div className="flex justify-between p-3 rounded-lg border">
                          <span className="text-sm flex items-center gap-2">
                            <Cloud className="h-4 w-4" />
                            Storage
                          </span>
                          <span className="font-medium text-sm">{lastBackup.summary.storageLocation}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Cloud className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No backups yet</p>
                      <p className="text-sm">Run your first backup to see results here</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Backup History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Backup History
                </CardTitle>
                <CardDescription>Recent backup operations (this session)</CardDescription>
              </CardHeader>
              <CardContent>
                {backupHistory.length > 0 ? (
                  <div className="space-y-2">
                    {backupHistory.map((backup) => (
                      <div 
                        key={backup.id} 
                        className="flex items-center justify-between p-3 rounded-lg border"
                      >
                        <div className="flex items-center gap-3">
                          <Badge variant={backup.status === "completed" ? "default" : "destructive"}>
                            {backup.status}
                          </Badge>
                          <span className="text-sm">
                            {backup.type === "all" ? "Full Backup" : 
                             backup.type === "patients" ? "Patients Only" : "Records Only"}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{backup.entities} entities</span>
                          <span>{new Date(backup.timestamp).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-8 text-muted-foreground">
                    No backup history available
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Secure Cloud Storage</p>
                    <p className="text-sm text-muted-foreground">
                      All backups are encrypted and stored securely in Google Cloud Datastore. 
                      Data is compliant with HIPAA regulations and protected with enterprise-grade security.
                    </p>
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

export default Backup;
