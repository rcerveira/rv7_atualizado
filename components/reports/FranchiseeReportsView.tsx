import React from 'react';
import { useData } from '../../hooks/useData';
import { ChartBarIcon } from '../icons';
import SalesTrendChart from './SalesTrendChart';
import LeadConversionFunnel from './LeadConversionFunnel';
import SalesByProductChart from './SalesByProductChart';

const FranchiseeReportsView: React.FC = () => {
    const { selectedFranchiseData } = useData();

    if (!selectedFranchiseData) return null;

    const { consortiums, creditRecoveryCases, leads, products } = selectedFranchiseData;

    return (
        <div className="space-y-8">
            <div className="flex items-center space-x-3">
                <ChartBarIcon className="w-8 h-8 text-primary"/>
                <h2 className="text-2xl font-bold text-gray-800">Meus Relatórios</h2>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
                 <h3 className="text-lg font-semibold text-gray-900 mb-4">Evolução de Vendas (Últimos 12 Meses)</h3>
                 <SalesTrendChart consortiums={consortiums} creditRecoveryCases={creditRecoveryCases} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Funil de Conversão de Leads</h3>
                    <LeadConversionFunnel leads={leads} />
                </div>
                 <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendas por Produto/Serviço</h3>
                    <SalesByProductChart leads={leads} products={products} />
                </div>
            </div>
        </div>
    );
};

export default FranchiseeReportsView;
