import React, { useState } from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { FranchiseWithStats } from '../types';

interface NetworkPerformanceChartProps {
  data: FranchiseWithStats[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload; // The full data object for this point
    return (
      <div className="bg-card/80 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-border/20 space-y-1">
        <p className="font-bold text-base text-text-primary">{label}</p>
        <p className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>
          Faturamento: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.consortiumSales)}
        </p>
        <p className="text-sm font-medium" style={{ color: 'var(--color-secondary)' }}>
          Lucro: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.profit)}
        </p>
        <div className="pt-2 mt-2 border-t border-border/50">
          <p className="text-xs text-text-secondary">
            Conversão: <span className="font-bold">{(data.conversionRate * 100).toFixed(1)}%</span>
          </p>
          <p className="text-xs text-text-secondary">
            Health Score: <span className="font-bold">{data.healthScore}</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};


const NetworkPerformanceChart: React.FC<NetworkPerformanceChartProps> = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);

  const handleMouseMove = (state: any) => {
    if (state.isTooltipActive) {
      setActiveIndex(state.activeTooltipIndex);
    }
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
  };

  const handleClick = (index: number) => {
    setClickedIndex(clickedIndex === index ? null : index);
  };
  
  const renderDot = (props: any) => {
      const { cx, cy, index } = props;
      if (activeIndex === index || clickedIndex === index) {
        return <circle key={`dot-${index}`} cx={cx} cy={cy} r={8} stroke="var(--color-secondary)" strokeWidth={3} fill="var(--color-card)" />;
      }
      return <circle key={`dot-${index}`} cx={cx} cy={cy} r={5} stroke="var(--color-secondary)" strokeWidth={2} fill="var(--color-card)" />;
    };

  return (
    <div className="card h-[28rem]">
      <h3 className="section-title mb-4">Performance da Rede (Faturamento vs. Lucro)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart 
          data={data} 
          margin={{ top: 5, right: 20, left: 30, bottom: 20 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
           <defs>
            <linearGradient id="colorFaturamento" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.9}/>
              <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0.2}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--color-text-tertiary)' }} angle={-15} textAnchor="end" height={50} />
          <YAxis 
            tickFormatter={(value) =>
              new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                notation: 'compact'
              }).format(value as number)
            }
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'var(--color-text-tertiary)' }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(239, 246, 255, 0.5)' }} />
          <Legend wrapperStyle={{ color: 'var(--color-text-tertiary)' }} />
          <Bar dataKey="consortiumSales" name="Faturamento" barSize={30} radius={[10, 10, 0, 0]}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                cursor="pointer"
                fill={clickedIndex === index || activeIndex === index ? 'var(--color-primary)' : 'url(#colorFaturamento)'}
                onClick={() => handleClick(index)}
              />
            ))}
          </Bar>
          <Line 
            type="monotone" 
            dataKey="profit" 
            name="Lucro" 
            stroke="var(--color-secondary)" 
            strokeWidth={clickedIndex !== null ? 6 : 4} 
            strokeOpacity={clickedIndex !== null ? 1 : 0.8}
            dot={renderDot} 
            activeDot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default NetworkPerformanceChart;