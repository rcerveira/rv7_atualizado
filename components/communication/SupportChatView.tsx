import React, { useState, useRef, useEffect } from 'react';
import { SupportTicket, SupportTicketStatus, AuthenticatedUser } from '../../types';
import { useData } from '../../hooks/useData';
import { ArrowLeftIcon } from '../icons';

interface SupportChatViewProps {
  ticket: SupportTicket;
  user: AuthenticatedUser | null;
  onClose: () => void;
}

const SupportChatView: React.FC<SupportChatViewProps> = ({ ticket, user, onClose }) => {
    const { handlers } = useData();
    const [newMessage, setNewMessage] = useState('');
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

    return (
        <div className="flex flex-col h-full bg-white rounded-lg shadow-md border">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
                 <div className="flex items-center">
                    <button onClick={onClose} className="lg:hidden mr-4 p-2 rounded-full hover:bg-gray-100">
                        <ArrowLeftIcon className="w-5 h-5" />
                    </button>
                    <div>
                        <h3 className="font-bold text-gray-800">{ticket.subject}</h3>
                        <p className="text-sm text-gray-500">Status: {ticket.status}</p>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {ticket.messages.map(message => (
                    <div key={message.id} className={`flex items-start gap-3 ${message.isFranchisor ? 'justify-end' : ''}`}>
                         {!message.isFranchisor && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center text-sm font-bold">F</div>}
                        <div className={`max-w-xs md:max-w-md p-3 rounded-lg ${message.isFranchisor ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800'}`}>
                            <p className="text-sm font-bold mb-1">{message.author}</p>
                            <p className="text-sm break-words">{message.text}</p>
                            <p className="text-xs text-right mt-2 opacity-75">{new Date(message.createdAt).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</p>
                        </div>
                        {message.isFranchisor && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">S</div>}
                    </div>
                ))}
                 <div ref={messagesEndRef} />
            </div>
            
            {/* Reply Form */}
            {ticket.status !== SupportTicketStatus.CLOSED && ticket.status !== SupportTicketStatus.RESOLVED && (
                <div className="p-4 border-t bg-gray-50">
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
            )}
        </div>
    );
};

export default SupportChatView;