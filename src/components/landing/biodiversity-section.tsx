"use client";

import { useI18n } from '@/hooks/use-i18n';
import HeroMap from './hero-map';

export function BiodiversitySection() {
  const { t } = useI18n();

  return (
    <section 
      id="biodiversity" 
      className="relative h-screen w-full overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <HeroMap />
      </div>
      <div className="relative z-10 container h-full flex items-center pointer-events-none">
        <div className="flex flex-col items-end text-right md:w-1/2 ml-auto pr-8">
          <div className="max-w-2xl">
            <h2 
              className="font-headline text-4xl font-bold tracking-tighter text-foreground sm:text-5xl md:text-6xl"
              style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
            >
              {t('biodiversityTitle')}
            </h2>
            <div className="mt-8 max-w-2xl">
                <p 
                  className="text-lg text-muted-foreground md:text-xl"
                  style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
                >
                    {t('biodiversityDesc')}
                </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
