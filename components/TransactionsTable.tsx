import React, { useMemo } from 'react';
import { Transaction, TransactionType } from '../types';
import FinancialSummaryCard from './FinancialSummaryCard';
import { CashIcon } from './icons';

interface TransactionsTableProps {
  transactions: Transaction[];
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({ transactions }) => {

  const { totalIncome, totalExpense } = useMemo(() => {
    return transactions.reduce(
      (acc, transaction) => {
        if (transaction.type === TransactionType.INCOME) {
          acc.totalIncome += transaction.amount;
        } else {
          acc.totalExpense += transaction.amount;
        }
        return acc;
      },
      { totalIncome: 0, totalExpense: 0 }
    );
  }, [transactions]);


  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.length > 0 ? transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString('pt-BR')}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    transaction.type === TransactionType.INCOME ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {transaction.type === TransactionType.INCOME ? 'Receita' : 'Despesa'}
                  </span>
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                  transaction.type === TransactionType.INCOME ? 'text-green-600' : 'text-red-600'
                }`}>
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(transaction.amount)}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">Nenhuma transação registrada.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {transactions.length > 0 && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FinancialSummaryCard 
                title="Total de Receitas" 
                amount={totalIncome} 
                icon={<CashIcon className="w-6 h-6" />} 
                colorClass="bg-green-100 text-green-600" 
            />
            <FinancialSummaryCard 
                title="Total de Despesas" 
                amount={totalExpense} 
                icon={<CashIcon className="w-6 h-6" />} 
                colorClass="bg-red-100 text-red-600" 
            />
        </div>
      )}

    </div>
  );
};

export default TransactionsTable;