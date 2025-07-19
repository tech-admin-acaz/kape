"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/hooks/use-i18n';

export function HeroSection() {
  const { t } = useI18n();

  return (
    <section id="hero" className="relative h-[calc(100vh-3.5rem)] w-full">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
      <div className="container relative z-10 flex h-full flex-col items-center justify-center text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          {t('heroTitle')}
        </h1>
        <p className="mx-auto mt-6 max-w-[700px] text-lg text-muted-foreground md:text-xl">
          {t('heroSubtitle')}
        </p>
        <div className="mt-8">
          <Button size="lg" asChild>
            <Link href="/signup">{t('getStarted')}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
