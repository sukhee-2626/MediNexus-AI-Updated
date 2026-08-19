import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Scan, FileSearch, CheckCircle2, Download, AlertCircle, RefreshCw, Upload, Image } from "lucide-react";
import { toast } from "sonner";

export const AIDiagnosticsScanModal = () => {
  const [open, setOpen] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{
    title: string;
    confidence: string;
    status: "Normal" | "Attention Required";
    findings: string[];
    summary: string;
  } | null>(null);

  const handleRunScan = () => {
    setScanning(true);
    setScanResult(null);

    setTimeout(() => {
      setScanning(false);
      setScanResult({
        title: "Chest Radiograph DICOM Analysis",
        confidence: "98.6%",
        status: "Normal",
        findings: [
          "Lungs clear bilaterally with no focal consolidation or pleural effusion.",
          "Cardiac silhouette size within normal limits.",
          "No acute osseous abnormality detected."
        ],
        summary: "AI Diagnostic Scan indicates normal cardiac & lung parenchymal patterns."
      });
      toast.success("AI Imaging Scan completed with 98.6% confidence score!");
    }, 2000);
  };

  const handleDownloadReport = () => {
    toast.success("Diagnostic PDF report downloaded to device!");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="border-primary/40 text-primary hover:bg-primary/10 gap-1.5 text-xs font-semibold">
          <Scan className="h-4 w-4" />
          AI DICOM & X-Ray Imaging Scanner
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Diagnostic X-Ray & Imaging Copilot
          </DialogTitle>
          <DialogDescription>
            Multi-modal AI vision scanner for automated DICOM, X-Ray, and ECG anomaly detection.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Sample Image Preview Box */}
          <div className="p-4 rounded-2xl bg-slate-950 text-white border border-slate-800 flex flex-col items-center justify-center relative min-h-[180px]">
            {scanning ? (
              <div className="flex flex-col items-center justify-center space-y-3">
                <RefreshCw className="h-10 w-10 animate-spin text-primary" />
                <p className="text-xs font-mono text-primary animate-pulse">Running AI Vision Neural Scan...</p>
              </div>
            ) : scanResult ? (
              <div className="w-full space-y-3 text-left">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-xs text-white">{scanResult.title}</span>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40 text-[10px]">
                    Confidence: {scanResult.confidence}
                  </Badge>
                </div>
                <div className="text-xs space-y-1 text-slate-300">
                  <p className="font-semibold text-emerald-400">✓ {scanResult.summary}</p>
                  <ul className="list-disc list-inside text-[11px] text-slate-400 space-y-0.5 pt-1">
                    {scanResult.findings.map((finding, idx) => (
                      <li key={idx}>{finding}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-2 text-center text-slate-400">
                <Image className="h-12 w-12 text-slate-600" />
                <p className="text-xs font-medium">Sample DICOM Radiograph loaded</p>
                <p className="text-[10px] text-slate-500">Click "Run AI Diagnostics" to analyze scan</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              onClick={handleRunScan}
              disabled={scanning}
              className="flex-1 bg-primary text-primary-foreground font-bold gap-2 text-xs"
            >
              <Scan className="h-4 w-4" />
              {scanning ? "Scanning..." : "Run AI Diagnostics Scan"}
            </Button>

            {scanResult && (
              <Button
                onClick={handleDownloadReport}
                variant="outline"
                className="text-xs gap-1.5 border-primary/40 text-primary"
              >
                <Download className="h-4 w-4" /> Download PDF
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
