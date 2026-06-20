'use server';
/**
 * @fileOverview AI Translation Flow for the OnTapp Global Network.
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
Translate the following business text into: {{{targetLanguage}}}

Original Text: {{{text}}}`,
});

const translateFlow = ai.defineFlow(
  {
    name: 'translateFlow',
    inputSchema: TranslateInputSchema,
    outputSchema: TranslateOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await translatePrompt(input);
      if (output) return output;
    } catch (err) {
      console.warn('Translation failed, returning original text.');
    }
    return {
      translatedText: input.text,
      detectedLanguage: 'unknown'
    };
  }
);