

import React, { useState, useMemo } from 'react';
import { useData } from '../hooks/useData';
import FranchisorSidebar from './FranchisorSidebar';
import FranchiseTable from './FranchiseTable';
import Modal from './Modal';
import AddFranchiseForm from './AddFranchiseForm';
import EditFranchiseForm from './EditFranchiseForm';
import NetworkHealthMetrics from './dashboard/NetworkHealthMetrics';
import NetworkPerformanceChart from './PerformanceChart';
import ServiceDistributionChart from './ServiceDistributionChart';
import HealthScoreTrendChart from './HealthScoreTrendChart';
import AINetworkInsights from './features/dashboard/AINetworkInsights';
import FranchisorFinancials from './FranchisorFinancials';
import FranchiseeLeadCRM from './FranchiseeLeadCRM';
import SettingsView from './SettingsView';
import FranchisorAuditsView from './audits/FranchisorAuditsView';
import FranchisorTrainingView from './training/FranchisorTrainingView';
import FranchisorMarketingView from './marketing/FranchisorMarketingView';
import AnnouncementsView from './AnnouncementsView';
import FranchisorTicketsView from './communication/FranchisorTicketsView';
import FranchisorReportsView from './reports/FranchisorReportsView';
import { MenuIcon, PlusIcon, SpinnerIcon } from './icons';
import { Franchise, FranchiseWithStats, FranchiseeLead, Invoice, Transaction } from '../types';
import ExpiringCampaignsAlert from './dashboard/ExpiringCampaignsAlert';
import NetworkActivityFeed from './dashboard/NetworkActivityFeed';
import QuickStats from './dashboard/QuickStats';
import FranchiseSummaryModal from './FranchiseSummaryModal';
import SchemaView from './SchemaView';
import CommunityForumView from './community/CommunityForumView';
import FranchisorContractTemplatesView from './contracts/FranchisorContractTemplatesView';
import { useLocation, useNavigate } from 'react-router-dom';
import BannerStatusConexao from './BannerStatusConexao';


type FranchisorTab = 'dashboard' | 'franchises' | 'expansion' | 'financials' | 'audits' | 'training' | 'marketing' | 'communication' | 'forum' | 'reports' | 'settings' | 'schema' | 'contracts';

