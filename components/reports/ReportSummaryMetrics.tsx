import React from 'react';
import { CashIcon, TrendingUpIcon, ShieldCheckIcon, BriefcaseIcon } from '../icons';

interface ReportSummaryMetricsProps {
    totalRevenue: number;
    totalProfit: number;
    averageConversion: number;
    averageHealthScore: number;
}

const MetricCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-primary mr-4">
                {icon}
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-2xl font-semibold text-gray-900">{value}</p>
            </div>
        </div>
    </div>
);


const ReportSummaryMetrics: React.FC<ReportSummaryMetricsProps> = ({ totalRevenue, totalProfit, averageConversion, averageHealthScore }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
                title="Receita Total"
                value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalRevenue)}
                icon={<CashIcon className="w-6 h-6" />}
            />
            <MetricCard
                title="Lucro Total"
                value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalProfit)}
                icon={<TrendingUpIcon className="w-6 h-6" />}
            />
            <MetricCard
                title="Conversão Média"
                value={`${(averageConversion * 100).toFixed(1)}%`}
                icon={<BriefcaseIcon className="w-6 h-6" />}
            />
            <MetricCard
                title="Health Score Médio"
                value={averageHealthScore.toFixed(0)}
                icon={<ShieldCheckIcon className="w-6 h-6" />}
            />
        </div>
    );
};

export default ReportSummaryMetrics;
