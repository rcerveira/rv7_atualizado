import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Logo from '../Logo';
import { SpinnerIcon, ExclamationTriangleIcon } from '../icons';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            // The AuthContext's onAuthStateChange will handle navigation
        } catch (err: any) {
            setError(err.message || 'Ocorreu um erro desconhecido.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    
    const handleDemoLogin = async (demoUser: 'FRANCHISOR' | 'FRANCHISEE') => {
        const demoEmail = demoUser === 'FRANCHISOR' ? 'admin@rv7.com' : 'franqueado.sp@rv7.com';
        const demoPassword = 'password123';
        setEmail(demoEmail);
        setPassword(demoPassword);
        setError('');
        setLoading(true);
        try {
            await login(demoEmail, demoPassword);
        } catch (err: any) {
            setError(err.message || 'Ocorreu um erro desconhecido.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="max-w-lg w-full bg-card rounded-2xl shadow-2xl overflow-hidden">
                <div className="px-8 sm:px-12 py-12">
                    <div className="flex flex-col items-center mb-8">
                         <Logo className="h-20 w-20 mb-4" />
                        <h2 className="text-3xl font-bold text-center text-text-primary">Bem-vindo(a)!</h2>
                        <p className="text-center text-text-secondary mt-2">Faça login para gerenciar suas operações.</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                                Endereço de E-mail
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-style"
                                placeholder="voce@exemplo.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2">
                                Senha
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-style"
                                placeholder="••••••••"
                            />
                        </div>
                        
                        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

                        <div>
                           <button
                                type="submit"
                                disabled={loading}
                                className="w-full button-primary py-3"
                            >
                                {loading ? <SpinnerIcon className="w-5 h-5 animate-spin" /> : 'Entrar'}
                            </button>
                        </div>
                    </form>
                    
                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-border" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-card text-text-secondary">Ou use uma conta de demonstração</span>
                            </div>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-3">
                             <button
                                type="button"
                                onClick={() => handleDemoLogin('FRANCHISOR')}
                                className="w-full inline-flex justify-center py-2 px-4 border border-border rounded-xl shadow-sm bg-card text-sm font-medium text-text-primary hover:bg-gray-50"
                            >
                                Franqueadora
                            </button>
                             <button
                                type="button"
                                onClick={() => handleDemoLogin('FRANCHISEE')}
                                className="w-full inline-flex justify-center py-2 px-4 border border-border rounded-xl shadow-sm bg-card text-sm font-medium text-text-primary hover:bg-gray-50"
                            >
                                Franqueado
                            </button>
                        </div>
                        <div className="mt-6 p-3 bg-amber-50 border-l-4 border-amber-400 text-amber-800 rounded-r-lg">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <ExclamationTriangleIcon className="h-5 w-5 text-amber-500" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-bold">
                                        Importante: A criação de usuários requer 2 passos!
                                    </p>
                                    <ol className="mt-1 text-xs list-decimal list-inside">
                                        <li>Crie o usuário em <span className="font-semibold">Authentication &gt; Users</span> (senha: <span className="font-mono">password123</span>).</li>
                                        <li>Crie um registro correspondente na tabela <span className="font-semibold">`system_users`</span> (franqueadora) ou <span className="font-semibold">`franchise_users`</span> (franqueado).</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;