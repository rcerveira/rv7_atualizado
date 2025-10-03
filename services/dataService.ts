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
import { Client, Lead, LeadNote, Task, LeadStatus } from '../types';

/**
 * Flag dinâmica: usa mock quando não há credenciais, quando preferido via toggle,
 * ou quando o usuário ativou o DEMO override (localStorage.forceDemoAuth === 'true').
 */
const preferMock = false;
const forceDemoAuth = typeof window !== 'undefined' && localStorage.getItem('forceDemoAuth') === 'true';
const useMock = preferMock || forceDemoAuth || !areSupabaseCredentialsSet || !supabase;

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
  if (useMock) return mock.fetchClients();
  const { data, error } = await supabase!.from('clients').select('*').order('id');
  if (error || !data) return mock.fetchClients();
  return data.map(mapClientRow);
};

export const fetchLeads = async () => {
  if (useMock) return mock.fetchLeads();
  const { data, error } = await supabase!.from('leads').select('*').order('id');
  if (error || !data) return mock.fetchLeads();
  return data.map(mapLeadRow);
};

export const fetchLeadNotes = async () => {
  if (useMock) return mock.fetchLeadNotes();
  const { data, error } = await supabase!.from('lead_notes').select('*').order('id');
  if (error || !data) return mock.fetchLeadNotes();
  return data.map(mapLeadNoteRow);
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

/**
 * =============== FASE 2 (CRUD Seguro) ===============
 * Implementações de escrita/leitura para clients, leads(+notes) e tasks.
 * Mantém fallback (mock) quando Supabase não está habilitado.
 */

/* --------- Helpers de mapeamento --------- */
const mapClientRow = (r: AnyRecord): Client => ({
  id: r.id,
  franchiseId: r.franchise_id,
  name: r.name,
  phone: r.phone ?? '',
  email: r.email ?? '',
  createdAt: (r.created_at ?? new Date().toISOString()),
  type: r.type,
  cpf: r.cpf ?? undefined,
  cnpj: r.cnpj ?? undefined,
  razaoSocial: r.razao_social ?? undefined,
  cep: r.cep ?? undefined,
  logradouro: r.logradouro ?? undefined,
  numero: r.numero ?? undefined,
  complemento: r.complemento ?? undefined,
  bairro: r.bairro ?? undefined,
  cidade: r.cidade ?? undefined,
  estado: r.estado ?? undefined,
});

const mapLeadRow = (r: AnyRecord): Lead => ({
  id: r.id,
  franchiseId: r.franchise_id,
  clientId: r.client_id,
  serviceOfInterest: r.service_of_interest ?? '',
  status: r.status,
  createdAt: (r.created_at ?? new Date().toISOString()),
  source: r.source ?? undefined,
  negotiatedValue: r.negotiated_value ?? undefined,
  salespersonId: r.salesperson_id ?? undefined,
});

const mapLeadNoteRow = (r: AnyRecord): LeadNote => ({
  id: r.id,
  leadId: r.lead_id,
  text: r.text,
  author: r.author ?? '',
  createdAt: (r.created_at ?? new Date().toISOString()),
});

const mapTaskRow = (r: AnyRecord): Task => ({
  id: r.id,
  franchiseId: r.franchise_id,
  leadId: r.lead_id ?? null,
  title: r.title,
  dueDate: r.due_date ? new Date(r.due_date).toISOString() : new Date().toISOString(),
  completed: Boolean(r.completed),
});

/* --------- Clients --------- */
export const createClient = async (client: Omit<Client, 'id' | 'createdAt' | 'cpfOrCnpj'>): Promise<Client> => {
  if (useMock) {
    const generated: Client = { ...client, id: Math.floor(Math.random() * 1e9), createdAt: new Date().toISOString() };
    return generated;
  }

  const payload: AnyRecord = {
    franchise_id: client.franchiseId,
    name: client.name,
    phone: client.phone ?? null,
    email: client.email ?? null,
    type: client.type,
    cpf: client.cpf ?? null,
    cnpj: client.cnpj ?? null,
    razao_social: client.razaoSocial ?? null,
    cep: client.cep ?? null,
    logradouro: client.logradouro ?? null,
    numero: client.numero ?? null,
    complemento: client.complemento ?? null,
    bairro: client.bairro ?? null,
    cidade: client.cidade ?? null,
    estado: client.estado ?? null,
  };

  const { data, error } = await supabase!.from('clients').insert(payload).select('*').single();
  if (error || !data) throw error ?? new Error('Falha ao criar cliente');
  return mapClientRow(data);
};

export const updateClientRecord = async (client: Client): Promise<Client> => {
  if (useMock) return client;

  const payload: AnyRecord = {
    franchise_id: client.franchiseId,
    name: client.name,
    phone: client.phone ?? null,
    email: client.email ?? null,
    type: client.type,
    cpf: client.cpf ?? null,
    cnpj: client.cnpj ?? null,
    razao_social: client.razaoSocial ?? null,
    cep: client.cep ?? null,
    logradouro: client.logradouro ?? null,
    numero: client.numero ?? null,
    complemento: client.complemento ?? null,
    bairro: client.bairro ?? null,
    cidade: client.cidade ?? null,
    estado: client.estado ?? null,
  };

  const { data, error } = await supabase!.from('clients').update(payload).eq('id', client.id).select('*').single();
  if (error || !data) throw error ?? new Error('Falha ao atualizar cliente');
  return mapClientRow(data);
};

export const deleteClientRecord = async (clientId: number): Promise<void> => {
  if (useMock) return;
  const { error } = await supabase!.from('clients').delete().eq('id', clientId);
  if (error) throw error;
};

/* --------- Leads --------- */
export const createLead = async (lead: Omit<Lead, 'id' | 'createdAt' | 'status'>): Promise<Lead> => {
  if (useMock) {
    const generated: Lead = { ...lead, id: Math.floor(Math.random() * 1e9), createdAt: new Date().toISOString(), status: LeadStatus.NEW };
    return generated;
  }

  const payload: AnyRecord = {
    franchise_id: lead.franchiseId,
    client_id: lead.clientId,
    service_of_interest: lead.serviceOfInterest ?? null,
    status: LeadStatus.NEW,
    source: lead.source ?? null,
    negotiated_value: lead.negotiatedValue ?? null,
    salesperson_id: lead.salespersonId ?? null,
  };

  const { data, error } = await supabase!.from('leads').insert(payload).select('*').single();
  if (error || !data) throw error ?? new Error('Falha ao criar lead');
  return mapLeadRow(data);
};

export const updateLeadRecord = async (lead: Lead): Promise<Lead> => {
  if (useMock) return lead;

  const payload: AnyRecord = {
    franchise_id: lead.franchiseId,
    client_id: lead.clientId,
    service_of_interest: lead.serviceOfInterest ?? null,
    status: lead.status,
    source: lead.source ?? null,
    negotiated_value: lead.negotiatedValue ?? null,
    salesperson_id: lead.salespersonId ?? null,
  };

  const { data, error } = await supabase!.from('leads').update(payload).eq('id', lead.id).select('*').single();
  if (error || !data) throw error ?? new Error('Falha ao atualizar lead');
  return mapLeadRow(data);
};

export const deleteLeadRecord = async (leadId: number): Promise<void> => {
  if (useMock) return;
  const { error } = await supabase!.from('leads').delete().eq('id', leadId);
  if (error) throw error;
};

export const createLeadNote = async (note: Omit<LeadNote, 'id' | 'createdAt'>): Promise<LeadNote> => {
  if (useMock) {
    const generated: LeadNote = { ...note, id: Math.floor(Math.random() * 1e9), createdAt: new Date().toISOString() };
    return generated;
  }

  const payload: AnyRecord = {
    lead_id: note.leadId,
    text: note.text,
    author: note.author ?? null,
  };

  const { data, error } = await supabase!.from('lead_notes').insert(payload).select('*').single();
  if (error || !data) throw error ?? new Error('Falha ao criar anotação do lead');
  return mapLeadNoteRow(data);
};

/* --------- Tasks --------- */
export const createTask = async (task: Omit<Task, 'id' | 'completed'>): Promise<Task> => {
  if (useMock) {
    const generated: Task = { ...task, id: Math.floor(Math.random() * 1e9), completed: false };
    return generated;
  }

  const toDate = (iso: string) => new Date(iso).toISOString().slice(0, 10);
  const payload: AnyRecord = {
    franchise_id: task.franchiseId,
    lead_id: task.leadId ?? null,
    title: task.title,
    due_date: toDate(task.dueDate),
    completed: false,
  };

  const { data, error } = await supabase!.from('tasks').insert(payload).select('*').single();
  if (error || !data) throw error ?? new Error('Falha ao criar tarefa');
  return mapTaskRow(data);
};

export const updateTaskRecord = async (task: Partial<Task> & { id: number }): Promise<Task> => {
  if (useMock) {
    // Em modo mock, retornamos um objeto mínimo coerente
    return {
      id: task.id,
      franchiseId: task.franchiseId ?? 0,
      leadId: task.leadId ?? null,
      title: task.title ?? '',
      dueDate: task.dueDate ?? new Date().toISOString(),
      completed: task.completed ?? false,
    };
  }

  const payload: AnyRecord = {
    ...(task.franchiseId !== undefined ? { franchise_id: task.franchiseId } : {}),
    ...(task.leadId !== undefined ? { lead_id: task.leadId } : {}),
    ...(task.title !== undefined ? { title: task.title } : {}),
    ...(task.dueDate !== undefined ? { due_date: new Date(task.dueDate).toISOString().slice(0,10) } : {}),
    ...(task.completed !== undefined ? { completed: task.completed } : {}),
  };

  const { data, error } = await supabase!.from('tasks').update(payload).eq('id', task.id).select('*').single();
  if (error || !data) throw error ?? new Error('Falha ao atualizar tarefa');
  return mapTaskRow(data);
};

export const deleteTaskRecord = async (taskId: number): Promise<void> => {
  if (useMock) return;
  const { error } = await supabase!.from('tasks').delete().eq('id', taskId);
  if (error) throw error;
};
