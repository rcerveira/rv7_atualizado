import React, { useState } from 'react';
import { Franchise } from '../types';
import { maskCNPJ, maskPhone } from '../utils/formatters';
import { SpinnerIcon } from './icons';

interface AddFranchiseFormProps {
  onAddFranchise: (franchise: Omit<Franchise, 'id' | 'allowedProductIds'>) => Promise<void>;
  onClose: () => void;
}

const AddFranchiseForm: React.FC<AddFranchiseFormProps> = ({ onAddFranchise, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        cnpj: '',
        corporateName: '',
        inaugurationDate: new Date().toISOString().split('T')[0],
        ownerName: '',
        ownerEmail: '',
        ownerPhone: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let finalValue = value;
        if (name === 'cnpj') finalValue = maskCNPJ(value);
        if (name === 'ownerPhone') finalValue = maskPhone(value);
        
        const upperCaseFields = ['name', 'corporateName', 'location', 'ownerName'];
        if (upperCaseFields.includes(name)) {
            finalValue = value.toUpperCase();
        }
        
        setFormData(prev => ({ ...prev, [name]: finalValue }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // The handler is a dummy function and won't throw Supabase errors.
        await onAddFranchise(formData);
        setIsSubmitting(false);
        // The parent component is responsible for closing the modal.
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <h3 className="text-lg font-medium text-text-primary">Detalhes da Franquia</h3>
                <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                    <div className="sm:col-span-2">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome da Franquia</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="input-style" />
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="corporateName" className="block text-sm font-medium text-gray-700">Razão Social</label>
                        <input type="text" name="corporateName" id="corporateName" value={formData.corporateName} onChange={handleChange} required className="input-style" />
                    </div>
                    <div>
                        <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700">CNPJ</label>
                        <input type="text" name="cnpj" id="cnpj" value={formData.cnpj} onChange={handleChange} required className="input-style" />
                    </div>
                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700">Localização (Cidade/UF)</label>
                        <input type="text" name="location" id="location" value={formData.location} onChange={handleChange} required className="input-style" />
                    </div>
                </div>
            </div>
            <div>
                <h3 className="text-lg font-medium text-text-primary">Detalhes do Proprietário</h3>
                <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                    <div className="sm:col-span-2">
                        <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700">Nome do Proprietário</label>
                        <input type="text" name="ownerName" id="ownerName" value={formData.ownerName} onChange={handleChange} required className="input-style" />
                    </div>
                    <div>
                        <label htmlFor="ownerEmail" className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" name="ownerEmail" id="ownerEmail" value={formData.ownerEmail} onChange={handleChange} required className="input-style" />
                    </div>
                    <div>
                        <label htmlFor="ownerPhone" className="block text-sm font-medium text-gray-700">Telefone</label>
                        <input type="tel" name="ownerPhone" id="ownerPhone" value={formData.ownerPhone} onChange={handleChange} required className="input-style" />
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4 space-x-2">
                <button type="button" onClick={onClose} className="button-secondary" disabled={isSubmitting}>Cancelar</button>
                <button type="submit" className="button-primary w-48" disabled={isSubmitting}>
                    {isSubmitting ? <SpinnerIcon className="w-5 h-5 animate-spin" /> : 'Adicionar Franquia'}
                </button>
            </div>
        </form>
    );
};

export default AddFranchiseForm;