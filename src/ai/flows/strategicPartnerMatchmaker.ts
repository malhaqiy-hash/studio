'use server';
/**
 * @fileOverview A strategic partner matchmaking AI agent.
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
  location: z.string().optional().describe('Geographic location of the business.'),
  businessSize: z.string().optional().describe('Scale of operations (e.g., Startup, SME, Enterprise).'),
  productCategories: z.array(z.string()).optional().describe('Categories of products handled.'),
  serviceCategories: z.array(z.string()).optional().describe('Categories of services provided.'),
  transactionHistory: z.string().optional().describe('Summary of previous business transactions.'),
  interests: z.array(z.string()).optional().describe('Business interests or expansion goals.'),
  userActivity: z.string().optional().describe('Recent platform activity or interactions.'),
  searchHistory: z.array(z.string()).optional().describe('Recent search terms used.'),
  opportunityRequirements: z.string().optional().describe('Specific requirements for current leads or deals.'),
  description: z.string().describe('Detailed business description.'),
  productsServicesOffered: z.array(z.string()).describe('List of products or services offered.'),
  targetMarket: z.string().describe('The primary target market.'),
  strategicGoals: z.array(z.string()).describe('Key strategic objectives.'),
  idealPartnerCriteria: z.string().describe('Specific criteria for the ideal partner.')
});
export type StrategicPartnerMatchmakerInput = z.infer<typeof StrategicPartnerMatchmakerInputSchema>;

const PartnerSuggestionSchema = z.object({
  partnerName: z.string().describe("Suggested strategic partner name."),
  partnerType: z.enum([
    'Buyer ↔ Seller', 
    'Buyer ↔ Supplier', 
    'Company ↔ Freelancer', 
    'Company ↔ Agency', 
    'Startup ↔ Investor', 
    'Distributor ↔ Manufacturer'
  ]).describe("The type of relationship identified."),
  compatibilityScore: z.number().min(0).max(100).describe("Symmetry score from 0-100."),
  matchReasons: z.array(z.string()).describe("Specific detailed reasons for the match."),
  recommendedActions: z.array(z.string()).describe("Tactic next steps (e.g., Schedule Meeting, Send Proposal)."),
  reasoning: z.string().describe("A brief narrative summary of the match.")
});

const StrategicPartnerMatchmakerOutputSchema = z.object({
  partners: z.array(PartnerSuggestionSchema).describe("List of high-synergy strategic partners.")
});
export type StrategicPartnerMatchmakerOutput = z.infer<typeof StrategicPartnerMatchmakerOutputSchema>;

const strategicPartnerMatchmakerPrompt = ai.definePrompt({
  name: 'strategicPartnerMatchmakerPrompt',
  input: { schema: StrategicPartnerMatchmakerInputSchema },
  output: { schema: StrategicPartnerMatchmakerOutputSchema },
  prompt: `You are the Koolink Network Intelligence Engine. Your goal is to identify high-value strategic matches based on a complex set of business parameters.

### Match Parameters to Analyze:
- **Industry & Location**: Geographic and sector alignment.
- **Product/Service Category**: Synergy in offerings.
- **Business Size & Transaction Size**: Compatibility in operation scale and financial volume.
- **Activity & Intent**: Matching current search history and interests with opportunity requirements.

### Relationship Types to Identify:
- Buyer ↔ Seller / Supplier
- Company ↔ Freelancer / Agency
- Startup ↔ Investor
- Distributor ↔ Manufacturer

### Output Requirements:
For each match, provide:
1. **Match Score (0-100)**: Based on overall synergy.
2. **Match Reasons**: 3-5 bullet points explaining the technical/business alignment (e.g., "Compatible production capacity", "Same export market").
3. **Recommended Next Action**: 2-3 specific steps to take (e.g., "Schedule Discovery Meeting", "Request Quotation", "Send Capability Statement").
4. **Reasoning**: A 1-2 sentence summary of why this connection is high-value.

Business Profile to Analyze:
Company: {{{companyName}}}
Industry: {{{industry}}} (Size: {{{businessSize}}})
Location: {{{location}}}
Current Needs: {{{opportunityRequirements}}}
Recent Activity: {{{userActivity}}}
Description: {{{description}}}
`
});

const strategicPartnerMatchmakerFlow = ai.defineFlow(
  {
    name: 'strategicPartnerMatchmakerFlow',
    inputSchema: StrategicPartnerMatchmakerInputSchema,
    outputSchema: StrategicPartnerMatchmakerOutputSchema
  },
  async (input) => {
    let lastError;
    const maxRetries = 3;
    for (let i = 0; i < maxRetries; i++) {
      try {
        const { output } = await strategicPartnerMatchmakerPrompt(input);
        if (output) return output;
      } catch (err: any) {
        lastError = err;
        const errMsg = String(err).toLowerCase();
        const isRetryable = errMsg.includes('429') || errMsg.includes('503') || errMsg.includes('busy') || errMsg.includes('quota');
        
        if (isRetryable && i < maxRetries - 1) {
          const delay = Math.pow(2, i) * 3000;
          await new Promise(r => setTimeout(r, delay));
          continue;
        }
        break;
      }
    }
    console.error('Matchmaker flow failed:', lastError);
    throw new Error('Gagal mencocokkan mitra. Layanan AI sedang sangat sibuk atau kuota tercapai.');
  }
);

export async function strategicPartnerMatchmaker(input: StrategicPartnerMatchmakerInput): Promise<StrategicPartnerMatchmakerOutput> {
  return strategicPartnerMatchmakerFlow(input);
}
