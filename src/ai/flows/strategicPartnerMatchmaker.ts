'use server';
/**
 * @fileOverview A strategic partner matchmaking AI agent.
 * This file defines the Genkit flow for identifying potential strategic partners based on a business profile.
 *
 * - strategicPartnerMatchmaker: The main function to call the AI flow.
 * - StrategicPartnerMatchmakerInput: The input type definition for the flow.
 * - StrategicPartnerMatchmakerOutput: The output type definition for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const StrategicPartnerMatchmakerInputSchema = z.object({
  companyName: z.string().describe('The name of the business seeking partners.'),
  industry: z.string().describe('The industry of the business.'),
  description: z.string().describe('A detailed description of the business, its operations, and value proposition.'),
  productsServicesOffered: z.array(z.string()).describe('A list of products or services offered by the business.'),
  targetMarket: z.string().describe('The primary target market or audience of the business.'),
  strategicGoals: z.array(z.string()).describe('Key strategic goals the business aims to achieve through partnerships (e.g., market expansion, new product development, cost reduction).'),
  idealPartnerCriteria: z.string().describe('Specific criteria or characteristics the business is looking for in a strategic partner (e.g., "distributors in Europe", "software developers for a mobile app", "suppliers of organic raw materials").')
});
export type StrategicPartnerMatchmakerInput = z.infer<typeof StrategicPartnerMatchmakerInputSchema>;

const PartnerSuggestionSchema = z.object({
  partnerName: z.string().describe("The name of the suggested strategic partner."),
  partnerType: z.string().describe("The type of partner (e.g., Supplier, Distributor, Collaborator, Service Provider, Investor)."),
  compatibilityScore: z.number().min(0).max(100).describe("A compatibility score from 0-100, indicating how well the partner aligns with the business's needs."),
  reasoning: z.string().describe("A brief explanation of why this partner is a good match, detailing the alignment with strategic goals and criteria.")
});

const StrategicPartnerMatchmakerOutputSchema = z.object({
  partners: z.array(PartnerSuggestionSchema).describe("A list of suggested strategic partners.")
});
export type StrategicPartnerMatchmakerOutput = z.infer<typeof StrategicPartnerMatchmakerOutputSchema>;

const strategicPartnerMatchmakerPrompt = ai.definePrompt({
  name: 'strategicPartnerMatchmakerPrompt',
  input: { schema: StrategicPartnerMatchmakerInputSchema },
  output: { schema: StrategicPartnerMatchmakerOutputSchema },
  prompt: `You are an expert business development consultant and strategic matchmaker. Your task is to analyze a given business profile and identify potential strategic partners.

Based on the provided business details, strategic goals, and ideal partner criteria, suggest a list of relevant partners. For each suggested partner, provide a name, their type, a compatibility score (0-100), and a concise reasoning explaining why they are a good match.

Business Profile:
Company Name: {{{companyName}}}
Industry: {{{industry}}}
Description: {{{description}}}
Products/Services Offered: {{#each productsServicesOffered}}- {{{this}}}
{{/each}}
Target Market: {{{targetMarket}}}
Strategic Goals: {{#each strategicGoals}}- {{{this}}}
{{/each}}
Ideal Partner Criteria: {{{idealPartnerCriteria}}}

Please provide at least 3-5 distinct strategic partner suggestions. Ensure the partner names are generic placeholders (e.g., "Global Logistics Inc.", "Innovate Solutions LLC") if specific real-world examples are not suitable, but the type and reasoning should be precise.
`
});

const strategicPartnerMatchmakerFlow = ai.defineFlow(
  {
    name: 'strategicPartnerMatchmakerFlow',
    inputSchema: StrategicPartnerMatchmakerInputSchema,
    outputSchema: StrategicPartnerMatchmakerOutputSchema
  },
  async (input) => {
    const { output } = await strategicPartnerMatchmakerPrompt(input);
    return output!;
  }
);

export async function strategicPartnerMatchmaker(input: StrategicPartnerMatchmakerInput): Promise<StrategicPartnerMatchmakerOutput> {
  return strategicPartnerMatchmakerFlow(input);
}
