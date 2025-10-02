export enum AuditItemStatus {
    COMPLIANT = 'Conforme',
    NON_COMPLIANT = 'Não Conforme',
    NOT_APPLICABLE = 'N/A',
}

export interface AuditTemplateItem {
    id: number;
    text: string;
}

export interface AuditTemplate {
    id: number;
    title: string;
    description: string;
    items: AuditTemplateItem[];
}

export interface AuditResult {
    templateItemId: number;
    status: AuditItemStatus | null;
    comment: string;
}

export interface Audit {
    id: number;
    franchiseId: number;
    templateId: number;
    auditorName: string; // Could be the franchisor user who initiated it
    auditDate: string; // ISO Date of completion
    score: number; // Percentage (0-100)
    results: AuditResult[];
    status: 'Pendente' | 'Concluído';
    createdAt: string; // ISO Date of initiation
}