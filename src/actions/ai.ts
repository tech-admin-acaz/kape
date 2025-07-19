"use server";

import { correlateDatasets, type CorrelateDatasetsInput, type CorrelateDatasetsOutput } from '@/ai/flows/dataset-correlation';

export async function runCorrelation(input: CorrelateDatasetsInput): Promise<{ output: CorrelateDatasetsOutput | null; error: string | null }> {
    try {
        const output = await correlateDatasets(input);
        return { output, error: null };
    } catch (e: any) {
        console.error("Error in runCorrelation action:", e);
        return { output: null, error: e.message || "An unknown error occurred." };
    }
}
