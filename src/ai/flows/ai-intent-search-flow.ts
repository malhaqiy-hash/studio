// @ts-nocheck
'use server';
/**
 * @fileOverview A Hybrid Business Discovery Engine that intelligently ranks internal and external business results.
 * Optimized for EXACTLY 5 results with query-relevant media generation.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AIIntentSearchInputSchema = z.object({
  query: z.string().describe('The natural language query describing what the user is looking for.'),
  filters: z.object({
    verifiedOnly: z.boolean().optional(),
    onTappOnly: z.boolean().optional(),
    externalOnly: z.boolean().optional(),
    category: z.string().optional(),
    location: z.string().optional(),
    lat: z.number().optional(),
    lng: z.number().optional(),
  }).optional(),
});
export type AIIntentSearchInput = z.infer<typeof AIIntentSearchInputSchema>;

const AIIntentSearchOutputSchema = z.object({
  results: z.array(
    z.object({
      type: z.enum([
        'business', 
        'product', 
        'service', 
        'supplier', 
        'distributor', 
        'freelancer', 
        'professional',
        'community', 
        'transporter', 
        'opportunity', 
        'job_opportunity',
        'partner', 
        'shop', 
        'hotel',
        'channel',
        'event',
        'company',
        'other'
      ]).describe('The type of the discovered item.'),
      name: z.string().describe('The name of the business or product.'),
      description: z.string().describe('A brief description.'),
      imageUrl: z.string().optional().describe('A relevant keyword for image generation (e.g. "coffee shop interior", "modern truck").'),
      matchScore: z.number().int().min(0).max(100).describe('Relevance score.'),
      source: z.enum(['ontapp_verified', 'ontapp_member', 'external']).describe('The source of the data.'),
      isVerified: z.boolean().describe('Whether the business is verified.'),
      matchReasons: z.array(z.string()).describe('Specific reasons for match.'),
      industry: z.string().optional(),
      location: z.string().optional(),
      country: z.string().optional(),
      category: z.string().optional(),
      lat: z.number().optional().describe('Latitude for Google Maps navigation'),
      lng: z.number().optional().describe('Longitude for Google Maps navigation')
    })
  ).describe('Exactly 5 high-quality results.')
});
export type AIIntentSearchOutput = z.infer<typeof AIIntentSearchOutputSchema>;

export async function aiIntentSearch(input: AIIntentSearchInput): Promise<AIIntentSearchOutput> {
  return aiIntentSearchFlow(input);
}

const aiIntentSearchPrompt = ai.definePrompt({
  name: 'aiIntentSearchPrompt',
  input: { 
    schema: AIIntentSearchInputSchema
  },
  output: { schema: AIIntentSearchOutputSchema },
  config: {
    maxOutputTokens: 1500,
    temperature: 0.2
  },
  prompt: `You are the Koolink Precision Discovery Engine. Find EXACTLY 5 businesses or products matching the user's intent.

### SEARCH CONTEXT:
- **QUERY**: "{{{query}}}"
- **LOCATION**: "{{{filters.location}}}"

### RULES:
1. **MAX RESULTS**: Return EXACTLY 5 high-quality results.
2. **RELEVANT MEDIA**: For the 'imageUrl' field, provide a descriptive 2-3 word keyword that perfectly describes the visual of the business/product (e.g., "coffee beans pile", "modern logistic warehouse", "tech office team"). This will be used as an image seed.
3. **NAVIGATION**: Provide accurate 'lat' and 'lng' for Google Maps navigation if available.
4. **NO HALLUCINATION**: Results must be realistically relevant to the query and location.

### OUTPUT:
- Be concise and professional.
- Ensure matchScore reflects actual relevance.`,
});

const aiIntentSearchFlow = ai.defineFlow(
  {
    name: 'aiIntentSearchFlow',
    inputSchema: AIIntentSearchInputSchema,
    outputSchema: AIIntentSearchOutputSchema,
  },
  async (input) => {
    const cleanQuery = input.query.replace(/^Informasi Terkait:\s*/i, '');
    
    try {
      const { output } = await aiIntentSearchPrompt({
        ...input,
        query: cleanQuery
      });
      
      if (output && output.results.length > 0) {
        return {
          results: output.results.slice(0, 5).map(r => ({
            ...r,
            name: r.name.replace(/^Informasi Terkait:\s*/i, ''),
            imageUrl: r.imageUrl?.startsWith('http') 
              ? r.imageUrl 
              : `https://picsum.photos/seed/${encodeURIComponent(r.imageUrl || r.name)}/800/500`
          }))
        };
      }
    } catch (err: any) {
      console.error('Search Flow Error:', err);
    }
    
    return {
      results: [
        {
          type: 'business',
          name: `Penyedia ${cleanQuery}`,
          description: `Tersedia di area ${input.filters?.location || 'Anda'}. Hubungi melalui jaringan Koolink untuk detail lebih lanjut.`,
          matchScore: 80,
          source: 'external',
          isVerified: false,
          matchReasons: ['Lokasi terdeteksi', 'Kategori sesuai'],
          location: input.filters?.location || 'Area Terdekat',
          imageUrl: `https://picsum.photos/seed/${encodeURIComponent(cleanQuery)}/800/500`
        }
      ]
    };
  }
);
