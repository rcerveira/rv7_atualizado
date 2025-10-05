import React, {
    createContext,
    useState,
    ReactNode,
    useCallback,
    useMemo,
    useEffect,
} from 'react';
import { useAuth } from '../hooks/useAuth';
import * as api from '../services/dataService';
import { areSupabaseCredentialsSet, supabase } from '../utils/supabaseClient';
import { useToast } from '../components/ToastProvider';
import {
    Franchise, FranchiseWithStats, Goal, Client, Lead, LeadStatus, LeadNote, Task, PerformanceStatus,
    Transaction, Invoice, Consortium, CreditRecoveryCase, FranchiseUser, SystemUser,
    KnowledgeBaseResource, Announcement, SupportTicket, Product, FranchisorSettings,
    FranchiseeLead, FranchiseeLeadStatus, DocumentStatus, InternalNote,
    MarketingCampaign, Audit, AuditTemplate, AuditResult, AuditItemStatus,
    TrainingCourse, TrainingModule, UserProgress, SupportTicketStatus, ClientType,
    ForumPost, ForumReply, Sale, SaleItem, SaleStatus,
    ContractTemplate, Contract, ContractStatus
} from '../types';

// Define the shape of all data
interface AppData {
    franchises: Franchise[];
    systemUsers: SystemUser[];
    franchiseUsers: FranchiseUser[];
    products: Product[];
    franchisorSettings: FranchisorSettings;
    auditTemplates: AuditTemplate[];
    trainingCourses: TrainingCourse[];
    trainingModules: TrainingModule[];
    marketingCampaigns: MarketingCampaign[];
    contractTemplates: ContractTemplate[];
    goals: Goal[];
    clients: Client[];
    leads: Lead[];
    leadNotes: LeadNote[];
    tasks: Task[];
    transactions: Transaction[];
    invoices: Invoice[];
    consortiums: Consortium[];
    creditRecoveryCases: CreditRecoveryCase[];
    knowledgeBaseResources: KnowledgeBaseResource[];
    announcements: Announcement[];
    supportTickets: SupportTicket[];
    franchiseeLeads: FranchiseeLead[];
    audits: Audit[];
    userProgress: UserProgress[];
    forumPosts: ForumPost[];
    sales: Sale[];
    saleItems: SaleItem[];
    contracts: Contract[];
}


// Data for a single selected franchise
interface SelectedFranchiseData {
    franchise: Franchise;
    goals: Goal[];
    clients: Client[];
    leads: Lead[];
    notes: LeadNote[];
    tasks: Task[];
    transactions: Transaction[];
    invoices: Invoice[];
    consortiums: Consortium[];
    creditRecoveryCases: CreditRecoveryCase[];
    franchiseUsers: FranchiseUser[];
    knowledgeBaseResources: KnowledgeBaseResource[];
    announcements: Announcement[];
    supportTickets: SupportTicket[];
    products: Product[];
    marketingCampaigns: MarketingCampaign[];
    audits: Audit[];
    trainingCourses: TrainingCourse[];
    trainingModules: TrainingModule[];
    userProgress: UserProgress[];
    sales: Sale[];
    saleItems: SaleItem[];
    contracts: Contract[];
}

interface NetworkStats {
    totalRevenue: number;
    totalProfit: number;
    averageHealthScore: number;
}

