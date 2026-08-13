import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Brain, Send, Sparkles, AlertTriangle, CheckCircle2, Loader2, Plus, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DiagnosisResult {
  condition: string;
  confidence: number;
  keyFeatures?: string[];
  distinguishingFactors?: string;
}

interface AnalysisResult {
  differentialDiagnoses?: DiagnosisResult[];
  recommendedTests?: string[];
  redFlags?: string[];
  generalRecommendations?: string;
  urgencyLevel?: string;
  rawResponse?: string;
}

const AIAssistant = () => {
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [currentSymptom, setCurrentSymptom] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  const addSymptom = () => {
    if (currentSymptom.trim() && !symptoms.includes(currentSymptom.trim())) {
      setSymptoms([...symptoms, currentSymptom.trim()]);
      setCurrentSymptom("");
    }
  };

  const removeSymptom = (symptom: string) => {
    setSymptoms(symptoms.filter((s) => s !== symptom));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSymptom();
    }
  };

  const handleAnalyze = async () => {
    if (symptoms.length === 0) {
      toast.error("Please add at least one symptom");
      return;
    }

    setIsAnalyzing(true);
    setAnalysis(null);

    try {
      const { data, error } = await supabase.functions.invoke("ai-diagnostics", {
        body: { symptoms },
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        toast.error(data.error);
        return;
      }

      setAnalysis(data.analysis);
      toast.success("Analysis complete");
    } catch (error) {
      console.error("AI analysis error:", error);
      toast.error("Failed to analyze symptoms. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 70) return "text-green-600";
    if (confidence >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getUrgencyColor = (urgency?: string) => {
    switch (urgency) {
      case "emergency":
        return "bg-destructive text-destructive-foreground";
      case "urgent":
        return "bg-orange-500 text-white";
      case "soon":
        return "bg-yellow-500 text-black";
      default:
        return "bg-green-500 text-white";
    }
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-accent/50 to-background">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Brain className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-lg">AI Diagnostic Assistant</CardTitle>
            <CardDescription>Powered by Google Gemini</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Symptom Input */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="Enter a symptom..."
              value={currentSymptom}
              onChange={(e) => setCurrentSymptom(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isAnalyzing}
            />
            <Button 
              type="button" 
              size="icon" 
              variant="outline" 
              onClick={addSymptom}
              disabled={isAnalyzing || !currentSymptom.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {symptoms.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {symptoms.map((symptom) => (
                <Badge key={symptom} variant="secondary" className="gap-1">
                  {symptom}
                  <button
                    onClick={() => removeSymptom(symptom)}
                    className="ml-1 hover:text-destructive"
                    disabled={isAnalyzing}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        <Button 
          onClick={handleAnalyze} 
          disabled={isAnalyzing || symptoms.length === 0}
          className="w-full"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Analyze Symptoms
            </>
          )}
        </Button>

        {/* Analysis Results */}
        {analysis && (
          <div className="rounded-lg border bg-card p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">AI Analysis</span>
              </div>
              {analysis.urgencyLevel && (
                <Badge className={getUrgencyColor(analysis.urgencyLevel)}>
                  {analysis.urgencyLevel.toUpperCase()}
                </Badge>
              )}
            </div>

            {/* Differential Diagnoses */}
            {analysis.differentialDiagnoses && analysis.differentialDiagnoses.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground">
                  DIFFERENTIAL DIAGNOSES
                </p>
                {analysis.differentialDiagnoses.slice(0, 3).map((diagnosis, idx) => (
                  <div key={idx} className="flex items-center gap-2 rounded-md bg-muted/50 p-2">
                    <CheckCircle2 className={`h-4 w-4 ${getConfidenceColor(diagnosis.confidence)}`} />
                    <span className="text-sm flex-1">{diagnosis.condition}</span>
                    <Badge variant="secondary" className="text-xs">
                      {diagnosis.confidence}%
                    </Badge>
                  </div>
                ))}
              </div>
            )}

            {/* Red Flags */}
            {analysis.redFlags && analysis.redFlags.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-destructive">RED FLAGS</p>
                {analysis.redFlags.map((flag, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm text-destructive">
                    <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                    {flag}
                  </div>
                ))}
              </div>
            )}

            {/* Recommended Tests */}
            {analysis.recommendedTests && analysis.recommendedTests.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground">
                  RECOMMENDED TESTS
                </p>
                <p className="text-xs text-muted-foreground">
                  {analysis.recommendedTests.slice(0, 4).join(" • ")}
                </p>
              </div>
            )}

            {/* General Recommendations */}
            {analysis.generalRecommendations && (
              <p className="text-xs text-muted-foreground border-t pt-2">
                {analysis.generalRecommendations}
              </p>
            )}

            {/* Raw Response Fallback */}
            {analysis.rawResponse && !analysis.differentialDiagnoses && (
              <p className="text-xs text-muted-foreground whitespace-pre-wrap">
                {analysis.rawResponse}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIAssistant;
