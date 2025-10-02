import React, { useMemo } from 'react';
import { Transaction, TransactionType, TransactionCategory } from '../../types';

interface DREViewProps {
    transactions: Transaction[];
}

const DRELine: React.FC<{ label: string; value: number; isTotal?: boolean; level?: number }> = ({ label, value, isTotal = false, level = 0 }) => (
    <div className={`flex justify-between py-2 px-4 ${isTotal ? 'font-bold border-t' : ''} ${level === 1 ? 'pl-8' : ''}`}>
        <span className={`${isTotal ? 'text-gray-800' : 'text-gray-600'}`}>{label}</span>
        <span className={`${value >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
        </span>
    </div>
);

const DREView: React.FC<DREViewProps> = ({ transactions }) => {
    const dreData = useMemo(() => {
        const revenue = transactions
            .filter(t => t.type === TransactionType.INCOME)
            .reduce((sum, t) => sum + t.amount, 0);

        const expenseTransactions = transactions.filter(t => t.type === TransactionType.EXPENSE);

        const expensesByCategory = expenseTransactions
            .reduce((acc: Record<string, number>, t) => {
                acc[t.category] = (acc[t.category] || 0) + t.amount;
                return acc;
            }, {});

        const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
        
        const netIncome = revenue - totalExpenses;

        return {
            revenue,
            expensesByCategory,
            totalExpenses,
            netIncome
        };
    }, [transactions]);

    return (
        <div className="card">
            <h3 className="section-title mb-4">Demonstrativo de Resultados (DRE)</h3>
            <div className="divide-y divide-gray-200 rounded-lg border">
                <DRELine label="(=) Receita Bruta" value={dreData.revenue} isTotal />
                <div className="py-2 px-4">
                    <span className="font-bold text-gray-800">(-) Despesas</span>
                </div>
                {Object.entries(dreData.expensesByCategory).map(([category, amount]) => (
                    <DRELine key={category} label={category} value={-amount} level={1} />
                ))}
                 <DRELine label="(=) Total de Despesas" value={-dreData.totalExpenses} isTotal />
                 <DRELine label="(=) Lucro Líquido" value={dreData.netIncome} isTotal />
            </div>
        </div>
    );
};

export default DREView;