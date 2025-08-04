"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/hooks/use-i18n';
import { Chrome, TriangleAlert } from 'lucide-react';
import { Logo } from '../shared/logo';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function LoginForm() {
  const { t } = useI18n();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'acaz.dev@gmail.com' && password === 'qazx74123') {
      setError('');
      router.push('/dashboard');
    } else {
      setError('Credenciais inválidas. Use o e-mail acaz.dev@gmail.com e a senha qazx74123 para entrar.');
    }
  };

  return (
    <Card>
      <form onSubmit={handleLogin}>
        <CardHeader className="text-center">
          <div className="mx-auto">
            <Logo />
          </div>
          <CardTitle className="font-headline text-2xl">{t('loginTitle')}</CardTitle>
          <CardDescription>{t('loginSubtitle')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <TriangleAlert className="h-4 w-4" />
              <AlertTitle>Erro de Login</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">{t('emailLabel')}</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="m@example.com" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t('passwordLabel')}</Label>
            <Input 
              id="password" 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full">{t('loginButton')}</Button>
          <Button variant="outline" className="w-full">
            <Chrome className="mr-2 h-4 w-4" />
            {t('googleLogin')}
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            {t('noAccount')}{' '}
            <Link href="/signup" className="font-medium text-primary underline-offset-4 hover:underline">
              {t('signup')}
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
