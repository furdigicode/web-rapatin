
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Daftar Program Reseller Rapatin
          </DialogTitle>
        </DialogHeader>
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
      </DialogContent>
    </Dialog>
  );
};

export default ResellerRegistrationDialog;
