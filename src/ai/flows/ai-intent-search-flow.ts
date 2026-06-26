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
- **USER CURRENT COORDINATES**: ({{{filters.lat}}}, {{{filters.lng}}})

### GEOGRAPHIC PRECISION RULES (CRITICAL):
1. **LOCATION PRECEDENCE**: If a city/area is specified in 'FILTERED LOCATION' or the 'QUERY' (e.g., "Yogyakarta", "Semarang"), you MUST ignore the 'USER CURRENT COORDINATES' if they are outside that city.
2. **COORDINATES MUST MATCH CITY**: Every result returned MUST have 'lat' and 'lng' that physically reside within the specified city/area.
3. **REALISTIC MAPPING**: Do not return generic city-center coordinates for all results. Provide realistic, distributed coordinates for different businesses within that city.
4. **NO HALLUCINATION OF LOCATION**: If the user asks for "Yogyakarta", do not return coordinates for Jakarta (-6.2088). Yogyakarta is approx -7.7956, 110.3695.

### SOURCE CATEGORIZATION:
- Label real-world established businesses you know as "external".
- Only label as "ontapp_verified" if you are simulating a high-quality match that would exist in a premium network.

### OUTPUT:
- Return 5-8 results.
- Be concise.
- Ensure matchScore reflects actual relevance to the intent.`,
});

const CITY_FALLBACKS: Record<string, {lat: number, lng: number}> = {
  "Yogyakarta": { lat: -7.7956, lng: 110.3695 },
  "Semarang": { lat: -6.9932, lng: 110.4203 },
  "Surabaya": { lat: -7.2575, lng: 112.7521 },
  "Bandung": { lat: -6.9175, lng: 107.6191 },
  "Jakarta": { lat: -6.2088, lng: 106.8456 },
  "Medan": { lat: 3.5952, lng: 98.6722 },
  "Makassar": { lat: -5.1476, lng: 119.4327 },
  "Bali": { lat: -8.4095, lng: 115.1889 },
  "Denpasar": { lat: -8.6705, lng: 115.2126 },
};

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
    
    // Fallback logic that respects the targeted location
    let fallbackLat = input.filters?.lat || -6.2088;
    let fallbackLng = input.filters?.lng || 106.8456;

    if (input.filters?.location) {
      for (const city in CITY_FALLBACKS) {
        if (input.filters.location.toLowerCase().includes(city.toLowerCase())) {
          fallbackLat = CITY_FALLBACKS[city].lat;
          fallbackLng = CITY_FALLBACKS[city].lng;
          break;
        }
      }
    }

    return {
      results: [
        {
          type: 'business',
          name: `Penyedia ${cleanQuery}`,
          description: `Tersedia di area ${input.filters?.location || 'Anda'}. Hubungi melalui jaringan Tapp untuk detail lebih lanjut.`,
          matchScore: 80,
          source: 'external',
          isVerified: false,
          matchReasons: ['Lokasi terdeteksi', 'Kategori sesuai'],
          location: input.filters?.location || 'Area Terdekat',
          lat: fallbackLat,
          lng: fallbackLng
        }
      ]
    };
  }
);
