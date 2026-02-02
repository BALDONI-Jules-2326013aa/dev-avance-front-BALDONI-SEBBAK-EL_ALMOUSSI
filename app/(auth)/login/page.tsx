'use client';

import React, { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Card, CardBody } from '@/components/ui/Card';
import { GraduationCap, Mail, Lock, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Redirection si déjà authentifié
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push('/courses');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login({ email, password });
      router.push('/courses');
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Identifiants invalides');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4">
      <div className="w-full max-w-md">
        {/* Logo et titre */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <GraduationCap className="w-12 h-12 text-indigo-600" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            Bienvenue sur EduLearn
          </h1>
          <p className="text-gray-600 mt-2">
            Connectez-vous pour accéder à vos cours
          </p>
        </div>

        <Card>
          <CardBody className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Message d'erreur */}
              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Email */}
              <Input
                type="email"
                label="Adresse email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-5 h-5" />}
                required
                autoComplete="email"
              />

              {/* Mot de passe */}
              <Input
                type="password"
                label="Mot de passe"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="w-5 h-5" />}
                required
                autoComplete="current-password"
              />

              {/* Bouton de connexion */}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                isLoading={isSubmitting}
              >
                Se connecter
              </Button>
            </form>
          </CardBody>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-8">
          Plateforme e-learning pour étudiants
        </p>
      </div>
    </div>
  );
}
