import React, { useState, useMemo } from 'react';
import { FranchiseeLead, FranchiseeLeadStatus } from '../types';
import { BriefcaseIcon, CashIcon, MailIcon, PhoneIcon, PlusIcon } from './icons';
import FranchiseeLeadDetailView from './FranchiseeLeadDetailView';
import { useData } from '../hooks/useData';
import Modal from './Modal';
import FranchiseeLeadForm from './FranchiseeLeadForm';
import { useLocation, useNavigate } from 'react-router-dom';

interface FranchiseeLeadCRMProps {
  leads: FranchiseeLead[];
  onUpdateStatus: (leadId: number, newStatus: FranchiseeLeadStatus) => void;
  onConvertToFranchise: (lead: FranchiseeLead) => void;
}

const statusStyles: Record<FranchiseeLeadStatus, { border: string; text: string; bg: string }> = {
    [FranchiseeLeadStatus.INITIAL_INTEREST]: { border: 'border-blue-400', text: 'text-blue-600', bg: 'bg-blue-50' },
    [FranchiseeLeadStatus.IN_ANALYSIS]: { border: 'border-yellow-500', text: 'text-yellow-600', bg: 'bg-yellow-50' },
    [FranchiseeLeadStatus.PROPOSAL_SENT]: { border: 'border-indigo-500', text: 'text-indigo-600', bg: 'bg-indigo-50' },
    [FranchiseeLeadStatus.PENDING_CONTRACT]: { border: 'border-purple-500', text: 'text-purple-600', bg: 'bg-purple-50' },
    [FranchiseeLeadStatus.DEAL_CLOSED]: { border: 'border-green-500', text: 'text-green-600', bg: 'bg-green-50' },
    [FranchiseeLeadStatus.OPPORTUNITY_LOST]: { border: 'border-red-500', text: 'text-red-600', bg: 'bg-red-50' },
};

const LeadCard: React.FC<{ lead: FranchiseeLead; onSelect: (id: number) => void }> = ({ lead, onSelect }) => {
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData('leadId', lead.id.toString());
    };
    
    return (
        <div 
            draggable="true"
            onDragStart={handleDragStart}
            onClick={() => onSelect(lead.id)}
            className={`p-4 rounded-xl shadow-md border border-border cursor-pointer hover:shadow-lg hover:border-primary transition-all bg-card border-l-4 ${statusStyles[lead.status].border}`}>
            <h4 className="font-bold text-base text-text-primary">{lead.candidateName}</h4>
            <p className="text-sm text-text-secondary mb-3">{lead.cityOfInterest}</p>
            
            <div className="space-y-2 text-sm text-text-tertiary">
                <p className="flex items-center">
                    <CashIcon className="w-4 h-4 mr-2"/>
                    Capital: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact' }).format(lead.investmentCapital)}
                </p>
                <p className="flex items-center">
                    <PhoneIcon className="w-4 h-4 mr-2"/>
                    {lead.candidatePhone}
                </p>
                <p className="flex items-center">
                    <MailIcon className="w-4 h-4 mr-2"/>
                    {lead.candidateEmail}
                </p>
            </div>

            <div className="text-right text-xs text-text-secondary mt-3">
                Criado em: {new Date(lead.createdAt).toLocaleDateString('pt-BR')}
            </div>
        </div>
    );
};

const KanbanColumn: React.FC<{ 
    title: string; 
    status: FranchiseeLeadStatus; 
    children: React.ReactNode;
    onDrop: (e: React.DragEvent<HTMLDivElement>, status: FranchiseeLeadStatus) => void;
 }> = ({ title, status, children, onDrop }) => {
    const [isOver, setIsOver] = useState(false);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsOver(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsOver(false);
    };
    
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        onDrop(e, status);
        setIsOver(false);
    };

    return (
        <div 
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`w-72 sm:w-80 bg-background rounded-xl shadow-inner flex-shrink-0 transition-colors duration-300 ${isOver ? 'ring-2 ring-primary' : ''}`}>
            <div className={`p-4 border-b-2 ${statusStyles[status].border}`}>
                <h3 className={`font-bold uppercase text-sm ${statusStyles[status].text}`}>{title}</h3>
            </div>
            <div className="p-2 space-y-3 min-h-full">
                {children}
            </div>
        </div>
    );
};


