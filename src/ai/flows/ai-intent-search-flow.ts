'use server';
/**
 * @fileOverview An AI agent that analyzes natural language queries to intelligently search and rank matching businesses, products, and services.
 *
 * - aiIntentSearch - A function that handles the AI intent search process.
 * - AIIntentSearchInput - The input type for the aiIntentSearch function.
 * - AIIntentSearchOutput - The return type for the aiIntentSearch function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AIIntentSearchInputSchema = z.object({
  query: z.string().describe('The natural language query describing what the user is looking for (e.g., "a supplier for sustainable packaging in Europe").'),
});
export type AIIntentSearchInput = z.infer<typeof AIIntentSearchInputSchema>;

const AIIntentSearchOutputSchema = z.object({
  results: z.array(
    z.object({
      type: z.enum(['business', 'product', 'service']).describe('The type of the discovered item.'),
      name: z.string().describe('The name of the discovered item (business, product, or service).'),
      description: z.string().describe('A brief description of the item.'),
      relevanceScore: z.number().int().min(0).max(100).describe('A score indicating how relevant this item is to the user\'s query (0-100).'),
      industry: z.string().optional().describe('The industry or sector the item belongs to, if applicable.'),
      location: z.string().optional().describe('The geographical location associated with the item, if applicable.'),
    })
  ).describe('A list of businesses, products, or services that match the user\'s intent, ranked by relevance.')
});
export type AIIntentSearchOutput = z.infer<typeof AIIntentSearchOutputSchema>;

export async function aiIntentSearch(input: AIIntentSearchInput): Promise<AIIntentSearchOutput> {
  return aiIntentSearchFlow(input);
}

const aiIntentSearchPrompt = ai.definePrompt({
  name: 'aiIntentSearchPrompt',
  input: { schema: AIIntentSearchInputSchema },
  output: { schema: AIIntentSearchOutputSchema },
  prompt: `You are an AI assistant specializing in business discovery for the OnTapp network. Your task is to analyze a user's natural language query and generate a list of highly relevant businesses, products, or services that match the user's intent. For each result, provide its type (business, product, or service), a descriptive name, a brief description, a relevance score between 0 and 100, and optionally its industry and location.

The output must be a JSON array that strictly adheres to the provided schema, ordered by relevance score in descending order.

User Query: "{{{query}}}"`,
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
