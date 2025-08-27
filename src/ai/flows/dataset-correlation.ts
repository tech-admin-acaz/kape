'use server';

/**
 * @fileOverview This file contains the Genkit flow for the conversational AI chat
 * that analyzes the currently selected environmental area.
 *
 * - runChat - A function that handles the chat interaction.
 * - AIChatInput - The input type for the runChat function.
 * - AIChatOutput - The return type for the runChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIChatInputSchema = z.object({
  question: z.string().describe('A pergunta do usuário sobre a área selecionada.'),
  areaName: z.string().describe('O nome da área (ex: estado, município) selecionada.'),
  statistics: z.string().describe('Um resumo em JSON dos dados estatísticos da área (cobertura do solo, carbono, biodiversidade, etc).'),
});
export type AIChatInput = z.infer<typeof AIChatInputSchema>;

const AIChatOutputSchema = z.object({
  answer: z
    .string()
    .describe(
      'A resposta da IA para a pergunta do usuário, baseada no contexto fornecido.'
    ),
});
export type AIChatOutput = z.infer<typeof AIChatOutputSchema>;

export async function runChat(input: AIChatInput): Promise<AIChatOutput> {
  return aiChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiChatPrompt',
  input: {schema: AIChatInputSchema},
  output: {schema: AIChatOutputSchema},
  prompt: `Você é Kapé, um assistente de IA especialista em análise de dados ambientais. Sua função é responder a perguntas sobre uma área geográfica específica, utilizando os dados fornecidos.

Seja conciso, amigável e informativo. Responda em Markdown.

**Contexto da Análise:**

*   **Área de Foco:** {{{areaName}}}
*   **Dados Disponíveis (resumo):**
    \`\`\`json
    {{{statistics}}}
    \`\`\`

**Pergunta do Usuário:**
"{{{question}}}"

Com base no contexto acima, por favor, forneça uma resposta clara e direta para a pergunta do usuário.`,
});

const aiChatFlow = ai.defineFlow(
  {
    name: 'aiChatFlow',
    inputSchema: AIChatInputSchema,
    outputSchema: AIChatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
