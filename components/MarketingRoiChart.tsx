import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';
import { Lead, LeadStatus } from '../types';
import { MegaphoneIcon } from './icons';

interface MarketingRoiChartProps {
  leads: Lead[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card/80 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-border/20">
        <p className="font-bold text-sm text-text-primary">{label}</p>
        <p className="text-sm" style={{ color: 'var(--color-secondary)' }}>
          {`Conversão: ${(data['Taxa de Conversão'] as number).toFixed(1)}%`}
        </p>
        <p className="text-xs text-text-secondary">{`Leads Ganhos: ${data['Leads Ganhos']}`}</p>
        <p className="text-xs text-text-secondary">{`Total de Leads: ${data['Total de Leads']}`}</p>
      </div>
    );
  }
  return null;
};


const MarketingRoiChart: React.FC<MarketingRoiChartProps> = ({ leads }) => {
  const sourceData = leads.reduce((acc, lead) => {
      const source = lead.source || 'Não especificada';
      if (!acc[source]) {
          acc[source] = { total: 0, won: 0 };
      }
      acc[source].total++;
      if (lead.status === LeadStatus.WON) {
          acc[source].won++;
      }
      return acc;
  }, {} as Record<string, { total: number; won: number }>);

  const chartData = Object.keys(sourceData).map(source => ({
      name: source,
      'Taxa de Conversão': (sourceData[source].won / sourceData[source].total) * 100,
      'Leads Ganhos': sourceData[source].won,
      'Total de Leads': sourceData[source].total,
  })).sort((a, b) => b['Taxa de Conversão'] - a['Taxa de Conversão']);

  if(chartData.length === 0){
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center space-x-3 mb-4">
            <MegaphoneIcon className="w-6 h-6 text-secondary" />
            <h3 className="text-lg font-semibold text-gray-900">Eficácia dos Canais de Marketing</h3>
        </div>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={chartData} 
            layout="vertical"
            margin={{ top: 5, right: 30, left: 30, bottom: 20 }}
          >
            <defs>
                <linearGradient id="colorROI" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="5%" stopColor="var(--color-secondary)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--color-secondary)" stopOpacity={0.4}/>
                </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" unit="%" domain={[0, 100]}>
                 <Label value="Taxa de Conversão (%)" offset={0} position="insideBottom" />
            </XAxis>
            <YAxis 
                type="category" 
                dataKey="name" 
                width={100}
                tickLine={false}
                axisLine={false}
            />
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(239, 246, 255, 0.5)' }}
            />
            <Legend verticalAlign="top" height={36} />
            <Bar dataKey="Taxa de Conversão" fill="url(#colorROI)" barSize={30} radius={[0, 10, 10, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MarketingRoiChart;