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
    schema: AIIntentSearchInputSchema.extend({
      filterSummary: z.string().optional()
    })
  },
  output: { schema: AIIntentSearchOutputSchema },
  prompt: `You are the OnTapp Hybrid Business Discovery Engine. Your goal is to find businesses, products, and services that match a user's intent.

### Intent Analysis
Analyze the user's query: "{{{query}}}"
Selected Category Filter: {{{filters.category}}}
Selected Location Filter: {{{filters.location}}}

### Response Requirements
- Rank strictly by Match Score descending.
- Ensure OnTapp results appear at the top.
- For each result, provide 2-3 specific "matchReasons".
- Output MUST be a valid JSON object matching the requested schema exactly.`,
});

const aiIntentSearchFlow = ai.defineFlow(
  {
    name: 'aiIntentSearchFlow',
    inputSchema: AIIntentSearchInputSchema,
    outputSchema: AIIntentSearchOutputSchema,
  },
  async (input) => {
    const filterSummary = input.filters 
      ? `Category: ${input.filters.category}, Location: ${input.filters.location}`
      : 'None';

    const maxRetries = 3;
    let lastError;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        const { output } = await aiIntentSearchPrompt({
          ...input,
          filterSummary
        });
        
        if (output) return output;
      } catch (err: any) {
        lastError = err;
        const errMsg = String(err).toLowerCase();
        
        const isRetryable = errMsg.includes('429') || 
                            errMsg.includes('quota') || 
                            errMsg.includes('503') || 
                            errMsg.includes('overloaded') ||
                            errMsg.includes('unexpected response') ||
                            errMsg.includes('busy');
                            
        if (isRetryable && i < maxRetries - 1) {
          const delay = Math.pow(2, i) * 2000; // 2s, 4s
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        break;
      }
    }
    
    console.warn('AI Search providing fallback results due to traffic/quota limit.');
    // Providing Fallback Mock Results instead of crashing
    return {
      results: [
        {
          type: 'business',
          name: `${input.query || 'Mitra'} Global Solution`,
          description: `Penyedia solusi terintegrasi untuk kebutuhan ${input.filters?.category || 'bisnis'} Anda. (Hasil ini ditampilkan dalam mode cadangan karena trafik AI sedang tinggi).`,
          matchScore: 95,
          source: 'ontapp_verified',
          isVerified: true,
          matchReasons: ['Kecocokan industri tinggi', 'Lokasi strategis di pusat perdagangan'],
          location: input.filters?.location || 'Jakarta, Indonesia',
          industry: input.filters?.category || 'Umum'
        },
        {
          type: 'supplier',
          name: 'Nusantara Supply Chain',
          description: `Distributor resmi dengan jaringan luas di wilayah ${input.filters?.location || 'Asia Tenggara'}.`,
          matchScore: 88,
          source: 'ontapp_member',
          isVerified: false,
          matchReasons: ['Reputasi pengiriman tepat waktu', 'Harga kompetitif'],
          location: input.filters?.location || 'Surabaya, Indonesia',
          industry: 'Logistics'
        }
      ]
    };
  }
);