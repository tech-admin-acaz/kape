"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/hooks/use-i18n';
import { Chrome } from 'lucide-react';
import { Logo } from '../shared/logo';

export function SignupForm() {
  const { t } = useI18n();

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto">
          <Logo />
        </div>
        <CardTitle className="font-headline text-2xl">{t('signupTitle')}</CardTitle>
        <CardDescription>{t('signupSubtitle')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">{t('nameLabel')}</Label>
          <Input id="name" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">{t('emailLabel')}</Label>
          <Input id="email" type="email" placeholder="m@example.com" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">{t('passwordLabel')}</Label>
          <Input id="password" type="password" required />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button className="w-full" asChild><Link href="/dashboard">{t('signupButton')}</Link></Button>
        <Button variant="outline" className="w-full">
          <Chrome className="mr-2 h-4 w-4" />
          {t('googleSignup')}
        </Button>
        <div className="text-center text-sm text-muted-foreground">
          {t('hasAccount')}{' '}
          <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
            {t('login')}
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
