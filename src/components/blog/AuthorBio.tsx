
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface AuthorBioProps {
  author: string;
}

const AuthorBio = ({ author }: AuthorBioProps) => {
  return (
    <div className="flex items-start gap-4 mb-10 p-6 bg-muted/40 rounded-lg">
      <Avatar className="h-16 w-16">
        <AvatarFallback>{author.charAt(0)}</AvatarFallback>
      </Avatar>
      <div>
        <h3 className="text-lg font-semibold mb-2">Tentang {author}</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Penulis artikel tentang teknologi dan produktivitas. Suka berbagi tips dan trik untuk membuat rapat online lebih efektif.
        </p>
        <Button variant="outline" size="sm">Lihat Semua Artikel</Button>
      </div>
    </div>
  );
};

export default AuthorBio;
