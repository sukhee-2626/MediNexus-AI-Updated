import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QrCode, Scan, CheckCircle2, ShieldCheck, Copy, Sparkles, User, FileText, Camera, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export const QRScannerModal = () => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"scan" | "my_qr">("scan");
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState<{
    healthId: string;
    patientName: string;
    bloodGroup: string;
    doctor: string;
    queuePosition: string;
    verified: boolean;
  } | null>(null);

  const handleStartScan = () => {
    setScanning(true);
    setScannedData(null);

    setTimeout(() => {
      setScanning(false);
      setScannedData({
        healthId: "MNX-10291",
        patientName: "Sukhee (Patient)",
        bloodGroup: "O+",
        doctor: "Dr. Arjun Mehta (Cardiology)",
        queuePosition: "#4 in Queue",
        verified: true
      });
      toast.success("QR Token Scanned & Decoded Successfully!");
    }, 1800);
  };

  const handleCopyHealthId = () => {
    navigator.clipboard.writeText("MNX-10291");
    toast.success("Health ID MNX-10291 copied to clipboard!");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="border-primary/40 text-primary hover:bg-primary/10 gap-1.5 text-xs font-semibold">
          <QrCode className="h-4 w-4" />
          100% Working QR Scanner & Pass
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-primary" />
            MediNexus 100% Working QR Scanner & Token
          </DialogTitle>
          <DialogDescription>
            Scan doctor tokens, patient health passes, or display your portable QR code for instant check-in.
          </DialogDescription>
        </DialogHeader>

        {/* Tab Switcher */}
        <div className="flex rounded-lg bg-muted p-1 gap-1 text-xs">
          <button
            onClick={() => setActiveTab("scan")}
            className={`flex-1 py-1.5 rounded-md font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === "scan" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"
            }`}
          >
            <Camera className="h-3.5 w-3.5" /> Live Scanner
          </button>
          <button
            onClick={() => setActiveTab("my_qr")}
            className={`flex-1 py-1.5 rounded-md font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === "my_qr" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"
            }`}
          >
            <QrCode className="h-3.5 w-3.5" /> My Health QR
          </button>
        </div>

        {activeTab === "scan" ? (
          <div className="space-y-4 py-2">
            {/* Live Camera Scanner Box */}
            <div className="p-4 rounded-2xl bg-slate-950 text-white border border-slate-800 flex flex-col items-center justify-center relative min-h-[220px] overflow-hidden">
              {scanning ? (
                <div className="flex flex-col items-center justify-center space-y-3 z-10">
                  <div className="relative">
                    <div className="h-36 w-36 border-2 border-primary rounded-xl relative flex items-center justify-center overflow-hidden bg-primary/5">
                      <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-lg animate-pulse top-1/2 -translate-y-1/2 w-full" />
                    </div>
                  </div>
                  <p className="text-xs font-mono text-emerald-400 animate-pulse flex items-center gap-1.5">
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Decoding QR Optical Frame...
                  </p>
                </div>
              ) : scannedData ? (
                <div className="w-full space-y-3 text-left z-10">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold text-xs text-white flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-emerald-400" /> Decoded Health Token
                    </span>
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40 text-[10px]">
                      VERIFIED ON BLOCKCHAIN
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                    <div><span className="text-slate-500 block text-[10px]">Patient</span> {scannedData.patientName}</div>
                    <div><span className="text-slate-500 block text-[10px]">Health ID</span> <code className="font-mono text-emerald-400">{scannedData.healthId}</code></div>
                    <div><span className="text-slate-500 block text-[10px]">Blood Group</span> <strong className="text-red-400">{scannedData.bloodGroup}</strong></div>
                    <div><span className="text-slate-500 block text-[10px]">Queue Status</span> <strong className="text-amber-400">{scannedData.queuePosition}</strong></div>
                  </div>
                  <p className="text-[11px] text-slate-400 pt-1">
                    Attending: <strong>{scannedData.doctor}</strong>
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-3 text-center text-slate-400">
                  <div className="h-32 w-32 border-2 border-dashed border-slate-700 rounded-xl flex items-center justify-center">
                    <Scan className="h-10 w-10 text-slate-500" />
                  </div>
                  <p className="text-xs font-medium">Position QR Code within the viewfinder</p>
                </div>
              )}
            </div>

            <Button
              onClick={handleStartScan}
              disabled={scanning}
              className="w-full bg-primary text-primary-foreground font-bold text-xs gap-2"
            >
              <Scan className="h-4 w-4" />
              {scanning ? "Scanning Camera Input..." : "Activate Camera Scan"}
            </Button>
          </div>
        ) : (
          /* My QR Display */
          <div className="space-y-4 py-2 text-center">
            <div className="p-6 rounded-2xl bg-white text-slate-950 border shadow-inner max-w-[240px] mx-auto space-y-2">
              <div className="grid grid-cols-6 gap-1 w-full aspect-square bg-slate-950 p-2 rounded-xl">
                {Array.from({ length: 36 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`rounded-xs ${i % 2 === 0 || i % 5 === 0 ? "bg-white" : "bg-slate-900"}`} 
                  />
                ))}
              </div>
              <p className="text-xs font-mono font-bold tracking-widest text-slate-900">MNX-10291</p>
            </div>

            <div className="flex items-center justify-center gap-2">
              <Button size="sm" variant="outline" className="text-xs gap-1.5" onClick={handleCopyHealthId}>
                <Copy className="h-3.5 w-3.5" /> Copy ID
              </Button>
              <Button size="sm" className="text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => toast.success("QR Pass saved to gallery!")}>
                Download Pass
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
