
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ArticleRequest {
  targetKeyword: string;
  additionalKeywords?: string[];
  title?: string;
  tone: 'professional' | 'casual' | 'educational';
  length: 'short' | 'medium' | 'long';
  audience: string;
  outlinePoints?: string[];
  provider: 'openai' | 'anthropic';
}

interface ArticleResponse {
  title: string;
  content: string;
  excerpt: string;
  seoTitle: string;
  metaDescription: string;
  focusKeyword: string;
  slug: string;
  coverImageUrl: string;
  coverImageAlt: string;
  wordCount?: number;
  targetWordCount?: number;
}

const searchCoverImage = async (keyword: string): Promise<{ imageUrl: string; altText: string }> => {
  try {
    const response = await fetch('https://mepznzrijuoyvjcmkspf.supabase.co/functions/v1/unsplash-image-search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: keyword,
        orientation: 'landscape',
        per_page: 5
      }),
    });

    if (!response.ok) {
      throw new Error(`Cover image search failed: ${response.status}`);
    }

    const data = await response.json();
    return {
      imageUrl: data.imageUrl,
      altText: data.altText
    };
  } catch (error) {
    console.error('Error searching cover image:', error);
    
    return {
      imageUrl: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=630&q=80',
      altText: 'Blog cover image'
    };
  }
};

// Helper function to count words in content
const countWords = (content: string): number => {
  return content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter((w: string) => w.length > 0).length;
};

