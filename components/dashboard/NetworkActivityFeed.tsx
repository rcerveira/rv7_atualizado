import React, { useMemo } from 'react';
import { useData } from '../../hooks/useData';
import { CashIcon, BriefcaseIcon, MegaphoneIcon } from '../icons';
import { Consortium, FranchiseeLead, Announcement } from '../../types';

type ActivityItem = {
    id: string;
    type: 'sale' | 'new_lead' | 'announcement';
    date: Date;
    content: string;
    source: string;
};

const ActivityIcon: React.FC<{type: ActivityItem['type']}> = ({ type }) => {
    switch (type) {
        case 'sale':
            return <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center ring-8 ring-card"><CashIcon className="h-5 w-5 text-green-600" /></div>;
        case 'new_lead':
            return <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center ring-8 ring-card"><BriefcaseIcon className="h-5 w-5 text-blue-600" /></div>;
        case 'announcement':
             return <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center ring-8 ring-card"><MegaphoneIcon className="h-5 w-5 text-amber-600" /></div>;
        default:
            return null;
    }
}

const NetworkActivityFeed: React.FC = () => {
    const { data } = useData();
    const { consortiums, franchiseeLeads, announcements, franchises, clients } = data;

    const getFranchiseName = (id: number) => franchises.find(f => f.id === id)?.name || 'Franquia';
    const getClientName = (id: number) => clients.find(c => c.id === id)?.name || 'Cliente';

    const activityFeed = useMemo<ActivityItem[]>(() => {
        const salesActivities: ActivityItem[] = consortiums.map(sale => ({
            id: `sale-${sale.id}`,
            type: 'sale',
            date: new Date(sale.date),
            content: `Nova venda de consórcio (${getClientName(sale.clientId)}) no valor de ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sale.value)}.`,
            source: getFranchiseName(sale.franchiseId)
        }));

        const leadActivities: ActivityItem[] = franchiseeLeads.map(lead => ({
            id: `lead-${lead.id}`,
            type: 'new_lead',
            date: new Date(lead.createdAt),
            content: `Novo candidato a franqueado: ${lead.candidateName} de ${lead.cityOfInterest}.`,
            source: 'Expansão'
        }));
        
        const announcementActivities: ActivityItem[] = announcements.map(ann => ({
            id: `ann-${ann.id}`,
            type: 'announcement',
            date: new Date(ann.createdAt),
            content: `Novo comunicado: "${ann.title}"`,
            source: ann.author
        }));

        return [...salesActivities, ...leadActivities, ...announcementActivities]
            .sort((a, b) => b.date.getTime() - a.date.getTime())
            .slice(0, 10); // Limit to latest 10 activities

    }, [consortiums, franchiseeLeads, announcements, franchises, clients]);

    return (
        <div className="card h-full">
            <h3 className="section-title mb-4">Atividade Recente da Rede</h3>
            {activityFeed.length > 0 ? (
                 <div className="flow-root">
                    <ul role="list" className="-mb-8">
                        {activityFeed.map((item, itemIdx) => (
                             <li key={item.id}>
                                <div className="relative pb-8">
                                    {itemIdx !== activityFeed.length - 1 ? (
                                        <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-border" aria-hidden="true" />
                                    ) : null}
                                    <div className="relative flex space-x-3">
                                        <div><ActivityIcon type={item.type} /></div>
                                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                            <div>
                                                <p className="text-sm text-text-primary">{item.content}</p>
                                                <p className="text-xs text-text-secondary mt-1">
                                                    <span className="font-medium">{item.source}</span>
                                                    {' \u00B7 '}
                                                    <time dateTime={item.date.toISOString()}>
                                                        {item.date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} às {item.date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                    </time>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                 </div>
            ): (
                <p className="text-sm text-text-secondary text-center py-8">Nenhuma atividade recente na rede.</p>
            )}
        </div>
    );
};

export default NetworkActivityFeed;