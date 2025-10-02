/**
 * Camada de serviço de dados com feature-flag para Supabase.
 * 
 * Objetivo:
 * - Fasear a migração: quando as credenciais estiverem configuradas, podemos trocar
 *   gradualmente as funções mock por consultas reais ao Supabase.
 * - Neste momento, TODOs indicam onde implementar chamadas ao Supabase.
 * - A assinatura das funções é mantida igual à de data/initialData.ts para evitar mudanças no DataContext.
 */

import { areSupabaseCredentialsSet, supabase } from '../utils/supabaseClient';
import * as mock from '../data/initialData';

/**
 * Flag dinâmica: usa mock quando não há credenciais ou quando preferido via toggle.
 */
const preferMock = false;
const useMock = preferMock || !areSupabaseCredentialsSet || !supabase;

/**
 * Utilitários de mapeamento (snake_case -> camelCase) para algumas tabelas centrais.
 */
type AnyRecord = Record<string, any>;

const mapFranchise = (r: AnyRecord) => ({
  id: r.id,
  name: r.name,
  location: r.location,
  cnpj: r.cnpj,
  corporateName: r.corporate_name,
  inaugurationDate: r.inauguration_date,
  ownerName: r.owner_name,
  ownerEmail: r.owner_email,
  ownerPhone: r.owner_phone,
  allowedProductIds: r.allowed_product_ids ?? [],
});

const mapSystemUser = (r: AnyRecord) => ({
  id: r.id,
  name: r.name,
  email: r.email,
  role: r.role,
});

const mapFranchiseUser = (r: AnyRecord) => ({
  id: r.id,
  franchiseId: r.franchise_id,
  name: r.name,
  email: r.email,
  role: r.role,
});

const mapProduct = (r: AnyRecord) => ({
  id: r.id,
  name: r.name,
  description: r.description,
  isActive: r.is_active,
});

const mapFranchisorSettings = (r: AnyRecord) => ({
  franchisorName: r.franchisor_name,
  logoUrl: r.logo_url,
  primaryColor: r.primary_color,
  secondaryColor: r.secondary_color,
  royaltyPercentage: r.royalty_percentage,
  marketingFeePercentage: r.marketing_fee_percentage,
  defaultSoftwareFee: r.default_software_fee,
  defaultSalesCommissionPercentage: r.default_sales_commission_percentage,
  initialFranchiseFee: r.initial_franchise_fee,
  contactName: r.contact_name,
  contactEmail: r.contact_email,
  contactPhone: r.contact_phone,
});

// Core
export const fetchFranchises = async () => {
  if (useMock) return mock.fetchFranchises();
  const { data, error } = await supabase.from('franchises').select('*').order('id');
  if (error || !data) return mock.fetchFranchises();
  return data.map(mapFranchise);
};

export const fetchSystemUsers = async () => {
  if (useMock) return mock.fetchSystemUsers();
  const { data, error } = await supabase.from('system_users').select('*').order('id');
  if (error || !data) return mock.fetchSystemUsers();
  return data.map(mapSystemUser);
};

export const fetchFranchiseUsers = async () => {
  if (useMock) return mock.fetchFranchiseUsers();
  const { data, error } = await supabase.from('franchise_users').select('*').order('id');
  if (error || !data) return mock.fetchFranchiseUsers();
  return data.map(mapFranchiseUser);
};

export const fetchProducts = async () => {
  if (useMock) return mock.fetchProducts();
  const { data, error } = await supabase.from('products').select('*').order('id');
  if (error || !data) return mock.fetchProducts();
  return data.map(mapProduct);
};

export const fetchFranchisorSettings = async () => {
  if (useMock) return mock.fetchFranchisorSettings();
  const { data, error } = await supabase.from('franchisor_settings').select('*').limit(1).maybeSingle();
  if (error || !data) return mock.fetchFranchisorSettings();
  return mapFranchisorSettings(data);
};

export const fetchAuditTemplates = async () => {
  if (!areSupabaseCredentialsSet || !supabase || useMock) return mock.fetchAuditTemplates();
  // TODO: Implementar leitura de 'audit_templates' no Supabase.
  return mock.fetchAuditTemplates();
};

export const fetchTrainingCourses = async () => {
  if (!areSupabaseCredentialsSet || !supabase || useMock) return mock.fetchTrainingCourses();
  // TODO: Implementar leitura de 'training_courses' no Supabase.
  return mock.fetchTrainingCourses();
};

export const fetchTrainingModules = async () => {
  if (!areSupabaseCredentialsSet || !supabase || useMock) return mock.fetchTrainingModules();
  // TODO: Implementar leitura de 'training_modules' no Supabase.
  return mock.fetchTrainingModules();
};

export const fetchMarketingCampaigns = async () => {
  if (!areSupabaseCredentialsSet || !supabase || useMock) return mock.fetchMarketingCampaigns();
  // TODO: Implementar leitura de 'marketing_campaigns' no Supabase.
  return mock.fetchMarketingCampaigns();
};

