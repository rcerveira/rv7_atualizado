import { Sale } from "./operations";

export enum ContractStatus {
    DRAFT = 'Rascunho',
    SENT = 'Enviado ao Cliente',
    SIGNED = 'Assinado',
    CANCELLED = 'Cancelado',
}

export interface ContractTemplate {
    id: number;
    title: string;
    productId: number; // Linked to a specific product/service
    body: string; // The template content with placeholders like {{CLIENT_NAME}}
    isActive: boolean;
}

export interface Contract {
    id: number;
    saleId: number;
    templateId: number;
    status: ContractStatus;
    generatedAt: string; // ISO Date
    signedAt?: string; // ISO Date
    content: string; // The final generated content with replaced placeholders
}
