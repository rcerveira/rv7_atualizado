import React, { useState } from 'react';
import { SupportTicket, SupportTicketCategory } from '../../types';

interface AddSupportTicketFormProps {
  onAdd: (
      ticketData: Omit<SupportTicket, 'id' | 'franchiseId' | 'status' | 'createdAt' | 'updatedAt' | 'messages'>,
      firstMessage: string
  ) => void;
  onClose: () => void;
}

const AddSupportTicketForm: React.FC<AddSupportTicketFormProps> = ({ onAdd, onClose }) => {
  const [category, setCategory] = useState<SupportTicketCategory>(SupportTicketCategory.OPERATIONAL);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      alert("Assunto e mensagem são obrigatórios.");
      return;
    }
    onAdd({ category, subject }, message);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Categoria</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value as SupportTicketCategory)}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        >
          {Object.values(SupportTicketCategory).map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Assunto</label>
        <input
          type="text"
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          required
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">Descreva sua solicitação</label>
        <textarea
          id="message"
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          required
        />
      </div>
      <div className="flex justify-end pt-4 space-x-2">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
          Cancelar
        </button>
        <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-800">
          Abrir Ticket
        </button>
      </div>
    </form>
  );
};

export default AddSupportTicketForm;
