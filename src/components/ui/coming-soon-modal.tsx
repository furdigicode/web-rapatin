
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './dialog';
import BirdSendForm from './birdsend-form';
import { Clock, Mail } from 'lucide-react';

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
}

const ComingSoonModal: React.FC<ComingSoonModalProps> = ({
  isOpen,
  onClose,
  productName,
}) => {
  const handleSuccess = () => {
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Clock className="w-6 h-6 text-primary" />
          </div>
          <DialogTitle className="text-xl font-bold">
            {productName} Segera Hadir!
          </DialogTitle>
          <DialogDescription className="text-base">
            Kami sedang mengembangkan fitur {productName.toLowerCase()} yang menakjubkan. 
            Bergabunglah dengan waiting list untuk mendapatkan akses prioritas dan update terbaru.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6">
          <div className="flex items-center gap-3 mb-6 p-4 bg-primary/5 rounded-lg">
            <Mail className="w-5 h-5 text-primary flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium">Dapatkan notifikasi eksklusif:</p>
              <ul className="text-muted-foreground mt-1 space-y-1">
                <li>• Early access untuk testing</li>
                <li>• Diskon khusus early adopter</li>
                <li>• Update perkembangan produk</li>
              </ul>
            </div>
          </div>

          <BirdSendForm onSuccess={handleSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ComingSoonModal;
