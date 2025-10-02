import {
    FranchisorSettings, Franchise, Product, SystemUser, UserRole, FranchiseUser, FranchiseUserRole,
    Client, ClientType, Lead, LeadStatus, LeadNote, Task, Goal, Consortium, ConsortiumStatus,
    CreditRecoveryCase, CreditRecoveryStatus, Transaction, TransactionType, Invoice, InvoiceStatus,
    Announcement, FranchiseeLead, FranchiseeLeadStatus, DocumentStatus, InternalNote,
    MarketingCampaign, MarketingCampaignStatus, CampaignMaterialType, KnowledgeBaseCategory,
    AuditTemplate, Audit, AuditItemStatus, TrainingCourse, TrainingModule, UserProgress,
    SupportTicket, SupportTicketCategory, SupportTicketStatus, TransactionCategory,
    Sale, SaleItem, SaleStatus, ContractTemplate, Contract, ContractStatus, ForumPost, ForumReply,
} from '../types';

// --- Helper to simulate network latency ---
const simulateApiCall = <T>(data: T, delay: number): Promise<T> => 
    new Promise(resolve => setTimeout(() => resolve(data), delay));

// Default franchisor settings, moved from defaultSettings.ts for consolidation.
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

// --- SYSTEM & CORE ---
export const initialProducts: Product[] = [
    { id: 1, name: 'Consórcio de Imóveis', description: 'Cartas de crédito para aquisição de imóveis residenciais e comerciais.', isActive: true },
    { id: 2, name: 'Consórcio de Automóveis', description: 'Planos para compra de carros, motos e outros veículos.', isActive: true },
    { id: 3, name: 'Recuperação de Crédito (Limpa Nome)', description: 'Serviços de renegociação de dívidas e limpeza de nome.', isActive: true },
    { id: 4, name: 'Seguro de Vida', description: 'Apólices de seguro de vida individual e familiar.', isActive: false },
];

export const initialFranchises: Franchise[] = [
    { id: 1, name: 'RV7 SP', location: 'São Paulo/SP', cnpj: '11.111.111/0001-11', corporateName: 'RV7 CONSULTORIA SP LTDA', inaugurationDate: '2023-01-15', ownerName: 'CARLOS SILVA', ownerEmail: 'franqueado.sp@rv7.com', ownerPhone: '(11) 99999-1111', allowedProductIds: [1, 2, 3] },
    { id: 2, name: 'RV7 RJ', location: 'Rio de Janeiro/RJ', cnpj: '22.222.222/0001-22', corporateName: 'RV7 SOLUCOES FINANCEIRAS RJ ME', inaugurationDate: '2023-03-20', ownerName: 'MARIA OLIVEIRA', ownerEmail: 'franqueado.rj@rv7.com', ownerPhone: '(21) 99999-2222', allowedProductIds: [1, 3] },
    { id: 3, name: 'RV7 MG', location: 'Belo Horizonte/MG', cnpj: '33.333.333/0001-33', corporateName: 'RV7 MG SERVICOS FINANCEIROS EIRELI', inaugurationDate: '2023-05-10', ownerName: 'JOÃO PEREIRA', ownerEmail: 'franqueado.mg@rv7.com', ownerPhone: '(31) 99999-3333', allowedProductIds: [1, 2, 3] },
];

export const initialSystemUsers: SystemUser[] = [
    { id: 1, name: 'ADMINISTRADOR', email: 'admin@rv7.com', role: UserRole.ADMIN },
    { id: 2, name: 'GERENTE DE REDE', email: 'gerente@rv7.com', role: UserRole.MANAGER },
];

export const initialFranchiseUsers: FranchiseUser[] = [
    { id: 1, franchiseId: 1, name: 'CARLOS SILVA', email: 'franqueado.sp@rv7.com', role: FranchiseUserRole.OWNER },
    { id: 2, franchiseId: 1, name: 'FERNANDA LIMA', email: 'vendedor.sp@rv7.com', role: FranchiseUserRole.SALESPERSON },
    { id: 3, franchiseId: 2, name: 'MARIA OLIVEIRA', email: 'franqueado.rj@rv7.com', role: FranchiseUserRole.OWNER },
    { id: 4, franchiseId: 3, name: 'JOÃO PEREIRA', email: 'franqueado.mg@rv7.com', role: FranchiseUserRole.OWNER },
];

