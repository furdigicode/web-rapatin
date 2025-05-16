
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";

interface ResellerRegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ResellerRegistrationDialog: React.FC<ResellerRegistrationDialogProps> = ({
  open,
  onOpenChange,
}) => {
  // Track registration attempt in Facebook Pixel
  React.useEffect(() => {
    if (open && typeof window.fbq === "function") {
      window.fbq("track", "Lead", {
        content_name: "reseller_program",
      });
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Daftar Program Reseller Rapatin
          </DialogTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSc200l7EYFQAWQXZ82NvFb3oQt4S9C935PtzTqhM5tUmy0Rkw/viewform?embedded=true"
            width="100%"
            height="1400"
            frameBorder="0"
            marginHeight={0}
            marginWidth={0}
            title="Formulir Pendaftaran Reseller"
            className="mx-auto"
          >
            Memuat...
          </iframe>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResellerRegistrationDialog;
