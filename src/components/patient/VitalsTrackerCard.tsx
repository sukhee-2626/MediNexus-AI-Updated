import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Activity, Heart, Thermometer, Droplet, Footprints, Plus, TrendingUp, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface VitalReading {
  id: string;
  heartRate: number;
  systolic: number;
  diastolic: number;
  oxygen: number;
  glucose: number;
  temperature: number;
  steps: number;
  timestamp: string;
}

export const VitalsTrackerCard = () => {
  const [vitalsList, setVitalsList] = useState<VitalReading[]>([
    {
      id: "1",
      heartRate: 72,
      systolic: 120,
      diastolic: 80,
      oxygen: 99,
      glucose: 95,
      temperature: 98.6,
      steps: 8420,
      timestamp: "Today, 8:30 AM"
    },
    {
      id: "2",
      heartRate: 76,
      systolic: 124,
      diastolic: 82,
      oxygen: 98,
      glucose: 102,
      temperature: 98.4,
      steps: 6150,
      timestamp: "Yesterday, 7:45 PM"
    }
  ]);

  const [open, setOpen] = useState(false);
  const [heartRate, setHeartRate] = useState("75");
  const [systolic, setSystolic] = useState("120");
  const [diastolic, setDiastolic] = useState("80");
  const [oxygen, setOxygen] = useState("98");
  const [glucose, setGlucose] = useState("96");
  const [temperature, setTemperature] = useState("98.6");

  const latest = vitalsList[0];

  const handleAddVitals = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: VitalReading = {
      id: Date.now().toString(),
      heartRate: Number(heartRate) || 72,
      systolic: Number(systolic) || 120,
      diastolic: Number(diastolic) || 80,
      oxygen: Number(oxygen) || 98,
      glucose: Number(glucose) || 95,
      temperature: Number(temperature) || 98.6,
      steps: latest.steps + 250,
      timestamp: "Just now"
    };

    setVitalsList([newEntry, ...vitalsList]);
    setOpen(false);
    toast.success("Health vitals recorded successfully!");
  };

  const getBPStatus = (sys: number, dia: number) => {
    if (sys < 120 && dia < 80) return { label: "Optimal", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" };
    if (sys <= 129 && dia < 80) return { label: "Elevated", color: "bg-amber-500/10 text-amber-600 border-amber-500/30" };
    return { label: "Stage 1 High", color: "bg-red-500/10 text-red-600 border-red-500/30" };
  };

  const bpInfo = getBPStatus(latest.systolic, latest.diastolic);

  return (
    <Card className="border-primary/20 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold">Live Health Vitals</CardTitle>
              <CardDescription className="text-xs">Real-time biometric measurements & wearable sync</CardDescription>
            </div>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1 text-xs">
                <Plus className="h-3.5 w-3.5" /> Log Vitals
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" /> Log New Health Vitals
                </DialogTitle>
                <DialogDescription>
                  Enter your latest daily vitals measured manually or synced from your smart watch.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddVitals} className="space-y-4 py-2">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Systolic BP (mmHg)</Label>
                    <Input value={systolic} onChange={(e) => setSystolic(e.target.value)} type="number" />
                  </div>
                  <div>
                    <Label className="text-xs">Diastolic BP (mmHg)</Label>
                    <Input value={diastolic} onChange={(e) => setDiastolic(e.target.value)} type="number" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Heart Rate (BPM)</Label>
                    <Input value={heartRate} onChange={(e) => setHeartRate(e.target.value)} type="number" />
                  </div>
                  <div>
                    <Label className="text-xs">SpO2 Oxygen (%)</Label>
                    <Input value={oxygen} onChange={(e) => setOxygen(e.target.value)} type="number" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Blood Glucose (mg/dL)</Label>
                    <Input value={glucose} onChange={(e) => setGlucose(e.target.value)} type="number" />
                  </div>
                  <div>
                    <Label className="text-xs">Temperature (°F)</Label>
                    <Input value={temperature} onChange={(e) => setTemperature(e.target.value)} type="number" step="0.1" />
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Save Vitals Entry
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Vitals Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {/* BP */}
          <div className="p-3 rounded-xl bg-card border shadow-xs space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[11px] font-medium">Blood Pressure</span>
              <Activity className="h-3.5 w-3.5 text-primary" />
            </div>
            <p className="text-lg font-black tracking-tight">{latest.systolic}/{latest.diastolic}</p>
            <Badge variant="outline" className={`text-[10px] ${bpInfo.color}`}>
              {bpInfo.label}
            </Badge>
          </div>

          {/* Heart Rate */}
          <div className="p-3 rounded-xl bg-card border shadow-xs space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[11px] font-medium">Heart Rate</span>
              <Heart className="h-3.5 w-3.5 text-rose-500 animate-pulse" />
            </div>
            <p className="text-lg font-black tracking-tight">{latest.heartRate} <span className="text-xs font-normal text-muted-foreground">BPM</span></p>
            <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
              Normal Rhythm
            </Badge>
          </div>

          {/* Oxygen */}
          <div className="p-3 rounded-xl bg-card border shadow-xs space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[11px] font-medium">Oxygen (SpO2)</span>
              <Droplet className="h-3.5 w-3.5 text-blue-500" />
            </div>
            <p className="text-lg font-black tracking-tight">{latest.oxygen}%</p>
            <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
              Excellent
            </Badge>
          </div>

          {/* Glucose */}
          <div className="p-3 rounded-xl bg-card border shadow-xs space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[11px] font-medium">Blood Glucose</span>
              <TrendingUp className="h-3.5 w-3.5 text-amber-500" />
            </div>
            <p className="text-lg font-black tracking-tight">{latest.glucose} <span className="text-xs font-normal text-muted-foreground">mg/dL</span></p>
            <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
              Fasting Normal
            </Badge>
          </div>

          {/* Temperature / Steps */}
          <div className="p-3 rounded-xl bg-card border shadow-xs space-y-1 col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[11px] font-medium">Daily Activity</span>
              <Footprints className="h-3.5 w-3.5 text-emerald-500" />
            </div>
            <p className="text-lg font-black tracking-tight">{latest.steps.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground">84% of 10,000 goal</p>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-muted/40 border flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            Last synced from Smart Band: <strong className="text-foreground">{latest.timestamp}</strong>
          </span>
          <span className="text-[11px] underline cursor-pointer hover:text-primary" onClick={() => toast.info("Syncing with Apple Health / Fitbit...")}>
            Force Sync Now
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
