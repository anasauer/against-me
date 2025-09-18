'use server';

/**
 * @fileOverview An AI agent that suggests personalized challenges to users.
 *
 * - suggestChallenges - A function that suggests challenges to a user.
 * - SuggestChallengesInput - The input type for the suggestChallenges function.
 * - SuggestChallengesOutput - The return type for the suggestChallenges function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestChallengesInputSchema = z.object({
  userPreferences: z
    .string()
    .describe('A description of the user preferences.'),
  knownDesires: z
    .string()
    .optional()
    .describe('Any known desires the user has for a gift or reward.'),
});
export type SuggestChallengesInput = z.infer<typeof SuggestChallengesInputSchema>;

const SuggestChallengesOutputSchema = z.object({
  challenges: z
    .array(z.string())
    .describe('An array of suggested challenges tailored to the user.'),
});
export type SuggestChallengesOutput = z.infer<typeof SuggestChallengesOutputSchema>;

export async function suggestChallenges(input: SuggestChallengesInput): Promise<SuggestChallengesOutput> {
  return suggestChallengesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestChallengesPrompt',
  input: {schema: SuggestChallengesInputSchema},
  output: {schema: SuggestChallengesOutputSchema},
  prompt: `You are a challenge suggestion AI. You will be given a description of a user's preferences, and any known desires they have for a gift or reward. You will then suggest a list of challenges that the user can complete to earn points in the Against me app.

User Preferences: {{{userPreferences}}}

Known Desires: {{{knownDesires}}}

Challenges:`,
});

const suggestChallengesFlow = ai.defineFlow(
  {
    name: 'suggestChallengesFlow',
    inputSchema: SuggestChallengesInputSchema,
    outputSchema: SuggestChallengesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
