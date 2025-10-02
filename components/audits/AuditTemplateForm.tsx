import React, { useState } from 'react';
import { AuditTemplate } from '../../types';
import { PlusIcon, TrashIcon } from '../icons';

interface AuditTemplateFormProps {
    onSubmit: (templateData: Omit<AuditTemplate, 'id'>) => void;
    onClose: () => void;
}

const AuditTemplateForm: React.FC<AuditTemplateFormProps> = ({ onSubmit, onClose }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [items, setItems] = useState<string[]>(['']);

    const handleItemChange = (index: number, value: string) => {
        const newItems = [...items];
        newItems[index] = value;
        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, '']);
    };

    const removeItem = (index: number) => {
        if (items.length > 1) {
            setItems(items.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || items.some(item => !item.trim())) {
            alert("Título e todos os itens do checklist são obrigatórios.");
            return;
        }
        onSubmit({
            title,
            description,
            items: items.map((text, index) => ({ id: index + 1, text }))
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-h-[75vh] overflow-y-auto pr-2">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título do Modelo</label>
                <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full input-style" required />
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição</label>
                <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={2} className="mt-1 block w-full input-style" />
            </div>

            <div>
                <h3 className="text-md font-medium text-gray-900 mb-2">Itens do Checklist</h3>
                <div className="space-y-3">
                    {items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={item}
                                onChange={e => handleItemChange(index, e.target.value)}
                                className="flex-1 input-style"
                                placeholder={`Item ${index + 1}`}
                                required
                            />
                            <button type="button" onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 disabled:opacity-50" disabled={items.length <= 1}>
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>
                <button type="button" onClick={addItem} className="mt-3 flex items-center text-sm font-medium text-primary hover:text-blue-800">
                    <PlusIcon className="w-4 h-4 mr-1" />
                    Adicionar Item
                </button>
            </div>

            <div className="flex justify-end pt-4 space-x-2 border-t mt-6">
                <button type="button" onClick={onClose} className="button-secondary">Cancelar</button>
                <button type="submit" className="button-primary">Salvar Modelo</button>
            </div>
        </form>
    );
};

export default AuditTemplateForm;