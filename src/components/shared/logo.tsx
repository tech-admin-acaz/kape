
"use client";

import { Mountain } from 'lucide-react';
import { useI18n } from '@/hooks/use-i18n';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

const SerrapilheiraLogo = () => (
    <svg width="150" height="28" viewBox="0 0 150 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M49.3331 16.2735V22.5H46.4941V6H49.3331V12.72H55.4531V6H58.2921V22.5H55.4531V16.2735H49.3331Z" fill="white"/>
        <path d="M66.4217 14.25C66.4217 18.06 63.5087 21.09 59.8097 21.09C56.1107 21.09 53.1977 18.06 53.1977 14.25C53.1977 10.44 56.1107 7.41 59.8097 7.41C63.5087 7.41 66.4217 10.44 66.4217 14.25ZM55.9727 14.25C55.9727 16.68 57.6437 18.42 59.8097 18.42C61.9757 18.42 63.6467 16.68 63.6467 14.25C63.6467 11.82 61.9757 10.08 59.8097 10.08C57.6437 10.08 55.9727 11.82 55.9727 14.25Z" fill="white"/>
        <path d="M78.6947 14.25C78.6947 18.06 75.7817 21.09 72.0827 21.09C68.3837 21.09 65.4707 18.06 65.4707 14.25C65.4707 10.44 68.3837 7.41 72.0827 7.41C75.7817 7.41 78.6947 10.44 78.6947 14.25ZM68.2457 14.25C68.2457 16.68 69.9167 18.42 72.0827 18.42C74.2487 18.42 75.9197 16.68 75.9197 14.25C75.9197 11.82 74.2487 10.08 72.0827 10.08C69.9167 10.08 68.2457 11.82 68.2457 14.25Z" fill="white"/>
        <path d="M86.8219 7.74V22.5H84.1129V7.74H80.2099V6H90.7249V7.74H86.8219Z" fill="white"/>
        <path d="M94.6288 6H97.4678V22.5H94.6288V6Z" fill="white"/>
        <path d="M109.123 6H111.962L106.31 14.124L112.097 22.5H108.988L104.707 16.29L100.499 22.5H97.3898L103.177 14.124L97.5348 6H100.644L104.779 11.844L109.123 6Z" fill="white"/>
        <path d="M123.673 14.4V22.5H120.834V6H123.673V14.4Z" fill="white"/>
        <path d="M135.034 14.25C135.034 18.06 132.121 21.09 128.422 21.09C124.723 21.09 121.81 18.06 121.81 14.25C121.81 10.44 124.723 7.41 128.422 7.41C132.121 7.41 135.034 10.44 135.034 14.25ZM124.585 14.25C124.585 16.68 126.256 18.42 128.422 18.42C130.588 18.42 132.259 16.68 132.259 14.25C132.259 11.82 130.588 10.08 128.422 10.08C126.256 10.08 124.585 11.82 124.585 14.25Z" fill="white"/>
        <path d="M149.208 6L142.926 22.5H140.01L136.185 11.388L136.107 11.388L134.508 22.5H131.733L129.567 11.388L129.489 11.388L125.664 22.5H122.748L116.466 6H119.553L124.164 18.156L124.242 18.156L127.533 6H130.446L133.555 18.156L133.633 18.156L138.243 6H141.33L144.438 18.156L144.516 18.156L149.208 6Z" fill="white"/>
        <path d="M12.9863 0.288L5.75928 20.916L12.9863 27.288L20.2133 20.916L12.9863 0.288Z" fill="white"/>
        <path d="M26.4716 5.544L14.7356 22.932L21.9626 27.288L33.6986 9.9L26.4716 5.544Z" fill="white"/>
        <path d="M0 9.9L11.736 27.288L18.963 22.932L7.22695 5.544L0 9.9Z" fill="white"/>
    </svg>
);

export function Logo({ className }: { className?: string }) {
  const { t } = useI18n();
  const { theme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Render a placeholder or nothing on the server to avoid hydration mismatch
    return null;
  }

  const useDarkLogo = theme === 'dark';

  return useDarkLogo ? <SerrapilheiraLogo /> : (
    <div className={`flex items-center gap-2 ${className}`}>
      <Mountain className="h-6 w-6 text-primary" />
      <span className="font-headline text-xl font-bold text-foreground">
        {t('appName')}
      </span>
    </div>
  );
}
