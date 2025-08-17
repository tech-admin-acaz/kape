"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/hooks/use-i18n';
import { ArrowDown, ArrowRight } from 'lucide-react';

export function HeroSection() {
  const { t } = useI18n();

  return (
    <section id="hero" className="relative h-screen w-full flex items-center justify-center text-center">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-headline text-5xl font-bold tracking-tighter text-foreground sm:text-6xl md:text-7xl">
            {t('heroTitle')}
          </h1>
          <div className="mt-8 max-w-2xl mx-auto">
              <p className="text-lg text-muted-foreground md:text-xl">
                  {t('heroSubtitle')}
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Button size="lg" asChild className="w-full sm:w-auto">
                      <Link href="/dashboard">Acessar o Painel <ArrowRight className="ml-2"/></Link>
                  </Button>
                  <Button size="lg" variant="outline" className="w-full border-muted-foreground/50 hover:bg-accent sm:w-auto" asChild>
                      <Link href="/signup">Cadastre-se</Link>
                  </Button>
              </div>
          </div>
        </div>
      </div>

       <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-foreground">
          <span>Continue Rolando</span>
          <div className="scroll-down-indicator">
            <ArrowDown className="h-6 w-6" />
          </div>
        </div>
    </section>
  );
}
