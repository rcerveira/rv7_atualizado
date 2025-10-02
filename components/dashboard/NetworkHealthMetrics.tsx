import React from 'react';
import { CashIcon, UsersIcon, TrendingUpIcon, ShieldCheckIcon, ChevronUpIcon, ChevronDownIcon } from '../icons';
import { FranchiseWithStats } from '../../types';

interface NetworkHealthMetricsProps {
    stats: {
        totalRevenue: number;
        totalProfit: number;
        averageHealthScore: number;
    };
    franchiseCount: number;
}

const MetricCard: React.FC<{ 
    title: string; 
    value: string; 
    icon: React.ReactNode; 
    primaryColor: string; // e.g. 'text-blue-600'
    bgColor: string; // e.g. 'bg-blue-100'
    trend: string;
    trendDirection: 'up' | 'down';
}> = ({ title, value, icon, primaryColor, bgColor, trend, trendDirection }) => {
    
    const TrendIcon = trendDirection === 'up' ? ChevronUpIcon : ChevronDownIcon;
    const trendColor = trendDirection === 'up' ? 'text-green-500' : 'text-red-500';

    return (
        <div className={`relative ${bgColor} p-6 rounded-2xl overflow-hidden shadow-lg shadow-gray-200/50 transition-all duration-300 hover:shadow-xl hover:scale-105`}>
            <div className="relative z-10">
                 <div className="flex items-start justify-between">
                    <div className="p-4 rounded-xl bg-white/50">
                        {React.cloneElement(icon as React.ReactElement, { className: `w-7 h-7 ${primaryColor}` })}
                    </div>
                    <div className="text-right">
                         <p className="text-sm font-semibold uppercase tracking-wider text-text-secondary">{title}</p>
                         <p className="text-4xl font-bold text-text-primary mt-1">{value}</p>
                    </div>
                 </div>
                 <div className="mt-6 flex items-center space-x-1">
                    <div className={`flex items-center text-sm font-bold ${trendColor}`}>
                        <TrendIcon className="w-4 h-4" />
                        <span>{trend}</span>
                    </div>
                    <p className="text-sm text-text-secondary">vs. mês anterior</p>
                </div>
            </div>
            {/* Background decorative element */}
            <div className={`absolute -bottom-8 -right-8 ${primaryColor}`}>
                {React.cloneElement(icon as React.ReactElement, { className: "w-32 h-32 opacity-10" })}
            </div>
        </div>
    );
};


const NetworkHealthMetrics: React.FC<NetworkHealthMetricsProps> = ({ stats, franchiseCount }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <MetricCard
                title="Faturamento da Rede"
                value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact' }).format(stats.totalRevenue)}
                icon={<CashIcon />}
                primaryColor="text-primary"
                bgColor="bg-blue-100"
                trend="3.2%"
                trendDirection="up"
            />
            <MetricCard
                title="Lucro da Rede"
                value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact' }).format(stats.totalProfit)}
                icon={<TrendingUpIcon />}
                primaryColor="text-secondary"
                bgColor="bg-green-100"
                trend="1.8%"
                trendDirection="up"
            />
             <MetricCard
                title="Health Score Médio"
                value={stats.averageHealthScore.toFixed(0)}
                icon={<ShieldCheckIcon />}
                primaryColor="text-accent"
                bgColor="bg-amber-100"
                trend="0.5%"
                trendDirection="down"
            />
            <MetricCard
                title="Franquias Ativas"
                value={franchiseCount.toString()}
                icon={<UsersIcon />}
                primaryColor="text-indigo-600"
                bgColor="bg-indigo-100"
                trend="+1"
                trendDirection="up"
            />
        </div>
    );
};

export default NetworkHealthMetrics;