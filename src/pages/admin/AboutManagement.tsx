import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Book, Users, Award, Heart, Plus, Trash, Save, Upload, Edit, TrendingUp } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

// Form schema definitions
const headerFormSchema = z.object({
  title: z.string().min(1, "Judul harus diisi"),
  description: z.string().min(1, "Deskripsi harus diisi")
});

const storyFormSchema = z.object({
  title: z.string().min(1, "Judul harus diisi"),
  content: z.string().min(1, "Konten harus diisi")
});

const valueSchema = z.object({
  id: z.number(),
  icon: z.string(),
  title: z.string().min(1, "Judul nilai harus diisi"),
  description: z.string().min(1, "Deskripsi nilai harus diisi")
});

const valuesFormSchema = z.object({
  title: z.string().min(1, "Judul harus diisi"),
  values: z.array(valueSchema)
});

const teamMemberSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Nama harus diisi"),
  position: z.string().min(1, "Jabatan harus diisi"),
  bio: z.string().min(1, "Bio harus diisi"),
  avatarUrl: z.string().optional()
});

const teamFormSchema = z.object({
  title: z.string().min(1, "Judul harus diisi"),
  members: z.array(teamMemberSchema)
});

// Initial data
const initialAboutData = {
  header: {
    title: "Tentang Kami",
    description: "Rapatin hadir untuk menjadikan rapat online lebih mudah dan terjangkau untuk semua orang."
  },
  story: {
    title: "Kisah Kami",
    content: "Rapatin didirikan pada tahun 2023 oleh sekelompok profesional teknologi yang frustrasi dengan biaya langganan bulanan layanan rapat online yang mahal.\n\nKami percaya bahwa teknologi rapat online seharusnya tersedia untuk semua orang tanpa perlu membayar langganan bulanan yang mahal. Itulah mengapa kami menciptakan model bayar-sesuai-pakai yang inovatif, memungkinkan pengguna untuk membayar hanya untuk rapat yang benar-benar mereka jadwalkan.\n\nSejak itu, misi kami adalah membuat rapat online lebih terjangkau dan fleksibel untuk bisnis dari semua ukuran, pengajar, dan profesional di seluruh Indonesia."
  },
  values: {
    title: "Nilai-Nilai Kami",
    values: [
      { 
        id: 1, 
        icon: "trending-up", 
        title: "Inovasi", 
        description: "Kami terus berinovasi untuk memberikan solusi terbaik bagi pengguna kami."
      },
      { 
        id: 2, 
        icon: "award", 
        title: "Kualitas", 
        description: "Kami berkomitmen untuk menyediakan layanan berkualitas tinggi dengan harga terjangkau."
      },
      { 
        id: 3, 
        icon: "users", 
        title: "Komunitas", 
        description: "Kami membangun komunitas yang inklusif dan mendukung semua pengguna kami."
      },
      { 
        id: 4, 
        icon: "heart", 
        title: "Kepedulian", 
        description: "Kami peduli dengan kebutuhan pengguna dan selalu mendengarkan masukan mereka."
      }
    ]
  },
  team: {
    title: "Tim Kami",
    members: [
      { 
        id: 1, 
        name: "Budi Setiawan", 
        position: "CEO & Founder", 
        bio: "Berpengalaman 10+ tahun di industri teknologi dan telekomunikasi.",
        avatarUrl: ""
      },
      { 
        id: 2, 
        name: "Dewi Lestari", 
        position: "CTO", 
        bio: "Insinyur perangkat lunak dengan pengalaman di perusahaan teknologi global.",
        avatarUrl: ""
      },
      { 
        id: 3, 
        name: "Adi Nugroho", 
        position: "CPO", 
        bio: "Pakar UX/UI dengan fokus pada pengembangan produk yang berpusat pada pengguna.",
        avatarUrl: ""
      }
    ]
  }
};

