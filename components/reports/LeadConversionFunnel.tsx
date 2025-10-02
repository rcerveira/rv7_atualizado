import React, { useMemo } from 'react';
import { FunnelChart, Funnel, Tooltip, LabelList, ResponsiveContainer } from 'recharts';
import { Lead, LeadStatus } from '../../types';

interface LeadConversionFunnelProps {
    leads: Lead[];
}

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const totalLeads = payload[0].payload.totalLeads;
        const value = payload[0].value;
        const conversionRate = totalLeads > 0 ? (value / totalLeads) * 100 : 0;

        return (
            <div className="bg-card/80 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-border/20">
                <p className="font-bold text-sm text-text-primary">{payload[0].name}</p>
                <p className="text-sm" style={{ color: payload[0].payload.fill }}>
                    {`${value} Leads`}
                </p>
                <p className="text-xs text-text-secondary">
                    {`${conversionRate.toFixed(1)}% do total`}
                </p>
            </div>
        );
    }
    return null;
};


const LeadConversionFunnel: React.FC<LeadConversionFunnelProps> = ({ leads }) => {
    const funnelData = useMemo(() => {
        const totalLeads = leads.length;
        if (totalLeads === 0) return [];

        const counts = leads.reduce((acc, lead) => {
            acc[lead.status] = (acc[lead.status] || 0) + 1;
            return acc;
        }, {} as Record<LeadStatus, number>);

        const contactedOrLater = (counts[LeadStatus.CONTACTED] || 0) + (counts[LeadStatus.NEGOTIATING] || 0) + (counts[LeadStatus.WON] || 0);
        const negotiatingOrLater = (counts[LeadStatus.NEGOTIATING] || 0) + (counts[LeadStatus.WON] || 0);
        const won = counts[LeadStatus.WON] || 0;

        const colors = ['#1E3A8A', '#2563EB', '#3B82F6'];

        return [
            { value: totalLeads, name: 'Total de Leads', fill: colors[0], totalLeads },
            { value: contactedOrLater, name: 'Contatados', fill: colors[1], totalLeads },
            { value: negotiatingOrLater, name: 'Em Negociação', fill: colors[2], totalLeads },
            { value: won, name: 'Ganhos', fill: '#10B981', totalLeads },
        ].filter(d => d.value > 0);

    }, [leads]);

     if (funnelData.length === 0) {
        return <p className="text-center text-gray-500 py-8">Nenhum lead para exibir no funil.</p>;
    }

    return (
        <div className="h-96 w-full">
            <ResponsiveContainer>
                <FunnelChart>
                    <Tooltip content={<CustomTooltip />} />
                    <Funnel
                        dataKey="value"
                        data={funnelData}
                        isAnimationActive
                    >
                        <LabelList position="right" fill="#333" stroke="none" dataKey="name" />
                         <LabelList position="center" fill="#fff" stroke="none" dataKey="value" className="font-bold"/>
                    </Funnel>
                </FunnelChart>
            </ResponsiveContainer>
        </div>
    );
};

export default LeadConversionFunnel;