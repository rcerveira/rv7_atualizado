import React from 'react';
import { FranchiseWithStats, Transaction } from '../../types';
import Modal from './Modal';
import FranchiseMonthlyRevenueChart from './FranchiseMonthlyRevenueChart';
import { BriefcaseIcon, CashIcon, TrendingUpIcon, ShieldCheckIcon } from './icons';

interface FranchiseSummaryModalProps {
  franchise: FranchiseWithStats | null;
  transactions: Transaction[];
  onClose: () => void;
  onManage: (franchiseId: number) => void;
}

const KpiItem: React.FC<{ label: string; value: string; icon: React.ReactNode }> = ({ label, value, icon }) => (
    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
        <div className="text-primary">{icon}</div>
        <div>
            <p className="text-xs text-gray-500">{label}</p>
            <p className="font-bold text-gray-800 text-lg">{value}</p>
        </div>
    </div>
);

const FranchiseSummaryModal: React.FC<FranchiseSummaryModalProps> = ({ franchise, transactions, onClose, onManage }) => {
  if (!franchise) return null;

  return (
    <Modal isOpen={!!franchise} onClose={onClose} title={`Resumo: ${franchise.name}`}>
      <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-2">
        {/* Header */}
        <div>
          <h3 className="font-semibold text-gray-800">{franchise.ownerName}</h3>
          <p className="text-sm text-gray-500">{franchise.location}</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 gap-4">
            <KpiItem 
                label="Faturamento" 
                value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact' }).format(franchise.consortiumSales)} 
                icon={<CashIcon className="w-6 h-6"/>} 
            />
            <KpiItem 
                label="Lucro" 
                value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact' }).format(franchise.profit)} 
                icon={<TrendingUpIcon className="w-6 h-6"/>} 
            />
            <KpiItem 
                label="Conversão" 
                value={`${(franchise.conversionRate * 100).toFixed(1)}%`} 
                icon={<BriefcaseIcon className="w-6 h-6"/>} 
            />
            <KpiItem 
                label="Health Score" 
                value={franchise.healthScore.toString()} 
                icon={<ShieldCheckIcon className="w-6 h-6"/>} 
            />
        </div>

        {/* Chart */}
        <div>
            <h4 className="text-md font-semibold text-gray-700 mb-2">Receita Mensal (Últimos 6 meses)</h4>
            <FranchiseMonthlyRevenueChart transactions={transactions} />
        </div>
        
        {/* Actions */}
        <div className="flex justify-end pt-4 space-x-3 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                Fechar
            </button>
            <a 
                href={`#/franchises/${franchise.id}/dashboard`}
                onClick={() => {
                  onClose();
                }}
                className="px-4 py-2 bg-primary text-white font-semibold rounded-md hover:bg-blue-800 flex items-center"
            >
                Gerenciar Franquia
            </a>
        </div>
      </div>
    </Modal>
  );
};

export default FranchiseSummaryModal;
