import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  UserCheck, 
  Shield, 
  Brain,
  Clock,
  Check
} from "lucide-react";

const activities = [
  {
    icon: UserCheck,
    title: "Patient consent granted",
    description: "Ram Kumar granted full access to medical history",
    time: "5 minutes ago",
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    icon: FileText,
    title: "Record updated",
    description: "Lab results added for Anita Sharma",
    time: "1 hour ago",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Brain,
    title: "AI diagnosis requested",
    description: "Symptom analysis for Suresh Patel completed",
    time: "2 hours ago",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    icon: Shield,
    title: "Blockchain verified",
    description: "10 new transactions confirmed on ledger",
    time: "3 hours ago",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
];

const ActivityFeed = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Audit trail of recent actions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex gap-4">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${activity.bgColor}`}>
                <activity.icon className={`h-4 w-4 ${activity.color}`} />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">{activity.title}</p>
                <p className="text-xs text-muted-foreground">{activity.description}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {activity.time}
                </div>
              </div>
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
                <Check className="h-3 w-3 text-green-600" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
