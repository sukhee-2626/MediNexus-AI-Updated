import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity, ShieldAlert, Bed, Siren, Navigation, Check, PhoneCall, HeartPulse } from "lucide-react";
import { toast } from "sonner";

export const EmergencyBedTrackerCard = () => {
  const [reserved, setReserved] = useState(false);
  const [icuAvailable, setIcuAvailable] = useState(14);
  const [traumaAvailable, setTraumaAvailable] = useState(6);

  const handleReserveBed = () => {
    if (reserved) return;
    setReserved(true);
    setIcuAvailable((prev) => prev - 1);
    toast.success("Emergency ICU Bed #12 reserved under your Health ID (MNX-10291)!");
  };

  const handleDispatchAmbulance = () => {
    toast.success("🚨 Ambulance #AMB-104 dispatched! Live GPS tracking active. Estimated ETA: ~6 mins.");
  };

  return (
    <Card className="border-red-500/30 bg-gradient-to-br from-red-500/5 via-card to-background shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-red-500 text-white flex items-center justify-center font-bold shadow-sm">
              <Siren className="h-4 w-4 animate-bounce" />
            </div>
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                Emergency ICU & Trauma Bed Network
                <Badge variant="outline" className="border-red-500/40 text-red-500 font-mono text-[10px]">
                  LIVE CAPACITY
                </Badge>
              </CardTitle>
              <CardDescription className="text-xs">
                Real-time regional hospital bed availability & ambulance dispatch
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Capacity Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-card border space-y-1">
            <span className="text-[11px] text-muted-foreground block">ICU Beds Available</span>
            <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">{icuAvailable} / 20</p>
            <Badge variant="outline" className="text-[9px] border-emerald-500/30 text-emerald-600">Available</Badge>
          </div>

          <div className="p-3 rounded-xl bg-card border space-y-1">
            <span className="text-[11px] text-muted-foreground block">Trauma Wards</span>
            <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">{traumaAvailable} / 10</p>
            <Badge variant="outline" className="text-[9px] border-emerald-500/30 text-emerald-600">High Capacity</Badge>
          </div>

          <div className="p-3 rounded-xl bg-card border space-y-1">
            <span className="text-[11px] text-muted-foreground block">Ventilators</span>
            <p className="text-xl font-black text-blue-600 dark:text-blue-400">18 Ready</p>
            <Badge variant="outline" className="text-[9px] border-blue-500/30 text-blue-600">Operated</Badge>
          </div>

          <div className="p-3 rounded-xl bg-card border space-y-1">
            <span className="text-[11px] text-muted-foreground block">Ambulance ETA</span>
            <p className="text-xl font-black text-amber-600 dark:text-amber-400">~6 Mins</p>
            <Badge variant="outline" className="text-[9px] border-amber-500/30 text-amber-600">GPS On-Duty</Badge>
          </div>
        </div>

        {/* Dispatch & Reserve Banner */}
        <div className="p-4 rounded-xl bg-card border flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-red-500/10 text-red-600 flex items-center justify-center shrink-0 font-bold">
              <Bed className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Apollo Specialty Hospital Trauma Center</p>
              <p className="text-[11px] text-muted-foreground">1.8 km away • Instant ICU bed reservation enabled</p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              onClick={handleDispatchAmbulance}
              size="sm"
              variant="outline"
              className="text-xs border-red-500/40 text-red-600 hover:bg-red-500/10 gap-1.5 flex-1 sm:flex-initial"
            >
              <Navigation className="h-3.5 w-3.5" /> Call Ambulance
            </Button>
            <Button
              onClick={handleReserveBed}
              size="sm"
              disabled={reserved}
              className={`text-xs gap-1.5 flex-1 sm:flex-initial font-bold ${
                reserved ? "bg-emerald-600 text-white" : "bg-red-600 hover:bg-red-700 text-white"
              }`}
            >
              {reserved ? <Check className="h-3.5 w-3.5" /> : <ShieldAlert className="h-3.5 w-3.5" />}
              {reserved ? "ICU Bed Reserved" : "Reserve ICU Bed"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
