'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/store';
import { worksApi, templatesApi, estimatesApi } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Hammer, Layers, FileText, Plus } from 'lucide-react';

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const { data: works } = useQuery({
    queryKey: ['works'],
    queryFn: () => worksApi.getAll(),
    enabled: isAuthenticated,
  });

  const { data: templates } = useQuery({
    queryKey: ['templates'],
    queryFn: () => templatesApi.getAll(),
    enabled: isAuthenticated,
  });

  const { data: estimates } = useQuery({
    queryKey: ['estimates'],
    queryFn: () => estimatesApi.getAll(),
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Witaj{user?.companyName ? `, ${user.companyName}` : ''}!
        </h1>
        <p className="text-gray-500 mt-2">
          Oto przegląd Twojej działalności
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Prace</CardTitle>
            <Hammer className="text-primary" size={24} />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">
              {works?.data?.length ?? 0}
            </div>
            <p className="text-sm text-gray-500 mt-1">zdefiniowanych prac</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Szablony</CardTitle>
            <Layers className="text-secondary" size={24} />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-secondary">
              {templates?.data?.length ?? 0}
            </div>
            <p className="text-sm text-gray-500 mt-1">szablonów remontowych</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Kosztorysy</CardTitle>
            <FileText className="text-accent" size={24} />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-accent">
              {estimates?.data?.length ?? 0}
            </div>
            <p className="text-sm text-gray-500 mt-1">utworzonych kosztorysów</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Szybkie akcje</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link href="/works?new=true">
              <Button variant="default" className="w-full justify-start gap-2">
                <Plus size={18} />
                Nowa praca
              </Button>
            </Link>
            <Link href="/templates?new=true">
              <Button variant="default" className="w-full justify-start gap-2">
                <Plus size={18} />
                Nowy szablon
              </Button>
            </Link>
            <Link href="/estimates?new=true">
              <Button variant="primary" className="w-full justify-start gap-2">
                <Plus size={18} />
                Nowy kosztorys
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Estimates */}
      {estimates?.data && estimates.data.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Ostatnie kosztorysy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {estimates.data.slice(0, 5).map((estimate: any) => (
                <Link
                  key={estimate.id}
                  href={`/estimates/${estimate.id}`}
                  className="flex items-center justify-between p-3 rounded-xl hover:neu-convex transition-all"
                >
                  <div>
                    <div className="font-medium">{estimate.investorName}</div>
                    <div className="text-sm text-gray-500">{estimate.investorAddress}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-primary">
                      {new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(estimate.totalCost)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