// --- CRM ---
export const initialClients: Client[] = [
    { id: 1, franchiseId: 1, name: 'EMPRESA ABC LTDA', phone: '(11) 98888-1234', email: 'contato@empresaabc.com', type: ClientType.PESSOA_JURIDICA, cnpj: '44.444.444/0001-44', razaoSocial: 'ABC COMERCIO E SERVICOS LTDA', cep: '01311-000', logradouro: 'AVENIDA PAULISTA', numero: '1000', complemento: 'ANDAR 10', bairro: 'BELA VISTA', cidade: 'SÃO PAULO', estado: 'SP', createdAt: '2024-05-10T10:00:00Z' },
    { id: 2, franchiseId: 1, name: 'ANA SOUZA', phone: '(11) 97777-5678', email: 'ana.souza@email.com', type: ClientType.PESSOA_FISICA, cpf: '111.222.333-44', createdAt: '2024-06-15T14:20:00Z' },
    { id: 3, franchiseId: 2, name: 'PEDRO COSTA', phone: '(21) 96666-8765', email: 'pedro.costa@email.com', type: ClientType.PESSOA_FISICA, cpf: '222.333.444-55', createdAt: '2024-06-01T09:00:00Z' },
    { id: 4, franchiseId: 3, name: 'CONSTRUTORA HORIZONTE', phone: '(31) 95555-4321', email: 'financeiro@construtorahorizonte.com', type: ClientType.PESSOA_JURIDICA, cnpj: '55.555.555/0001-55', razaoSocial: 'HORIZONTE EMPREENDIMENTOS IMOBILIARIOS LTDA', createdAt: '2024-07-01T11:00:00Z' },
    { id: 5, franchiseId: 1, name: 'MARCOS ROCHA', phone: '(11) 94444-1122', email: 'marcos.rocha@email.com', type: ClientType.PESSOA_FISICA, cpf: '333.444.555-66', createdAt: '2024-07-05T16:00:00Z' },
];

export const initialLeads: Lead[] = [
    { id: 1, franchiseId: 1, clientId: 1, serviceOfInterest: 'Recuperação de Crédito (Limpa Nome)', status: LeadStatus.NEGOTIATING, createdAt: '2024-07-10T10:00:00Z', source: 'Indicação', negotiatedValue: 15000, salespersonId: 1 },
    { id: 2, franchiseId: 1, clientId: 2, serviceOfInterest: 'Consórcio de Automóveis', status: LeadStatus.WON, createdAt: '2024-06-15T14:21:00Z', source: 'Instagram', negotiatedValue: 80000, salespersonId: 2 },
    { id: 3, franchiseId: 2, clientId: 3, serviceOfInterest: 'Consórcio de Imóveis', status: LeadStatus.CONTACTED, createdAt: '2024-07-12T09:05:00Z', source: 'Site', negotiatedValue: 300000 },
    { id: 4, franchiseId: 3, clientId: 4, serviceOfInterest: 'Consórcio de Imóveis', status: LeadStatus.NEW, createdAt: '2024-07-20T11:00:00Z', source: 'Feira de Imóveis' },
    { id: 5, franchiseId: 1, clientId: 5, serviceOfInterest: 'Consórcio de Imóveis', status: LeadStatus.LOST, createdAt: '2024-07-05T16:05:00Z', source: 'Google Ads', negotiatedValue: 120000 },
];

export const initialLeadNotes: LeadNote[] = [
    { id: 1, leadId: 1, text: 'Primeira reunião realizada. Cliente demonstrou grande interesse em renegociar dívidas com fornecedores. Enviada proposta de serviço.', author: 'Carlos Silva', createdAt: '2024-07-11T15:00:00Z' },
    { id: 2, leadId: 2, text: 'Venda concluída com sucesso! Cliente adquiriu carta de R$ 80.000,00.', author: 'Fernanda Lima', createdAt: '2024-06-20T18:00:00Z' },
    { id: 3, leadId: 3, text: 'Feito primeiro contato por telefone. Cliente pediu para retornar na próxima semana com simulações de cartas de R$ 300.000.', author: 'Maria Oliveira', createdAt: '2024-07-12T10:30:00Z' },
    { id: 4, leadId: 1, text: 'Cliente solicitou ajuste na proposta. Agendada nova conversa para amanhã.', author: 'Carlos Silva', createdAt: '2024-07-18T17:00:00Z' },
];

