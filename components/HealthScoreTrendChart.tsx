import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FranchiseWithStats } from '../types';
import { ChevronUpIcon, ChevronDownIcon } from './icons';

interface HealthScoreTrendChartProps {
  data: FranchiseWithStats[];
}

const TrendIndicator: React.FC<{ trend: number }> = ({ trend }) => {
    if (trend === 0) return null;
    const isUp = trend > 0;
    return (
        <span className={`flex items-center text-xs font-bold ${isUp ? 'text-green-500' : 'text-red-500'}`}>
            {isUp ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
            {Math.abs(trend).toFixed(0)}
        </span>
    );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card/80 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-border/20">
        <div className="flex justify-between items-center gap-4">
            <div>
                <p className="font-bold text-sm text-text-primary">{label}</p>
                <p className="text-lg font-bold" style={{ color: 'var(--color-accent)' }}>
                    {data['Health Score Médio']}
                    <span className="text-sm font-medium text-text-secondary"> / 100</span>
                </p>
            </div>
            {data.trend !== 0 && (
                <div className="text-right">
                    <TrendIndicator trend={data.trend} />
                    <p className="text-xs text-text-secondary">vs. mês anterior</p>
                </div>
            )}
        </div>
      </div>
    );
  }
  return null;
};

const HealthScoreTrendChart: React.FC<HealthScoreTrendChartProps> = ({ data }) => {
  // Generate mock historical data for the trend chart
  const trendData = useMemo(() => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const currentMonthIndex = new Date().getMonth();
    
    const currentAvgScore = data.length > 0
      ? data.reduce((sum, f) => sum + f.healthScore, 0) / data.length
      : 75;

    const historicalData = [];
    let lastScore: number | null = null;
    // Generate data for the last 6 months
    for (let i = 5; i >= 0; i--) {
        const monthIndex = (currentMonthIndex - i + 12) % 12;
        const monthName = months[monthIndex];
        
        // Create some variation for past months for demonstration (upward trend)
        const score = i === 0 ? currentAvgScore : currentAvgScore - (i * (Math.random() * 3 + 2));
        const finalScore = Math.max(0, Math.min(100, parseFloat(score.toFixed(0))));
        
        let trend = 0;
        if (lastScore !== null) {
            trend = finalScore - lastScore;
        }
        
        historicalData.push({
            name: monthName,
            'Health Score Médio': finalScore,
            trend: trend,
        });
        lastScore = finalScore;
    }

    return historicalData;
  }, [data]);
  
  return (
    <div className="card h-[28rem]">
      <h3 className="section-title mb-4">Evolução do Health Score da Rede</h3>
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart
          data={trendData}
          margin={{
            top: 5,
            right: 20,
            left: 0,
            bottom: 5,
          }}
        >
          <defs>
            <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.7}/>
                <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
          <XAxis dataKey="name" tick={{ fill: 'var(--color-text-tertiary)' }}/>
          <YAxis domain={[0, 100]} tick={{ fill: 'var(--color-text-tertiary)' }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: '20px', color: 'var(--color-text-tertiary)' }} />
          <Area type="monotone" dataKey="Health Score Médio" stroke="var(--color-accent)" fillOpacity={1} fill="url(#colorTrend)" strokeWidth={3} dot={false} activeDot={{ r: 6, stroke: 'var(--color-card)', fill: 'var(--color-accent)', strokeWidth: 2 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HealthScoreTrendChart;