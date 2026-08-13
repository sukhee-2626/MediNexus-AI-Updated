import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, AlertTriangle, CheckCircle, FileText, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface RecordSummary {
  summary: string;
  keyFindings: string[];
  criticalAlerts: string[];
  recommendations: string[];
  followUpNeeded: boolean;
}

const RecordAISummary = () => {
  const [recordContent, setRecordContent] = useState("");
  const [recordType, setRecordType] = useState("lab_result");
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<RecordSummary | null>(null);

  const handleSummarize = async () => {
    if (!recordContent.trim()) {
      toast.error("Please enter record content to summarize");
      return;
    }

    setIsLoading(true);
    setSummary(null);

    try {
      const { data, error } = await supabase.functions.invoke('record-summary', {
        body: { recordType, recordContent }
      });

      if (error) throw error;

      if (data?.success && data?.data) {
        setSummary(data.data);
        toast.success("Record summarized successfully");
      } else {
        throw new Error(data?.error || "Failed to summarize record");
      }
    } catch (error) {
      console.error("Summary error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to summarize record");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              AI Record Summarizer
            </CardTitle>
            <CardDescription>
              Paste medical record content for AI-powered analysis
            </CardDescription>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
            <Sparkles className="h-3 w-3" />
            Powered by Google Gemini
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Select value={recordType} onValueChange={setRecordType}>
            <SelectTrigger>
              <SelectValue placeholder="Select record type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lab_result">Lab Result</SelectItem>
              <SelectItem value="prescription">Prescription</SelectItem>
              <SelectItem value="diagnosis">Diagnosis</SelectItem>
              <SelectItem value="imaging">Imaging Report</SelectItem>
              <SelectItem value="clinical_note">Clinical Note</SelectItem>
              <SelectItem value="discharge_summary">Discharge Summary</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Textarea
          placeholder="Paste medical record content here..."
          value={recordContent}
          onChange={(e) => setRecordContent(e.target.value)}
          className="min-h-[120px]"
        />

        <Button 
          onClick={handleSummarize} 
          disabled={isLoading || !recordContent.trim()}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Summarize Record
            </>
          )}
        </Button>

        {summary && (
          <div className="space-y-4 pt-4 border-t">
            <div>
              <h4 className="font-semibold mb-2">Summary</h4>
              <p className="text-sm text-muted-foreground">{summary.summary}</p>
            </div>

            {summary.criticalAlerts.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  Critical Alerts
                </h4>
                <ul className="space-y-1">
                  {summary.criticalAlerts.map((alert, i) => (
                    <li key={i} className="text-sm bg-destructive/10 text-destructive p-2 rounded">
                      {alert}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {summary.keyFindings.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Key Findings</h4>
                <div className="flex flex-wrap gap-2">
                  {summary.keyFindings.map((finding, i) => (
                    <Badge key={i} variant="secondary">{finding}</Badge>
                  ))}
                </div>
              </div>
            )}

            {summary.recommendations.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Recommendations</h4>
                <ul className="space-y-1">
                  {summary.recommendations.map((rec, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {summary.followUpNeeded && (
              <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                Follow-up Required
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecordAISummary;
