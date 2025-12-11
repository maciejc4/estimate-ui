'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Hammer, 
  Layers, 
  FileText, 
  Settings, 
  LogOut,
  Users,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/works', label: 'Prace', icon: Hammer },
  { href: '/templates', label: 'Szablony', icon: Layers },
  { href: '/estimates', label: 'Kosztorysy', icon: FileText },
  { href: '/settings', label: 'Ustawienia', icon: Settings },
];

const adminItems = [
  { href: '/admin/users', label: 'Użytkownicy', icon: Users },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!isAuthenticated) return null;

  const isAdmin = user?.role === 'ADMIN';

  return (
    <nav className="neu-flat bg-background p-4 mb-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="text-xl font-bold text-primary">
            Estimate
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200',
                    pathname === item.href
                      ? 'neu-pressed text-primary'
                      : 'hover:neu-convex text-foreground hover:text-primary'
                  )}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            
            {isAdmin && adminItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200',
                    pathname === item.href
                      ? 'neu-pressed text-secondary'
                      : 'hover:neu-convex text-foreground hover:text-secondary'
                  )}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl hover:neu-convex text-error transition-all duration-200"
            >
              <LogOut size={18} />
              <span>Wyloguj</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden neu-button p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-200',
                    pathname === item.href
                      ? 'neu-pressed text-primary'
                      : 'hover:neu-convex text-foreground'
                  )}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            
            {isAdmin && adminItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-200',
                    pathname === item.href
                      ? 'neu-pressed text-secondary'
                      : 'hover:neu-convex text-foreground'
                  )}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <button
              onClick={() => { logout(); setMobileMenuOpen(false); }}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-error w-full"
            >
              <LogOut size={18} />
              <span>Wyloguj</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
