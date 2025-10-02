import React, { useState, useMemo } from 'react';
import { Lead, LeadNote, Task, Client, LeadStatus } from '../types';
import { ArrowLeftIcon, MailIcon, PhoneIcon, PencilAltIcon, DocumentReportIcon, CashIcon, UserIcon, BriefcaseIcon, WhatsAppIcon } from './icons';
import AddNoteForm from './AddNoteForm';
import ActivityFeed from './ActivityFeed';
import AISummary from './AISummary';
import { useData } from '../hooks/useData';
import Modal from './Modal';
import AddLeadForm from './AddLeadForm';
import { useAuth } from '../hooks/useAuth';
import { formatPhoneNumberForWhatsApp } from '../utils/formatters';

interface LeadDetailViewProps {
    lead: Lead;
    client?: Client;
    notes: LeadNote[];
    tasks: Task[];
    onBack: () => void;
    onStartSale: (leadId: number, clientId: number) => void;
    onNavigateToDetails: () => void;
}

const LeadDetailView: React.FC<LeadDetailViewProps> = ({ lead, client, notes, tasks, onBack, onStartSale, onNavigateToDetails }) => {
    const { handlers, selectedFranchiseData } = useData();
    const { user } = useAuth();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    
    if (!client || !selectedFranchiseData) {
        return (
             <div className="bg-background min-h-screen text-text-primary p-4 sm:p-6 lg:p-8 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold">Cliente não encontrado</h2>
                    <p className="text-text-secondary mt-2">O cliente associado a este lead não foi encontrado.</p>
                     <button onClick={onBack} className="mt-6 flex items-center text-sm font-medium text-primary hover:text-blue-800">
                        <ArrowLeftIcon className="w-5 h-5 mr-2" />
                        Voltar para o Funil
                    </button>
                </div>
             </div>
        );
    }

    const { franchise, franchiseUsers } = selectedFranchiseData;
    const isFranchisorView = user?.role === 'FRANCHISOR';

    const responsiblePerson = useMemo(() => {
        if (lead.salespersonId) {
            const salesperson = franchiseUsers.find(u => u.id === lead.salespersonId);
            if (salesperson) return salesperson.name;
        }
        return franchise.ownerName;
    }, [lead.salespersonId, franchiseUsers, franchise.ownerName]);
    
    // FIX: Make the function async and await handler calls to match the Promise return type expected by the form's onSubmit prop.
     const handleLeadUpdate = async (
        leadData: Omit<Lead, 'id' | 'franchiseId' | 'createdAt' | 'status' | 'clientId'>,
        clientData: Omit<Client, 'id' | 'franchiseId' | 'cpfOrCnpj'>,
        existingClientId?: number
    ) => {
        if (existingClientId) {
            const fullClientData: Client = {
                ...client, // old data for createdAt etc.
                ...clientData, // new data from form
                id: existingClientId,
                franchiseId: client.franchiseId
            };
            await handlers.updateClient(fullClientData);
        }
        
        const fullLeadData: Lead = {
            ...lead,
            ...leadData
        };
        await handlers.updateLead(fullLeadData);
        
        setIsEditModalOpen(false);
    };

    return (
        <div className="bg-background min-h-screen text-text-primary p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-6">
                    <button onClick={onBack} className="flex items-center text-sm font-medium text-primary hover:text-blue-800 mb-6">
                        <ArrowLeftIcon className="w-5 h-5 mr-2" />
                        Voltar para o Funil
                    </button>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                             <div>
                                <h1 className="text-3xl font-bold text-gray-800">{client.name}</h1>
                                <div className="flex flex-wrap gap-x-6 gap-y-2 text-text-secondary mt-2">
                                    <p className="flex items-center"><MailIcon className="w-5 h-5 mr-2" /> {client.email}</p>
                                    <p className="flex items-center">
                                        <PhoneIcon className="w-5 h-5 mr-2" />
                                        <span>{client.phone}</span>
                                        {client.phone && (
                                            <a href={`https://wa.me/${formatPhoneNumberForWhatsApp(client.phone)}`} target="_blank" rel="noopener noreferrer" className="ml-2 text-green-500 hover:text-green-600 p-1 rounded-full hover:bg-green-100 transition-colors">
                                                <WhatsAppIcon className="w-5 h-5" />
                                            </a>
                                        )}
                                    </p>
                                    <p className="flex items-center">
                                        <CashIcon className="w-5 h-5 mr-2" /> 
                                        {lead.negotiatedValue ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(lead.negotiatedValue) : 'Valor não definido'}
                                    </p>
                                    <p className="flex items-center">
                                        <UserIcon className="w-5 h-5 mr-2" /> 
                                        Responsável: {responsiblePerson}
                                    </p>
                                </div>
                             </div>
                             <div className="flex items-center space-x-2 flex-shrink-0">
                                {lead.status === LeadStatus.WON && (
                                     <button onClick={() => onStartSale(lead.id, client.id)} className="button-primary">
                                        <DocumentReportIcon className="w-5 h-5 mr-2" />
                                        Criar Venda
                                    </button>
                                )}
                                <button onClick={() => setIsEditModalOpen(true)} className="flex items-center text-sm font-medium text-primary hover:text-blue-800 p-2 rounded-lg hover:bg-gray-100">
                                    <PencilAltIcon className="w-5 h-5 mr-2" />
                                    Editar
                                </button>
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${lead.serviceOfInterest === 'Consórcio' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                Interesse: {lead.serviceOfInterest}
                            </span>
                        </div>
                    </div>
                </header>
                 
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-2">Informações da Franquia</h2>
                            <p className="text-sm text-gray-500">Nome da Franquia</p>
                            <p className="font-semibold text-lg">{franchise.name}</p>
                        </div>
                        {isFranchisorView ? (
                            <button onClick={onNavigateToDetails} className="button-secondary text-sm mt-4 sm:mt-0">
                                <BriefcaseIcon className="w-4 h-4 mr-2" />
                                Ver Detalhes
                            </button>
                        ) : (
                            <div className="mt-4 sm:mt-0 sm:text-right">
                                <p className="text-sm text-gray-500">Proprietário</p>
                                <p className="font-semibold text-lg">{franchise.ownerName}</p>
                            </div>
                        )}
                    </div>
                </div>

                <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                         <AISummary leadName={client.name} notes={notes} tasks={tasks} />
                         <ActivityFeed notes={notes} tasks={tasks} />
                    </div>
                    <div>
                        <AddNoteForm leadId={lead.id} onAddNote={handlers.addNote} />
                    </div>
                </main>
            </div>
            
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Editar Lead e Cliente" maxWidth="max-w-3xl">
                <AddLeadForm
                    onSubmit={handleLeadUpdate}
                    onClose={() => setIsEditModalOpen(false)}
                    clients={selectedFranchiseData.clients}
                    allowedProducts={selectedFranchiseData.products}
                    franchiseUsers={selectedFranchiseData.franchiseUsers}
                    initialData={{ lead, client }}
                />
            </Modal>
        </div>
    );
};

export default LeadDetailView;