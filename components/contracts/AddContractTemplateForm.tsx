import React, { useState, useEffect } from 'react';
import { ContractTemplate, Product } from '../../types';

interface AddContractTemplateFormProps {
    onSubmit: (templateData: Omit<ContractTemplate, 'id'> | ContractTemplate) => void;
    onClose: () => void;
    initialData?: ContractTemplate | null;
    products: Product[];
}

const availablePlaceholders = [
    '{{CLIENT_NAME}}', '{{CLIENT_CPF_CNPJ}}', '{{CLIENT_ADDRESS}}',
    '{{SALE_DATE}}', '{{SALE_TOTAL}}', '{{SALE_ITEMS}}'
];

const AddContractTemplateForm: React.FC<AddContractTemplateFormProps> = ({ onSubmit, onClose, initialData, products }) => {
    const [title, setTitle] = useState('');
    const [productId, setProductId] = useState<number>(0);
    const [body, setBody] = useState('');
    const [isActive, setIsActive] = useState(true);

    const isEditing = !!initialData;

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setProductId(initialData.productId);
            setBody(initialData.body);
            setIsActive(initialData.isActive);
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !body || !productId) {
            alert("Título, corpo e produto vinculado são obrigatórios.");
            return;
        }
        
        const templateData = { title, productId: Number(productId), body, isActive };
        if (isEditing) {
            onSubmit({ ...templateData, id: initialData!.id });
        } else {
            onSubmit(templateData);
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título do Modelo</label>
                    <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full input-style" required />
                </div>
                 <div>
                    <label htmlFor="productId" className="block text-sm font-medium text-gray-700">Vincular ao Produto/Serviço</label>
                    <select id="productId" value={productId} onChange={e => setProductId(Number(e.target.value))} className="mt-1 block w-full input-style" required>
                        <option value={0} disabled>Selecione...</option>
                        {products.filter(p => p.isActive).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                </div>
            </div>
            <div>
                 <label htmlFor="body" className="block text-sm font-medium text-gray-700">Corpo do Contrato</label>
                <textarea
                    id="body"
                    value={body}
                    onChange={e => setBody(e.target.value)}
                    rows={12}
                    className="mt-1 block w-full input-style font-mono text-sm"
                    placeholder="Cole ou digite o texto do contrato aqui. Use os placeholders abaixo para inserir dados dinâmicos."
                    required
                />
            </div>
             <div className="p-3 bg-gray-50 border rounded-md">
                <p className="text-sm font-semibold text-gray-700">Placeholders Disponíveis:</p>
                <div className="flex flex-wrap gap-2 mt-2">
                    {availablePlaceholders.map(tag => (
                        <code key={tag} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{tag}</code>
                    ))}
                </div>
            </div>
             <div className="flex items-center">
                <input id="isActive" type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"/>
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">Modelo Ativo</label>
            </div>
            <div className="flex justify-end pt-4 space-x-2 border-t mt-6">
                <button type="button" onClick={onClose} className="button-secondary">Cancelar</button>
                <button type="submit" className="button-primary">{isEditing ? 'Salvar Alterações' : 'Criar Modelo'}</button>
            </div>
        </form>
    );
};

export default AddContractTemplateForm;
