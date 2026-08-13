import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import DashboardSidebar from "@/components/dashboard/Sidebar";
import PatientRegistrationForm from "@/components/dashboard/PatientRegistrationForm";
import PatientAISummary from "@/components/dashboard/PatientAISummary";
import ExportMenu from "@/components/dashboard/ExportMenu";
import RiskAssessment from "@/components/dashboard/RiskAssessment";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Eye, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { differenceInYears } from "date-fns";
import { Button } from "@/components/ui/button";

type Patient = Tables<"patients">;

const Patients = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [bloodTypeFilter, setBloodTypeFilter] = useState<string>("all");

  const fetchPatients = async () => {
    try {
      const { data, error } = await supabase
        .from("patients")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPatients(data || []);
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();

    const channel = supabase
      .channel("patients-page-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "patients" },
        () => fetchPatients()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getInitials = (name: string) => {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const getAge = (dob: string) => {
    return differenceInYears(new Date(), new Date(dob));
  };

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch = patient.full_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesBloodType =
      bloodTypeFilter === "all" || patient.blood_type === bloodTypeFilter;
    return matchesSearch && matchesBloodType;
  });

  return (
    <>
      <Helmet>
        <title>Patients - MediLedger AI</title>
        <meta name="description" content="Manage and view all registered patients with AI-powered risk assessment." />
      </Helmet>
      <div className="flex h-screen bg-background">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto">
          <div className="border-b bg-card px-8 py-4">
            <h1 className="text-2xl font-bold">Patients</h1>
            <p className="text-sm text-muted-foreground">Manage all registered patients with AI insights</p>
          </div>

          <div className="p-8">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Patient List */}
              <div className="lg:col-span-2 space-y-6">
                {/* AI Summary */}
                <PatientAISummary patients={patients} />

                {/* Filters */}
                <Card>
                  <CardHeader>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <CardTitle>Patient Directory</CardTitle>
                        <CardDescription>{patients.length} total patients</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <ExportMenu patients={patients} />
                        <PatientRegistrationForm onSuccess={fetchPatients} />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-4 sm:flex-row">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Search patients..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <Select value={bloodTypeFilter} onValueChange={setBloodTypeFilter}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Blood Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Blood Types</SelectItem>
                          <SelectItem value="A+">A+</SelectItem>
                          <SelectItem value="A-">A-</SelectItem>
                          <SelectItem value="B+">B+</SelectItem>
                          <SelectItem value="B-">B-</SelectItem>
                          <SelectItem value="AB+">AB+</SelectItem>
                          <SelectItem value="AB-">AB-</SelectItem>
                          <SelectItem value="O+">O+</SelectItem>
                          <SelectItem value="O-">O-</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Patient List */}
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : filteredPatients.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <p className="text-muted-foreground">
                        {patients.length === 0
                          ? "No patients registered yet."
                          : "No patients match your search criteria."}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {filteredPatients.map((patient) => (
                      <Card
                        key={patient.id}
                        className="cursor-pointer transition-shadow hover:shadow-md"
                        onClick={() => navigate(`/patient/${patient.id}`)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {getInitials(patient.full_name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold">{patient.full_name}</p>
                                {patient.blood_type && (
                                  <Badge variant="outline" className="text-xs">
                                    {patient.blood_type}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {getAge(patient.date_of_birth)} years • {patient.gender || "Not specified"}
                              </p>
                              {patient.chronic_conditions && patient.chronic_conditions.length > 0 && (
                                <div className="flex flex-wrap gap-1 pt-2">
                                  {patient.chronic_conditions.slice(0, 2).map((condition, i) => (
                                    <Badge key={i} variant="secondary" className="text-xs">
                                      {condition}
                                    </Badge>
                                  ))}
                                  {patient.chronic_conditions.length > 2 && (
                                    <Badge variant="secondary" className="text-xs">
                                      +{patient.chronic_conditions.length - 2} more
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </div>
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* AI Risk Assessment Sidebar */}
              <div>
                <RiskAssessment />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Patients;
