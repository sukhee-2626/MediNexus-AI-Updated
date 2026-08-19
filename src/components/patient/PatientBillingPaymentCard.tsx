import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreditCard, DollarSign, CheckCircle2, FileText, Download, ShieldCheck, ArrowRight, Zap, QrCode } from "lucide-react";
import { toast } from "sonner";

interface LineItem {
  description: string;
  category: string;
  amount: number;
}

export const PatientBillingPaymentCard = () => {
  const [isPaid, setIsPaid] = useState(false);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "insurance">("upi");

  const lineItems: LineItem[] = [
    { description: "Cardiology Specialist Consultation (Dr. Arjun Mehta)", category: "Consultation", amount: 1500 },
    { description: "Echocardiogram Diagnostic Imaging & AI Report", category: "Diagnostics", amount: 2200 },
    { description: "Prescription Medications (Metformin & Atorvastatin)", category: "Pharmacy", amount: 850 },
    { description: "Emergency ICU Room & Monitor Service", category: "Facility", amount: 3500 },
  ];

  const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
  const insuranceDiscount = 4000;
  const netPayable = Math.max(0, subtotal - insuranceDiscount);

  const handleProcessPayment = () => {
    setIsPaid(true);
    setOpenPaymentModal(false);
    toast.success("💳 Payment of ₹4,050 processed successfully! Txn ID: TXN-99821");
  };

  const handleDownloadInvoice = () => {
    toast.success("Itemized Tax Invoice PDF downloaded to device!");
  };

  return (
    <Card className="border-primary/20 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
              <CreditCard className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                Billing & Online Payment Gateway
                <Badge variant={isPaid ? "default" : "outline"} className={isPaid ? "bg-emerald-600 text-white" : "border-amber-500/40 text-amber-600 text-[10px]"}>
                  {isPaid ? "PAID" : "DUE"}
                </Badge>
              </CardTitle>
              <CardDescription className="text-xs">
                Transparent itemized medical invoice & instant checkout
              </CardDescription>
            </div>
          </div>

          <Button size="sm" variant="outline" className="text-xs gap-1 border-primary/40 text-primary" onClick={handleDownloadInvoice}>
            <Download className="h-3.5 w-3.5" /> PDF Invoice
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Itemized Bill Table */}
        <div className="space-y-2">
          <div className="rounded-xl border bg-card overflow-hidden">
            <div className="bg-muted/50 p-2.5 text-[11px] font-bold text-muted-foreground grid grid-cols-12">
              <span className="col-span-8">Service / Item Description</span>
              <span className="col-span-2 text-center">Category</span>
              <span className="col-span-2 text-right">Amount</span>
            </div>
            <div className="divide-y text-xs">
              {lineItems.map((item, idx) => (
                <div key={idx} className="p-2.5 grid grid-cols-12 items-center">
                  <span className="col-span-8 font-medium text-foreground">{item.description}</span>
                  <span className="col-span-2 text-center"><Badge variant="outline" className="text-[9px]">{item.category}</Badge></span>
                  <span className="col-span-2 text-right font-mono font-bold">₹{item.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Subtotal Calculation */}
          <div className="p-3 rounded-xl bg-muted/40 border space-y-1.5 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>Gross Invoice Subtotal</span>
              <span className="font-mono">₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-emerald-600 font-medium">
              <span>Health Insurance Co-Pay Coverage (Star Health)</span>
              <span className="font-mono">- ₹{insuranceDiscount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t pt-1.5 font-bold text-sm text-foreground">
              <span>Net Amount Payable</span>
              <span className="font-mono text-primary text-base">₹{netPayable.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Payment Action Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>256-Bit SSL Payment Protection</span>
          </div>

          {!isPaid ? (
            <Dialog open={openPaymentModal} onOpenChange={setOpenPaymentModal}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-1.5 text-xs">
                  <CreditCard className="h-4 w-4" /> Pay ₹{netPayable.toLocaleString()} Now
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-emerald-600" />
                    MediNexus Online Payment Gateway
                  </DialogTitle>
                  <DialogDescription>
                    Select your preferred payment method for Net Payable Amount: <strong className="text-foreground">₹{netPayable.toLocaleString()}</strong>
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <button
                      onClick={() => setPaymentMethod("upi")}
                      className={`p-3 rounded-xl border text-center font-bold transition ${
                        paymentMethod === "upi" ? "bg-emerald-500/10 border-emerald-500 text-emerald-600" : "bg-card"
                      }`}
                    >
                      UPI / QR
                    </button>
                    <button
                      onClick={() => setPaymentMethod("card")}
                      className={`p-3 rounded-xl border text-center font-bold transition ${
                        paymentMethod === "card" ? "bg-emerald-500/10 border-emerald-500 text-emerald-600" : "bg-card"
                      }`}
                    >
                      Card / NetBanking
                    </button>
                    <button
                      onClick={() => setPaymentMethod("insurance")}
                      className={`p-3 rounded-xl border text-center font-bold transition ${
                        paymentMethod === "insurance" ? "bg-emerald-500/10 border-emerald-500 text-emerald-600" : "bg-card"
                      }`}
                    >
                      Direct Insurance
                    </button>
                  </div>

                  {paymentMethod === "upi" && (
                    <div className="p-4 rounded-xl bg-muted text-center space-y-2">
                      <QrCode className="h-24 w-24 mx-auto text-foreground" />
                      <p className="text-xs font-mono font-bold">medinexus@upi</p>
                      <p className="text-[10px] text-muted-foreground">Scan with Google Pay, PhonePe, or Paytm to pay ₹{netPayable.toLocaleString()}</p>
                    </div>
                  )}

                  <Button onClick={handleProcessPayment} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-10">
                    Confirm & Complete Checkout
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          ) : (
            <Badge className="bg-emerald-600 text-white gap-1 py-1 px-3">
              <CheckCircle2 className="h-3.5 w-3.5" /> PAID (Txn #TXN-99821)
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
