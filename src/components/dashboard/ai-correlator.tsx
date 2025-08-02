"use client"

import React, { useState, useTransition, useEffect } from 'react';
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
import { Loader2, Wand2, Info, FilePenLine, Save, X, Send } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { cn } from '@/lib/utils';

type EditableField = 'insights' | 'suggestedUpdates';

export function AICorrelator({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    
    const [result, setResult] = useState<{ insights: string; suggestedUpdates: string } | null>(null);
    const [editableContent, setEditableContent] = useState({ insights: '', suggestedUpdates: '' });
    const [editing, setEditing] = useState<EditableField | null>(null);
    
    const [newDatasetDesc, setNewDatasetDesc] = useState('');
    const { toast } = useToast();

    useEffect(() => {
        if (result) {
            setEditableContent({
                insights: result.insights,
                suggestedUpdates: result.suggestedUpdates
            });
        }
    }, [result]);

    const handleEdit = (field: EditableField) => {
        setEditing(field);
    };

    const handleCancel = (field: EditableField) => {
        if (result) {
            setEditableContent(prev => ({ ...prev, [field]: result[field] }));
        }
        setEditing(null);
    };

    const handleSave = (field: EditableField) => {
        // Here you could potentially save the edited content back to a state or DB
        setEditing(null);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setResult(null);
        setEditing(null);

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
      <DialogContent className="sm:max-w-[625px] grid-rows-[auto_minmax(0,1fr)_auto] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="font-headline flex items-center gap-2"><Wand2 className="w-5 h-5 text-primary" /> Correlação de Conjunto de Dados com IA</DialogTitle>
          <DialogDescription>
            Descreva um novo conjunto de dados ambientais para ver como ele se correlaciona com os dados existentes e obter sugestões de atualizações.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="overflow-y-auto space-y-4 pr-2">
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
                            <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center gap-2">
                                     <AlertTitle>Insights de Correlação</AlertTitle>
                                     <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button type="button"><Info className="h-4 w-4 text-muted-foreground" /></button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p className="max-w-xs">Análise da IA sobre como os novos dados se conectam<br/> com as informações e visualizações existentes.</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                                <div className="flex items-center gap-1">
                                    {editing === 'insights' ? (
                                        <>
                                            <TooltipProvider>
                                                <Tooltip><TooltipTrigger asChild><Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleSave('insights')}><Save className="h-4 w-4 text-green-600" /></Button></TooltipTrigger><TooltipContent><p>Salvar</p></TooltipContent></Tooltip>
                                                <Tooltip><TooltipTrigger asChild><Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleCancel('insights')}><X className="h-4 w-4 text-red-600" /></Button></TooltipTrigger><TooltipContent><p>Cancelar</p></TooltipContent></Tooltip>
                                            </TooltipProvider>
                                        </>
                                    ) : (
                                        <>
                                            <TooltipProvider>
                                                <Tooltip><TooltipTrigger asChild><Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit('insights')}><FilePenLine className="h-4 w-4" /></Button></TooltipTrigger><TooltipContent><p>Editar</p></TooltipContent></Tooltip>
                                                <Tooltip><TooltipTrigger asChild><Button type="button" variant="ghost" size="icon" className="h-7 w-7"><Send className="h-4 w-4 text-primary" /></Button></TooltipTrigger><TooltipContent><p>Enviar para PDF</p></TooltipContent></Tooltip>
                                            </TooltipProvider>
                                        </>
                                    )}
                                </div>
                            </div>
                             {editing === 'insights' ? (
                                <Textarea 
                                    value={editableContent.insights}
                                    onChange={(e) => setEditableContent(prev => ({...prev, insights: e.target.value}))}
                                    rows={5}
                                    className="text-sm"
                                />
                             ) : (
                                <AlertDescription>{editableContent.insights}</AlertDescription>
                             )}
                        </Alert>
                         <Alert>
                            <div className="flex justify-between items-center mb-2">
                                 <div className="flex items-center gap-2">
                                     <AlertTitle>Atualizações Sugeridas</AlertTitle>
                                     <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button type="button"><Info className="h-4 w-4 text-muted-foreground" /></button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p className="max-w-xs">Recomendações da IA para novos gráficos ou<br/> modificações nas visualizações atuais.</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                               <div className="flex items-center gap-1">
                                    {editing === 'suggestedUpdates' ? (
                                        <>
                                            <TooltipProvider>
                                                <Tooltip><TooltipTrigger asChild><Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleSave('suggestedUpdates')}><Save className="h-4 w-4 text-green-600" /></Button></TooltipTrigger><TooltipContent><p>Salvar</p></TooltipContent></Tooltip>
                                                <Tooltip><TooltipTrigger asChild><Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleCancel('suggestedUpdates')}><X className="h-4 w-4 text-red-600" /></Button></TooltipTrigger><TooltipContent><p>Cancelar</p></TooltipContent></Tooltip>
                                            </TooltipProvider>
                                        </>
                                    ) : (
                                        <>
                                            <TooltipProvider>
                                                <Tooltip><TooltipTrigger asChild><Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit('suggestedUpdates')}><FilePenLine className="h-4 w-4" /></Button></TooltipTrigger><TooltipContent><p>Editar</p></TooltipContent></Tooltip>
                                                <Tooltip><TooltipTrigger asChild><Button type="button" variant="ghost" size="icon" className="h-7 w-7"><Send className="h-4 w-4 text-primary" /></Button></TooltipTrigger><TooltipContent><p>Enviar para PDF</p></TooltipContent></Tooltip>
                                            </TooltipProvider>
                                        </>
                                    )}
                                </div>
                            </div>
                             {editing === 'suggestedUpdates' ? (
                                <Textarea 
                                    value={editableContent.suggestedUpdates}
                                    onChange={(e) => setEditableContent(prev => ({...prev, suggestedUpdates: e.target.value}))}
                                    rows={5}
                                    className="text-sm"
                                />
                             ) : (
                                <AlertDescription>{editableContent.suggestedUpdates}</AlertDescription>
                             )}
                        </Alert>
                    </div>
                )}
            </div>
            <DialogFooter className="sticky bottom-0 bg-background py-4">
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
