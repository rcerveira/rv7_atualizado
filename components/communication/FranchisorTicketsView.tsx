import React, { useState } from 'react';
import { useData } from '../../hooks/useData';
import { useAuth } from '../../hooks/useAuth';
import { SupportTicket, SupportTicketStatus } from '../../types';
import SupportTicketDetailModal from './SupportTicketDetailModal';
import { ChatBubbleLeftRightIcon } from '../icons';

const statusColorMap: Record<SupportTicketStatus, string> = {
    [SupportTicketStatus.OPEN]: 'bg-blue-100 text-blue-800',
    [SupportTicketStatus.IN_PROGRESS]: 'bg-yellow-100 text-yellow-800',
    [SupportTicketStatus.RESOLVED]: 'bg-green-100 text-green-800',
    [SupportTicketStatus.CLOSED]: 'bg-gray-100 text-gray-800',
};

const FranchisorTicketsView: React.FC = () => {
    const { data } = useData();
    const { supportTickets, franchises } = data;
    const { user } = useAuth();
    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

    const getFranchiseName = (franchiseId: number) => {
        return franchises.find(f => f.id === franchiseId)?.name || 'Desconhecida';
    };

    return (
        <>
            <div className="bg-white p-6 rounded-lg shadow-md">
                 <div className="flex items-center space-x-3 mb-6">
                    <ChatBubbleLeftRightIcon className="w-8 h-8 text-primary"/>
                    <h2 className="text-2xl font-bold text-gray-800">Tickets de Suporte da Rede</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Franquia</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assunto</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Última Atualização</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase"></th>
                            </tr>
                        </thead>
                         <tbody className="bg-white divide-y divide-gray-200">
                            {supportTickets.length > 0 ? supportTickets.map((ticket) => (
                                <tr key={ticket.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedTicket(ticket)}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{getFranchiseName(ticket.franchiseId)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{ticket.subject}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(ticket.updatedAt).toLocaleString('pt-BR')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColorMap[ticket.status]}`}>
                                            {ticket.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-primary hover:text-blue-700">
                                        Revisar
                                    </td>
                                </tr>
                            )) : (
                                 <tr>
                                    <td colSpan={5} className="text-center py-8 text-gray-500">
                                        Nenhum ticket de suporte aberto no momento.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {selectedTicket && (
                <SupportTicketDetailModal
                    isOpen={!!selectedTicket}
                    onClose={() => setSelectedTicket(null)}
                    ticket={selectedTicket}
                    user={user}
                />
            )}
        </>
    );
};

export default FranchisorTicketsView;