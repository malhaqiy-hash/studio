'use server';
/**
 * @fileOverview AI Market Radar - Detects global business trends.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MarketRadarInputSchema = z.object({
  region: z.string().optional().describe('Filter by region.'),
});

const TrendSchema = z.object({
  industry: z.string(),
  growthScore: z.number().min(0).max(100),
  signal: z.enum(['Rising Demand', 'Saturation', 'Emerging Tech']),
  description: z.string(),
  suggestedPivots: z.array(z.string()),
  risingProducts: z.array(z.string()),
});

const MarketRadarOutputSchema = z.object({
  trends: z.array(TrendSchema),
  overallSentiment: z.string(),
});

export type MarketRadarOutput = z.infer<typeof MarketRadarOutputSchema>;

export async function getMarketRadar(region: string = 'Global'): Promise<MarketRadarOutput> {
  return marketRadarFlow({ region });
}

const marketRadarPrompt = ai.definePrompt({
  name: 'marketRadarPrompt',
  input: { schema: MarketRadarInputSchema },
  output: { schema: MarketRadarOutputSchema },
  prompt: `You are the OnTapp AI Market Radar. Analyze current global trade signals for the region: {{{region}}}.

### Task:
1. Detect 3-5 industries with high growth potential.
2. Identify specific products experiencing a surge in search intent.
3. Provide tactical "Suggested Pivots" for businesses in these sectors.
4. Set an overall market sentiment (e.g., "Bullish on Green Logistics").

Focus on actionable, non-obvious B2B intelligence.`
});

const marketRadarFlow = ai.defineFlow(
  {
    name: 'marketRadarFlow',
    inputSchema: MarketRadarInputSchema,
    outputSchema: MarketRadarOutputSchema,
  },
  async (input) => {
    let lastError;
    const maxRetries = 5;
    for (let i = 0; i < maxRetries; i++) {
      try {
        const { output } = await marketRadarPrompt(input);
        return output!;
      } catch (err: any) {
        lastError = err;
        const errMsg = String(err).toLowerCase();
        const isRetryable = errMsg.includes('429') || 
                            errMsg.includes('503') || 
                            errMsg.includes('quota') || 
                            errMsg.includes('busy') || 
                            errMsg.includes('unexpected response') ||
                            errMsg.includes('network');
                            
        if (isRetryable && i < maxRetries - 1) {
          const delay = Math.pow(2, i) * 2000;
          console.warn(`Market Radar retrying (Attempt ${i + 1}/${maxRetries}) due to: ${errMsg}`);
          await new Promise(r => setTimeout(r, delay));
          continue;
        }
        break;
      }
    }
    console.error('Market Radar Flow failed:', lastError);
    throw new Error('Gagal memuat Market Radar. AI sedang sibuk atau terjadi gangguan jaringan. Silakan coba kembali.');
  }
);