export const fetchContractTemplates = async () => {
  if (!areSupabaseCredentialsSet || !supabase || useMock) return mock.fetchContractTemplates();
  // TODO: Implementar leitura de 'contract_templates' no Supabase.
  return mock.fetchContractTemplates();
};

// Content
export const fetchGoals = async () => {
  if (!areSupabaseCredentialsSet || !supabase || useMock) return mock.fetchGoals();
  // TODO: Implementar leitura de 'goals' no Supabase.
  return mock.fetchGoals();
};

export const fetchClients = async () => {
  if (!areSupabaseCredentialsSet || !supabase || useMock) return mock.fetchClients();
  // TODO: Implementar leitura de 'clients' no Supabase.
  return mock.fetchClients();
};

export const fetchLeads = async () => {
  if (!areSupabaseCredentialsSet || !supabase || useMock) return mock.fetchLeads();
  // TODO: Implementar leitura de 'leads' no Supabase.
  return mock.fetchLeads();
};

export const fetchLeadNotes = async () => {
  if (!areSupabaseCredentialsSet || !supabase || useMock) return mock.fetchLeadNotes();
  // TODO: Implementar leitura de 'lead_notes' no Supabase.
  return mock.fetchLeadNotes();
};

export const fetchTasks = async () => {
  if (!areSupabaseCredentialsSet || !supabase || useMock) return mock.fetchTasks();
  // TODO: Implementar leitura de 'tasks' no Supabase.
  return mock.fetchTasks();
};

export const fetchTransactions = async () => {
  if (!areSupabaseCredentialsSet || !supabase || useMock) return mock.fetchTransactions();
  // TODO: Implementar leitura de 'transactions' no Supabase.
  return mock.fetchTransactions();
};

export const fetchInvoices = async () => {
  if (!areSupabaseCredentialsSet || !supabase || useMock) return mock.fetchInvoices();
  // TODO: Implementar leitura de 'invoices' no Supabase.
  return mock.fetchInvoices();
};

export const fetchConsortiums = async () => {
  if (!areSupabaseCredentialsSet || !supabase || useMock) return mock.fetchConsortiums();
  // TODO: Implementar leitura de 'consortiums' no Supabase.
  return mock.fetchConsortiums();
};

export const fetchCreditRecoveryCases = async () => {
  if (!areSupabaseCredentialsSet || !supabase || useMock) return mock.fetchCreditRecoveryCases();
  // TODO: Implementar leitura de 'credit_recovery_cases' no Supabase.
  return mock.fetchCreditRecoveryCases();
};

export const fetchKnowledgeBaseResources = async () => {
  if (!areSupabaseCredentialsSet || !supabase || useMock) return mock.fetchKnowledgeBaseResources();
  // TODO: Implementar leitura de 'knowledge_base_resources' no Supabase.
  return mock.fetchKnowledgeBaseResources();
};

export const fetchAnnouncements = async () => {
  if (!areSupabaseCredentialsSet || !supabase || useMock) return mock.fetchAnnouncements();
  // TODO: Implementar leitura de 'announcements' no Supabase.
  return mock.fetchAnnouncements();
};

export const fetchSupportTickets = async () => {
  if (!areSupabaseCredentialsSet || !supabase || useMock) return mock.fetchSupportTickets();
  // TODO: Implementar leitura de 'support_tickets' no Supabase.
  return mock.fetchSupportTickets();
};

export const fetchFranchiseeLeads = async () => {
  if (!areSupabaseCredentialsSet || !supabase || useMock) return mock.fetchFranchiseeLeads();
  // TODO: Implementar leitura de 'franchisee_leads' no Supabase.
  return mock.fetchFranchiseeLeads();
};

export const fetchAudits = async () => {
  if (!areSupabaseCredentialsSet || !supabase || useMock) return mock.fetchAudits();
  // TODO: Implementar leitura de 'audits' no Supabase.
  return mock.fetchAudits();
};

export const fetchUserProgress = async () => {
  if (!areSupabaseCredentialsSet || !supabase || useMock) return mock.fetchUserProgress();
  // TODO: Implementar leitura de 'user_progress' no Supabase.
  return mock.fetchUserProgress();
};

export const fetchForumPosts = async () => {
  if (!areSupabaseCredentialsSet || !supabase || useMock) return mock.fetchForumPosts();
  // TODO: Implementar leitura de 'forum_posts' no Supabase.
  return mock.fetchForumPosts();
};

export const fetchSales = async () => {
  if (!areSupabaseCredentialsSet || !supabase || useMock) return mock.fetchSales();
  // TODO: Implementar leitura de 'sales' no Supabase.
  return mock.fetchSales();
};

export const fetchSaleItems = async () => {
  if (!areSupabaseCredentialsSet || !supabase || useMock) return mock.fetchSaleItems();
  // TODO: Implementar leitura de 'sale_items' no Supabase.
  return mock.fetchSaleItems();
};

export const fetchContracts = async () => {
  if (!areSupabaseCredentialsSet || !supabase || useMock) return mock.fetchContracts();
  // TODO: Implementar leitura de 'contracts' no Supabase.
  return mock.fetchContracts();
};