export const initialTasks: Task[] = [
    { id: 1, franchiseId: 1, leadId: 1, title: 'Enviar nova proposta para Empresa ABC', dueDate: '2024-07-19', completed: false },
    { id: 2, franchiseId: 2, leadId: 3, title: 'Preparar simulações para Pedro Costa', dueDate: '2024-07-18', completed: false },
    { id: 3, franchiseId: 1, leadId: 2, title: 'Realizar pós-venda com Ana Souza', dueDate: '2024-07-01', completed: true },
    { id: 4, franchiseId: 1, title: 'Organizar documentos do mês', dueDate: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString().split('T')[0], completed: false }, // Overdue
];

const currentMonth = new Date().getMonth() + 1;
const currentYear = new Date().getFullYear();
export const initialGoals: Goal[] = [
    { id: 1, franchiseId: 1, month: currentMonth, year: currentYear, revenueTarget: 150000, conversionRateTarget: 0.20 },
    { id: 2, franchiseId: 2, month: currentMonth, year: currentYear, revenueTarget: 100000, conversionRateTarget: 0.15 },
    { id: 3, franchiseId: 3, month: currentMonth, year: currentYear, revenueTarget: 120000, conversionRateTarget: 0.18 },
];

// --- FINANCIAL & OPERATIONS ---
export const initialTransactions: Transaction[] = [
    // Franqueadora (franchiseId: 0)
    { id: 1, franchiseId: 0, description: 'Recebimento Royalties RV7 SP', amount: 7500, type: TransactionType.INCOME, category: TransactionCategory.ROYALTIES, date: '2024-07-05T10:00:00Z' },
    { id: 2, franchiseId: 0, description: 'Pagamento Fornecedor Software', amount: 2500, type: TransactionType.EXPENSE, category: TransactionCategory.OPERATIONAL_EXPENSE, date: '2024-07-08T11:00:00Z' },
    // Sinergia SP
    { id: 3, franchiseId: 1, description: 'Comissão Venda Consórcio - Ana Souza', amount: 8000, type: TransactionType.INCOME, category: TransactionCategory.SALES_COMMISSION, date: '2024-06-22T10:00:00Z' },
    { id: 4, franchiseId: 1, description: 'Aluguel Escritório', amount: 3500, type: TransactionType.EXPENSE, category: TransactionCategory.OPERATIONAL_EXPENSE, date: '2024-07-05T09:00:00Z' },
    { id: 10, franchiseId: 1, description: 'Comissão Rec. Crédito', amount: 5000, type: TransactionType.INCOME, category: TransactionCategory.SALES_COMMISSION, date: '2024-07-10T09:00:00Z' },
    // Sinergia RJ
    { id: 5, franchiseId: 2, description: 'Comissão Venda Consórcio - Pedro Costa', amount: 12000, type: TransactionType.INCOME, category: TransactionCategory.SALES_COMMISSION, date: '2024-06-07T10:00:00Z' },
    { id: 6, franchiseId: 2, description: 'Pagamento Royalties', amount: 5000, type: TransactionType.EXPENSE, category: TransactionCategory.ROYALTIES, date: '2024-07-06T09:00:00Z' },
    // Sinergia MG
    { id: 7, franchiseId: 3, description: 'Adiantamento Construtora Horizonte', amount: 20000, type: TransactionType.INCOME, category: TransactionCategory.SALES_COMMISSION, date: '2024-07-03T10:00:00Z' },
    { id: 8, franchiseId: 3, description: 'Despesas Marketing Local', amount: 2000, type: TransactionType.EXPENSE, category: TransactionCategory.MARKETING_EXPENSE, date: '2024-07-01T09:00:00Z' },
];

