import React, { useState } from 'react';
import { Consortium, Client, FranchiseUser } from '../types';

interface AddConsortiumFormProps {
  onAdd: (consortium: Omit<Consortium, 'id' | 'franchiseId' | 'date' | 'status'>) => void;
  onClose: () => void;
  clients: Client[];
  franchiseUsers: FranchiseUser[];
}

const AddConsortiumForm: React.FC<AddConsortiumFormProps> = ({ onAdd, onClose, clients, franchiseUsers }) => {
  const [clientId, setClientId] = useState('');
  const [value, setValue] = useState(0);
  const [salespersonId, setSalespersonId] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || value <= 0) {
        alert("Por favor, selecione um cliente e um valor válido.");
        return;
    }
    onAdd({ 
      clientId: Number(clientId), 
      value,
      salespersonId: salespersonId ? Number(salespersonId) : undefined 
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="clientId" className="block text-sm font-medium text-gray-700">Cliente</label>
        <select
          id="clientId"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          required
        >
            <option value="" disabled>Selecione um cliente</option>
            {clients.map(client => (
                <option key={client.id} value={client.id}>{client.name}</option>
            ))}
        </select>
      </div>
      <div>
        <label htmlFor="value" className="block text-sm font-medium text-gray-700">Valor do Consórcio (R$)</label>
        <input
          type="number"
          id="value"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          required
        />
      </div>
      <div>
        <label htmlFor="salespersonId" className="block text-sm font-medium text-gray-700">Vendedor (Opcional)</label>
        <select
          id="salespersonId"
          value={salespersonId}
          onChange={(e) => setSalespersonId(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        >
            <option value="">Nenhum / Proprietário</option>
            {franchiseUsers.map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
            ))}
        </select>
      </div>
      <div className="flex justify-end pt-4 space-x-2">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
          Cancelar
        </button>
        <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-800">
          Adicionar Venda
        </button>
      </div>
    </form>
  );
};

export default AddConsortiumForm;