interface Handlers {
    setManagedFranchiseId: (id: number | null) => void;
    addFranchise: (franchise: Omit<Franchise, 'id' | 'allowedProductIds'>) => Promise<void>;
    updateFranchise: (franchise: Franchise) => Promise<void>;
    addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'status'>) => Promise<void>;
    updateLead: (lead: Lead) => Promise<void>;
    updateLeadStatus: (leadId: number, newStatus: LeadStatus) => void;
    addClient: (client: Omit<Client, 'id' | 'cpfOrCnpj'>) => Promise<Client>;
    updateClient: (client: Client) => Promise<void>;
    addNote: (note: Omit<LeadNote, 'id' | 'createdAt' | 'author'>) => void;
    addTask: (task: Omit<Task, 'id' | 'completed'>) => void;
    toggleTask: (taskId: number) => void;
    addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
    addInvoice: (invoice: Omit<Invoice, 'id'>) => void;
    updateInvoice: (invoice: Invoice) => void;
    deleteInvoice: (invoiceId: number) => void;
    addUser: (user: Omit<SystemUser, 'id'> & { password?: string }) => void;
    updateUser: (user: SystemUser) => void;
    deleteUser: (userId: number) => void;
    addFranchiseUser: (user: Omit<FranchiseUser, 'id'> & { password?: string }) => void;
    updateFranchiseUser: (user: FranchiseUser) => void;
    deleteFranchiseUser: (userId: number) => void;
    addProduct: (product: Omit<Product, 'id'>) => void;
    updateProduct: (product: Product) => void;
    deleteProduct: (productId: number) => void;
    updateFranchisorSettings: (settings: FranchisorSettings) => void;
    addAnnouncement: (announcement: Omit<Announcement, 'id' | 'author' | 'createdAt'>) => void;
    deleteAnnouncement: (id: number) => void;
    addFranchiseeLead: (lead: Omit<FranchiseeLead, 'id' | 'createdAt' | 'status' | 'documents' | 'internalNotes'>) => void;
    updateFranchiseeLeadStatus: (leadId: number, newStatus: FranchiseeLeadStatus) => void;
    updateFranchiseeLeadDocumentStatus: (leadId: number, documentId: number, status: DocumentStatus) => void;
    addInternalNoteToLead: (leadId: number, noteText: string) => void;
    updateFranchiseeLead: (lead: FranchiseeLead) => void;
    startNewAudit: (franchiseId: number, templateId: number) => void;
    submitAudit: (auditId: number, results: AuditResult[]) => void;
    addAuditTemplate: (template: Omit<AuditTemplate, 'id'>) => void;
    toggleModuleCompletion: (moduleId: number, userId: number) => void;
    addSupportTicket: (ticketData: Omit<SupportTicket, 'id' | 'franchiseId' | 'status' | 'createdAt' | 'updatedAt' | 'messages'>, firstMessage: string) => void;
    addMessageToTicket: (ticketId: number, text: string, author: string, isFranchisor: boolean) => void;
    updateTicketStatus: (ticketId: number, newStatus: SupportTicketStatus) => void;
    addForumPost: (postData: Omit<ForumPost, 'id' | 'authorId' | 'authorName' | 'authorFranchiseName' | 'createdAt' | 'replies'>) => void;
    addForumReply: (postId: number, content: string) => void;
    addSale: (saleData: Omit<Sale, 'id' | 'status'>, items: Omit<SaleItem, 'id' | 'saleId'>[]) => Promise<void>;
    updateSaleStatus: (saleId: number, newStatus: SaleStatus) => void;
    addContractTemplate: (template: Omit<ContractTemplate, 'id'>) => void;
    updateContractTemplate: (template: ContractTemplate) => void;
    deleteContractTemplate: (templateId: number) => void;
    generateContract: (saleId: number, templateId: number) => void;
    updateContractStatus: (contractId: number, newStatus: ContractStatus) => void;
    addOrUpdateGoal: (goalData: Omit<Goal, 'id'>) => void;
}

interface DataContextType {
    data: AppData | null;
    isLoading: boolean;
    isContentLoading: boolean;
    franchisesWithStats: FranchiseWithStats[];
    networkStats: NetworkStats;
    selectedFranchiseData: SelectedFranchiseData | null;
    handlers: Handlers;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

const emptyContentData = {
    goals: [], clients: [], leads: [], leadNotes: [], tasks: [],
    transactions: [], invoices: [], consortiums: [], creditRecoveryCases: [],
    knowledgeBaseResources: [], announcements: [], supportTickets: [],
    franchiseeLeads: [], audits: [], userProgress: [], forumPosts: [],
    sales: [], saleItems: [], contracts: []
};


export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const { notify } = useToast();
    const [data, setData] = useState<AppData | null>(null);
    const [isLoading, setIsLoading] = useState(true); // For core app shell
    const [isContentLoading, setIsContentLoading] = useState(true); // For main view content
    const [managedFranchiseId, setManagedFranchiseId] = useState<number | null>(null);

