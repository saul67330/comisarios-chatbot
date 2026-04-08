'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError('Credenciales incorrectas');
      setLoading(false);
      return;
    }

    router.push('/admin');
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="bg-surface-container-high p-8 rounded-2xl w-full max-w-md border border-outline-variant/10 shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
        
        <div className="text-center mb-10">
          <h1 className="font-headline text-4xl text-primary font-bold italic mb-2">Comisarios</h1>
          <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant font-bold">Admin Portal</p>
        </div>

        {error && (
          <div className="bg-error/10 border border-error/20 text-error p-4 rounded-xl mb-6 text-sm font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="block font-label text-[10px] uppercase tracking-widest text-primary font-bold">Email</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-3 text-on-surface-variant/50 text-sm">person</span>
              <input
                type="email"
                className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl py-3 pl-10 pr-4 text-sm text-on-surface focus:outline-none focus:border-primary/50 transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@comisarios.com"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block font-label text-[10px] uppercase tracking-widest text-primary font-bold">Contraseña</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-3 text-on-surface-variant/50 text-sm">lock</span>
              <input
                type="password"
                className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl py-3 pl-10 pr-4 text-sm text-on-surface focus:outline-none focus:border-primary/50 transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          <button 
            type="submit" 
            className="w-full mt-4 bg-gradient-to-tr from-primary to-primary-container text-on-primary-container py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-[0_10px_20px_rgba(212,175,55,0.2)] disabled:opacity-50 disabled:hover:scale-100"
            disabled={loading}
          >
            {loading ? 'Verificando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
