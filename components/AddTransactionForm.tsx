
import React, { useState } from 'react';
import { Transaction, TransactionType, TransactionCategory } from '../types';

interface AddTransactionFormProps {
  onAdd: (transaction: Omit<Transaction, 'id' | 'franchiseId' | 'date'>) => void;
  onClose: () => void;
}

const AddTransactionForm: React.FC<AddTransactionFormProps> = ({ onAdd, onClose }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(0);
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [category, setCategory] = useState<TransactionCategory>(TransactionCategory.OPERATIONAL_EXPENSE);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || amount <= 0) {
      alert("Descrição e valor são obrigatórios.");
      return;
    }
    onAdd({ description, amount, type, category });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição</label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          required
        />
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
        <label className="block text-sm font-medium text-gray-700">Tipo</label>
        <div className="mt-2 flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="type"
              value={TransactionType.EXPENSE}
              checked={type === TransactionType.EXPENSE}
              onChange={() => setType(TransactionType.EXPENSE)}
              className="focus:ring-primary h-4 w-4 text-primary border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-700">Despesa</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="type"
              value={TransactionType.INCOME}
              checked={type === TransactionType.INCOME}
              onChange={() => setType(TransactionType.INCOME)}
              className="focus:ring-primary h-4 w-4 text-primary border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-700">Receita</span>
          </label>
        </div>
      </div>
       <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Categoria</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value as TransactionCategory)}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          required
        >
            {Object.values(TransactionCategory).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
            ))}
        </select>
      </div>
      <div className="flex justify-end pt-4 space-x-2">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
          Cancelar
        </button>
        <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-800">
          Adicionar
        </button>
      </div>
    </form>
  );
};

export default AddTransactionForm;