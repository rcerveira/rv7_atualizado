import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Lê as credenciais do ambiente (Vite)
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string | undefined;

// Exposto para que a aplicação saiba se deve usar Supabase ou fallback de dados locais.
export const areSupabaseCredentialsSet: boolean = Boolean(supabaseUrl && supabaseAnonKey);

// Cliente Supabase ativo quando as credenciais existem; caso contrário, null.
// A aplicação pode verificar `areSupabaseCredentialsSet` para decidir pelo fallback.
export const supabase: SupabaseClient | null = areSupabaseCredentialsSet
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;