export const initialInvoices: Invoice[] = [
    { id: 1, franchiseId: 1, clientName: 'Royalties - RV7 SP', amount: 7500, dueDate: '2024-07-05', status: InvoiceStatus.PAID },
    { id: 2, franchiseId: 2, clientName: 'Royalties - RV7 RJ', amount: 5000, dueDate: '2024-07-05', status: InvoiceStatus.PAID },
    { id: 3, franchiseId: 3, clientName: 'Royalties - RV7 MG', amount: 6000, dueDate: '2024-08-05', status: InvoiceStatus.SENT },
];

export const initialConsortiums: Consortium[] = [
    { id: 1, franchiseId: 1, clientId: 2, value: 80000, date: '2024-06-20T17:55:00Z', status: ConsortiumStatus.COMPLETED, salespersonId: 2 },
    { id: 2, franchiseId: 2, clientId: 3, value: 300000, date: '2024-06-05T11:00:00Z', status: ConsortiumStatus.ACTIVE },
    { id: 3, franchiseId: 3, clientId: 4, value: 500000, date: '2024-07-02T16:00:00Z', status: ConsortiumStatus.PENDING },
];

export const initialCreditRecoveryCases: CreditRecoveryCase[] = [
    { id: 1, franchiseId: 1, clientId: 1, debtAmount: 15000, lastContactDate: '2024-07-18T17:00:00Z', status: CreditRecoveryStatus.NEGOTIATING, contactHistory: [{date: '2024-07-11T15:00:00Z', summary: 'Proposta inicial enviada.'}], internalNotes: [] },
    { id: 2, franchiseId: 1, clientId: 5, debtAmount: 5000, lastContactDate: '2024-07-10T10:00:00Z', status: CreditRecoveryStatus.RESOLVED, contactHistory: [], internalNotes: [] },
];

export const initialSales: Sale[] = [
    { id: 1, franchiseId: 1, clientId: 2, leadId: 2, salespersonId: 2, saleDate: '2024-06-20T18:00:00Z', totalAmount: 8000, paymentMethod: 'À Vista', installments: 1, status: SaleStatus.PAID },
];

export const initialSaleItems: SaleItem[] = [
    { id: 1, saleId: 1, productId: 2, productName: 'Consórcio de Automóveis', value: 8000 },
];


// --- COMMUNICATION & RESOURCES ---
export const initialAnnouncements: Announcement[] = [
    { id: 1, title: 'Nova Campanha de Marketing para o Dia dos Pais!', content: 'Prezados franqueados, acessem a área de Marketing para baixar os novos materiais da campanha de Dia dos Pais. Vamos acelerar as vendas!', author: 'Gerente de Rede', createdAt: '2024-07-15T09:00:00Z', isPinned: true },
    { id: 2, title: 'Atualização no Sistema de CRM', content: 'Foi implementada uma nova funcionalidade de etiquetas no funil de vendas para melhor organização. O treinamento está disponível na Academia RV7.', author: 'Gerente de Rede', createdAt: '2024-07-10T14:00:00Z', isPinned: false },
];

export const initialFranchiseeLeads: FranchiseeLead[] = [
    { id: 1, candidateName: 'ROBERTA MENDES', candidateEmail: 'roberta.m@email.com', candidatePhone: '(41) 98888-4444', cityOfInterest: 'Curitiba/PR', investmentCapital: 150000, status: FranchiseeLeadStatus.IN_ANALYSIS, createdAt: '2024-07-18T10:00:00Z', documents: [{ id: 1, name: 'Ficha Cadastral', status: DocumentStatus.RECEIVED }, {id: 2, name: 'Comprovante de Capital', status: DocumentStatus.PENDING}], internalNotes: [{id: 1, text: 'Candidata com bom perfil comercial.', author: 'Admin', createdAt: '2024-07-19T11:00:00Z'}] },
    { id: 2, candidateName: 'JULIO CESAR', candidateEmail: 'julio.cesar@email.com', candidatePhone: '(51) 97777-5555', cityOfInterest: 'Porto Alegre/RS', investmentCapital: 120000, status: FranchiseeLeadStatus.INITIAL_INTEREST, createdAt: '2024-07-20T15:00:00Z', documents: [], internalNotes: [] },
];

