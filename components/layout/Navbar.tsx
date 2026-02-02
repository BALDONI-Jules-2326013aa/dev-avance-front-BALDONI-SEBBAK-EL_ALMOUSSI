'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import {
  GraduationCap,
  BookOpen,
  ClipboardList,
  LogOut,
  Menu,
  X,
  User
} from 'lucide-react';
import Button from '@/components/ui/Button';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Cours', href: '/courses', icon: BookOpen },
    { name: 'Mes résultats', href: '/my-results', icon: ClipboardList },
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo et navigation principale */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <GraduationCap className="w-8 h-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">EduLearn</span>
            </Link>

            {/* Navigation desktop */}
            {isAuthenticated && (
              <div className="hidden md:flex items-center ml-10 gap-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive(item.href)
                          ? 'bg-indigo-50 text-indigo-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Actions utilisateur */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {/* Info utilisateur desktop */}
                <div className="hidden md:flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">
                      {user?.email}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    leftIcon={<LogOut className="w-4 h-4" />}
                  >
                    Déconnexion
                  </Button>
                </div>

                {/* Menu burger mobile */}
                <button
                  className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </button>
              </>
            ) : (
              <Link href="/login">
                <Button size="sm">Se connecter</Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      {isAuthenticated && isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100">
          <div className="px-4 py-3 space-y-1">
            {/* Info utilisateur */}
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg mb-3">
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">
                {user?.email}
              </span>
            </div>

            {/* Navigation */}
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${
                    isActive(item.href)
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}

            {/* Déconnexion */}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleLogout();
              }}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-5 h-5" />
              Déconnexion
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
