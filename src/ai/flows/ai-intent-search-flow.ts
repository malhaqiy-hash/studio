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
    industry: z.string().optional(),
    location: z.string().optional(),
  }).optional(),
});
export type AIIntentSearchInput = z.infer<typeof AIIntentSearchInputSchema>;

const AIIntentSearchOutputSchema = z.object({
  results: z.array(
    z.object({
      type: z.enum(['business', 'product', 'service']).describe('The type of the discovered item.'),
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
  input: { schema: AIIntentSearchInputSchema },
  output: { schema: AIIntentSearchOutputSchema },
  prompt: `You are the OnTapp Hybrid Business Discovery Engine. Your goal is to find businesses, products, and services that match a user's intent, prioritizing OnTapp members.

### Intent Analysis
Analyze the user's query: "{{{query}}}"
Current Filters: {{#if filters}}{{{JSON.stringify filters}}}{{else}}None{{/if}}

### Ranking System (Mandatory)
Calculate a Match Score (0-100) using these weights:
- Internal OnTapp business: +50 points
- Verified OnTapp business: +20 points
- Matching industry: +20 points
- Matching location/country: +15 points
- Matching product/service: +15 points
- Profile completeness/reputation: +10-15 points
- External source: 0 points base score (rely solely on relevance)

### Data Simulation
Provide a mix of simulated internal OnTapp members and external businesses found on the web (directories, public databases).
- For internal results, use source: "ontapp_member" or "ontapp_verified".
- For external results, use source: "external".

### Response Requirements
- Rank strictly by Match Score descending.
- For each result, provide 2-3 specific "matchReasons" (e.g., "Verified coffee supplier", "Active on OnTapp this week").
- If it's an external result, describe it as a relevant business not yet on the platform.

Output must be valid JSON adhering to the schema.`,
});

const aiIntentSearchFlow = ai.defineFlow(
  {
    name: 'aiIntentSearchFlow',
    inputSchema: AIIntentSearchInputSchema,
    outputSchema: AIIntentSearchOutputSchema,
  },
  async (input) => {
    const { output } = await aiIntentSearchPrompt(input);
    return output!;
  }
);
