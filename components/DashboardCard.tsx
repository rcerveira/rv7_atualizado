import React from 'react';

interface DashboardCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon, color }) => {
  return (
    <div className="bg-card p-6 rounded-2xl shadow-lg shadow-gray-200/50 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-text-secondary uppercase tracking-wider">{title}</p>
        <p className="text-3xl font-bold text-text-primary">{value}</p>
      </div>
      <div className={`p-4 rounded-full`} style={{ backgroundColor: color, color: 'white' }}>
        {icon}
      </div>
    </div>
  );
};

export default DashboardCard;