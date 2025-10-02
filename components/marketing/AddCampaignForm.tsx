
import React, { useState } from 'react';
import { MarketingCampaign, CampaignMaterial, CampaignMaterialType } from '../../types';
import { PlusIcon, TrashIcon } from '../icons';

interface AddCampaignFormProps {
    onSubmit: (campaign: Omit<MarketingCampaign, 'id' | 'status'>) => void;
    onClose: () => void;
}

type MaterialInput = Omit<CampaignMaterial, 'id'>;

const AddCampaignForm: React.FC<AddCampaignFormProps> = ({ onSubmit, onClose }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [materials, setMaterials] = useState<MaterialInput[]>([
        { name: '', type: CampaignMaterialType.IMAGE, downloadUrl: '' }
    ]);

    const handleMaterialChange = (index: number, field: keyof MaterialInput, value: string) => {
        const newMaterials = [...materials];
        newMaterials[index] = { ...newMaterials[index], [field]: value };
        setMaterials(newMaterials);
    };

    const addMaterial = () => {
        setMaterials([...materials, { name: '', type: CampaignMaterialType.IMAGE, downloadUrl: '' }]);
    };

    const removeMaterial = (index: number) => {
        if (materials.length > 1) {
            setMaterials(materials.filter((_, i) => i !== index));
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !startDate || !endDate || materials.some(m => !m.name || !m.downloadUrl)) {
            alert("Preencha todos os campos obrigatórios, incluindo nome e URL de cada material.");
            return;
        }
        
        const campaignData = {
            title,
            description,
            startDate,
            endDate,
            materials: materials.map(m => ({ ...m, id: Math.random() })) // Add temp ID
        };

        onSubmit(campaignData);
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-h-[75vh] overflow-y-auto pr-2">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título da Campanha</label>
                <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full input-style" required />
            </div>
             <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição</label>
                <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="mt-1 block w-full input-style" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Data de Início</label>
                    <input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} className="mt-1 block w-full input-style" required />
                </div>
                 <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">Data de Fim</label>
                    <input type="date" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} className="mt-1 block w-full input-style" required />
                </div>
            </div>

            <div>
                <h3 className="text-md font-medium text-gray-900 border-b pb-2 mb-4">Materiais de Apoio</h3>
                <div className="space-y-4">
                    {materials.map((material, index) => (
                        <div key={index} className="p-3 bg-gray-50 border rounded-md grid grid-cols-12 gap-3 items-center">
                             <div className="col-span-12 md:col-span-4">
                                <label className="text-xs text-gray-600">Nome</label>
                                <input type="text" value={material.name} onChange={e => handleMaterialChange(index, 'name', e.target.value)} placeholder="Ex: Banner Instagram" className="w-full text-sm input-style" required />
                            </div>
                            <div className="col-span-12 md:col-span-3">
                                <label className="text-xs text-gray-600">Tipo</label>
                                <select value={material.type} onChange={e => handleMaterialChange(index, 'type', e.target.value)} className="w-full text-sm input-style">
                                    {Object.values(CampaignMaterialType).map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <div className="col-span-11 md:col-span-4">
                                <label className="text-xs text-gray-600">URL para Download</label>
                                <input type="url" value={material.downloadUrl} onChange={e => handleMaterialChange(index, 'downloadUrl', e.target.value)} placeholder="https://" className="w-full text-sm input-style" required />
                            </div>
                             <div className="col-span-1 flex items-end justify-end">
                                <button type="button" onClick={() => removeMaterial(index)} className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 disabled:opacity-50" disabled={materials.length <= 1}>
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                 <button type="button" onClick={addMaterial} className="mt-4 flex items-center text-sm font-medium text-primary hover:text-blue-800">
                    <PlusIcon className="w-4 h-4 mr-1" />
                    Adicionar Material
                </button>
            </div>
            
            <div className="flex justify-end pt-4 space-x-2 border-t mt-6">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-800">Salvar Campanha</button>
            </div>
            {/* FIX: Removed non-standard 'jsx' prop from style tag. */}
            <style>{`
                .input-style {
                    padding: 8px 12px;
                    background-color: white;
                    border: 1px solid #D1D5DB;
                    border-radius: 0.375rem;
                    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                }
                .input-style:focus {
                    outline: none;
                    border-color: #1E3A8A;
                    box-shadow: 0 0 0 2px rgba(30, 58, 138, 0.2);
                }
            `}</style>
        </form>
    );
};

export default AddCampaignForm;