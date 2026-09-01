import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export type PaymentGateway = "xendit" | "duitku";

interface PaymentGatewaySelectorProps {
  value: PaymentGateway;
  onChange: (value: PaymentGateway) => void;
  disabled?: boolean;
}

const gateways: {
  id: PaymentGateway;
  label: string;
  description: string;
}[] = [
  {
    id: "xendit",
    label: "Xendit",
    description: "QRIS, Virtual Account, E-Wallet, Kartu Kredit",
  },
  {
    id: "duitku",
    label: "Duitku",
    description: "QRIS, Virtual Account, E-Wallet, Retail",
  },
];

export const PaymentGatewaySelector = ({
  value,
  onChange,
  disabled,
}: PaymentGatewaySelectorProps) => {
  return (
    <div
      className="space-y-2"
      role="radiogroup"
      aria-label="Pilih penyedia pembayaran"
    >
      <p className="text-sm font-medium">Pilih Penyedia Pembayaran</p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {gateways.map((gateway) => {
          const isSelected = value === gateway.id;
          return (
            <button
              key={gateway.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={disabled}
              onClick={() => onChange(gateway.id)}
              className={cn(
                "relative rounded-xl border p-3 text-left transition-colors",
                "hover:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card",
                disabled && "opacity-60 cursor-not-allowed",
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold">{gateway.label}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {gateway.description}
                  </p>
                </div>
                <span
                  className={cn(
                    "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground/40",
                  )}
                >
                  {isSelected && <Check className="h-3 w-3" />}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
