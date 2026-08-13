import { Tables } from "@/integrations/supabase/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, formatDistanceToNow } from "date-fns";
import { Shield, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { GrantConsentDialog, RevokeConsentButton } from "./ConsentManagementDialog";

type ConsentGrant = Tables<"consent_grants">;

interface ConsentStatusCardProps {
  consents: ConsentGrant[];
  patientId: string;
  onRefresh?: () => void;
}

const accessLevelColors: Record<string, string> = {
  read: "bg-blue-500/10 text-blue-600 border-blue-200",
  write: "bg-amber-500/10 text-amber-600 border-amber-200",
  full: "bg-green-500/10 text-green-600 border-green-200",
};

const statusIcons: Record<string, React.ElementType> = {
  active: CheckCircle,
  revoked: XCircle,
  expired: AlertCircle,
};

const statusColors: Record<string, string> = {
  active: "default",
  revoked: "destructive",
  expired: "secondary",
};

const ConsentStatusCard = ({ consents, patientId, onRefresh }: ConsentStatusCardProps) => {
  const activeConsents = consents.filter((c) => c.status === "active");
  const inactiveConsents = consents.filter((c) => c.status !== "active");

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Consent Status
            </CardTitle>
            <CardDescription>
              {activeConsents.length} active consent{activeConsents.length !== 1 ? "s" : ""}
            </CardDescription>
          </div>
          <GrantConsentDialog patientId={patientId} onSuccess={onRefresh} />
        </div>
      </CardHeader>
      <CardContent>
        {consents.length === 0 ? (
          <div className="py-6 text-center text-muted-foreground">
            <Shield className="h-10 w-10 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No consent grants yet.</p>
            <p className="text-xs mt-1">Patient can grant access to providers.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Active Consents */}
            {activeConsents.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Active
                </h3>
                {activeConsents.map((consent) => (
                  <ConsentItem key={consent.id} consent={consent} onRefresh={onRefresh} />
                ))}
              </div>
            )}

            {/* Inactive Consents */}
            {inactiveConsents.length > 0 && (
              <div className="space-y-3 pt-4 border-t">
                <h3 className="text-sm font-medium text-muted-foreground">History</h3>
                {inactiveConsents.map((consent) => (
                  <ConsentItem key={consent.id} consent={consent} onRefresh={onRefresh} />
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const ConsentItem = ({ consent, onRefresh }: { consent: ConsentGrant; onRefresh?: () => void }) => {
  const StatusIcon = statusIcons[consent.status] || AlertCircle;

  return (
    <div className="rounded-lg border p-3 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge
            variant={statusColors[consent.status] as "default" | "destructive" | "secondary"}
            className="gap-1"
          >
            <StatusIcon className="h-3 w-3" />
            {consent.status}
          </Badge>
          <Badge
            variant="outline"
            className={accessLevelColors[consent.access_level]}
          >
            {consent.access_level}
          </Badge>
        </div>
        <RevokeConsentButton consent={consent} onSuccess={onRefresh} />
      </div>

      {consent.purpose && (
        <p className="text-sm text-muted-foreground">{consent.purpose}</p>
      )}

      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>Granted {formatDistanceToNow(new Date(consent.granted_at))} ago</span>
        </div>
      </div>

      {consent.expires_at && consent.status === "active" && (
        <p className="text-xs text-amber-600">
          Expires: {format(new Date(consent.expires_at), "MMM d, yyyy")}
        </p>
      )}

      {consent.revoked_at && (
        <p className="text-xs text-destructive">
          Revoked: {format(new Date(consent.revoked_at), "MMM d, yyyy")}
        </p>
      )}
    </div>
  );
};

export default ConsentStatusCard;
