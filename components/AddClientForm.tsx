import React, { useState, useEffect } from 'react';
import { Client, ClientType } from '../types';
import { SpinnerIcon, BuildingOfficeIcon, UserCircleIcon } from './icons';
import { maskCPF, maskCNPJ, maskPhone } from '../utils/formatters';

interface AddClientFormProps {
  onSubmit: (client: Omit<Client, 'id' | 'franchiseId' | 'cpfOrCnpj'> | Client) => Promise<void>;
  onClose: () => void;
  initialData?: Client | null;
}

const initialFormData = {
    name: '',
    phone: '',
    email: '',
    cpf: '',
    cnpj: '',
    razaoSocial: '',
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
};

const AddClientForm: React.FC<AddClientFormProps> = ({ onSubmit, onClose, initialData }) => {
    const [clientType, setClientType] = useState<ClientType>(ClientType.PESSOA_FISICA);
    const [formData, setFormData] = useState(initialFormData);
    const [cnpjLoading, setCnpjLoading] = useState(false);
    const [cepLoading, setCepLoading] = useState(false);
    const [cnpjError, setCnpjError] = useState('');
    const [cepError, setCepError] = useState('');

    const isEditing = !!initialData;

    useEffect(() => {
        if (initialData) {
            setClientType(initialData.type);
            setFormData({
                name: initialData.name || '',
                phone: initialData.phone || '',
                email: initialData.email || '',
                cpf: initialData.cpf || '',
                cnpj: initialData.cnpj || '',
                razaoSocial: initialData.razaoSocial || '',
                cep: initialData.cep || '',
                logradouro: initialData.logradouro || '',
                numero: initialData.numero || '',
                complemento: initialData.complemento || '',
                bairro: initialData.bairro || '',
                cidade: initialData.cidade || '',
                estado: initialData.estado || '',
            });
        } else {
            setClientType(ClientType.PESSOA_FISICA);
            setFormData(initialFormData);
        }
    }, [initialData]);

    useEffect(() => {
        // Reset form when type changes, but only if not editing
        if (!isEditing) {
            setFormData(initialFormData);
            setCnpjError('');
            setCepError('');
        }
    }, [clientType, isEditing]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let { name, value } = e.target;
        
        // Apply masks first
        if (name === 'cpf') value = maskCPF(value);
        if (name === 'cnpj') value = maskCNPJ(value);
        if (name === 'phone') value = maskPhone(value);

        // Apply uppercase for standardization
        const upperCaseFields = ['name', 'razaoSocial', 'logradouro', 'bairro', 'cidade', 'estado', 'complemento'];
        if (upperCaseFields.includes(name)) {
            value = value.toUpperCase();
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCepBlur = async () => {
        const cep = formData.cep.replace(/\D/g, '');
        if (cep.length !== 8) {
            setCepError('CEP inválido.');
            return;
        }
        setCepLoading(true);
        setCepError('');
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            if (!response.ok) throw new Error('CEP não encontrado');
            const data = await response.json();
            if (data.erro) throw new Error('CEP não encontrado');
            setFormData(prev => ({
                ...prev,
                logradouro: data.logradouro.toUpperCase(),
                bairro: data.bairro.toUpperCase(),
                cidade: data.localidade.toUpperCase(),
                estado: data.uf.toUpperCase(),
            }));
        } catch (error) {
            setCepError((error as Error).message);
        } finally {
            setCepLoading(false);
        }
    };
    
    const handleCnpjBlur = async () => {
        const cnpj = formData.cnpj.replace(/\D/g, '');
        if (cnpj.length !== 14) {
            setCnpjError('CNPJ inválido.');
            return;
        }
        setCnpjLoading(true);
        setCnpjError('');
        try {
            const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
            if (!response.ok) throw new Error('CNPJ não encontrado ou inválido.');
            const data = await response.json();
            setFormData(prev => ({
                ...prev,
                name: (data.nome_fantasia || '').toUpperCase(),
                razaoSocial: (data.razao_social || '').toUpperCase(),
                cep: data.cep || '',
                logradouro: (data.logradouro || '').toUpperCase(),
                numero: data.numero || '',
                bairro: (data.bairro || '').toUpperCase(),
                cidade: (data.municipio || '').toUpperCase(),
                estado: (data.uf || '').toUpperCase(),
            }));
        } catch (error) {
            setCnpjError((error as Error).message);
        } finally {
            setCnpjLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { name, phone, email, ...rest } = formData;
        if (!name || (!phone && !email)) {
            alert("Nome e ao menos um contato (telefone ou email) são obrigatórios.");
            return;
        }

        const baseClientData = {
            name,
            phone,
            email,
            type: clientType,
            ...rest
        };

        if (isEditing) {
            await onSubmit({
                ...initialData,
                ...baseClientData,
                cpfOrCnpj: (baseClientData.type === ClientType.PESSOA_FISICA ? baseClientData.cpf : baseClientData.cnpj) || ''
            });
        } else {
            await onSubmit({
                ...baseClientData,
                createdAt: new Date().toISOString(),
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-h-[75vh] overflow-y-auto pr-3">
            {/* Client Type Selector */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Cliente</label>
                <div className="flex gap-2 rounded-lg p-1 bg-gray-200">
                    <button type="button" onClick={() => setClientType(ClientType.PESSOA_FISICA)} className={`flex-1 p-2 rounded-md text-sm font-semibold flex items-center justify-center gap-2 ${clientType === ClientType.PESSOA_FISICA ? 'bg-white text-primary shadow' : 'text-gray-600'}`}>
                        <UserCircleIcon className="w-5 h-5" /> Pessoa Física
                    </button>
                    <button type="button" onClick={() => setClientType(ClientType.PESSOA_JURIDICA)} className={`flex-1 p-2 rounded-md text-sm font-semibold flex items-center justify-center gap-2 ${clientType === ClientType.PESSOA_JURIDICA ? 'bg-white text-primary shadow' : 'text-gray-600'}`}>
                        <BuildingOfficeIcon className="w-5 h-5" /> Pessoa Jurídica
                    </button>
                </div>
            </div>

            {/* Fields based on type */}
            {clientType === ClientType.PESSOA_JURIDICA && (
                <div className="space-y-4 p-4 border rounded-lg bg-gray-50/50">
                    <h3 className="font-semibold text-gray-800">Dados da Empresa</h3>
                    <div className="relative">
                        <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700">CNPJ</label>
                        <input type="text" name="cnpj" value={formData.cnpj} onChange={handleInputChange} onBlur={handleCnpjBlur} className="mt-1 block w-full input-style" placeholder="00.000.000/0001-00" />
                        {cnpjLoading && <SpinnerIcon className="absolute right-3 top-8 w-5 h-5 text-primary" />}
                    </div>
                     {cnpjError && <p className="text-xs text-red-600">{cnpjError}</p>}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="razaoSocial" className="block text-sm font-medium text-gray-700">Razão Social</label>
                            <input type="text" name="razaoSocial" value={formData.razaoSocial} onChange={handleInputChange} className="mt-1 block w-full input-style" />
                        </div>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome Fantasia</label>
                            <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="mt-1 block w-full input-style" required />
                        </div>
                    </div>
                </div>
            )}

            {clientType === ClientType.PESSOA_FISICA && (
                <div className="space-y-4 p-4 border rounded-lg bg-gray-50/50">
                    <h3 className="font-semibold text-gray-800">Dados Pessoais</h3>
                    <div>
                        <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">CPF</label>
                        <input type="text" name="cpf" value={formData.cpf} onChange={handleInputChange} className="mt-1 block w-full input-style" placeholder="000.000.000-00" />
                    </div>
                     <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome Completo</label>
                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="mt-1 block w-full input-style" required />
                    </div>
                </div>
            )}

            {/* Contact Info */}
             <div className="space-y-4">
                 <h3 className="font-semibold text-gray-800">Informações de Contato</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Telefone</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="mt-1 block w-full input-style" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="mt-1 block w-full input-style" />
                    </div>
                 </div>
            </div>

            {/* Address */}
             <div className="space-y-4">
                 <h3 className="font-semibold text-gray-800">Endereço</h3>
                 <div className="relative">
                    <label htmlFor="cep" className="block text-sm font-medium text-gray-700">CEP</label>
                    <input type="text" name="cep" value={formData.cep} onChange={handleInputChange} onBlur={handleCepBlur} className="mt-1 block w-full input-style" placeholder="00000-000" />
                    {cepLoading && <SpinnerIcon className="absolute right-3 top-8 w-5 h-5 text-primary" />}
                 </div>
                 {cepError && <p className="text-xs text-red-600">{cepError}</p>}
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div className="md:col-span-3">
                        <label htmlFor="logradouro" className="block text-sm font-medium text-gray-700">Logradouro</label>
                        <input type="text" name="logradouro" value={formData.logradouro} onChange={handleInputChange} className="mt-1 block w-full input-style" />
                     </div>
                     <div>
                        <label htmlFor="numero" className="block text-sm font-medium text-gray-700">Número</label>
                        <input type="text" name="numero" value={formData.numero} onChange={handleInputChange} className="mt-1 block w-full input-style" />
                     </div>
                     <div className="md:col-span-2">
                         <label htmlFor="complemento" className="block text-sm font-medium text-gray-700">Complemento</label>
                        <input type="text" name="complemento" value={formData.complemento} onChange={handleInputChange} className="mt-1 block w-full input-style" />
                     </div>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div>
                        <label htmlFor="bairro" className="block text-sm font-medium text-gray-700">Bairro</label>
                        <input type="text" name="bairro" value={formData.bairro} onChange={handleInputChange} className="mt-1 block w-full input-style" />
                     </div>
                      <div>
                        <label htmlFor="cidade" className="block text-sm font-medium text-gray-700">Cidade</label>
                        <input type="text" name="cidade" value={formData.cidade} onChange={handleInputChange} className="mt-1 block w-full input-style" />
                     </div>
                      <div>
                        <label htmlFor="estado" className="block text-sm font-medium text-gray-700">Estado</label>
                        <input type="text" name="estado" value={formData.estado} onChange={handleInputChange} className="mt-1 block w-full input-style" />
                     </div>
                 </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end pt-4 space-x-2 border-t mt-6">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                    Cancelar
                </button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-800">
                    {isEditing ? 'Salvar Alterações' : 'Salvar Cliente'}
                </button>
            </div>
            {/* FIX: Removed non-standard 'jsx' prop from style tag. */}
             <style>{`
                .input-style {
                    padding: 8px 12px;
                    background-color: white;
                    border: 1px solid #D1D5DB;
                    border-radius: 0.375rem;
                    transition: border-color 0.15s ease-in-out;
                    color: #1f2937;
                }
                .input-style:focus {
                    outline: none;
                    border-color: #1E3A8A;
                }
                .input-style:read-only {
                    cursor: not-allowed;
                }
            `}</style>
        </form>
    );
};

export default AddClientForm;