import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Lead, Product, LeadStatus } from '../../types';

interface SalesByProductChartProps {
    leads: Lead[];
    products: Product[];
}

const COLORS = ['#1E3A8A', '#10B981', '#F59E0B', '#6366F1'];

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-card/80 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-border/20">
                <p className="font-bold text-sm text-text-primary">{payload[0].name}</p>
                <p className="text-sm" style={{ color: payload[0].payload.fill }}>{`${payload[0].value} vendas`}</p>
            </div>
        );
    }
    return null;
};

const SalesByProductChart: React.FC<SalesByProductChartProps> = ({ leads, products }) => {
    const chartData = useMemo(() => {
        const wonLeads = leads.filter(l => l.status === LeadStatus.WON);
        const salesByProduct = wonLeads.reduce((acc, lead) => {
            const productName = lead.serviceOfInterest || 'Não especificado';
            acc[productName] = (acc[productName] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(salesByProduct).map(([name, value]) => ({ name, value }));
    }, [leads, products]);
    
    if (chartData.length === 0) {
        return <p className="text-center text-gray-500 py-8">Nenhuma venda registrada para exibir no gráfico.</p>;
    }

    return (
        <div className="h-96 w-full">
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        innerRadius={70}
                        outerRadius={110}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        paddingAngle={5}
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconType="circle"/>
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SalesByProductChart;