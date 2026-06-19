
'use server';
/**
 * @fileOverview AI Business Scout - Market intelligence flow.
 * 
 * - businessScout - Detects unmet demand and generates business opportunities.
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
    const { output } = await businessScoutPrompt(input);
    return output!;
  }
);
