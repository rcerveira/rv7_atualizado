import React from 'react';

interface FinancialSummaryCardProps {
  title: string;
  amount: number;
  icon: React.ReactNode;
  colorClass: string;
}

const FinancialSummaryCard: React.FC<FinancialSummaryCardProps> = ({ title, amount, icon, colorClass }) => {
  return (
    <div className="bg-card p-6 rounded-2xl shadow-lg shadow-gray-200/50">
      <div className="flex items-center">
        <div className={`p-3 rounded-full mr-4 ${colorClass}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-text-secondary">{title}</p>
          <p className="text-2xl font-bold text-text-primary">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FinancialSummaryCard;