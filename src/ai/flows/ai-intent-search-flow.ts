'use server';
/**
 * @fileOverview A Hybrid Business Discovery Engine that intelligently ranks internal and external business results.
 * Optimized with token limits and fallback logic to handle server issues gracefully.
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
      type: z.enum(['business', 'product', 'service', 'supplier', 'distributor', 'freelancer', 'community', 'transporter', 'opportunity', 'partner', 'shop', 'hotel']).describe('The type of the discovered item.'),
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
    schema: AIIntentSearchInputSchema
  },
  output: { schema: AIIntentSearchOutputSchema },
  config: {
    maxOutputTokens: 500,
    temperature: 0.1
  },
  prompt: `You are the OnTapp Hybrid Discovery Engine. Your goal is to find businesses that match a user's intent with high relevance.

### SEARCH STRATEGY (HYBRID):
1. **INTERNAL DATA**: Prioritize businesses from the "OnTapp Network" if available.
2. **GLOBAL KNOWLEDGE**: If internal data is insufficient, use your generative knowledge for real-world recommendations in {{{filters.location}}}.
3. **SOURCE TAGGING**: 
   - Label internal as "ontapp_verified" or "ontapp_member".
   - Label generative as "external".

### INTENT RELEVANCE (STRICT):
- **QUERY**: "{{{query}}}"
- **STRICT MATCHING**: Only return businesses that directly match the core intent. If user asks for "coffee", DO NOT return "Pharmacy".
- **GPS**: If coordinates ({{{filters.lat}}}, {{{filters.lng}}}) are given, focus results within that specific area.

### COST OPTIMIZATION:
- Provide 5-8 results.
- Be extremely concise. No long descriptions. 
- Use brief match reasons.
- Output MUST be valid JSON.`,
});

const aiIntentSearchFlow = ai.defineFlow(
  {
    name: 'aiIntentSearchFlow',
    inputSchema: AIIntentSearchInputSchema,
    outputSchema: AIIntentSearchOutputSchema,
  },
  async (input) => {
    const maxRetries = 2; // Reduced to fit within typical server action timeouts
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        const { output } = await aiIntentSearchPrompt(input);
        
        if (output) {
          // Filter results for high relevance
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
    
    // Final UI Fallback - If AI is absolutely unavailable, return descriptive mock data for continuity
    return {
      results: [
        {
          type: 'business',
          name: `Layanan AI Sedang Padat: ${input.query}`,
          description: `Sistem AI OnTapp sedang mengalami beban tinggi. Kami merekomendasikan untuk mencoba pencarian manual melalui kategori di area ${input.filters?.location || 'terdekat'} Anda.`,
          matchScore: 100,
          source: 'external',
          isVerified: false,
          matchReasons: ['Limit kuota harian tercapai', 'Trafik server meningkat'],
          location: input.filters?.location || 'Area Terdekat'
        }
      ]
    };
  }
);
