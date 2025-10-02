

import React, { useState } from 'react';
import { Sale, SaleStatus } from '../../types';
import { useData } from '../../hooks/useData';
import { DocumentReportIcon } from '../icons';
import SaleDetailModal from './SaleDetailModal';

const statusColorMap: Record<SaleStatus, string> = {
    [SaleStatus.PENDING_PAYMENT]: 'bg-yellow-100 text-yellow-800',
    [SaleStatus.PARTIALLY_PAID]: 'bg-blue-100 text-blue-800',
    [SaleStatus.PAID]: 'bg-green-100 text-green-800',
    [SaleStatus.CANCELLED]: 'bg-red-100 text-red-800',
};

const SalesListView: React.FC = () => {
    const { selectedFranchiseData, handlers, data } = useData();
    const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
    
    if (!selectedFranchiseData) return null;

    const { sales, clients, contracts } = selectedFranchiseData;

    const getClientName = (clientId: number) => {
        return clients.find(c => c.id === clientId)?.name || 'Cliente não encontrado';
    };

    return (
        <>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center space-x-3 mb-6">
                    <DocumentReportIcon className="w-8 h-8 text-primary"/>
                    <h2 className="text-2xl font-bold text-gray-800">Contratos de Venda</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status Pagamento</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Valor Total</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sales.length > 0 ? sales.map(sale => {
                                const hasContract = contracts.some(c => c.saleId === sale.id);
                                return (
                                <tr key={sale.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{getClientName(sale.clientId)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(sale.saleDate).toLocaleDateString('pt-BR')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <select
                                            value={sale.status}
                                            onChange={(e) => handlers.updateSaleStatus(sale.id, e.target.value as SaleStatus)}
                                            onClick={(e) => e.stopPropagation()}
                                            className={`px-2 py-1 text-xs leading-5 font-semibold rounded-full border-transparent focus:ring-2 focus:ring-offset-2 focus:ring-primary ${statusColorMap[sale.status]}`}
                                        >
                                            {Object.values(SaleStatus).map(status => (
                                                <option key={status} value={status}>{status}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-gray-800">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sale.totalAmount)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => setSelectedSale(sale)} className="text-primary hover:text-blue-700">
                                            {hasContract ? "Ver Contrato" : "Gerenciar Contrato"}
                                        </button>
                                    </td>
                                </tr>
                            )}) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-8 text-gray-500">Nenhuma venda registrada ainda.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {selectedSale && (
                <SaleDetailModal
                    sale={selectedSale}
                    isOpen={!!selectedSale}
                    onClose={() => setSelectedSale(null)}
                />
            )}
        </>
    );
};

export default SalesListView;