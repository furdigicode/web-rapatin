
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteConfirmationProps {
  isOpen?: boolean;
  open?: boolean;
  onOpenChange: (open: boolean) => void;
  onClose?: () => void;
  onConfirm: () => void;
  onDelete?: () => void;
}

export function DeleteConfirmation({ 
  isOpen, 
  open, 
  onOpenChange, 
  onClose, 
  onConfirm, 
  onDelete 
}: DeleteConfirmationProps) {
  // Support both naming conventions (isOpen/open and onClose/onOpenChange)
  const isDialogOpen = isOpen || open || false;
  const handleClose = onClose || (() => onOpenChange(false));
  const handleConfirm = onDelete || onConfirm;

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apakah Anda yakin ingin menghapus artikel ini?</AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini tidak dapat dibatalkan. Artikel akan dihapus secara permanen.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleClose}>Batal</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm} 
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