export const initialMarketingCampaigns: MarketingCampaign[] = [
    { id: 1, title: 'Campanha Dia dos Pais - Acelere seu Sonho', description: 'Foco em consórcios de automóveis para presentear no Dia dos Pais.', startDate: '2024-07-15', endDate: '2024-08-11', status: MarketingCampaignStatus.ACTIVE, materials: [{ id: 1, name: 'Banner Redes Sociais', type: CampaignMaterialType.IMAGE, downloadUrl: '#' }, {id: 2, name: 'Texto para WhatsApp', type: CampaignMaterialType.TEXT, downloadUrl: '#'}] },
    { id: 2, title: 'Limpa Nome - Comece o Ano Novo no Azul!', description: 'Campanha de fim de ano para recuperação de crédito.', startDate: new Date(new Date().setDate(new Date().getDate() - 8)).toISOString(), endDate: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(), status: MarketingCampaignStatus.ARCHIVED, materials: []},
    { id: 3, title: 'Campanha de Férias', description: 'Campanha de marketing para as férias de Julho', startDate: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(), endDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(), status: MarketingCampaignStatus.ACTIVE, materials: []},
];

export const initialKnowledgeBaseResources = [
    { id: 1, title: 'Manual de Venda de Consórcios', description: 'Guia completo com scripts e técnicas.', category: KnowledgeBaseCategory.MANUAIS_DE_OPERACAO, link: '#', createdAt: '2024-01-10T10:00:00Z' },
];

export const initialAuditTemplates: AuditTemplate[] = [
    { id: 1, title: 'Auditoria Operacional Padrão', description: 'Verificação mensal dos processos da franquia.', items: [{ id: 1, text: 'Apresentação e limpeza da unidade' }, { id: 2, text: 'Uso correto do sistema CRM' }, {id: 3, text: 'Conformidade com a marca'}] },
];

export const initialAudits: Audit[] = [
    { id: 1, franchiseId: 1, templateId: 1, auditorName: 'Gerente de Rede', auditDate: '2024-06-25', score: 92, results: [{ templateItemId: 1, status: AuditItemStatus.COMPLIANT, comment: ''}, { templateItemId: 2, status: AuditItemStatus.COMPLIANT, comment: ''}, { templateItemId: 3, status: AuditItemStatus.NON_COMPLIANT, comment: 'Logo na fachada precisa de reparo.'}], status: 'Concluído', createdAt: '2024-06-20T09:00:00Z' },
];

export const initialTrainingCourses: TrainingCourse[] = [
    { id: 1, title: 'Técnicas de Venda Consultiva', description: 'Aprenda a vender soluções, não apenas produtos.', targetAudience: 'Todos' },
];
export const initialTrainingModules: TrainingModule[] = [
    { id: 1, courseId: 1, title: 'Módulo 1: Escuta Ativa', estimatedTimeMinutes: 30, content: '...' },
    { id: 2, courseId: 1, title: 'Módulo 2: Gatilhos Mentais', estimatedTimeMinutes: 45, content: '...' },
];
export const initialUserProgress: UserProgress[] = [
    { franchiseUserId: 2, moduleId: 1, completedAt: '2024-07-01T10:00:00Z' }, // Fernanda Lima completou o Módulo 1
];

export const initialSupportTickets: SupportTicket[] = [
    { id: 1, franchiseId: 1, subject: 'Dúvida sobre comissionamento', category: SupportTicketCategory.FINANCIAL, status: SupportTicketStatus.RESOLVED, createdAt: '2024-07-10T10:00:00Z', updatedAt: '2024-07-11T11:00:00Z', messages: [{id: 1, author: 'Carlos Silva', isFranchisor: false, text: 'Gostaria de esclarecer como funciona a comissão para recuperação de crédito.', createdAt: '2024-07-10T10:00:00Z'}, {id: 2, author: 'Gerente de Rede', isFranchisor: true, text: 'Olá Carlos, a comissão é de 10% sobre o valor recuperado. O manual financeiro na base de conhecimento tem mais detalhes.', createdAt: '2024-07-11T11:00:00Z'}]},
];

