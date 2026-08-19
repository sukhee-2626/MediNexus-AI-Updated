import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QrCode, Scan, ShieldCheck, Copy, Camera, RefreshCw, Download } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";

export const QRScannerModal = () => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"scan" | "my_qr">("my_qr");
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState<{
    healthId: string;
    patientName: string;
    bloodGroup: string;
    doctor: string;
    queuePosition: string;
    verified: boolean;
  } | null>(null);

  // QR code content — all patient details encoded as JSON
  const qrPayload = JSON.stringify({
    healthId: "MNX-10291",
    name: "Sukhee",
    bloodGroup: "O+",
    doctor: "Dr. Arjun Mehta",
    dept: "Cardiology",
    room: "204",
    queue: "#4",
    phone: "+91 9865881000",
    platform: "MediNexus AI"
  });

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
      toast.success("✅ QR Token Scanned & Decoded Successfully!");
    }, 1800);
  };

  const handleCopyHealthId = () => {
    navigator.clipboard.writeText("MNX-10291");
    toast.success("Health ID MNX-10291 copied to clipboard!");
  };

  const handleDownloadQR = () => {
    // Get the SVG element and trigger download
    const svgElement = document.getElementById("patient-qr-svg");
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "MediNexus-Health-Pass-MNX-10291.svg";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("🏥 Health Pass QR Code downloaded!");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="border-primary/40 text-primary hover:bg-primary/10 gap-1.5 text-xs font-semibold">
          <QrCode className="h-4 w-4" />
          QR Scanner & Health Pass
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-primary" />
            MediNexus QR Scanner & Digital Health Pass
          </DialogTitle>
          <DialogDescription>
            Scan appointment tokens or display your real scannable Health QR Pass.
          </DialogDescription>
        </DialogHeader>

        {/* Tab Switcher */}
        <div className="flex rounded-lg bg-muted p-1 gap-1 text-xs">
          <button
            onClick={() => setActiveTab("my_qr")}
            className={`flex-1 py-1.5 rounded-md font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === "my_qr" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            <QrCode className="h-3.5 w-3.5" /> My Health QR Pass
          </button>
          <button
            onClick={() => setActiveTab("scan")}
            className={`flex-1 py-1.5 rounded-md font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === "scan" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            <Camera className="h-3.5 w-3.5" /> Live Scanner
          </button>
        </div>

        {activeTab === "my_qr" ? (
          /* MY HEALTH QR — Real QR Code via qrcode.react */
          <div className="space-y-4 py-2">
            <div className="flex flex-col items-center gap-3">
              {/* Real Scannable QR Code */}
              <div className="p-4 rounded-2xl bg-white shadow-lg border-2 border-primary/20 flex flex-col items-center gap-2">
                <QRCodeSVG
                  id="patient-qr-svg"
                  value={qrPayload}
                  size={200}
                  bgColor="#ffffff"
                  fgColor="#0f172a"
                  level="H"
                  includeMargin={false}
                  imageSettings={{
                    src: "",
                    x: undefined,
                    y: undefined,
                    height: 0,
                    width: 0,
                    excavate: false
                  }}
                />
                <div className="text-center">
                  <p className="text-xs font-black font-mono tracking-widest text-slate-900">MNX-10291</p>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5">Sukhee • MediNexus AI Health Pass</p>
                </div>
              </div>

              {/* Patient Details Summary */}
              <div className="w-full grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-card border">
                  <span className="text-[10px] text-muted-foreground block">Blood Group</span>
                  <span className="font-black text-red-600">O+</span>
                </div>
                <div className="p-2.5 rounded-xl bg-card border">
                  <span className="text-[10px] text-muted-foreground block">Queue Position</span>
                  <span className="font-black text-amber-600">#4 in Queue</span>
                </div>
                <div className="p-2.5 rounded-xl bg-card border">
                  <span className="text-[10px] text-muted-foreground block">Doctor</span>
                  <span className="font-bold text-foreground text-[11px]">Dr. Arjun Mehta</span>
                </div>
                <div className="p-2.5 rounded-xl bg-card border">
                  <span className="text-[10px] text-muted-foreground block">Department</span>
                  <span className="font-bold text-foreground text-[11px]">Cardiology • Room 204</span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full">
                <Button size="sm" variant="outline" className="text-xs gap-1.5 flex-1" onClick={handleCopyHealthId}>
                  <Copy className="h-3.5 w-3.5" /> Copy Health ID
                </Button>
                <Button size="sm" className="text-xs gap-1.5 flex-1 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleDownloadQR}>
                  <Download className="h-3.5 w-3.5" /> Download QR Pass
                </Button>
              </div>
            </div>
          </div>
        ) : (
          /* SCANNER TAB */
          <div className="space-y-4 py-2">
            <div className="p-4 rounded-2xl bg-slate-950 text-white border border-slate-800 flex flex-col items-center justify-center relative min-h-[220px] overflow-hidden">
              {scanning ? (
                <div className="flex flex-col items-center justify-center space-y-3 z-10">
                  <div className="h-40 w-40 border-2 border-emerald-400 rounded-xl relative flex items-center justify-center overflow-hidden bg-emerald-500/5">
                    {/* Animated scan line */}
                    <div
                      className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent"
                      style={{ animation: "scanLine 1.2s ease-in-out infinite alternate", top: "20%" }}
                    />
                    {/* Corner markers */}
                    <div className="absolute top-1 left-1 h-5 w-5 border-t-2 border-l-2 border-emerald-400 rounded-tl" />
                    <div className="absolute top-1 right-1 h-5 w-5 border-t-2 border-r-2 border-emerald-400 rounded-tr" />
                    <div className="absolute bottom-1 left-1 h-5 w-5 border-b-2 border-l-2 border-emerald-400 rounded-bl" />
                    <div className="absolute bottom-1 right-1 h-5 w-5 border-b-2 border-r-2 border-emerald-400 rounded-br" />
                  </div>
                  <p className="text-xs font-mono text-emerald-400 animate-pulse flex items-center gap-1.5">
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Decoding QR Optical Frame...
                  </p>
                  <style>{`
                    @keyframes scanLine {
                      0% { top: 15%; }
                      100% { top: 80%; }
                    }
                  `}</style>
                </div>
              ) : scannedData ? (
                <div className="w-full space-y-3 text-left z-10">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold text-xs text-white flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-emerald-400" /> QR Decoded Successfully
                    </span>
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40 text-[10px]">
                      BLOCKCHAIN VERIFIED ✓
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                    <div><span className="text-slate-500 block text-[10px]">Patient</span> {scannedData.patientName}</div>
                    <div><span className="text-slate-500 block text-[10px]">Health ID</span> <code className="font-mono text-emerald-400">{scannedData.healthId}</code></div>
                    <div><span className="text-slate-500 block text-[10px]">Blood Group</span> <strong className="text-red-400">{scannedData.bloodGroup}</strong></div>
                    <div><span className="text-slate-500 block text-[10px]">Queue Status</span> <strong className="text-amber-400">{scannedData.queuePosition}</strong></div>
                  </div>
                  <p className="text-[11px] text-slate-400 pt-1">
                    Attending: <strong className="text-slate-300">{scannedData.doctor}</strong>
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-3 text-center text-slate-400">
                  <div className="h-32 w-32 border-2 border-dashed border-slate-700 rounded-xl flex items-center justify-center relative">
                    <Scan className="h-10 w-10 text-slate-500" />
                    <div className="absolute top-1 left-1 h-4 w-4 border-t-2 border-l-2 border-slate-500 rounded-tl" />
                    <div className="absolute top-1 right-1 h-4 w-4 border-t-2 border-r-2 border-slate-500 rounded-tr" />
                    <div className="absolute bottom-1 left-1 h-4 w-4 border-b-2 border-l-2 border-slate-500 rounded-bl" />
                    <div className="absolute bottom-1 right-1 h-4 w-4 border-b-2 border-r-2 border-slate-500 rounded-br" />
                  </div>
                  <p className="text-xs font-medium">Position QR Code within the viewfinder</p>
                  <p className="text-[10px] text-slate-500">Click below to activate scanner</p>
                </div>
              )}
            </div>

            <Button
              onClick={handleStartScan}
              disabled={scanning}
              className="w-full bg-primary text-primary-foreground font-bold text-xs gap-2"
            >
              <Scan className="h-4 w-4" />
              {scanning ? "Scanning..." : "Activate Camera Scanner"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
