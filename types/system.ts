export interface Product {
    id: number;
    name: string;
    description: string;
    isActive: boolean;
}

export interface FranchisorSettings {
    franchisorName: string;
    logoUrl: string;
    primaryColor: string;
    secondaryColor: string;
    royaltyPercentage: number;
    marketingFeePercentage: number;
    defaultSoftwareFee: number;
    defaultSalesCommissionPercentage: number;
    initialFranchiseFee: number;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
}
