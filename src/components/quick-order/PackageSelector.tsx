import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface Package {
  participants: number;
  promoPrice: number;
  normalPrice: number;
}

const packages: Package[] = [
  { participants: 100, promoPrice: 25000, normalPrice: 40000 },
  { participants: 300, promoPrice: 45000, normalPrice: 80000 },
  { participants: 500, promoPrice: 75000, normalPrice: 140000 },
  { participants: 1000, promoPrice: 135000, normalPrice: 260000 },
];

interface PackageSelectorProps {
  selected: number | null;
  onSelect: (participants: number) => void;
}

const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export function PackageSelector({ selected, onSelect }: PackageSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {packages.map((pkg) => {
        const isSelected = selected === pkg.participants;
        const discount = Math.round(((pkg.normalPrice - pkg.promoPrice) / pkg.normalPrice) * 100);
        
        return (
          <button
            key={pkg.participants}
            type="button"
            onClick={() => onSelect(pkg.participants)}
            className={cn(
              "relative flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-200",
              "hover:border-primary hover:shadow-md",
              isSelected
                ? "border-primary bg-primary/5 shadow-md"
                : "border-border bg-card"
            )}
          >
            {isSelected && (
              <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-1">
                <Check className="w-3 h-3" />
              </div>
            )}
            
            <div className="absolute -top-2 left-2 bg-destructive text-destructive-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
              -{discount}%
            </div>
            
            
            <span className={cn(
              "text-lg font-bold",
              isSelected ? "text-primary" : "text-foreground"
            )}>
              {pkg.participants}
            </span>
            <span className="text-xs text-muted-foreground mb-2">Peserta</span>
            
            <div className="text-center">
              <span className="text-xs text-muted-foreground line-through block">
                {formatRupiah(pkg.normalPrice)}
              </span>
              <span className={cn(
                "font-bold text-sm",
                isSelected ? "text-primary" : "text-foreground"
              )}>
                {formatRupiah(pkg.promoPrice)}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export { packages };
