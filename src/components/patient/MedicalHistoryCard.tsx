import { Tables } from "@/integrations/supabase/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import MedicalRecordForm from "./MedicalRecordForm";
import {
  FileText,
  Stethoscope,
  FlaskConical,
  Pill,
  ScanLine,
  Syringe,
  HeartPulse,
  Activity,
  Shield,
} from "lucide-react";

type MedicalRecord = Tables<"medical_records">;

interface MedicalHistoryCardProps {
  records: MedicalRecord[];
  patientId: string;
  onRefresh?: () => void;
}

const recordTypeIcons: Record<string, React.ElementType> = {
  consultation: Stethoscope,
  lab_result: FlaskConical,
  prescription: Pill,
  imaging: ScanLine,
  vaccination: Syringe,
  vital_signs: HeartPulse,
  diagnosis: Activity,
};

const recordTypeLabels: Record<string, string> = {
  consultation: "Consultation",
  lab_result: "Lab Result",
  prescription: "Prescription",
  imaging: "Imaging",
  vaccination: "Vaccination",
  vital_signs: "Vital Signs",
  diagnosis: "Diagnosis",
};

const MedicalHistoryCard = ({ records, patientId, onRefresh }: MedicalHistoryCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Medical History
            </CardTitle>
            <CardDescription>
              {records.length} record{records.length !== 1 ? "s" : ""} on file
            </CardDescription>
          </div>
          <MedicalRecordForm patientId={patientId} onSuccess={onRefresh} />
        </div>
      </CardHeader>
      <CardContent>
        {records.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No medical records yet.</p>
            <p className="text-sm">Add the first record for this patient.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {records.map((record) => {
              const Icon = recordTypeIcons[record.record_type] || FileText;
              return (
                <div
                  key={record.id}
                  className="rounded-lg border p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{record.title}</h4>
                          <Badge variant="outline">
                            {recordTypeLabels[record.record_type] || record.record_type}
                          </Badge>
                        </div>
                        {record.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {record.description}
                          </p>
                        )}
                        {record.diagnosis && (
                          <div className="mt-2">
                            <span className="text-xs font-medium text-muted-foreground">Diagnosis: </span>
                            <span className="text-sm">{record.diagnosis}</span>
                          </div>
                        )}
                        {record.treatment && (
                          <div className="mt-1">
                            <span className="text-xs font-medium text-muted-foreground">Treatment: </span>
                            <span className="text-sm">{record.treatment}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(record.created_at), "MMM d, yyyy")}
                      </p>
                      {record.blockchain_hash && (
                        <Badge variant="secondary" className="mt-1 gap-1">
                          <Shield className="h-3 w-3" />
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MedicalHistoryCard;
