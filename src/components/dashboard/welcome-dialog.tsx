
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
import { useI18n } from '@/hooks/use-i18n';

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
    const { t } = useI18n();

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
                   {t('loading')}...
                </Button>
            );
        }

        if (user) {
            return (
                <Button className="w-full" variant="default" onClick={handleExplore}>
                    {t('explore')} <ArrowRight className="ml-2"/>
                </Button>
            );
        }

        return (
            <Button className="w-full" variant="default" onClick={handleLoginRedirect}>
                {t('loginOrSignup')} <ArrowRight className="ml-2"/>
            </Button>
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl p-8">
                <DialogHeader className="items-center mb-4">
                    <Logo />
                    <DialogTitle className="text-2xl font-bold font-headline text-center mt-2">{t('welcomeTitle')}</DialogTitle>
                    <DialogDescription className="text-sm text-center max-w-3xl mx-auto text-muted-foreground">
                        {t('welcomeDescription')}
                    </DialogDescription>
                </DialogHeader>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="flex flex-col">
                        <CardHeader className="items-center text-center">
                            <Avatar className="w-16 h-16 mb-2">
                                <AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="scientist avatar" />
                                <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                            <CardTitle>{t('publicAccessTitle')}</CardTitle>
                            <CardDescription>{t('publicAccessSubtitle')}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow space-y-3 text-sm">
                            <div className="flex items-start gap-3">
                                <Map className="w-5 h-5 text-primary mt-0.5" />
                                <span>{t('publicAccessFeature1')}</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <Database className="w-5 h-5 text-primary mt-0.5" />
                                <span>{t('publicAccessFeature2')}</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" onClick={handleExplore}>
                                {t('explore')} <ArrowRight className="ml-2"/>
                            </Button>
                        </CardFooter>
                    </Card>

                     <Card className="flex flex-col border-primary/50 shadow-lg">
                        <CardHeader className="items-center text-center">
                            <Avatar className="w-16 h-16 mb-2">
                                <AvatarImage src={user?.photoURL || 'https://placehold.co/100x100.png'} data-ai-hint="logged in user avatar" />
                                <AvatarFallback>{user?.displayName?.charAt(0) || 'U'}</AvatarFallback>
                            </Avatar>
                            <CardTitle>{t('loggedInAccessTitle')}</CardTitle>
                            <CardDescription>{t('loggedInAccessSubtitle')}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow space-y-3 text-sm">
                            <div className="flex items-start gap-3">
                                <UserCheck className="w-5 h-5 text-primary mt-0.5" />
                                <span>{t('loggedInAccessFeature1')}</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <Database className="w-5 h-5 text-primary mt-0.5" />
                                <span>{t('loggedInAccessFeature2')}</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                           <AuthButton />
                        </CardFooter>
                    </Card>
                </div>
                 <DialogFooter className="sm:justify-center pt-4">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="dont-show-again" checked={dontShowAgain} onCheckedChange={(checked) => setDontShowAgain(!!checked)} />
                        <Label htmlFor="dont-show-again" className="text-sm font-normal">{t('dontShowAgain')}</Label>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
