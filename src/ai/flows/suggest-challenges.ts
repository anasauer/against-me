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
  suggestedReward: z
    .string()
    .optional()
    .describe('A specific reward suggested for completing the challenge.'),
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
  prompt: `You are a challenge suggestion AI for an app called "Against Me". You will be given a description of a user's preferences. You will then suggest a list of challenges that this user can complete to earn points.

If a specific reward is suggested, create challenges that are thematically related to that reward.

User Preferences: {{{userPreferences}}}

Suggested Reward: {{{suggestedReward}}}

Based on this, suggest creative and engaging challenges.`,
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
