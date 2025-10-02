import React, { useState, useEffect } from 'react';
import { Audit, AuditTemplate, AuditItemStatus, AuditResult } from '../../types';
import { useData } from '../../hooks/useData';
import { ArrowLeftIcon } from '../icons';

interface PerformAuditViewProps {
    audit: Audit;
    template: AuditTemplate;
    onBack: () => void;
}

const PerformAuditView: React.FC<PerformAuditViewProps> = ({ audit, template, onBack }) => {
    const { handlers } = useData();
    const [results, setResults] = useState<AuditResult[]>([]);

    useEffect(() => {
        // Initialize results state from the audit prop
        const initialResults = template.items.map(item => {
            const existingResult = audit.results.find(r => r.templateItemId === item.id);
            return existingResult || { templateItemId: item.id, status: null, comment: '' };
        });
        setResults(initialResults);
    }, [audit, template]);

    const handleStatusChange = (itemId: number, status: AuditItemStatus) => {
        setResults(prev => prev.map(r => r.templateItemId === itemId ? { ...r, status } : r));
    };

    const handleCommentChange = (itemId: number, comment: string) => {
        setResults(prev => prev.map(r => r.templateItemId === itemId ? { ...r, comment } : r));
    };

    const handleSubmit = () => {
        const isAllAnswered = results.every(r => r.status !== null);
        if (!isAllAnswered) {
            alert('Por favor, responda a todos os itens do checklist.');
            return;
        }
        handlers.submitAudit(audit.id, results);
        onBack();
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <button onClick={onBack} className="flex items-center text-sm font-medium text-primary hover:text-blue-800 mb-4">
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Voltar para Auditorias
            </button>
            <h2 className="text-2xl font-bold text-gray-800">{template.title}</h2>
            <p className="text-gray-600 mt-1 mb-6">{template.description}</p>

            <div className="space-y-6">
                {template.items.map((item, index) => {
                    const result = results.find(r => r.templateItemId === item.id);
                    return (
                        <div key={item.id} className="p-4 border rounded-lg bg-gray-50/50">
                            <p className="font-medium text-gray-800">{index + 1}. {item.text}</p>
                            <div className="mt-3 flex flex-wrap gap-4">
                                {(Object.values(AuditItemStatus) as AuditItemStatus[]).map(status => (
                                    <label key={status} className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name={`status-${item.id}`}
                                            checked={result?.status === status}
                                            onChange={() => handleStatusChange(item.id, status)}
                                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                                        />
                                        <span className="text-sm">{status}</span>
                                    </label>
                                ))}
                            </div>
                            {result?.status === AuditItemStatus.NON_COMPLIANT && (
                                <div className="mt-3">
                                    <textarea
                                        value={result.comment}
                                        onChange={(e) => handleCommentChange(item.id, e.target.value)}
                                        rows={2}
                                        placeholder="Adicionar comentário ou plano de ação..."
                                        className="w-full text-sm p-2 bg-white border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            <div className="mt-8 flex justify-end">
                <button onClick={handleSubmit} className="button-primary px-8 py-3">
                    Enviar Checklist
                </button>
            </div>
        </div>
    );
};

export default PerformAuditView;