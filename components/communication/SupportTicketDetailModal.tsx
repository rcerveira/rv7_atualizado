import React, { useState, useRef, useEffect } from 'react';
import { SupportTicket, SupportTicketStatus, AuthenticatedUser } from '../../types';
import Modal from '../Modal';
import { useData } from '../../hooks/useData';

interface SupportTicketDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: SupportTicket;
  user: AuthenticatedUser | null;
}

const SupportTicketDetailModal: React.FC<SupportTicketDetailModalProps> = ({ isOpen, onClose, ticket, user }) => {
    const { handlers } = useData();
    const [newMessage, setNewMessage] = useState('');
    const [currentStatus, setCurrentStatus] = useState<SupportTicketStatus>(ticket.status);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const isFranchisor = user?.role === 'FRANCHISOR';

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [ticket.messages]);

    const handleSendMessage = () => {
        if (newMessage.trim() && user) {
            handlers.addMessageToTicket(ticket.id, newMessage, user.name, isFranchisor);
            setNewMessage('');
        }
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value as SupportTicketStatus;
        setCurrentStatus(newStatus);
        handlers.updateTicketStatus(ticket.id, newStatus);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={ticket.subject}>
            <div className="flex flex-col h-[75vh]">
                {/* Header */}
                <div className="flex justify-between items-center p-4 bg-gray-50 border-b rounded-t-lg">
                    <div>
                        <p className="text-sm text-gray-500">Categoria: <span className="font-medium text-gray-800">{ticket.category}</span></p>
                        <p className="text-sm text-gray-500">Aberto em: <span className="font-medium text-gray-800">{new Date(ticket.createdAt).toLocaleString('pt-BR')}</span></p>
                    </div>
                     {isFranchisor ? (
                        <div>
                            <label htmlFor="status" className="block text-xs font-medium text-gray-700">Alterar Status</label>
                            <select
                                id="status"
                                value={currentStatus}
                                onChange={handleStatusChange}
                                className="mt-1 block w-full pl-3 pr-8 py-1.5 text-sm bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                            >
                                {Object.values(SupportTicketStatus).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    ) : (
                         <p className="text-sm text-gray-500">Status: <span className="font-medium text-gray-800">{ticket.status}</span></p>
                    )}
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
                    {ticket.messages.map(message => (
                        <div key={message.id} className={`flex items-start gap-3 ${message.isFranchisor ? 'justify-end' : ''}`}>
                             {!message.isFranchisor && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center text-sm font-bold">F</div>}
                            <div className={`max-w-xs md:max-w-md p-3 rounded-lg ${message.isFranchisor ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800'}`}>
                                <p className="text-sm font-bold mb-1">{message.author}</p>
                                <p className="text-sm">{message.text}</p>
                                <p className="text-xs text-right mt-2 opacity-75">{new Date(message.createdAt).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</p>
                            </div>
                            {message.isFranchisor && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">S</div>}
                        </div>
                    ))}
                     <div ref={messagesEndRef} />
                </div>
                
                {/* Reply Form */}
                 <div className="p-4 border-t bg-gray-50 rounded-b-lg">
                    <div className="flex items-center space-x-3">
                        <textarea
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            rows={2}
                            placeholder="Digite sua resposta..."
                            className="flex-1 p-2 bg-white border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                        />
                        <button 
                            onClick={handleSendMessage}
                            className="px-4 py-2 bg-primary text-white font-semibold rounded-md hover:bg-blue-800 disabled:bg-gray-400"
                            disabled={!newMessage.trim()}
                        >
                            Enviar
                        </button>
                    </div>
                 </div>
            </div>
        </Modal>
    );
};

export default SupportTicketDetailModal;