const AboutManagement = () => {
  const { toast } = useToast();
  const [aboutData, setAboutData] = useState(initialAboutData);
  const [isAddValueDialogOpen, setIsAddValueDialogOpen] = useState(false);
  const [isAddTeamMemberDialogOpen, setIsAddTeamMemberDialogOpen] = useState(false);
  const [isEditTeamMemberDialogOpen, setIsEditTeamMemberDialogOpen] = useState(false);
  const [newValue, setNewValue] = useState({ icon: "trending-up", title: "", description: "" });
  const [newTeamMember, setNewTeamMember] = useState({ name: "", position: "", bio: "", avatarUrl: "" });
  const [editingTeamMember, setEditingTeamMember] = useState({ id: 0, name: "", position: "", bio: "", avatarUrl: "" });
  const [selectedIconIndex, setSelectedIconIndex] = useState(0);

  const iconOptions = [
    { value: "trending-up", label: "Trending Up", component: <TrendingUp size={20} /> },
    { value: "award", label: "Award", component: <Award size={20} /> },
    { value: "users", label: "Users", component: <Users size={20} /> },
    { value: "heart", label: "Heart", component: <Heart size={20} /> },
    { value: "book", label: "Book", component: <Book size={20} /> }
  ];

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('aboutPageData');
    if (savedData) {
      try {
        setAboutData(JSON.parse(savedData));
      } catch (e) {
        console.error('Error parsing saved about page data:', e);
      }
    }
  }, []);

  // Form instances
  const headerForm = useForm({
    resolver: zodResolver(headerFormSchema),
    defaultValues: aboutData.header
  });

  const storyForm = useForm({
    resolver: zodResolver(storyFormSchema),
    defaultValues: aboutData.story
  });

  const valuesForm = useForm({
    resolver: zodResolver(valuesFormSchema),
    defaultValues: aboutData.values
  });

  const teamForm = useForm({
    resolver: zodResolver(teamFormSchema),
    defaultValues: aboutData.team
  });

  // Update forms when aboutData changes
  useEffect(() => {
    headerForm.reset(aboutData.header);
    storyForm.reset(aboutData.story);
    valuesForm.reset(aboutData.values);
    teamForm.reset(aboutData.team);
  }, [aboutData]);

  // Save functions
  const saveHeader = (data) => {
    setAboutData(prev => ({
      ...prev,
      header: data
    }));
    
    saveToLocalStorage({
      ...aboutData,
      header: data
    });
    
    toast({
      title: "Perubahan disimpan",
      description: "Header halaman tentang kami telah diperbarui"
    });
  };

  const saveStory = (data) => {
    setAboutData(prev => ({
      ...prev,
      story: data
    }));
    
    saveToLocalStorage({
      ...aboutData,
      story: data
    });
    
    toast({
      title: "Perubahan disimpan",
      description: "Kisah kami telah diperbarui"
    });
  };

  const saveValues = (data) => {
    setAboutData(prev => ({
      ...prev,
      values: data
    }));
    
    saveToLocalStorage({
      ...aboutData,
      values: data
    });
    
    toast({
      title: "Perubahan disimpan",
      description: "Nilai-nilai kami telah diperbarui"
    });
  };

  const saveTeam = (data) => {
    setAboutData(prev => ({
      ...prev,
      team: data
    }));
    
    saveToLocalStorage({
      ...aboutData,
      team: data
    });
    
    toast({
      title: "Perubahan disimpan",
      description: "Tim kami telah diperbarui"
    });
  };

  const saveToLocalStorage = (data) => {
    localStorage.setItem('aboutPageData', JSON.stringify(data));
  };

  // Handle adding a new value
  const handleAddValue = () => {
    const newId = aboutData.values.values.length > 0 
      ? Math.max(...aboutData.values.values.map(v => v.id)) + 1 
      : 1;
    
    const valueToAdd = {
      id: newId,
      icon: iconOptions[selectedIconIndex].value,
      title: newValue.title,
      description: newValue.description
    };

    const updatedValues = [...aboutData.values.values, valueToAdd];
    
    setAboutData(prev => ({
      ...prev,
      values: {
        ...prev.values,
        values: updatedValues
      }
    }));
    
    valuesForm.setValue('values', updatedValues);
    
    // Reset form
    setNewValue({ icon: "trending-up", title: "", description: "" });
    setSelectedIconIndex(0);
    setIsAddValueDialogOpen(false);
    
    toast({
      title: "Nilai baru ditambahkan",
      description: `Nilai "${valueToAdd.title}" telah ditambahkan`
    });
  };

  // Handle removing a value
  const handleRemoveValue = (id) => {
    const updatedValues = aboutData.values.values.filter(value => value.id !== id);
    
    setAboutData(prev => ({
      ...prev,
      values: {
        ...prev.values,
        values: updatedValues
      }
    }));
    
    valuesForm.setValue('values', updatedValues);
    
    toast({
      title: "Nilai dihapus",
      description: "Nilai telah dihapus dari daftar"
    });
  };

  // Handle editing a team member
  const handleEditTeamMember = (member) => {
    setEditingTeamMember({
      id: member.id,
      name: member.name,
      position: member.position,
      bio: member.bio,
      avatarUrl: member.avatarUrl || ""
    });
    setIsEditTeamMemberDialogOpen(true);
  };

  // Handle saving edited team member
  const handleSaveEditedTeamMember = () => {
    const updatedMembers = aboutData.team.members.map(member => 
      member.id === editingTeamMember.id ? editingTeamMember : member
    );
    
    setAboutData(prev => ({
      ...prev,
      team: {
        ...prev.team,
        members: updatedMembers
      }
    }));
    
    teamForm.setValue('members', updatedMembers);
    setIsEditTeamMemberDialogOpen(false);
    
    toast({
      title: "Anggota tim diperbarui",
      description: `Data ${editingTeamMember.name} telah diperbarui`
    });
  };

  // Handle adding a team member
  const handleAddTeamMember = () => {
    const newId = aboutData.team.members.length > 0 
      ? Math.max(...aboutData.team.members.map(m => m.id)) + 1 
      : 1;
    
    const memberToAdd = {
      id: newId,
      name: newTeamMember.name,
      position: newTeamMember.position,
      bio: newTeamMember.bio,
      avatarUrl: newTeamMember.avatarUrl || ""
    };

    const updatedMembers = [...aboutData.team.members, memberToAdd];
    
    setAboutData(prev => ({
      ...prev,
      team: {
        ...prev.team,
        members: updatedMembers
      }
    }));
    
    teamForm.setValue('members', updatedMembers);
    
    // Reset form
    setNewTeamMember({ name: "", position: "", bio: "", avatarUrl: "" });
    setIsAddTeamMemberDialogOpen(false);
    
    toast({
      title: "Anggota tim baru ditambahkan",
      description: `${memberToAdd.name} telah ditambahkan ke tim`
    });
  };

  // Handle removing a team member
  const handleRemoveTeamMember = (id) => {
    const updatedMembers = aboutData.team.members.filter(member => member.id !== id);
    
    setAboutData(prev => ({
      ...prev,
      team: {
        ...prev.team,
        members: updatedMembers
      }
    }));
    
    teamForm.setValue('members', updatedMembers);
    
    toast({
      title: "Anggota tim dihapus",
      description: "Anggota tim telah dihapus dari daftar"
    });
  };

  // Get icon component by name
  const getIconComponent = (iconName) => {
    const icon = iconOptions.find(i => i.value === iconName);
    return icon ? icon.component : <TrendingUp size={20} />;
  };

  return (
    <AdminLayout title="Manajemen Halaman Tentang Kami">
      <Tabs defaultValue="header" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="header">Header</TabsTrigger>
          <TabsTrigger value="story">Kisah Kami</TabsTrigger>
          <TabsTrigger value="values">Nilai-Nilai</TabsTrigger>
          <TabsTrigger value="team">Tim Kami</TabsTrigger>
        </TabsList>
        
        {/* Header Section */}
        <TabsContent value="header">
          <Card>
            <CardHeader>
              <CardTitle>Header Halaman</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...headerForm}>
                <form onSubmit={headerForm.handleSubmit(saveHeader)} className="space-y-4">
                  <FormField
                    control={headerForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Judul</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Masukkan judul header" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={headerForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deskripsi</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Masukkan deskripsi header" 
                            className="min-h-[100px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full sm:w-auto">
                    <Save className="w-4 h-4 mr-2" /> Simpan Perubahan
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Story Section */}
        <TabsContent value="story">
          <Card>
            <CardHeader>
              <CardTitle>Kisah Kami</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...storyForm}>
                <form onSubmit={storyForm.handleSubmit(saveStory)} className="space-y-4">
                  <FormField
                    control={storyForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Judul</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Masukkan judul kisah" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={storyForm.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Konten</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Masukkan konten kisah perusahaan" 
                            className="min-h-[200px]"
                          />
                        </FormControl>
                        <FormDescription>
                          Gunakan baris baru untuk paragraf terpisah.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full sm:w-auto">
                    <Save className="w-4 h-4 mr-2" /> Simpan Perubahan
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Values Section */}
        <TabsContent value="values">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Nilai-Nilai Kami</CardTitle>
              <Dialog open={isAddValueDialogOpen} onOpenChange={setIsAddValueDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" /> Tambah Nilai
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Tambah Nilai Baru</DialogTitle>
                    <DialogDescription>
                      Tambahkan nilai-nilai perusahaan baru ke halaman Tentang Kami.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Ikon</Label>
                      <div className="flex flex-wrap gap-2">
                        {iconOptions.map((icon, index) => (
                          <Button
                            key={icon.value}
                            type="button"
                            variant={selectedIconIndex === index ? "default" : "outline"}
                            size="sm"
                            className="flex items-center gap-2"
                            onClick={() => {
                              setSelectedIconIndex(index);
                              setNewValue(prev => ({ ...prev, icon: icon.value }));
                            }}
                          >
                            {icon.component}
                            <span>{icon.label}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="value-title">Judul</Label>
                      <Input
                        id="value-title"
                        placeholder="Masukkan judul nilai"
                        value={newValue.title}
                        onChange={(e) => setNewValue(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="value-description">Deskripsi</Label>
                      <Textarea
                        id="value-description"
                        placeholder="Masukkan deskripsi nilai"
                        value={newValue.description}
                        onChange={(e) => setNewValue(prev => ({ ...prev, description: e.target.value }))}
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddValueDialogOpen(false)}>
                      Batal
                    </Button>
                    <Button onClick={handleAddValue} disabled={!newValue.title || !newValue.description}>
                      Tambah Nilai
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Form {...valuesForm}>
                <form onSubmit={valuesForm.handleSubmit(saveValues)} className="space-y-6">
                  <FormField
                    control={valuesForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Judul Bagian</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Masukkan judul bagian nilai-nilai" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-2">
                    <Label>Daftar Nilai-Nilai</Label>
                    {aboutData.values.values.length === 0 ? (
                      <div className="text-center p-4 border border-dashed rounded-md">
                        <p className="text-muted-foreground">Belum ada nilai-nilai yang ditambahkan.</p>
                      </div>
                    ) : (
                      <div className="grid gap-4 sm:grid-cols-2">
                        {aboutData.values.values.map((value) => (
                          <Card key={value.id} className="overflow-hidden">
                            <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                  {getIconComponent(value.icon)}
                                </div>
                                <h4 className="font-semibold">{value.title}</h4>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveValue(value.id)}
                                className="h-8 w-8 text-destructive"
                              >
                                <Trash size={16} />
                              </Button>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                              <p className="text-sm text-muted-foreground">{value.description}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <Button type="submit" className="w-full sm:w-auto">
                    <Save className="w-4 h-4 mr-2" /> Simpan Perubahan
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Team Section */}
        <TabsContent value="team">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Tim Kami</CardTitle>
              <Dialog open={isAddTeamMemberDialogOpen} onOpenChange={setIsAddTeamMemberDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" /> Tambah Anggota Tim
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Tambah Anggota Tim Baru</DialogTitle>
                    <DialogDescription>
                      Tambahkan profil anggota tim baru ke halaman Tentang Kami.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="member-name">Nama</Label>
                      <Input
                        id="member-name"
                        placeholder="Masukkan nama anggota tim"
                        value={newTeamMember.name}
                        onChange={(e) => setNewTeamMember(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="member-position">Jabatan</Label>
                      <Input
                        id="member-position"
                        placeholder="Masukkan jabatan anggota tim"
                        value={newTeamMember.position}
                        onChange={(e) => setNewTeamMember(prev => ({ ...prev, position: e.target.value }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="member-bio">Bio</Label>
                      <Textarea
                        id="member-bio"
                        placeholder="Masukkan bio anggota tim"
                        value={newTeamMember.bio}
                        onChange={(e) => setNewTeamMember(prev => ({ ...prev, bio: e.target.value }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="member-avatar">Avatar URL (Opsional)</Label>
                      <div className="flex gap-2">
                        <Input
                          id="member-avatar"
                          placeholder="Masukkan URL avatar (opsional)"
                          value={newTeamMember.avatarUrl}
                          onChange={(e) => setNewTeamMember(prev => ({ ...prev, avatarUrl: e.target.value }))}
                        />
                        <Button type="button" variant="outline" size="icon" className="flex-shrink-0">
                          <Upload size={16} />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Gunakan URL gambar atau kosongkan untuk avatar default.
                      </p>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddTeamMemberDialogOpen(false)}>
                      Batal
                    </Button>
                    <Button 
                      onClick={handleAddTeamMember} 
                      disabled={!newTeamMember.name || !newTeamMember.position || !newTeamMember.bio}
                    >
                      Tambah Anggota Tim
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Form {...teamForm}>
                <form onSubmit={teamForm.handleSubmit(saveTeam)} className="space-y-6">
                  <FormField
                    control={teamForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Judul Bagian</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Masukkan judul bagian tim" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-2">
                    <Label>Anggota Tim</Label>
                    {aboutData.team.members.length === 0 ? (
                      <div className="text-center p-4 border border-dashed rounded-md">
                        <p className="text-muted-foreground">Belum ada anggota tim yang ditambahkan.</p>
                      </div>
                    ) : (
                      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                        {aboutData.team.members.map((member) => (
                          <Card key={member.id} className="overflow-hidden relative">
                            <div className="absolute top-2 right-2 flex gap-1 z-10">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditTeamMember(member)}
                                className="h-8 w-8 text-primary hover:text-primary-dark"
                              >
                                <Edit size={16} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveTeamMember(member.id)}
                                className="h-8 w-8 text-destructive hover:text-destructive/90"
                              >
                                <Trash size={16} />
                              </Button>
                            </div>
                            <CardHeader className="p-4 flex flex-col items-center text-center space-y-2">
                              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                                {member.avatarUrl ? (
                                  <img 
                                    src={member.avatarUrl} 
                                    alt={member.name} 
                                    className="w-full h-full rounded-full object-cover"
                                  />
                                ) : null}
                              </div>
                              <div>
                                <h4 className="font-semibold text-lg">{member.name}</h4>
                                <p className="text-sm text-primary">{member.position}</p>
                              </div>
                            </CardHeader>
                            <CardContent className="p-4 pt-0 text-center">
                              <p className="text-sm text-muted-foreground">{member.bio}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <Button type="submit" className="w-full sm:w-auto">
                    <Save className="w-4 h-4 mr-2" /> Simpan Perubahan
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Team Member Dialog */}
      <Dialog open={isEditTeamMemberDialogOpen} onOpenChange={setIsEditTeamMemberDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Anggota Tim</DialogTitle>
            <DialogDescription>
              Perbarui informasi anggota tim.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-member-name">Nama</Label>
              <Input
                id="edit-member-name"
                placeholder="Masukkan nama anggota tim"
                value={editingTeamMember.name}
                onChange={(e) => setEditingTeamMember(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-member-position">Jabatan</Label>
              <Input
                id="edit-member-position"
                placeholder="Masukkan jabatan anggota tim"
                value={editingTeamMember.position}
                onChange={(e) => setEditingTeamMember(prev => ({ ...prev, position: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-member-bio">Bio</Label>
              <Textarea
                id="edit-member-bio"
                placeholder="Masukkan bio anggota tim"
                value={editingTeamMember.bio}
                onChange={(e) => setEditingTeamMember(prev => ({ ...prev, bio: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-member-avatar">Avatar URL (Opsional)</Label>
              <div className="flex gap-2">
                <Input
                  id="edit-member-avatar"
                  placeholder="Masukkan URL avatar (opsional)"
                  value={editingTeamMember.avatarUrl}
                  onChange={(e) => setEditingTeamMember(prev => ({ ...prev, avatarUrl: e.target.value }))}
                />
                <Button type="button" variant="outline" size="icon" className="flex-shrink-0">
                  <Upload size={16} />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Gunakan URL gambar atau kosongkan untuk avatar default.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditTeamMemberDialogOpen(false)}>
              Batal
            </Button>
            <Button 
              onClick={handleSaveEditedTeamMember} 
              disabled={!editingTeamMember.name || !editingTeamMember.position || !editingTeamMember.bio}
            >
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

// Helper components for the icons
const TrendingUp = ({ size = 24, ...props }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
);

export default AboutManagement;
