import React, { useState, useEffect } from 'react';
import { Product } from '../types';

interface AddProductFormProps {
    onSubmit: (product: Omit<Product, 'id'> | Product) => void;
    onClose: () => void;
    initialData?: Product | null;
}

const AddProductForm: React.FC<AddProductFormProps> = ({ onSubmit, onClose, initialData }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setDescription(initialData.description);
            setIsActive(initialData.isActive);
        } else {
            setName('');
            setDescription('');
            setIsActive(true);
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !description) {
            alert("Nome e descrição são obrigatórios.");
            return;
        }
        
        const productData = { name, description, isActive };
        if (initialData) {
            onSubmit({ ...productData, id: initialData.id });
        } else {
            onSubmit(productData);
        }
    };

    const isEditing = !!initialData;

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome do Produto/Serviço</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    required
                />
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição</label>
                <textarea
                    id="description"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    required
                />
            </div>
             <div className="flex items-start">
                <div className="flex items-center h-5">
                <input
                    id="isActive"
                    name="isActive"
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                />
                </div>
                <div className="ml-3 text-sm">
                <label htmlFor="isActive" className="font-medium text-gray-700">Ativo</label>
                <p className="text-gray-500">Produtos inativos não aparecerão como opção para novos leads.</p>
                </div>
            </div>
            <div className="flex justify-end pt-4 space-x-2">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                    Cancelar
                </button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-800">
                    {isEditing ? 'Salvar Alterações' : 'Salvar Produto'}
                </button>
            </div>
        </form>
    );
};

export default AddProductForm;