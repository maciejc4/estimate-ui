'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/store';
import { estimatesApi } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Download, Pencil } from 'lucide-react';
import { formatCurrency, downloadBlob, formatDate } from '@/lib/utils';

export default function EstimateDetailPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const { data: estimate, isLoading } = useQuery({
    queryKey: ['estimate', id],
    queryFn: () => estimatesApi.getById(id),
    enabled: isAuthenticated && !!id,
  });

  const handleDownloadPdf = async (detail: 'full' | 'basic') => {
    try {
      const response = await estimatesApi.getPdf(id, detail);
      const filename = `kosztorys_${estimate?.data?.investorName?.replace(/[^a-zA-Z0-9]/g, '_') || 'export'}.pdf`;
      downloadBlob(response.data, filename);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Błąd podczas generowania PDF');
    }
  };

  if (!isAuthenticated) return null;

  if (isLoading) {
    return <div className="text-center py-12">Ładowanie...</div>;
  }

  if (!estimate?.data) {
    return <div className="text-center py-12">Kosztorys nie został znaleziony</div>;
  }

  const est = estimate.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft size={18} />
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Kosztorys</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="default" onClick={() => router.push(`/estimates/${id}/edit`)}>
            <Pencil size={18} className="mr-2" />
            Edytuj
          </Button>
          <Button variant="primary" onClick={() => handleDownloadPdf('full')}>
            <Download size={18} className="mr-2" />
            PDF
          </Button>
        </div>
      </div>

      {/* Investor Info */}
      <Card>
        <CardHeader>
          <CardTitle>Dane inwestora</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <span className="text-gray-500">Inwestor: </span>
            <span className="font-medium">{est.investorName}</span>
          </div>
          <div>
            <span className="text-gray-500">Adres: </span>
            <span className="font-medium">{est.investorAddress}</span>
          </div>
          {est.startDate && (
            <div>
              <span className="text-gray-500">Data rozpoczęcia: </span>
              <span className="font-medium">{formatDate(est.startDate)}</span>
            </div>
          )}
          {est.validUntil && (
            <div>
              <span className="text-gray-500">Ważny do: </span>
              <span className="font-medium">{formatDate(est.validUntil)}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Work Items */}
      <Card>
        <CardHeader>
          <CardTitle>Pozycje kosztorysu</CardTitle>
        </CardHeader>
        <CardContent>
          {est.workItems && est.workItems.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Praca</th>
                    <th className="text-right py-2">Ilość</th>
                    <th className="text-right py-2">Materiały</th>
                    <th className="text-right py-2">Robocizna</th>
                  </tr>
                </thead>
                <tbody>
                  {est.workItems.map((item: any, index: number) => {
                    const materialCost = item.materialPrices?.reduce((sum: number, mp: any) => 
                      sum + (item.quantity * mp.consumptionPerWorkUnit * mp.pricePerUnit), 0) || 0;
                    const laborCost = item.quantity * item.laborPricePerUnit;
                    
                    return (
                      <tr key={index} className="border-b">
                        <td className="py-3">
                          <div className="font-medium">{item.workName}</div>
                        </td>
                        <td className="text-right py-3">
                          {item.quantity} {item.unit}
                        </td>
                        <td className="text-right py-3">{formatCurrency(materialCost)}</td>
                        <td className="text-right py-3">{formatCurrency(laborCost)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">Brak pozycji</p>
          )}
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Podsumowanie</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Materiały:</span>
              <span>{formatCurrency(est.materialCost)}</span>
            </div>
            {est.materialDiscount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Rabat na materiały ({est.materialDiscount}%):</span>
                <span>-{formatCurrency(est.materialCost - est.materialCostWithDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Robocizna:</span>
              <span>{formatCurrency(est.laborCost)}</span>
            </div>
            {est.laborDiscount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Rabat na robociznę ({est.laborDiscount}%):</span>
                <span>-{formatCurrency(est.laborCost - est.laborCostWithDiscount)}</span>
              </div>
            )}
            <div className="border-t pt-2 mt-2 flex justify-between text-xl font-bold">
              <span>RAZEM:</span>
              <span className="text-primary">{formatCurrency(est.totalCost)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      {est.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Uwagi</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{est.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* PDF Options */}
      <Card>
        <CardHeader>
          <CardTitle>Generowanie PDF</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Button variant="primary" onClick={() => handleDownloadPdf('full')}>
            <Download size={18} className="mr-2" />
            Pełny kosztorys
          </Button>
          <Button variant="default" onClick={() => handleDownloadPdf('basic')}>
            <Download size={18} className="mr-2" />
            Podstawowe informacje
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
