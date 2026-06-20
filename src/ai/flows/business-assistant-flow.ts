'use server';
/**
 * @fileOverview A B2B Strategic Business Consultant AI agent.
 *
 * - businessAssistant - A function that handles strategic business advice.
 * - BusinessAssistantInput - The input type for the businessAssistant function.
 * - BusinessAssistantOutput - The return type for the businessAssistant function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MessageSchema = z.object({
  role: z.enum(['user', 'model', 'system']),
  content: z.string(),
});

const BusinessAssistantInputSchema = z.object({
  history: z.array(MessageSchema).optional().describe('Previous message history.'),
  message: z.string().describe('The current user message or query.'),
});
export type BusinessAssistantInput = z.infer<typeof BusinessAssistantInputSchema>;

const BusinessAssistantOutputSchema = z.object({
  response: z.string().describe('The AI response text.'),
});
export type BusinessAssistantOutput = z.infer<typeof BusinessAssistantOutputSchema>;

export async function businessAssistant(input: BusinessAssistantInput): Promise<BusinessAssistantOutput> {
  return businessAssistantFlow(input);
}

const businessAssistantPrompt = ai.definePrompt({
  name: 'businessAssistantPrompt',
  input: { schema: BusinessAssistantInputSchema },
  output: { schema: z.string() },
  prompt: `You are an expert B2B strategic business consultant for the OnTapp Global Network.
Your goal is to help users navigate the ecosystem, identify high-value strategic partners, and optimize their business pipeline.

Context of the OnTapp Network:
- It is a discovery engine for products, services, and opportunities.
- It prioritizes verified members.
- It calculates match scores based on synergy and industry alignment.

Conversation History:
{{#each history}}
- {{role}}: {{{content}}}
{{/each}}

User Query: {{{message}}}

Provide concise, professional, and actionable business advice. If asked about technical features, focus on the business value they provide.`,
});

const businessAssistantFlow = ai.defineFlow(
  {
    name: 'businessAssistantFlow',
    inputSchema: BusinessAssistantInputSchema,
    outputSchema: BusinessAssistantOutputSchema,
  },
  async (input) => {
    let lastError;
    const maxRetries = 2;
    for (let i = 0; i < maxRetries; i++) {
      try {
        const { output } = await businessAssistantPrompt(input);
        if (output) return { response: output! };
      } catch (err: any) {
        lastError = err;
        if (i < maxRetries - 1) {
          await new Promise(r => setTimeout(r, 1500));
          continue;
        }
      }
    }
    console.error('Assistant flow failed:', lastError);
    throw new Error('Gagal merespon. AI sedang sibuk.');
  }
);