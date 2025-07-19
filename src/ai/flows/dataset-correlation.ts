'use server';

/**
 * @fileOverview This file contains the Genkit flow for correlating new environmental datasets
 * with existing visualizations and statistical insights.
 *
 * - correlateDatasets - A function that handles the dataset correlation process.
 * - CorrelateDatasetsInput - The input type for the correlateDatasets function.
 * - CorrelateDatasetsOutput - The return type for the correlateDatasets function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CorrelateDatasetsInputSchema = z.object({
  newDatasetDescription: z
    .string()
    .describe('Description of the new environmental dataset added.'),
  existingVisualizationsDescription: z
    .string()
    .describe('Description of the existing visualizations.'),
  existingStatisticalInsightsDescription: z
    .string()
    .describe('Description of the existing statistical insights.'),
});
export type CorrelateDatasetsInput = z.infer<typeof CorrelateDatasetsInputSchema>;

const CorrelateDatasetsOutputSchema = z.object({
  insights: z
    .string()
    .describe(
      'Insights on how the new dataset correlates with existing visualizations and statistical insights.'
    ),
  suggestedUpdates: z
    .string()
    .describe(
      'Suggested updates to visualizations and statistical insights based on the new dataset.'
    ),
});
export type CorrelateDatasetsOutput = z.infer<typeof CorrelateDatasetsOutputSchema>;

export async function correlateDatasets(input: CorrelateDatasetsInput): Promise<CorrelateDatasetsOutput> {
  return correlateDatasetsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'correlateDatasetsPrompt',
  input: {schema: CorrelateDatasetsInputSchema},
  output: {schema: CorrelateDatasetsOutputSchema},
  prompt: `You are an AI assistant helping data scientists understand the impact of new environmental datasets.

You will receive a description of a new environmental dataset, as well as descriptions of existing visualizations and statistical insights.

Your task is to analyze how the new dataset correlates with the existing visualizations and statistical insights, and suggest updates to the visualizations and insights accordingly.

New Dataset Description: {{{newDatasetDescription}}}

Existing Visualizations Description: {{{existingVisualizationsDescription}}}

Existing Statistical Insights Description: {{{existingStatisticalInsightsDescription}}}

Correlation Insights:
Suggested Updates: `,
});

const correlateDatasetsFlow = ai.defineFlow(
  {
    name: 'correlateDatasetsFlow',
    inputSchema: CorrelateDatasetsInputSchema,
    outputSchema: CorrelateDatasetsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
