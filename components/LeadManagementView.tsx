import React, { useState, useMemo } from 'react';
import { Lead, LeadStatus, Client } from '../types';
import KanbanBoard from './KanbanBoard';
import Modal from './Modal';
import AddLeadForm from './AddLeadForm';
import { PlusIcon, UsersGroupIcon } from './icons';
import { useData } from '../hooks/useData';

interface LeadManagementViewProps {
    onSelectLead: (leadId: number) => void;
    onStartSale: (leadId: number, clientId: number) => void;
}

type SortKey = 'createdAt' | 'negotiatedValue';
type SortDirection = 'asc' | 'desc';

const LeadManagementView: React.FC<LeadManagementViewProps> = ({ onSelectLead, onStartSale }) => {
    const { selectedFranchiseData, handlers } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({ key: 'createdAt', direction: 'desc' });

    if (!selectedFranchiseData) return null;

    const { franchise, leads, clients, products, franchiseUsers } = selectedFranchiseData;
    const { addLead, addClient, updateLeadStatus } = handlers;

    const handleAddLeadSubmit = async (
        leadData: Omit<Lead, 'id' | 'franchiseId' | 'createdAt' | 'status' | 'clientId'>,
        clientData: Omit<Client, 'id' | 'franchiseId' | 'cpfOrCnpj'>,
        existingClientId?: number
    ) => {
        let clientId: number;
        if (existingClientId) {
            clientId = existingClientId;
        } else {
            const newClient = await addClient({ ...clientData, franchiseId: franchise.id });
            clientId = newClient.id;
        }

        await addLead({ ...leadData, franchiseId: franchise.id, clientId });
    };

    const sortedLeads = useMemo(() => {
        const sortableLeads = [...leads];
        sortableLeads.sort((a, b) => {
            const directionMultiplier = sortConfig.direction === 'asc' ? 1 : -1;

            if (sortConfig.key === 'createdAt') {
                return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * directionMultiplier;
            }
            if (sortConfig.key === 'negotiatedValue') {
                const valA = a.negotiatedValue ?? 0;
                const valB = b.negotiatedValue ?? 0;
                return (valA - valB) * directionMultiplier;
            }
            return 0;
        });
        return sortableLeads;
    }, [leads, sortConfig]);
    
    const allowedProducts = franchise.allowedProductIds
      ? products.filter((p: any) => franchise.allowedProductIds!.includes(p.id) && p.isActive)
      : products.filter((p: any) => p.isActive);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <UsersGroupIcon className="w-8 h-8 text-primary"/>
                    <h2 className="text-2xl font-bold text-gray-800">Funil de Vendas / Leads</h2>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center bg-primary hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105">
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Novo Lead
                </button>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md flex flex-col sm:flex-row items-center justify-end gap-4">
                <div className="flex items-center gap-2">
                    <label htmlFor="sort-key" className="text-sm font-medium text-gray-700">Ordenar por:</label>
                    <select
                        id="sort-key"
                        value={sortConfig.key}
                        onChange={(e) => setSortConfig(prev => ({ ...prev, key: e.target.value as SortKey }))}
                        className="input-style !mt-0 !py-1.5"
                    >
                        <option value="createdAt">Data de Criação</option>
                        <option value="negotiatedValue">Valor Negociado</option>
                    </select>
                </div>
                 <div className="flex items-center gap-2">
                    <label htmlFor="sort-direction" className="text-sm font-medium text-gray-700">Ordem:</label>
                    <select
                        id="sort-direction"
                        value={sortConfig.direction}
                        onChange={(e) => setSortConfig(prev => ({ ...prev, direction: e.target.value as SortDirection }))}
                        className="input-style !mt-0 !py-1.5"
                    >
                        <option value="desc">Descendente</option>
                        <option value="asc">Ascendente</option>
                    </select>
                </div>
            </div>
            
            <KanbanBoard leads={sortedLeads} clients={clients} onUpdateLeadStatus={updateLeadStatus} onSelectLead={onSelectLead} />

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Adicionar Novo Lead" maxWidth="max-w-3xl">
                <AddLeadForm onSubmit={handleAddLeadSubmit} onClose={() => setIsModalOpen(false)} clients={clients} allowedProducts={allowedProducts} franchiseUsers={franchiseUsers} />
            </Modal>
        </div>
    );
};

export default LeadManagementView;