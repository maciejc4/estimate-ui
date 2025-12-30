'use client';

import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { FileText, Database, TrendingUp, Clock } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      {/* Hero Section */}
      <div className="neu-card p-12 max-w-3xl text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Kosztorysy Budowlane
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Profesjonalne kosztorysy remontowe w kilka minut
        </p>
        <p className="text-gray-500 mb-8">
          Skorzystaj z bogatej bazy prac budowlanych z aktualnymi cenami rynkowymi.
          Wybierz gotowe szablony remontowe lub stwórz własny kosztorys.
          Pobierz profesjonalny PDF gotowy do przedstawienia klientowi.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/create">
            <Button variant="primary" size="lg">
              Stwórz kosztorys
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 max-w-5xl px-4">
        <div className="neu-card p-6 text-center">
          <div className="flex justify-center mb-3">
            <Database className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-semibold mb-2">50+ Prac</h3>
          <p className="text-sm text-gray-500">
            Bogata baza prac budowlanych z materiałami i cenami robocizny
          </p>
        </div>

        <div className="neu-card p-6 text-center">
          <div className="flex justify-center mb-3">
            <TrendingUp className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-semibold mb-2">Aktualne Ceny</h3>
          <p className="text-sm text-gray-500">
            Ceny materiałów i robocizny aktualizowane na podstawie danych rynkowych
          </p>
        </div>

        <div className="neu-card p-6 text-center">
          <div className="flex justify-center mb-3">
            <Clock className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-semibold mb-2">Szybko i Prosto</h3>
          <p className="text-sm text-gray-500">
            Kreator krok po kroku - stwórz kosztorys w kilka minut
          </p>
        </div>

        <div className="neu-card p-6 text-center">
          <div className="flex justify-center mb-3">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-semibold mb-2">PDF do Pobrania</h3>
          <p className="text-sm text-gray-500">
            Profesjonalny kosztorys w formacie PDF gotowy dla klienta
          </p>
        </div>
      </div>

      {/* How it works */}
      <div className="mt-16 max-w-4xl px-4">
        <h2 className="text-2xl font-bold text-center mb-8">Jak to dziala?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              1
            </div>
            <h3 className="font-semibold mb-2">Wybierz prace</h3>
            <p className="text-sm text-gray-500">
              Wybierz z gotowych szablonów remontowych lub dodaj pojedyncze prace z katalogu
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              2
            </div>
            <h3 className="font-semibold mb-2">Dostosuj ceny</h3>
            <p className="text-sm text-gray-500">
              Ustaw ilosci, ceny i rabaty. Skorzystaj z sugerowanych cen rynkowych
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              3
            </div>
            <h3 className="font-semibold mb-2">Pobierz PDF</h3>
            <p className="text-sm text-gray-500">
              Wygeneruj profesjonalny kosztorys w formacie PDF i przedstaw klientowi
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-16 mb-8">
        <Link href="/create">
          <Button variant="primary" size="lg">
            Rozpocznij teraz - za darmo
          </Button>
        </Link>
      </div>
    </div>
  );
}
