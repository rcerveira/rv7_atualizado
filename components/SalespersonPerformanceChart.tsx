import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface ChartData {
    name: string;
    value: number;
}
interface ChartProps {
    data: ChartData[];
}
const COLORS = ['#1E3A8A', '#10B981', '#F59E0B', '#6366F1', '#EC4899', '#84CC16'];

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-card/80 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-border/20">
                <p className="font-bold text-sm text-text-primary">{payload[0].name}</p>
                <p className="text-sm" style={{ color: payload[0].payload.fill }}>{`Receita: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(payload[0].value)}`}</p>
            </div>
        );
    }
    return null;
};

const SalespersonPerformanceChart: React.FC<ChartProps> = ({ data }) => {
    const totalRevenue = data.reduce((sum, entry) => sum + entry.value, 0);

    return (
        <div className="h-80 w-full relative">
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        innerRadius={80}
                        outerRadius={110}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        nameKey="name"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                        iconType="circle"
                        wrapperStyle={{
                            paddingTop: '20px'
                        }}
                    />
                </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-sm text-text-secondary">Receita Total</span>
                <span className="text-2xl font-bold text-text-primary">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact' }).format(totalRevenue)}
                </span>
            </div>
        </div>
    );
};

export default SalespersonPerformanceChart;