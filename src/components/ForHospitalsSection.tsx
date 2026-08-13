import { Badge } from "@/components/ui/badge";
import { Building2, CalendarCheck, CheckCircle2, Clock, Users, Activity, BarChart2 } from "lucide-react";

const deptStats = [
  { name: "Cardiology", percentage: 90, count: "86 Patients", color: "bg-blue-600" },
  { name: "General Medicine", percentage: 70, count: "64 Patients", color: "bg-emerald-600" },
  { name: "Orthopedics", percentage: 50, count: "48 Patients", color: "bg-amber-500" },
  { name: "Pediatrics", percentage: 40, count: "35 Patients", color: "bg-purple-600" },
];

const ForHospitalsSection = () => {
  return (
    <section id="for-hospitals" className="py-20 md:py-28 bg-muted/20 relative">
      <div className="container">
        
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <Badge variant="outline" className="px-3.5 py-1 border-purple-500/30 text-purple-600 bg-purple-500/10 font-semibold">
            For Hospitals
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-foreground">
            See Your Hospital in Real Time
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            Hospital administrators get a unified view of appointments, doctor availability, patient queues and operational trends.
          </p>
        </div>

        {/* Mock Dashboard Preview */}
        <div className="mt-14 max-w-4xl mx-auto rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-2xl space-y-8 relative overflow-hidden">
          
          {/* Dashboard Header Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-border/60 gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">MediNexus Hospital Command Center</h3>
                <p className="text-xs text-muted-foreground">Live Facility Operations Preview</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                Live Sync Active
              </span>
            </div>
          </div>

          {/* Today's Overview Metrics */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
              <Activity className="h-4 w-4 text-purple-600" />
              Today's Overview
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              
              <div className="p-4 rounded-2xl bg-muted/40 border border-border/50">
                <div className="flex items-center justify-between text-muted-foreground mb-1">
                  <span className="text-xs font-medium">Appointments</span>
                  <CalendarCheck className="h-4 w-4 text-blue-500" />
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-foreground">248</p>
              </div>

              <div className="p-4 rounded-2xl bg-muted/40 border border-border/50">
                <div className="flex items-center justify-between text-muted-foreground mb-1">
                  <span className="text-xs font-medium">Completed</span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600">162</p>
              </div>

              <div className="p-4 rounded-2xl bg-muted/40 border border-border/50">
                <div className="flex items-center justify-between text-muted-foreground mb-1">
                  <span className="text-xs font-medium">Waiting</span>
                  <Clock className="h-4 w-4 text-amber-500" />
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-amber-600">31</p>
              </div>

              <div className="p-4 rounded-2xl bg-muted/40 border border-border/50">
                <div className="flex items-center justify-between text-muted-foreground mb-1">
                  <span className="text-xs font-medium">Doctors Available</span>
                  <Users className="h-4 w-4 text-purple-500" />
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-purple-600">24</p>
              </div>

              <div className="p-4 rounded-2xl bg-muted/40 border border-border/50 col-span-2 sm:col-span-1">
                <div className="flex items-center justify-between text-muted-foreground mb-1">
                  <span className="text-xs font-medium">Average Wait</span>
                  <Clock className="h-4 w-4 text-indigo-500" />
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-foreground">27 <span className="text-sm font-semibold text-muted-foreground">min</span></p>
              </div>

            </div>
          </div>

          {/* Top Departments Visualization */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
              <BarChart2 className="h-4 w-4 text-purple-600" />
              Top Departments Patient Load
            </h4>
            <div className="space-y-4">
              {deptStats.map((dept) => (
                <div key={dept.name} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-foreground">{dept.name}</span>
                    <span className="text-muted-foreground">{dept.count}</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-muted/60 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${dept.color} transition-all duration-500`}
                      style={{ width: `${dept.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PRD Command-Center Approach Subtext */}
          <div className="pt-4 border-t border-border/60 text-center">
            <p className="text-xs text-muted-foreground font-medium">
              ⚡ A command-center approach for hospital occupancy, staff load management, and intelligent demand forecasting.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};

export default ForHospitalsSection;
