"use client";

import { useI18n } from '@/hooks/use-i18n';
import HeroMap from './hero-map';

export function BiodiversitySection() {
  const { t } = useI18n();

  return (
    <section 
      id="biodiversity" 
      className="relative h-screen w-full overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 to-black"
    >
      <div className="container h-full flex items-center">
        <div className="flex flex-col items-start text-left md:w-1/2">
          <div className="max-w-2xl">
            <h2 className="font-headline text-5xl font-bold tracking-tighter text-white sm:text-6xl md:text-7xl">
              {t('biodiversityTitle')}
            </h2>
            <div className="mt-8 max-w-2xl">
                <p className="text-lg text-gray-400 md:text-xl">
                    {t('biodiversityDesc')}
                </p>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute right-0 top-0 h-full w-1/2 hidden md:block">
        <HeroMap />
      </div>
    </section>
  );
}