    useEffect(() => {
        const loadAllData = async () => {
            try {
                // Stage 1: Load core data for the application shell.
                setIsLoading(true);
                const [
                    franchises, systemUsers, franchiseUsers, products,
                    franchisorSettings, auditTemplates, trainingCourses,
                    trainingModules, marketingCampaigns, contractTemplates
                ] = await Promise.all([
                    api.fetchFranchises(),
                    api.fetchSystemUsers(),
                    api.fetchFranchiseUsers(),
                    api.fetchProducts(),
                    api.fetchFranchisorSettings(),
                    api.fetchAuditTemplates(),
                    api.fetchTrainingCourses(),
                    api.fetchTrainingModules(),
                    api.fetchMarketingCampaigns(),
                    api.fetchContractTemplates(),
                ]);

                setData({
                    franchises, systemUsers, franchiseUsers, products,
                    franchisorSettings, auditTemplates, trainingCourses,
                    trainingModules, marketingCampaigns, contractTemplates,
                    ...emptyContentData
                });
                setIsLoading(false);

                // Stage 2: Load the heavier content data after the shell is ready.
                setIsContentLoading(true);
                const [
                    goals, clients, leads, leadNotes, tasks, transactions,
                    invoices, consortiums, creditRecoveryCases, knowledgeBaseResources,
                    announcements, supportTickets, franchiseeLeads, audits,
                    userProgress, forumPosts, sales, saleItems, contracts
                ] = await Promise.all([
                    api.fetchGoals(),
                    api.fetchClients(),
                    api.fetchLeads(),
                    api.fetchLeadNotes(),
                    api.fetchTasks(),
                    api.fetchTransactions(),
                    api.fetchInvoices(),
                    api.fetchConsortiums(),
                    api.fetchCreditRecoveryCases(),
                    api.fetchKnowledgeBaseResources(),
                    api.fetchAnnouncements(),
                    api.fetchSupportTickets(),
                    api.fetchFranchiseeLeads(),
                    api.fetchAudits(),
                    api.fetchUserProgress(),
                    api.fetchForumPosts(),
                    api.fetchSales(),
                    api.fetchSaleItems(),
                    api.fetchContracts(),
                ]);

                setData(prevData => ({
                    ...prevData!,
                    goals, clients, leads, leadNotes, tasks, transactions,
                    invoices, consortiums, creditRecoveryCases, knowledgeBaseResources,
                    announcements, supportTickets, franchiseeLeads, audits,
                    userProgress, forumPosts, sales, saleItems, contracts
                }));
                setIsContentLoading(false);

            } catch (error) {
                console.error("Failed to load application data:", error);
                // Here you might want to set an error state to show a message to the user
            }
        };

        loadAllData();
    }, []);

    const franchisesWithStats = useMemo<FranchiseWithStats[]>(() => {
        if (!data) return [];
        return data.franchises.map(franchise => {
            const franchiseLeads = data.leads.filter(l => l.franchiseId === franchise.id);
            const franchiseTransactions = data.transactions.filter(t => t.franchiseId === franchise.id);
            const consortiumSales = data.consortiums
                .filter(c => c.franchiseId === franchise.id)
                .reduce((sum, c) => sum + c.value, 0);
            
            const income = franchiseTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
            const expense = franchiseTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
            const profit = income - expense;

            const wonLeads = franchiseLeads.filter(l => l.status === LeadStatus.WON).length;
            const conversionRate = franchiseLeads.length > 0 ? wonLeads / franchiseLeads.length : 0;
            
            // Simplified Health Score Calculation
            const score = (profit / 50000 * 40) + (conversionRate / 0.25 * 40) + (consortiumSales / 200000 * 20);
            const healthScore = Math.min(100, Math.max(0, score));

            return {
                ...franchise,
                consortiumSales,
                creditRecoveryCases: data.creditRecoveryCases.filter(c => c.franchiseId === franchise.id).length,
                status: healthScore >= 80 ? PerformanceStatus.EXCELLENT : healthScore >= 50 ? PerformanceStatus.ON_TARGET : PerformanceStatus.NEEDS_ATTENTION,
                profit,
                conversionRate,
                healthScore
            };
        });
    }, [data]);

    const networkStats = useMemo<NetworkStats>(() => {
        if (!data || franchisesWithStats.length === 0) {
            return { totalRevenue: 0, totalProfit: 0, averageHealthScore: 0 };
        }
    
        const totalRevenue = franchisesWithStats.reduce((acc, f) => acc + f.consortiumSales, 0);
        const totalProfit = franchisesWithStats.reduce((acc, f) => acc + f.profit, 0);
        const averageHealthScore = franchisesWithStats.reduce((acc, f) => acc + f.healthScore, 0) / franchisesWithStats.length;
    
        return { totalRevenue, totalProfit, averageHealthScore };
    }, [data, franchisesWithStats]);

    const selectedFranchiseId = useMemo(() => {
        if (user?.role === 'FRANCHISOR' && managedFranchiseId) {
            return managedFranchiseId;
        }
        if (user?.role === 'FRANCHISEE') {
            return user.franchiseId;
        }
        return null;
    }, [user, managedFranchiseId]);

