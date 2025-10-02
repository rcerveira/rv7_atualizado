export interface Franchise {
  id: number;
  name: string;
  location: string;
  // Administrative Details
  cnpj: string;
  corporateName: string;
  inaugurationDate: string; // ISO Date
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  allowedProductIds?: number[];
}

export enum PerformanceStatus {
  EXCELLENT = 'Excelente',
  ON_TARGET = 'Na Meta',
  NEEDS_ATTENTION = 'Requer Atenção',
}

export interface FranchiseWithStats extends Franchise {
  consortiumSales: number;
  creditRecoveryCases: number;
  status: PerformanceStatus;
  profit: number;
  conversionRate: number;
  healthScore: number;
}

export interface Goal {
    id: number;
    franchiseId: number;
    month: number; // 1-12
    year: number;
    revenueTarget: number;
    conversionRateTarget: number; // e.g., 0.10 for 10%
}