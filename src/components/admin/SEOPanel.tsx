
import React, { useEffect, useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle2, 
  AlertCircle, 
  XCircle,
  Search,
  Link as LinkIcon,
  Tag
} from 'lucide-react';

interface SEOPanelProps {
  title: string;
  setTitle: (title: string) => void;
  slug: string;
  setSlug: (slug: string) => void;
  metaDescription: string;
  setMetaDescription: (desc: string) => void;
  focusKeyword: string;
  setFocusKeyword: (keyword: string) => void;
  content: string;
}

const SEOPanel: React.FC<SEOPanelProps> = ({
  title,
  setTitle,
  slug,
  setSlug,
  metaDescription,
  setMetaDescription,
  focusKeyword,
  setFocusKeyword,
  content
}) => {
  const [seoScore, setSeoScore] = useState(0);
  const [seoTitleLength, setSeoTitleLength] = useState(0);
  const [metaDescLength, setMetaDescLength] = useState(0);
  const [seoStatus, setSeoStatus] = useState<'good' | 'ok' | 'poor'>('poor');
  const [issues, setIssues] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  // Auto-generate slug from title
  useEffect(() => {
    if (title && !slug) {
      setSlug(generateSlug(title));
    }
  }, [title, slug, setSlug]);
  
  // Update SEO score when fields change
  useEffect(() => {
    setSeoTitleLength(title.length);
    setMetaDescLength(metaDescription.length);
    checkSEO();
  }, [title, metaDescription, focusKeyword, content]);
  
  // Generate slug from text
  const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
  };
  
  // Handle slug generation from title
  const handleSlugGenerate = () => {
    if (title) {
      setSlug(generateSlug(title));
    }
  };
  
  // Check SEO status and provide feedback
  const checkSEO = () => {
    let score = 0;
    const newIssues: string[] = [];
    const newSuggestions: string[] = [];
    
    // Check title
    if (title.length === 0) {
      newIssues.push("SEO title tidak boleh kosong");
    } else if (title.length < 30) {
      newSuggestions.push("SEO title terlalu pendek (minimal 30 karakter)");
      score += 5;
    } else if (title.length > 60) {
      newIssues.push("SEO title terlalu panjang (maksimal 60 karakter)");
      score += 5;
    } else {
      score += 30;
    }
    
    // Check meta description
    if (metaDescription.length === 0) {
      newIssues.push("Meta description tidak boleh kosong");
    } else if (metaDescription.length < 140) {
      newSuggestions.push("Meta description terlalu pendek (minimal 140 karakter untuk SEO optimal)");
      score += 5;
    } else if (metaDescription.length > 160) {
      newIssues.push("Meta description terlalu panjang (maksimal 160 karakter)");
      score += 5;
    } else {
      score += 30;
    }
    
    // Check focus keyword
    if (focusKeyword.length === 0) {
      newSuggestions.push("Tambahkan focus keyword");
    } else {
      score += 10;
      
      // Check keyword in title
      if (title.toLowerCase().includes(focusKeyword.toLowerCase())) {
        score += 10;
      } else {
        newSuggestions.push("Focus keyword tidak ditemukan di SEO title");
      }
      
      // Check keyword in meta description
      if (metaDescription.toLowerCase().includes(focusKeyword.toLowerCase())) {
        score += 10;
      } else {
        newSuggestions.push("Focus keyword tidak ditemukan di meta description");
      }
      
      // Check keyword in content
      if (content.toLowerCase().includes(focusKeyword.toLowerCase())) {
        score += 10;
      } else {
        newSuggestions.push("Focus keyword tidak ditemukan di konten artikel");
      }
    }
    
    // Set the score and status
    setSeoScore(score);
    
    if (score >= 70) {
      setSeoStatus('good');
    } else if (score >= 40) {
      setSeoStatus('ok');
    } else {
      setSeoStatus('poor');
    }
    
    setIssues(newIssues);
    setSuggestions(newSuggestions);
  };
  
  // Get status color
  const getStatusColor = () => {
    switch (seoStatus) {
      case 'good': return 'bg-green-500';
      case 'ok': return 'bg-yellow-400';
      case 'poor': return 'bg-red-500';
    }
  };
  
  // Get status icon
  const StatusIcon = () => {
    switch (seoStatus) {
      case 'good': return <CheckCircle2 className="text-green-500" />;
      case 'ok': return <AlertCircle className="text-yellow-400" />;
      case 'poor': return <XCircle className="text-red-500" />;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search size={18} />
          SEO Settings
        </CardTitle>
        <CardDescription>
          Optimize your article for search engines
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* SEO Score */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>SEO Score</Label>
            <div className="flex items-center gap-1.5">
              <StatusIcon />
              <span className="text-sm font-medium">{seoScore}%</span>
            </div>
          </div>
          <Progress value={seoScore} className={getStatusColor()} />
        </div>
        
        {/* SEO Title */}
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
            <Label htmlFor="seo-title" className="text-sm font-medium">SEO Title</Label>
            <span className={`text-xs font-medium ${
              seoTitleLength > 60 ? 'text-red-500' : (seoTitleLength < 30 ? 'text-yellow-500' : 'text-green-500')
            }`}>
              {seoTitleLength}/60
            </span>
          </div>
          <Input
            id="seo-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter SEO title"
            className={`w-full border ${
              seoTitleLength > 60 ? 'border-red-300' : (seoTitleLength < 30 ? 'border-yellow-300' : 'border-green-300')
            }`}
          />
        </div>
        
        {/* Slug */}
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <Label htmlFor="slug" className="flex items-center gap-2">
              <LinkIcon size={14} />
              Slug
            </Label>
            <button 
              onClick={handleSlugGenerate}
              className="text-xs text-primary hover:underline self-start sm:self-auto"
            >
              Generate from title
            </button>
          </div>
          
          {/* Desktop Layout */}
          <div className="hidden sm:flex items-center">
            <span className="px-3 py-2 bg-muted border-y border-l rounded-l-md text-muted-foreground text-sm">
              rapatin.id/blog/
            </span>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value.replace(/\s+/g, '-').toLowerCase())}
              className="rounded-l-none"
            />
          </div>
          
          {/* Mobile Layout */}
          <div className="sm:hidden space-y-2">
            <div className="text-sm text-muted-foreground px-3 py-2 bg-muted rounded-md border">
              rapatin.id/blog/
            </div>
            <Input
              id="slug-mobile"
              value={slug}
              onChange={(e) => setSlug(e.target.value.replace(/\s+/g, '-').toLowerCase())}
              placeholder="article-slug"
              className="w-full"
            />
          </div>
        </div>
        
        {/* Meta Description */}
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
            <Label htmlFor="meta-description" className="text-sm font-medium">Meta Description</Label>
            <span className={`text-xs font-medium ${
              metaDescLength > 160 ? 'text-red-500' : (metaDescLength < 140 ? 'text-yellow-500' : 'text-green-500')
            }`}>
              {metaDescLength}/160
            </span>
          </div>
          <Textarea
            id="meta-description"
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            placeholder="Enter meta description"
            rows={3}
            className={`w-full border resize-none ${
              metaDescLength > 160 ? 'border-red-300' : (metaDescLength < 140 ? 'border-yellow-300' : 'border-green-300')
            }`}
          />
        </div>
        
        {/* Focus Keyword */}
        <div className="space-y-2">
          <Label htmlFor="focus-keyword" className="flex items-center gap-2">
            <Tag size={14} />
            Focus Keyword
          </Label>
          <Input
            id="focus-keyword"
            value={focusKeyword}
            onChange={(e) => setFocusKeyword(e.target.value)}
            placeholder="e.g. online meeting, video conference"
          />
        </div>
        
        {/* Google Snippet Preview */}
        <div className="space-y-2 pt-2">
          <Label className="text-sm font-medium">Google Search Preview</Label>
          <div className="border p-3 sm:p-4 rounded-md space-y-1 bg-white max-w-full overflow-hidden">
            <div className="text-blue-600 text-sm sm:text-base font-medium leading-tight break-words">
              {title || 'SEO Title'}
            </div>
            <div className="text-green-700 text-xs sm:text-sm break-all">
              rapatin.id/blog/{slug || 'article-slug'}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              <div className="break-words" style={{
                display: '-webkit-box',
                WebkitLineClamp: window.innerWidth < 640 ? 3 : 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {metaDescription || 'Meta description will appear here. Make sure to write a compelling description that encourages users to click.'}
              </div>
            </div>
          </div>
        </div>
        
        {/* SEO Issues */}
        {issues.length > 0 && (
          <div className="space-y-2 pt-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <XCircle size={16} className="text-red-500" />
              Issues to fix
            </Label>
            <ul className="text-sm space-y-1 text-red-600">
              {issues.map((issue, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="min-w-4">•</span>
                  <span>{issue}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* SEO Suggestions */}
        {suggestions.length > 0 && (
          <div className="space-y-2 pt-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <AlertCircle size={16} className="text-yellow-500" />
              Suggestions
            </Label>
            <ul className="text-sm space-y-1 text-yellow-600">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="min-w-4">•</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SEOPanel;
