import React from 'react';
import { useData } from '../../../hooks/useData';
import KpiCard from './KpiCard';
import FunnelSummary from './FunnelSummary';
import TodayTasks from './TodayTasks';
import RecentActivity from './RecentActivity';
import { HomeIcon, CashIcon, UsersGroupIcon, TrendingUpIcon } from '../../icons';
import { TransactionType, LeadStatus } from '../../../types';

const DashboardView: React.FC = () => {
    const { selectedFranchiseData } = useData();

    if (!selectedFranchiseData) {
        return <div>Carregando dados...</div>;
    }

    const { transactions, leads } = selectedFranchiseData;

    // Calculate KPIs
    const monthlyRevenue = transactions
        .filter(t => t.type === TransactionType.INCOME && new Date(t.date).getMonth() === new Date().getMonth())
        .reduce((sum, t) => sum + t.amount, 0);

    const newLeadsThisMonth = leads.filter(l => new Date(l.createdAt).getMonth() === new Date().getMonth()).length;

    const wonLeads = leads.filter(l => l.status === LeadStatus.WON).length;
    const totalLeads = leads.length;
    const conversionRate = totalLeads > 0 ? (wonLeads / totalLeads) : 0;

    return (
        <div className="space-y-8">
            <div className="flex items-center space-x-3">
                <HomeIcon className="w-8 h-8 text-primary" />
                <h1 className="text-3xl font-bold text-gray-800">Visão Geral</h1>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <KpiCard
                    title="Faturamento no Mês"
                    value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(monthlyRevenue)}
                    icon={<CashIcon className="w-7 h-7" />}
                    change="+5.2%"
                />
                <KpiCard
                    title="Novos Leads no Mês"
                    value={newLeadsThisMonth.toString()}
                    icon={<UsersGroupIcon className="w-7 h-7" />}
                    change="+10"
                />
                <KpiCard
                    title="Taxa de Conversão (Geral)"
                    value={`${(conversionRate * 100).toFixed(1)}%`}
                    icon={<TrendingUpIcon className="w-7 h-7" />}
                    change="-0.5%"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <FunnelSummary leads={leads} />
                    <RecentActivity />
                </div>
                <div className="lg:col-span-1">
                    <TodayTasks />
                </div>
            </div>
        </div>
    );
};

export default DashboardView;