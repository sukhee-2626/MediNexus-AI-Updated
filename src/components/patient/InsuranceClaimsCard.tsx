import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, ShieldCheck, FileCheck, DollarSign, ExternalLink, Plus } from "lucide-react";
import { toast } from "sonner";

interface Claim {
  id: string;
  provider: string;
  date: string;
  amount: string;
  coveredAmount: string;
  status: "Approved" | "In Review" | "Pending";
}

export const InsuranceClaimsCard = () => {
  const [claims] = useState<Claim[]>([
    {
      id: "CLM-9021",
      provider: "Apollo Specialty Clinic",
      date: "Aug 10, 2026",
      amount: "₹4,500",
      coveredAmount: "₹4,000",
      status: "Approved"
    },
    {
      id: "CLM-8842",
      provider: "MediNexus Diagnostics Lab",
      date: "Jul 28, 2026",
      amount: "₹2,200",
      coveredAmount: "₹2,200",
      status: "Approved"
    },
    {
      id: "CLM-9104",
      provider: "City Care Pharmacy",
      date: "Aug 14, 2026",
      amount: "₹1,850",
      coveredAmount: "₹0",
      status: "In Review"
    }
  ]);

  return (
    <Card className="border-primary/20 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
              <CreditCard className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold">Insurance & Claims</CardTitle>
              <CardDescription className="text-xs">Active health insurance coverage & claim status</CardDescription>
            </div>
          </div>
          <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={() => toast.info("Claim submission form launched")}>
            <Plus className="h-3.5 w-3.5" /> Submit Claim
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Insurance Card Banner */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" />
              <span className="font-bold text-sm tracking-wide">Star Health Comprehensive Care</span>
            </div>
            <Badge className="bg-white/20 text-white border-0 text-[10px]">ACTIVE</Badge>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs pt-1">
            <div>
              <span className="text-indigo-200 text-[10px] block">Policy Number</span>
              <span className="font-mono font-bold">SH-99201-X</span>
            </div>
            <div>
              <span className="text-indigo-200 text-[10px] block">Sum Insured</span>
              <span className="font-bold">₹10,00,000</span>
            </div>
            <div>
              <span className="text-indigo-200 text-[10px] block">Co-Pay</span>
              <span className="font-bold">10%</span>
            </div>
          </div>
        </div>

        {/* Claims List */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Recent Claims</h4>
          {claims.map((claim) => (
            <div key={claim.id} className="p-3 rounded-lg border flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground">{claim.provider}</span>
                  <span className="text-muted-foreground font-mono text-[10px]">({claim.id})</span>
                </div>
                <p className="text-muted-foreground text-[11px]">{claim.date}</p>
              </div>

              <div className="text-right space-y-1">
                <p className="font-bold">{claim.amount} <span className="text-[10px] font-normal text-emerald-600">(Covered: {claim.coveredAmount})</span></p>
                <Badge variant={claim.status === "Approved" ? "default" : "secondary"} className={claim.status === "Approved" ? "bg-emerald-500 hover:bg-emerald-600" : ""}>
                  {claim.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
