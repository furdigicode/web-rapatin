import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, ArrowDown, ArrowUp, Loader2, Plus, Trash2, Wand2 } from 'lucide-react';
import RichTextField from '@/components/admin/RichTextField';

import { useToast } from '@/hooks/use-toast';
import {
  DraftQuestion,
  SurveyFormData,
  SurveyQuestionType,
  defaultSurveyFormData,
  questionTypeLabels,
} from '@/types/SurveyTypes';
import {
  generateSurveySlug,
  newQuestionKey,
  parseMarkdownSurvey,
} from '@/utils/markdownSurveyParser';

interface SurveyBuilderProps {
  surveyId: string | null;
  onSaveSuccess: () => void;
  onCancel: () => void;
}

const MARKDOWN_PLACEHOLDER = `# Survei Kepuasan Pengguna
Bantu kami meningkatkan layanan Rapatin.

## Profil
1. Nama perusahaan Anda (text) *
2. Seberapa sering Anda mengadakan meeting online? (radio)
   - Setiap hari
   - Beberapa kali seminggu
   - Sebulan sekali

## Penilaian
3. Seberapa puas Anda dengan Rapatin? (skala 1-5) *
4. Fitur yang paling sering Anda pakai (checkbox)
   - Rekaman cloud
   - Laporan peserta
   - Breakout room
5. Saran & masukan (paragraf)`;

const toDraft = (question: any): DraftQuestion => ({
  key: newQuestionKey(),
  id: question.id,
  section: question.section ?? null,
  question_text: question.question_text ?? '',
  question_type: (question.question_type ?? 'text') as SurveyQuestionType,
  is_required: !!question.is_required,
  options: Array.isArray(question.options) ? (question.options as string[]) : [],
  scale_min: question.scale_min ?? 1,
  scale_max: question.scale_max ?? 5,
});

const emptyQuestion = (): DraftQuestion => ({
  key: newQuestionKey(),
  section: null,
  question_text: '',
  question_type: 'text',
  is_required: false,
  options: [],
  scale_min: 1,
  scale_max: 5,
});

