"use client"

import React, { useState, useTransition } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { runCorrelation } from '@/actions/ai';
import { Loader2, Wand2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { useToast } from '@/hooks/use-toast';

export function AICorrelator({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [result, setResult] = useState<{ insights: string; suggestedUpdates: string } | null>(null);
    const [newDatasetDesc, setNewDatasetDesc] = useState('');
    const { toast } = useToast();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setResult(null);

        startTransition(async () => {
            const { output, error } = await runCorrelation({
                newDatasetDescription: newDatasetDesc,
                existingVisualizationsDescription: "Bar chart of land use, progress bars for water quality and vegetation index.",
                existingStatisticalInsightsDescription: "Correlation between mining and deforestation. Resilience of water sources in protected areas.",
            });

            if (error) {
                console.error(error);
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: 'Failed to run AI correlation. Please try again.',
                })
                return;
            }
            if(output) {
                setResult(output);
            }
        });
    }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="font-headline flex items-center gap-2"><Wand2 className="w-5 h-5 text-primary" /> AI Dataset Correlation</DialogTitle>
          <DialogDescription>
            Describe a new environmental dataset to see how it correlates with existing data and get suggestions for updates.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
                <div className="grid w-full gap-1.5">
                    <Label htmlFor="dataset-description">New Dataset Description</Label>
                    <Textarea 
                        placeholder="e.g., 'Weekly satellite imagery from Sentinel-2 showing vegetation stress levels in the Amazon basin for Q2 2024.'" 
                        id="dataset-description" 
                        value={newDatasetDesc}
                        onChange={(e) => setNewDatasetDesc(e.target.value)}
                        rows={5}
                    />
                </div>
                {result && (
                     <div className='space-y-4'>
                        <Alert>
                            <AlertTitle>Correlation Insights</AlertTitle>
                            <AlertDescription>{result.insights}</AlertDescription>
                        </Alert>
                         <Alert>
                            <AlertTitle>Suggested Updates</AlertTitle>
                            <AlertDescription>{result.suggestedUpdates}</AlertDescription>
                        </Alert>
                    </div>
                )}
            </div>
            <DialogFooter>
                <Button type="submit" disabled={isPending || !newDatasetDesc}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Correlate Data
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
