'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function SignInPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn.email({
        email,
        password,
      });

      if (result.error) {
        toast.error(result.error.message || 'Failed to sign in');
        return;
      }

      toast.success('Welcome back!');
      router.push('/profile');
      router.refresh();
    } catch {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="border-0 shadow-xl bg-white">
      <CardHeader className="space-y-1 pb-6">
        <div className="lg:hidden mb-4">
          <h1 className="font-serif text-2xl font-semibold text-stone-900">
            Stilbaai Gallery
          </h1>
        </div>
        <CardTitle className="text-2xl font-serif font-semibold text-stone-900">
          Welcome back
        </CardTitle>
        <CardDescription className="text-stone-600">
          Sign in to your account to continue
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-stone-700">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="artist@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="h-11 border-stone-300 focus:border-amber-600 focus:ring-amber-600"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-stone-700">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="h-11 border-stone-300 focus:border-amber-600 focus:ring-amber-600"
            />
          </div>
          <Button
            type="submit"
            className="w-full h-11 bg-stone-900 hover:bg-stone-800 text-white font-medium"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </Button>
        </form>
        <div className="mt-6 text-center text-sm text-stone-600">
          Don&apos;t have an account?{' '}
          <Link
            href="/sign-up"
            className="font-medium text-amber-700 hover:text-amber-800 underline-offset-4 hover:underline"
          >
            Create one
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