    const selectedFranchiseData = useMemo<SelectedFranchiseData | null>(() => {
        if (!data || !selectedFranchiseId) return null;

        const franchise = data.franchises.find(f => f.id === selectedFranchiseId);
        if (!franchise) return null;

        return {
            franchise,
            goals: data.goals.filter(item => item.franchiseId === selectedFranchiseId),
            clients: data.clients.filter(item => item.franchiseId === selectedFranchiseId),
            leads: data.leads.filter(item => item.franchiseId === selectedFranchiseId),
            notes: data.leadNotes.filter(item => data.leads.some(l => l.id === item.leadId && l.franchiseId === selectedFranchiseId)),
            tasks: data.tasks.filter(item => item.franchiseId === selectedFranchiseId),
            transactions: data.transactions.filter(item => item.franchiseId === selectedFranchiseId),
            invoices: data.invoices.filter(item => item.franchiseId === selectedFranchiseId),
            consortiums: data.consortiums.filter(item => item.franchiseId === selectedFranchiseId),
            creditRecoveryCases: data.creditRecoveryCases.filter(item => item.franchiseId === selectedFranchiseId),
            franchiseUsers: data.franchiseUsers.filter(item => item.franchiseId === selectedFranchiseId),
            knowledgeBaseResources: data.knowledgeBaseResources, // Global
            announcements: data.announcements, // Global
            supportTickets: data.supportTickets.filter(item => item.franchiseId === selectedFranchiseId),
            products: data.products, // Global
            marketingCampaigns: data.marketingCampaigns, // Global
            audits: data.audits.filter(item => item.franchiseId === selectedFranchiseId),
            trainingCourses: data.trainingCourses, // Global
            trainingModules: data.trainingModules, // Global
            userProgress: data.userProgress, // Global for now
            sales: data.sales.filter(s => s.franchiseId === selectedFranchiseId),
            saleItems: data.saleItems.filter(si => data.sales.some(s => s.id === si.saleId && s.franchiseId === selectedFranchiseId)),
            contracts: data.contracts.filter(c => data.sales.some(s => s.id === c.saleId && s.franchiseId === selectedFranchiseId)),
        };
    }, [selectedFranchiseId, data]);

    const remoteEnabled = useMemo(() => Boolean(areSupabaseCredentialsSet && supabase && user), [user]);
    
