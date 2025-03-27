
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BrandLogo } from '@/types/BrandLogo';
import { Plus, Trash2, MoveUp, MoveDown, Save, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const defaultBrandLogos: BrandLogo[] = [
  {
    id: '1',
    name: 'Nestle',
    svgContent: '<path d="M79.246 13.636c0 1.755-1.078 2.837-2.832 2.837-1.752 0-2.83-1.082-2.83-2.837 0-1.753 1.078-2.835 2.83-2.835 1.754 0 2.832 1.082 2.832 2.835m-8.318 0c0 3.265 2.226 5.493 5.486 5.493 3.262 0 5.488-2.228 5.488-5.493 0-3.261-2.226-5.489-5.488-5.489-3.26 0-5.486 2.228-5.486 5.489M62.6 8.8h2.5v2.3h.1c.7-1.5 2-2.6 3.9-2.6 1.4 0 2.5.5 3.2 1.6.8-1 2.1-1.6 3.6-1.6 2.9 0 4.1 1.9 4.1 4.6v6h-2.6v-5.5c0-1.4-.6-2.4-2-2.4-1.8 0-2.5 1.3-2.5 3.1v4.8h-2.6v-5.5c0-1.5-.6-2.4-2-2.4-1.8 0-2.5 1.3-2.5 3v4.9h-2.6V8.8zm-6.8.3c3.3 0 5.5 2.2 5.5 5.5s-2.2 5.5-5.5 5.5-5.5-2.2-5.5-5.5 2.2-5.5 5.5-5.5m0 8.4c1.8 0 2.8-1.1 2.8-2.9s-1-2.9-2.8-2.9-2.8 1.1-2.8 2.9 1 2.9 2.8 2.9m-8.9-8.7h2.6v10.3h-2.6V8.8zm1.3-4.7c.9 0 1.6.7 1.6 1.6s-.7 1.6-1.6 1.6-1.6-.7-1.6-1.6.7-1.6 1.6-1.6M33.5 8.8h2.5v1.7h.1c.7-1.3 2.2-2 3.6-2 3.7 0 5.1 2.8 5.1 5.8 0 2.7-1.5 5.2-4.4 5.2-1.7 0-3.1-.7-3.9-1.9H36.2v5.4h-2.6V8.8zm5.4 8c1.7 0 2.6-1.3 2.6-2.8s-.9-2.9-2.6-2.9c-1.6 0-2.6 1.4-2.6 2.9s.9 2.8 2.6 2.8m-14-8h2.6v1.5H27.6c.5-1 1.8-1.8 3.2-1.8.7 0 1.4.2 2 .5l-.9 2.2c-.4-.2-.9-.3-1.4-.3-1.9 0-2.9 1.3-2.9 3.4v4.8h-2.6V8.8zm-5.4.3c3.3 0 5.5 2.2 5.5 5.5s-2.2 5.5-5.5 5.5-5.5-2.2-5.5-5.5 2.2-5.5 5.5-5.5m0 8.4c1.8 0 2.8-1.1 2.8-2.9s-1-2.9-2.8-2.9-2.8 1.1-2.8 2.9 1 2.9 2.8 2.9"',
    width: 100,
    height: 30,
    active: true,
    order: 1
  },
  {
    id: '2',
    name: 'Kalbe',
    svgContent: '<path d="M61.3 10h19.9v5.6H67.8v7.8h11.3v5.3H67.8v7.9h13.7v5.6H61.3V10zm33.2 17.4L87 10h7.3l3.8 11.4L102 10h7l-7.5 17.4v14.8h-7V27.4zm34.9 0c0 10.4-7.4 15.7-16.4 15.7-9 0-16.3-5.3-16.3-15.7S104.9 10 112.9 10c9 0 16.4 7.4 16.4 17.4zm-7-.1c0-6.4-3.8-11.7-9.4-11.7s-9.3 5.3-9.3 11.7 3.8 10.2 9.3 10.2 9.4-3.8 9.4-10.2zm9-14.5c1.8-1.8 4.9-2.8 8.3-2.8 7.3 0 11.8 3.4 11.8 11.4v21h-5.7v-3.2c-1.9 2.5-5.1 3.8-8.5 3.8-5.2 0-9.4-2.7-9.4-8 0-5.3 4.1-7.9 9.3-8.8l8.2-1.4v-.8c0-3.9-2.3-5.4-6-5.4-2.6 0-4.9.7-7 2.8l-1 .9-3.6-3.7 3.5-4zm9.6 23c2.1 0 3.9-.7 5.2-2 1.1-1.1 1.6-2.4 1.6-4.2v-2.3l-6.5 1.2c-3.3.6-4.8 1.7-4.8 3.9 0 2.2 1.7 3.4 4.5 3.4zm14.8-14.8h7.1v4.2h.3c.9-2.8 3.4-4.8 7.4-4.8.8 0 1.5.1 2.3.3v6.2c-.9-.3-1.9-.4-2.9-.4-4.2 0-6.7 2.2-6.7 7v11.3h-7.5V21.1z"',
    width: 90,
    height: 30,
    active: true,
    order: 2
  },
  // Additional brand logos from the HeroSection would be included here
];

const BrandLogoManagement: React.FC = () => {
  const [brandLogos, setBrandLogos] = useState<BrandLogo[]>(defaultBrandLogos);
  const [currentLogo, setCurrentLogo] = useState<BrandLogo | null>(null);
  const [preview, setPreview] = useState<string>('');

  const handleAddNew = () => {
    const newLogo: BrandLogo = {
      id: Date.now().toString(),
      name: '',
      svgContent: '',
      width: 100,
      height: 30,
      active: true,
      order: brandLogos.length + 1
    };
    setCurrentLogo(newLogo);
  };

  const handleEdit = (logo: BrandLogo) => {
    setCurrentLogo({...logo});
    generatePreview({...logo});
  };

  const handleSave = () => {
    if (!currentLogo) return;
    
    if (!currentLogo.name.trim()) {
      toast({
        title: "Error",
        description: "Brand name is required",
        variant: "destructive"
      });
      return;
    }

    let updatedLogos: BrandLogo[];
    
    if (brandLogos.some(logo => logo.id === currentLogo.id)) {
      updatedLogos = brandLogos.map(logo => 
        logo.id === currentLogo.id ? currentLogo : logo
      );
    } else {
      updatedLogos = [...brandLogos, currentLogo];
    }
    
    setBrandLogos(updatedLogos);
    setCurrentLogo(null);
    setPreview('');
    
    toast({
      title: "Success",
      description: "Brand logo saved successfully"
    });
  };

  const handleDelete = (id: string) => {
    setBrandLogos(brandLogos.filter(logo => logo.id !== id));
    
    if (currentLogo?.id === id) {
      setCurrentLogo(null);
      setPreview('');
    }
    
    toast({
      title: "Success",
      description: "Brand logo deleted successfully"
    });
  };

  const moveLogoOrder = (id: string, direction: 'up' | 'down') => {
    const index = brandLogos.findIndex(logo => logo.id === id);
    if ((direction === 'up' && index === 0) || 
        (direction === 'down' && index === brandLogos.length - 1)) {
      return;
    }
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updatedLogos = [...brandLogos];
    
    // Swap the items
    [updatedLogos[index], updatedLogos[newIndex]] = [updatedLogos[newIndex], updatedLogos[index]];
    
    // Update order values
    updatedLogos.forEach((logo, idx) => {
      logo.order = idx + 1;
    });
    
    setBrandLogos(updatedLogos);
  };

  const generatePreview = (logo: BrandLogo) => {
    if (!logo.svgContent) {
      setPreview('');
      return;
    }
    
    try {
      const svgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${logo.width} ${logo.height}" width="${logo.width}" height="${logo.height}" fill="#008ccf">${logo.svgContent}</svg>`;
      setPreview(svgString);
    } catch (error) {
      console.error('Error generating SVG preview:', error);
      setPreview('');
    }
  };

  return (
    <AdminLayout>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Brand Logo Management</h1>
            <p className="text-muted-foreground mt-1">Manage brand logos displayed on the homepage</p>
          </div>
          <Button onClick={handleAddNew} className="gap-2">
            <Plus size={16} />
            Add New Logo
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Brand Logos</CardTitle>
                <CardDescription>Drag to reorder or click to edit</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-3">
                    {brandLogos.map((logo) => (
                      <div 
                        key={logo.id} 
                        className={`p-3 border rounded-md flex justify-between items-center hover:bg-accent cursor-pointer ${
                          currentLogo?.id === logo.id ? 'border-primary bg-accent/50' : ''
                        }`}
                        onClick={() => handleEdit(logo)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 w-12 h-10 flex items-center justify-center">
                            <div dangerouslySetInnerHTML={{ 
                              __html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${logo.width} ${logo.height}" width="${logo.width}" height="${logo.height}" fill="#008ccf">${logo.svgContent}</svg>` 
                            }} />
                          </div>
                          <div>
                            <div className="font-medium">{logo.name}</div>
                            <div className="text-xs text-muted-foreground">Order: {logo.order}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          {!logo.active && <Badge variant="outline">Hidden</Badge>}
                          <div className="flex flex-col">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 w-6 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                moveLogoOrder(logo.id, 'up');
                              }}
                            >
                              <MoveUp size={14} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 w-6 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                moveLogoOrder(logo.id, 'down');
                              }}
                            >
                              <MoveDown size={14} />
                            </Button>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(logo.id);
                            }}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            {currentLogo ? (
              <Card>
                <CardHeader>
                  <CardTitle>{currentLogo.id ? 'Edit Logo' : 'Add New Logo'}</CardTitle>
                  <CardDescription>Modify the logo details and preview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Brand Name</Label>
                        <Input 
                          id="name" 
                          value={currentLogo.name}
                          onChange={(e) => setCurrentLogo({...currentLogo, name: e.target.value})}
                          placeholder="e.g. Company Name"
                        />
                      </div>
                      <div className="flex items-center space-x-4 pt-6">
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="active" 
                            checked={currentLogo.active}
                            onCheckedChange={(checked) => setCurrentLogo({...currentLogo, active: checked})}
                          />
                          <Label htmlFor="active">Active</Label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="svgContent">SVG Content</Label>
                      <Textarea 
                        id="svgContent" 
                        value={currentLogo.svgContent}
                        onChange={(e) => {
                          const updated = {...currentLogo, svgContent: e.target.value};
                          setCurrentLogo(updated);
                          generatePreview(updated);
                        }}
                        placeholder="<path d=... />"
                        className="font-mono text-xs h-32"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Paste the SVG path content here (the content inside the &lt;svg&gt; tags)
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="width">Width</Label>
                        <Input 
                          id="width" 
                          type="number"
                          value={currentLogo.width}
                          onChange={(e) => {
                            const width = parseInt(e.target.value) || 100;
                            const updated = {...currentLogo, width};
                            setCurrentLogo(updated);
                            generatePreview(updated);
                          }}
                        />
                      </div>
                      <div>
                        <Label htmlFor="height">Height</Label>
                        <Input 
                          id="height" 
                          type="number"
                          value={currentLogo.height}
                          onChange={(e) => {
                            const height = parseInt(e.target.value) || 30;
                            const updated = {...currentLogo, height};
                            setCurrentLogo(updated);
                            generatePreview(updated);
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Logo Preview</Label>
                      <div className="mt-2 p-4 border rounded-md flex items-center justify-center bg-white">
                        {preview ? (
                          <div dangerouslySetInnerHTML={{ __html: preview }} />
                        ) : (
                          <div className="text-muted-foreground text-sm">No preview available</div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => {
                    setCurrentLogo(null);
                    setPreview('');
                  }}>
                    Cancel
                  </Button>
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => generatePreview(currentLogo)} className="gap-2">
                      <RefreshCw size={16} />
                      Refresh Preview
                    </Button>
                    <Button onClick={handleSave} className="gap-2">
                      <Save size={16} />
                      Save Logo
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center p-8">
                  <h3 className="text-lg font-medium mb-2">Select a logo to edit</h3>
                  <p className="text-muted-foreground">Or click "Add New Logo" to create one</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default BrandLogoManagement;
