
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
    
    // Fallback to a default image
    return {
      imageUrl: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=630&q=80',
      altText: 'Blog cover image'
    };
  }
};

const generateSEOOptimizedArticle = async (request: ArticleRequest): Promise<ArticleResponse> => {
  const { targetKeyword, additionalKeywords, title, tone, length, audience, outlinePoints, provider } = request;
  
  // EXACT word count targets - NO RANGES
  const exactWordCounts = {
    short: 1000,
    medium: 1800,
    long: 3000
  };
  
  const targetWordsAim = exactWordCounts[length];
  
  // Precise section budgets that sum to exact target
  const getSectionBudgets = (totalWords: number) => {
    const intro = Math.floor(totalWords * 0.12); // 12%
    const faq = Math.floor(totalWords * 0.15); // 15% 
    const conclusion = Math.floor(totalWords * 0.08); // 8%
    const mainSections = totalWords - intro - faq - conclusion; // Remaining 65%
    
    return { intro, mainSections, faq, conclusion, totalWords };
  };
  
  const budgets = getSectionBudgets(targetWordsAim);
  
  // Enhanced token budget for exact word count achievement
  const maxTokens = Math.min(8000, Math.floor(targetWordsAim * 1.6 + 1200));
  
  console.log(`TARGET: EXACTLY ${targetWordsAim} words. Section budgets:`, budgets);
  
  // Enhanced content structure templates based on exact word counts
  const getContentStructure = (totalWords: number, sectionBudgets: any) => {
    const h2SectionsCount = length === 'short' ? 5 : length === 'medium' ? 6 : 8;
    const h2WordsPer = Math.floor(sectionBudgets.mainSections / h2SectionsCount);
    const faqCount = length === 'short' ? 6 : length === 'medium' ? 8 : 10;
    const faqWordsPer = Math.floor(sectionBudgets.faq / faqCount);
    
    return `
EXACT ARTICLE STRUCTURE FOR ${totalWords} WORDS:
1. H1: Compelling headline with target keyword
2. Introduction: EXACTLY ${sectionBudgets.intro} words with keyword in first paragraph
3. ${h2SectionsCount} main H2 sections: EXACTLY ${h2WordsPer} words each (total: ${sectionBudgets.mainSections} words)
4. FAQ section: ${faqCount} questions with EXACTLY ${faqWordsPer} words per answer (total: ${sectionBudgets.faq} words)
5. Conclusion: EXACTLY ${sectionBudgets.conclusion} words with call-to-action

WORD COUNT VERIFICATION:
- Introduction: ${sectionBudgets.intro} words
- Main sections: ${sectionBudgets.mainSections} words  
- FAQ: ${sectionBudgets.faq} words
- Conclusion: ${sectionBudgets.conclusion} words
- TOTAL MUST BE: ${totalWords} words (no more, no less)`;
  };

  const systemPrompt = `You are an expert SEO content writer. Create high-quality, SEO-optimized articles in Indonesian language that rank well on Google.

🚨 CRITICAL WORD COUNT REQUIREMENT - HARD STOP GUARDRAIL:
- You MUST write EXACTLY ${targetWordsAim} words - NO MORE, NO LESS
- This is a HARD REQUIREMENT - count words mentally as you write
- The article MUST reach exactly ${targetWordsAim} words total
- Do NOT stop writing until you reach EXACTLY ${targetWordsAim} words
- Each section must meet its exact word budget as specified below

KEY SEO REQUIREMENTS:
- Target keyword density: 1-2% (natural placement)
- Use H1, H2, H3 structure properly
- Include LSI keywords related to main keyword
- Write compelling meta descriptions (140-160 characters)
- Create SEO-friendly titles (50-60 characters)
- Include comprehensive FAQ section for featured snippets
- Optimize for readability and user engagement

${getContentStructure(targetWordsAim, budgets)}

EXACT SECTION WORD BUDGETS - MUST BE FOLLOWED:
- Introduction: EXACTLY ${budgets.intro} words
- Main H2 sections combined: EXACTLY ${budgets.mainSections} words
- FAQ section combined: EXACTLY ${budgets.faq} words  
- Conclusion: EXACTLY ${budgets.conclusion} words
- TOTAL: EXACTLY ${targetWordsAim} words

CONTENT DEPTH REQUIREMENTS:
- Include specific examples and real-world applications
- Add statistics, data, and research findings where relevant
- Provide step-by-step instructions or guides
- Include comparison tables or lists
- Add practical tips and best practices
- Use storytelling elements to engage readers
- Include industry insights and expert opinions

STRICT JSON OUTPUT RULES:
- Return ONLY a valid JSON object (no markdown, no code fences, no extra text)
- Keys must match exactly the schema below
- All string values must be valid JSON strings

WRITING STYLE: ${tone}
TARGET AUDIENCE: ${audience}
EXACT WORD COUNT TARGET: ${targetWordsAim} words (STRICTLY ENFORCED)

Return response in JSON format with these exact fields:
{
  "title": "SEO-optimized title with keyword",
  "content": "Full article content in HTML format with proper headings",
  "excerpt": "Compelling 2-3 sentence summary",
  "seoTitle": "SEO title 50-60 characters",
  "metaDescription": "Meta description 140-160 characters",
  "focusKeyword": "Primary target keyword",
  "slug": "url-friendly-slug"
}`;

  const userPrompt = `Create a comprehensive, detailed SEO-optimized article about: ${targetKeyword}

${title ? `Suggested title: ${title}` : ''}
${additionalKeywords && additionalKeywords.length > 0 ? `Also include these related keywords naturally: ${additionalKeywords.join(', ')}` : ''}
${outlinePoints ? `Include these specific points in detail: ${outlinePoints.join(', ')}` : ''}

CRITICAL REQUIREMENTS:
- Write in Indonesian language
- MUST write EXACTLY ${targetWordsAim} words (NON-NEGOTIABLE - count words as you write)
- Focus on primary keyword: ${targetKeyword}
${additionalKeywords && additionalKeywords.length > 0 ? `- Naturally incorporate additional keywords: ${additionalKeywords.join(', ')}` : ''}
- Make it comprehensive, engaging and highly informative
- Include detailed examples, case studies, and statistics
- Provide step-by-step guides and practical implementations
- Add comprehensive FAQ section (5+ detailed questions for ${length} articles)
- Include comparison tables, bullet points, and numbered lists
- Ensure natural keyword placement without keyword stuffing
- Write detailed explanations for each section - avoid surface-level content
- Include industry insights and expert perspectives

CONTENT DEPTH GUIDELINES:
- Each H2 section should be substantial (200+ words for medium articles)
- Include specific examples from real scenarios
- Provide actionable advice readers can implement immediately
- Add relevant statistics or data to support points
- Use storytelling elements to keep readers engaged`;

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
    console.log('Calling OpenAI with model:', modelConfig.model);

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
  } else if (anthropicModels[provider]) {
    if (!anthropicApiKey) {
      throw new Error('Anthropic API key not configured');
    }

    const modelName = anthropicModels[provider];
    console.log('Calling Anthropic with model:', modelName);

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
      const wordCount = articleData.content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter((w: string) => w.length > 0).length;
      console.log(`Generated article word count: ${wordCount}, target: EXACTLY ${targetWordsAim} words`);
    } else {
      throw new Error('Failed to parse AI response');
    }
  } else {
    throw new Error(`Unknown model/provider: ${provider}. Valid options: gpt-4o, gpt-5-mini, gpt-5, claude-sonnet-4, claude-sonnet-3.5`);
  }

  // Search for cover image based on the target keyword
  console.log('Searching cover image for keyword:', targetKeyword);
  const coverImage = await searchCoverImage(targetKeyword);
  
  return {
    ...articleData,
    coverImageUrl: coverImage.imageUrl,
    coverImageAlt: coverImage.altText
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
