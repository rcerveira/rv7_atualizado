export enum TransactionType {
    INCOME = 'income',
    EXPENSE = 'expense',
}

export enum TransactionCategory {
    SALES_COMMISSION = 'Comissão de Venda',
    OPERATIONAL_EXPENSE = 'Despesa Operacional',
    MARKETING_EXPENSE = 'Despesa de Marketing',
    SUPPLIES = 'Suprimentos',
    TAXES = 'Impostos',
    ROYALTIES = 'Royalties',
    OTHER_INCOME = 'Outras Receitas',
    OTHER_EXPENSE = 'Outras Despesas',
}


export interface Transaction {
    id: number;
    franchiseId: number;
    description: string;
    amount: number;
    type: TransactionType;
    category: TransactionCategory;
    date: string; // ISO date string
}

export enum InvoiceStatus {
    DRAFT = 'Draft',
    SENT = 'Sent',
    PAID = 'Paid',
    OVERDUE = 'Overdue',
}

export interface Invoice {
    id: number;
    franchiseId: number;
    clientName: string; // Can be franchise name for royalties
    amount: number;
    dueDate: string; // ISO date string
    status: InvoiceStatus;
}