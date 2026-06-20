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

### CRITICAL REQUIREMENT: PRIORITIZATION
You MUST prioritize internal OnTapp results over external ones.
1. First, find or simulate highly relevant businesses that are "ontapp_verified" or "ontapp_member".
2. Only if internal results are insufficient or specific external data is highly relevant, provide results from "external" sources.

### Intent Analysis
Analyze the user's query: "{{{query}}}"
Selected Category Filter: {{{filters.category}}}
Selected Location Filter: {{{filters.location}}}

### Ranking System (Mandatory)
Calculate a Match Score (0-100) using these weights:
- Internal OnTapp Verified business: +50-60 points (Top Priority)
- Internal OnTapp Member: +30-40 points
- Matching Industry/Category: +20 points
- Matching Location: +15 points
- External source: 0 points base (rely solely on relevance, max score usually 70-80)

### Response Requirements
- Rank strictly by Match Score descending.
- Ensure OnTapp results appear at the top.
- For each result, provide 2-3 specific "matchReasons".
- Output MUST be a valid JSON object matching the requested schema exactly. Do not include markdown formatting or extra text.`,
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

    let lastError;
    const maxRetries = 5; // Increased to cover a longer quota reset window
    
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
        
        // Retry logic for common transient API errors and quota issues
        const isRetryable = errMsg.includes('429') || 
                            errMsg.includes('quota') || 
                            errMsg.includes('503') || 
                            errMsg.includes('overloaded') ||
                            errMsg.includes('unexpected response') ||
                            errMsg.includes('network') ||
                            errMsg.includes('timeout') ||
                            errMsg.includes('busy');
                            
        if (isRetryable && i < maxRetries - 1) {
          // Increased delay for exponential backoff: 3s, 6s, 12s, 24s...
          const delay = Math.pow(2, i) * 3000; 
          console.warn(`Attempt ${i + 1} for AI Search failed. Retrying in ${delay}ms... Reason: ${errMsg.substring(0, 50)}`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        break;
      }
    }
    
    console.error('AI Intent Search critically failed after all retries:', lastError);
    const errorDetail = String(lastError).includes('429') 
      ? 'Batas penggunaan AI tercapai karena trafik tinggi. Harap tunggu sekitar 60 detik sebelum mencari lagi.' 
      : 'Layanan AI sedang sangat sibuk atau terjadi gangguan jaringan global.';
      
    throw new Error(`Pencarian Terganggu: ${errorDetail}`);
  }
);