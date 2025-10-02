import React from 'react';
import Modal from '../Modal';
import { Audit, AuditTemplate, AuditItemStatus } from '../../types';

interface AuditReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    audit: Audit;
    template: AuditTemplate;
    franchiseName: string;
}

const getStatusClasses = (status: AuditItemStatus) => {
    switch (status) {
        case AuditItemStatus.COMPLIANT:
            return {
                badge: 'bg-green-100 text-green-800',
                row: 'bg-green-50/50',
            };
        case AuditItemStatus.NON_COMPLIANT:
            return {
                badge: 'bg-red-100 text-red-800',
                row: 'bg-red-50/50',
            };
        default:
             return {
                badge: 'bg-gray-100 text-gray-800',
                row: '',
            };
    }
};

const ScoreRing: React.FC<{ score: number }> = ({ score }) => {
    const getStrokeColor = () => {
        if (score >= 80) return 'stroke-green-500';
        if (score >= 50) return 'stroke-yellow-500';
        return 'stroke-red-500';
    };
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="relative h-28 w-28">
            <svg className="h-full w-full" viewBox="0 0 100 100">
                <circle
                    className="stroke-current text-gray-200"
                    strokeWidth="10"
                    cx="50"
                    cy="50"
                    r="45"
                    fill="transparent"
                />
                <circle
                    className={`stroke-current ${getStrokeColor()}`}
                    strokeWidth="10"
                    strokeLinecap="round"
                    cx="50"
                    cy="50"
                    r="45"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    transform="rotate(-90 50 50)"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-3xl font-bold ${getStrokeColor().replace('stroke', 'text')}`}>{score}</span>
            </div>
        </div>
    );
};

const AuditReportModal: React.FC<AuditReportModalProps> = ({ isOpen, onClose, audit, template, franchiseName }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Relatório de Auditoria: ${template.title}`}>
            <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-2">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-50 rounded-lg border">
                    <div className="mb-4 sm:mb-0">
                        <h4 className="text-lg font-bold text-gray-800">{franchiseName}</h4>
                        <p className="text-sm text-gray-500">Auditor: {audit.auditorName}</p>
                        <p className="text-sm text-gray-500">Data: {new Date(audit.auditDate).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <ScoreRing score={audit.score} />
                        <p className="text-sm font-semibold text-gray-600 mt-2">Pontuação Final</p>
                    </div>
                </div>

                {/* Items List */}
                <div className="space-y-3">
                    {template.items.map(item => {
                        const result = audit.results.find(r => r.templateItemId === item.id);
                        if (!result) return null;

                        const { badge, row } = getStatusClasses(result.status);

                        return (
                            <div key={item.id} className={`p-4 border rounded-md ${row}`}>
                                <div className="flex justify-between items-start">
                                    <p className="text-sm font-medium text-gray-800 flex-1 pr-4">{item.text}</p>
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${badge}`}>
                                        {result.status}
                                    </span>
                                </div>
                                {result.comment && (
                                    <div className="mt-2 pl-4 border-l-2 border-yellow-400">
                                        <p className="text-sm text-gray-700 italic">"{result.comment}"</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
                 <div className="flex justify-end pt-4 border-t">
                    <button onClick={onClose} className="px-6 py-2 bg-primary text-white font-semibold rounded-md shadow-sm hover:bg-blue-800">
                        Fechar
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default AuditReportModal;
