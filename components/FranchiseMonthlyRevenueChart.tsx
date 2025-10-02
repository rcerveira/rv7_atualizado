import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Transaction, TransactionType } from '../types';

interface ChartProps {
  transactions: Transaction[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-card/80 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-border/20">
                <p className="font-semibold text-sm text-text-primary">{label}</p>
                <p className="text-primary font-medium">{`Receita: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(payload[0].value)}`}</p>
            </div>
        );
    }
    return null;
};

const FranchiseMonthlyRevenueChart: React.FC<ChartProps> = ({ transactions }) => {
    const chartData = useMemo(() => {
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        const monthlyRevenue: { [key: string]: number } = {};
        
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);
        sixMonthsAgo.setHours(0,0,0,0);

        const relevantTransactions = transactions.filter(t => 
            t.type === TransactionType.INCOME && new Date(t.date) >= sixMonthsAgo
        );

        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(new Date().getMonth() - i);
            const monthKey = `${months[date.getMonth()]}/${date.getFullYear().toString().slice(-2)}`;
            monthlyRevenue[monthKey] = 0;
        }

        relevantTransactions.forEach(t => {
            const date = new Date(t.date);
            const monthKey = `${months[date.getMonth()]}/${date.getFullYear().toString().slice(-2)}`;
            if (monthKey in monthlyRevenue) {
                monthlyRevenue[monthKey] += t.amount;
            }
        });

        return Object.entries(monthlyRevenue).map(([name, Receita]) => ({ name, Receita }));

    }, [transactions]);

    return (
        <div className="h-60 w-full">
            <ResponsiveContainer>
                <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0.4}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis
                        tickFormatter={(value) => new Intl.NumberFormat('pt-BR', { notation: 'compact' }).format(value as number)}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(239, 246, 255, 0.5)'}} />
                    <Bar dataKey="Receita" fill="url(#colorRevenue)" barSize={20} radius={[8, 8, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default FranchiseMonthlyRevenueChart;