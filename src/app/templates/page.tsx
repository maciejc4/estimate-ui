'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/store';
import { templatesApi, worksApi, RenovationTemplate, Work } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';

function TemplatesContent() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  
  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<RenovationTemplate | null>(null);
  const [formData, setFormData] = useState({ name: '' });
  const [selectedWorkIds, setSelectedWorkIds] = useState<string[]>([]);

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

  const { data: templates, isLoading } = useQuery({
    queryKey: ['templates'],
    queryFn: () => templatesApi.getAll(),
    enabled: isAuthenticated,
  });

  const { data: works } = useQuery({
    queryKey: ['works'],
    queryFn: () => worksApi.getAll(),
    enabled: isAuthenticated,
  });

  const createMutation = useMutation({
    mutationFn: (data: { name: string; workIds: string[] }) =>
      templatesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name: string; workIds: string[] } }) =>
      templatesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => templatesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });

  const resetForm = () => {
    setShowForm(false);
    setEditingTemplate(null);
    setFormData({ name: '' });
    setSelectedWorkIds([]);
  };

  const handleEdit = (template: RenovationTemplate) => {
    setEditingTemplate(template);
    setFormData({ name: template.name });
    setSelectedWorkIds(template.workIds || []);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { name: formData.name, workIds: selectedWorkIds };
    
    if (editingTemplate) {
      updateMutation.mutate({ id: editingTemplate.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const toggleWork = (workId: string) => {
    setSelectedWorkIds(prev =>
      prev.includes(workId)
        ? prev.filter(id => id !== workId)
        : [...prev, workId]
    );
  };

  if (!isAuthenticated) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Szablony remontowe</h1>
        <Button variant="primary" onClick={() => setShowForm(true)}>
          <Plus size={18} className="mr-2" />
          Nowy szablon
        </Button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{editingTemplate ? 'Edytuj szablon' : 'Nowy szablon'}</CardTitle>
              <button onClick={resetForm} className="text-gray-500 hover:text-foreground">
                <X size={24} />
              </button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Nazwa szablonu"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="np. Remont łazienki"
                  required
                />

                {/* Works selection */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium">Wybierz prace</label>
                  {works?.data?.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      Najpierw utwórz prace w zakładce &quot;Prace&quot;
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {works?.data?.map((work: Work) => (
                        <div
                          key={work.id}
                          onClick={() => toggleWork(work.id)}
                          className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                            selectedWorkIds.includes(work.id)
                              ? 'neu-pressed bg-primary/10'
                              : 'hover:neu-convex'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            selectedWorkIds.includes(work.id)
                              ? 'bg-primary border-primary'
                              : 'border-gray-300'
                          }`}>
                            {selectedWorkIds.includes(work.id) && (
                              <Check size={14} className="text-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{work.name}</div>
                            <div className="text-sm text-gray-500">{work.unit}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
                    {editingTemplate ? 'Zapisz' : 'Utwórz'}
                  </Button>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Templates List */}
      {isLoading ? (
        <div className="text-center py-12">Ładowanie...</div>
      ) : templates?.data?.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-gray-500 mb-4">Nie masz jeszcze żadnych szablonów</p>
          <Button variant="primary" onClick={() => setShowForm(true)}>
            Utwórz pierwszy szablon
          </Button>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates?.data?.map((template: RenovationTemplate) => (
            <Card key={template.id}>
              <CardHeader>
                <CardTitle>{template.name}</CardTitle>
              </CardHeader>
              <CardContent>
                {template.works && template.works.length > 0 ? (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-600">Prace:</p>
                    {template.works.map((work) => (
                      <p key={work.id} className="text-sm text-gray-500">
                        • {work.name} ({work.unit})
                      </p>
                    ))}
                  </div>
                ) : template.workIds && template.workIds.length > 0 ? (
                  <p className="text-sm text-gray-500">
                    {template.workIds.length} prac(e)
                  </p>
                ) : (
                  <p className="text-sm text-gray-400">Brak prac</p>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" onClick={() => handleEdit(template)}>
                  <Pencil size={16} className="mr-1" />
                  Edytuj
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-error"
                  onClick={() => {
                    if (confirm('Czy na pewno chcesz usunąć ten szablon?')) {
                      deleteMutation.mutate(template.id);
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

export default function TemplatesPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Ładowanie...</div>}>
      <TemplatesContent />
    </Suspense>
  );
}
