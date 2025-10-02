import React, { useMemo } from 'react';
import { MarketingCampaign, MarketingCampaignStatus } from '../../types';
import { ExclamationTriangleIcon, ClockIcon } from '../icons';

interface ExpiringCampaignsAlertProps {
    campaigns: MarketingCampaign[];
}

const ExpiringCampaignsAlert: React.FC<ExpiringCampaignsAlertProps> = ({ campaigns }) => {
    
    const expiringCampaigns = useMemo(() => {
        const now = new Date();
        now.setHours(0, 0, 0, 0); // Normalize current date to compare with end dates
        
        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(now.getDate() + 7);

        return campaigns
            .filter(c => {
                const endDate = new Date(c.endDate);
                return c.status === MarketingCampaignStatus.ACTIVE && endDate < sevenDaysFromNow;
            })
            .map(c => {
                const endDate = new Date(c.endDate);
                const timeDiff = endDate.getTime() - now.getTime();
                const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
                return { ...c, daysRemaining };
            })
            .sort((a, b) => a.daysRemaining - b.daysRemaining);
    }, [campaigns]);

    if (expiringCampaigns.length === 0) {
        return null;
    }

    const getDaysRemainingText = (days: number) => {
        if (days < 0) return `Venceu há ${-days} dia(s).`;
        if (days === 0) return 'Termina hoje!';
        if (days === 1) return 'Termina amanhã.';
        return `Termina em ${days} dias.`;
    };

    return (
        <div className="bg-amber-100 border border-amber-200 p-4 rounded-2xl shadow-lg shadow-amber-500/10">
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    <ExclamationTriangleIcon className="h-6 w-6 text-amber-500" aria-hidden="true" />
                </div>
                <div className="ml-3 flex-1">
                    <h3 className="text-lg font-bold text-amber-900">Atenção às Campanhas de Marketing</h3>
                    <div className="mt-2 text-sm text-amber-800 space-y-2">
                        {expiringCampaigns.map(campaign => (
                            <div key={campaign.id} className="flex items-center">
                                <ClockIcon className="w-4 h-4 mr-2 flex-shrink-0"/>
                                <p>
                                    A campanha <span className="font-semibold">"{campaign.title}"</span> {getDaysRemainingText(campaign.daysRemaining)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExpiringCampaignsAlert;