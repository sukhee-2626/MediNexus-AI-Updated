import { useState } from "react";
import { Helmet } from "react-helmet-async";
import DashboardSidebar from "@/components/dashboard/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  FileText, 
  Loader2, 
  Sparkles,
  Target,
  Activity,
  Users,
  Heart
} from "lucide-react";

interface TrendItem {
  trend: string;
  impact: "positive" | "negative" | "neutral";
  details: string;
}

interface PredictionItem {
  prediction: string;
  confidence: "high" | "medium" | "low";
  timeframe: string;
}

interface AnomalyItem {
  type: string;
  description: string;
  severity: "critical" | "warning" | "info";
  recommendation: string;
}

interface KeyMetric {
  metric: string;
  value: string;
  status: "good" | "warning" | "critical";
}

interface ActionItem {
  action: string;
  priority: "high" | "medium" | "low";
  impact: string;
}

interface AnalysisResult {
  trends?: {
    keyTrends?: TrendItem[];
    patientDemographics?: { summary: string; insights: string[] };
    recordPatterns?: { summary: string; recommendations: string[] };
    overallHealth?: string;
  };
  predictions?: {
    shortTermPredictions?: PredictionItem[];
    resourceNeeds?: { resource: string; projectedNeed: string; priority: string }[];
    riskAreas?: { area: string; riskLevel: string; mitigation: string }[];
    growthProjections?: { patients: string; records: string };
  };
  anomalies?: {
    anomalies?: AnomalyItem[];
    dataQualityIssues?: { issue: string; affectedArea: string; suggestion: string }[];
    unusualPatterns?: { pattern: string; possibleCause: string }[];
  };
  summary?: {
    executiveSummary?: string;
    keyMetrics?: KeyMetric[];
    actionItems?: ActionItem[];
    highlights?: string[];
    recommendations?: string[];
  };
}

const AIAnalytics = () => {
  const [activeTab, setActiveTab] = useState("summary");
  const [loading, setLoading] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, AnalysisResult>>({});

  const runAnalysis = async (type: "trends" | "predictions" | "anomalies" | "summary") => {
    setLoading(type);
    try {
      const { data, error } = await supabase.functions.invoke("ai-analytics", {
        body: { analysisType: type }
      });

      if (error) throw error;
      
      setResults(prev => ({
        ...prev,
        [type]: data.analysis
      }));
      
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} analysis complete`);
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Failed to run analysis. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "positive": return "text-green-500";
      case "negative": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  const getSeverityVariant = (severity: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (severity) {
      case "critical": return "destructive";
      case "warning": return "secondary";
      default: return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good": return "bg-green-500";
      case "warning": return "bg-yellow-500";
      case "critical": return "bg-destructive";
      default: return "bg-muted";
    }
  };

  const getPriorityBadge = (priority: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "secondary";
      default: return "outline";
    }
  };

  return (
    <>
      <Helmet>
        <title>AI Analytics - MediLedger AI</title>
        <meta name="description" content="AI-powered healthcare analytics with Google Gemini insights." />
      </Helmet>
      <div className="flex h-screen bg-background">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto">
          <div className="border-b bg-card px-8 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Brain className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">AI Analytics</h1>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  Powered by Google Gemini <Sparkles className="h-3 w-3" />
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="summary" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Summary
                </TabsTrigger>
                <TabsTrigger value="trends" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Trends
                </TabsTrigger>
                <TabsTrigger value="predictions" className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Predictions
                </TabsTrigger>
                <TabsTrigger value="anomalies" className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Anomalies
                </TabsTrigger>
              </TabsList>

              {/* Summary Tab */}
              <TabsContent value="summary" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Executive Summary
                      </span>
                      <Button 
                        onClick={() => runAnalysis("summary")}
                        disabled={loading === "summary"}
                      >
                        {loading === "summary" ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Sparkles className="h-4 w-4 mr-2" />
                        )}
                        Generate Summary
                      </Button>
                    </CardTitle>
                    <CardDescription>AI-generated overview of your healthcare data</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {results.summary?.summary?.executiveSummary ? (
                      <div className="space-y-6">
                        <p className="text-lg">{results.summary.summary.executiveSummary}</p>
                        
                        {results.summary.summary.keyMetrics && (
                          <div className="grid gap-4 md:grid-cols-3">
                            {results.summary.summary.keyMetrics.map((metric, i) => (
                              <div key={i} className="rounded-lg border p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm text-muted-foreground">{metric.metric}</span>
                                  <span className={`h-2 w-2 rounded-full ${getStatusColor(metric.status)}`} />
                                </div>
                                <p className="text-2xl font-bold">{metric.value}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {results.summary.summary.actionItems && (
                          <div>
                            <h4 className="font-semibold mb-3">Action Items</h4>
                            <div className="space-y-2">
                              {results.summary.summary.actionItems.map((item, i) => (
                                <div key={i} className="flex items-start gap-3 p-3 rounded-lg border">
                                  <Badge variant={getPriorityBadge(item.priority)}>{item.priority}</Badge>
                                  <div>
                                    <p className="font-medium">{item.action}</p>
                                    <p className="text-sm text-muted-foreground">{item.impact}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {results.summary.summary.recommendations && (
                          <div>
                            <h4 className="font-semibold mb-3">Recommendations</h4>
                            <ul className="space-y-2">
                              {results.summary.summary.recommendations.map((rec, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <Activity className="h-4 w-4 mt-1 text-primary" />
                                  <span>{rec}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">
                        Click "Generate Summary" to get an AI-powered executive summary
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Trends Tab */}
              <TabsContent value="trends" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Trend Analysis
                      </span>
                      <Button 
                        onClick={() => runAnalysis("trends")}
                        disabled={loading === "trends"}
                      >
                        {loading === "trends" ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Sparkles className="h-4 w-4 mr-2" />
                        )}
                        Analyze Trends
                      </Button>
                    </CardTitle>
                    <CardDescription>Identify patterns in your healthcare data</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {results.trends?.trends?.keyTrends ? (
                      <div className="space-y-6">
                        {results.trends.trends.overallHealth && (
                          <div className="p-4 rounded-lg bg-muted">
                            <p className="font-medium">{results.trends.trends.overallHealth}</p>
                          </div>
                        )}

                        <div className="space-y-3">
                          {results.trends.trends.keyTrends.map((trend, i) => (
                            <div key={i} className="p-4 rounded-lg border">
                              <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className={`h-4 w-4 ${getImpactColor(trend.impact)}`} />
                                <span className="font-medium">{trend.trend}</span>
                                <Badge variant="outline">{trend.impact}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{trend.details}</p>
                            </div>
                          ))}
                        </div>

                        {results.trends.trends.patientDemographics && (
                          <div>
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              Patient Demographics
                            </h4>
                            <p className="mb-2">{results.trends.trends.patientDemographics.summary}</p>
                            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                              {results.trends.trends.patientDemographics.insights.map((insight, i) => (
                                <li key={i}>{insight}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">
                        Click "Analyze Trends" to discover patterns in your data
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Predictions Tab */}
              <TabsContent value="predictions" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Predictive Analytics
                      </span>
                      <Button 
                        onClick={() => runAnalysis("predictions")}
                        disabled={loading === "predictions"}
                      >
                        {loading === "predictions" ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Sparkles className="h-4 w-4 mr-2" />
                        )}
                        Generate Predictions
                      </Button>
                    </CardTitle>
                    <CardDescription>AI-powered forecasts and predictions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {results.predictions?.predictions?.shortTermPredictions ? (
                      <div className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                          {results.predictions.predictions.shortTermPredictions.map((pred, i) => (
                            <div key={i} className="p-4 rounded-lg border">
                              <div className="flex items-center justify-between mb-2">
                                <Badge variant={getPriorityBadge(pred.confidence)}>{pred.confidence} confidence</Badge>
                                <span className="text-sm text-muted-foreground">{pred.timeframe}</span>
                              </div>
                              <p className="font-medium">{pred.prediction}</p>
                            </div>
                          ))}
                        </div>

                        {results.predictions.predictions.riskAreas && (
                          <div>
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4" />
                              Risk Areas
                            </h4>
                            <div className="space-y-2">
                              {results.predictions.predictions.riskAreas.map((risk, i) => (
                                <div key={i} className="p-3 rounded-lg border">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium">{risk.area}</span>
                                    <Badge variant={getSeverityVariant(risk.riskLevel === "high" ? "critical" : risk.riskLevel === "medium" ? "warning" : "info")}>
                                      {risk.riskLevel}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground">{risk.mitigation}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {results.predictions.predictions.growthProjections && (
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="p-4 rounded-lg bg-muted">
                              <p className="text-sm text-muted-foreground mb-1">Patient Growth</p>
                              <p className="font-medium">{results.predictions.predictions.growthProjections.patients}</p>
                            </div>
                            <div className="p-4 rounded-lg bg-muted">
                              <p className="text-sm text-muted-foreground mb-1">Record Growth</p>
                              <p className="font-medium">{results.predictions.predictions.growthProjections.records}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">
                        Click "Generate Predictions" to see AI forecasts
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Anomalies Tab */}
              <TabsContent value="anomalies" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        Anomaly Detection
                      </span>
                      <Button 
                        onClick={() => runAnalysis("anomalies")}
                        disabled={loading === "anomalies"}
                      >
                        {loading === "anomalies" ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Sparkles className="h-4 w-4 mr-2" />
                        )}
                        Detect Anomalies
                      </Button>
                    </CardTitle>
                    <CardDescription>Identify unusual patterns and potential issues</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {results.anomalies?.anomalies?.anomalies ? (
                      <div className="space-y-6">
                        {results.anomalies.anomalies.anomalies.length > 0 ? (
                          <div className="space-y-3">
                            {results.anomalies.anomalies.anomalies.map((anomaly, i) => (
                              <div key={i} className={`p-4 rounded-lg border ${
                                anomaly.severity === "critical" ? "border-destructive bg-destructive/5" : 
                                anomaly.severity === "warning" ? "border-yellow-500 bg-yellow-500/5" : ""
                              }`}>
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant={getSeverityVariant(anomaly.severity)}>{anomaly.severity}</Badge>
                                  <span className="font-medium">{anomaly.type}</span>
                                </div>
                                <p className="text-sm mb-2">{anomaly.description}</p>
                                <p className="text-sm text-muted-foreground">
                                  <strong>Recommendation:</strong> {anomaly.recommendation}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-green-600">
                            <Heart className="h-12 w-12 mx-auto mb-2" />
                            <p className="font-medium">No anomalies detected</p>
                            <p className="text-sm text-muted-foreground">Your data looks healthy!</p>
                          </div>
                        )}

                        {results.anomalies.anomalies.dataQualityIssues && results.anomalies.anomalies.dataQualityIssues.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-3">Data Quality Issues</h4>
                            <div className="space-y-2">
                              {results.anomalies.anomalies.dataQualityIssues.map((issue, i) => (
                                <div key={i} className="p-3 rounded-lg border">
                                  <p className="font-medium">{issue.issue}</p>
                                  <p className="text-sm text-muted-foreground">
                                    Affected: {issue.affectedArea} • {issue.suggestion}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">
                        Click "Detect Anomalies" to find unusual patterns
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </>
  );
};

export default AIAnalytics;
