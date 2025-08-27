"use client";

import { useI18n } from '@/hooks/use-i18n';
import { Leaf } from 'lucide-react';

export function Logo({ className }: { className?: string }) {
  const { t } = useI18n();
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Leaf className="h-6 w-6 text-primary" />
      <span className="font-headline text-xl font-bold text-foreground">
        {t('appName')}
      </span>
    </div>
  );
}
