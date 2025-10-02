import React, { useMemo } from 'react';
import { Lead, LeadStatus } from '../../../types';
import { UsersGroupIcon } from '../../icons';

interface FunnelSummaryProps {
    leads: Lead[];
}

const statusConfig: Record<LeadStatus, { label: string, color: string }> = {
    [LeadStatus.NEW]: { label: "Novos", color: "bg-gray-400" },
    [LeadStatus.CONTACTED]: { label: "Contatados", color: "bg-blue-500" },
    [LeadStatus.NEGOTIATING]: { label: "Negociação", color: "bg-yellow-500" },
    [LeadStatus.WON]: { label: "Ganhos", color: "bg-green-500" },
    [LeadStatus.LOST]: { label: "Perdidos", color: "bg-red-500" },
};

const FunnelSummary: React.FC<FunnelSummaryProps> = ({ leads }) => {
    const funnelCounts = useMemo(() => {
        return leads.reduce((acc, lead) => {
            acc[lead.status] = (acc[lead.status] || 0) + 1;
            return acc;
        }, {} as Record<LeadStatus, number>);
    }, [leads]);

    const activeStatuses = [LeadStatus.NEW, LeadStatus.CONTACTED, LeadStatus.NEGOTIATING, LeadStatus.WON];

    return (
        <div className="card h-full">
            <div className="flex items-center mb-4">
                <UsersGroupIcon className="w-6 h-6 text-primary mr-3" />
                <h3 className="section-title">Resumo do Funil de Vendas</h3>
            </div>
            <div className="space-y-3">
                {activeStatuses.map(status => (
                    <div key={status}>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-text-secondary">{statusConfig[status].label}</span>
                            <span className="text-sm font-bold text-text-primary">{funnelCounts[status] || 0}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                                className={`${statusConfig[status].color} h-2.5 rounded-full`}
                                style={{ width: `${((funnelCounts[status] || 0) / (leads.length || 1)) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FunnelSummary;