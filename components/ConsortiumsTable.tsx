import React from 'react';
import { Consortium, ConsortiumStatus, Client } from '../types';
import { TrashIcon } from './icons';

interface ConsortiumsTableProps {
  consortiums: Consortium[];
  clients: Client[];
  onDelete: (id: number) => void;
}

const statusColorMap: Record<ConsortiumStatus, string> = {
  [ConsortiumStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
  [ConsortiumStatus.ACTIVE]: 'bg-blue-100 text-blue-800',
  [ConsortiumStatus.COMPLETED]: 'bg-green-100 text-green-800',
};

const ConsortiumsTable: React.FC<ConsortiumsTableProps> = ({ consortiums, clients, onDelete }) => {
    const getClientName = (clientId: number) => {
        return clients.find(c => c.id === clientId)?.name || 'Cliente não encontrado';
    };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {consortiums.length > 0 ? consortiums.map((item) => (
            <tr key={item.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{getClientName(item.clientId)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.value)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(item.date).toLocaleDateString('pt-BR')}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColorMap[item.status]}`}>
                  {item.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button onClick={() => onDelete(item.id)} className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors">
                   <TrashIcon className="w-5 h-5" />
                </button>
              </td>
            </tr>
          )) : (
            <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">Nenhuma venda de consórcio registrada.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ConsortiumsTable;