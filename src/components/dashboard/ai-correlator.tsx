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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { useI18n } from '@/hooks/use-i18n';

type EditableField = 'insights' | 'suggestedUpdates';

export function AICorrelator({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    
    const [result, setResult] = useState<{ insights: string; suggestedUpdates: string } | null>(null);
    const [editableContent, setEditableContent] = useState({ insights: '', suggestedUpdates: '' });
    const [editing, setEditing] = useState<EditableField | null>(null);
    
    const [newDatasetDesc, setNewDatasetDesc] = useState('');
    const { toast } = useToast();
    const { t } = useI18n();

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
                existingVisualizationsDescription: t('aiCorrelatorExistingVisualizations'),
                existingStatisticalInsightsDescription: t('aiCorrelatorExistingInsights'),
            });

            if (error) {
                console.error(error);
                toast({
                    variant: 'destructive',
                    title: t('errorToastTitle'),
                    description: t('aiCorrelatorErrorToast'),
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
          <DialogTitle className="font-headline flex items-center gap-2"><Wand2 className="w-5 h-5 text-primary" /> {t('aiCorrelatorTitle')}</DialogTitle>
          <DialogDescription>
            {t('aiCorrelatorDescription')}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="overflow-y-auto space-y-4 pr-2">
            <div className="grid gap-4 py-4">
                <div className="grid w-full gap-1.5">
                    <Label htmlFor="dataset-description">{t('aiCorrelatorNewLabel')}</Label>
                    <Textarea 
                        placeholder={t('aiCorrelatorNewPlaceholder')} 
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
                                     <AlertTitle>{t('aiCorrelatorInsightsTitle')}</AlertTitle>
                                     <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button type="button"><Info className="h-4 w-4 text-muted-foreground" /></button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p className="max-w-xs">{t('aiCorrelatorInsightsTooltip')}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                                <div className="flex items-center gap-1">
                                    {editing === 'insights' ? (
                                        <>
                                            <TooltipProvider>
                                                <Tooltip><TooltipTrigger asChild><Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleSave('insights')}><Save className="h-4 w-4 text-green-600" /></Button></TooltipTrigger><TooltipContent><p>{t('save')}</p></TooltipContent></Tooltip>
                                                <Tooltip><TooltipTrigger asChild><Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleCancel('insights')}><X className="h-4 w-4 text-red-600" /></Button></TooltipTrigger><TooltipContent><p>{t('cancel')}</p></TooltipContent></Tooltip>
                                            </TooltipProvider>
                                        </>
                                    ) : (
                                        <>
                                            <TooltipProvider>
                                                <Tooltip><TooltipTrigger asChild><Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit('insights')}><FilePenLine className="h-4 w-4" /></Button></TooltipTrigger><TooltipContent><p>{t('edit')}</p></TooltipContent></Tooltip>
                                                <Tooltip><TooltipTrigger asChild><Button type="button" variant="ghost" size="icon" className="h-7 w-7"><Send className="h-4 w-4 text-primary" /></Button></TooltipTrigger><TooltipContent><p>{t('sendToPdf')}</p></TooltipContent></Tooltip>
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
                                     <AlertTitle>{t('aiCorrelatorSuggestionsTitle')}</AlertTitle>
                                     <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button type="button"><Info className="h-4 w-4 text-muted-foreground" /></button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p className="max-w-xs">{t('aiCorrelatorSuggestionsTooltip')}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                               <div className="flex items-center gap-1">
                                    {editing === 'suggestedUpdates' ? (
                                        <>
                                            <TooltipProvider>
                                                <Tooltip><TooltipTrigger asChild><Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleSave('suggestedUpdates')}><Save className="h-4 w-4 text-green-600" /></Button></TooltipTrigger><TooltipContent><p>{t('save')}</p></TooltipContent></Tooltip>
                                                <Tooltip><TooltipTrigger asChild><Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleCancel('suggestedUpdates')}><X className="h-4 w-4 text-red-600" /></Button></TooltipTrigger><TooltipContent><p>{t('cancel')}</p></TooltipContent></Tooltip>
                                            </TooltipProvider>
                                        </>
                                    ) : (
                                        <>
                                            <TooltipProvider>
                                                <Tooltip><TooltipTrigger asChild><Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit('suggestedUpdates')}><FilePenLine className="h-4 w-4" /></Button></TooltipTrigger><TooltipContent><p>{t('edit')}</p></TooltipContent></Tooltip>
                                                <Tooltip><TooltipTrigger asChild><Button type="button" variant="ghost" size="icon" className="h-7 w-7"><Send className="h-4 w-4 text-primary" /></Button></TooltipTrigger><TooltipContent><p>{t('sendToPdf')}</p></TooltipContent></Tooltip>
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
                    {t('aiCorrelatorSubmitButton')}
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
