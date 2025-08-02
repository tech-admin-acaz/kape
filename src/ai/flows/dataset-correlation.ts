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
    .describe('Descrição do novo conjunto de dados ambiental adicionado.'),
  existingVisualizationsDescription: z
    .string()
    .describe('Descrição das visualizações existentes.'),
  existingStatisticalInsightsDescription: z
    .string()
    .describe('Descrição dos insights estatísticos existentes.'),
});
export type CorrelateDatasetsInput = z.infer<typeof CorrelateDatasetsInputSchema>;

const CorrelateDatasetsOutputSchema = z.object({
  insights: z
    .string()
    .describe(
      'Insights sobre como o novo conjunto de dados se correlaciona com as visualizações e insights estatísticos existentes.'
    ),
  suggestedUpdates: z
    .string()
    .describe(
      'Atualizações sugeridas para as visualizações e insights estatísticos com base no novo conjunto de dados.'
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
  prompt: `Você é um assistente de IA ajudando cientistas de dados a entender o impacto de novos conjuntos de dados ambientais.

Você receberá a descrição de um novo conjunto de dados ambiental, bem como descrições de visualizações e insights estatísticos existentes.

Sua tarefa é analisar como o novo conjunto de dados se correlaciona com as visualizações e insights estatísticos existentes e sugerir atualizações para as visualizações e insights de acordo.

Descrição do Novo Conjunto de Dados: {{{newDatasetDescription}}}

Descrição das Visualizações Existentes: {{{existingVisualizationsDescription}}}

Descrição dos Insights Estatísticos Existentes: {{{existingStatisticalInsightsDescription}}}

Insights de Correlação:
Atualizações Sugeridas: `,
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
