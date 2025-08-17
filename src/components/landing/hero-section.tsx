"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/hooks/use-i18n';
import { ArrowDown, ArrowRight } from 'lucide-react';

export function HeroSection() {
  const { t } = useI18n();

  return (
    <section id="hero" className="relative h-screen w-full overflow-hidden">
      <video
        id="hero-video"
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="https://storage.googleapis.com/odisea-assets/hero-video-amazon.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/50" />
      
      <div className="container relative z-10 flex h-full flex-col items-center justify-center text-center">
        <div className="max-w-4xl">
          <h1 className="font-headline text-5xl font-bold tracking-tighter text-white sm:text-6xl md:text-7xl lg:text-8xl">
            {t('heroTitle')}
          </h1>
          <div className="mx-auto mt-8 max-w-2xl">
            <div className="rounded-lg bg-black/30 p-6 backdrop-blur-sm">
                <p className="text-lg text-slate-200 md:text-xl">
                    {t('heroSubtitle')}
                </p>
                <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                    <Button size="lg" asChild className="w-full sm:w-auto">
                        <Link href="/dashboard">Acessar o Painel <ArrowRight className="ml-2"/></Link>
                    </Button>
                    <Button size="lg" variant="outline" className="w-full border-slate-400 text-white hover:bg-white/10 hover:text-white sm:w-auto" asChild>
                        <Link href="/signup">Cadastre-se</Link>
                    </Button>
                </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 flex flex-col items-center gap-2 text-white">
          <span>Continue Rolando</span>
          <div className="scroll-down-indicator">
            <ArrowDown className="h-6 w-6" />
          </div>
        </div>
      </div>
    </section>
  );
}
