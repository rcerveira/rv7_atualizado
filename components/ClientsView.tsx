import React, { useState, useMemo } from 'react';
import { Client, ClientType } from '../types';
import { PlusIcon, UsersIcon, PencilAltIcon, WhatsAppIcon } from './icons';
import Modal from './Modal';
import AddClientForm from './AddClientForm';
import { useData } from '../hooks/useData';
import { formatPhoneNumberForWhatsApp } from '../utils/formatters';

type SortKey = 'name' | 'createdAt' | 'type';
type SortDirection = 'asc' | 'desc';

const ClientsView: React.FC = () => {
    const { selectedFranchiseData, handlers } = useData();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({ key: 'createdAt', direction: 'desc' });

    if (!selectedFranchiseData) return null;
    
    const { franchise, clients } = selectedFranchiseData;
    const { addClient, updateClient } = handlers;

    const handleClientSubmit = async (clientData: Omit<Client, 'id' | 'franchiseId' | 'cpfOrCnpj'> | Client) => {
        if ('id' in clientData) {
            await updateClient(clientData);
        } else {
            await addClient({ ...clientData, franchiseId: franchise.id });
        }
        setIsAddModalOpen(false);
        setEditingClient(null);
    };

    const sortedAndFilteredClients = useMemo(() => {
        let filtered = [...clients];

        if (searchTerm.trim()) {
            const lowercasedFilter = searchTerm.toLowerCase();
            filtered = filtered.filter(client =>
                client.name.toLowerCase().includes(lowercasedFilter) ||
                (client.phone && client.phone.toLowerCase().includes(lowercasedFilter)) ||
                (client.email && client.email.toLowerCase().includes(lowercasedFilter)) ||
                (client.cpf && client.cpf.includes(lowercasedFilter)) ||
                (client.cnpj && client.cnpj.includes(lowercasedFilter))
            );
        }

        filtered.sort((a, b) => {
            const directionMultiplier = sortConfig.direction === 'asc' ? 1 : -1;
            const valA = a[sortConfig.key] || '';
            const valB = b[sortConfig.key] || '';
    
            if (sortConfig.key === 'createdAt') {
                return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * directionMultiplier;
            }
    
            if (valA < valB) return -1 * directionMultiplier;
            if (valA > valB) return 1 * directionMultiplier;
            return 0;
        });

        return filtered;
    }, [clients, searchTerm, sortConfig]);

    const requestSort = (key: SortKey) => {
        let direction: SortDirection = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIndicator = (key: SortKey) => {
        if (sortConfig.key !== key) return <span className="text-gray-400">↕</span>;
        return sortConfig.direction === 'asc' ? '↑' : '↓';
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                 <div className="flex items-center space-x-3">
                    <UsersIcon className="w-8 h-8 text-primary"/>
                    <h2 className="text-2xl font-bold text-gray-800">Cadastro de Clientes</h2>
                </div>
                <button onClick={() => setIsAddModalOpen(true)} className="flex items-center justify-center bg-primary hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105">
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Novo Cliente
                </button>
            </div>

             <div className="bg-white p-4 rounded-lg shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="w-full sm:w-1/2 lg:w-1/3">
                    <input
                        type="text"
                        placeholder="Filtrar por nome, doc, telefone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    />
                </div>
            </div>
            
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <button onClick={() => requestSort('name')} className="flex items-center gap-2 hover:text-gray-700">
                                        Nome {getSortIndicator('name')}
                                    </button>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                     <button onClick={() => requestSort('type')} className="flex items-center gap-2 hover:text-gray-700">
                                        Tipo {getSortIndicator('type')}
                                    </button>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documento</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contato</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <button onClick={() => requestSort('createdAt')} className="flex items-center gap-2 hover:text-gray-700">
                                        Cadastrado em {getSortIndicator('createdAt')}
                                    </button>
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sortedAndFilteredClients.length > 0 ? sortedAndFilteredClients.map(client => (
                                <tr key={client.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{client.name}</div>
                                        {client.type === ClientType.PESSOA_JURIDICA && <div className="text-xs text-gray-500">{client.razaoSocial}</div>}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.type}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{(client.type === ClientType.PESSOA_JURIDICA ? client.cnpj : client.cpf) || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {client.phone && (
                                            <div className="flex items-center">
                                                <span>{client.phone}</span>
                                                <a href={`https://wa.me/${formatPhoneNumberForWhatsApp(client.phone)}`} target="_blank" rel="noopener noreferrer" className="ml-2 text-green-500 hover:text-green-600 p-1 rounded-full hover:bg-green-100 transition-colors">
                                                    <WhatsAppIcon className="w-4 h-4" />
                                                </a>
                                            </div>
                                        )}
                                        {client.email && <div>{client.email}</div>}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(client.createdAt).toLocaleDateString('pt-BR')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => setEditingClient(client)} className="text-primary hover:text-blue-700 p-1 rounded-full hover:bg-blue-100 transition-colors">
                                            <PencilAltIcon className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="text-center py-8 text-gray-500">
                                        <p className="font-semibold">Nenhum cliente encontrado.</p>
                                        <p className="text-sm">Tente ajustar seus filtros de busca ou adicione um novo cliente.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isAddModalOpen || !!editingClient} onClose={() => { setIsAddModalOpen(false); setEditingClient(null); }} title={editingClient ? "Editar Cliente" : "Adicionar Novo Cliente"} maxWidth="max-w-3xl">
                <AddClientForm onSubmit={handleClientSubmit} onClose={() => { setIsAddModalOpen(false); setEditingClient(null); }} initialData={editingClient} />
            </Modal>
        </div>
    );
};

export default ClientsView;
