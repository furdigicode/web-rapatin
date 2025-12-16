
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { BlogPostFormData } from '@/types/BlogTypes';

interface AIArticleGeneratorProps {
  onArticleGenerated: (articleData: Partial<BlogPostFormData>) => void;
  currentFormData: BlogPostFormData;
  selectedAuthorId?: string;
  onAuthorChange?: (authorId: string) => void;
}

interface GenerationRequest {
  targetKeyword: string;
  additionalKeywords?: string[];
  title?: string;
  tone: 'professional' | 'casual' | 'educational';
  length: 'short' | 'medium' | 'long';
  audience: string;
  outlinePoints?: string[];
  provider: 'openai' | 'anthropic';
}

const AIArticleGenerator: React.FC<AIArticleGeneratorProps> = ({ 
  onArticleGenerated, 
  currentFormData 
}) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationComplete, setGenerationComplete] = useState(false);
  const [generatedCoverImage, setGeneratedCoverImage] = useState<string>('');
  
  const [formData, setFormData] = useState<GenerationRequest>({
    targetKeyword: currentFormData.focusKeyword || '',
    additionalKeywords: [],
    title: currentFormData.title || '',
    tone: 'professional',
    length: 'medium',
    audience: '',
    outlinePoints: [],
    provider: 'openai'
  });
  
  const [outlineInput, setOutlineInput] = useState('');
  const [keywordInput, setKeywordInput] = useState('');

  const handleInputChange = (field: keyof GenerationRequest, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const addOutlinePoint = () => {
    if (outlineInput.trim()) {
      setFormData({
        ...formData,
        outlinePoints: [...(formData.outlinePoints || []), outlineInput.trim()]
      });
      setOutlineInput('');
    }
  };

  const removeOutlinePoint = (index: number) => {
    const newPoints = formData.outlinePoints?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, outlinePoints: newPoints });
  };

  const addKeyword = () => {
    if (keywordInput.trim()) {
      setFormData({
        ...formData,
        additionalKeywords: [...(formData.additionalKeywords || []), keywordInput.trim()]
      });
      setKeywordInput('');
    }
  };

  const removeKeyword = (index: number) => {
    const newKeywords = formData.additionalKeywords?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, additionalKeywords: newKeywords });
  };

  const generateArticle = async () => {
    if (!formData.targetKeyword || !formData.audience) {
      toast({
        variant: "destructive",
        title: "Data tidak lengkap",
        description: "Keyword target dan target audience harus diisi",
      });
      return;
    }

    setIsGenerating(true);
    setGenerationComplete(false);
    setGeneratedCoverImage('');

    try {
      console.log('Generating article with:', formData);
      
      const { data, error } = await supabase.functions.invoke('ai-article-generator', {
        body: formData
      });

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error('No data returned from AI service');
      }

      console.log('Generated article:', data);

      // Store generated cover image for preview
      if (data.coverImageUrl) {
        setGeneratedCoverImage(data.coverImageUrl);
      }

      // Map AI response to form data
      const articleData: Partial<BlogPostFormData> = {
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        seoTitle: data.seoTitle,
        metaDescription: data.metaDescription,
        focusKeyword: data.focusKeyword,
        slug: data.slug,
        coverImage: data.coverImageUrl || '', // Include the generated cover image
      };

      onArticleGenerated(articleData);
      setGenerationComplete(true);

      toast({
        title: "Artikel berhasil dibuat!",
        description: `Artikel "${data.title}" telah dibuat dengan optimasi SEO dan cover image`,
      });

    } catch (error: any) {
      console.error('Error generating article:', error);
      
      let errorMessage = 'Terjadi kesalahan saat membuat artikel';
      
      if (error.message?.includes('OpenAI API key')) {
        errorMessage = 'API key OpenAI belum dikonfigurasi';
      } else if (error.message?.includes('Anthropic API key')) {
        errorMessage = 'API key Anthropic belum dikonfigurasi';
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        variant: "destructive",
        title: "Gagal membuat artikel",
        description: errorMessage,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          AI Article Generator
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Generate artikel yang dioptimasi SEO dengan cover image otomatis menggunakan AI
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Cover Image Preview - Show user selected or AI generated */}
        {(currentFormData.coverImage || generatedCoverImage) && (
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              {currentFormData.coverImage ? 'Cover Image Terpilih' : 'Cover Image yang Dibuat AI'}
            </Label>
            <div className="relative">
              <img 
                src={currentFormData.coverImage || generatedCoverImage} 
                alt={currentFormData.coverImage ? 'Selected cover image' : 'Generated cover image'} 
                className="w-full h-48 object-cover rounded-md border shadow-sm"
              />
              <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
                {currentFormData.coverImage ? 'User Selected' : 'Auto Generated'}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {currentFormData.coverImage 
                ? 'Gambar yang Anda pilih dari Unsplash akan digunakan untuk artikel ini.' 
                : 'Cover image ini akan otomatis digunakan untuk artikel yang dibuat.'}
            </p>
          </div>
        )}

        {/* Target Keyword */}
        <div className="space-y-2">
          <Label htmlFor="targetKeyword">Keyword Target *</Label>
          <Input
            id="targetKeyword"
            value={formData.targetKeyword}
            onChange={(e) => handleInputChange('targetKeyword', e.target.value)}
            placeholder="Contoh: cara membuat website"
          />
        </div>

        {/* Additional Keywords */}
        <div className="space-y-2">
          <Label>Keywords Tambahan (Opsional)</Label>
          <div className="flex gap-2">
            <Input
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              placeholder="Tambahkan keyword pendukung"
              onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
            />
            <Button type="button" variant="outline" onClick={addKeyword}>
              Tambah
            </Button>
          </div>
          {formData.additionalKeywords && formData.additionalKeywords.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.additionalKeywords.map((keyword, index) => (
                <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeKeyword(index)}>
                  {keyword} ×
                </Badge>
              ))}
            </div>
          )}
        </div>
        
        {/* Optional Title */}
        <div className="space-y-2">
          <Label htmlFor="suggestedTitle">Judul yang Diinginkan (Opsional)</Label>
          <Input
            id="suggestedTitle"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Biarkan kosong untuk generate otomatis"
          />
        </div>

        {/* Settings Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Tone */}
          <div className="space-y-2">
            <Label>Tone Penulisan</Label>
            <Select value={formData.tone} onValueChange={(value) => handleInputChange('tone', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="educational">Educational</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Length */}
          <div className="space-y-2">
            <Label>Panjang Artikel</Label>
            <Select value={formData.length} onValueChange={(value) => handleInputChange('length', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short">Pendek (800-1200 kata)</SelectItem>
                <SelectItem value="medium">Sedang (1500-2000 kata)</SelectItem>
                <SelectItem value="long">Panjang (2500-3500 kata)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* AI Provider */}
          <div className="space-y-2">
            <Label>AI Provider</Label>
            <Select value={formData.provider} onValueChange={(value) => handleInputChange('provider', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">OpenAI GPT-5</SelectItem>
                <SelectItem value="anthropic">Claude Sonnet 4</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Target Audience */}
        <div className="space-y-2">
          <Label htmlFor="audience">Target Audience *</Label>
          <Input
            id="audience"
            value={formData.audience}
            onChange={(e) => handleInputChange('audience', e.target.value)}
            placeholder="Contoh: pemula yang ingin belajar programming"
          />
        </div>

        {/* Outline Points */}
        <div className="space-y-2">
          <Label>Poin-poin yang Ingin Dibahas (Opsional)</Label>
          <div className="flex gap-2">
            <Input
              value={outlineInput}
              onChange={(e) => setOutlineInput(e.target.value)}
              placeholder="Tambahkan poin outline"
              onKeyPress={(e) => e.key === 'Enter' && addOutlinePoint()}
            />
            <Button type="button" variant="outline" onClick={addOutlinePoint}>
              Tambah
            </Button>
          </div>
          {formData.outlinePoints && formData.outlinePoints.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.outlinePoints.map((point, index) => (
                <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeOutlinePoint(index)}>
                  {point} ×
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Generate Button */}
        <Button 
          onClick={generateArticle} 
          disabled={isGenerating}
          className="w-full"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sedang membuat artikel & cover image...
            </>
          ) : generationComplete ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Generate Artikel Baru
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Artikel + Cover Image
            </>
          )}
        </Button>

        {/* Status Info */}
        {generationComplete && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Artikel berhasil dibuat!</span>
            </div>
            <p className="text-xs text-green-600 mt-1">
              Artikel telah dioptimasi SEO dengan cover image otomatis dan siap untuk dipublikasikan. Periksa tab Konten untuk melihat hasil.
            </p>
          </div>
        )}

        {/* Enhanced SEO Tips */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h4 className="text-sm font-medium text-blue-800 mb-2">Fitur AI Generator:</h4>
          <ul className="text-xs text-blue-600 space-y-1">
            <li>• Artikel SEO-optimized dengan struktur H1, H2, H3 yang tepat</li>
            <li>• Cover image otomatis dari Unsplash berdasarkan keyword</li>
            <li>• Meta description dan SEO title yang dioptimasi</li>
            <li>• FAQ section untuk featured snippets Google</li>
            <li>• Konten dalam bahasa Indonesia yang engaging</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIArticleGenerator;
