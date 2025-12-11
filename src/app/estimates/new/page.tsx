'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/store';
import { estimatesApi, worksApi, Work, EstimateWorkItem, EstimateMaterialPrice } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function NewEstimatePage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const [investorName, setInvestorName] = useState('');
  const [investorAddress, setInvestorAddress] = useState('');
  const [materialDiscount, setMaterialDiscount] = useState('0');
  const [laborDiscount, setLaborDiscount] = useState('0');
  const [notes, setNotes] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [startDate, setStartDate] = useState('');
  const [workItems, setWorkItems] = useState<EstimateWorkItem[]>([]);
  const [showWorkSelector, setShowWorkSelector] = useState(false);

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

  const createMutation = useMutation({
    mutationFn: estimatesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['estimates'] });
      router.push('/estimates');
    },
  });

  const addWorkItem = (work: Work) => {
    const materialPrices: EstimateMaterialPrice[] = work.materials?.map(m => ({
      materialName: m.name,
      unit: m.unit,
      consumptionPerWorkUnit: m.consumptionPerWorkUnit,
      pricePerUnit: 0,
    })) || [];

    setWorkItems([...workItems, {
      workId: work.id,
      workName: work.name,
      unit: work.unit,
      quantity: 1,
      laborPricePerUnit: 0,
      materialPrices,
    }]);
    setShowWorkSelector(false);
  };

  const updateWorkItem = (index: number, updates: Partial<EstimateWorkItem>) => {
    setWorkItems(workItems.map((item, i) => 
      i === index ? { ...item, ...updates } : item
    ));
  };

  const updateMaterialPrice = (workIndex: number, materialIndex: number, pricePerUnit: number) => {
    setWorkItems(workItems.map((item, i) => {
      if (i !== workIndex) return item;
      const newMaterialPrices = [...item.materialPrices];
      newMaterialPrices[materialIndex] = { ...newMaterialPrices[materialIndex], pricePerUnit };
      return { ...item, materialPrices: newMaterialPrices };
    }));
  };

  const removeWorkItem = (index: number) => {
    setWorkItems(workItems.filter((_, i) => i !== index));
  };

  const calculateTotals = () => {
    let materialCost = 0;
    let laborCost = 0;

    workItems.forEach(item => {
      laborCost += item.quantity * item.laborPricePerUnit;
      item.materialPrices.forEach(mp => {
        materialCost += item.quantity * mp.consumptionPerWorkUnit * mp.pricePerUnit;
      });
    });

    const matDiscount = parseFloat(materialDiscount) || 0;
    const labDiscount = parseFloat(laborDiscount) || 0;
    
    const materialWithDiscount = materialCost * (1 - matDiscount / 100);
    const laborWithDiscount = laborCost * (1 - labDiscount / 100);

    return {
      materialCost,
      laborCost,
      materialWithDiscount,
      laborWithDiscount,
      total: materialWithDiscount + laborWithDiscount,
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    createMutation.mutate({
      investorName,
      investorAddress,
      workItems,
      materialDiscount: parseFloat(materialDiscount) || 0,
      laborDiscount: parseFloat(laborDiscount) || 0,
      notes: notes || undefined,
      validUntil: validUntil || undefined,
      startDate: startDate || undefined,
    });
  };

  const totals = calculateTotals();

  if (!isAuthenticated) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft size={18} />
        </Button>
        <h1 className="text-3xl font-bold text-foreground">Nowy kosztorys</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Dane podstawowe</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <Input
              label="Nazwa inwestora *"
              value={investorName}
              onChange={(e) => setInvestorName(e.target.value)}
              placeholder="Jan Kowalski"
              required
            />
            <Input
              label="Adres inwestycji *"
              value={investorAddress}
              onChange={(e) => setInvestorAddress(e.target.value)}
              placeholder="ul. Przykładowa 1, Warszawa"
              required
            />
            <Input
              label="Data rozpoczęcia prac"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              label="Ważność kosztorysu do"
              type="date"
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
            />
          </CardContent>
        </Card>

        {/* Work Items */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Pozycje kosztorysu</CardTitle>
            <Button type="button" variant="default" onClick={() => setShowWorkSelector(true)}>
              <Plus size={18} className="mr-2" />
              Dodaj pracę
            </Button>
          </CardHeader>
          <CardContent>
            {workItems.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                Dodaj prace do kosztorysu
              </p>
            ) : (
              <div className="space-y-4">
                {workItems.map((item, index) => (
                  <div key={index} className="neu-pressed p-4 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{item.workName}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-error"
                        onClick={() => removeWorkItem(index)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                    <div className="grid md:grid-cols-3 gap-3">
                      <Input
                        label={`Ilość (${item.unit})`}
                        type="number"
                        step="0.01"
                        value={item.quantity}
                        onChange={(e) => updateWorkItem(index, { quantity: parseFloat(e.target.value) || 0 })}
                      />
                      <Input
                        label="Cena robocizny za jednostkę (zł)"
                        type="number"
                        step="0.01"
                        value={item.laborPricePerUnit}
                        onChange={(e) => updateWorkItem(index, { laborPricePerUnit: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    {item.materialPrices.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <p className="text-sm font-medium text-gray-600">Materiały:</p>
                        {item.materialPrices.map((mp, mpIndex) => (
                          <div key={mpIndex} className="flex items-center gap-2">
                            <span className="text-sm flex-1">
                              {mp.materialName} ({mp.consumptionPerWorkUnit} {mp.unit}/j.)
                            </span>
                            <Input
                              className="w-32"
                              type="number"
                              step="0.01"
                              placeholder="Cena/j."
                              value={mp.pricePerUnit || ''}
                              onChange={(e) => updateMaterialPrice(index, mpIndex, parseFloat(e.target.value) || 0)}
                            />
                            <span className="text-sm text-gray-500">zł</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Work Selector Modal */}
        {showWorkSelector && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md max-h-[80vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Wybierz pracę</CardTitle>
              </CardHeader>
              <CardContent>
                {works?.data?.length === 0 ? (
                  <p className="text-gray-500">Najpierw utwórz prace w zakładce &quot;Prace&quot;</p>
                ) : (
                  <div className="space-y-2">
                    {works?.data?.map((work: Work) => (
                      <button
                        key={work.id}
                        type="button"
                        onClick={() => addWorkItem(work)}
                        className="w-full text-left p-3 rounded-xl hover:neu-convex transition-all"
                      >
                        <div className="font-medium">{work.name}</div>
                        <div className="text-sm text-gray-500">{work.unit}</div>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button type="button" variant="ghost" onClick={() => setShowWorkSelector(false)}>
                  Anuluj
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        {/* Discounts & Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Rabaty i uwagi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Rabat na materiały (%)"
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={materialDiscount}
                onChange={(e) => setMaterialDiscount(e.target.value)}
              />
              <Input
                label="Rabat na robociznę (%)"
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={laborDiscount}
                onChange={(e) => setLaborDiscount(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Uwagi</label>
              <textarea
                className="neu-input w-full px-4 py-3 min-h-[100px]"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Dodatkowe uwagi do kosztorysu..."
              />
            </div>
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
                <span>{formatCurrency(totals.materialCost)}</span>
              </div>
              {parseFloat(materialDiscount) > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Rabat na materiały ({materialDiscount}%):</span>
                  <span>-{formatCurrency(totals.materialCost - totals.materialWithDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Robocizna:</span>
                <span>{formatCurrency(totals.laborCost)}</span>
              </div>
              {parseFloat(laborDiscount) > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Rabat na robociznę ({laborDiscount}%):</span>
                  <span>-{formatCurrency(totals.laborCost - totals.laborWithDiscount)}</span>
                </div>
              )}
              <div className="border-t pt-2 mt-2 flex justify-between text-xl font-bold">
                <span>RAZEM:</span>
                <span className="text-primary">{formatCurrency(totals.total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            Anuluj
          </Button>
          <Button type="submit" variant="primary" isLoading={createMutation.isPending}>
            Utwórz kosztorys
          </Button>
        </div>
      </form>
    </div>
  );
}
