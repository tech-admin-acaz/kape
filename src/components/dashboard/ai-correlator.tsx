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
                existingVisualizationsDescription: "Gráfico de barras do uso da terra, barras de progresso para a qualidade da água e índice de vegetação.",
                existingStatisticalInsightsDescription: "Correlação entre mineração e desmatamento. Resiliência de fontes de água em áreas protegidas.",
            });

            if (error) {
                console.error(error);
                toast({
                    variant: 'destructive',
                    title: 'Erro',
                    description: 'Falha ao executar a correlação de IA. Por favor, tente novamente.',
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
          <DialogTitle className="font-headline flex items-center gap-2"><Wand2 className="w-5 h-5 text-primary" /> Correlação de Conjunto de Dados com IA</DialogTitle>
          <DialogDescription>
            Descreva um novo conjunto de dados ambientais para ver como ele se correlaciona com os dados existentes e obter sugestões de atualizações.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
                <div className="grid w-full gap-1.5">
                    <Label htmlFor="dataset-description">Descrição do Novo Conjunto de Dados</Label>
                    <Textarea 
                        placeholder="Ex: 'Imagens de satélite semanais do Sentinel-2 mostrando os níveis de estresse da vegetação na bacia amazônica para o segundo trimestre de 2024.'" 
                        id="dataset-description" 
                        value={newDatasetDesc}
                        onChange={(e) => setNewDatasetDesc(e.target.value)}
                        rows={5}
                    />
                </div>
                {result && (
                     <div className='space-y-4'>
                        <Alert>
                            <AlertTitle>Insights de Correlação</AlertTitle>
                            <AlertDescription>{result.insights}</AlertDescription>
                        </Alert>
                         <Alert>
                            <AlertTitle>Atualizações Sugeridas</AlertTitle>
                            <AlertDescription>{result.suggestedUpdates}</AlertDescription>
                        </Alert>
                    </div>
                )}
            </div>
            <DialogFooter>
                <Button type="submit" disabled={isPending || !newDatasetDesc}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Correlacionar Dados
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
