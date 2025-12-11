'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/store';
import { estimatesApi, Estimate } from '@/lib/api';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Plus, Pencil, Trash2, Download, Eye } from 'lucide-react';
import { formatCurrency, downloadBlob } from '@/lib/utils';

function EstimatesContent() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      setShowForm(true);
    }
  }, [searchParams]);

  const { data: estimates, isLoading } = useQuery({
    queryKey: ['estimates'],
    queryFn: () => estimatesApi.getAll(),
    enabled: isAuthenticated,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => estimatesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['estimates'] });
    },
  });

  const handleDownloadPdf = async (estimate: Estimate, detail: 'full' | 'basic') => {
    try {
      const response = await estimatesApi.getPdf(estimate.id, detail);
      const filename = `kosztorys_${estimate.investorName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      downloadBlob(response.data, filename);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Błąd podczas generowania PDF');
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Kosztorysy</h1>
        <Button variant="primary" onClick={() => router.push('/estimates/new')}>
          <Plus size={18} className="mr-2" />
          Nowy kosztorys
        </Button>
      </div>

      {/* Estimates List */}
      {isLoading ? (
        <div className="text-center py-12">Ładowanie...</div>
      ) : estimates?.data?.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-gray-500 mb-4">Nie masz jeszcze żadnych kosztorysów</p>
          <Button variant="primary" onClick={() => router.push('/estimates/new')}>
            Utwórz pierwszy kosztorys
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {estimates?.data?.map((estimate: Estimate) => (
            <Card key={estimate.id}>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{estimate.investorName}</h3>
                    <p className="text-gray-500">{estimate.investorAddress}</p>
                    {estimate.startDate && (
                      <p className="text-sm text-gray-400">
                        Rozpoczęcie: {new Date(estimate.startDate).toLocaleDateString('pl-PL')}
                      </p>
                    )}
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm text-gray-500">
                      Materiały: {formatCurrency(estimate.materialCostWithDiscount)}
                      {estimate.materialDiscount > 0 && (
                        <span className="text-green-600 ml-1">(-{estimate.materialDiscount}%)</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      Robocizna: {formatCurrency(estimate.laborCostWithDiscount)}
                      {estimate.laborDiscount > 0 && (
                        <span className="text-green-600 ml-1">(-{estimate.laborDiscount}%)</span>
                      )}
                    </div>
                    <div className="text-xl font-bold text-primary mt-1">
                      {formatCurrency(estimate.totalCost)}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(`/estimates/${estimate.id}`)}
                >
                  <Eye size={16} className="mr-1" />
                  Podgląd
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(`/estimates/${estimate.id}/edit`)}
                >
                  <Pencil size={16} className="mr-1" />
                  Edytuj
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownloadPdf(estimate, 'full')}
                >
                  <Download size={16} className="mr-1" />
                  PDF (pełny)
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownloadPdf(estimate, 'basic')}
                >
                  <Download size={16} className="mr-1" />
                  PDF (podstawowy)
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-error"
                  onClick={() => {
                    if (confirm('Czy na pewno chcesz usunąć ten kosztorys?')) {
                      deleteMutation.mutate(estimate.id);
                    }
                  }}
                >
                  <Trash2 size={16} className="mr-1" />
                  Usuń
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function EstimatesPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Ładowanie...</div>}>
      <EstimatesContent />
    </Suspense>
  );
}
