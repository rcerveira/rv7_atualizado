// FIX: Import InternalNote from './communication' instead of './crm'.
import { InternalNote } from './communication';

export enum ConsortiumStatus {
  PENDING = 'Pendente',
  ACTIVE = 'Ativo',
  COMPLETED = 'Concluído',
}

export interface Consortium {
  id: number;
  franchiseId: number;
  clientId: number;
  value: number;
  date: string; // ISO date string
  status: ConsortiumStatus;
  salespersonId?: number;
}

export enum CreditRecoveryStatus {
  INITIAL_CONTACT = 'Contato Inicial',
  NEGOTIATING = 'Em Negociação',
  RESOLVED = 'Resolvido',
  UNRESOLVED = 'Não Resolvido',
}

export interface ContactHistoryEntry {
  date: string; // ISO date string
  summary: string;
}

export interface CreditRecoveryCase {
  id: number;
  franchiseId: number;
  clientId: number;
  debtAmount: number;
  lastContactDate: string; // ISO date string
  status: CreditRecoveryStatus;
  contactHistory: ContactHistoryEntry[];
  internalNotes: InternalNote[];
  salespersonId?: number;
}

export enum SaleStatus {
  PENDING_PAYMENT = 'Pagamento Pendente',
  PARTIALLY_PAID = 'Parcialmente Pago',
  PAID = 'Pago',
  CANCELLED = 'Cancelada',
}

export interface SaleItem {
  id: number;
  saleId: number;
  productId: number;
  productName: string;
  value: number;
}

export interface Sale {
  id: number;
  franchiseId: number;
  clientId: number;
  leadId?: number;
  salespersonId?: number;
  saleDate: string; // ISO Date
  totalAmount: number;
  paymentMethod: 'À Vista' | 'Parcelado';
  installments: number; // 1 for 'À Vista'
  status: SaleStatus;
  observations?: string;
}