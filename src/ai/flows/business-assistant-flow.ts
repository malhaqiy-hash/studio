'use server';
/**
 * @fileOverview A B2B Strategic Business Consultant AI agent.
 * Optimized for cost with token limits and context windowing.
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
  config: {
    maxOutputTokens: 300, 
    temperature: 0.7
  },
  prompt: `You are an expert B2B strategic business consultant for the Tapp Global Network.
Your goal is to help users navigate the ecosystem, identify high-value strategic partners, and optimize their business pipeline.

User Query: {{{message}}}

Provide concise, professional, and actionable business advice in maximum 2-3 short paragraphs.`,
});

const businessAssistantFlow = ai.defineFlow(
  {
    name: 'businessAssistantFlow',
    inputSchema: BusinessAssistantInputSchema,
    outputSchema: BusinessAssistantOutputSchema,
  },
  async (input) => {
    const windowedHistory = input.history ? input.history.slice(-5) : [];
    
    let lastError;
    const maxRetries = 2;
    for (let i = 0; i < maxRetries; i++) {
      try {
        const { output } = await businessAssistantPrompt({
          ...input,
          history: windowedHistory
        });
        if (output) return { response: output! };
      } catch (err: any) {
        lastError = err;
        const errMsg = String(err).toLowerCase();
        const isRetryable = errMsg.includes('429') || errMsg.includes('503') || errMsg.includes('busy');
        
        if (isRetryable && i < maxRetries - 1) {
          await new Promise(r => setTimeout(r, 2000));
          continue;
        }
        break;
      }
    }
    return { 
      response: "Terima kasih atas pertanyaannya. Saat ini trafik AI sedang sangat tinggi. Secara umum, saya menyarankan Anda untuk terus memperluas jaringan di Tapp Hub. Silakan tanyakan kembali detailnya dalam beberapa saat." 
    };
  }
);