export const initialContractTemplates: ContractTemplate[] = [
    { id: 1, title: 'Contrato Padrão - Consórcio de Automóveis', productId: 2, body: 'CONTRATO DE ADESÃO A GRUPO DE CONSÓRCIO\n\nCONTRATANTE: {{CLIENT_NAME}}, portador do documento {{CLIENT_CPF_CNPJ}}, residente em {{CLIENT_ADDRESS}}.\n\nOBJETO: Aquisição de uma carta de crédito para automóveis, conforme detalhes da venda:\n{{SALE_ITEMS}}\n\nVALOR TOTAL: {{SALE_TOTAL}}\n\nDATA: {{SALE_DATE}}\n\n________________________\nAssinatura do Contratante', isActive: true },
];

export const initialContracts: Contract[] = [];

export const initialForumPosts: ForumPost[] = [
    { id: 1, authorId: 'system-2', authorName: 'GERENTE DE REDE', authorFranchiseName: 'Franqueadora', title: 'Melhores Práticas para Follow-up', content: 'Qual é a cadência ideal para fazer follow-up com um lead que demonstrou interesse, mas não fechou na primeira conversa?', createdAt: '2024-07-20T10:00:00Z', isPinned: true, replies: [{ id: 1, postId: 1, authorId: 'franchise-1', authorName: 'CARLOS SILVA', authorFranchiseName: 'RV7 SP', content: 'Tenho tido sucesso com um contato a cada 2 dias na primeira semana, depois espaçando para 1 vez por semana.', createdAt: '2024-07-20T14:00:00Z' }] },
];

// --- Simulated API Fetch Functions ---

// Core Data Fetches (faster simulation)
export const fetchFranchises = () => simulateApiCall(initialFranchises, 200);
export const fetchSystemUsers = () => simulateApiCall(initialSystemUsers, 200);
export const fetchFranchiseUsers = () => simulateApiCall(initialFranchiseUsers, 250);
export const fetchProducts = () => simulateApiCall(initialProducts, 150);
export const fetchFranchisorSettings = () => simulateApiCall(initialFranchisorSettings, 100);
export const fetchAuditTemplates = () => simulateApiCall(initialAuditTemplates, 200);
export const fetchTrainingCourses = () => simulateApiCall(initialTrainingCourses, 220);
export const fetchTrainingModules = () => simulateApiCall(initialTrainingModules, 280);
export const fetchMarketingCampaigns = () => simulateApiCall(initialMarketingCampaigns, 300);
export const fetchContractTemplates = () => simulateApiCall(initialContractTemplates, 180);

// Content Data Fetches (slower simulation)
export const fetchGoals = () => simulateApiCall(initialGoals, 800);
export const fetchClients = () => simulateApiCall(initialClients, 900);
export const fetchLeads = () => simulateApiCall(initialLeads, 950);
export const fetchLeadNotes = () => simulateApiCall(initialLeadNotes, 1000);
export const fetchTasks = () => simulateApiCall(initialTasks, 850);
export const fetchTransactions = () => simulateApiCall(initialTransactions, 1100);
export const fetchInvoices = () => simulateApiCall(initialInvoices, 1050);
export const fetchConsortiums = () => simulateApiCall(initialConsortiums, 980);
export const fetchCreditRecoveryCases = () => simulateApiCall(initialCreditRecoveryCases, 1020);
export const fetchKnowledgeBaseResources = () => simulateApiCall(initialKnowledgeBaseResources, 700);
export const fetchAnnouncements = () => simulateApiCall(initialAnnouncements, 750);
export const fetchSupportTickets = () => simulateApiCall(initialSupportTickets, 1200);
export const fetchFranchiseeLeads = () => simulateApiCall(initialFranchiseeLeads, 880);
export const fetchAudits = () => simulateApiCall(initialAudits, 920);
export const fetchUserProgress = () => simulateApiCall(initialUserProgress, 1150);
export const fetchForumPosts = () => simulateApiCall(initialForumPosts, 1300);
export const fetchSales = () => simulateApiCall(initialSales, 990);
export const fetchSaleItems = () => simulateApiCall(initialSaleItems, 1010);
export const fetchContracts = () => simulateApiCall(initialContracts, 1030);