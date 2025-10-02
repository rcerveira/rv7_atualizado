import React from 'react';
import { CashIcon, ReceiptTaxIcon, ShieldCheckIcon } from '../icons';
import FinancialSummaryCard from '../FinancialSummaryCard';
import RevenueBreakdownChart from './RevenueBreakdownChart';
import MonthlyRoyaltiesChart from './MonthlyRoyaltiesChart';

interface FinancialsDashboardTabProps {
    totalIncome: number;
    totalExpense: number;
    totalRoyaltiesBilled: number;
    totalRoyaltiesPaid: number;
    totalRoyaltiesPending: number;
}

const FinancialsDashboardTab: React.FC<FinancialsDashboardTabProps> = ({
    totalIncome,
    totalExpense,
    totalRoyaltiesBilled,
    totalRoyaltiesPaid,
    totalRoyaltiesPending
}) => {
    const revenueData = [
        { name: 'Royalties Recebidos', value: totalRoyaltiesPaid },
        { name: 'Receita Própria', value: totalIncome },
    ];

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 <FinancialSummaryCard title="Balanço Próprio" amount={totalIncome - totalExpense} icon={<CashIcon className="w-6 h-6" />} colorClass="bg-blue-100 text-primary" />
                 <FinancialSummaryCard title="Royalties Faturados" amount={totalRoyaltiesBilled} icon={<ReceiptTaxIcon className="w-6 h-6" />} colorClass="bg-yellow-100 text-accent" />
                 <FinancialSummaryCard title="Royalties Recebidos" amount={totalRoyaltiesPaid} icon={<ShieldCheckIcon className="w-6 h-6" />} colorClass="bg-green-100 text-secondary" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card">
                    <h3 className="section-title mb-4">Fontes de Receita (Realizado)</h3>
                    <RevenueBreakdownChart data={revenueData.filter(d => d.value > 0)} />
                </div>
                 <div className="card">
                    <h3 className="section-title mb-4">Evolução de Royalties (Últimos 6 Meses)</h3>
                    <MonthlyRoyaltiesChart lastBilledAmount={totalRoyaltiesBilled} />
                </div>
            </div>
        </div>
    );
};

export default FinancialsDashboardTab;