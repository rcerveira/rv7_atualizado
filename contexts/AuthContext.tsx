import React, { createContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { AuthenticatedUser } from '../types';
import { initialSystemUsers, initialFranchiseUsers } from '../data/initialData';

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

    useEffect(() => {
        // Em um ambiente sem Supabase, apenas finalizamos o carregamento inicial.
        setLoading(false);
    }, []);
    
    const login = useCallback(async (email: string, pass: string) => {
        // Simula a verificação de senha. Para os dados de exemplo, usamos 'password123'.
        if (pass !== 'password123') {
            throw new Error('Credenciais inválidas. Verifique seu e-mail e senha.');
        }

        // Procura o usuário na lista de usuários do sistema (franqueadora).
        const systemUser = initialSystemUsers.find(u => u.email === email);
        if (systemUser) {
            setUser({
                id: `system-${systemUser.id}`, // ID de autenticação simulado
                email: systemUser.email,
                role: 'FRANCHISOR',
                name: systemUser.name,
            });
            return;
        }

        // Procura o usuário na lista de usuários de franquia.
        const franchiseUser = initialFranchiseUsers.find(u => u.email === email);
        if (franchiseUser) {
            setUser({
                id: `franchise-${franchiseUser.id}`, // ID de autenticação simulado
                email: franchiseUser.email,
                role: 'FRANCHISEE',
                franchiseId: franchiseUser.franchiseId,
                name: franchiseUser.name,
            });
            return;
        }
        
        // Se não encontrar em nenhuma lista, o login falha.
        throw new Error('Credenciais inválidas. Verifique seu e-mail e senha.');
    }, []);


    const logout = useCallback(async () => {
        // Simplesmente limpa o estado do usuário.
        setUser(null);
    }, []);

    const value = { user, login, logout, loading };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};