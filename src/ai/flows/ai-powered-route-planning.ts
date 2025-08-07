// @fileOverview A route planning AI assistant.
//
// - aiPoweredRoutePlanning - A function that suggests efficient routes and vehicle assignments.
// - AiPoweredRoutePlanningInput - The input type for the aiPoweredRoutePlanning function.
// - AiPoweredRoutePlanningOutput - The return type for the aiPoweredRoutePlanning function.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiPoweredRoutePlanningInputSchema = z.object({
  pickupLocation: z.string().describe('The pickup location for the transport order.'),
  deliveryLocation: z.string().describe('The delivery location for the transport order.'),
  vehicleType: z.string().describe('The type of vehicle available for the transport order.'),
  cargoDescription: z.string().describe('A description of the cargo being transported.'),
  specialInstructions: z.string().optional().describe('Any special instructions for the transport order.'),
});
export type AiPoweredRoutePlanningInput = z.infer<typeof AiPoweredRoutePlanningInputSchema>;

const AiPoweredRoutePlanningOutputSchema = z.object({
  suggestedRoute: z.string().describe('A suggested route for the transport order.'),
  vehicleAssignment: z.string().describe('A recommended vehicle assignment for the transport order.'),
  estimatedTravelTime: z.string().describe('The estimated travel time for the transport order.'),
  potentialChallenges: z.string().describe('Any potential logistical challenges associated with the route or locations.'),
});
export type AiPoweredRoutePlanningOutput = z.infer<typeof AiPoweredRoutePlanningOutputSchema>;

export async function aiPoweredRoutePlanning(input: AiPoweredRoutePlanningInput): Promise<AiPoweredRoutePlanningOutput> {
  return aiPoweredRoutePlanningFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiPoweredRoutePlanningPrompt',
  input: {schema: AiPoweredRoutePlanningInputSchema},
  output: {schema: AiPoweredRoutePlanningOutputSchema},
  prompt: `You are an AI assistant specializing in transport planning and route optimization for a German Spedition.

You will be provided with information about a transport order, including the pickup and delivery locations, vehicle type, cargo description, and any special instructions.

Based on this information, you will suggest an efficient route, recommend a suitable vehicle assignment, estimate the travel time, and identify any potential logistical challenges.

Consider factors such as location-specific challenges, vehicle capabilities, and customer/contractor preferences to optimize the transport plan.

Pickup Location: {{{pickupLocation}}}
Delivery Location: {{{deliveryLocation}}}
Vehicle Type: {{{vehicleType}}}
Cargo Description: {{{cargoDescription}}}
Special Instructions: {{{specialInstructions}}}

Provide the suggested route, vehicle assignment, estimated travel time, and potential challenges in a clear and concise manner.
`,
});

const aiPoweredRoutePlanningFlow = ai.defineFlow(
  {
    name: 'aiPoweredRoutePlanningFlow',
    inputSchema: AiPoweredRoutePlanningInputSchema,
    outputSchema: AiPoweredRoutePlanningOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
