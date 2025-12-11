'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function Home() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <div className="neu-card p-12 max-w-2xl text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Estimate
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Profesjonalne kosztorysy budowlane w kilka minut
        </p>
        <p className="text-gray-500 mb-8">
          Twórz prace, definiuj szablony remontowe i generuj szczegółowe kosztorysy dla swoich klientów.
          Eksportuj do PDF z pełnym wsparciem dla polskich znaków.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/login">
            <Button variant="primary" size="lg">
              Zaloguj się
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="default" size="lg">
              Zarejestruj się
            </Button>
          </Link>
        </div>
        
        <div className="mt-6">
          <Link href="/login?demo=true" className="text-primary hover:underline">
            Wypróbuj demo bez rejestracji →
          </Link>
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6 mt-12 max-w-4xl">
        <div className="neu-card p-6 text-center">
          <div className="text-3xl mb-3">🔨</div>
          <h3 className="font-semibold mb-2">Prace</h3>
          <p className="text-sm text-gray-500">
            Definiuj prace budowlane z materiałami i jednostkami
          </p>
        </div>
        <div className="neu-card p-6 text-center">
          <div className="text-3xl mb-3">📋</div>
          <h3 className="font-semibold mb-2">Szablony</h3>
          <p className="text-sm text-gray-500">
            Twórz szablony remontowe do wielokrotnego użytku
          </p>
        </div>
        <div className="neu-card p-6 text-center">
          <div className="text-3xl mb-3">📄</div>
          <h3 className="font-semibold mb-2">PDF</h3>
          <p className="text-sm text-gray-500">
            Generuj profesjonalne kosztorysy w formacie PDF
          </p>
        </div>
      </div>
    </div>
  );
}