const SurveyBuilder: React.FC<SurveyBuilderProps> = ({ surveyId, onSaveSuccess, onCancel }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<SurveyFormData>(defaultSurveyFormData);
  const [questions, setQuestions] = useState<DraftQuestion[]>([]);
  const [markdown, setMarkdown] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!surveyId) return;
      setIsLoading(true);
      const { data: survey, error } = await supabase
        .from('surveys')
        .select('*')
        .eq('id', surveyId)
        .maybeSingle();

      if (error || !survey) {
        toast({ title: 'Gagal memuat survei', variant: 'destructive' });
        setIsLoading(false);
        return;
      }

      setFormData({
        title: survey.title,
        description: survey.description ?? '',
        slug: survey.slug,
        status: survey.status as SurveyFormData['status'],
        start_date: survey.start_date,
        end_date: survey.end_date,
        has_reward: survey.has_reward ?? false,
        reward_title: survey.reward_title ?? '',
        reward_code: survey.reward_code ?? '',
        reward_terms: survey.reward_terms ?? '',
      });

      setSlugTouched(true);

      const { data: questionRows } = await supabase
        .from('survey_questions')
        .select('*')
        .eq('survey_id', surveyId)
        .order('question_order', { ascending: true });

      setQuestions((questionRows ?? []).map(toDraft));
      setIsLoading(false);
    };
    load();
  }, [surveyId, toast]);

  const updateQuestion = (key: string, patch: Partial<DraftQuestion>) => {
    setQuestions((prev) => prev.map((q) => (q.key === key ? { ...q, ...patch } : q)));
  };

  const moveQuestion = (index: number, direction: -1 | 1) => {
    setQuestions((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const handleParseMarkdown = () => {
    const parsed = parseMarkdownSurvey(markdown);
    if (parsed.questions.length === 0) {
      toast({
        title: 'Tidak ada pertanyaan terdeteksi',
        description: 'Gunakan daftar bernomor untuk pertanyaan dan tanda "-" menjorok untuk pilihan.',
        variant: 'destructive',
      });
      return;
    }

    setFormData((prev) => ({
      ...prev,
      title: prev.title || parsed.title || '',
      description: prev.description || parsed.description || '',
      slug: slugTouched && prev.slug ? prev.slug : generateSurveySlug(parsed.title || prev.title || ''),
    }));
    setQuestions(parsed.questions);
    toast({
      title: `${parsed.questions.length} pertanyaan berhasil dibuat`,
      description: 'Periksa dan sesuaikan tipe pertanyaan bila perlu sebelum menyimpan.',
    });
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast({ title: 'Judul survei wajib diisi', variant: 'destructive' });
      return;
    }
    const slug = (formData.slug || generateSurveySlug(formData.title)).trim();
    if (!slug) {
      toast({ title: 'Slug survei wajib diisi', variant: 'destructive' });
      return;
    }
    const cleaned = questions
      .map((q) => ({ ...q, question_text: q.question_text.trim() }))
      .filter((q) => q.question_text);

    if (cleaned.length === 0) {
      toast({ title: 'Tambahkan minimal satu pertanyaan', variant: 'destructive' });
      return;
    }
    const invalidChoice = cleaned.find(
      (q) => (q.question_type === 'radio' || q.question_type === 'checkbox') && q.options.filter((o) => o.trim()).length < 2
    );
    if (invalidChoice) {
      toast({
        title: 'Pilihan jawaban kurang',
        description: `"${invalidChoice.question_text}" perlu minimal 2 pilihan.`,
        variant: 'destructive',
      });
      return;
    }

    if (formData.has_reward && !formData.reward_code.trim()) {
      toast({ title: 'Kode voucher wajib diisi', variant: 'destructive' });
      return;
    }


    setIsSaving(true);
    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        slug,
        status: formData.status,
        start_date: formData.start_date,
        end_date: formData.end_date,
        has_reward: formData.has_reward,
        reward_title: formData.has_reward ? formData.reward_title.trim() || null : null,
        reward_code: formData.has_reward ? formData.reward_code.trim() || null : null,
        reward_terms: formData.has_reward ? formData.reward_terms.trim() || null : null,
      };


      let savedId = surveyId;
      if (surveyId) {
        const { error } = await supabase.from('surveys').update(payload).eq('id', surveyId);
        if (error) throw error;
        const { error: deleteError } = await supabase
          .from('survey_questions')
          .delete()
          .eq('survey_id', surveyId);
        if (deleteError) throw deleteError;
      } else {
        const { data, error } = await supabase.from('surveys').insert(payload).select('id').single();
        if (error) throw error;
        savedId = data.id;
      }

      const { error: insertError } = await supabase.from('survey_questions').insert(
        cleaned.map((q, index) => ({
          survey_id: savedId!,
          section: q.section,
          question_text: q.question_text,
          question_type: q.question_type,
          is_required: q.is_required,
          options:
            q.question_type === 'radio' || q.question_type === 'checkbox'
              ? q.options.map((o) => o.trim()).filter(Boolean)
              : [],
          scale_min: q.question_type === 'scale' ? q.scale_min : 1,
          scale_max: q.question_type === 'scale' ? q.scale_max : 5,
          question_order: index,
        }))
      );
      if (insertError) throw insertError;

      toast({ title: surveyId ? 'Survei diperbarui' : 'Survei dibuat' });
      onSaveSuccess();
    } catch (error: any) {
      console.error('Save survey failed:', error);
      toast({
        title: 'Gagal menyimpan survei',
        description: error?.message?.includes('duplicate')
          ? 'Slug sudah dipakai survei lain.'
          : error?.message,
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Button variant="ghost" onClick={onCancel}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {surveyId ? 'Simpan Perubahan' : 'Simpan Survei'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            Import dari Markdown
          </CardTitle>
          <CardDescription>
            Tempel markdown survei, lalu breakdown otomatis menjadi pertanyaan. Penanda tipe:
            {' '}(text), (paragraf), (radio), (checkbox), (skala 1-5). Tambahkan * untuk wajib.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder={MARKDOWN_PLACEHOLDER}
            className="min-h-[220px] font-mono text-sm"
          />
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="secondary" onClick={handleParseMarkdown}>
              Breakdown Pertanyaan
            </Button>
            <Button type="button" variant="ghost" onClick={() => setMarkdown(MARKDOWN_PLACEHOLDER)}>
              Isi contoh
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pengaturan Survei</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="survey-title">Judul</Label>
              <Input
                id="survey-title"
                value={formData.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    title,
                    slug: slugTouched ? prev.slug : generateSurveySlug(title),
                  }));
                }}
                placeholder="Survei Kepuasan Pengguna"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="survey-slug">Slug (URL)</Label>
              <Input
                id="survey-slug"
                value={formData.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setFormData((prev) => ({ ...prev, slug: generateSurveySlug(e.target.value) }));
                }}
                placeholder="survei-kepuasan-pengguna"
              />
              <p className="text-xs text-muted-foreground">
                URL publik: rapatin.id/survei/{formData.slug || 'slug-survei'}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="survey-description">Deskripsi</Label>
            <Textarea
              id="survey-description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Penjelasan singkat tujuan survei"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, status: value as SurveyFormData['status'] }))
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
            <div className="space-y-2">
              <Label htmlFor="survey-start">Mulai (opsional)</Label>
              <Input
                id="survey-start"
                type="datetime-local"
                value={formData.start_date ? formData.start_date.slice(0, 16) : ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    start_date: e.target.value ? new Date(e.target.value).toISOString() : null,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="survey-end">Berakhir (opsional)</Label>
              <Input
                id="survey-end"
                type="datetime-local"
                value={formData.end_date ? formData.end_date.slice(0, 16) : ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    end_date: e.target.value ? new Date(e.target.value).toISOString() : null,
                  }))
                }
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Label htmlFor="survey-reward">Hadiah setelah mengisi survei</Label>
                <p className="text-xs text-muted-foreground">
                  Jika aktif, responden menerima kode voucher setelah mengirim jawaban.
                </p>
              </div>
              <Switch
                id="survey-reward"
                checked={formData.has_reward}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, has_reward: checked }))
                }
              />
            </div>

            {formData.has_reward && (
              <div className="space-y-4 rounded-md border border-dashed p-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="reward-title">Judul hadiah (opsional)</Label>
                    <Input
                      id="reward-title"
                      value={formData.reward_title}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, reward_title: e.target.value }))
                      }
                      placeholder="Voucher diskon 20%"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reward-code">Kode voucher</Label>
                    <Input
                      id="reward-code"
                      value={formData.reward_code}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, reward_code: e.target.value }))
                      }
                      placeholder="RAPATIN20"
                      className="font-mono"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Ketentuan hadiah</Label>
                  <RichTextField
                    value={formData.reward_terms}
                    onChange={(html) => setFormData((prev) => ({ ...prev, reward_terms: html }))}
                    placeholder="Tuliskan syarat & ketentuan penggunaan voucher"
                  />
                </div>
              </div>
            )}
          </div>

        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle>Pertanyaan</CardTitle>
            <CardDescription>{questions.length} pertanyaan</CardDescription>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => setQuestions((prev) => [...prev, emptyQuestion()])}
          >
            <Plus className="mr-2 h-4 w-4" />
            Tambah
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {questions.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Belum ada pertanyaan. Import dari markdown atau tambahkan manual.
            </p>
          )}

          {questions.map((question, index) => (
            <div key={question.key} className="rounded-lg border p-4 space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">#{index + 1}</Badge>
                  {question.section && <Badge variant="secondary">{question.section}</Badge>}
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => moveQuestion(index, -1)}
                    disabled={index === 0}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => moveQuestion(index, 1)}
                    disabled={index === questions.length - 1}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setQuestions((prev) => prev.filter((item) => item.key !== question.key))
                    }
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Pertanyaan</Label>
                <Input
                  value={question.question_text}
                  onChange={(e) => updateQuestion(question.key, { question_text: e.target.value })}
                  placeholder="Tulis pertanyaan"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Tipe</Label>
                  <Select
                    value={question.question_type}
                    onValueChange={(value) =>
                      updateQuestion(question.key, {
                        question_type: value as SurveyQuestionType,
                        options:
                          (value === 'radio' || value === 'checkbox') && question.options.length === 0
                            ? ['', '']
                            : question.options,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(questionTypeLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Bagian (opsional)</Label>
                  <Input
                    value={question.section ?? ''}
                    onChange={(e) =>
                      updateQuestion(question.key, { section: e.target.value || null })
                    }
                    placeholder="Nama bagian"
                  />
                </div>
                <div className="flex items-end gap-2 pb-2">
                  <Switch
                    id={`required-${question.key}`}
                    checked={question.is_required}
                    onCheckedChange={(checked) =>
                      updateQuestion(question.key, { is_required: checked })
                    }
                  />
                  <Label htmlFor={`required-${question.key}`}>Wajib dijawab</Label>
                </div>
              </div>

              {question.question_type === 'scale' && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Nilai minimum</Label>
                    <Input
                      type="number"
                      value={question.scale_min}
                      onChange={(e) =>
                        updateQuestion(question.key, { scale_min: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nilai maksimum</Label>
                    <Input
                      type="number"
                      value={question.scale_max}
                      onChange={(e) =>
                        updateQuestion(question.key, { scale_max: Number(e.target.value) })
                      }
                    />
                  </div>
                </div>
              )}

              {(question.question_type === 'radio' || question.question_type === 'checkbox') && (
                <div className="space-y-2">
                  <Separator />
                  <Label>Pilihan jawaban</Label>
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center gap-2">
                      <Input
                        value={option}
                        onChange={(e) => {
                          const next = [...question.options];
                          next[optionIndex] = e.target.value;
                          updateQuestion(question.key, { options: next });
                        }}
                        placeholder={`Pilihan ${optionIndex + 1}`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          updateQuestion(question.key, {
                            options: question.options.filter((_, i) => i !== optionIndex),
                          })
                        }
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      updateQuestion(question.key, { options: [...question.options, ''] })
                    }
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah pilihan
                  </Button>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default SurveyBuilder;
