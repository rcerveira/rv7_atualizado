import React, { useState } from 'react';
import { Task, Lead, Client } from '../types';

interface AddTaskFormProps {
  onAdd: (task: Omit<Task, 'id' | 'franchiseId' | 'completed'>) => void;
  onClose: () => void;
  leads: Lead[];
  clients: Client[];
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onAdd, onClose, leads, clients }) => {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [leadId, setLeadId] = useState<string>('');
  
  const getClientName = (clientId: number) => {
    return clients.find(c => c.id === clientId)?.name || 'Cliente';
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !dueDate) {
        alert("Título e data de vencimento são obrigatórios.");
        return;
    }
    onAdd({ 
        title, 
        dueDate, 
        leadId: leadId ? Number(leadId) : null 
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título da Tarefa</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          required
        />
      </div>
      <div>
        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Data de Vencimento</label>
        <input
          type="date"
          id="dueDate"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          required
        />
      </div>
       <div>
        <label htmlFor="leadId" className="block text-sm font-medium text-gray-700">Vincular ao Lead (Opcional)</label>
        <select
            id="leadId"
            value={leadId}
            onChange={(e) => setLeadId(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        >
            <option value="">Nenhum</option>
            {leads.map(lead => (
                <option key={lead.id} value={lead.id}>
                    {getClientName(lead.clientId)} ({lead.serviceOfInterest})
                </option>
            ))}
        </select>
      </div>
      <div className="flex justify-end pt-4 space-x-2">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
          Cancelar
        </button>
        <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-800">
          Adicionar Tarefa
        </button>
      </div>
    </form>
  );
};

export default AddTaskForm;