export enum MarketingCampaignStatus {
    SCHEDULED = 'Agendada',
    ACTIVE = 'Ativa',
    ARCHIVED = 'Arquivada',
}

export enum CampaignMaterialType {
    IMAGE = 'Imagem',
    VIDEO = 'Vídeo',
    PDF = 'Documento PDF',
    TEXT = 'Texto para Redes Sociais',
}

export interface CampaignMaterial {
    id: number;
    name: string;
    type: CampaignMaterialType;
    downloadUrl: string;
}

export interface MarketingCampaign {
    id: number;
    title: string;
    description: string;
    startDate: string; // ISO Date
    endDate: string; // ISO Date
    status: MarketingCampaignStatus;
    materials: CampaignMaterial[];
}
