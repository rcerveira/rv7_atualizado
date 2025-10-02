import React, { useMemo } from 'react';
import { useData } from '../../hooks/useData';
import { MarketingCampaign, MarketingCampaignStatus, CampaignMaterialType } from '../../types';
import { PhotoIcon, CalendarIcon, ArrowDownTrayIcon } from '../icons';

const MaterialIcon: React.FC<{ type: CampaignMaterialType }> = ({ type }) => {
    // A simple icon mapping would go here, for now we use a generic one.
    return <div className="w-4 h-4 bg-gray-300 rounded-sm mr-2 flex-shrink-0"></div>
}

const FranchiseeMarketingView: React.FC = () => {
    const { selectedFranchiseData } = useData();

    if (!selectedFranchiseData) return null;
    const { marketingCampaigns } = selectedFranchiseData;

    const activeCampaigns = useMemo(() => {
        const now = new Date();
        return marketingCampaigns
            .filter((c: MarketingCampaign) => {
                const startDate = new Date(c.startDate);
                const endDate = new Date(c.endDate);
                // Ensure the campaign is currently active
                return c.status === MarketingCampaignStatus.ACTIVE && startDate <= now && endDate >= now;
            })
            .sort((a: MarketingCampaign, b: MarketingCampaign) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
    }, [marketingCampaigns]);

    return (
        <div className="space-y-8">
            <div className="flex items-center space-x-3">
                <PhotoIcon className="w-8 h-8 text-primary"/>
                <h2 className="text-2xl font-bold text-gray-800">Campanhas de Marketing Ativas</h2>
            </div>
            
            {activeCampaigns.length > 0 ? (
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {activeCampaigns.map((campaign: MarketingCampaign) => (
                        <div key={campaign.id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-secondary">
                            <h3 className="text-xl font-bold text-gray-800">{campaign.title}</h3>
                            <div className="flex items-center text-sm text-gray-500 my-2">
                                <CalendarIcon className="w-4 h-4 mr-2" />
                                <span>
                                    Vigência: {new Date(campaign.startDate).toLocaleDateString('pt-BR')} até {new Date(campaign.endDate).toLocaleDateString('pt-BR')}
                                </span>
                            </div>
                            <p className="text-gray-600 mb-4">{campaign.description}</p>

                            <div>
                                <h4 className="font-semibold text-gray-700 mb-2">Materiais Disponíveis:</h4>
                                <ul className="space-y-2">
                                    {campaign.materials.map(material => (
                                        <li key={material.id}>
                                            <a 
                                                href={material.downloadUrl} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-between p-2 bg-gray-50 rounded-md hover:bg-gray-100 group"
                                            >
                                                <div className="flex items-center">
                                                    <MaterialIcon type={material.type} />
                                                    <div>
                                                        <span className="text-sm font-medium text-primary">{material.name}</span>
                                                        <span className="text-xs text-gray-500 ml-2">({material.type})</span>
                                                    </div>
                                                </div>
                                                <ArrowDownTrayIcon className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-white rounded-lg shadow-md">
                    <PhotoIcon className="w-16 h-16 mx-auto text-gray-300" />
                    <h3 className="mt-4 text-xl font-semibold text-gray-800">Nenhuma campanha ativa no momento.</h3>
                    <p className="mt-2 text-gray-500">Volte em breve para conferir as novidades de marketing.</p>
                </div>
            )}

        </div>
    );
};

export default FranchiseeMarketingView;
