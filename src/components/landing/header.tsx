"use client";

import Link from 'next/link';
import { Logo } from '@/components/shared/logo';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/shared/language-switcher';
import { useI18n } from '@/hooks/use-i18n';
import { ThemeSwitcher } from '../shared/theme-switcher';

export function Header() {
  const { t } = useI18n();
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-auto flex items-center gap-4">
            <Logo />
        </div>
        <div className="flex items-center justify-end space-x-2">
          <nav className="hidden items-center space-x-4 sm:flex">
            <a href="#hero" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">{t('navIntro')}</a>
            <a href="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">{t('navFeatures')}</a>
          </nav>
          <LanguageSwitcher />
          <ThemeSwitcher />
          <Button variant="ghost" asChild>
            <Link href="/login">{t('login')}</Link>
          </Button>
          <Button asChild>
            <Link href="/plataforma.kape">{t('getStarted')}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
