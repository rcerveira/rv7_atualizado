import React, { useMemo } from 'react';
import { useData } from '../hooks/useData';
import { FranchiseUser, Consortium, CreditRecoveryCase, CreditRecoveryStatus } from '../types';
import SalespersonPerformanceChart from './SalespersonPerformanceChart';
import { TrendingUpIcon, UserIcon, CashIcon } from './icons';

const SalesPerformanceView: React.FC = () => {
    const { selectedFranchiseData } = useData();

    if (!selectedFranchiseData) return null;
    const { franchiseUsers, consortiums, creditRecoveryCases } = selectedFranchiseData;

    const performanceData = useMemo(() => {
        const stats = franchiseUsers.map(user => ({
            user,
            totalConsortiumValue: 0,
            consortiumCount: 0,
            totalCreditRecoveryValue: 0,
            creditRecoveryCount: 0,
        }));

        const ownerStats = {
             user: { id: 0, name: 'Vendas Diretas (Proprietário)' } as FranchiseUser,
             totalConsortiumValue: 0,
             consortiumCount: 0,
             totalCreditRecoveryValue: 0,
             creditRecoveryCount: 0,
        };

        consortiums.forEach(c => {
            const salespersonStat = stats.find(s => s.user.id === c.salespersonId);
            if (salespersonStat) {
                salespersonStat.totalConsortiumValue += c.value;
                salespersonStat.consortiumCount++;
            } else {
                ownerStats.totalConsortiumValue += c.value;
                ownerStats.consortiumCount++;
            }
        });
        
        creditRecoveryCases
            .filter(c => c.status === CreditRecoveryStatus.RESOLVED)
            .forEach(c => {
                const salespersonStat = stats.find(s => s.user.id === c.salespersonId);
                if (salespersonStat) {
                    salespersonStat.totalCreditRecoveryValue += c.debtAmount;
                    salespersonStat.creditRecoveryCount++;
                } else {
                    ownerStats.totalCreditRecoveryValue += c.debtAmount;
                    ownerStats.creditRecoveryCount++;
                }
            });

        const allStats = [...stats];
        if (ownerStats.consortiumCount > 0 || ownerStats.creditRecoveryCount > 0) {
            allStats.push(ownerStats);
        }

        return allStats.map(s => ({
            ...s,
            totalRevenue: s.totalConsortiumValue + s.totalCreditRecoveryValue,
        })).sort((a, b) => b.totalRevenue - a.totalRevenue);

    }, [franchiseUsers, consortiums, creditRecoveryCases]);

    const chartData = useMemo(() => {
        return performanceData.map(d => ({
            name: d.user.name,
            value: d.totalRevenue,
        })).filter(d => d.value > 0);
    }, [performanceData]);

    return (
        <div className="space-y-8">
            <div className="flex items-center space-x-3">
                <TrendingUpIcon className="w-8 h-8 text-primary"/>
                <h2 className="text-2xl font-bold text-gray-800">Desempenho da Equipe de Vendas</h2>
            </div>
            
            {chartData.length > 0 ? (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Contribuição de Receita por Vendedor</h3>
                    <SalespersonPerformanceChart data={chartData} />
                </div>
            ) : null}

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ranking de Vendedores</h3>
                {performanceData.length > 0 ? (
                    <div className="space-y-4">
                        {performanceData.map((data, index) => (
                             <div key={data.user.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50/50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <span className="text-lg font-bold text-gray-400 w-6 text-center">{index + 1}</span>
                                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-light flex items-center justify-center">
                                            <UserIcon className="h-6 w-6 text-primary"/>
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800">{data.user.name}</p>
                                            <p className="text-sm text-gray-500">{data.user.role || 'Vendas Diretas'}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500 uppercase">Receita Total</p>
                                        <p className="text-xl font-bold text-primary">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.totalRevenue)}</p>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="font-semibold text-gray-700">Consórcios</p>
                                        <p className="text-gray-600">{data.consortiumCount} vendas totalizando {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.totalConsortiumValue)}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-700">Recuperação de Crédito</p>
                                        <p className="text-gray-600">{data.creditRecoveryCount} casos resolvidos totalizando {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.totalCreditRecoveryValue)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 py-8">Nenhuma venda registrada para a equipe ainda.</p>
                )}
            </div>
        </div>
    );
};

export default SalesPerformanceView;