
"use client"

import React, { useState, useTransition, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { runAIChat } from '@/actions/ai';
import { Loader2, Send, WandSparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useI18n } from '@/hooks/use-i18n';
import type { StatsData } from '../stats-panel';
import { ScrollArea } from '@/components/ui/scroll-area';
import ReactMarkdown from 'react-markdown';

interface AIChatTabProps {
    selectedArea: StatsData;
    areaStats: any;
}

type Message = {
    role: 'user' | 'assistant';
    content: string;
}

export default function AIChatTab({ selectedArea, areaStats }: AIChatTabProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    const { t } = useI18n();
    const scrollAreaRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        // Scroll to bottom when messages change
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({
                top: scrollAreaRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [messages]);

     const handleSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
        event?.preventDefault();
        if (!input.trim() || isPending) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');

        startTransition(async () => {
            const { output, error } = await runAIChat({
                question: input,
                areaName: selectedArea.name,
                statistics: JSON.stringify(areaStats, null, 2),
            });

            if (error) {
                console.error(error);
                toast({
                    variant: 'destructive',
                    title: t('errorToastTitle'),
                    description: t('aiCorrelatorErrorToast'),
                });
                setMessages(prev => prev.slice(0, -1)); // Remove user message on error
                return;
            }
            if (output) {
                const assistantMessage: Message = { role: 'assistant', content: output.answer };
                setMessages(prev => [...prev, assistantMessage]);
            }
        });
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSubmit();
        }
    };


    return (
        <div className="flex flex-col h-full p-4 space-y-4">
            <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
                 <div className="space-y-4">
                    {/* Initial Message */}
                    <div className="flex items-start gap-3">
                        <div className="p-2 rounded-full bg-primary/20 text-primary">
                            <WandSparkles className="w-5 h-5"/>
                        </div>
                        <div className="bg-muted rounded-lg p-3 max-w-lg">
                           <p className="text-sm">
                            Descreva um novo conjunto de dados ambientais para ver como ele se correlaciona com os dados existentes e obter sugestões de atualizações.
                           </p>
                        </div>
                    </div>
                    
                    {/* Chat Messages */}
                    {messages.map((message, index) => (
                        <div key={index} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
                             {message.role === 'assistant' && (
                                 <div className="p-2 rounded-full bg-primary/20 text-primary">
                                    <WandSparkles className="w-5 h-5"/>
                                </div>
                            )}
                             <div className={`rounded-lg p-3 max-w-lg text-sm ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                <ReactMarkdown
                                    className="prose prose-sm dark:prose-invert"
                                    components={{
                                        p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                                        ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-2" {...props} />,
                                        ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-2" {...props} />,
                                    }}
                                >
                                    {message.content}
                                </ReactMarkdown>
                            </div>
                        </div>
                    ))}
                    {isPending && (
                         <div className="flex items-start gap-3">
                            <div className="p-2 rounded-full bg-primary/20 text-primary">
                                <WandSparkles className="w-5 h-5"/>
                            </div>
                            <div className="bg-muted rounded-lg p-3 max-w-lg flex items-center">
                                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>
             <form onSubmit={handleSubmit} className="relative">
                <Textarea
                    placeholder="Pergunte aqui!"
                    className="pr-16 resize-none"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={2}
                    disabled={isPending}
                />
                <Button 
                    type="submit" 
                    size="icon" 
                    className="absolute right-2.5 bottom-2.5 h-10 w-10 rounded-full"
                    disabled={isPending || !input.trim()}
                >
                    {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                </Button>
            </form>
        </div>
    )
}
