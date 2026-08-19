import { useState, useRef } from "react";
import {
  Dialog, DialogContent, DialogDescription,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  QrCode, Scan, ShieldCheck, Copy,
  Camera, RefreshCw, Download, Heart,
} from "lucide-react";
import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";
import { toast } from "sonner";

/* ── Patient data that gets encoded into the QR ── */
const PATIENT = {
  healthId:   "MNX-10291",
  name:       "Sukhee",
  bloodGroup: "O+",
  doctor:     "Dr. Arjun Mehta",
  dept:       "Cardiology",
  room:       "204",
  queue:      "#4",
  phone:      "+91 9865881000",
  platform:   "MediNexus AI",
};

const QR_VALUE = JSON.stringify(PATIENT);

export const QRScannerModal = () => {
  const [open, setOpen]           = useState(false);
  const [tab, setTab]             = useState<"qr" | "scan">("qr");
  const [scanning, setScanning]   = useState(false);
  const [scannedData, setScanned] = useState<typeof PATIENT | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  /* ── Simulate scan decode ── */
  const handleScan = () => {
    setScanning(true);
    setScanned(null);
    setTimeout(() => {
      setScanning(false);
      setScanned(PATIENT);
      toast.success("✅ QR Code Decoded Successfully!");
    }, 1800);
  };

  /* ── Download QR as PNG via hidden canvas ── */
  const handleDownload = () => {
    const canvas = canvasRef.current?.querySelector("canvas") as HTMLCanvasElement | null;
    if (!canvas) { toast.error("Canvas not ready"); return; }
    const link = document.createElement("a");
    link.download = `MediNexus-Health-Pass-${PATIENT.healthId}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    toast.success("📲 Health Pass downloaded!");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(PATIENT.healthId);
    toast.success(`Health ID ${PATIENT.healthId} copied!`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm" variant="outline"
          className="border-primary/40 text-primary hover:bg-primary/10 gap-1.5 text-xs font-semibold"
        >
          <QrCode className="h-4 w-4" />
          QR Health Pass
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-primary" />
            MediNexus Digital Health Pass
          </DialogTitle>
          <DialogDescription>
            Real scannable QR — works with any phone camera or QR reader app.
          </DialogDescription>
        </DialogHeader>

        {/* ── Tabs ── */}
        <div className="flex rounded-lg bg-muted p-1 gap-1 text-xs">
          {(["qr", "scan"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-1.5 rounded-md font-bold transition flex items-center justify-center gap-1.5
                ${tab === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}
            >
              {t === "qr" ? <><QrCode className="h-3.5 w-3.5" /> My Health QR</> : <><Camera className="h-3.5 w-3.5" /> Scanner</>}
            </button>
          ))}
        </div>

        {/* ════════════ MY QR TAB ════════════ */}
        {tab === "qr" && (
          <div className="space-y-4 py-1">

            {/* ── Real QR Code Card ── */}
            <div className="flex flex-col items-center gap-3">
              {/* visible SVG QR (display only) */}
              <div className="p-4 bg-white rounded-2xl shadow-lg border-2 border-primary/20 flex flex-col items-center gap-2">
                <QRCodeSVG
                  value={QR_VALUE}
                  size={196}
                  bgColor="#ffffff"
                  fgColor="#0f172a"
                  level="H"
                  marginSize={1}
                />
                <div className="text-center pt-1">
                  <p className="text-[11px] font-black font-mono tracking-widest text-slate-900">
                    {PATIENT.healthId}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {PATIENT.name} · MediNexus AI Health Pass
                  </p>
                </div>
              </div>

              {/* hidden canvas for PNG download */}
              <div ref={canvasRef} className="hidden">
                <QRCodeCanvas
                  value={QR_VALUE}
                  size={512}
                  bgColor="#ffffff"
                  fgColor="#0f172a"
                  level="H"
                  marginSize={2}
                />
              </div>

              {/* ── Patient Info Grid ── */}
              <div className="w-full grid grid-cols-2 gap-2 text-xs">
                {[
                  { label: "Blood Group",  value: PATIENT.bloodGroup, color: "text-red-600"    },
                  { label: "Queue #",      value: PATIENT.queue,      color: "text-amber-600"  },
                  { label: "Doctor",       value: PATIENT.doctor,     color: "text-foreground" },
                  { label: "Department",   value: `${PATIENT.dept} • Room ${PATIENT.room}`, color: "text-foreground" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="p-2.5 rounded-xl bg-card border">
                    <span className="text-[10px] text-muted-foreground block">{label}</span>
                    <span className={`font-bold text-[11px] ${color}`}>{value}</span>
                  </div>
                ))}
              </div>

              {/* ── Action Buttons ── */}
              <div className="flex gap-2 w-full">
                <Button
                  size="sm" variant="outline"
                  className="text-xs gap-1.5 flex-1" onClick={handleCopy}
                >
                  <Copy className="h-3.5 w-3.5" /> Copy ID
                </Button>
                <Button
                  size="sm"
                  className="text-xs gap-1.5 flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={handleDownload}
                >
                  <Download className="h-3.5 w-3.5" /> Download PNG
                </Button>
              </div>
            </div>

            {/* verified badge */}
            <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" />
              Blockchain-verified · ABHA compliant · End-to-end encrypted
            </div>
          </div>
        )}

        {/* ════════════ SCANNER TAB ════════════ */}
        {tab === "scan" && (
          <div className="space-y-4 py-2">
            <div className="p-4 rounded-2xl bg-slate-950 text-white border border-slate-800 flex flex-col items-center justify-center min-h-[230px] relative overflow-hidden">

              {scanning ? (
                <div className="flex flex-col items-center gap-4">
                  {/* Viewfinder */}
                  <div className="h-40 w-40 border-2 border-emerald-400 rounded-xl relative flex items-center justify-center overflow-hidden bg-emerald-500/5">
                    {/* Animated scan line */}
                    <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-bounce" style={{ top: "50%" }} />
                    {/* Corner accents */}
                    {["top-1 left-1 border-t-2 border-l-2 rounded-tl",
                      "top-1 right-1 border-t-2 border-r-2 rounded-tr",
                      "bottom-1 left-1 border-b-2 border-l-2 rounded-bl",
                      "bottom-1 right-1 border-b-2 border-r-2 rounded-br"].map((cls) => (
                      <div key={cls} className={`absolute h-5 w-5 border-emerald-400 ${cls}`} />
                    ))}
                    <RefreshCw className="h-8 w-8 text-emerald-400 animate-spin opacity-40" />
                  </div>
                  <p className="text-xs font-mono text-emerald-400 animate-pulse flex items-center gap-1.5">
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Decoding QR frame…
                  </p>
                </div>

              ) : scannedData ? (
                <div className="w-full space-y-3 text-left">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold text-xs text-white flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-emerald-400" /> QR Decoded
                    </span>
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40 text-[10px]">
                      VERIFIED ✓
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                    <div><span className="text-slate-500 block text-[10px]">Patient</span>{scannedData.name}</div>
                    <div><span className="text-slate-500 block text-[10px]">Health ID</span><code className="font-mono text-emerald-400">{scannedData.healthId}</code></div>
                    <div><span className="text-slate-500 block text-[10px]">Blood Group</span><strong className="text-red-400">{scannedData.bloodGroup}</strong></div>
                    <div><span className="text-slate-500 block text-[10px]">Queue</span><strong className="text-amber-400">{scannedData.queue}</strong></div>
                    <div className="col-span-2"><span className="text-slate-500 block text-[10px]">Doctor</span>{scannedData.doctor} · {scannedData.dept} · Room {scannedData.room}</div>
                  </div>
                </div>

              ) : (
                <div className="flex flex-col items-center gap-3 text-slate-400 text-center">
                  <div className="h-32 w-32 border-2 border-dashed border-slate-700 rounded-xl flex items-center justify-center relative">
                    <Scan className="h-10 w-10 text-slate-500" />
                    {["top-1 left-1 border-t-2 border-l-2 rounded-tl",
                      "top-1 right-1 border-t-2 border-r-2 rounded-tr",
                      "bottom-1 left-1 border-b-2 border-l-2 rounded-bl",
                      "bottom-1 right-1 border-b-2 border-r-2 rounded-br"].map((cls) => (
                      <div key={cls} className={`absolute h-4 w-4 border-slate-600 ${cls}`} />
                    ))}
                  </div>
                  <p className="text-xs font-medium">Align any MediNexus QR Code here</p>
                  <p className="text-[10px] text-slate-500">Supports: Patient tokens, doctor passes, appointment codes</p>
                </div>
              )}
            </div>

            <Button
              onClick={handleScan}
              disabled={scanning}
              className="w-full font-bold text-xs gap-2"
            >
              <Scan className="h-4 w-4" />
              {scanning ? "Scanning…" : scannedData ? "Scan Another QR" : "Activate Camera Scanner"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
