import React, { useState, useEffect } from 'react';
import { FranchiseeLead } from '../types';
import { maskPhone } from '../utils/formatters';

interface FranchiseeLeadFormProps {
  onSubmit: (leadData: Omit<FranchiseeLead, 'id' | 'createdAt' | 'status' | 'documents' | 'internalNotes'> | FranchiseeLead) => void;
  onClose: () => void;
  initialData?: FranchiseeLead | null;
}

const FranchiseeLeadForm: React.FC<FranchiseeLeadFormProps> = ({ onSubmit, onClose, initialData }) => {
    const [candidateName, setCandidateName] = useState('');
    const [candidateEmail, setCandidateEmail] = useState('');
    const [candidatePhone, setCandidatePhone] = useState('');
    const [cityOfInterest, setCityOfInterest] = useState('');
    const [investmentCapital, setInvestmentCapital] = useState<number | ''>('');

    const isEditing = !!initialData;

    useEffect(() => {
        if (isEditing && initialData) {
            setCandidateName(initialData.candidateName);
            setCandidateEmail(initialData.candidateEmail);
            setCandidatePhone(initialData.candidatePhone);
            setCityOfInterest(initialData.cityOfInterest);
            setInvestmentCapital(initialData.investmentCapital);
        }
    }, [initialData, isEditing]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!candidateName || !candidateEmail || !cityOfInterest || !investmentCapital || investmentCapital <= 0) {
            alert("Todos os campos são obrigatórios e o capital de investimento deve ser um valor positivo.");
            return;
        }

        const numericCapital = Number(investmentCapital);

        if (isEditing && initialData) {
            onSubmit({
                ...initialData,
                candidateName,
                candidateEmail,
                candidatePhone,
                cityOfInterest,
                investmentCapital: numericCapital,
            });
        } else {
            onSubmit({
                candidateName,
                candidateEmail,
                candidatePhone,
                cityOfInterest,
                investmentCapital: numericCapital,
            });
        }
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="candidateName" className="block text-sm font-medium text-gray-700">Nome do Candidato</label>
                <input
                    type="text"
                    id="candidateName"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value.toUpperCase())}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-text-primary"
                    required
                />
            </div>
             <div>
                <label htmlFor="candidateEmail" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                    type="email"
                    id="candidateEmail"
                    value={candidateEmail}
                    onChange={(e) => setCandidateEmail(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-text-primary"
                    required
                />
            </div>
             <div>
                <label htmlFor="candidatePhone" className="block text-sm font-medium text-gray-700">Telefone</label>
                <input
                    type="tel"
                    id="candidatePhone"
                    value={candidatePhone}
                    onChange={(e) => setCandidatePhone(maskPhone(e.target.value))}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-text-primary"
                    required
                />
            </div>
             <div>
                <label htmlFor="cityOfInterest" className="block text-sm font-medium text-gray-700">Cidade de Interesse</label>
                <input
                    type="text"
                    id="cityOfInterest"
                    value={cityOfInterest}
                    onChange={(e) => setCityOfInterest(e.target.value.toUpperCase())}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-text-primary"
                    required
                />
            </div>
             <div>
                <label htmlFor="investmentCapital" className="block text-sm font-medium text-gray-700">Capital de Investimento (R$)</label>
                <input
                    type="number"
                    id="investmentCapital"
                    value={investmentCapital}
                    onChange={(e) => setInvestmentCapital(e.target.value === '' ? '' : Number(e.target.value))}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-text-primary"
                    required
                />
            </div>
            <div className="flex justify-end pt-4 space-x-2 border-t mt-6">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                    Cancelar
                </button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-800">
                    {isEditing ? 'Salvar Alterações' : 'Adicionar Candidato'}
                </button>
            </div>
        </form>
    );
};

export default FranchiseeLeadForm;