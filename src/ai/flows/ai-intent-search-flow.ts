
'use server';
/**
 * @fileOverview A Hybrid Business Discovery Engine that intelligently ranks internal and external business results.
 *
 * - aiIntentSearch - A function that handles the AI intent search and ranking process.
 * - AIIntentSearchInput - The input type for the aiIntentSearch function.
 * - AIIntentSearchOutput - The return type for the aiIntentSearch function.
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

Output must be valid JSON.`,
});

const aiIntentSearchFlow = ai.defineFlow(
  {
    name: 'aiIntentSearchFlow',
    inputSchema: AIIntentSearchInputSchema,
    outputSchema: AIIntentSearchOutputSchema,
  },
  async (input) => {
    const filterSummary = input.filters 
      ? `Category: ${input.filters.category}, Location: ${input.filters.location}, Verified: ${input.filters.verifiedOnly}`
      : 'None';

    const { output } = await aiIntentSearchPrompt({
      ...input,
      filterSummary
    });
    return output!;
  }
);
