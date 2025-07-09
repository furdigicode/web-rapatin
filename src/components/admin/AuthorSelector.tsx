import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Author } from '@/types/AuthorTypes';

interface AuthorSelectorProps {
  selectedAuthorId: string;
  onAuthorChange: (authorId: string) => void;
  onCreateAuthor?: () => void;
}

const AuthorSelector: React.FC<AuthorSelectorProps> = ({ 
  selectedAuthorId, 
  onAuthorChange, 
  onCreateAuthor 
}) => {
  const { data: authors = [], isLoading } = useQuery({
    queryKey: ['authors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('authors')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data as Author[];
    }
  });

  const getAuthorInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Label>Penulis</Label>
        <div className="p-4 border rounded-md">
          <div className="text-sm text-muted-foreground">Loading penulis...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2">
          <User size={14} />
          Pilih Penulis
        </Label>
        {onCreateAuthor && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCreateAuthor}
            className="gap-2"
          >
            <Plus size={14} />
            Tambah Penulis
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 gap-3 max-h-48 overflow-y-auto border rounded-md p-3">
        {authors.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-2">Belum ada penulis tersedia</p>
            {onCreateAuthor && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onCreateAuthor}
                className="gap-2"
              >
                <Plus size={14} />
                Buat Penulis Pertama
              </Button>
            )}
          </div>
        ) : (
          authors.map((author) => (
            <div
              key={author.id}
              onClick={() => onAuthorChange(author.id)}
              className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-colors hover:bg-accent ${
                selectedAuthorId === author.id 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={author.avatar_url} alt={author.name} />
                <AvatarFallback>
                  {getAuthorInitials(author.name)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-medium truncate">{author.name}</h4>
                  {selectedAuthorId === author.id && (
                    <Badge variant="default" className="text-xs">Dipilih</Badge>
                  )}
                </div>
                {author.specialization && (
                  <p className="text-xs text-muted-foreground truncate">
                    {author.specialization}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">@{author.slug}</p>
              </div>
            </div>
          ))
        )}
      </div>
      
      {authors.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Klik pada penulis untuk memilihnya sebagai author artikel.
        </p>
      )}
    </div>
  );
};

export default AuthorSelector;