import React, { createContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { AuthenticatedUser } from '../types';
import { initialSystemUsers, initialFranchiseUsers } from '../data/initialData';
import { areSupabaseCredentialsSet, supabase } from '../utils/supabaseClient';
import { useToast } from '../components/ToastProvider';

interface AuthContextType {
    user: AuthenticatedUser | null;
    login: (email: string, pass: string) => Promise<void>;
    logout: () => Promise<void>;
    loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthenticatedUser | null>(null);
    const [loading, setLoading] = useState(true);
    const { notify } = useToast();
    const forceDemoAuth = typeof window !== 'undefined' && localStorage.getItem('forceDemoAuth') === 'true';
    const supabaseActive = areSupabaseCredentialsSet && !!supabase && !forceDemoAuth;

    useEffect(() => {
        let unsub: (() => void) | undefined;

        const bootstrap = async () => {
            // Aviso quando override DEMO estiver ativo mesmo com credenciais Supabase
            if (forceDemoAuth && areSupabaseCredentialsSet) {
                notify({ type: 'info', message: 'DEMO override ativo. Usando autenticação e dados locais.' });
            }
            // Se o cliente Supabase está ativo, sincroniza sessão e ouve mudanças.
            if (supabaseActive) {
                setLoading(true);
                // Sessão atual (refresh de página)
                const { data: sessionData } = await supabase.auth.getSession();
                const session = sessionData?.session ?? null;

                const resolveProfile = async (uid: string, email: string | null): Promise<AuthenticatedUser | null> => {
                    // 1) Tenta system_users (franqueadora)
                    const { data: sysByUid } = await supabase
                        .from('system_users')
                        .select('id, name, email, role')
                        .eq('auth_user_id', uid)
                        .maybeSingle();

                    if (sysByUid) {
                        return {
                            id: uid,
                            email: sysByUid.email,
                            role: 'FRANCHISOR',
                            name: sysByUid.name,
                        };
                    }

                    // fallback por e-mail (caso auth_user_id ainda não esteja preenchido)
                    if (email) {
                        const { data: sysByEmail } = await supabase
                            .from('system_users')
                            .select('id, name, email, role')
                            .eq('email', email)
                            .maybeSingle();
                        if (sysByEmail) {
                            return {
                                id: uid,
                                email: sysByEmail.email,
                                role: 'FRANCHISOR',
                                name: sysByEmail.name,
                            };
                        }
                    }

                    // 2) Tenta franchise_users (franqueado)
                    const { data: frByUid } = await supabase
                        .from('franchise_users')
                        .select('id, name, email, role, franchise_id')
                        .eq('auth_user_id', uid)
                        .maybeSingle();

                    if (frByUid) {
                        return {
                            id: uid,
                            email: frByUid.email,
                            role: 'FRANCHISEE',
                            franchiseId: frByUid.franchise_id,
                            name: frByUid.name,
                        };
                    }

                    if (email) {
                        const { data: frByEmail } = await supabase
                            .from('franchise_users')
                            .select('id, name, email, role, franchise_id')
                            .eq('email', email)
                            .maybeSingle();

                        if (frByEmail) {
                            return {
                                id: uid,
                                email: frByEmail.email,
                                role: 'FRANCHISEE',
                                franchiseId: frByEmail.franchise_id,
                                name: frByEmail.name,
                            };
                        }
                    }

                    return null;
                };

                if (session?.user) {
                    const profile = await resolveProfile(session.user.id, session.user.email ?? null);
                    if (profile) setUser(profile);
                }

                // Listener de auth
                const { data: sub } = supabase.auth.onAuthStateChange(async (_event, s) => {
                    if (s?.user) {
                        const profile = await resolveProfile(s.user.id, s.user.email ?? null);
                        setUser(profile);
                    } else {
                        setUser(null);
                    }
                    setLoading(false);
                });
                unsub = () => sub.subscription.unsubscribe();
                setLoading(false);
                return;
            }

            // Sem Supabase: finaliza carregamento (modo DEMO/mock)
            setLoading(false);
        };

        bootstrap();

        return () => {
            if (unsub) unsub();
        };
    }, []);
    
    const login = useCallback(async (email: string, pass: string) => {
        // Se Supabase estiver habilitado, usa Auth real
        if (supabaseActive) {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
            if (error) {
                notify({ type: 'error', message: error.message || 'Falha no login' });
                throw new Error(error.message || 'Falha no login');
            }
            notify({ type: 'success', message: 'Login realizado com sucesso.' });
            // Perfil será resolvido pelo listener de onAuthStateChange no useEffect.
            return;
        }

        // Fallback DEMO (sem Supabase)
        if (pass !== 'password123') {
            notify({ type: 'error', message: 'Credenciais inválidas. Verifique seu e-mail e senha.' });
            throw new Error('Credenciais inválidas. Verifique seu e-mail e senha.');
        }

        const systemUser = initialSystemUsers.find(u => u.email === email);
        if (systemUser) {
            setUser({
                id: `system-${systemUser.id}`,
                email: systemUser.email,
                role: 'FRANCHISOR',
                name: systemUser.name,
            });
            return;
        }

        const franchiseUser = initialFranchiseUsers.find(u => u.email === email);
        if (franchiseUser) {
            setUser({
                id: `franchise-${franchiseUser.id}`,
                email: franchiseUser.email,
                role: 'FRANCHISEE',
                franchiseId: franchiseUser.franchiseId,
                name: franchiseUser.name,
            });
            return;
        }
        
        throw new Error('Credenciais inválidas. Verifique seu e-mail e senha.');
    }, []);


    const logout = useCallback(async () => {
        if (supabaseActive) {
            await supabase.auth.signOut();
        }
        setUser(null);
        notify({ type: 'info', message: 'Sessão encerrada.' });
    }, [notify]);

    const value = { user, login, logout, loading };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};