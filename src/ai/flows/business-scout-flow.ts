'use server';
/**
 * @fileOverview AI Business Scout - Market intelligence flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const BusinessScoutInputSchema = z.object({
  context: z.string().describe('Platform context (recent searches, popular categories, opportunity statuses).'),
  userIndustry: z.string().optional().describe('Filter scouting for a specific industry.'),
});
export type BusinessScoutInput = z.infer<typeof BusinessScoutInputSchema>;

const ScoutReportSchema = z.object({
  marketGap: z.string().describe('A detected gap in the current business network.'),
  reasoning: z.string().describe('Why this gap exists based on current data signals.'),
  suggestedAction: z.string().describe('Immediate action a business can take to fill this gap.'),
  potentialValue: z.string().describe('Estimated financial or strategic value (e.g., "$10k - $50k" or "High Growth").'),
  confidenceScore: z.number().min(0).max(100).describe('AI confidence in this scouting report.'),
});

const BusinessScoutOutputSchema = z.object({
  reports: z.array(ScoutReportSchema).describe('List of actionable market intelligence reports.'),
});
export type BusinessScoutOutput = z.infer<typeof BusinessScoutOutputSchema>;

export async function businessScout(input: BusinessScoutInput): Promise<BusinessScoutOutput> {
  return businessScoutFlow(input);
}

const businessScoutPrompt = ai.definePrompt({
  name: 'businessScoutPrompt',
  input: { schema: BusinessScoutInputSchema },
  output: { schema: BusinessScoutOutputSchema },
  prompt: `You are the OnTapp AI Business Scout. Your mission is to analyze business signals and identify unmet market demand.

### Input Data Context:
{{{context}}}

### Scouting Strategy:
1. **Analyze Searches**: What are people looking for but not finding?
2. **Analyze Opportunities**: Which sectors have many "lost" deals due to lack of supply?
3. **Detect Demand**: Identify clusters of specific service/product requests.
4. **Generate Lead**: Create actionable business strategies for members.

### Output Requirements:
- Identify 3-5 specific "Market Gaps".
- Provide clear reasoning (e.g., "34% of searches for Organic Coffee Packaging result in no clicks").
- Suggest a tactical "Suggested Action".
- Estimate "Potential Value".

Focus on high-growth and emerging niches within the OnTapp network.`
});

const businessScoutFlow = ai.defineFlow(
  {
    name: 'businessScoutFlow',
    inputSchema: BusinessScoutInputSchema,
    outputSchema: BusinessScoutOutputSchema,
  },
  async (input) => {
    let lastError;
    const maxRetries = 3;
    for (let i = 0; i < maxRetries; i++) {
      try {
        const { output } = await businessScoutPrompt(input);
        if (output) return output;
      } catch (err: any) {
        lastError = err;
        const errMsg = String(err).toLowerCase();
        const isRetryable = errMsg.includes('429') || 
                            errMsg.includes('503') || 
                            errMsg.includes('quota') || 
                            errMsg.includes('busy') || 
                            errMsg.includes('unexpected response');
                            
        if (isRetryable && i < maxRetries - 1) {
          const delay = Math.pow(2, i) * 1500;
          console.warn(`Scout Engine retrying (Attempt ${i + 1}/${maxRetries})...`);
          await new Promise(r => setTimeout(r, delay));
          continue;
        }
        break;
      }
    }
    console.error('Business Scout Flow failed:', lastError);
    throw new Error('Gagal memuat laporan Scout. AI sedang sibuk. Silakan coba kembali.');
  }
);