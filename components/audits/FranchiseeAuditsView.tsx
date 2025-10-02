import React, { useState, useMemo } from 'react';
import { useData } from '../../hooks/useData';
import { Audit } from '../../types';
import AuditReportModal from './AuditReportModal';
import PerformAuditView from './PerformAuditView';
import { ShieldCheckIcon } from '../icons';

const FranchiseeAuditsView: React.FC = () => {
    const { selectedFranchiseData, data } = useData();
    const [selectedCompletedAudit, setSelectedCompletedAudit] = useState<Audit | null>(null);
    const [performingAudit, setPerformingAudit] = useState<Audit | null>(null);

    if (!selectedFranchiseData) return null;

    const { franchise, audits } = selectedFranchiseData;
    const { auditTemplates } = data;
    
    const getTemplateTitle = (id: number) => auditTemplates.find(t => t.id === id)?.title || 'N/A';
    
    const selectedAuditTemplate = useMemo(() => {
        const audit = selectedCompletedAudit || performingAudit;
        if (!audit) return null;
        return auditTemplates.find(t => t.id === audit.templateId) || null;
    }, [selectedCompletedAudit, performingAudit, auditTemplates]);

    const { pendingAudits, completedAudits } = useMemo(() => {
        const pending = audits.filter((a: Audit) => a.status === 'Pendente').sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        const completed = audits.filter((a: Audit) => a.status === 'Concluído').sort((a,b) => new Date(b.auditDate).getTime() - new Date(a.auditDate).getTime());
        return { pendingAudits: pending, completedAudits: completed };
    }, [audits]);

    if (performingAudit && selectedAuditTemplate) {
        return <PerformAuditView 
            audit={performingAudit}
            template={selectedAuditTemplate}
            onBack={() => setPerformingAudit(null)}
        />
    }

    return (
        <>
            <div className="space-y-8">
                 <div className="flex items-center space-x-3">
                    <ShieldCheckIcon className="w-8 h-8 text-primary"/>
                    <h2 className="text-2xl font-bold text-gray-800">Minhas Auditorias e Checklists</h2>
                </div>

                {/* Pending Audits */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Checklists Pendentes</h3>
                    {pendingAudits.length > 0 ? (
                        <div className="space-y-3">
                            {pendingAudits.map((audit: Audit) => (
                                <div key={audit.id} className="p-4 border rounded-lg bg-yellow-50 border-yellow-200 flex justify-between items-center">
                                    <div>
                                        <p className="font-bold text-yellow-800">{getTemplateTitle(audit.templateId)}</p>
                                        <p className="text-sm text-yellow-700">Iniciada em: {new Date(audit.createdAt).toLocaleDateString('pt-BR')}</p>
                                    </div>
                                    <button onClick={() => setPerformingAudit(audit)} className="button-primary text-sm">
                                        Preencher Checklist
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                         <p className="text-center py-4 text-gray-500">Nenhum checklist pendente.</p>
                    )}
                </div>

                {/* Completed Audits */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Histórico de Auditorias Concluídas</h3>
                     <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Modelo</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Auditor</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Pontuação</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {completedAudits.map((audit: Audit) => (
                                    <tr key={audit.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{getTemplateTitle(audit.templateId)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(audit.auditDate).toLocaleDateString('pt-BR')}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{audit.auditorName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-semibold text-gray-700">{audit.score}%</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => setSelectedCompletedAudit(audit)} className="text-primary hover:text-blue-700">
                                                Ver Relatório
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                     {completedAudits.length === 0 && (
                        <p className="text-center py-8 text-gray-500">Nenhuma auditoria concluída ainda.</p>
                    )}
                </div>
            </div>

            {selectedCompletedAudit && selectedAuditTemplate && (
                <AuditReportModal
                    isOpen={!!selectedCompletedAudit}
                    onClose={() => setSelectedCompletedAudit(null)}
                    audit={selectedCompletedAudit}
                    template={selectedAuditTemplate}
                    franchiseName={franchise.name}
                />
            )}
        </>
    );
};

export default FranchiseeAuditsView;