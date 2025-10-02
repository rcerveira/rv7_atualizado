import React from 'react';

interface KpiCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    change: string; // e.g., "+5.2%"
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, icon, change }) => {
    const isPositive = change.startsWith('+');

    return (
        <div className="card">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-text-secondary uppercase tracking-wider">{title}</p>
                    <p className="text-3xl font-bold text-text-primary mt-2">{value}</p>
                </div>
                <div className="p-3 bg-primary/10 text-primary rounded-lg">
                    {icon}
                </div>
            </div>
            <p className={`text-sm font-semibold mt-4 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {change} vs. mês anterior
            </p>
        </div>
    );
};

export default KpiCard;