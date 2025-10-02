import React, { useState, useMemo } from 'react';
import { FranchiseeLead, FranchiseeLeadStatus, DocumentStatus, InternalNote } from '../types';
import { ArrowLeftIcon, MailIcon, PhoneIcon, CashIcon, BriefcaseIcon, UserIcon, PencilAltIcon } from './icons';
import AICandidateAnalysis from './AICandidateAnalysis';
import Modal from './Modal';
import FranchiseeLeadForm from './FranchiseeLeadForm';
import { useData } from '../hooks/useData';

interface FranchiseeLeadDetailViewProps {
    lead: FranchiseeLead;
    onBack: () => void;
    onUpdateStatus: (leadId: number, newStatus: FranchiseeLeadStatus) => void;
    onUpdateDocumentStatus: (leadId: number, documentId: number, status: DocumentStatus) => void;
    onAddNote: (leadId: number, noteText: string) => void;
    onConvertToFranchise: (lead: FranchiseeLead) => void;
}

const statusColorMap: Record<DocumentStatus, string> = {
    [DocumentStatus.PENDING]: 'bg-gray-200 text-gray-800',
    [DocumentStatus.RECEIVED]: 'bg-blue-200 text-blue-800',
    [DocumentStatus.VERIFIED]: 'bg-green-200 text-green-800',
    [DocumentStatus.INVALID]: 'bg-red-200 text-red-800',
};


const FranchiseeLeadDetailView: React.FC<FranchiseeLeadDetailViewProps> = ({ lead, onBack, onUpdateStatus, onUpdateDocumentStatus, onAddNote, onConvertToFranchise }) => {
    const [newNote, setNewNote] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const { handlers } = useData();

    const handleAddNote = () => {
        if (newNote.trim()) {
            onAddNote(lead.id, newNote.trim());
            setNewNote('');
        }
    };
    
    const handleUpdateLeadSubmit = (leadData: FranchiseeLead) => {
        handlers.updateFranchiseeLead(leadData);
        setIsEditModalOpen(false);
    };

    const docCompletionPercent = useMemo(() => {
        if (lead.documents.length === 0) return 0;
        const verifiedCount = lead.documents.filter(d => d.status === DocumentStatus.VERIFIED).length;
        return (verifiedCount / lead.documents.length) * 100;
    }, [lead.documents]);

    return (
        <div className="bg-background text-text-primary p-4 sm:p-6 lg:p-8 min-h-full">
            <header className="mb-6">
                <button onClick={onBack} className="flex items-center text-sm font-medium text-primary hover:text-blue-800 mb-4">
                    <ArrowLeftIcon className="w-5 h-5 mr-2" />
                    Voltar para o Funil
                </button>
                <div className="bg-white p-6 rounded-lg shadow-md flex flex-col lg:flex-row justify-between lg:items-start gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">{lead.candidateName}</h1>
                         <div className="flex flex-wrap gap-x-6 gap-y-2 text-text-secondary mt-2">
                            <p className="flex items-center"><MailIcon className="w-5 h-5 mr-2" /> {lead.candidateEmail}</p>
                            <p className="flex items-center"><PhoneIcon className="w-5 h-5 mr-2" /> {lead.candidatePhone}</p>
                            <p className="flex items-center"><BriefcaseIcon className="w-5 h-5 mr-2" /> {lead.cityOfInterest}</p>
                            <p className="flex items-center"><CashIcon className="w-5 h-5 mr-2" /> {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(lead.investmentCapital)}</p>
                        </div>
                    </div>
                     <div className="flex flex-col sm:flex-row items-stretch sm:items-start sm:space-x-4 gap-4 sm:gap-0 w-full sm:w-auto">
                        <div className="w-full sm:w-auto">
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                            <select
                                id="status"
                                value={lead.status}
                                onChange={(e) => onUpdateStatus(lead.id, e.target.value as FranchiseeLeadStatus)}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-gray-50 border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                            >
                            {Object.values(FranchiseeLeadStatus).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col items-center space-y-2 self-end sm:self-start">
                             <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="sm:mt-6 p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-full"
                                title="Editar Dados do Candidato"
                            >
                                <PencilAltIcon className="w-5 h-5" />
                            </button>
                             {lead.status === FranchiseeLeadStatus.DEAL_CLOSED && (
                                <button
                                    onClick={() => onConvertToFranchise(lead)}
                                    className="flex items-center justify-center bg-secondary hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105 text-sm w-full"
                                >
                                    <BriefcaseIcon className="w-4 h-4 mr-2" />
                                    Converter em Franquia
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Document Checklist */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Checklist de Documentos de Onboarding</h3>
                        <div className="mb-4">
                             <div className="flex justify-between mb-1">
                                <span className="text-base font-medium text-primary">Progresso</span>
                                <span className="text-sm font-medium text-primary">{docCompletionPercent.toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-primary h-2.5 rounded-full" style={{width: `${docCompletionPercent}%`}}></div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {lead.documents.map(doc => (
                                <div key={doc.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-gray-50 rounded-md border gap-2">
                                    <span className="text-sm font-medium text-gray-800">{doc.name}</span>
                                    <div className="flex items-center space-x-2 w-full sm:w-auto">
                                       <select
                                          value={doc.status}
                                          onChange={(e) => onUpdateDocumentStatus(lead.id, doc.id, e.target.value as DocumentStatus)}
                                          className={`w-full sm:w-auto text-xs font-semibold border-none rounded-md focus:ring-2 focus:ring-offset-1 focus:ring-primary ${statusColorMap[doc.status]}`}
                                       >
                                           {Object.values(DocumentStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                       </select>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Internal Notes */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                         <h3 className="text-lg font-semibold text-gray-900 mb-4">Anotações Internas da Equipe</h3>
                         <div className="space-y-4 mb-6">
                            {lead.internalNotes.length > 0 ? lead.internalNotes.map(note => (
                                <div key={note.id} className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-200">
                                            <UserIcon className="h-5 w-5 text-gray-600" />
                                        </span>
                                    </div>
                                    <div className="ml-3 flex-1">
                                        <div className="text-sm font-medium text-gray-900">{note.author}</div>
                                        <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded-md border mt-1">{note.text}</p>
                                        <p className="text-xs text-gray-500 mt-1">{new Date(note.createdAt).toLocaleString('pt-BR')}</p>
                                    </div>
                                </div>
                            )) : <p className="text-sm text-gray-500">Nenhuma anotação interna ainda.</p>}
                         </div>
                         <div className="space-y-2">
                            <textarea
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                                rows={3}
                                placeholder="Adicionar nova anotação sobre o candidato..."
                                className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                            />
                            <div className="text-right mt-2">
                                 <button onClick={handleAddNote} className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-md shadow-sm hover:bg-blue-800">
                                    Salvar Anotação
                                </button>
                            </div>
                         </div>
                    </div>
                </div>
                
                <div className="lg:col-span-1">
                    <AICandidateAnalysis lead={lead} />
                </div>
            </main>
            
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Editar Dados do Candidato">
                <FranchiseeLeadForm
                    initialData={lead}
                    onSubmit={handleUpdateLeadSubmit as any}
                    onClose={() => setIsEditModalOpen(false)}
                />
            </Modal>
        </div>
    );
};

export default FranchiseeLeadDetailView;
