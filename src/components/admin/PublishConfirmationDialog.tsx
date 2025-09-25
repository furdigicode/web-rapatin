import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BlogPost } from '@/types/BlogTypes';
import { Badge } from '@/components/ui/badge';
import { Bell, BellOff, Calendar, User } from 'lucide-react';

interface PublishConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: BlogPost | null;
  onConfirm: (sendNotification: boolean) => void;
  isLoading?: boolean;
}

export const PublishConfirmationDialog = ({
  open,
  onOpenChange,
  post,
  onConfirm,
  isLoading = false,
}: PublishConfirmationDialogProps) => {
  const [selectedOption, setSelectedOption] = useState<'notify' | 'silent' | null>(null);

  const handleConfirm = () => {
    if (selectedOption) {
      onConfirm(selectedOption === 'notify');
    }
  };

  const handleClose = () => {
    setSelectedOption(null);
    onOpenChange(false);
  };

  if (!post) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Konfirmasi Publikasi Artikel</DialogTitle>
          <DialogDescription>
            Pilih cara publikasi artikel berikut:
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Article Preview */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-sm line-clamp-2">{post.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {post.excerpt || 'Tidak ada excerpt'}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {post.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date().toLocaleDateString('id-ID')}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {post.category}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Options */}
          <div className="space-y-3">
            <div
              className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                selectedOption === 'notify'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => setSelectedOption('notify')}
            >
              <div className="flex items-start gap-3">
                <Bell className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">Publish + Push Notifikasi</h4>
                  <p className="text-sm text-muted-foreground">
                    Publikasikan artikel dan kirim notifikasi kepada pembaca
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                selectedOption === 'silent'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => setSelectedOption('silent')}
            >
              <div className="flex items-start gap-3">
                <BellOff className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <h4 className="font-medium">Publish Saja</h4>
                  <p className="text-sm text-muted-foreground">
                    Publikasikan artikel tanpa mengirim notifikasi
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Batal
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedOption || isLoading}
            className="min-w-[120px]"
          >
            {isLoading ? 'Publishing...' : 'Publikasikan'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};