import React, { useState, useEffect } from 'react';
import { Invoice, Franchise, InvoiceStatus } from '../types';

interface AddInvoiceFormProps {
  onSubmit: (invoice: Omit<Invoice, 'id'> | Invoice) => void;
  onClose: () => void;
  franchises: Franchise[];
  initialData?: Invoice | null;
}

const AddInvoiceForm: React.FC<AddInvoiceFormProps> = ({ onSubmit, onClose, franchises, initialData }) => {
  const [franchiseId, setFranchiseId] = useState('');
  const [amount, setAmount] = useState(0);
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState<InvoiceStatus>(InvoiceStatus.DRAFT);

  useEffect(() => {
    if (initialData) {
      setFranchiseId(String(initialData.franchiseId));
      setAmount(initialData.amount);
      setDueDate(initialData.dueDate.split('T')[0]); // Format for date input
      setStatus(initialData.status);
    } else {
      setFranchiseId('');
      setAmount(0);
      setDueDate('');
      setStatus(InvoiceStatus.DRAFT);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!franchiseId || amount <= 0 || !dueDate) {
      alert("Todos os campos são obrigatórios.");
      return;
    }
    const selectedFranchise = franchises.find(f => f.id === Number(franchiseId));
    if (!selectedFranchise) {
        alert("Franquia inválida.");
        return;
    }

    const invoiceData = {
      franchiseId: Number(franchiseId),
      clientName: `Royalties - ${selectedFranchise.name}`,
      amount,
      dueDate,
      status,
    };
    
    if (initialData) {
      onSubmit({ ...invoiceData, id: initialData.id });
    } else {
      onSubmit(invoiceData);
    }
    onClose();
  };

  const isEditing = !!initialData;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="franchiseId" className="block text-sm font-medium text-gray-700">Franquia</label>
        <select
          id="franchiseId"
          value={franchiseId}
          onChange={(e) => setFranchiseId(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          required
          disabled={isEditing}
        >
            <option value="" disabled>Selecione uma franquia</option>
            {franchises.map(franchise => (
                <option key={franchise.id} value={franchise.id}>{franchise.name}</option>
            ))}
        </select>
      </div>
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Valor (R$)</label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
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
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as InvoiceStatus)}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          required
        >
          {Object.values(InvoiceStatus).map(s => (
              <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="flex justify-end pt-4 space-x-2">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
          Cancelar
        </button>
        <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-800">
          {isEditing ? 'Salvar Alterações' : 'Gerar Fatura'}
        </button>
      </div>
    </form>
  );
};

export default AddInvoiceForm;