    // Handlers
    const handlers = useMemo<Handlers>(() => ({
        setManagedFranchiseId,
        addFranchise: async (franchiseData) => {
            setData(prev => {
                const newId = Math.max(...prev!.franchises.map(f => f.id), 0) + 1;
                const newFranchise: Franchise = { ...franchiseData, id: newId, allowedProductIds: [] };
                return { ...prev!, franchises: [...prev!.franchises, newFranchise] };
            });
        },
        updateFranchise: async (franchise) => {
            setData(prev => ({
                ...prev!,
                franchises: prev!.franchises.map(f => f.id === franchise.id ? franchise : f)
            }));
        },
        addClient: async (clientData) => {
            if (remoteEnabled) {
                try {
                    const created = await api.createClient(clientData);
                    setData(prev => ({ ...prev!, clients: [...prev!.clients, created] }));
                    return created;
                } catch (e) {
                    console.error('addClient(remote) failed', e);
                    notify({ type: 'error', message: 'Falha ao adicionar cliente no Supabase. Operando no modo local para esta ação.' });
                    // fallback local
                }
            }
            return new Promise(resolve => {
                setData(prev => {
                    const newId = Math.max(...prev!.clients.map(c => c.id), 0) + 1;
                    const newClient: Client = {
                        ...clientData,
                        id: newId,
                        createdAt: new Date().toISOString(),
                        cpfOrCnpj: (clientData.type === ClientType.PESSOA_FISICA ? clientData.cpf : clientData.cnpj) || ''
                    };
                    resolve(newClient);
                    return { ...prev!, clients: [...prev!.clients, newClient] };
                });
            });
        },
        updateClient: async (client) => {
            if (remoteEnabled) {
                try {
                    const updated = await api.updateClientRecord(client);
                    setData(prev => ({ ...prev!, clients: prev!.clients.map(c => c.id === updated.id ? updated : c)}));
                    return;
                } catch (e) {
                    console.error('updateClient(remote) failed', e);
                    notify({ type: 'error', message: 'Falha ao atualizar cliente no Supabase. Alteração aplicada localmente.' });
                }
            }
            setData(prev => ({ ...prev!, clients: prev!.clients.map(c => c.id === client.id ? client : c)}));
        },
        addLead: async (leadData) => {
            if (remoteEnabled) {
                try {
                    const created = await api.createLead(leadData);
                    setData(prev => ({ ...prev!, leads: [...prev!.leads, created] }));
                    return;
                } catch (e) {
                    console.error('addLead(remote) failed', e);
                    notify({ type: 'error', message: 'Falha ao adicionar lead no Supabase. Operação realizada localmente.' });
                }
            }
            setData(prev => {
                const newId = Math.max(...prev!.leads.map(c => c.id), 0) + 1;
                const newLead: Lead = {
                    ...leadData,
                    id: newId,
                    createdAt: new Date().toISOString(),
                    status: LeadStatus.NEW
                };
                return { ...prev!, leads: [...prev!.leads, newLead] };
            });
        },
        updateLead: async (lead) => {
            if (remoteEnabled) {
                try {
                    const updated = await api.updateLeadRecord(lead);
                    setData(prev => ({ ...prev!, leads: prev!.leads.map(l => l.id === updated.id ? updated : l)}));
                    return;
                } catch (e) {
                    console.error('updateLead(remote) failed', e);
                    notify({ type: 'error', message: 'Falha ao atualizar lead no Supabase. Alteração aplicada localmente.' });
                }
            }
            setData(prev => ({ ...prev!, leads: prev!.leads.map(l => l.id === lead.id ? lead : l)}));
        },
        updateLeadStatus: (leadId, newStatus) => {
            if (remoteEnabled) {
                const current = data?.leads.find(l => l.id === leadId);
                if (current) {
                    (async () => {
                        try {
                            const updated = await api.updateLeadRecord({ ...current, status: newStatus });
                            setData(prev => ({ ...prev!, leads: prev!.leads.map(l => l.id === updated.id ? updated : l)}));
                        } catch (e) {
                            console.error('updateLeadStatus(remote) failed', e);
                            notify({ type: 'error', message: 'Falha ao atualizar status do lead no Supabase. Alteração aplicada localmente.' });
                        }
                    })();
                    return;
                }
            }
            setData(prev => ({
                ...prev!,
                leads: prev!.leads.map(l => l.id === leadId ? { ...l, status: newStatus } : l)
            }));
        },
        addNote: (note) => {
            if (remoteEnabled) {
                (async () => {
                    try {
                        const created = await api.createLeadNote({ ...note, author: user!.name });
                        setData(prev => ({ ...prev!, leadNotes: [...prev!.leadNotes, created] }));
                    } catch (e) {
                        console.error('addNote(remote) failed', e);
                        notify({ type: 'error', message: 'Falha ao adicionar anotação no Supabase. Operação realizada localmente.' });
                    }
                })();
                return;
            }
            setData(prev => {
                const newId = Math.max(...prev!.leadNotes.map(n => n.id), 0) + 1;
                const newNote: LeadNote = {
                    ...note,
                    id: newId,
                    createdAt: new Date().toISOString(),
                    author: user!.name
                };
                return { ...prev!, leadNotes: [...prev!.leadNotes, newNote] };
            });
        },
        addTask: (task) => {
            if (remoteEnabled) {
                (async () => {
                    try {
                        const created = await api.createTask(task);
                        setData(prev => ({ ...prev!, tasks: [...prev!.tasks, created] }));
                    } catch (e) {
                        console.error('addTask(remote) failed', e);
                        notify({ type: 'error', message: 'Falha ao adicionar tarefa no Supabase. Operação realizada localmente.' });
                    }
                })();
                return;
            }
            setData(prev => {
                const newId = Math.max(...prev!.tasks.map(t => t.id), 0) + 1;
                const newTask: Task = {
                    ...task,
                    id: newId,
                    completed: false
                };
                return { ...prev!, tasks: [...prev!.tasks, newTask] };
            });
        },
        toggleTask: (taskId) => {
            if (remoteEnabled) {
                const current = data?.tasks.find(t => t.id === taskId);
                if (current) {
                    (async () => {
                        try {
                            const updated = await api.updateTaskRecord({ id: taskId, completed: !current.completed });
                            setData(prev => ({ ...prev!, tasks: prev!.tasks.map(t => t.id === taskId ? updated : t)}));
                        } catch (e) {
                            console.error('toggleTask(remote) failed', e);
                            notify({ type: 'error', message: 'Falha ao atualizar tarefa no Supabase. Alteração aplicada localmente.' });
                        }
                    })();
                    return;
                }
            }
            setData(prev => ({
                ...prev!,
                tasks: prev!.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
            }));
        },
        addTransaction: (transaction) => {
             setData(prev => {
                const newId = Math.max(...prev!.transactions.map(t => t.id), 0) + 1;
                const newTransaction: Transaction = {
                    ...transaction,
                    id: newId,
                    date: new Date().toISOString()
                };
                return { ...prev!, transactions: [...prev!.transactions, newTransaction] };
            });
        },
        addInvoice: (invoice) => {
            setData(prev => {
                const newId = Math.max(...prev!.invoices.map(i => i.id), 0) + 1;
                return { ...prev!, invoices: [...prev!.invoices, {...invoice, id: newId}] };
            });
        },
        updateInvoice: (invoice) => {
            setData(prev => ({...prev!, invoices: prev!.invoices.map(i => i.id === invoice.id ? invoice : i)}));
        },
        deleteInvoice: (invoiceId) => {
            setData(prev => ({...prev!, invoices: prev!.invoices.filter(i => i.id !== invoiceId)}));
        },
        addUser: (user) => {
            setData(prev => {
                if (!prev) return prev;
                const newId = Math.max(0, ...prev.systemUsers.map(u => u.id)) + 1;
                // Destructure to remove password and ensure only SystemUser properties are stored
                const { password, ...userData } = user;
                const newSystemUser: SystemUser = { ...userData, id: newId };
                
                return {...prev, systemUsers: [...prev.systemUsers, newSystemUser]};
            })
        },
        updateUser: (userToUpdate) => {
            setData(prev => {
                if (!prev) return prev;
                const updatedUsers = prev.systemUsers.map(user =>
                    user.id === userToUpdate.id ? userToUpdate : user
                );
                return {...prev, systemUsers: updatedUsers };
            });
        },
        deleteUser: (userId) => {
            setData(prev => ({...prev!, systemUsers: prev!.systemUsers.filter(u => u.id !== userId)}));
        },
        addFranchiseUser: (user) => {
            setData(prev => {
                if (!prev) return prev;
                const newId = Math.max(0, ...prev.franchiseUsers.map(u => u.id)) + 1;
                const { password, ...userData } = user;
                const newFranchiseUser: FranchiseUser = { ...userData, id: newId };
                return {
                    ...prev,
                    franchiseUsers: [...prev.franchiseUsers, newFranchiseUser]
                };
            })
        },
        updateFranchiseUser: (userToUpdate) => {
            setData(prev => {
                if (!prev) return prev;
                const updatedUsers = prev.franchiseUsers.map(user =>
                    user.id === userToUpdate.id ? userToUpdate : user
                );
                return { ...prev, franchiseUsers: updatedUsers };
            });
        },
        deleteFranchiseUser: (userId) => {
             setData(prev => ({...prev!, franchiseUsers: prev!.franchiseUsers.filter(u => u.id !== userId)}));
        },
        addProduct: (product) => {
             setData(prev => {
                const newId = Math.max(...prev!.products.map(p => p.id), 0) + 1;
                return {...prev!, products: [...prev!.products, {...product, id: newId}]};
            })
        },
        updateProduct: (product) => {
            setData(prev => ({...prev!, products: prev!.products.map(p => p.id === product.id ? product : p)}));
        },
        deleteProduct: (productId) => {
            setData(prev => ({...prev!, products: prev!.products.filter(p => p.id !== productId)}));
        },
        updateFranchisorSettings: (settings) => {
            setData(prev => ({...prev!, franchisorSettings: settings}));
        },
        addAnnouncement: (announcement) => {
            setData(prev => {
                const newId = Math.max(...prev!.announcements.map(a => a.id), 0) + 1;
                const newAnnouncement = {
                    ...announcement,
                    id: newId,
                    author: user!.name,
                    createdAt: new Date().toISOString()
                };
                return {...prev!, announcements: [...prev!.announcements, newAnnouncement]}
            })
        },
        deleteAnnouncement: (id) => {
             setData(prev => ({...prev!, announcements: prev!.announcements.filter(a => a.id !== id)}));
        },
        addFranchiseeLead: (lead) => {
            setData(prev => {
                const newId = Math.max(...prev!.franchiseeLeads.map(l => l.id), 0) + 1;
                return {...prev!, franchiseeLeads: [...prev!.franchiseeLeads, {
                    ...lead,
                    id: newId,
                    createdAt: new Date().toISOString(),
                    status: FranchiseeLeadStatus.INITIAL_INTEREST,
                    documents: [],
                    internalNotes: [],
                }]}
            });
        },
        updateFranchiseeLeadStatus: (leadId, newStatus) => {
             setData(prev => ({...prev!, franchiseeLeads: prev!.franchiseeLeads.map(l => l.id === leadId ? {...l, status: newStatus} : l)}));
        },
         updateFranchiseeLeadDocumentStatus: (leadId, documentId, status) => {
            setData(prev => ({...prev!, franchiseeLeads: prev!.franchiseeLeads.map(l => {
                if(l.id === leadId) {
                    return {...l, documents: l.documents.map(d => d.id === documentId ? {...d, status} : d)}
                }
                return l;
            })}));
        },
        addInternalNoteToLead: (leadId, noteText) => {
            setData(prev => ({...prev!, franchiseeLeads: prev!.franchiseeLeads.map(l => {
                if(l.id === leadId) {
                    const newNote: InternalNote = {
                        id: Math.random(),
                        text: noteText,
                        author: user!.name,
                        createdAt: new Date().toISOString()
                    };
                    return {...l, internalNotes: [...l.internalNotes, newNote]};
                }
                return l;
            })}))
        },
        updateFranchiseeLead: (lead) => {
             setData(prev => ({...prev!, franchiseeLeads: prev!.franchiseeLeads.map(l => l.id === lead.id ? lead : l)}));
        },
        startNewAudit: (franchiseId, templateId) => {
            setData(prev => {
                const newId = Math.max(...prev!.audits.map(a => a.id), 0) + 1;
                const newAudit: Audit = {
                    id: newId,
                    franchiseId,
                    templateId,
                    auditorName: user!.name,
                    auditDate: '',
                    score: 0,
                    results: [],
                    status: 'Pendente',
                    createdAt: new Date().toISOString()
                };
                return {...prev!, audits: [...prev!.audits, newAudit]};
            });
        },
        submitAudit: (auditId, results) => {
             setData(prev => {
                const compliant = results.filter(r => r.status === AuditItemStatus.COMPLIANT).length;
                const totalApplicable = results.filter(r => r.status !== AuditItemStatus.NOT_APPLICABLE).length;
                const score = totalApplicable > 0 ? (compliant / totalApplicable) * 100 : 100;
                 return {...prev!, audits: prev!.audits.map(a => a.id === auditId ? {
                    ...a,
                    status: 'Concluído',
                    auditDate: new Date().toISOString(),
                    results,
                    score: Math.round(score)
                } : a)};
            });
        },
        addAuditTemplate: (template) => {
            setData(prev => {
                const newId = Math.max(...prev!.auditTemplates.map(t => t.id), 0) + 1;
                return {...prev!, auditTemplates: [...prev!.auditTemplates, {...template, id: newId}]};
            });
        },
        toggleModuleCompletion: (moduleId, userId) => {
            setData(prev => {
                const existing = prev!.userProgress.find(p => p.moduleId === moduleId && p.franchiseUserId === userId);
                if (existing) {
                    return {...prev!, userProgress: prev!.userProgress.filter(p => p.moduleId !== moduleId || p.franchiseUserId !== userId)};
                } else {
                    const newProgress: UserProgress = {
                        franchiseUserId: userId,
                        moduleId: moduleId,
                        completedAt: new Date().toISOString()
                    };
                    return {...prev!, userProgress: [...prev!.userProgress, newProgress]};
                }
            });
        },
        addSupportTicket: (ticketData, firstMessage) => {
            setData(prev => {
                const newId = Math.max(...prev!.supportTickets.map(t => t.id), 0) + 1;
                const newTicket: SupportTicket = {
                    ...ticketData,
                    id: newId,
                    franchiseId: selectedFranchiseId!,
                    status: SupportTicketStatus.OPEN,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    messages: [{
                        id: Math.random(),
                        author: user!.name,
                        isFranchisor: false,
                        text: firstMessage,
                        createdAt: new Date().toISOString()
                    }]
                };
                return {...prev!, supportTickets: [...prev!.supportTickets, newTicket]};
            });
        },
        addMessageToTicket: (ticketId, text, author, isFranchisor) => {
            setData(prev => {
                return {...prev!, supportTickets: prev!.supportTickets.map(t => {
                    if (t.id === ticketId) {
                        const newMessage = {id: Math.random(), text, author, isFranchisor, createdAt: new Date().toISOString()};
                        return {...t, messages: [...t.messages, newMessage], updatedAt: new Date().toISOString()};
                    }
                    return t;
                })}
            })
        },
        updateTicketStatus: (ticketId, newStatus) => {
             setData(prev => ({...prev!, supportTickets: prev!.supportTickets.map(t => t.id === ticketId ? {...t, status: newStatus, updatedAt: new Date().toISOString()} : t)}));
        },
        addForumPost: (postData) => {
            setData(prev => {
                const newId = Math.max(...prev!.forumPosts.map(p => p.id), 0) + 1;
                const franchiseName = selectedFranchiseData?.franchise.name || "Franqueadora";
                const newPost: ForumPost = {
                    ...postData,
                    id: newId,
                    authorId: user!.id,
                    authorName: user!.name,
                    authorFranchiseName: franchiseName,
                    createdAt: new Date().toISOString(),
                    replies: []
                };
                return {...prev!, forumPosts: [...prev!.forumPosts, newPost]};
            })
        },
        addForumReply: (postId, content) => {
            setData(prev => {
                const franchiseName = selectedFranchiseData?.franchise.name || "Franqueadora";
                return {...prev!, forumPosts: prev!.forumPosts.map(p => {
                    if (p.id === postId) {
                        const newReply: ForumReply = {
                            id: Math.random(),
                            postId,
                            authorId: user!.id,
                            authorName: user!.name,
                            authorFranchiseName: franchiseName,
                            content,
                            createdAt: new Date().toISOString()
                        };
                        return {...p, replies: [...p.replies, newReply]};
                    }
                    return p;
                })}
            });
        },
        addSale: async (saleData, items) => {
            setData(prev => {
                const newSaleId = Math.max(...prev!.sales.map(s => s.id), 0) + 1;
                const newSale: Sale = {
                    ...saleData,
                    id: newSaleId,
                    status: SaleStatus.PENDING_PAYMENT,
                };
                const newSaleItems: SaleItem[] = items.map(item => ({
                    ...item,
                    id: Math.random(),
                    saleId: newSaleId,
                }));

                return {
                    ...prev!,
                    sales: [...prev!.sales, newSale],
                    saleItems: [...prev!.saleItems, ...newSaleItems]
                };
            });
        },
        updateSaleStatus: (saleId, newStatus) => {
            setData(prev => ({
                ...prev!,
                sales: prev!.sales.map(s =>
                    s.id === saleId ? { ...s, status: newStatus } : s
                )
            }));
        },
        addContractTemplate: (template) => {
            setData(prev => {
                const newId = Math.max(...prev!.contractTemplates.map(t => t.id), 0) + 1;
                return {...prev!, contractTemplates: [...prev!.contractTemplates, {...template, id: newId}]};
            });
        },
        updateContractTemplate: (template) => {
            setData(prev => ({...prev!, contractTemplates: prev!.contractTemplates.map(t => t.id === template.id ? template : t)}));
        },
        deleteContractTemplate: (templateId) => {
            setData(prev => ({...prev!, contractTemplates: prev!.contractTemplates.filter(t => t.id !== templateId)}));
        },
        generateContract: (saleId, templateId) => {
            setData(prev => {
                const sale = prev!.sales.find(s => s.id === saleId);
                const client = prev!.clients.find(c => c.id === sale?.clientId);
                const template = prev!.contractTemplates.find(t => t.id === templateId);
                const saleItems = prev!.saleItems.filter(si => si.saleId === saleId);
                
                if (!sale || !client || !template) return prev;

                let content = template.body;
                // Replace placeholders
                content = content.replace(/{{CLIENT_NAME}}/g, client.name);
                content = content.replace(/{{CLIENT_CPF_CNPJ}}/g, client.cpf || client.cnpj || '');
                content = content.replace(/{{CLIENT_ADDRESS}}/g, `${client.logradouro}, ${client.numero} - ${client.bairro}, ${client.cidade}/${client.estado}`);
                content = content.replace(/{{SALE_DATE}}/g, new Date(sale.saleDate).toLocaleDateString('pt-BR'));
                content = content.replace(/{{SALE_TOTAL}}/g, new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sale.totalAmount));
                content = content.replace(/{{SALE_ITEMS}}/g, saleItems.map(item => `- ${item.productName}: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.value)}`).join('\n'));


                const newId = Math.max(...prev!.contracts.map(c => c.id), 0) + 1;
                const newContract: Contract = {
                    id: newId,
                    saleId,
                    templateId,
                    status: ContractStatus.DRAFT,
                    generatedAt: new Date().toISOString(),
                    content,
                };

                return {...prev!, contracts: [...prev!.contracts, newContract]};
            });
        },
        updateContractStatus: (contractId, newStatus) => {
            setData(prev => ({...prev!, contracts: prev!.contracts.map(c => {
                if (c.id === contractId) {
                    const updatedContract: Contract = { ...c, status: newStatus };
                    if (newStatus === ContractStatus.SIGNED) {
                        updatedContract.signedAt = new Date().toISOString();
                    }
                    return updatedContract;
                }
                return c;
            })}));
        },
        addOrUpdateGoal: (goalData) => {
            setData(prev => {
                const existingGoalIndex = prev!.goals.findIndex(g => 
                    g.franchiseId === goalData.franchiseId && 
                    g.month === goalData.month && 
                    g.year === goalData.year
                );
                
                const newGoals = [...prev!.goals];

                if (existingGoalIndex > -1) {
                    // Update existing goal
                    const existingGoal = newGoals[existingGoalIndex];
                    newGoals[existingGoalIndex] = { ...existingGoal, ...goalData };
                } else {
                    // Add new goal
                    const newId = Math.max(0, ...prev!.goals.map(g => g.id)) + 1;
                    newGoals.push({ ...goalData, id: newId });
                }

                return { ...prev!, goals: newGoals };
            });
        },
    }), [user, selectedFranchiseData, selectedFranchiseId]);

    const value = {
        data,
        isLoading,
        isContentLoading,
        franchisesWithStats,
        networkStats,
        selectedFranchiseData,
        handlers,
    };
    
    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};