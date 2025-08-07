// address-insights.ts
'use server';

/**
 * @fileOverview An AI agent that provides logistical insights for a given address.
 *
 * - addressInsights - A function that handles the address insights process.
 * - AddressInsightsInput - The input type for the addressInsights function.
 * - AddressInsightsOutput - The return type for the addressInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AddressInsightsInputSchema = z.object({
  address: z.string().describe('The address to analyze for logistical challenges.'),
});
export type AddressInsightsInput = z.infer<typeof AddressInsightsInputSchema>;

const AddressInsightsOutputSchema = z.object({
  insights: z.string().describe('Logistical challenges associated with the address.'),
});
export type AddressInsightsOutput = z.infer<typeof AddressInsightsOutputSchema>;

export async function addressInsights(input: AddressInsightsInput): Promise<AddressInsightsOutput> {
  return addressInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'addressInsightsPrompt',
  input: {schema: AddressInsightsInputSchema},
  output: {schema: AddressInsightsOutputSchema},
  prompt: `You are an expert logistics analyst. Your task is to identify potential logistical challenges associated with a given address.

  Address: {{{address}}}

  Consider factors such as narrow streets, loading dock limitations, accessibility for large vehicles, potential traffic congestion, and any other relevant logistical issues.
  Provide a concise summary of the identified challenges.
  `,
});

const addressInsightsFlow = ai.defineFlow(
  {
    name: 'addressInsightsFlow',
    inputSchema: AddressInsightsInputSchema,
    outputSchema: AddressInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
