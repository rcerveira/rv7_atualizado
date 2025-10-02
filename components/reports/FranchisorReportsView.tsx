import React from 'react';
import { useData } from '../../hooks/useData';
import { ChartBarIcon } from '../icons';
import FranchiseComparisonTable from './FranchiseComparisonTable';
import ReportSummaryMetrics from './ReportSummaryMetrics';

const FranchisorReportsView: React.FC = () => {
    const { franchisesWithStats, networkStats } = useData();

    if (!franchisesWithStats || !networkStats) {
        return (
            <div className="flex justify-center items-center h-64">
                <p>Carregando dados dos relatórios...</p>
            </div>
        );
    }
    
    const validFranchises = franchisesWithStats.filter(Boolean);

    const averageConversion = validFranchises.length > 0
        ? validFranchises.reduce((acc, f) => acc + f.conversionRate, 0) / validFranchises.length
        : 0;

    return (
        <div className="space-y-8">
             <div className="flex items-center space-x-3">
                <ChartBarIcon className="w-8 h-8 text-primary"/>
                <h2 className="text-2xl font-bold text-gray-800">Relatórios da Rede</h2>
            </div>

            <ReportSummaryMetrics
                totalRevenue={networkStats.totalRevenue}
                totalProfit={networkStats.totalProfit}
                averageConversion={averageConversion}
                averageHealthScore={networkStats.averageHealthScore}
            />

            <div className="bg-white p-6 rounded-lg shadow-md">
                 <h3 className="text-lg font-semibold text-gray-900 mb-4">Tabela Comparativa de Franquias</h3>
                 <FranchiseComparisonTable franchises={validFranchises} />
            </div>
        </div>
    );
};

export default FranchisorReportsView;