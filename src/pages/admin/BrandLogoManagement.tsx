
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Trash2, MoveUp, MoveDown, Save, RefreshCw, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface BrandLogo {
  id: string;
  name: string;
  svg_content: string;
  width: number;
  height: number;
  url?: string;
  active: boolean;
  order_position: number;
}

const BrandLogoManagement: React.FC = () => {
  const { toast } = useToast();
  const [brandLogos, setBrandLogos] = useState<BrandLogo[]>([]);
  const [currentLogo, setCurrentLogo] = useState<BrandLogo | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchLogos();
  }, []);

  const fetchLogos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('brand_logos')
        .select('*')
        .order('order_position', { ascending: true });

      if (error) {
        console.error('Error fetching brand logos:', error);
        toast({
          title: "Error",
          description: "Could not load logos from database.",
          variant: "destructive"
        });
      } else if (data) {
        setBrandLogos(data);
      }
    } catch (err) {
      console.error('Error in brand logos fetch:', err);
      toast({
        title: "Error",
        description: "An error occurred while fetching logos.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    const newLogo: BrandLogo = {
      id: Date.now().toString(),
      name: '',
      svg_content: '',
      width: 100,
      height: 30,
      active: true,
      order_position: brandLogos.length + 1
    };
    setCurrentLogo(newLogo);
  };

  const handleEdit = (logo: BrandLogo) => {
    setCurrentLogo({...logo});
    generatePreview({...logo});
  };

  const handleSave = async () => {
    if (!currentLogo) return;
    
    if (!currentLogo.name.trim()) {
      toast({
        title: "Error",
        description: "Brand name is required",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      // Determine if it's a new logo or an update
      const isNewLogo = !brandLogos.some(logo => logo.id === currentLogo.id);
      
      if (isNewLogo) {
        // Remove client-generated ID for new items since Supabase will generate UUID
        const { id, ...newLogoData } = currentLogo;
        
        const { data, error } = await supabase
          .from('brand_logos')
          .insert([newLogoData])
          .select();
          
        if (error) {
          throw error;
        }
        
        toast({
          title: "Success",
          description: "Brand logo added successfully"
        });
      } else {
        // Update existing logo
        const { error } = await supabase
          .from('brand_logos')
          .update(currentLogo)
          .eq('id', currentLogo.id);
          
        if (error) {
          throw error;
        }
        
        toast({
          title: "Success",
          description: "Brand logo updated successfully"
        });
      }
      
      // Refresh the logos
      await fetchLogos();
      
      // Clear the form
      setCurrentLogo(null);
      setPreview('');
    } catch (err) {
      console.error('Error saving logo:', err);
      toast({
        title: "Error",
        description: "Failed to save the logo. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('brand_logos')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      // Update local state
      setBrandLogos(brandLogos.filter(logo => logo.id !== id));
      
      if (currentLogo?.id === id) {
        setCurrentLogo(null);
        setPreview('');
      }
      
      toast({
        title: "Success",
        description: "Brand logo deleted successfully"
      });
    } catch (err) {
      console.error('Error deleting logo:', err);
      toast({
        title: "Error",
        description: "Failed to delete the logo. Please try again.",
        variant: "destructive"
      });
    }
  };

  const moveLogoOrder = async (id: string, direction: 'up' | 'down') => {
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
      logo.order_position = idx + 1;
    });
    
    // Update the database
    try {
      // Create a batch of update operations
      const updates = updatedLogos.map(logo => ({
        id: logo.id,
        order_position: logo.order_position
      }));
      
      // Use batch update if available, otherwise do it one by one
      for (const update of updates) {
        const { error } = await supabase
          .from('brand_logos')
          .update({ order_position: update.order_position })
          .eq('id', update.id);
          
        if (error) {
          throw error;
        }
      }
      
      // Update local state
      setBrandLogos(updatedLogos);
      
      toast({
        title: "Success",
        description: "Logo order updated successfully"
      });
    } catch (err) {
      console.error('Error updating logo order:', err);
      toast({
        title: "Error",
        description: "Failed to update logo order. Please try again.",
        variant: "destructive"
      });
      // Revert back to original order
      await fetchLogos();
    }
  };

  const generatePreview = (logo: BrandLogo) => {
    if (!logo.svg_content) {
      setPreview('');
      return;
    }
    
    try {
      const svgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${logo.width} ${logo.height}" width="${logo.width}" height="${logo.height}" fill="#008ccf">${logo.svg_content}</svg>`;
      setPreview(svgString);
    } catch (error) {
      console.error('Error generating SVG preview:', error);
      setPreview('');
    }
  };

  return (
    <AdminLayout title="Brand Logo Management">
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Brand Logo Management</h1>
            <p className="text-muted-foreground mt-1">Manage brand logos displayed in the hero section</p>
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
                <CardDescription>Click to edit or use arrows to reorder</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
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
                                __html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${logo.width} ${logo.height}" width="${logo.width}" height="${logo.height}" fill="#008ccf">${logo.svg_content}</svg>` 
                              }} />
                            </div>
                            <div>
                              <div className="font-medium">{logo.name}</div>
                              <div className="text-xs text-muted-foreground">Order: {logo.order_position}</div>
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
                )}
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            {currentLogo ? (
              <Card>
                <CardHeader>
                  <CardTitle>{currentLogo.id && brandLogos.some(logo => logo.id === currentLogo.id) ? 'Edit Logo' : 'Add New Logo'}</CardTitle>
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
                        value={currentLogo.svg_content}
                        onChange={(e) => {
                          const updated = {...currentLogo, svg_content: e.target.value};
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
                    <Button 
                      onClick={handleSave} 
                      className="gap-2"
                      disabled={saving}
                    >
                      {saving ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Save size={16} />
                      )}
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
