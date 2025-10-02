import React, { useMemo } from 'react';
import { useData } from '../../../hooks/useData';
import { Sale, Lead } from '../../../types';
import { BellIcon, DocumentReportIcon, UsersGroupIcon } from '../../icons';

type ActivityItem = {
    id: string;
    type: 'sale' | 'lead';
    date: Date;
    content: string;
};

const ActivityIcon: React.FC<{ type: ActivityItem['type'] }> = ({ type }) => {
    if (type === 'sale') {
        return <DocumentReportIcon className="w-5 h-5 text-green-600" />;
    }
    return <UsersGroupIcon className="w-5 h-5 text-blue-600" />;
};

const RecentActivity: React.FC = () => {
    const { selectedFranchiseData } = useData();
    const { sales, leads, clients } = selectedFranchiseData!;

    const getClientName = (clientId: number) => clients.find(c => c.id === clientId)?.name || 'Cliente';

    const activityFeed = useMemo<ActivityItem[]>(() => {
        const saleActivities: ActivityItem[] = sales.map(sale => ({
            id: `sale-${sale.id}`,
            type: 'sale',
            date: new Date(sale.saleDate),
            content: `Nova venda para ${getClientName(sale.clientId)} no valor de ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sale.totalAmount)}.`,
        }));

        const leadActivities: ActivityItem[] = leads.map(lead => ({
            id: `lead-${lead.id}`,
            type: 'lead',
            date: new Date(lead.createdAt),
            content: `Novo lead: ${getClientName(lead.clientId)} com interesse em ${lead.serviceOfInterest}.`,
        }));

        return [...saleActivities, ...leadActivities]
            .sort((a, b) => b.date.getTime() - a.date.getTime())
            .slice(0, 5); // Limit to latest 5 activities
    }, [sales, leads, clients]);

    return (
        <div className="card">
            <div className="flex items-center mb-4">
                <BellIcon className="w-6 h-6 text-primary mr-3" />
                <h3 className="section-title">Atividade Recente</h3>
            </div>
            <div className="space-y-4">
                {activityFeed.length > 0 ? (
                    activityFeed.map(item => (
                        <div key={item.id} className="flex items-start">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                                <ActivityIcon type={item.type} />
                            </div>
                            <div>
                                <p className="text-sm text-text-primary">{item.content}</p>
                                <p className="text-xs text-text-secondary">{item.date.toLocaleString('pt-BR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center py-8 text-text-secondary">Nenhuma atividade recente.</p>
                )}
            </div>
        </div>
    );
};

export default RecentActivity;