"use client";

import { Logo } from '@/components/shared/logo';
import { useI18n } from '@/hooks/use-i18n';

export function Footer() {
  const { t } = useI18n();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t">
      <div className="container flex flex-col items-center justify-between gap-4 py-6 md:flex-row">
        <Logo />
        <p className="text-sm text-muted-foreground">
          &copy; {currentYear} {t('appName')}. {t('footerRights')}
        </p>
      </div>
    </footer>
  );
}
