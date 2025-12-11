'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { authApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Hasła nie są identyczne');
      return;
    }

    if (password.length < 8) {
      setError('Hasło musi mieć minimum 8 znaków');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authApi.register({
        email,
        password,
        companyName: companyName || undefined,
        phone: phone || undefined,
      });
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
      setError(err.response?.data?.message || 'Błąd rejestracji. Spróbuj ponownie.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Rejestracja</CardTitle>
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
              label="Email *"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="twoj@email.pl"
              required
            />
            
            <Input
              id="password"
              type="password"
              label="Hasło *"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 znaków"
              required
            />
            
            <Input
              id="confirmPassword"
              type="password"
              label="Potwierdź hasło *"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Powtórz hasło"
              required
            />
            
            <Input
              id="companyName"
              type="text"
              label="Nazwa firmy"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Opcjonalnie"
            />
            
            <Input
              id="phone"
              type="tel"
              label="Telefon"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+48 123 456 789"
            />
            
            <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
              Zarejestruj się
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-gray-500">
            Masz już konto?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Zaloguj się
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
