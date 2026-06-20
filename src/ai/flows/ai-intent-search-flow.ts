'use server';
/**
 * @fileOverview A Hybrid Business Discovery Engine that intelligently ranks internal and external business results.
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
    lat: z.number().optional().describe('User current latitude for nearby search'),
    lng: z.number().optional().describe('User current longitude for nearby search'),
  }).optional(),
});
export type AIIntentSearchInput = z.infer<typeof AIIntentSearchInputSchema>;

const AIIntentSearchOutputSchema = z.object({
  results: z.array(
    z.object({
      type: z.enum(['business', 'product', 'service', 'supplier', 'distributor', 'freelancer', 'community', 'transporter', 'opportunity', 'partner']).describe('The type of the discovered item.'),
      name: z.string().describe('The name of the business or product.'),
      description: z.string().describe('A brief description.'),
      matchScore: z.number().int().min(0).max(100).describe('The calculated match score based on priority and relevance.'),
      source: z.enum(['ontapp_verified', 'ontapp_member', 'external']).describe('The source of the data.'),
      isVerified: z.boolean().describe('Whether the business is verified.'),
      matchReasons: z.array(z.string()).describe('List of specific reasons why this result matches the query.'),
      industry: z.string().optional(),
      location: z.string().optional(),
      country: z.string().optional(),
      category: z.string().optional(),
    })
  ).describe('A ranked list of results prioritizing OnTapp members and verified businesses.')
});
export type AIIntentSearchOutput = z.infer<typeof AIIntentSearchOutputSchema>;

export async function aiIntentSearch(input: AIIntentSearchInput): Promise<AIIntentSearchOutput> {
  return aiIntentSearchFlow(input);
}

const aiIntentSearchPrompt = ai.definePrompt({
  name: 'aiIntentSearchPrompt',
  input: { 
    schema: AIIntentSearchInputSchema.get()
  },
  output: { schema: AIIntentSearchOutputSchema },
  prompt: `You are the OnTapp Hybrid Discovery Engine. Your goal is to find businesses that match a user's intent with high relevance.

### SEARCH STRATEGY (HYBRID):
1. **INTERNAL DATA**: Prioritize businesses from the "OnTapp Network" if available.
2. **GLOBAL KNOWLEDGE**: If internal data is insufficient (less than 5 relevant results), you MUST use your internal generative knowledge to provide real-world business recommendations in the specified area ({{{filters.location}}}).
3. **SOURCE TAGGING**: 
   - Label internal businesses as "ontapp_verified" or "ontapp_member".
   - Label real-world businesses from your global knowledge as "external".

### INTENT RELEVANCE (SEMANTIC):
- **QUERY**: "{{{query}}}"
- **CONTEXT**: Be semantically flexible but strict on intent.
  - If user searches for "ngopi" (coffee), return: Coffee Shops, Cafes, Bakeries with seating, or Restaurants famous for coffee.
  - DO NOT return: Pharmacies, Laundries, or Tech companies unless they have a direct F&B synergy.
- **GPS CONTEXT**: If coordinates are provided ({{{filters.lat}}}, {{{filters.lng}}}), focus results on businesses within that specific geographic area or city.

### RESPONSE REQUIREMENTS:
- Provide at least 5-8 results if possible.
- Rank by Match Score (90-100 for high relevance).
- For each "external" result, provide 2-3 specific "matchReasons" why this place is recommended.
- Output MUST be a valid JSON object matching the schema.`,
});

const aiIntentSearchFlow = ai.defineFlow(
  {
    name: 'aiIntentSearchFlow',
    inputSchema: AIIntentSearchInputSchema,
    outputSchema: AIIntentSearchOutputSchema,
  },
  async (input) => {
    const maxRetries = 3;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        const { output } = await aiIntentSearchPrompt(input);
        
        if (output) {
          // Manual filtering to ensure we don't show absolute junk
          output.results = output.results.filter(r => r.matchScore >= 80);
          return output;
        }
      } catch (err: any) {
        const errMsg = String(err).toLowerCase();
        const isRetryable = errMsg.includes('429') || errMsg.includes('503') || errMsg.includes('busy') || errMsg.includes('unexpected response');
                            
        if (isRetryable && i < maxRetries - 1) {
          const delay = Math.pow(2, i) * 2000;
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        break;
      }
    }
    
    // Final UI Fallback if AI completely fails
    return {
      results: [
        {
          type: 'business',
          name: `Pencarian Terbatas: ${input.query}`,
          description: `AI saat ini mengalami trafik tinggi. Namun, kami merekomendasikan Anda untuk mengecek pusat bisnis di ${input.filters?.location || 'area sekitar Anda'} untuk kategori ${input.filters?.category || 'terkait'}.`,
          matchScore: 90,
          source: 'external',
          isVerified: false,
          matchReasons: ['Kesesuaian lokasi terdeteksi', 'Kategori populer di wilayah ini'],
          location: input.filters?.location || 'Lokasi Terdekat'
        }
      ]
    };
  }
);
