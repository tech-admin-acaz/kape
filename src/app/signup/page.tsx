import { SignupForm } from '@/components/auth/signup-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background p-4">
       <Button variant="ghost" className="absolute left-4 top-4" asChild>
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Link>
      </Button>
      <div className="w-full max-w-md">
        <SignupForm />
      </div>
    </div>
  );
}
