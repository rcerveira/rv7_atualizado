import React, { useState, useMemo } from 'react';
import { useData } from '../../hooks/useData';
import { useAuth } from '../../hooks/useAuth';
import { SupportTicket, SupportTicketStatus } from '../../types';
import Modal from '../Modal';
import AddSupportTicketForm from './AddSupportTicketForm';
import SupportChatView from './SupportChatView';
import { PlusIcon, ChatBubbleLeftRightIcon } from '../icons';

const statusColorMap: Record<SupportTicketStatus, string> = {
    [SupportTicketStatus.OPEN]: 'bg-blue-100 text-blue-800 border-l-blue-500',
    [SupportTicketStatus.IN_PROGRESS]: 'bg-yellow-100 text-yellow-800 border-l-yellow-500',
    [SupportTicketStatus.RESOLVED]: 'bg-green-100 text-green-800 border-l-green-500',
    [SupportTicketStatus.CLOSED]: 'bg-gray-100 text-gray-800 border-l-gray-500',
};

const TicketListItem: React.FC<{ ticket: SupportTicket, isSelected: boolean, onSelect: () => void }> = ({ ticket, isSelected, onSelect }) => {
    return (
        <button onClick={onSelect} className={`w-full text-left p-4 border-l-4 transition-colors ${isSelected ? 'bg-blue-50 border-l-primary' : `${statusColorMap[ticket.status]} hover:bg-gray-50`}`}>
            <div className="flex justify-between items-start">
                <p className="font-bold text-sm text-gray-800 truncate">{ticket.subject}</p>
                <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColorMap[ticket.status].replace(/border-l-\w+-\d+/, '')}`}>{ticket.status}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
                {ticket.category} &middot; Última atualização: {new Date(ticket.updatedAt).toLocaleDateString('pt-BR')}
            </p>
        </button>
    );
};

const FranchiseeTicketsView: React.FC = () => {
    const { selectedFranchiseData, handlers } = useData();
    const { user } = useAuth();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);

    if (!selectedFranchiseData) return null;

    const { supportTickets } = selectedFranchiseData;

    const sortedTickets = useMemo(() => {
        return [...supportTickets].sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    }, [supportTickets]);

    const selectedTicket = useMemo(() => {
        if (!selectedTicketId) return null;
        // The ticket from the list might be stale, find the latest version from the main state
        return supportTickets.find(t => t.id === selectedTicketId) || null;
    }, [selectedTicketId, supportTickets]);

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <ChatBubbleLeftRightIcon className="w-8 h-8 text-primary"/>
                        <h2 className="text-2xl font-bold text-gray-800">Meus Tickets de Suporte</h2>
                    </div>
                    <button onClick={() => setIsAddModalOpen(true)} className="flex items-center justify-center bg-primary hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105">
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Abrir Novo Ticket
                    </button>
                </div>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-22rem)]">
                {/* Left Column: Ticket List */}
                <div className={`w-full lg:w-1/3 flex-shrink-0 bg-white rounded-lg shadow-md border overflow-y-auto ${selectedTicket ? 'hidden lg:block' : 'block'}`}>
                    {sortedTickets.length > 0 ? (
                        <div className="divide-y divide-gray-200">
                            {sortedTickets.map((ticket: SupportTicket) => (
                                <TicketListItem
                                    key={ticket.id}
                                    ticket={ticket}
                                    isSelected={selectedTicket?.id === ticket.id}
                                    onSelect={() => setSelectedTicketId(ticket.id)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-8 text-gray-500">
                            <p>Você ainda não abriu nenhum ticket de suporte.</p>
                        </div>
                    )}
                </div>

                {/* Right Column: Chat View */}
                <div className={`w-full lg:w-2/3 ${!selectedTicket ? 'hidden lg:flex' : 'block'}`}>
                     {selectedTicket && user ? (
                        <SupportChatView 
                            ticket={selectedTicket} 
                            user={user} 
                            onClose={() => setSelectedTicketId(null)} 
                        />
                    ) : (
                        <div className="h-full flex items-center justify-center bg-white rounded-lg shadow-md border text-gray-500">
                            <p>Selecione um ticket para ver a conversa.</p>
                        </div>
                    )}
                </div>
            </div>

            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Abrir Novo Ticket de Suporte">
                <AddSupportTicketForm 
                    onAdd={handlers.addSupportTicket}
                    onClose={() => setIsAddModalOpen(false)}
                />
            </Modal>
        </div>
    );
};

export default FranchiseeTicketsView;