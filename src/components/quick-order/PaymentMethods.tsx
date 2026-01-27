import { Wallet, Building2, QrCode } from "lucide-react";

export function PaymentMethods() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 py-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <QrCode className="w-5 h-5" />
        <span className="text-sm">QRIS</span>
      </div>
      <div className="flex items-center gap-2 text-muted-foreground">
        <Building2 className="w-5 h-5" />
        <span className="text-sm">Virtual Account</span>
      </div>
      <div className="flex items-center gap-2 text-muted-foreground">
        <Wallet className="w-5 h-5" />
        <span className="text-sm">E-Wallet</span>
      </div>
    </div>
  );
}
