import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Consortium, CreditRecoveryCase, CreditRecoveryStatus } from '../../types';

interface SalesTrendChartProps {
    consortiums: Consortium[];
    creditRecoveryCases: CreditRecoveryCase[];
}

const SalesTrendChart: React.FC<SalesTrendChartProps> = ({ consortiums, creditRecoveryCases }) => {

    const chartData = useMemo(() => {
        const monthlyData: { [key: string]: { consortium: number, credit: number } } = {};
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        
        // Initialize last 12 months
        for (let i = 11; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const key = `${months[d.getMonth()]}/${d.getFullYear().toString().slice(-2)}`;
            monthlyData[key] = { consortium: 0, credit: 0 };
        }

        consortiums.forEach(c => {
            const date = new Date(c.date);
            const key = `${months[date.getMonth()]}/${date.getFullYear().toString().slice(-2)}`;
            if(monthlyData[key]) monthlyData[key].consortium += c.value;
        });

        creditRecoveryCases.filter(c => c.status === CreditRecoveryStatus.RESOLVED).forEach(c => {
            const date = new Date(c.lastContactDate);
            const key = `${months[date.getMonth()]}/${date.getFullYear().toString().slice(-2)}`;
             if(monthlyData[key]) monthlyData[key].credit += c.debtAmount;
        });
        
        return Object.entries(monthlyData).map(([name, values]) => ({
            name,
            'Consórcios': values.consortium,
            'Rec. Crédito': values.credit,
        }));

    }, [consortiums, creditRecoveryCases]);

    return (
        <div className="h-96 w-full">
            <ResponsiveContainer>
                <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tickFormatter={(value) => new Intl.NumberFormat('pt-BR', { notation: 'compact' }).format(value as number)} />
                    <Tooltip formatter={(value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)} />
                    <Legend />
                    <Line type="monotone" dataKey="Consórcios" stroke="#1E3A8A" strokeWidth={2} activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="Rec. Crédito" stroke="#10B981" strokeWidth={2} activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SalesTrendChart;
