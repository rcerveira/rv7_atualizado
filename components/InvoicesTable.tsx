import React from 'react';
import { Invoice, InvoiceStatus } from '../types';
import { PencilAltIcon, TrashIcon } from './icons';

interface InvoicesTableProps {
  invoices: Invoice[];
  onEdit?: (invoice: Invoice) => void;
  onDelete?: (invoiceId: number) => void;
}

const statusColorMap: Record<InvoiceStatus, string> = {
  [InvoiceStatus.DRAFT]: 'bg-gray-100 text-gray-800',
  [InvoiceStatus.SENT]: 'bg-blue-100 text-blue-800',
  [InvoiceStatus.PAID]: 'bg-green-100 text-green-800',
  [InvoiceStatus.OVERDUE]: 'bg-red-100 text-red-800',
};

const InvoicesTable: React.FC<InvoicesTableProps> = ({ invoices, onEdit, onDelete }) => {
  const canManage = onEdit && onDelete;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente/Descrição</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vencimento</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
            {canManage && <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {invoices.length > 0 ? invoices.map((invoice) => (
            <tr key={invoice.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invoice.clientName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(invoice.dueDate).toLocaleDateString('pt-BR')}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColorMap[invoice.status]}`}>
                  {invoice.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-800">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(invoice.amount)}
              </td>
              {canManage && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-3">
                    <button onClick={() => onEdit(invoice)} className="text-primary hover:text-blue-700 p-1 rounded-full hover:bg-blue-100 transition-colors">
                        <PencilAltIcon className="w-5 h-5" />
                    </button>
                    <button onClick={() => onDelete(invoice.id)} className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors">
                        <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          )) : (
            <tr>
              <td colSpan={canManage ? 5 : 4} className="text-center py-4 text-gray-500">Nenhuma fatura encontrada.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InvoicesTable;