import React, { useState, useMemo } from 'react';
import { Franchise, Transaction, Invoice, TransactionType, CreditRecoveryStatus, InvoiceStatus } from '../types';
import TransactionsTable from './TransactionsTable';
import InvoicesTable from './InvoicesTable';
import Modal from './Modal';
import AddTransactionForm from './AddTransactionForm';
import AddInvoiceForm from './AddInvoiceForm';
import ConfirmationModal from './ConfirmationModal';
import { PlusIcon } from './icons';
import { useData } from '../hooks/useData';
import FinancialsDashboardTab from './financials/FinancialsDashboardTab';
import DREView from './financials/DREView';
import { useLocation } from 'react-router-dom';

type FinancialsTab = 'dashboard' | 'invoices' | 'transactions' | 'dre';

const FranchisorFinancials: React.FC = () => {
    const { 
        data,
        handlers
    } = useData();
    const location = useLocation();
    const path = location.pathname || '/';
    const { franchises, transactions: allTransactions, invoices: allInvoices } = data;
    const { addTransaction, addInvoice, updateInvoice, deleteInvoice } = handlers;

    const activeTab = useMemo<FinancialsTab>(() => {
        const tab = path.split('/')[2] || 'dashboard'; // path is /financials/:tab
        const validTabs: FinancialsTab[] = ['dashboard', 'invoices', 'transactions', 'dre'];
        return validTabs.includes(tab as FinancialsTab) ? (tab as FinancialsTab) : 'dashboard';
    }, [path]);

    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
    const [invoiceModal, setInvoiceModal] = useState<{ isOpen: boolean, initialData?: Invoice | null }>({ isOpen: false, initialData: null });
    const [invoiceToDeleteId, setInvoiceToDeleteId] = useState<number | null>(null);

    const franchisorTransactions = useMemo(() => allTransactions.filter(t => t.franchiseId === 0), [allTransactions]);
    const royaltyInvoices = useMemo(() => allInvoices, [allInvoices]); 

    const handleAddTransactionSubmit = (transaction: Omit<Transaction, 'id' | 'franchiseId' | 'date'>) => {
        addTransaction({ ...transaction, franchiseId: 0 });
    };
    
    const handleInvoiceSubmit = (invoiceData: Invoice | Omit<Invoice, 'id'>) => {
        if ('id' in invoiceData) {
            updateInvoice(invoiceData);
        } else {
            addInvoice(invoiceData);
        }
        setInvoiceModal({ isOpen: false, initialData: null });
    };

    const handleConfirmDelete = () => {
        if (invoiceToDeleteId) {
            deleteInvoice(invoiceToDeleteId);
            setInvoiceToDeleteId(null);
        }
    };

    const { totalIncome, totalExpense, totalRoyaltiesBilled, totalRoyaltiesPaid, totalRoyaltiesPending } = useMemo(() => {
        const income = franchisorTransactions.filter(t => t.type === TransactionType.INCOME).reduce((sum, t) => sum + t.amount, 0);
        const expense = franchisorTransactions.filter(t => t.type === TransactionType.EXPENSE).reduce((sum, t) => sum + t.amount, 0);
        const billed = royaltyInvoices.reduce((sum, i) => sum + i.amount, 0);
        const paid = royaltyInvoices.filter(i => i.status === InvoiceStatus.PAID).reduce((sum, i) => sum + i.amount, 0);
        
        return {
            totalIncome: income,
            totalExpense: expense,
            totalRoyaltiesBilled: billed,
            totalRoyaltiesPaid: paid,
            totalRoyaltiesPending: billed - paid,
        };
    }, [franchisorTransactions, royaltyInvoices]);


    const tabItems: { id: FinancialsTab; label: string }[] = [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'invoices', label: 'Faturas de Royalties' },
        { id: 'transactions', label: 'Transações' },
        { id: 'dre', label: 'DRE (Franqueadora)' },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <FinancialsDashboardTab 
                            totalIncome={totalIncome}
                            totalExpense={totalExpense}
                            totalRoyaltiesBilled={totalRoyaltiesBilled}
                            totalRoyaltiesPaid={totalRoyaltiesPaid}
                            totalRoyaltiesPending={totalRoyaltiesPending}
                        />;
            case 'invoices':
                return (
                     <div className="card">
                         <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                            <h3 className="section-title">Faturas de Royalties Geradas</h3>
                             <button onClick={() => setInvoiceModal({ isOpen: true, initialData: null })} className="button-primary text-sm w-full sm:w-auto">
                                <PlusIcon className="w-4 h-4 mr-1" />
                                Gerar Fatura
                              </button> 
                        </div>
                        <InvoicesTable 
                            invoices={royaltyInvoices} 
                            onEdit={(invoice) => setInvoiceModal({ isOpen: true, initialData: invoice })}
                            onDelete={(invoiceId) => setInvoiceToDeleteId(invoiceId)}
                        />
                    </div>
                );
            case 'transactions':
                 return (
                     <div className="card">
                         <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                            <h3 className="section-title">Transações (Franqueadora)</h3>
                            <button onClick={() => setIsTransactionModalOpen(true)} className="button-primary text-sm w-full sm:w-auto">
                                <PlusIcon className="w-4 h-4 mr-1" />
                                Nova Transação
                            </button>
                        </div>
                        <TransactionsTable transactions={franchisorTransactions} />
                    </div>
                 );
            case 'dre':
                return <DREView transactions={franchisorTransactions} />;
            default:
                return null;
        }
    };


    return (
        <div className="space-y-6">
            <h1 className="page-title">Financeiro da Franqueadora</h1>
            <div className="border-b border-border">
                <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
                    {tabItems.map((tab) => (
                        <a
                            key={tab.id}
                            href={`#/financials/${tab.id}`}
                            className={`${
                                activeTab === tab.id
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-bold text-sm transition-colors focus:outline-none`}
                            aria-current={activeTab === tab.id ? 'page' : undefined}
                        >
                            {tab.label}
                        </a>
                    ))}
                </nav>
            </div>

            <div>
                {renderTabContent()}
            </div>
            
            <Modal isOpen={isTransactionModalOpen} onClose={() => setIsTransactionModalOpen(false)} title="Adicionar Transação (Franqueadora)">
                <AddTransactionForm onAdd={handleAddTransactionSubmit} onClose={() => setIsTransactionModalOpen(false)} />
            </Modal>
            
            <Modal isOpen={invoiceModal.isOpen} onClose={() => setInvoiceModal({ isOpen: false, initialData: null })} title={invoiceModal.initialData ? "Editar Fatura" : "Gerar Fatura de Royalties"}>
                <AddInvoiceForm 
                    onSubmit={handleInvoiceSubmit} 
                    onClose={() => setInvoiceModal({ isOpen: false, initialData: null })} 
                    franchises={franchises}
                    initialData={invoiceModal.initialData}
                />
            </Modal>

            <ConfirmationModal
                isOpen={!!invoiceToDeleteId}
                onClose={() => setInvoiceToDeleteId(null)}
                onConfirm={handleConfirmDelete}
                title="Confirmar Exclusão"
                message="Tem certeza que deseja excluir esta fatura? Esta ação não pode ser desfeita."
            />
        </div>
    );
};

export default FranchisorFinancials;