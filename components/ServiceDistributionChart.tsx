import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { FranchiseWithStats } from '../types';

interface NetworkHealthRadarChartProps {
  data: FranchiseWithStats[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const formatValue = (subject: string, value: number) => {
        if (subject === 'Conversão') {
            return `${(value * 100).toFixed(1)}%`;
        }
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact' }).format(value);
    }
    return (
      <div className="bg-card/80 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-border/20 space-y-1">
        <p className="font-bold text-sm text-text-primary">{label}</p>
        <p className="text-sm" style={{ color: 'var(--color-primary)' }}>
            Média da Rede: <span className="font-bold">{formatValue(label, data.actualValue)}</span>
        </p>
        <p className="text-xs text-text-secondary">
            Performance Relativa: {(payload[0].value as number).toFixed(1)}%
        </p>
      </div>
    );
  }
  return null;
};


const NetworkHealthRadarChart: React.FC<NetworkHealthRadarChartProps> = ({ data }) => {
  const validData = data?.filter(Boolean) || [];
  
  if (validData.length === 0) {
      return <div className="flex items-center justify-center h-full text-text-secondary">Dados insuficientes para o radar.</div>;
  }
  
  // Calculate max values for normalization
  const maxRevenue = Math.max(...validData.map(f => f.consortiumSales), 1);
  const maxProfit = Math.max(...validData.map(f => f.profit), 1);
  const maxConversion = Math.max(...validData.map(f => f.conversionRate), 0.01);

  // Calculate average network performance and normalize it
  const networkAverage = validData.reduce((acc, franchise) => {
      acc.revenue += franchise.consortiumSales;
      acc.profit += franchise.profit;
      acc.conversion += franchise.conversionRate;
      return acc;
  }, { revenue: 0, profit: 0, conversion: 0 });

  const numFranchises = validData.length;
  const avgRevenue = networkAverage.revenue / numFranchises;
  const avgProfit = networkAverage.profit / numFranchises;
  const avgConversion = networkAverage.conversion / numFranchises;
  
  const chartData = [
    {
      subject: 'Faturamento',
      A: (avgRevenue / maxRevenue) * 100,
      actualValue: avgRevenue,
      fullMark: 100,
    },
    {
      subject: 'Lucro',
      A: (avgProfit / maxProfit) * 100,
      actualValue: avgProfit,
      fullMark: 100,
    },
    {
      subject: 'Conversão',
      A: (avgConversion / maxConversion) * 100,
      actualValue: avgConversion,
      fullMark: 100,
    },
  ];

  return (
    <div className="card h-[28rem]">
      <h3 className="section-title mb-4">Radar de Saúde da Rede</h3>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
           <defs>
              <radialGradient id="radarGradient">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.7} />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0.2} />
              </radialGradient>
          </defs>
          <PolarGrid stroke="var(--color-border)" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--color-text-tertiary)' }} />
          <Radar name="Média da Rede" dataKey="A" stroke="var(--color-primary)" strokeWidth={2.5} fill="url(#radarGradient)" />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default NetworkHealthRadarChart;