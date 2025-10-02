import { FranchisorSettings } from '../types';

// Default franchisor settings, used as a fallback if the database call fails.
// The primary source of truth is the 'franchisor_settings' table in Supabase.
export const initialFranchisorSettings: FranchisorSettings = {
    franchisorName: 'RV7',
    logoUrl: '',
    primaryColor: '#1E3A8A',
    secondaryColor: '#10B981',
    royaltyPercentage: 5,
    marketingFeePercentage: 2,
    defaultSoftwareFee: 250,
    defaultSalesCommissionPercentage: 10,
    initialFranchiseFee: 25000,
    contactName: 'JOÃO SILVA (SUPORTE)',
    contactEmail: 'suporte@rv7.com',
    contactPhone: '(11) 98765-4321'
};