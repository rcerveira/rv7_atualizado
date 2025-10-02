import React from 'react';
import { CreditRecoveryCase, CreditRecoveryStatus, Client } from '../types';
import { TrashIcon } from './icons';

interface CreditRecoveryTableProps {
  cases: CreditRecoveryCase[];
  clients: Client[];
  onDelete: (id: number) => void;
  onRowClick: (creditCase: CreditRecoveryCase) => void;
}

const statusColorMap: Record<CreditRecoveryStatus, string> = {
  [CreditRecoveryStatus.INITIAL_CONTACT]: 'bg-gray-100 text-gray-800',
  [CreditRecoveryStatus.NEGOTIATING]: 'bg-blue-100 text-blue-800',
  [CreditRecoveryStatus.RESOLVED]: 'bg-green-100 text-green-800',
  [CreditRecoveryStatus.UNRESOLVED]: 'bg-red-100 text-red-800',
};

const CreditRecoveryTable: React.FC<CreditRecoveryTableProps> = ({ cases, clients, onDelete, onRowClick }) => {
    const getClientName = (clientId: number) => {
        return clients.find(c => c.id === clientId)?.name || 'Cliente não encontrado';
    };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor da Dívida</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Último Contato</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {cases.length > 0 ? cases.map((item) => (
            <tr key={item.id} onClick={() => onRowClick(item)} className="hover:bg-gray-50 cursor-pointer">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{getClientName(item.clientId)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.debtAmount)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(item.lastContactDate).toLocaleDateString('pt-BR')}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColorMap[item.status]}`}>
                  {item.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                 <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(item.id);
                    }} 
                    className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors"
                 >
                   <TrashIcon className="w-5 h-5" />
                 </button>
              </td>
            </tr>
          )) : (
             <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">Nenhum caso de recuperação de crédito registrado.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CreditRecoveryTable;