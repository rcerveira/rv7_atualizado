import React from 'react';

interface KpiCardProps {
    title: string;
    value: number;
    target: number;
    format: 'currency' | 'percentage' | 'number';
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, target, format }) => {
    const progress = target > 0 ? Math.min((value / target) * 100, 100) : 0;

    const formatValue = (num: number) => {
        switch (format) {
            case 'currency':
                return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num);
            case 'percentage':
                return `${(num * 100).toFixed(1)}%`;
            case 'number':
                return num.toString();
        }
    };
    
    const getProgressColor = () => {
        if (progress >= 90) return 'bg-green-500';
        if (progress >= 50) return 'bg-yellow-500';
        return 'bg-red-500';
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
            <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</h3>
                <div className="mt-2 flex items-baseline space-x-2">
                    <span className="text-3xl font-bold text-primary">{formatValue(value)}</span>
                    <span className="text-sm text-gray-500">/ {formatValue(target)}</span>
                </div>
            </div>
            <div className="mt-4">
                <div className="flex justify-between text-sm font-medium text-gray-600 mb-1">
                    <span>Progresso</span>
                     <span>{progress.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                        className={`h-2.5 rounded-full ${getProgressColor()}`}
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default KpiCard;