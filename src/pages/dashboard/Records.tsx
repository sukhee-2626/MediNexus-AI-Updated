import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import DashboardSidebar from "@/components/dashboard/Sidebar";
import RecordAISummary from "@/components/dashboard/RecordAISummary";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, FileText, Eye, Loader2, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface MedicalRecordWithPatient {
  id: string;
  title: string;
  record_type: string;
  diagnosis: string | null;
  created_at: string;
  patient_id: string;
  patients: {
    full_name: string;
  } | null;
}

const Records = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState<MedicalRecordWithPatient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const fetchRecords = async () => {
    try {
      const { data, error } = await supabase
        .from("medical_records")
        .select("id, title, record_type, diagnosis, created_at, patient_id, patients(full_name)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRecords(data || []);
    } catch (error) {
      console.error("Error fetching records:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();

    const channel = supabase
      .channel("records-page-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "medical_records" },
        () => fetchRecords()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getRecordTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      consultation: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      lab_result: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      prescription: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      imaging: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      vaccination: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300",
      vital_signs: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
      diagnosis: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    };
    return colors[type] || "bg-muted text-muted-foreground";
  };

  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.patients?.full_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || record.record_type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <>
      <Helmet>
        <title>Medical Records - MediLedger AI</title>
        <meta name="description" content="View and manage all medical records with AI-powered summarization." />
      </Helmet>
      <div className="flex h-screen bg-background">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto">
          <div className="border-b bg-card px-8 py-4">
            <h1 className="text-2xl font-bold">Medical Records</h1>
            <p className="text-sm text-muted-foreground">All blockchain-verified medical records with AI analysis</p>
          </div>

          <div className="p-8">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Records List */}
              <div className="lg:col-span-2 space-y-6">
                {/* Filters */}
                <Card>
                  <CardHeader>
                    <CardTitle>Records Directory</CardTitle>
                    <CardDescription>{records.length} total records</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-4 sm:flex-row">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Search records or patients..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Record Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="consultation">Consultation</SelectItem>
                          <SelectItem value="lab_result">Lab Result</SelectItem>
                          <SelectItem value="prescription">Prescription</SelectItem>
                          <SelectItem value="imaging">Imaging</SelectItem>
                          <SelectItem value="vaccination">Vaccination</SelectItem>
                          <SelectItem value="vital_signs">Vital Signs</SelectItem>
                          <SelectItem value="diagnosis">Diagnosis</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Records List */}
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : filteredRecords.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
                      <p className="mt-4 text-muted-foreground">
                        {records.length === 0
                          ? "No medical records found."
                          : "No records match your search criteria."}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {filteredRecords.map((record) => (
                      <Card
                        key={record.id}
                        className="cursor-pointer transition-shadow hover:shadow-md"
                        onClick={() => navigate(`/patient/${record.patient_id}`)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                <FileText className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-semibold">{record.title}</p>
                                  <Badge className={getRecordTypeColor(record.record_type)}>
                                    {record.record_type.replace("_", " ")}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {record.patients?.full_name || "Unknown Patient"}
                                </p>
                                {record.diagnosis && (
                                  <p className="mt-1 text-sm text-muted-foreground">
                                    Diagnosis: {record.diagnosis}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                {format(new Date(record.created_at), "MMM d, yyyy")}
                              </div>
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* AI Summary Sidebar */}
              <div>
                <RecordAISummary />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Records;
