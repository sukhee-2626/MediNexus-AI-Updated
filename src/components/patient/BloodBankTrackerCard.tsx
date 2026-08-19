import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Heart, Droplet, Plus, ShieldAlert, Check, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";

interface BloodStock {
  group: string;
  units: number;
  status: "Available" | "Low Stock" | "Critical";
}

export const BloodBankTrackerCard = () => {
  const [stock] = useState<BloodStock[]>([
    { group: "O+", units: 28, status: "Available" },
    { group: "O-", units: 4, status: "Low Stock" },
    { group: "A+", units: 19, status: "Available" },
    { group: "A-", units: 6, status: "Low Stock" },
    { group: "B+", units: 22, status: "Available" },
    { group: "B-", units: 2, status: "Critical" },
    { group: "AB+", units: 14, status: "Available" },
    { group: "AB-", units: 3, status: "Low Stock" },
  ]);

  const [openRequestModal, setOpenRequestModal] = useState(false);
  const [requestedUnits, setRequestedUnits] = useState("2");
  const [selectedGroup, setSelectedGroup] = useState("O+");
  const [hospitalName, setHospitalName] = useState("Apollo Specialty Hospital");

  const handleSendBloodRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setOpenRequestModal(false);
    toast.success(`🚨 Emergency Request for ${requestedUnits} units of ${selectedGroup} Blood dispatched to Regional Blood Network!`);
  };

  const handleRegisterDonor = () => {
    toast.success("❤️ Thank you! You are registered as an active Voluntary Blood Donor.");
  };

  const getStatusBadge = (status: BloodStock["status"]) => {
    switch (status) {
      case "Available":
        return <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/30">Available</Badge>;
      case "Low Stock":
        return <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-600 border-amber-500/30">Low Stock</Badge>;
      case "Critical":
        return <Badge variant="outline" className="text-[10px] bg-red-500/10 text-red-600 border-red-500/30">Critical</Badge>;
    }
  };

  return (
    <Card className="border-rose-500/30 shadow-sm bg-gradient-to-br from-rose-500/5 via-card to-background">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-rose-500 text-white flex items-center justify-center font-bold shadow-sm">
              <Droplet className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                Regional Blood Bank & Donor Network
                <Badge variant="outline" className="border-rose-500/40 text-rose-500 font-mono text-[10px]">
                  LIVE INVENTORY
                </Badge>
              </CardTitle>
              <CardDescription className="text-xs">
                Real-time blood group availability & emergency reserve dispatch
              </CardDescription>
            </div>
          </div>

          <Dialog open={openRequestModal} onOpenChange={setOpenRequestModal}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-rose-600 hover:bg-rose-700 text-white gap-1.5 text-xs font-semibold">
                <Plus className="h-3.5 w-3.5" /> Request Blood
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Droplet className="h-5 w-5 text-rose-600" />
                  Emergency Blood Unit Request
                </DialogTitle>
                <DialogDescription>
                  Dispatch immediate blood component request to regional blood banks & verified donors.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSendBloodRequest} className="space-y-4 py-2">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold block mb-1">Blood Group Required</label>
                    <select
                      value={selectedGroup}
                      onChange={(e) => setSelectedGroup(e.target.value)}
                      className="w-full h-9 rounded-md border text-xs px-2 bg-background"
                    >
                      <option value="O+">O+ Positive</option>
                      <option value="O-">O- Negative</option>
                      <option value="A+">A+ Positive</option>
                      <option value="A-">A- Negative</option>
                      <option value="B+">B+ Positive</option>
                      <option value="B-">B- Negative</option>
                      <option value="AB+">AB+ Positive</option>
                      <option value="AB-">AB- Negative</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold block mb-1">Units Needed</label>
                    <Input
                      type="number"
                      value={requestedUnits}
                      onChange={(e) => setRequestedUnits(e.target.value)}
                      min="1"
                      max="10"
                      className="text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold block mb-1">Hospital / Receiving Facility</label>
                  <Input
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                    className="text-xs"
                  />
                </div>

                <Button type="submit" className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold">
                  Dispatch Emergency Request
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Blood Groups Stock Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stock.map((item) => (
            <div key={item.group} className="p-3 rounded-xl bg-card border flex items-center justify-between shadow-2xs">
              <div className="space-y-0.5">
                <span className="text-xs font-black text-rose-600 dark:text-rose-400 block">{item.group}</span>
                <span className="text-xs font-bold text-foreground">{item.units} <span className="text-[10px] text-muted-foreground font-normal">units</span></span>
              </div>
              <div>{getStatusBadge(item.status)}</div>
            </div>
          ))}
        </div>

        {/* Volunteer Donor Action Footer */}
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-rose-700 dark:text-rose-300 font-medium flex items-center gap-1.5">
            <Heart className="h-4 w-4 fill-rose-500 text-rose-500" />
            Be a Lifesaver! Register as a Voluntary Blood Donor in your city.
          </span>
          <Button size="sm" variant="outline" className="text-xs border-rose-500/40 text-rose-600 hover:bg-rose-500/20 shrink-0" onClick={handleRegisterDonor}>
            Register as Donor
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
