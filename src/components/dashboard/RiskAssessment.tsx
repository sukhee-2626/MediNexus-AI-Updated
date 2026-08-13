import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sparkles, AlertTriangle, ShieldAlert, Activity, Loader2, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface RiskAssessmentResult {
  patientName: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskScore: number;
  riskFactors: string[];
  recommendations: string[];
  urgentAttentionNeeded: boolean;
}

const RiskAssessment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [assessments, setAssessments] = useState<RiskAssessmentResult[]>([]);
  const [patients, setPatients] = useState<any[]>([]);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .limit(10);
    
    if (error) {
      console.error('Error fetching patients:', error);
      return;
    }
    
    setPatients(data || []);
  };

  const runRiskAssessment = async () => {
    if (patients.length === 0) {
      toast.error("No patients available for assessment");
      return;
    }

    setIsLoading(true);
    setAssessments([]);

    try {
      const patientData = patients.map(p => ({
        name: p.full_name,
        age: p.date_of_birth ? Math.floor((Date.now() - new Date(p.date_of_birth).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : undefined,
        gender: p.gender,
        conditions: p.medical_conditions || [],
        medications: p.current_medications || [],
        medicalHistory: p.allergies ? `Allergies: ${p.allergies.join(', ')}` : undefined
      }));

      const { data, error } = await supabase.functions.invoke('risk-assessment', {
        body: { patients: patientData }
      });

      if (error) throw error;

      if (data?.success && data?.data?.assessments) {
        setAssessments(data.data.assessments);
        toast.success("Risk assessment completed");
      } else {
        throw new Error(data?.error || "Failed to complete assessment");
      }
    } catch (error) {
      console.error("Assessment error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to run assessment");
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  const getRiskBadgeVariant = (level: string) => {
    switch (level) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5" />
              AI Risk Assessment
            </CardTitle>
            <CardDescription>
              Analyze patient data to identify high-risk patients
            </CardDescription>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
            <Sparkles className="h-3 w-3" />
            Powered by Google Gemini
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={runRiskAssessment} 
          disabled={isLoading || patients.length === 0}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing {patients.length} patients...
            </>
          ) : (
            <>
              <Activity className="mr-2 h-4 w-4" />
              Run Risk Assessment ({patients.length} patients)
            </>
          )}
        </Button>

        {assessments.length > 0 && (
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Assessment Results</h4>
              <Button variant="ghost" size="sm" onClick={runRiskAssessment} disabled={isLoading}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            
            {assessments
              .sort((a, b) => b.riskScore - a.riskScore)
              .map((assessment, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-lg border ${
                    assessment.urgentAttentionNeeded ? 'border-destructive bg-destructive/5' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{assessment.patientName}</span>
                      {assessment.urgentAttentionNeeded && (
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                      )}
                    </div>
                    <Badge variant={getRiskBadgeVariant(assessment.riskLevel) as any}>
                      {assessment.riskLevel.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-16">Risk Score</span>
                      <Progress value={assessment.riskScore} className="flex-1 h-2" />
                      <span className="text-xs font-medium w-8">{assessment.riskScore}%</span>
                    </div>
                    
                    {assessment.riskFactors.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {assessment.riskFactors.slice(0, 3).map((factor, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {factor}
                          </Badge>
                        ))}
                        {assessment.riskFactors.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{assessment.riskFactors.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}

        {patients.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No patients available for risk assessment
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default RiskAssessment;
