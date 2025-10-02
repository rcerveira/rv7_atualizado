import React, { useState, useMemo } from 'react';
import { useData } from '../../hooks/useData';
import { MarketingCampaign, MarketingCampaignStatus } from '../../types';
import Modal from '../Modal';
import ConfirmationModal from '../ConfirmationModal';
import AddCampaignForm from './AddCampaignForm';
import { PhotoIcon, PlusIcon, TrashIcon } from '../icons';

const statusColorMap: Record<MarketingCampaignStatus, string> = {
    [MarketingCampaignStatus.ACTIVE]: 'bg-green-100 text-green-800',
    [MarketingCampaignStatus.SCHEDULED]: 'bg-blue-100 text-blue-800',
    [MarketingCampaignStatus.ARCHIVED]: 'bg-gray-100 text-gray-800',
};

const FranchisorMarketingView: React.FC = () => {
    const { data, handlers } = useData();
    const { marketingCampaigns } = data;
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [campaignToDelete, setCampaignToDelete] = useState<MarketingCampaign | null>(null);

    const sortedCampaigns = useMemo(() => {
        return [...marketingCampaigns].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
    }, [marketingCampaigns]);
    
    const handleAddCampaign = (campaignData: Omit<MarketingCampaign, 'id' | 'status'>) => {
        const now = new Date();
        const startDate = new Date(campaignData.startDate);
        const status = startDate > now ? MarketingCampaignStatus.SCHEDULED : MarketingCampaignStatus.ACTIVE;
        handlers.addMarketingCampaign({ ...campaignData, status });
    };

    const handleConfirmDelete = () => {
        if (campaignToDelete) {
            handlers.deleteMarketingCampaign(campaignToDelete.id);
            setCampaignToDelete(null);
        }
    };

    return (
        <>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-3">
                        <PhotoIcon className="w-8 h-8 text-primary"/>
                        <h2 className="text-2xl font-bold text-gray-800">Gestão de Campanhas</h2>
                    </div>
                     <button onClick={() => setIsAddModalOpen(true)} className="flex items-center justify-center bg-primary hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105">
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Nova Campanha
                    </button>
                </div>

                 <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Campanha</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Período</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Materiais</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sortedCampaigns.map((campaign) => (
                                <tr key={campaign.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{campaign.title}</div>
                                        <div className="text-sm text-gray-500 max-w-xs truncate">{campaign.description}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(campaign.startDate).toLocaleDateString('pt-BR')} - {new Date(campaign.endDate).toLocaleDateString('pt-BR')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{campaign.materials.length}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColorMap[campaign.status]}`}>
                                            {campaign.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => setCampaignToDelete(campaign)} className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100">
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Criar Nova Campanha de Marketing">
                <AddCampaignForm onSubmit={handleAddCampaign} onClose={() => setIsAddModalOpen(false)} />
            </Modal>
            
            <ConfirmationModal
                isOpen={!!campaignToDelete}
                onClose={() => setCampaignToDelete(null)}
                onConfirm={handleConfirmDelete}
                title="Confirmar Exclusão"
                message={`Tem certeza que deseja excluir a campanha "${campaignToDelete?.title}"?`}
            />
        </>
    );
};

export default FranchisorMarketingView;