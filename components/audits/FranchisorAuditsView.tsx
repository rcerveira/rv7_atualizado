import React, { useState, useMemo } from 'react';
import { useData } from '../../hooks/useData';
import { Audit, AuditTemplate, Franchise } from '../../types';
import AuditReportModal from './AuditReportModal';
import { ShieldCheckIcon, PlusIcon } from '../icons';
import Modal from '../Modal';
import StartAuditForm from './StartAuditForm';
import AuditTemplateForm from './AuditTemplateForm';

const FranchisorAuditsView: React.FC = () => {
    const { data, handlers } = useData();
    const { audits, auditTemplates, franchises } = data;
    const [selectedAudit, setSelectedAudit] = useState<Audit | null>(null);
    const [isStartAuditModalOpen, setIsStartAuditModalOpen] = useState(false);
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);


    const getFranchiseName = (id: number) => franchises.find(f => f.id === id)?.name || 'N/A';
    const getTemplateTitle = (id: number) => auditTemplates.find(t => t.id === id)?.title || 'N/A';
    
    const selectedAuditTemplate = useMemo(() => {
        if (!selectedAudit) return null;
        return auditTemplates.find(t => t.id === selectedAudit.templateId) || null;
    }, [selectedAudit, auditTemplates]);

    return (
        <>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-3">
                        <ShieldCheckIcon className="w-8 h-8 text-primary"/>
                        <h2 className="text-2xl font-bold text-gray-800">Auditorias da Rede</h2>
                    </div>
                     <div className="flex space-x-2">
                        <button onClick={() => setIsTemplateModalOpen(true)} className="button-secondary">
                            <PlusIcon className="w-4 h-4 mr-2" />
                            Novo Modelo
                        </button>
                        <button onClick={() => setIsStartAuditModalOpen(true)} className="button-primary">
                            <PlusIcon className="w-4 h-4 mr-2" />
                            Iniciar Auditoria
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Franquia</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Modelo</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Pontuação</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {audits.map(audit => (
                                <tr key={audit.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{getFranchiseName(audit.franchiseId)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getTemplateTitle(audit.templateId)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(audit.createdAt).toLocaleDateString('pt-BR')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${audit.status === 'Concluído' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {audit.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-semibold text-gray-700">{audit.status === 'Concluído' ? `${audit.score}%` : '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => setSelectedAudit(audit)} className="text-primary hover:text-blue-700" disabled={audit.status === 'Pendente'}>
                                            {audit.status === 'Concluído' ? 'Ver Relatório' : 'Pendente'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <Modal isOpen={isStartAuditModalOpen} onClose={() => setIsStartAuditModalOpen(false)} title="Iniciar Nova Auditoria">
                <StartAuditForm
                    franchises={franchises}
                    templates={auditTemplates}
                    onSubmit={(franchiseId, templateId) => {
                        handlers.startNewAudit(franchiseId, templateId);
                        setIsStartAuditModalOpen(false);
                    }}
                    onClose={() => setIsStartAuditModalOpen(false)}
                />
            </Modal>
            
            <Modal isOpen={isTemplateModalOpen} onClose={() => setIsTemplateModalOpen(false)} title="Criar Novo Modelo de Auditoria">
                <AuditTemplateForm
                    onSubmit={(templateData) => {
                        handlers.addAuditTemplate(templateData);
                        setIsTemplateModalOpen(false);
                    }}
                    onClose={() => setIsTemplateModalOpen(false)}
                />
            </Modal>

            {selectedAudit && selectedAuditTemplate && (
                <AuditReportModal
                    isOpen={!!selectedAudit}
                    onClose={() => setSelectedAudit(null)}
                    audit={selectedAudit}
                    template={selectedAuditTemplate}
                    franchiseName={getFranchiseName(selectedAudit.franchiseId)}
                />
            )}
        </>
    );
};

export default FranchisorAuditsView;