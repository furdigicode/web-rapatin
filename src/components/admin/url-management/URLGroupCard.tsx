
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UrlItem } from '@/types/supabase';

interface URLGroupCardProps {
  title: string;
  items: UrlItem[];
  onUrlChange: (itemIndex: number, value: string) => void;
}

const URLGroupCard: React.FC<URLGroupCardProps> = ({ title, items, onUrlChange }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Atur URL untuk tombol di {title.toLowerCase()}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item, itemIndex) => (
            <div key={itemIndex} className="grid gap-2">
              <Label htmlFor={`url-${title}-${itemIndex}`}>
                {item.label}
              </Label>
              <p className="text-xs text-muted-foreground">{item.description}</p>
              <Input
                id={`url-${title}-${itemIndex}`}
                value={item.url}
                onChange={(e) => onUrlChange(itemIndex, e.target.value)}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default URLGroupCard;
