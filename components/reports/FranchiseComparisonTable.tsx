import React from 'react';
import { FranchiseWithStats } from '../../types';

interface FranchiseComparisonTableProps {
    franchises: FranchiseWithStats[];
}

const FranchiseComparisonTable: React.FC<FranchiseComparisonTableProps> = ({ franchises }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Franquia</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Faturamento</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Lucro</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Conversão</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Health Score</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {franchises.map(franchise => (
                        <tr key={franchise.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{franchise.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(franchise.consortiumSales)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(franchise.profit)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{(franchise.conversionRate * 100).toFixed(1)}%</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700 text-right">{franchise.healthScore}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FranchiseComparisonTable;