const FranchisorDashboard: React.FC = () => {
  const location = useLocation();
  const path = location.pathname || '/';
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingFranchise, setEditingFranchise] = useState<Franchise | null>(null);
  const [summaryFranchise, setSummaryFranchise] = useState<FranchiseWithStats | null>(null);

  const { 
    data,
    franchisesWithStats, 
    networkStats, 
    handlers,
    isContentLoading,
  } = useData();

  const { franchises, franchiseeLeads, announcements, products, marketingCampaigns, transactions, consortiums, creditRecoveryCases } = data;

  const activeTab = useMemo<FranchisorTab>(() => {
    const tab = path.split('/')[1] || 'dashboard';
    const validTabs: FranchisorTab[] = ['dashboard', 'franchises', 'expansion', 'financials', 'audits', 'training', 'marketing', 'communication', 'forum', 'reports', 'settings', 'schema', 'contracts'];
    if (validTabs.includes(tab as FranchisorTab)) {
        return tab as FranchisorTab;
    }
    return 'dashboard';
  }, [path]);


  const handleConvertToFranchise = (lead: FranchiseeLead) => {
    const newFranchiseData = {
      name: `Nova Franquia - ${lead.cityOfInterest}`,
      location: lead.cityOfInterest,
      cnpj: '',
      corporateName: '',
      inaugurationDate: new Date().toISOString(),
      ownerName: lead.candidateName,
      ownerEmail: lead.candidateEmail,
      ownerPhone: lead.candidatePhone,
    };
    handlers.addFranchise(newFranchiseData);
    navigate('/franchises');
  };

  const dashboardStats = useMemo(() => {
    return {
        franchiseCount: franchises.length,
        totalLeads: franchiseeLeads.length,
        activeContracts: consortiums.length,
        recoveryCases: creditRecoveryCases.length,
    }
  }, [franchises, franchiseeLeads, consortiums, creditRecoveryCases]);

  const handleSelectTab = (tabId: string) => {
    navigate(`/${tabId}`);
    setIsSidebarOpen(false);
  };

  const renderContent = () => {
    if (isContentLoading) {
        return (
            <div className="flex flex-col justify-center items-center h-[70vh] text-center">
                <SpinnerIcon className="w-12 h-12 text-primary animate-spin" />
                <p className="mt-4 text-lg font-semibold text-text-primary">Carregando dados da rede...</p>
                <p className="text-sm text-text-secondary">Isso pode levar um momento.</p>
            </div>
        );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
            <div className="space-y-8">
                <h1 className="page-title">Visão Geral da Rede</h1>
                <ExpiringCampaignsAlert campaigns={marketingCampaigns} />
                <NetworkHealthMetrics stats={networkStats} franchiseCount={franchises.length} />
                <AINetworkInsights franchisesWithStats={franchisesWithStats} />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <NetworkPerformanceChart data={franchisesWithStats} />
                    </div>
                    <NetworkActivityFeed />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                   <ServiceDistributionChart data={franchisesWithStats} />
                   <HealthScoreTrendChart data={franchisesWithStats} />
                </div>
            </div>
        );
      case 'franchises':
        return (
          <div>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
              <h1 className="page-title">Franquias da Rede</h1>
              <button onClick={() => setIsAddModalOpen(true)} className="button-primary w-full sm:w-auto">
                <PlusIcon className="w-5 h-5 mr-2" />
                Adicionar Franquia
              </button>
            </div>
            <FranchiseTable 
              franchises={franchisesWithStats} 
              onEdit={(id) => setEditingFranchise(franchises.find(f => f.id === id) || null)}
              onViewSummary={(id) => setSummaryFranchise(franchisesWithStats.find(f => f.id === id) || null)}
            />
          </div>
        );
      case 'expansion':
        return <FranchiseeLeadCRM leads={franchiseeLeads} onUpdateStatus={handlers.updateFranchiseeLeadStatus} onConvertToFranchise={handleConvertToFranchise} />;
      case 'financials':
        return <FranchisorFinancials />;
      case 'audits':
        return <FranchisorAuditsView />;
      case 'training':
        return <FranchisorTrainingView />;
      case 'marketing':
        return <FranchisorMarketingView />;
      case 'contracts':
        return <FranchisorContractTemplatesView />;
      case 'communication':
        return (
            <div className="space-y-8">
                <AnnouncementsView announcements={announcements} onAddAnnouncement={handlers.addAnnouncement} onDeleteAnnouncement={handlers.deleteAnnouncement} />
                <FranchisorTicketsView />
            </div>
        );
      case 'forum':
        return <CommunityForumView />;
      case 'reports':
        return <FranchisorReportsView />;
      case 'settings':
        return <SettingsView />;
      case 'schema':
        return <SchemaView />;
      default:
        return <div>Selecione uma opção no menu.</div>;
    }
  };

  return (
    <div className="bg-background min-h-screen">
      <header className="fixed top-0 left-0 right-0 h-16 bg-card border-b border-border px-4 flex items-center justify-between z-20 lg:hidden">
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-text-primary">
            <MenuIcon className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold">Painel Franqueadora</h1>
        <div className="w-8"></div> {/* Spacer */}
      </header>

      <FranchisorSidebar 
        activeTab={activeTab} 
        onSelectTab={handleSelectTab} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="lg:pl-64 pt-16 lg:pt-0">
        <div className="p-4 sm:p-8">
          <BannerStatusConexao />
          {renderContent()}
        </div>
      </main>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Adicionar Nova Franquia">
        <AddFranchiseForm onAddFranchise={handlers.addFranchise} onClose={() => setIsAddModalOpen(false)} />
      </Modal>

      {editingFranchise && (
        <Modal isOpen={!!editingFranchise} onClose={() => setEditingFranchise(null)} title="Editar Franquia">
            <EditFranchiseForm
                franchise={editingFranchise}
                allProducts={products}
                onSubmit={(franchise) => {
                    handlers.updateFranchise(franchise);
                    setEditingFranchise(null);
                }}
                onClose={() => setEditingFranchise(null)}
            />
        </Modal>
      )}
      
      {summaryFranchise && (
        <FranchiseSummaryModal 
            franchise={summaryFranchise}
            transactions={transactions.filter((t: Transaction) => t.franchiseId === summaryFranchise.id)}
            onClose={() => setSummaryFranchise(null)}
            onManage={(franchiseId) => { navigate(`/franchises/${franchiseId}/dashboard`) }}
        />
      )}
    </div>
  );
};

export default FranchisorDashboard;