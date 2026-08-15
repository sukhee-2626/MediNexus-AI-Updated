import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Pill, Flame, Clock, CheckCircle, AlertCircle, Sparkles, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface MedicationItem {
  id: string;
  name: string;
  dosage: string;
  timing: string;
  instructions: string;
  taken: boolean;
}

export const MedicationTrackerCard = () => {
  const [meds, setMeds] = useState<MedicationItem[]>([
    {
      id: "m1",
      name: "Metformin 500mg",
      dosage: "1 Tablet",
      timing: "Morning (08:00 AM)",
      instructions: "Take with breakfast",
      taken: true
    },
    {
      id: "m2",
      name: "Atorvastatin 10mg",
      dosage: "1 Tablet",
      timing: "Afternoon (01:00 PM)",
      instructions: "Take after lunch",
      taken: true
    },
    {
      id: "m3",
      name: "Lisinopril 10mg",
      dosage: "1 Tablet",
      timing: "Evening (08:00 PM)",
      instructions: "Take before bed",
      taken: false
    }
  ]);

  const toggleMedication = (id: string) => {
    setMeds(prev => prev.map(m => {
      if (m.id === id) {
        const nextState = !m.taken;
        if (nextState) {
          toast.success(`Marked ${m.name} as taken!`);
        }
        return { ...m, taken: nextState };
      }
      return m;
    }));
  };

  const completedCount = meds.filter(m => m.taken).length;
  const progressPct = Math.round((completedCount / meds.length) * 100);

  return (
    <Card className="border-primary/20 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Pill className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold">Today's Pill Schedule</CardTitle>
              <CardDescription className="text-xs">Track daily medication dosage & adherence</CardDescription>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1 bg-amber-500/10 text-amber-600 border-amber-500/30 text-xs font-bold">
              <Flame className="h-3.5 w-3.5 fill-amber-500" /> 7 Day Streak
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Adherence progress */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold">
            <span>Daily Adherence Progress</span>
            <span className="text-primary">{completedCount} of {meds.length} Taken ({progressPct}%)</span>
          </div>
          <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-primary transition-all duration-500 rounded-full"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Meds List */}
        <div className="space-y-2">
          {meds.map((med) => (
            <div 
              key={med.id} 
              className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                med.taken ? "bg-emerald-500/5 border-emerald-500/20 opacity-80" : "bg-card border-border hover:border-primary/40"
              }`}
            >
              <div className="flex items-center gap-3">
                <Checkbox 
                  checked={med.taken} 
                  onCheckedChange={() => toggleMedication(med.id)}
                  className="h-5 w-5"
                />
                <div>
                  <p className={`text-sm font-semibold ${med.taken ? "line-through text-muted-foreground" : "text-foreground"}`}>
                    {med.name}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {med.timing}</span>
                    <span>•</span>
                    <span>{med.instructions}</span>
                  </div>
                </div>
              </div>

              <Badge variant={med.taken ? "outline" : "default"} className={med.taken ? "border-emerald-500 text-emerald-600" : ""}>
                {med.taken ? "Taken" : "Pending"}
              </Badge>
            </div>
          ))}
        </div>

        {/* Refill reminder footer */}
        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs flex items-center justify-between">
          <span className="text-blue-600 dark:text-blue-400 flex items-center gap-1.5 font-medium">
            <RefreshCw className="h-3.5 w-3.5" /> Metformin supply running low (4 days left)
          </span>
          <Button size="sm" variant="outline" className="h-7 text-[11px] border-blue-500/40 text-blue-600 hover:bg-blue-500/20" onClick={() => toast.info("Opening refill request form...")}>
            Request Refill
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
