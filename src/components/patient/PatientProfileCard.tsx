import { Tables } from "@/integrations/supabase/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { differenceInYears, format } from "date-fns";
import {
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Droplet,
  AlertTriangle,
  Activity,
  UserCheck,
} from "lucide-react";

type Patient = Tables<"patients">;

interface PatientProfileCardProps {
  patient: Patient;
}

const PatientProfileCard = ({ patient }: PatientProfileCardProps) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const age = differenceInYears(new Date(), new Date(patient.date_of_birth));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Patient Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Header with avatar */}
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-primary/10 text-primary text-xl">
              {getInitials(patient.full_name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-xl font-semibold">{patient.full_name}</h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {patient.blood_type && (
                <Badge variant="outline" className="gap-1">
                  <Droplet className="h-3 w-3" />
                  {patient.blood_type}
                </Badge>
              )}
              {patient.gender && (
                <Badge variant="secondary">{patient.gender}</Badge>
              )}
              <Badge variant="secondary">{age} years old</Badge>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Contact Information</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Born: {format(new Date(patient.date_of_birth), "MMMM d, yyyy")}</span>
              </div>
              {patient.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{patient.phone}</span>
                </div>
              )}
              {patient.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{patient.email}</span>
                </div>
              )}
              {patient.address && (
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span>{patient.address}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Emergency Contact</h3>
            {patient.emergency_contact_name || patient.emergency_contact_phone ? (
              <div className="space-y-2">
                {patient.emergency_contact_name && (
                  <div className="flex items-center gap-2 text-sm">
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                    <span>{patient.emergency_contact_name}</span>
                  </div>
                )}
                {patient.emergency_contact_phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{patient.emergency_contact_phone}</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No emergency contact on file</p>
            )}
          </div>
        </div>

        {/* Medical Information */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Allergies
            </h3>
            {patient.allergies && patient.allergies.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {patient.allergies.map((allergy, index) => (
                  <Badge key={index} variant="destructive">
                    {allergy}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No known allergies</p>
            )}
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Chronic Conditions
            </h3>
            {patient.chronic_conditions && patient.chronic_conditions.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {patient.chronic_conditions.map((condition, index) => (
                  <Badge key={index} variant="secondary">
                    {condition}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No chronic conditions recorded</p>
            )}
          </div>
        </div>

        {/* DID Information */}
        {patient.patient_did && (
          <div className="pt-4 border-t">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Decentralized Identifier (DID)</h3>
            <code className="text-xs bg-muted px-2 py-1 rounded break-all">
              {patient.patient_did}
            </code>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PatientProfileCard;
