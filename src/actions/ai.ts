"use server";

import { runChat, type AIChatInput, type AIChatOutput } from '@/ai/flows/dataset-correlation';

export async function runAIChat(input: AIChatInput): Promise<{ output: AIChatOutput | null; error: string | null }> {
    try {
        const output = await runChat(input);
        return { output, error: null };
    } catch (e: any) {
        console.error("Error in runAIChat action:", e);
        return { output: null, error: e.message || "An unknown error occurred." };
    }
}
