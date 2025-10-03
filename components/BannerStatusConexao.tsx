import React, { useMemo } from 'react';
import { areSupabaseCredentialsSet, supabase } from '../utils/supabaseClient';
import { useAuth } from '../hooks/useAuth';

const BannerStatusConexao: React.FC = () => {
  const { user } = useAuth();

  // Considera "remoto habilitado" apenas quando:
  // - As variáveis de ambiente do Supabase existem
  // - O cliente foi criado (não é null)
  // - Há usuário autenticado
  // - E não há override de DEMO ativo
  const forceDemoAuth = typeof window !== 'undefined' && localStorage.getItem('forceDemoAuth') === 'true';
  const remoteEnabled = useMemo(() => {
    return Boolean(areSupabaseCredentialsSet && supabase && user && !forceDemoAuth);
  }, [user, forceDemoAuth]);

  if (!user) return null;

  const supabaseProject =
    ((import.meta as any).env?.VITE_SUPABASE_URL as string | undefined)?.replace(/^https?:\/\//, '') || '';

  return (
    <div
      className={`mb-4 rounded-xl border ${
        remoteEnabled
          ? 'bg-green-50 border-green-200 text-green-800'
          : 'bg-amber-50 border-amber-200 text-amber-800'
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <span
            className={`inline-block w-2.5 h-2.5 rounded-full mr-2 ${
              remoteEnabled ? 'bg-green-500' : 'bg-amber-500'
            }`}
            aria-hidden="true"
          />
          <p className="text-sm font-bold">
            {remoteEnabled ? 'Conectado ao Supabase' : 'Modo DEMO (dados locais)'}
          </p>
        </div>

        <div className="text-xs font-medium">
          {remoteEnabled ? (
            <div className="flex items-center gap-2">
              <span
                className="px-2 py-0.5 rounded-full bg-green-100 border border-green-200 text-green-800"
                title="Row Level Security"
              >
                RLS ativo
              </span>
              <span title="Projeto Supabase">
                {supabaseProject || 'Projeto configurado'}
              </span>
              <span className="opacity-40">|</span>
              <span title="Usuário">{user?.email}</span>
              <span
                className="px-2 py-0.5 rounded-full bg-blue-100 border border-blue-200 text-blue-800"
                title="Papel do usuário"
              >
                {user?.role === 'FRANCHISOR' ? 'Franqueadora' : 'Franqueado'}
              </span>
            </div>
          ) : (
            areSupabaseCredentialsSet && forceDemoAuth ? (
              <span title="Override de autenticação">
                Modo DEMO (forçado)
              </span>
            ) : (
              <span title="Dica de configuração">
                Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY para ativar persistência e RLS
              </span>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default BannerStatusConexao;
