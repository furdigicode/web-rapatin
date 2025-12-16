
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
EXACT ARTICLE STRUCTURE FOR ${totalWords} WORDS (AI OVERVIEW OPTIMIZED):

1. H1: Compelling headline dengan target keyword di awal

2. TL;DR / RINGKASAN (${sectionBudgets.tldr} kata):
   - Jawaban langsung untuk pertanyaan utama dalam 2-3 kalimat
   - Format: "[Keyword] adalah [definisi] yang membantu [target audience] untuk [manfaat utama]"
   - HARUS bisa berdiri sendiri sebagai jawaban lengkap

3. INTRODUCTION (${sectionBudgets.intro} kata):
   - Kalimat pertama HARUS langsung menjawab: "Apa itu ${targetKeyword}?"
   - Hook yang menarik perhatian
   - Preview apa yang akan dibahas

4. ${h2SectionsCount} MAIN H2 SECTIONS (masing-masing ${h2WordsPer} kata, total: ${sectionBudgets.mainSections} kata):
   - Setiap section dimulai dengan DIRECT ANSWER (1-2 kalimat pertama)
   - Lalu penjelasan detail dengan contoh konkret
   - Include H3 sub-sections untuk breakdown detail
   - Gunakan bullet points untuk list 3+ items
   - Gunakan numbered list untuk proses/langkah-langkah
   - Akhiri dengan key takeaway atau tips praktis

5. FAQ SECTION (${faqCount} pertanyaan, total ${sectionBudgets.faq} kata, masing-masing ~${faqWordsPer} kata):
   - Format: "Apa/Bagaimana/Mengapa/Kapan [topic]?"
   - Jawaban langsung 30-50 kata di kalimat PERTAMA
   - Expand dengan 2-3 kalimat tambahan
   - Match "People Also Ask" search intent

6. KEY TAKEAWAYS (${sectionBudgets.takeaways} kata):
   - 5-7 bullet points utama dari artikel
   - Masing-masing 1-2 kalimat actionable

7. CONCLUSION (${sectionBudgets.conclusion} kata):
   - Ringkas main points
   - Call-to-action yang jelas

WORD COUNT VERIFICATION:
- TL;DR: ${sectionBudgets.tldr} kata
- Introduction: ${sectionBudgets.intro} kata
- Main sections: ${sectionBudgets.mainSections} kata
- FAQ: ${sectionBudgets.faq} kata
- Key Takeaways: ${sectionBudgets.takeaways} kata
- Conclusion: ${sectionBudgets.conclusion} kata
- TOTAL MUST BE: ${totalWords} kata (no more, no less)`;
  };

  // AI Overview optimization requirements
  const aiOverviewRequirements = `
🎯 GOOGLE AI OVERVIEW OPTIMIZATION (CRITICAL FOR RANKING):

1. DIRECT ANSWER FIRST (TL;DR Pattern):
   - Paragraf pertama HARUS langsung menjawab pertanyaan utama dalam 2-3 kalimat
   - Jangan basa-basi atau intro panjang
   - Format: "[Keyword] adalah... yang berfungsi untuk... dengan manfaat..."
   - Google AI Overview akan mengutip bagian ini

2. FRAGMENT-FRIENDLY STRUCTURE:
   - Setiap H2 section HARUS bisa berdiri sendiri sebagai jawaban lengkap
   - Format per section: Direct Answer → Penjelasan → Contoh konkret → Tips praktis
   - Gunakan subheading (H3) untuk breakdown detail
   - Setiap section harus "self-contained" untuk AI extraction

3. FEATURED SNIPPET OPTIMIZATION:
   - Sertakan definisi singkat di awal setiap section
   - Buat numbered lists untuk proses/langkah-langkah (1, 2, 3...)
   - Tambahkan bullet points untuk fitur/manfaat/tips
   - Sertakan tabel perbandingan jika relevan (HTML table)

4. E-E-A-T SIGNALS (Experience, Expertise, Authority, Trust):
   - Sertakan statistik dan data terkini (tahun ${currentYear})
   - Kutip sumber terpercaya atau best practices industri
   - Berikan expert insight atau perspektif profesional
   - Tambahkan "berdasarkan pengalaman" atau case study nyata
   - Gunakan frasa seperti "Menurut praktik terbaik...", "Data menunjukkan..."

5. NATURAL LANGUAGE & CONVERSATIONAL:
   - Tulis seperti menjelaskan ke teman yang bertanya
   - Hindari bahasa terlalu formal atau akademis
   - Gunakan "Anda" bukan "pembaca" atau "user"
   - Sertakan rhetorical questions untuk engagement
   - Hindari keyword stuffing - keyword harus natural

6. COMPREHENSIVE FAQ SECTION (People Also Ask):
   - Pertanyaan harus match search intent nyata
   - Jawaban langsung di kalimat pertama (max 40 kata)
   - Lalu expand dengan detail tambahan
   - Include questions seperti:
     * "Apa itu [keyword]?"
     * "Bagaimana cara [keyword]?"
     * "Apa manfaat [keyword]?"
     * "Apa perbedaan [keyword] dengan [alternatif]?"
     * "[Keyword] untuk siapa?"
