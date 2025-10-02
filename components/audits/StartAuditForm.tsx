import React, { useState } from 'react';
import { Franchise, AuditTemplate } from '../../types';

interface StartAuditFormProps {
    franchises: Franchise[];
    templates: AuditTemplate[];
    onSubmit: (franchiseId: number, templateId: number) => void;
    onClose: () => void;
}

const StartAuditForm: React.FC<StartAuditFormProps> = ({ franchises, templates, onSubmit, onClose }) => {
    const [franchiseId, setFranchiseId] = useState<string>('');
    const [templateId, setTemplateId] = useState<string>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!franchiseId || !templateId) {
            alert("Selecione uma franquia e um modelo.");
            return;
        }
        onSubmit(Number(franchiseId), Number(templateId));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="franchiseId" className="block text-sm font-medium text-gray-700">Selecione a Franquia</label>
                <select
                    id="franchiseId"
                    value={franchiseId}
                    onChange={e => setFranchiseId(e.target.value)}
                    className="mt-1 block w-full input-style"
                    required
                >
                    <option value="" disabled>Escolha uma franquia...</option>
                    {franchises.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="templateId" className="block text-sm font-medium text-gray-700">Selecione o Modelo de Checklist</label>
                <select
                    id="templateId"
                    value={templateId}
                    onChange={e => setTemplateId(e.target.value)}
                    className="mt-1 block w-full input-style"
                    required
                >
                    <option value="" disabled>Escolha um modelo...</option>
                    {templates.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                </select>
            </div>
            <div className="flex justify-end pt-4 space-x-2 border-t mt-6">
                <button type="button" onClick={onClose} className="button-secondary">Cancelar</button>
                <button type="submit" className="button-primary">Iniciar Auditoria</button>
            </div>
        </form>
    );
};

export default StartAuditForm;