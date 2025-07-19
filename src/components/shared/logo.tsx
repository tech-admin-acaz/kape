import { Mountain } from 'lucide-react';
import { useI18n } from '@/hooks/use-i18n';

export function Logo({ className }: { className?: string }) {
  const { t } = useI18n();
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Mountain className="h-6 w-6 text-primary" />
      <span className="font-headline text-xl font-bold text-foreground">
        {t('appName')}
      </span>
    </div>
  );
}
