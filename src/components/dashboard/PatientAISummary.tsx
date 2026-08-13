import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tables } from "@/integrations/supabase/types";

type Patient = Tables<"patients">;

interface PatientAISummaryProps {
  patients: Patient[];
}

const PatientAISummary = ({ patients }: PatientAISummaryProps) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateSummary = async () => {
    if (patients.length === 0) {
      toast.error("No patients to summarize");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("patient-summary", {
        body: { patients },
      });

      if (error) throw error;
      if (data.error) {
        toast.error(data.error);
        return;
      }

      setSummary(data.summary);
      toast.success("Summary generated");
    } catch (error) {
      console.error("Error generating summary:", error);
      toast.error("Failed to generate summary");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-lg">AI Patient Summary</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <img 
                  src="https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg" 
                  alt="Gemini" 
                  className="h-3 w-3"
                />
                Powered by Google Gemini
              </CardDescription>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={generateSummary}
            disabled={isLoading || patients.length === 0}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : summary ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Summary
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {summary ? (
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <div className="whitespace-pre-wrap text-sm text-muted-foreground">
              {summary}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Click "Generate Summary" to get an AI-powered overview of your patient cohort including demographics, common conditions, and insights.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default PatientAISummary;
