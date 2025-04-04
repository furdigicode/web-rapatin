
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Save } from 'lucide-react';

interface URLGroup {
  title: string;
  items: {
    label: string;
    description: string;
    url: string;
  }[];
}

const URLManagement = () => {
  const { toast } = useToast();
  
  const [urlGroups, setUrlGroups] = useState<URLGroup[]>([
    {
      title: "Hero Section",
      items: [
        {
          label: "Mulai Menjadwalkan",
          description: "Tombol CTA utama di hero section",
          url: "https://rapatin.id/register"
        },
        {
          label: "Lihat Harga",
          description: "Tombol ke bagian pricing",
          url: "#pricing"
        }
      ]
    },
    {
      title: "Call to Action",
      items: [
        {
          label: "Daftar & Mulai Menjadwalkan",
          description: "Tombol CTA di bagian akhir halaman",
          url: "https://rapatin.id/register"
        }
      ]
    },
    {
      title: "Navbar",
      items: [
        {
          label: "Masuk",
          description: "Tombol login di navbar",
          url: "https://rapatin.id/login"
        },
        {
          label: "Daftar",
          description: "Tombol register di navbar",
          url: "https://rapatin.id/register"
        }
      ]
    }
  ]);

  const handleUrlChange = (groupIndex: number, itemIndex: number, value: string) => {
    const newGroups = [...urlGroups];
    newGroups[groupIndex].items[itemIndex].url = value;
    setUrlGroups(newGroups);
  };

  const handleSave = () => {
    // In a real app, this would save to a backend
    toast({
      title: "URL berhasil disimpan",
      description: "Perubahan URL telah berhasil disimpan",
    });
  };

  return (
    <AdminLayout title="Manajemen URL">
      <div className="grid gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Pengaturan URL</h2>
            <p className="text-sm text-muted-foreground">Kelola URL untuk tombol-tombol di website</p>
          </div>
          <Button onClick={handleSave} className="gap-2">
            <Save size={16} />
            Simpan Perubahan
          </Button>
        </div>
        
        {urlGroups.map((group, groupIndex) => (
          <Card key={groupIndex}>
            <CardHeader>
              <CardTitle>{group.title}</CardTitle>
              <CardDescription>Atur URL untuk tombol di {group.title.toLowerCase()}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {group.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="grid gap-2">
                    <Label htmlFor={`url-${groupIndex}-${itemIndex}`}>
                      {item.label}
                    </Label>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                    <Input
                      id={`url-${groupIndex}-${itemIndex}`}
                      value={item.url}
                      onChange={(e) => handleUrlChange(groupIndex, itemIndex, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AdminLayout>
  );
};

export default URLManagement;
