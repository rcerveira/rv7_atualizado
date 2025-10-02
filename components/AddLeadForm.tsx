import React, { useState, useEffect } from 'react';
import { Lead, Client, Product, ClientType, FranchiseUser } from '../types';
import AddClientForm from './AddClientForm';

interface AddLeadFormProps {
    onSubmit: (
        leadData: Omit<Lead, 'id' | 'franchiseId' | 'createdAt' | 'status' | 'clientId'>,
        clientData: Omit<Client, 'id' | 'franchiseId' | 'cpfOrCnpj'>,
        existingClientId?: number
    ) => Promise<void>;
    onClose: () => void;
    clients: Client[];
    allowedProducts: Product[];
    franchiseUsers: FranchiseUser[];
    initialData?: { lead: Lead; client: Client };
}

const AddLeadForm: React.FC<AddLeadFormProps> = ({ onSubmit, onClose, clients, allowedProducts, franchiseUsers, initialData }) => {
    const [clientSelection, setClientSelection] = useState<'existing' | 'new'>(initialData ? 'existing' : 'new');
    const [existingClientId, setExistingClientId] = useState<number | undefined>(initialData?.client.id);
    const [serviceOfInterest, setServiceOfInterest] = useState(initialData?.lead.serviceOfInterest || '');
    const [source, setSource] = useState(initialData?.lead.source || '');
    const [negotiatedValue, setNegotiatedValue] = useState<number | ''>(initialData?.lead.negotiatedValue || '');
    const [salespersonId, setSalespersonId] = useState<number | undefined>(initialData?.lead.salespersonId);
    
    // FIX: Update state type and initial value to include `createdAt` to match what `setNewClientData` receives.
    const [newClientData, setNewClientData] = useState<Omit<Client, 'id' | 'franchiseId' | 'cpfOrCnpj'>>({
        name: '', phone: '', email: '', type: ClientType.PESSOA_FISICA, cpf: '', cnpj: '', razaoSocial: '',
        cep: '', logradouro: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '', createdAt: ''
    });

    useEffect(() => {
        if (initialData) {
            setExistingClientId(initialData.client.id);
            setClientSelection('existing');
            setServiceOfInterest(initialData.lead.serviceOfInterest);
            setSource(initialData.lead.source || '');
            setNegotiatedValue(initialData.lead.negotiatedValue || '');
            setSalespersonId(initialData.lead.salespersonId);
        }
    }, [initialData]);

    const handleClientFormSubmit = async (client: Omit<Client, 'id' | 'franchiseId' | 'cpfOrCnpj'> | Client) => {
        if ('id' in client) { // Editing existing client
            const clientDataToSubmit = { ...client };
            delete (clientDataToSubmit as any).id;
            delete (clientDataToSubmit as any).franchiseId;
            delete (clientDataToSubmit as any).cpfOrCnpj;
            
            const leadData = { serviceOfInterest, source, negotiatedValue: Number(negotiatedValue) || undefined, salespersonId: salespersonId ? Number(salespersonId) : undefined };
            await onSubmit(leadData, clientDataToSubmit, client.id);
            onClose(); // Close after submission
        } else { // Submitting new client data with lead
            setNewClientData(client);
            await handleSubmit(null, client);
        }
    };

    const handleSubmit = async (e?: React.FormEvent, clientFromChild?: Omit<Client, 'id'|'franchiseId'|'cpfOrCnpj'>) => {
        if(e) e.preventDefault();
        
        const leadData = { serviceOfInterest, source, negotiatedValue: Number(negotiatedValue) || undefined, salespersonId: salespersonId ? Number(salespersonId) : undefined };

        if (clientSelection === 'existing') {
            if (!existingClientId) {
                alert("Por favor, selecione um cliente existente.");
                return;
            }
            await onSubmit(leadData, {} as any, existingClientId);
        } else {
            const finalClientData = clientFromChild || newClientData;
            if(!finalClientData.name) {
                 alert("Por favor, preencha os dados do novo cliente.");
                return;
            }
            await onSubmit(leadData, finalClientData);
        }
        onClose();
    };
    
    if (initialData) {
         return (
             <div className="space-y-4">
                 <AddClientForm 
                    initialData={initialData.client} 
                    onSubmit={handleClientFormSubmit} 
                    onClose={onClose} 
                />
             </div>
         );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <h3 className="text-lg font-medium text-gray-900">Informações do Lead</h3>
                <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                    <div>
                        <label htmlFor="serviceOfInterest" className="block text-sm font-medium text-gray-700">Serviço de Interesse</label>
                        <select id="serviceOfInterest" value={serviceOfInterest} onChange={(e) => setServiceOfInterest(e.target.value)} required className="mt-1 block w-full input-style">
                            <option value="" disabled>Selecione um serviço</option>
                            {allowedProducts.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="source" className="block text-sm font-medium text-gray-700">Origem do Lead (Opcional)</label>
                        <input type="text" name="source" id="source" value={source} onChange={(e) => setSource(e.target.value)} className="mt-1 block w-full input-style" />
                    </div>
                    <div>
                        <label htmlFor="negotiatedValue" className="block text-sm font-medium text-gray-700">Valor Negociado (Opcional)</label>
                        <input type="number" name="negotiatedValue" id="negotiatedValue" value={negotiatedValue} onChange={(e) => setNegotiatedValue(e.target.value === '' ? '' : Number(e.target.value))} className="mt-1 block w-full input-style" placeholder="Ex: 50000" />
                    </div>
                     <div>
                        <label htmlFor="salespersonId" className="block text-sm font-medium text-gray-700">Responsável (Opcional)</label>
                        <select id="salespersonId" value={salespersonId} onChange={(e) => setSalespersonId(Number(e.target.value))} className="mt-1 block w-full input-style">
                            <option value="">Proprietário</option>
                            {franchiseUsers.map(user => (
                                <option key={user.id} value={user.id}>{user.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-medium text-gray-900">Informações do Cliente</h3>
                <div className="mt-2">
                    <div className="flex gap-2 rounded-lg p-1 bg-gray-200">
                        <button type="button" onClick={() => setClientSelection('new')} className={`flex-1 p-2 rounded-md text-sm font-semibold ${clientSelection === 'new' ? 'bg-white text-primary shadow' : 'text-gray-600'}`}>Novo Cliente</button>
                        <button type="button" onClick={() => setClientSelection('existing')} className={`flex-1 p-2 rounded-md text-sm font-semibold ${clientSelection === 'existing' ? 'bg-white text-primary shadow' : 'text-gray-600'}`}>Cliente Existente</button>
                    </div>
                </div>
            </div>

            {clientSelection === 'existing' ? (
                <div>
                    <label htmlFor="existingClientId" className="block text-sm font-medium text-gray-700">Selecione o Cliente</label>
                    <select id="existingClientId" value={existingClientId} onChange={(e) => setExistingClientId(Number(e.target.value))} required className="mt-1 block w-full input-style">
                        <option value="" disabled>Selecione...</option>
                        {clients.map(client => {
                            const doc = client.cpf || client.cnpj;
                            return (
                                <option key={client.id} value={client.id}>
                                    {client.name}{doc ? ` - ${doc}` : ''}
                                </option>
                            );
                        })}
                    </select>
                </div>
            ) : (
                <AddClientForm onSubmit={handleClientFormSubmit} onClose={onClose} />
            )}
            
            {clientSelection === 'existing' && (
                 <div className="flex justify-end pt-4 space-x-2 border-t mt-6">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancelar</button>
                    <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-800">Salvar Lead</button>
                </div>
            )}
            {/* FIX: Removed non-standard 'jsx' prop from style tag. */}
             <style>{`
                .input-style {
                    padding: 8px 12px;
                    background-color: white;
                    border: 1px solid #D1D5DB;
                    border-radius: 0.375rem;
                }
            `}</style>
        </form>
    );
};

export default AddLeadForm;