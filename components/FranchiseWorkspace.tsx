import React, { useState, useMemo, useEffect } from 'react';
import { useData } from '../hooks/useData';
import SidebarNav from './SidebarNav';
import GoalsView from './GoalsView';
import LeadManagementView from './LeadManagementView';
import LeadDetailView from './LeadDetailView';
import TaskManagementView from './TaskManagementView';
import ClientsView from './ClientsView';
import FranchiseeFinancials from './FranchiseeFinancials';
import SalesPerformanceView from './SalesPerformanceView';
import FranchiseDetailsView from './FranchiseDetailsView';
import KnowledgeBaseView from './KnowledgeBaseView';
import AnnouncementsView from './AnnouncementsView';
import FranchiseeAuditsView from './audits/FranchiseeAuditsView';
import FranchiseeTrainingView from './training/FranchiseeTrainingView';
import FranchiseeMarketingView from './marketing/FranchiseeMarketingView';
import FranchiseeTicketsView from './communication/FranchiseeTicketsView';
import FranchiseeReportsView from './reports/FranchiseeReportsView';
import { TargetIcon, UsersGroupIcon, CalendarIcon, UsersIcon, CashIcon, TrendingUpIcon, DocumentReportIcon, BookOpenIcon, MegaphoneIcon, ShieldCheckIcon, AcademicCapIcon, PhotoIcon, ChatBubbleLeftRightIcon, ChartBarIcon, SpinnerIcon, HomeIcon, MenuIcon } from './icons';
import CommunityForumView from './community/CommunityForumView';
import SalesListView from './sales/SalesListView';
import CreateSaleView from './sales/CreateSaleView';
import DashboardView from './dashboard/franchisee/DashboardView';
import { useLocation, useNavigate } from 'react-router-dom';

interface FranchiseWorkspaceProps {
  isFranchiseeView?: boolean;
}

type SaleProcessState = {
    isCreating: boolean;
    leadId?: number;
    clientId?: number;
}

const TAB_GROUPS = [
    {
        title: 'Principal',
        items: [
            { id: 'dashboard', label: 'Visão Geral', icon: HomeIcon, component: <DashboardView /> },
        ]
    },
    {
        title: 'Vendas & CRM',
        items: [
            { id: 'leads', label: 'Funil de Vendas', icon: UsersGroupIcon, component: <LeadManagementView onSelectLead={() => {}} onStartSale={() => {}} /> },
            { id: 'sales', label: 'Vendas', icon: DocumentReportIcon, component: <SalesListView /> },
            { id: 'clients', label: 'Clientes', icon: UsersIcon, component: <ClientsView /> },
            { id: 'sales-performance', label: 'Performance', icon: TrendingUpIcon, component: <SalesPerformanceView /> },
        ]
    },
    {
        title: 'Gestão & Operacional',
        items: [
            { id: 'tasks', label: 'Agenda', icon: CalendarIcon, component: <TaskManagementView /> },
            { id: 'financials', label: 'Financeiro', icon: CashIcon, component: <FranchiseeFinancials /> },
            { id: 'details', label: 'Dados da Franquia', icon: DocumentReportIcon, component: <FranchiseDetailsView /> },
            { id: 'reports', label: 'Relatórios', icon: ChartBarIcon, component: <FranchiseeReportsView /> },
            { id: 'audits', label: 'Auditorias', icon: ShieldCheckIcon, component: <FranchiseeAuditsView /> },
            { id: 'goals', label: 'Metas', icon: TargetIcon, component: <GoalsView /> },
        ]
    },
    {
        title: 'Suporte & Recursos',
        items: [
            { id: 'announcements', label: 'Comunicados', icon: MegaphoneIcon, component: <AnnouncementsView announcements={[]} /> },
            { id: 'training', label: 'Treinamentos', icon: AcademicCapIcon, component: <FranchiseeTrainingView /> },
            { id: 'marketing', label: 'Marketing', icon: PhotoIcon, component: <FranchiseeMarketingView /> },
            { id: 'knowledge', label: 'Base de Conhecimento', icon: BookOpenIcon, component: <KnowledgeBaseView resources={[]} /> },
            { id: 'forum', label: 'Fórum', icon: ChatBubbleLeftRightIcon, component: <CommunityForumView /> },
            { id: 'support', label: 'Suporte (Tickets)', icon: ChatBubbleLeftRightIcon, component: <FranchiseeTicketsView /> },
        ]
    }
];

const allTabs = TAB_GROUPS.flatMap(g => g.items);