const generateSEOOptimizedArticle = async (request: ArticleRequest): Promise<ArticleResponse> => {
  const { targetKeyword, additionalKeywords, title, tone, length, audience, outlinePoints, provider } = request;
  
  // EXACT word count targets
  const exactWordCounts = {
    short: 1000,
    medium: 1800,
    long: 3000
  };
  
  const targetWordsAim = exactWordCounts[length];
  const currentYear = new Date().getFullYear();
  
  // Precise section budgets
  const getSectionBudgets = (totalWords: number) => {
    const tldr = Math.floor(totalWords * 0.04); // 4% - TL;DR
    const intro = Math.floor(totalWords * 0.08); // 8% - Introduction
    const faq = Math.floor(totalWords * 0.15); // 15% - FAQ
    const conclusion = Math.floor(totalWords * 0.06); // 6% - Conclusion
    const takeaways = Math.floor(totalWords * 0.04); // 4% - Key Takeaways
    const mainSections = totalWords - tldr - intro - faq - conclusion - takeaways; // Remaining 63%
    
    return { tldr, intro, mainSections, faq, conclusion, takeaways, totalWords };
  };
  
  const budgets = getSectionBudgets(targetWordsAim);
  
  // INCREASED token budget for better word count achievement
  const maxTokens = Math.min(16000, Math.floor(targetWordsAim * 3 + 2000));
  
  console.log(`TARGET: EXACTLY ${targetWordsAim} words. Max tokens: ${maxTokens}. Section budgets:`, budgets);
  
  // AI Overview optimized content structure
  const getContentStructure = (totalWords: number, sectionBudgets: any) => {
    const h2SectionsCount = length === 'short' ? 5 : length === 'medium' ? 6 : 8;
    const h2WordsPer = Math.floor(sectionBudgets.mainSections / h2SectionsCount);
    const faqCount = length === 'short' ? 6 : length === 'medium' ? 8 : 10;
    const faqWordsPer = Math.floor(sectionBudgets.faq / faqCount);
    
    return `
STRUKTUR ARTIKEL ${totalWords} KATA (OPTIMASI AI OVERVIEW):

1. H1: Judul menarik dengan target keyword di awal

2. RINGKASAN (${sectionBudgets.tldr} kata):
   - Jawaban langsung untuk pertanyaan utama dalam 2-3 kalimat
   - Format: "[Keyword] adalah [definisi] yang membantu [target audience] untuk [manfaat utama]"
   - HARUS bisa berdiri sendiri sebagai jawaban lengkap

3. PENDAHULUAN (${sectionBudgets.intro} kata):
   - Kalimat pertama HARUS langsung menjawab: "Apa itu ${targetKeyword}?"
   - Hook yang menarik perhatian
   - Preview apa yang akan dibahas

4. ${h2SectionsCount} BAGIAN UTAMA H2 (masing-masing ${h2WordsPer} kata, total: ${sectionBudgets.mainSections} kata):
   - Setiap section dimulai dengan JAWABAN LANGSUNG (1-2 kalimat pertama)
   - Lalu penjelasan detail dengan contoh konkret
   - Include H3 sub-sections untuk breakdown detail
   - Gunakan bullet points untuk list 3+ items
   - Gunakan numbered list untuk proses/langkah-langkah
   - Akhiri dengan key takeaway atau tips praktis

5. PERTANYAAN UMUM (${faqCount} pertanyaan, total ${sectionBudgets.faq} kata, masing-masing ~${faqWordsPer} kata):
   - Format: "Apa/Bagaimana/Mengapa/Kapan [topic]?"
   - Jawaban langsung 30-50 kata di kalimat PERTAMA
   - Expand dengan 2-3 kalimat tambahan
   - Match "People Also Ask" search intent

6. POIN-POIN PENTING (${sectionBudgets.takeaways} kata):
   - 5-7 bullet points utama dari artikel
   - Masing-masing 1-2 kalimat actionable

7. KESIMPULAN (${sectionBudgets.conclusion} kata):
   - Ringkas main points
   - Call-to-action yang jelas

VERIFIKASI JUMLAH KATA:
- Ringkasan: ${sectionBudgets.tldr} kata
- Pendahuluan: ${sectionBudgets.intro} kata
- Bagian utama: ${sectionBudgets.mainSections} kata
- Pertanyaan Umum: ${sectionBudgets.faq} kata
- Poin-Poin Penting: ${sectionBudgets.takeaways} kata
- Kesimpulan: ${sectionBudgets.conclusion} kata
- TOTAL HARUS: ${totalWords} kata (tidak lebih, tidak kurang)`;
  };

  // AI Overview optimization rules with CRITICAL word count enforcement
  const h2SectionsCount = length === 'short' ? 5 : length === 'medium' ? 6 : 8;
  const h2WordsMin = Math.floor(budgets.mainSections / h2SectionsCount);
  
  const aiOverviewRules = `You are an AI article writer specialized in Google AI Overview SEO.

⚠️ CRITICAL WORD COUNT RULE ⚠️
- You MUST write EXACTLY ${targetWordsAim} words - this is MANDATORY
- Articles shorter than ${Math.floor(targetWordsAim * 0.9)} words will be REJECTED
- Each H2 section MUST have at least ${h2WordsMin} words
- Write COMPREHENSIVE, DETAILED explanations - NOT summaries

You MUST follow these rules:
1. Answer the main keyword directly in the first paragraph (1–2 sentences).
2. Use clear and rigid structure with H1, H2, and H3 headings.
3. Write comprehensive paragraphs with detailed explanations and examples.
4. Use neutral, factual, and informative tone.
5. Avoid promotional language, hype, or subjective claims.
6. Include bullet points for features, benefits, or lists.
7. Always include FAQ section with detailed Q&A (50-60 words per answer).
8. Ensure each FAQ answer can stand alone as a complete response.
9. Optimize content for extraction by Google AI Overview.
10. Write ENTIRELY in Indonesian language - ALL headings MUST be in Indonesian:
    - Use "Ringkasan" (NOT "TL;DR", "Summary", or "TL;DR / RINGKASAN")
    - Use "Pendahuluan" (NOT "Introduction")
    - Use "Pertanyaan Umum" (NOT "FAQ")
    - Use "Poin-Poin Penting" (NOT "Key Takeaways")
    - Use "Kesimpulan" (NOT "Conclusion")`;

  const systemPrompt = `${aiOverviewRules}

⚠️ MANDATORY WORD COUNT: ${targetWordsAim} WORDS ⚠️
- This is NOT optional - you MUST hit this target
- Minimum acceptable: ${Math.floor(targetWordsAim * 0.9)} words
- Count: Introduction (${budgets.intro}w) + Main Sections (${budgets.mainSections}w) + FAQ (${budgets.faq}w) + Conclusion (${budgets.conclusion}w) = ${targetWordsAim}w
- If your response is too short, ADD MORE DETAIL to each section

${getContentStructure(targetWordsAim, budgets)}

WRITING STYLE: ${tone}
TARGET AUDIENCE: ${audience}

Return response in JSON format:
{
  "title": "SEO title dengan keyword di awal (50-60 chars)",
  "content": "Full article in HTML format with proper H1, H2, H3",
  "excerpt": "2-3 sentence summary for AI Overview",
  "seoTitle": "SEO title 50-60 characters",
  "metaDescription": "Meta description 140-160 chars",
  "focusKeyword": "Primary keyword",
  "slug": "url-friendly-slug"
}`;

  const faqCount = length === 'short' ? 6 : length === 'medium' ? 8 : 10;
  
  const userPrompt = `Write a COMPREHENSIVE article about: ${targetKeyword}

${title ? `Title: ${title}` : ''}
${additionalKeywords && additionalKeywords.length > 0 ? `Include keywords: ${additionalKeywords.join(', ')}` : ''}
${outlinePoints && outlinePoints.length > 0 ? `Cover these points: ${outlinePoints.join(', ')}` : ''}

⚠️ CRITICAL REQUIREMENTS:
- EXACTLY ${targetWordsAim} words (NOT ${Math.floor(targetWordsAim * 0.5)}, NOT ${Math.floor(targetWordsAim * 0.8)}, but EXACTLY ${targetWordsAim})
- Write DETAILED explanations for each section - this is NOT a summary
- Each main H2 section: minimum ${h2WordsMin} words with examples and details
- FAQ: ${faqCount} questions with 50-60 word comprehensive answers each
- Indonesian language
- Data/statistics from ${currentYear}

DO NOT write a short summary. Write a FULL, COMPREHENSIVE article with detailed explanations.`;

  let articleData: any;

  // Model configurations
  const openAIModels: Record<string, { model: string; useNewParams: boolean }> = {
    'gpt-4o': { model: 'gpt-4o', useNewParams: false },
    'gpt-5-mini': { model: 'gpt-5-mini-2025-08-07', useNewParams: true },
    'gpt-5': { model: 'gpt-5-2025-08-07', useNewParams: true },
  };

  const anthropicModels: Record<string, string> = {
    'claude-sonnet-4': 'claude-sonnet-4-5',
    'claude-sonnet-3.5': 'claude-3-5-sonnet-20241022',
  };

  // Check if it's an OpenAI model
  if (openAIModels[provider]) {
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const modelConfig = openAIModels[provider];
    console.log('Calling OpenAI with model:', modelConfig.model, 'maxTokens:', maxTokens);

    const body: any = {
      model: modelConfig.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      response_format: { type: 'json_object' },
    };

    // GPT-4o uses old params (max_tokens, temperature), GPT-5 series uses new params
    if (modelConfig.useNewParams) {
      body.max_completion_tokens = maxTokens;
    } else {
      body.max_tokens = maxTokens;
      body.temperature = 0.7; // Increased from 0.4 for more elaborative writing
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log('OpenAI response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API Error:', response.status, errorData);
      throw new Error(`OpenAI API error: ${response.status} - ${errorData?.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content || '';

    try {
      articleData = JSON.parse(content);
    } catch (_e) {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Failed to parse AI response');
      }
      articleData = JSON.parse(jsonMatch[0]);
    }

    // Log word count for OpenAI responses
    const wordCount = countWords(articleData.content);
    console.log(`OpenAI generated article word count: ${wordCount}, target: ${targetWordsAim} words`);
    
  } else if (anthropicModels[provider]) {
    if (!anthropicApiKey) {
      throw new Error('Anthropic API key not configured');
    }

    const modelName = anthropicModels[provider];
    console.log('Calling Anthropic with model:', modelName, 'maxTokens:', Math.min(maxTokens, 8000));

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${anthropicApiKey}`,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: modelName,
        max_tokens: Math.min(maxTokens, 8000),
        messages: [
          {
            role: 'user',
            content: `${systemPrompt}\n\n${userPrompt}`
          }
        ],
        temperature: 0.7,
      }),
    });

    console.log('Anthropic response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Anthropic API Error:', response.status, errorData);
      throw new Error(`Anthropic API error: ${response.status} - ${errorData?.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const content = data.content?.[0]?.text || '';
    
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      articleData = JSON.parse(jsonMatch[0]);
      const wordCount = countWords(articleData.content);
      console.log(`Anthropic generated article word count: ${wordCount}, target: ${targetWordsAim} words`);
    } else {
      throw new Error('Failed to parse AI response');
    }
  } else {
    throw new Error(`Unknown model/provider: ${provider}. Valid options: gpt-4o, gpt-5-mini, gpt-5, claude-sonnet-4, claude-sonnet-3.5`);
  }

  // Calculate actual word count
  const actualWordCount = countWords(articleData.content);

  // Search for cover image based on the target keyword
  console.log('Searching cover image for keyword:', targetKeyword);
  const coverImage = await searchCoverImage(targetKeyword);
  
  console.log(`Generated article: "${articleData.title}" - ${actualWordCount}/${targetWordsAim} words`);
  
  return {
    ...articleData,
    coverImageUrl: coverImage.imageUrl,
    coverImageAlt: coverImage.altText,
    wordCount: actualWordCount,
    targetWordCount: targetWordsAim
  };
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('AI Article Generator called');
    
    const request: ArticleRequest = await req.json();
    console.log('Request:', request);
    
    // Validate required fields
    if (!request.targetKeyword || !request.tone || !request.length || !request.provider) {
      throw new Error('Missing required fields: targetKeyword, tone, length, provider');
    }
    
    const article = await generateSEOOptimizedArticle(request);
    console.log('Generated article with cover image:', article.title);
    
    return new Response(JSON.stringify(article), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Error in ai-article-generator function:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
