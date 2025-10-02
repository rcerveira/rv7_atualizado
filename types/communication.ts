
export enum KnowledgeBaseCategory {
    MANUAIS_DE_OPERACAO = 'Manuais de Operação',
    MATERIAL_DE_MARKETING = 'Material de Marketing',
    TREINAMENTOS = 'Treinamentos',
    COMUNICADOS = 'Comunicados',
}

export interface KnowledgeBaseResource {
  id: number;
  title: string;
  description: string;
  category: KnowledgeBaseCategory;
  link: string; // URL to the document/video
  createdAt: string; // ISO date string
}

export interface Announcement {
    id: number;
    title: string;
    content: string;
    author: string;
    createdAt: string; // ISO Date string
    isPinned: boolean;
}

export enum SupportTicketStatus {
    OPEN = 'Aberto',
    IN_PROGRESS = 'Em Andamento',
    RESOLVED = 'Resolvido',
    CLOSED = 'Fechado',
}

export enum SupportTicketCategory {
    FINANCIAL = 'Financeiro',
    MARKETING = 'Marketing',
    OPERATIONAL = 'Operacional',
    IT_SUPPORT = 'Suporte de TI',
    OTHER = 'Outros',
}

export interface TicketMessage {
    id: number;
    author: string; // Can be franchise owner name or a franchisor user name
    isFranchisor: boolean;
    text: string;
    createdAt: string; // ISO Date string
}

export interface SupportTicket {
    id: number;
    franchiseId: number;
    subject: string;
    category: SupportTicketCategory;
    status: SupportTicketStatus;
    createdAt: string; // ISO Date string
    updatedAt: string; // ISO Date string
    messages: TicketMessage[];
}

// FIX: Define and export InternalNote to be used across different modules.
export interface InternalNote {
    id: number;
    text: string;
    author: string;
    createdAt: string; // ISO Date string
}

export interface ForumReply {
    id: number;
    postId: number;
    authorId: string; // AuthenticatedUser ID
    authorName: string;
    authorFranchiseName: string;
    content: string;
    createdAt: string; // ISO Date
}

export interface ForumPost {
    id: number;
    authorId: string; // AuthenticatedUser ID
    authorName: string;
    authorFranchiseName: string;
    title: string;
    content: string;
    createdAt: string; // ISO Date
    isPinned: boolean;
    replies: ForumReply[];
}