const FranchiseeLeadCRM: React.FC<FranchiseeLeadCRMProps> = ({ leads, onUpdateStatus, onConvertToFranchise }) => {
    const location = useLocation();
    const path = location.pathname || '/';
    const navigate = useNavigate();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const { handlers } = useData();

    const selectedLeadId = useMemo(() => {
        const parts = path.split('/');
        if (parts[1] === 'expansion' && parts[2]) {
            return parseInt(parts[2], 10);
        }
        return null;
    }, [path]);

    const handleSelectLead = (id: number) => {
        navigate(`/expansion/${id}`);
    };

    const handleBack = () => {
        navigate('/expansion');
    };

    const columns: { status: FranchiseeLeadStatus, title: string }[] = [
        { status: FranchiseeLeadStatus.INITIAL_INTEREST, title: 'Interesse Inicial' },
        { status: FranchiseeLeadStatus.IN_ANALYSIS, title: 'Em Análise' },
        { status: FranchiseeLeadStatus.PROPOSAL_SENT, title: 'Proposta Enviada' },
        { status: FranchiseeLeadStatus.PENDING_CONTRACT, title: 'Contrato Pendente' },
        { status: FranchiseeLeadStatus.DEAL_CLOSED, title: 'Negócio Fechado' },
        { status: FranchiseeLeadStatus.OPPORTUNITY_LOST, title: 'Perdeu Oportunidade' },
    ];
    
    const handleDrop = (e: React.DragEvent<HTMLDivElement>, status: FranchiseeLeadStatus) => {
        e.preventDefault();
        const leadId = Number(e.dataTransfer.getData('leadId'));
        if (leadId) {
            onUpdateStatus(leadId, status);
        }
    };
    
    const handleAddLeadSubmit = (leadData: Omit<FranchiseeLead, 'id' | 'createdAt' | 'status' | 'documents' | 'internalNotes'>) => {
        handlers.addFranchiseeLead(leadData);
        setIsAddModalOpen(false);
    };

    const selectedLead = leads.find(l => l.id === selectedLeadId);

    if (selectedLead) {
        return <FranchiseeLeadDetailView 
                    lead={selectedLead} 
                    onBack={handleBack}
                    onUpdateStatus={onUpdateStatus}
                    onUpdateDocumentStatus={handlers.updateFranchiseeLeadDocumentStatus}
                    onAddNote={handlers.addInternalNoteToLead}
                    onConvertToFranchise={onConvertToFranchise}
                />;
    }

    return (
        <div className="card">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                 <div className="flex items-center space-x-3">
                    <BriefcaseIcon className="w-8 h-8 text-primary"/>
                    <h2 className="page-title">Funil de Venda de Novas Franquias</h2>
                </div>
                 <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="button-primary w-full sm:w-auto"
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Adicionar Candidato
                </button>
            </div>
            <div className="flex space-x-4 overflow-x-auto p-2 pb-4">
                {columns.map(({ status, title }) => (
                    <KanbanColumn key={status} title={title} status={status} onDrop={handleDrop}>
                        {leads
                            .filter(lead => lead.status === status)
                            .map(lead => <LeadCard key={lead.id} lead={lead} onSelect={handleSelectLead} />)
                        }
                    </KanbanColumn>
                ))}
            </div>
            
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Adicionar Novo Candidato">
                <FranchiseeLeadForm
                    onSubmit={handleAddLeadSubmit as any}
                    onClose={() => setIsAddModalOpen(false)}
                />
            </Modal>
        </div>
    );
};

export default FranchiseeLeadCRM;