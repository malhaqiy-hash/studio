'use server';
/**
 * @fileOverview AI Translation Flow for the OnTapp Global Network.
 *
 * - translateText - A function that handles translating content between languages.
 * - TranslateInput - The input type for the translate function.
 * - TranslateOutput - The return type for the translate function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TranslateInputSchema = z.object({
  text: z.string().describe('The text to be translated.'),
  targetLanguage: z.string().describe('The target language code (e.g., "id", "ja", "en").'),
});
export type TranslateInput = z.infer<typeof TranslateInputSchema>;

const TranslateOutputSchema = z.object({
  translatedText: z.string().describe('The translated version of the text.'),
  detectedLanguage: z.string().describe('The language detected in the original text.'),
});
export type TranslateOutput = z.infer<typeof TranslateOutputSchema>;

export async function translateText(input: TranslateInput): Promise<TranslateOutput> {
  return translateFlow(input);
}

const translatePrompt = ai.definePrompt({
  name: 'translatePrompt',
  input: { schema: TranslateInputSchema },
  output: { schema: TranslateOutputSchema },
  prompt: `You are an expert polyglot translator for the OnTapp B2B Network.
Your task is to translate the provided business text into the target language while maintaining the professional tone and industry-specific terminology.

Target Language: {{{targetLanguage}}}
Original Text: {{{text}}}

Provide the translated text and identify the source language. Output MUST be valid JSON.`,
});

const translateFlow = ai.defineFlow(
  {
    name: 'translateFlow',
    inputSchema: TranslateInputSchema,
    outputSchema: TranslateOutputSchema,
  },
  async (input) => {
    let lastError;
    const maxRetries = 3;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        const { output } = await translatePrompt(input);
        if (output) return output;
      } catch (err: any) {
        lastError = err;
        const errMsg = String(err).toLowerCase();
        const isRetryable = errMsg.includes('429') || errMsg.includes('503') || errMsg.includes('busy') || errMsg.includes('quota');
        
        if (isRetryable && i < maxRetries - 1) {
          const delay = Math.pow(2, i) * 1500;
          await new Promise(r => setTimeout(r, delay));
          continue;
        }
        break;
      }
    }
    
    console.error('Translation flow failed:', lastError);
    throw new Error('Gagal menerjemahkan teks. Layanan sedang sangat sibuk. Silakan coba lagi nanti.');
  }
);