import React from 'react';
import { UsersIcon, BriefcaseIcon, DocumentReportIcon, ShieldCheckIcon } from '../icons';

interface QuickStatsProps {
  franchiseCount: number;
  totalLeads: number;
  activeContracts: number;
  recoveryCases: number;
}

const StatCard: React.FC<{ icon: React.ReactNode; value: string | number; label: string; }> = ({ icon, value, label }) => (
    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
        <div className="p-3 rounded-full bg-primary/10 text-primary mr-4">
            {icon}
        </div>
        <div>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            <p className="text-sm font-medium text-gray-500">{label}</p>
        </div>
    </div>
);

const QuickStats: React.FC<QuickStatsProps> = ({ franchiseCount, totalLeads, activeContracts, recoveryCases }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md h-full">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Rede em Números</h3>
        <div className="space-y-4">
            <StatCard icon={<UsersIcon className="w-6 h-6" />} value={franchiseCount} label="Franquias Ativas" />
            <StatCard icon={<BriefcaseIcon className="w-6 h-6" />} value={totalLeads} label="Leads (Novas Franquias)" />
            <StatCard icon={<DocumentReportIcon className="w-6 h-6" />} value={activeContracts} label="Contratos de Consórcio" />
            <StatCard icon={<ShieldCheckIcon className="w-6 h-6" />} value={recoveryCases} label="Casos de Recuperação" />
        </div>
    </div>
  );
};

export default QuickStats;