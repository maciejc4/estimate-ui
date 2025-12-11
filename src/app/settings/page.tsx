'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { userApi } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function SettingsPage() {
  const { user, isAuthenticated, logout, updateUser } = useAuthStore();
  const router = useRouter();
  
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (user) {
      setCompanyName(user.companyName || '');
      setPhone(user.phone || '');
    }
  }, [isAuthenticated, user, router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await userApi.updateMe({ companyName, phone });
      updateUser({ companyName, phone });
      setMessage({ type: 'success', text: 'Profil został zaktualizowany' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Błąd aktualizacji profilu' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Hasła nie są identyczne' });
      return;
    }

    if (newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Nowe hasło musi mieć minimum 8 znaków' });
      return;
    }

    setIsLoading(true);

    try {
      await userApi.updateMe({ currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setMessage({ type: 'success', text: 'Hasło zostało zmienione' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Błąd zmiany hasła' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Czy na pewno chcesz usunąć swoje konto? Ta operacja jest nieodwracalna.')) {
      return;
    }

    setIsLoading(true);

    try {
      await userApi.deleteMe();
      logout();
      router.push('/');
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Błąd usuwania konta' });
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-foreground">Ustawienia</h1>

      {message && (
        <div className={`p-4 rounded-xl ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Dane firmy</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <p className="text-sm text-gray-500 mb-4">
              Te dane będą widoczne na generowanych kosztorysach PDF.
            </p>
            
            <Input
              label="Email"
              type="email"
              value={user?.email || ''}
              disabled
              className="opacity-60"
            />
            
            <Input
              label="Nazwa firmy"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Twoja firma budowlana"
            />
            
            <Input
              label="Telefon"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+48 123 456 789"
            />
            
            <Button type="submit" variant="primary" isLoading={isLoading}>
              Zapisz zmiany
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle>Zmiana hasła</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <Input
              label="Aktualne hasło"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
            
            <Input
              label="Nowe hasło"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 8 znaków"
              required
            />
            
            <Input
              label="Potwierdź nowe hasło"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            
            <Button type="submit" variant="primary" isLoading={isLoading}>
              Zmień hasło
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-2 border-red-200">
        <CardHeader>
          <CardTitle className="text-error">Strefa niebezpieczna</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-4">
            Usunięcie konta jest nieodwracalne. Wszystkie Twoje dane (prace, szablony, kosztorysy) zostaną trwale usunięte.
          </p>
          <Button variant="danger" onClick={handleDeleteAccount} isLoading={isLoading}>
            Usuń konto
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
