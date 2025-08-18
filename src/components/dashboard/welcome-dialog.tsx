
"use client";

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '../ui/button';
import { Logo } from '../shared/logo';
import { Map, Database, ArrowRight, UserCheck, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';

interface WelcomeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDialogClose: (dontShowAgain: boolean) => void;
}

export default function WelcomeDialog({ open, onOpenChange, onDialogClose }: WelcomeDialogProps) {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [dontShowAgain, setDontShowAgain] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleClose = () => {
        onDialogClose(dontShowAgain);
    }

    const handleLoginRedirect = () => {
        handleClose();
        router.push('/login');
    }
    
    const handleExplore = () => {
        handleClose();
    }

    const AuthButton = () => {
        if (loading) {
            return (
                <Button className="w-full" variant="default" disabled>
                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                   Carregando...
                </Button>
            );
        }

        if (user) {
            return (
                <Button className="w-full" variant="default" onClick={handleExplore}>
                    Explorar <ArrowRight className="ml-2"/>
                </Button>
            );
        }

        return (
            <Button className="w-full" variant="default" onClick={handleLoginRedirect}>
                Fazer Login ou Cadastrar <ArrowRight className="ml-2"/>
            </Button>
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl p-10">
                <DialogHeader className="items-center mb-6">
                    <Logo />
                    <DialogTitle className="text-2xl font-bold font-headline text-center mt-4">Bem-vindo à Plataforma de Biodiversidade</DialogTitle>
                    <DialogDescription className="text-base text-center max-w-3xl mx-auto text-muted-foreground">
                        Esta plataforma apresenta a quantificação de serviços ambientais e a detecção de áreas prioritárias para a restauração na Amazônia com base em três pilares: (i) valoração dos serviços ambientais de florestas de terra firme relacionados ao carbono, biodiversidade e água; (ii) sugestão de espécies-chave a serem usadas na restauração, que possam aumentar a resiliência das florestas frente às mudanças climáticas futuras e proporcionar benefícios econômicos para as comunidades locais; e (iii) integração do conhecimento tradicional com a ciência ocidental.
                    </DialogDescription>
                </DialogHeader>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card className="flex flex-col">
                        <CardHeader className="items-center text-center">
                            <Avatar className="w-16 h-16 mb-2">
                                <AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="scientist avatar" />
                                <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                            <CardTitle>Acesso Livre</CardTitle>
                            <CardDescription>Explore os recursos públicos</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow space-y-3 text-sm">
                            <div className="flex items-start gap-3">
                                <Map className="w-5 h-5 text-primary mt-0.5" />
                                <span>Visualização de camadas de dados e informações gerais no mapa interativo.</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <Database className="w-5 h-5 text-primary mt-0.5" />
                                <span>Acesso a um conjunto limitado de dados e estatísticas para áreas selecionadas.</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" onClick={handleExplore}>
                                Explorar <ArrowRight className="ml-2"/>
                            </Button>
                        </CardFooter>
                    </Card>

                     <Card className="flex flex-col border-primary/50 shadow-lg">
                        <CardHeader className="items-center text-center">
                            <Avatar className="w-16 h-16 mb-2">
                                <AvatarImage src={user?.photoURL || 'https://placehold.co/100x100.png'} data-ai-hint="logged in user avatar" />
                                <AvatarFallback>{user?.displayName?.charAt(0) || 'U'}</AvatarFallback>
                            </Avatar>
                            <CardTitle>Acesso com Login</CardTitle>
                            <CardDescription>Desbloqueie todo o potencial</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow space-y-3 text-sm">
                            <div className="flex items-start gap-3">
                                <UserCheck className="w-5 h-5 text-primary mt-0.5" />
                                <span>Acesso completo a todos os dados científicos, incluindo séries temporais e análises detalhadas.</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <Database className="w-5 h-5 text-primary mt-0.5" />
                                <span>Capacidade de salvar suas áreas de interesse, histórico de visualizações e configurações personalizadas.</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                           <AuthButton />
                        </CardFooter>
                    </Card>
                </div>
                 <DialogFooter className="sm:justify-center pt-6">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="dont-show-again" checked={dontShowAgain} onCheckedChange={(checked) => setDontShowAgain(!!checked)} />
                        <Label htmlFor="dont-show-again" className="text-sm font-normal">Não mostrar novamente</Label>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
