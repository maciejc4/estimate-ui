'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { authApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';

function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (searchParams.get('demo') === 'true') {
      handleDemoLogin();
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authApi.login({ email, password });
      login(
        {
          id: response.data.userId,
          email: response.data.email,
          role: response.data.role as 'USER' | 'ADMIN',
          companyName: response.data.companyName,
          phone: response.data.phone,
        },
        response.data.token
      );
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Błąd logowania. Sprawdź dane.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await authApi.demo();
      login(
        {
          id: response.data.userId,
          email: response.data.email,
          role: response.data.role as 'USER' | 'ADMIN',
          companyName: response.data.companyName,
          phone: response.data.phone,
        },
        response.data.token
      );
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Błąd logowania demo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Logowanie</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-100 text-red-700 text-sm">
                {error}
              </div>
            )}
            
            <Input
              id="email"
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="twoj@email.pl"
              required
            />
            
            <Input
              id="password"
              type="password"
              label="Hasło"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            
            <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
              Zaloguj się
            </Button>
          </form>
          
          <div className="mt-4">
            <Button
              type="button"
              variant="default"
              className="w-full"
              onClick={handleDemoLogin}
              isLoading={isLoading}
            >
              Wypróbuj Demo
            </Button>
          </div>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-gray-500">
            Nie masz konta?{' '}
            <Link href="/register" className="text-primary hover:underline">
              Zarejestruj się
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Ładowanie...</div>}>
      <LoginContent />
    </Suspense>
  );
}
