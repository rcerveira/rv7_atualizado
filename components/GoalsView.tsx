import React, { useMemo, useState } from 'react';
import { Goal, Lead, LeadStatus, Consortium, CreditRecoveryCase, CreditRecoveryStatus } from '../types';
import KpiCard from './KpiCard';
import { TargetIcon, PencilAltIcon } from './icons';
import MarketingRoiChart from './MarketingRoiChart';
import { useData } from '../hooks/useData';
import { useAuth } from '../hooks/useAuth';
import Modal from './Modal';
import SetGoalForm from './SetGoalForm';

const GoalsView: React.FC = () => {
    const { selectedFranchiseData, handlers } = useData();
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const isFranchisorViewing = user?.role === 'FRANCHISOR';

    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    if (!selectedFranchiseData) return null;
    
    const { franchise, goals, leads, consortiums, creditRecoveryCases } = selectedFranchiseData;

    const currentGoal = useMemo(() => {
        return goals.find(g => g.franchiseId === franchise.id && g.month === currentMonth && g.year === currentYear);
    }, [goals, franchise.id, currentMonth, currentYear]);

    const performance = useMemo(() => {
        const totalLeads = leads.length;
        const wonLeads = leads.filter(l => l.status === LeadStatus.WON).length;

        const consortiumRevenue = consortiums.reduce((sum, item) => sum + item.value, 0);
        const creditRecoveryRevenue = creditRecoveryCases
            .filter(c => c.status === CreditRecoveryStatus.RESOLVED)
            .reduce((sum, item) => sum + item.debtAmount, 0);
        
        const totalRevenue = consortiumRevenue + creditRecoveryRevenue;
        
        const conversionRate = totalLeads > 0 ? wonLeads / totalLeads : 0;

        return { totalRevenue, conversionRate };
    }, [leads, consortiums, creditRecoveryCases]);
    
    const handleGoalSubmit = (data: { revenueTarget: number; conversionRateTarget: number; }) => {
        if (isFranchisorViewing) {
            handlers.addOrUpdateGoal({
                ...data,
                franchiseId: franchise.id,
                month: currentMonth,
                year: currentYear,
            });
            setIsModalOpen(false);
        }
    };

    if (!currentGoal) {
        return (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <TargetIcon className="w-12 h-12 mx-auto text-gray-400" />
                <h2 className="mt-4 text-xl font-semibold text-gray-800">Nenhuma meta definida para o mês atual.</h2>
                {isFranchisorViewing ? (
                    <>
                        <p className="mt-2 text-gray-500">Clique no botão abaixo para definir as metas de performance para esta franquia.</p>
                        <button onClick={() => setIsModalOpen(true)} className="mt-4 button-primary">
                            Definir Meta Mensal
                        </button>
                    </>
                ) : (
                    <p className="mt-2 text-gray-500">Entre em contato com a franqueadora para definir as metas de performance.</p>
                )}
                 {isFranchisorViewing && (
                    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Definir Meta para ${new Date(currentYear, currentMonth - 1).toLocaleString('pt-BR', { month: 'long' })}`}>
                        <SetGoalForm
                            onSubmit={handleGoalSubmit}
                            onClose={() => setIsModalOpen(false)}
                            initialData={currentGoal}
                        />
                    </Modal>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-8">
             <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <TargetIcon className="w-8 h-8 text-primary"/>
                    <h2 className="text-2xl font-bold text-gray-800">Metas e Performance de {new Date(currentYear, currentMonth - 1).toLocaleString('pt-BR', { month: 'long' })}</h2>
                </div>
                 {isFranchisorViewing && (
                    <button onClick={() => setIsModalOpen(true)} className="button-secondary flex items-center">
                        <PencilAltIcon className="w-4 h-4 mr-2"/>
                        Editar Meta
                    </button>
                )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 <KpiCard
                    title="Meta de Faturamento"
                    value={performance.totalRevenue}
                    target={currentGoal.revenueTarget}
                    format="currency"
                />
                <KpiCard
                    title="Meta de Conversão de Leads"
                    value={performance.conversionRate}
                    target={currentGoal.conversionRateTarget}
                    format="percentage"
                />
            </div>
             <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalhes da Performance Atual</h3>
                <ul className="divide-y divide-gray-200">
                    <li className="py-3 flex justify-between text-sm">
                        <span className="font-medium text-gray-600">Total de Leads Gerados:</span>
                        <span className="font-semibold text-gray-800">{leads.length}</span>
                    </li>
                    <li className="py-3 flex justify-between text-sm">
                        <span className="font-medium text-gray-600">Leads Convertidos (Ganhos):</span>
                        <span className="font-semibold text-gray-800">{leads.filter(l => l.status === LeadStatus.WON).length}</span>
                    </li>
                    <li className="py-3 flex justify-between text-sm">
                        <span className="font-medium text-gray-600">Faturamento com Consórcios:</span>
                        <span className="font-semibold text-green-600">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(consortiums.reduce((sum, item) => sum + item.value, 0))}</span>
                    </li>
                    <li className="py-3 flex justify-between text-sm">
                        <span className="font-medium text-gray-600">Faturamento com Rec. de Crédito (Resolvido):</span>
                        <span className="font-semibold text-green-600">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(creditRecoveryCases.filter(c => c.status === CreditRecoveryStatus.RESOLVED).reduce((sum, item) => sum + item.debtAmount, 0))}</span>
                    </li>
                </ul>
            </div>
            
            <MarketingRoiChart leads={leads} />

            {isFranchisorViewing && (
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`${currentGoal ? 'Editar' : 'Definir'} Meta para ${new Date(currentYear, currentMonth - 1).toLocaleString('pt-BR', { month: 'long' })}`}>
                    <SetGoalForm
                        onSubmit={handleGoalSubmit}
                        onClose={() => setIsModalOpen(false)}
                        initialData={currentGoal}
                    />
                </Modal>
            )}
        </div>
    );
};

export default GoalsView;