const FranchiseWorkspace: React.FC<FranchiseWorkspaceProps> = ({ isFranchiseeView = false }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const path = location.pathname || '/';
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedLeadId, setSelectedLeadId] = useState<number | null>(null);
    const [saleProcess, setSaleProcess] = useState<SaleProcessState>({ isCreating: false });
    const { selectedFranchiseData, isLoading, isContentLoading } = useData();

    const { activeTab, params } = useMemo(() => {
        const parts = path.split('/').filter(Boolean);
        let tab: string;
        let params: Record<string, string> = {};
        if (isFranchiseeView) { // path: /tab/subtab or /tab/:id
            tab = parts[0] || 'dashboard';
            if (parts[0] === 'leads' && parts[1]) {
                params.leadId = parts[1];
            }
        } else { // Franchisor view: /franchises/:id/tab/subtab or /franchises/:id/tab/:id
            tab = parts[2] || 'dashboard';
             if (parts[2] === 'leads' && parts[3]) {
                params.leadId = parts[3];
            }
        }
        return { activeTab: tab, params };
    }, [path, isFranchiseeView]);

    useEffect(() => {
        // If we have a leadId in params, set it. Otherwise, clear it.
        if (params.leadId) {
            setSelectedLeadId(Number(params.leadId));
        } else {
            setSelectedLeadId(null);
        }
    }, [params.leadId]);

    const resetViews = () => {
        const basePath = isFranchiseeView ? `/${activeTab}` : `/franchises/${selectedFranchiseData?.franchise.id}/${activeTab}`;
        navigate(basePath);
        setSaleProcess({ isCreating: false });
    };

    const handleTabClick = (tabId: string) => {
        // Navigation is handled by SidebarNav links, this can be for other purposes if needed.
    };

    const handleStartSale = (leadId: number, clientId: number) => {
        setSaleProcess({ isCreating: true, leadId, clientId });
    };
    
    const handleSaleCreationSuccess = () => {
        const newPath = isFranchiseeView ? '/sales' : `/franchises/${selectedFranchiseData?.franchise.id}/sales`;
        navigate(newPath);
        setSaleProcess({ isCreating: false });
    };

    const handleSelectLead = (leadId: number) => {
        const newPath = isFranchiseeView ? `/leads/${leadId}` : `/franchises/${selectedFranchiseData?.franchise.id}/leads/${leadId}`;
        navigate(newPath);
    };


    if (isLoading || !selectedFranchiseData) {
        return (
             <div className="flex items-center justify-center h-screen bg-background">
                <div className="text-center">
                    <SpinnerIcon className="w-12 h-12 text-primary mx-auto animate-spin" />
                    <p className="mt-4 text-lg font-semibold text-text-primary">Carregando dados da franquia...</p>
                </div>
            </div>
        );
    }

    const { franchise, leads, clients, notes, tasks, announcements, knowledgeBaseResources } = selectedFranchiseData;

    const renderContent = () => {
        if (isContentLoading) {
            return (
                <div className="flex flex-col justify-center items-center h-[70vh] text-center">
                    <SpinnerIcon className="w-12 h-12 text-primary animate-spin" />
                    <p className="mt-4 text-lg font-semibold text-text-primary">Carregando relatórios e dados operacionais...</p>
                </div>
            );
        }

        if (saleProcess.isCreating && saleProcess.clientId) {
            const client = clients.find((c: any) => c.id === saleProcess.clientId);
            if(client) {
                return <CreateSaleView client={client} leadId={saleProcess.leadId} onSaleCreated={handleSaleCreationSuccess} onCancel={resetViews} />
            }
        }
        
        if (selectedLeadId && activeTab === 'leads') {
            const lead = leads.find((l: any) => l.id === selectedLeadId);
            const client = clients.find((c: any) => c.id === lead?.clientId);
            const leadNotes = notes.filter((n: any) => n.leadId === selectedLeadId);
            const leadTasks = tasks.filter((t: any) => t.leadId === selectedLeadId);
            if (lead) {
                return <LeadDetailView 
                    lead={lead} 
                    client={client} 
                    notes={leadNotes} 
                    tasks={leadTasks} 
                    onBack={resetViews}
                    onStartSale={handleStartSale} 
                    onNavigateToDetails={() => {
                        const newPath = isFranchiseeView ? '/details' : `/franchises/${franchise.id}/details`;
                        navigate(newPath);
                    }}
                />;
            }
        }
        
        const tab = allTabs.find(t => t.id === activeTab);
        if (!tab) return <div>Página não encontrada</div>;

        switch(activeTab) {
            case 'leads':
                return <LeadManagementView onSelectLead={handleSelectLead} onStartSale={handleStartSale} />;
            case 'announcements':
                return <AnnouncementsView announcements={announcements} />;
            case 'knowledge':
                return <KnowledgeBaseView resources={knowledgeBaseResources} />;
            case 'sales-performance':
                return <SalesPerformanceView />;
            default:
                 return tab.component;
        }
    };

    return (
        <div className="bg-background min-h-screen">
            <header className="fixed top-0 left-0 right-0 h-16 bg-card border-b border-border px-4 flex items-center justify-between z-20 lg:hidden">
                <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-text-primary">
                    <MenuIcon className="w-6 h-6" />
                </button>
                <h1 className="text-lg font-bold truncate">{franchise.name}</h1>
                <div className="w-8"></div> {/* Spacer */}
            </header>

            <SidebarNav 
                franchiseName={franchise.name}
                currentTab={activeTab}
                tabGroups={TAB_GROUPS}
                onTabClick={handleTabClick}
                onBack={() => {}}
                isFranchiseeView={isFranchiseeView}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />
            <main className="lg:pl-64 pt-16 lg:pt-0">
                <div className="p-4 sm:p-8">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default FranchiseWorkspace;