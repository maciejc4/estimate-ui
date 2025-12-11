'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/store';
import { worksApi, Work, Material } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

function WorksContent() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  
  const [showForm, setShowForm] = useState(false);
  const [editingWork, setEditingWork] = useState<Work | null>(null);
  const [formData, setFormData] = useState({ name: '', unit: '' });
  const [materials, setMaterials] = useState<Material[]>([]);
  const [newMaterial, setNewMaterial] = useState({ name: '', unit: '', consumptionPerWorkUnit: '' });

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

  const { data: works, isLoading } = useQuery({
    queryKey: ['works'],
    queryFn: () => worksApi.getAll(),
    enabled: isAuthenticated,
  });

  const createMutation = useMutation({
    mutationFn: (data: { name: string; unit: string; materials: Material[] }) =>
      worksApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['works'] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name: string; unit: string; materials: Material[] } }) =>
      worksApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['works'] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => worksApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['works'] });
    },
  });

  const resetForm = () => {
    setShowForm(false);
    setEditingWork(null);
    setFormData({ name: '', unit: '' });
    setMaterials([]);
    setNewMaterial({ name: '', unit: '', consumptionPerWorkUnit: '' });
  };

  const handleEdit = (work: Work) => {
    setEditingWork(work);
    setFormData({ name: work.name, unit: work.unit });
    setMaterials(work.materials || []);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...formData, materials };
    
    if (editingWork) {
      updateMutation.mutate({ id: editingWork.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const addMaterial = () => {
    if (newMaterial.name && newMaterial.unit && newMaterial.consumptionPerWorkUnit) {
      setMaterials([...materials, {
        name: newMaterial.name,
        unit: newMaterial.unit,
        consumptionPerWorkUnit: parseFloat(newMaterial.consumptionPerWorkUnit),
      }]);
      setNewMaterial({ name: '', unit: '', consumptionPerWorkUnit: '' });
    }
  };

  const removeMaterial = (index: number) => {
    setMaterials(materials.filter((_, i) => i !== index));
  };

  if (!isAuthenticated) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Prace</h1>
        <Button variant="primary" onClick={() => setShowForm(true)}>
          <Plus size={18} className="mr-2" />
          Nowa praca
        </Button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{editingWork ? 'Edytuj pracę' : 'Nowa praca'}</CardTitle>
              <button onClick={resetForm} className="text-gray-500 hover:text-foreground">
                <X size={24} />
              </button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Nazwa pracy"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="np. Malowanie"
                  required
                />
                <Input
                  label="Jednostka"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  placeholder="np. m², mb, szt"
                  required
                />

                {/* Materials */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium">Materiały</label>
                  {materials.map((material, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg">
                      <span className="flex-1">{material.name}</span>
                      <span className="text-sm text-gray-500">
                        {material.consumptionPerWorkUnit} {material.unit}/jednostkę
                      </span>
                      <button
                        type="button"
                        onClick={() => removeMaterial(index)}
                        className="text-error hover:text-red-700"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                  
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      placeholder="Nazwa"
                      value={newMaterial.name}
                      onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
                    />
                    <Input
                      placeholder="Jednostka"
                      value={newMaterial.unit}
                      onChange={(e) => setNewMaterial({ ...newMaterial, unit: e.target.value })}
                    />
                    <Input
                      placeholder="Zużycie"
                      type="number"
                      step="0.01"
                      value={newMaterial.consumptionPerWorkUnit}
                      onChange={(e) => setNewMaterial({ ...newMaterial, consumptionPerWorkUnit: e.target.value })}
                    />
                  </div>
                  <Button type="button" variant="default" size="sm" onClick={addMaterial}>
                    Dodaj materiał
                  </Button>
                </div>

                <CardFooter className="px-0">
                  <Button type="button" variant="ghost" onClick={resetForm}>
                    Anuluj
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={createMutation.isPending || updateMutation.isPending}
                  >
                    {editingWork ? 'Zapisz' : 'Utwórz'}
                  </Button>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Works List */}
      {isLoading ? (
        <div className="text-center py-12">Ładowanie...</div>
      ) : works?.data?.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-gray-500 mb-4">Nie masz jeszcze żadnych prac</p>
          <Button variant="primary" onClick={() => setShowForm(true)}>
            Utwórz pierwszą pracę
          </Button>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {works?.data?.map((work: Work) => (
            <Card key={work.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{work.name}</span>
                  <span className="text-sm font-normal text-gray-500">{work.unit}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {work.materials && work.materials.length > 0 ? (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-600">Materiały:</p>
                    {work.materials.map((mat, idx) => (
                      <p key={idx} className="text-sm text-gray-500">
                        • {mat.name}: {mat.consumptionPerWorkUnit} {mat.unit}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">Brak materiałów</p>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" onClick={() => handleEdit(work)}>
                  <Pencil size={16} className="mr-1" />
                  Edytuj
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-error"
                  onClick={() => {
                    if (confirm('Czy na pewno chcesz usunąć tę pracę?')) {
                      deleteMutation.mutate(work.id);
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

export default function WorksPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Ładowanie...</div>}>
      <WorksContent />
    </Suspense>
  );
}
