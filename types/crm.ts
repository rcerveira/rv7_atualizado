import { InternalNote } from './communication';

export interface Client {
  id: number;
  franchiseId: number;
  name: string; // Nome (PF) ou Nome Fantasia (PJ)
  phone: string;
  email: string;
  createdAt: string; // ISO date string

  type: ClientType;
  
  // Pessoa Física
  cpf?: string;
  
  // Pessoa Jurídica
  cnpj?: string;
  razaoSocial?: string;

  // Address
  cep?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;

  /**
   * @deprecated Use `cpf` ou `cnpj` com base no `type`.
   */
  cpfOrCnpj?: string;
}

export enum ClientType {
  PESSOA_FISICA = 'Pessoa Física',
  PESSOA_JURIDICA = 'Pessoa Jurídica',
}

export enum LeadStatus {
    NEW = 'Novo',
    CONTACTED = 'Contatado',
    NEGOTIATING = 'Em Negociação',
    WON = 'Ganho',
    LOST = 'Perdido',
}

export interface LeadNote {
    id: number;
    leadId: number;
    text: string;
    author: string; // Could be extended to a user object
    createdAt: string; // ISO date string
}

export interface Lead {
    id: number;
    franchiseId: number;
    clientId: number;
    serviceOfInterest: string;
    status: LeadStatus;
    createdAt: string; // ISO date string
    source?: string;
    notes?: LeadNote[];
    negotiatedValue?: number;
    salespersonId?: number;
}

export interface Task {
    id: number;
    franchiseId: number;
    leadId?: number | null;
    title: string;
    dueDate: string; // ISO date string
    completed: boolean;
}

export enum FranchiseeLeadStatus {
  INITIAL_INTEREST = 'Interesse Inicial',
  IN_ANALYSIS = 'Em Análise',
  PROPOSAL_SENT = 'Proposta Enviada',
  PENDING_CONTRACT = 'Contrato Pendente',
  DEAL_CLOSED = 'Negócio Fechado',
  OPPORTUNITY_LOST = 'Perdeu Oportunidade',
}


export enum DocumentStatus {
    PENDING = 'Pendente',
    RECEIVED = 'Recebido',
    VERIFIED = 'Verificado',
    INVALID = 'Inválido',
}

export interface FranchiseeDocument {
    id: number;
    name: string;
    status: DocumentStatus;
    notes?: string;
}

export interface FranchiseeLead {
  id: number;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  cityOfInterest: string;
  investmentCapital: number;
  status: FranchiseeLeadStatus;
  createdAt: string; // ISO date string
  documents: FranchiseeDocument[];
  internalNotes: InternalNote[];
}