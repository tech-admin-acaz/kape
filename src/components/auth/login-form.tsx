"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/hooks/use-i18n';
import { Chrome, TriangleAlert, Eye, EyeOff } from 'lucide-react';
import { Logo } from '../shared/logo';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export function LoginForm() {
  const { t } = useI18n();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/dashboard');
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('Login com e-mail e senha não implementado. Use o login com Google.');
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
            <div className="relative">
              <Input 
                id="password" 
                type={showPassword ? 'text' : 'password'}
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full">{t('loginButton')}</Button>
          <Button variant="outline" className="w-full" type="button" onClick={handleGoogleLogin}>
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
