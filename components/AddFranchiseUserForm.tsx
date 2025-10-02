import React, { useState, useEffect } from 'react';
import { FranchiseUser, FranchiseUserRole } from '../types';

interface AddFranchiseUserFormProps {
    onSubmit: (user: (Omit<FranchiseUser, 'id' | 'franchiseId'> & { password?: string }) | (Omit<FranchiseUser, 'franchiseId'> & { id: number })) => void;
    onClose: () => void;
    initialData?: FranchiseUser | null;
}

const AddFranchiseUserForm: React.FC<AddFranchiseUserFormProps> = ({ onSubmit, onClose, initialData }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<FranchiseUserRole>(FranchiseUserRole.SALESPERSON);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const isEditing = !!initialData;

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setEmail(initialData.email);
            setRole(initialData.role);
        } else {
            setName('');
            setEmail('');
            setRole(FranchiseUserRole.SALESPERSON);
            setPassword('');
            setConfirmPassword('');
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email) {
            alert("Nome e email são obrigatórios.");
            return;
        }
        
        if (!isEditing) {
            if (password.length < 6) {
                alert("A senha deve ter pelo menos 6 caracteres.");
                return;
            }
            if (password !== confirmPassword) {
                alert("As senhas não conferem.");
                return;
            }
        }

        const userData = { name, email, role };
        if (isEditing) {
            onSubmit({ ...userData, id: initialData.id });
        } else {
            onSubmit({ ...userData, password });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome Completo</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    required
                />
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    required
                />
            </div>
            {!isEditing && (
                <>
                     <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Senha</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirmar Senha</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            required
                        />
                    </div>
                </>
            )}
            <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">Função</label>
                <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value as FranchiseUserRole)}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    required
                >
                    {Object.values(FranchiseUserRole).map(r => (
                        <option key={r} value={r}>{r}</option>
                    ))}
                </select>
            </div>
            <div className="flex justify-end pt-4 space-x-2">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                    Cancelar
                </button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-800">
                    {isEditing ? 'Salvar Alterações' : 'Adicionar Membro'}
                </button>
            </div>
        </form>
    );
};

export default AddFranchiseUserForm;