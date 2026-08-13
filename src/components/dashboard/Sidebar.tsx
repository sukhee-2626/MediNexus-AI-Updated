import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Activity, 
  LayoutDashboard, 
  Users, 
  FileText, 
  Brain, 
  BarChart3, 
  Settings,
  LogOut,
  Cloud,
  Inbox,
  ClipboardList,
  CalendarCheck,
  Stethoscope,
  PieChart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const navItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: CalendarCheck, label: "Appointments", href: "/dashboard/appointments" },
  { icon: Stethoscope, label: "Doctor Availability", href: "/dashboard/doctor-availability" },
  { icon: Users, label: "Patients", href: "/dashboard/patients" },
  { icon: FileText, label: "Records", href: "/dashboard/records" },
  { icon: PieChart, label: "Case Analytics", href: "/dashboard/problem-analytics" },
  { icon: BarChart3, label: "Hospital Analytics", href: "/dashboard/analytics" },
  { icon: Brain, label: "AI Clinical Insights", href: "/dashboard/ai-analytics" },
  { icon: Inbox, label: "Requests", href: "/dashboard/requests" },
  { icon: Cloud, label: "Backup", href: "/dashboard/backup" },
  { icon: ClipboardList, label: "Audit Logs", href: "/dashboard/audit-logs" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

const DashboardSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  const getInitials = (email: string) => {
    return email.slice(0, 2).toUpperCase();
  };

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-sidebar">
      <div className="flex h-16 items-center gap-2.5 border-b px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
          <Activity className="h-4 w-4" />
        </div>
        <span className="font-bold text-sidebar-foreground">MediNexus AI</span>
      </div>

      <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4">
        <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent/30 p-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
              {user?.email ? getInitials(user.email) : "AD"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium">
              {user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Hospital Admin"}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {user?.email || "admin@medinexus.ai"}
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 shrink-0 hover:bg-destructive/10 hover:text-destructive"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