`;

  const systemPrompt = `You are an expert SEO content writer specializing in creating articles optimized for Google AI Overview. Create high-quality, SEO-optimized articles in Indonesian language.

🚨 CRITICAL WORD COUNT REQUIREMENT:
- You MUST write EXACTLY ${targetWordsAim} words - NO MORE, NO LESS
- This is a HARD REQUIREMENT - count words as you write
- Do NOT stop writing until you reach EXACTLY ${targetWordsAim} words
- Each section must meet its exact word budget

${aiOverviewRequirements}

${getContentStructure(targetWordsAim, budgets)}

KEY SEO REQUIREMENTS:
- Target keyword density: 1-2% (natural placement)
- Use H1, H2, H3 structure properly
- Include LSI keywords related to main keyword
- Write compelling meta descriptions (140-160 characters)
- Create SEO-friendly titles (50-60 characters)
- Include comprehensive FAQ section for featured snippets

CONTENT DEPTH REQUIREMENTS:
- Include specific examples and real-world applications
- Add statistics, data, and research findings (${currentYear} data preferred)
- Provide step-by-step instructions or guides
- Include comparison tables or lists where relevant
- Add practical tips and best practices
- Use storytelling elements to engage readers
- Include industry insights and expert opinions

STRICT JSON OUTPUT RULES:
- Return ONLY a valid JSON object (no markdown, no code fences)
- Keys must match exactly the schema below
- All string values must be valid JSON strings

WRITING STYLE: ${tone}
TARGET AUDIENCE: ${audience}
EXACT WORD COUNT TARGET: ${targetWordsAim} words (STRICTLY ENFORCED)

Return response in JSON format with these exact fields:
{
  "title": "SEO-optimized title dengan keyword di awal (50-60 chars)",
  "content": "Full article content in HTML format dengan proper headings, dimulai dengan TL;DR section",
  "excerpt": "Compelling 2-3 sentence summary yang bisa dikutip AI Overview",
  "seoTitle": "SEO title 50-60 characters dengan keyword di awal",
  "metaDescription": "Meta description 140-160 chars dengan value proposition",
  "focusKeyword": "Primary target keyword",
  "slug": "url-friendly-slug"
}`;

  const userPrompt = `Create a comprehensive, AI Overview-optimized article about: ${targetKeyword}

${title ? `Suggested title: ${title}` : ''}
${additionalKeywords && additionalKeywords.length > 0 ? `Related keywords to include naturally: ${additionalKeywords.join(', ')}` : ''}
${outlinePoints && outlinePoints.length > 0 ? `Include these specific points in detail: ${outlinePoints.join(', ')}` : ''}

🚨 AI OVERVIEW OPTIMIZATION REQUIREMENTS:

1. OPENING/TL;DR (CRITICAL FOR AI OVERVIEW):
   - Kalimat pertama HARUS langsung menjawab: "Apa itu ${targetKeyword}?"
   - Kalimat kedua: manfaat utama
   - Kalimat ketiga: siapa yang membutuhkan
   - Bagian ini akan dikutip oleh Google AI Overview
   
2. STRUCTURE FOR AI EXTRACTION:
   - Setiap H2 section harus "self-contained" (bisa diambil AI sebagai jawaban)
   - Format setiap H2: Direct Answer → Explanation → Example → Tip
   - Gunakan bullet points untuk list 3+ items
   - Gunakan numbered list untuk proses/langkah

3. FAQ YANG MATCH SEARCH INTENT:
   - "Apa itu [keyword]?" → Definisi langsung
   - "Bagaimana cara [keyword]?" → Step-by-step numbered list
   - "Apa manfaat [keyword]?" → Bullet points
   - "Apa perbedaan [keyword] dengan [alternatif]?" → Comparison
   - "[Keyword] untuk siapa?" → Target audience explanation

4. DATA & CREDIBILITY:
   - Sertakan minimal 3-5 statistik/data (tahun ${currentYear})
   - Reference ke best practices atau standar industri
   - Gunakan frasa "Berdasarkan penelitian...", "Menurut praktik terbaik..."
   - Tambahkan case study atau contoh nyata

5. BAHASA INDONESIA YANG NATURAL:
   - Conversational tapi tetap profesional
   - Gunakan "Anda" untuk sapaan
   - Hindari jargon berlebihan, jelaskan istilah teknis
   - Tulis seperti menjelaskan ke teman

CRITICAL REQUIREMENTS:
- Write in Indonesian language
- MUST write EXACTLY ${targetWordsAim} words (count as you write!)
- Focus on primary keyword: ${targetKeyword}
- Make every section AI Overview-ready (self-contained answers)
- Include detailed examples and ${currentYear} statistics`;

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
      body.temperature = 0.4;
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
