
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
  
  const targetWordCount = length === 'short' ? '800-1200' : length === 'medium' ? '1500-2000' : '2500-3500';
  
  // Dynamic token allocation based on article length
  const getTokenAllocation = (length: string) => {
    switch (length) {
      case 'short': return 4000;
      case 'medium': return 6000;
      case 'long': return 8000;
      default: return 4000;
    }
  };

  const maxTokens = getTokenAllocation(length);
  
  const systemPrompt = `You are an expert SEO content writer. Create high-quality, SEO-optimized articles in Indonesian language that rank well on Google.

KEY SEO REQUIREMENTS:
- Target keyword density: 1-2% (natural placement)
- Use H1, H2, H3 structure properly
- Include LSI keywords related to main keyword
- Write compelling meta descriptions (150-160 characters)
- Create SEO-friendly titles (50-60 characters)
- Include FAQ section for featured snippets
- Optimize for readability and user engagement

CONTENT STRUCTURE:
1. Compelling headline with target keyword
2. Introduction with keyword in first paragraph
3. Multiple H2/H3 sections with subtopics
4. Bullet points and numbered lists
5. FAQ section (3-5 questions)
6. Conclusion with call-to-action

WRITING STYLE: ${tone}
TARGET AUDIENCE: ${audience}
WORD COUNT: ${targetWordCount} words

IMPORTANT: You MUST write approximately ${targetWordCount} words. This is crucial for SEO optimization.

Return response in JSON format with these exact fields:
{
  "title": "SEO-optimized title with keyword",
  "content": "Full article content in HTML format with proper headings",
  "excerpt": "Compelling 2-3 sentence summary",
  "seoTitle": "SEO title 50-60 characters",
  "metaDescription": "Meta description 150-160 characters",
  "focusKeyword": "Primary target keyword",
  "slug": "url-friendly-slug"
}`;

  const userPrompt = `Create an SEO-optimized article about: ${targetKeyword}

${title ? `Suggested title: ${title}` : ''}
${additionalKeywords && additionalKeywords.length > 0 ? `Also include these related keywords naturally: ${additionalKeywords.join(', ')}` : ''}
${outlinePoints ? `Include these points: ${outlinePoints.join(', ')}` : ''}

Requirements:
- Write in Indonesian language
- Focus on primary keyword: ${targetKeyword}
${additionalKeywords && additionalKeywords.length > 0 ? `- Naturally incorporate additional keywords: ${additionalKeywords.join(', ')}` : ''}
- Make it engaging and informative
- Include practical tips and actionable advice
- Add FAQ section for better SEO
- Ensure natural keyword placement without keyword stuffing
- CRITICAL: Write exactly ${targetWordCount} words for optimal SEO performance`;

  let articleData: any;

  if (provider === 'openai' && openAIApiKey) {
    console.log(`Using OpenAI GPT-5 with ${maxTokens} tokens for ${length} article`);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-2025-08-07',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_completion_tokens: maxTokens,
        // Note: temperature is not supported in GPT-5
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('OpenAI response received, processing...');
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from OpenAI');
    }
    
    const content = data.choices[0].message.content;
    
    // Parse JSON response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      articleData = JSON.parse(jsonMatch[0]);
    } else {
      console.error('Failed to find JSON in OpenAI response:', content);
      throw new Error('Failed to parse AI response - no valid JSON found');
    }
    
  } else if (provider === 'anthropic' && anthropicApiKey) {
    console.log(`Using Anthropic Claude Sonnet 4 with ${maxTokens} tokens for ${length} article`);
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${anthropicApiKey}`,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: maxTokens,
        messages: [
          {
            role: 'user',
            content: `${systemPrompt}\n\n${userPrompt}`
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Anthropic API error:', errorData);
      throw new Error(`Anthropic API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('Anthropic response received, processing...');
    
    if (!data.content || !data.content[0] || !data.content[0].text) {
      throw new Error('Invalid response format from Anthropic');
    }
    
    const content = data.content[0].text;
    
    // Parse JSON response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      articleData = JSON.parse(jsonMatch[0]);
    } else {
      console.error('Failed to find JSON in Anthropic response:', content);
      throw new Error('Failed to parse AI response - no valid JSON found');
    }
  } else {
    throw new Error(`No valid API key found for provider: ${provider}`);
  }

  // Validate article data
  if (!articleData || !articleData.title || !articleData.content) {
    throw new Error('Invalid article data generated by AI');
  }

  // Log word count for validation
  const wordCount = articleData.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  console.log(`Generated article word count: ${wordCount} words for ${length} article`);

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
    
    // Check if API keys are available
    if (request.provider === 'openai' && !openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }
    
    if (request.provider === 'anthropic' && !anthropicApiKey) {
      throw new Error('Anthropic API key not configured');
    }
    
    const article = await generateSEOOptimizedArticle(request);
    console.log('Generated article with cover image:', article.title);
    
    return new Response(JSON.stringify(article), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Error in ai-article-generator function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
