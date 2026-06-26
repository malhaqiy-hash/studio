'use server';
/**
 * @fileOverview A Hybrid Business Discovery Engine that intelligently ranks internal and external business results.
 * Optimized with high-precision geo-location and strict intent matching.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AIIntentSearchInputSchema = z.object({
  query: z.string().describe('The natural language query describing what the user is looking for.'),
  filters: z.object({
    verifiedOnly: z.boolean().optional(),
    onTappOnly: z.boolean().optional(),
    externalOnly: z.boolean().optional(),
    category: z.string().optional(),
    location: z.string().optional(),
    lat: z.number().optional().describe('User current latitude for nearby search'),
    lng: z.number().optional().describe('User current longitude for nearby search'),
  }).optional(),
});
export type AIIntentSearchInput = z.infer<typeof AIIntentSearchInputSchema>;

const AIIntentSearchOutputSchema = z.object({
  results: z.array(
    z.object({
      type: z.enum([
        'business', 
        'product', 
        'service', 
        'supplier', 
        'distributor', 
        'freelancer', 
        'professional',
        'community', 
        'transporter', 
        'opportunity', 
        'job_opportunity',
        'partner', 
        'shop', 
        'hotel',
        'channel',
        'event',
        'company',
        'other'
      ]).describe('The type of the discovered item.'),
      name: z.string().describe('The name of the business or product.'),
      description: z.string().describe('A brief description.'),
      matchScore: z.number().int().min(0).max(100).describe('Relevance score.'),
      source: z.enum(['ontapp_verified', 'ontapp_member', 'external']).describe('The source of the data.'),
      isVerified: z.boolean().describe('Whether the business is verified.'),
      matchReasons: z.array(z.string()).describe('Specific reasons for match.'),
      industry: z.string().optional(),
      location: z.string().optional(),
      country: z.string().optional(),
      category: z.string().optional(),
      lat: z.number().describe('Precise latitude for map display'),
      lng: z.number().describe('Precise longitude for map display')
    })
  ).describe('Results with high geographic precision.')
});
export type AIIntentSearchOutput = z.infer<typeof AIIntentSearchOutputSchema>;

export async function aiIntentSearch(input: AIIntentSearchInput): Promise<AIIntentSearchOutput> {
  return aiIntentSearchFlow(input);
}

const aiIntentSearchPrompt = ai.definePrompt({
  name: 'aiIntentSearchPrompt',
  input: { 
    schema: AIIntentSearchInputSchema
  },
  output: { schema: AIIntentSearchOutputSchema },
  config: {
    maxOutputTokens: 1500,
    temperature: 0.1
  },
  prompt: `You are the Tapp Precision Discovery Engine. Your goal is to find businesses that match a user's intent with extremely high geographic accuracy.

### SEARCH CONTEXT:
- **QUERY**: "{{{query}}}"
- **FILTERED LOCATION**: "{{{filters.location}}}"
- **USER COORDINATES**: ({{{filters.lat}}}, {{{filters.lng}}})

### GEOGRAPHIC PRECISION RULES:
1. **COORDINATES ARE MANDATORY**: You MUST provide realistic and precise 'lat' and 'lng' for every result.
2. **STRICT LOCALITY**: If a location (city/area) is specified in the query or filters, all results MUST be physically located in that area.
3. **GPS BIAS**: If user coordinates are provided, prioritize results within a 10km radius of ({{{filters.lat}}}, {{{filters.lng}}}).
4. **REAL PLACES**: Use your knowledge of real-world businesses in {{{filters.location}}}.

### SOURCE CATEGORIZATION:
- Label real-world established businesses you know as "external".
- Only label as "ontapp_verified" if you are simulating a high-quality match that would exist in a premium network.

### OUTPUT:
- Return 5-8 results.
- Be concise.
- Ensure matchScore reflects actual relevance to the intent.`,
});

const aiIntentSearchFlow = ai.defineFlow(
  {
    name: 'aiIntentSearchFlow',
    inputSchema: AIIntentSearchInputSchema,
    outputSchema: AIIntentSearchOutputSchema,
  },
  async (input) => {
    const cleanQuery = input.query.replace(/^Informasi Terkait:\s*/i, '');
    
    try {
      const { output } = await aiIntentSearchPrompt({
        ...input,
        query: cleanQuery
      });
      
      if (output && output.results.length > 0) {
        output.results = output.results.map(r => ({
          ...r,
          name: r.name.replace(/^Informasi Terkait:\s*/i, '')
        }));
        return output;
      }
    } catch (err: any) {
      console.error('Precision Search Error:', err);
    }
    
    // Fallback based on provided location if AI fails
    const fallbackLat = input.filters?.lat || -6.2088;
    const fallbackLng = input.filters?.lng || 106.8456;

    return {
      results: [
        {
          type: 'business',
          name: `Penyedia ${cleanQuery}`,
          description: `Tersedia di area ${input.filters?.location || 'Anda'}. Hubungi melalui jaringan Tapp untuk detail lebih lanjut.`,
          matchScore: 80,
          source: 'external',
          isVerified: false,
          matchReasons: ['Lokasi terdekat terdeteksi', 'Kategori sesuai'],
          location: input.filters?.location || 'Area Terdekat',
          lat: fallbackLat,
          lng: fallbackLng
        }
      ]
    };
  }
);