import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface MonthlyRoyaltiesChartProps {
    lastBilledAmount: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-card/80 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-border/20">
                <p className="font-semibold text-sm text-text-primary">{label}</p>
                <p className="text-primary font-medium">{`Faturado: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(payload[0].value)}`}</p>
            </div>
        );
    }
    return null;
};

const MonthlyRoyaltiesChart: React.FC<MonthlyRoyaltiesChartProps> = ({ lastBilledAmount }) => {
    const chartData = useMemo(() => {
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        const currentMonthIndex = new Date().getMonth();
        const data = [];

        for (let i = 5; i >= 0; i--) {
            const monthIndex = (currentMonthIndex - i + 12) % 12;
            const monthName = months[monthIndex];
            
            let value;
            if (i === 0) {
                value = lastBilledAmount; // Use real data for the current month
            } else {
                 // Generate plausible mock data for past months, showing some variation and growth
                const randomFactor = 0.85 + Math.random() * 0.25; // between 0.85 and 1.10
                value = lastBilledAmount * (1 - i * 0.05) * randomFactor;
            }
            
            data.push({
                name: monthName,
                Royalties: Math.max(0, parseFloat(value.toFixed(0))),
            });
        }
        return data;
    }, [lastBilledAmount]);

    return (
        <div className="h-80 w-full">
            <ResponsiveContainer>
                <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                     <defs>
                        <linearGradient id="colorRoyalties" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0.4}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis
                        tickFormatter={(value) =>
                            new Intl.NumberFormat('pt-BR', { notation: 'compact' }).format(value as number)
                        }
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(239, 246, 255, 0.5)'}} />
                    <Bar dataKey="Royalties" fill="url(#colorRoyalties)" barSize={25} radius={[10, 10, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default MonthlyRoyaltiesChart;