'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/store';
import { api, User } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Trash2 } from 'lucide-react';

export default function AdminUsersPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (user?.role !== 'ADMIN') {
      router.push('/dashboard');
    }
  }, [isAuthenticated, user, router]);

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: () => api.get('/api/admin/users'),
    enabled: isAuthenticated && user?.role === 'ADMIN',
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/api/admin/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });

  if (!isAuthenticated || user?.role !== 'ADMIN') return null;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Zarządzanie użytkownikami</h1>

      {isLoading ? (
        <div className="text-center py-12">Ładowanie...</div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Email</th>
                    <th className="text-left py-2">Firma</th>
                    <th className="text-left py-2">Telefon</th>
                    <th className="text-left py-2">Rola</th>
                    <th className="text-right py-2">Akcje</th>
                  </tr>
                </thead>
                <tbody>
                  {users?.data?.map((u: User) => (
                    <tr key={u.id} className="border-b">
                      <td className="py-3">{u.email}</td>
                      <td className="py-3">{u.companyName || '-'}</td>
                      <td className="py-3">{u.phone || '-'}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                          u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        {u.id !== user?.id && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-error"
                            onClick={() => {
                              if (confirm('Czy na pewno chcesz usunąć tego użytkownika?')) {
                                deleteMutation.mutate(u.id);
                              }
                            }}
                          >
                            <Trash2 size={16} />
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
