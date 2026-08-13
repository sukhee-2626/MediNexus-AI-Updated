import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Eye, FileText, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { differenceInYears } from "date-fns";
import PatientRegistrationForm from "./PatientRegistrationForm";

type Patient = Tables<"patients">;

const PatientsList = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPatients = async () => {
    try {
      const { data, error } = await supabase
        .from("patients")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

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

    // Subscribe to real-time changes
    const channel = supabase
      .channel("patients-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "patients",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setPatients((prev) => [payload.new as Patient, ...prev].slice(0, 10));
          } else if (payload.eventType === "UPDATE") {
            setPatients((prev) =>
              prev.map((p) => (p.id === (payload.new as Patient).id ? (payload.new as Patient) : p))
            );
          } else if (payload.eventType === "DELETE") {
            setPatients((prev) => prev.filter((p) => p.id !== (payload.old as Patient).id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAge = (dob: string) => {
    return differenceInYears(new Date(), new Date(dob));
  };

  const getPrimaryCondition = (conditions: string[] | null) => {
    if (!conditions || conditions.length === 0) return "No conditions";
    return conditions[0];
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Patients</CardTitle>
            <CardDescription>Patients you have registered</CardDescription>
          </div>
          <PatientRegistrationForm onSuccess={fetchPatients} />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : patients.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <p>No patients registered yet.</p>
            <p className="text-sm">Click "Register Patient" to add your first patient.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {patients.map((patient) => (
              <div
                key={patient.id}
                className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(patient.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{patient.full_name}</p>
                      {patient.blood_type && (
                        <Badge variant="outline" className="text-xs">
                          {patient.blood_type}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {getAge(patient.date_of_birth)} yrs • {getPrimaryCondition(patient.chronic_conditions)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    {patient.allergies && patient.allergies.length > 0 && (
                      <Badge variant="destructive" className="mb-1">
                        {patient.allergies.length} Allergies
                      </Badge>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {patient.gender || "Not specified"}
                    </p>
                  </div>
                <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => navigate(`/patient/${patient.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => navigate(`/patient/${patient.id}`)}
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PatientsList;
