import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { VotingFormData, VotingOptionFormData, defaultVotingFormData } from '@/types/VotingTypes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { generateSlug } from '@/utils/votingUtils';
import { Plus, X, Save, ArrowLeft } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface VotingBuilderProps {
  votingId?: string | null;
  onSaveSuccess?: () => void;
  onCancel?: () => void;
}

const VotingBuilder: React.FC<VotingBuilderProps> = ({ votingId, onSaveSuccess, onCancel }) => {
  const [formData, setFormData] = useState<VotingFormData>(defaultVotingFormData);
  const [options, setOptions] = useState<VotingOptionFormData[]>([
    { option_text: '', option_order: 0, option_image: null },
    { option_text: '', option_order: 1, option_image: null },
  ]);
  const queryClient = useQueryClient();

  // Fetch voting categories
  const { data: categories = [] } = useQuery({
    queryKey: ['voting-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('voting_categories')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  const { data: existingVoting } = useQuery({
    queryKey: ['voting', votingId],
    queryFn: async () => {
      if (!votingId) return null;
      const { data, error } = await supabase
        .from('votings')
        .select('*')
        .eq('id', votingId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!votingId,
  });

  const { data: existingOptions } = useQuery({
    queryKey: ['voting_options', votingId],
    queryFn: async () => {
      if (!votingId) return [];
      const { data, error } = await supabase
        .from('voting_options')
        .select('*')
        .eq('voting_id', votingId)
        .order('option_order');
      if (error) throw error;
      return data;
    },
    enabled: !!votingId,
  });

  useEffect(() => {
    if (existingVoting) {
      setFormData({
        title: existingVoting.title,
        description: existingVoting.description || '',
        slug: existingVoting.slug,
        status: existingVoting.status as 'draft' | 'active' | 'closed',
        voting_type: existingVoting.voting_type as 'single' | 'multiple',
        max_selections: existingVoting.max_selections,
        start_date: existingVoting.start_date,
        end_date: existingVoting.end_date,
        show_results: existingVoting.show_results,
        require_login: existingVoting.require_login,
        allow_anonymous: existingVoting.allow_anonymous,
        cover_image: existingVoting.cover_image,
        category: existingVoting.category,
      });
    }
  }, [existingVoting]);

  useEffect(() => {
    if (existingOptions && existingOptions.length > 0) {
      setOptions(existingOptions.map((opt) => ({
        option_text: opt.option_text,
        option_order: opt.option_order,
        option_image: opt.option_image,
      })));
    }
  }, [existingOptions]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      // Validate
      if (!formData.title || options.filter(o => o.option_text).length < 2) {
        throw new Error('Title dan minimal 2 opsi wajib diisi');
      }

      if (votingId) {
        // Update existing voting
        const { error: votingError } = await supabase
          .from('votings')
          .update(formData)
          .eq('id', votingId);
        if (votingError) throw votingError;

        // Delete old options
        await supabase.from('voting_options').delete().eq('voting_id', votingId);

        // Insert new options
        const validOptions = options.filter(o => o.option_text);
        const { error: optionsError } = await supabase
          .from('voting_options')
          .insert(validOptions.map((opt, idx) => ({
            voting_id: votingId,
            ...opt,
            option_order: idx,
          })));
        if (optionsError) throw optionsError;
      } else {
        // Create new voting
        const { data: newVoting, error: votingError } = await supabase
          .from('votings')
          .insert(formData)
          .select()
          .single();
        if (votingError) throw votingError;

        // Insert options
        const validOptions = options.filter(o => o.option_text);
        const { error: optionsError } = await supabase
          .from('voting_options')
          .insert(validOptions.map((opt, idx) => ({
            voting_id: newVoting.id,
            ...opt,
            option_order: idx,
          })));
        if (optionsError) throw optionsError;
      }
    },
    onSuccess: () => {
      toast.success(votingId ? 'Voting berhasil diupdate' : 'Voting berhasil dibuat');
      queryClient.invalidateQueries({ queryKey: ['votings'] });
      onSaveSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Gagal menyimpan voting');
    },
  });

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    });
  };

  const addOption = () => {
    setOptions([...options, { option_text: '', option_order: options.length, option_image: null }]);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, text: string) => {
    const newOptions = [...options];
    newOptions[index].option_text = text;
    setOptions(newOptions);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4 mb-6">
        {onCancel && (
          <Button variant="ghost" size="sm" onClick={onCancel} className="mb-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
        )}
        <div className="flex items-center justify-between w-full">
          <h2 className="text-2xl font-bold">
            {votingId ? 'Edit Voting' : 'Buat Voting Baru'}
          </h2>
          <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
            <Save className="mr-2 h-4 w-4" />
            Simpan
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Dasar</CardTitle>
          <CardDescription>Atur judul, deskripsi, dan pengaturan voting</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Judul Voting *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Masukkan judul voting..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug (URL)</Label>
            <Input id="slug" value={formData.slug} disabled />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Deskripsi voting..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Kategori</Label>
            <Select
              value={formData.category || ''}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value || null })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih kategori..." />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.name}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="voting_type">Tipe Voting</Label>
              <Select
                value={formData.voting_type}
                onValueChange={(value: 'single' | 'multiple') =>
                  setFormData({ ...formData, voting_type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Pilih 1</SelectItem>
                  <SelectItem value="multiple">Pilih Banyak</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'draft' | 'active' | 'closed') =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="closed">Ditutup</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="show_results">Tampilkan hasil sebelum voting selesai</Label>
            <Switch
              id="show_results"
              checked={formData.show_results}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, show_results: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="allow_anonymous">Izinkan anonymous voting</Label>
            <Switch
              id="allow_anonymous"
              checked={formData.allow_anonymous}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, allow_anonymous: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Opsi Voting</CardTitle>
          <CardDescription>Tambahkan minimal 2 opsi</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {options.map((option, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={option.option_text}
                onChange={(e) => updateOption(index, e.target.value)}
                placeholder={`Opsi ${index + 1}`}
              />
              {options.length > 2 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeOption(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button variant="outline" onClick={addOption} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Opsi
          </Button>
        </CardContent>
      </Card>

    </div>
  );
};

export default VotingBuilder;
