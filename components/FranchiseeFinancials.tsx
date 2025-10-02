import React, { useState, useMemo } from 'react';
import { Transaction, TransactionType, Invoice, CreditRecoveryStatus } from '../types';
import FinancialSummaryCard from './FinancialSummaryCard';
import TransactionsTable from './TransactionsTable';
import InvoicesTable from './InvoicesTable';
import Modal from './Modal';
import AddTransactionForm from './AddTransactionForm';
import { CashIcon, PlusIcon, ReceiptTaxIcon, ShieldCheckIcon, ClockIcon, ChartBarIcon } from './icons';
import { useData } from '../hooks/useData';
import DREView from './financials/DREView';
import { useLocation } from 'react-router-dom';

type FinancialsTab = 'summary' | 'transactions' | 'invoices' | 'dre';

const FranchiseeFinancials: React.FC = () => {
    const { selectedFranchiseData, handlers } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const location = useLocation();
    const path = location.pathname || '/';

    const activeTab = useMemo<FinancialsTab>(() => {
        const parts = path.split('/');
        const financialsIndex = parts.indexOf('financials');
        if (financialsIndex === -1) return 'summary';

        const tab = parts[financialsIndex + 1] || 'summary';
        const validTabs: FinancialsTab[] = ['summary', 'transactions', 'invoices', 'dre'];
        return validTabs.includes(tab as FinancialsTab) ? (tab as FinancialsTab) : 'summary';
    }, [path]);

    if (!selectedFranchiseData) return null;

    const { franchise, transactions, invoices, creditRecoveryCases } = selectedFranchiseData;
    const { addTransaction: onAddTransaction } = handlers;

    const handleAddTransactionSubmit = (transaction: Omit<Transaction, 'id' | 'franchiseId' | 'date'>) => {
        onAddTransaction({ ...transaction, franchiseId: franchise.id });
    };

    const tabItems = [
        { id: 'summary', label: 'Resumo' },
        { id: 'transactions', label: 'Transações' },
        { id: 'invoices', label: 'Faturas' },
        { id: 'dre', label: 'DRE' },
    ];
    
    const renderTabContent = () => {
        switch(activeTab) {
            case 'summary':
                const totalIncome = transactions.filter(t => t.type === TransactionType.INCOME).reduce((sum, t) => sum + t.amount, 0);
                const totalExpense = transactions.filter(t => t.type === TransactionType.EXPENSE).reduce((sum, t) => sum + t.amount, 0);
                const totalRoyalties = invoices.reduce((sum, i) => sum + i.amount, 0);

                const resolvedDebtTotal = creditRecoveryCases
                    .filter(c => c.status === CreditRecoveryStatus.RESOLVED)
                    .reduce((sum, c) => sum + c.debtAmount, 0);

                const negotiatingDebtTotal = creditRecoveryCases
                    .filter(c => c.status === CreditRecoveryStatus.NEGOTIATING || c.status === CreditRecoveryStatus.INITIAL_CONTACT)
                    .reduce((sum, c) => sum + c.debtAmount, 0);
                return (
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FinancialSummaryCard title="Receita Total" amount={totalIncome} icon={<CashIcon className="w-6 h-6" />} colorClass="bg-green-100 text-green-600" />
                        <FinancialSummaryCard title="Despesa Operacional" amount={totalExpense} icon={<CashIcon className="w-6 h-6" />} colorClass="bg-red-100 text-red-600" />
                        <FinancialSummaryCard title="Lucro Líquido" amount={totalIncome - totalExpense} icon={<CashIcon className="w-6 h-6" />} colorClass="bg-blue-100 text-blue-600" />
                        <FinancialSummaryCard title="Dívida Recuperada (Resolvido)" amount={resolvedDebtTotal} icon={<ShieldCheckIcon className="w-6 h-6" />} colorClass="bg-green-100 text-green-600" />
                        <FinancialSummaryCard title="Dívidas em Aberto" amount={negotiatingDebtTotal} icon={<ClockIcon className="w-6 h-6" />} colorClass="bg-yellow-100 text-yellow-600" />
                        <FinancialSummaryCard title="Royalties (Faturado)" amount={totalRoyalties} icon={<ReceiptTaxIcon className="w-6 h-6" />} colorClass="bg-yellow-100 text-yellow-600" />
                    </div>
                )
            case 'transactions':
                return (
                     <div className="card">
                         <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                            <h3 className="section-title">Transações Recentes</h3>
                            <button onClick={() => setIsModalOpen(true)} className="button-primary text-sm w-full sm:w-auto">
                                <PlusIcon className="w-4 h-4 mr-1" />
                                Nova Transação
                            </button>
                        </div>
                        <TransactionsTable transactions={transactions} />
                    </div>
                )
            case 'invoices':
                 return (
                     <div className="card">
                        <h3 className="section-title mb-4">Faturas a Pagar (Royalties)</h3>
                        <InvoicesTable invoices={invoices} />
                    </div>
                 )
            case 'dre':
                return <DREView transactions={transactions} />;
        }
    }


    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-3">
                <CashIcon className="w-8 h-8 text-primary"/>
                <h2 className="text-2xl font-bold text-gray-800">Financeiro da Franquia</h2>
            </div>

            <div className="border-b border-border">
                <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
                    {tabItems.map((tab) => {
                        const isFranchiseeView = !path.startsWith('/franchises/');
                        const basePath = isFranchiseeView ? `/financials` : `/franchises/${franchise.id}/financials`;
                        const href = `#${basePath}/${tab.id}`;
                        return (
                            <a
                                key={tab.id}
                                href={href}
                                className={`${
                                    activeTab === tab.id
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-bold text-sm transition-colors focus:outline-none`}
                            >
                                {tab.label}
                            </a>
                        );
                    })}
                </nav>
            </div>
            
            <div>{renderTabContent()}</div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Adicionar Nova Transação">
                <AddTransactionForm onAdd={handleAddTransactionSubmit} onClose={() => setIsModalOpen(false)} />
            </Modal>
        </div>
    );
};

export default FranchiseeFinancials;