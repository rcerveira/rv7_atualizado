import React from 'react';
import { TrendingUpIcon } from './icons';

interface HealthScoreIndicatorProps {
  score: number;
}

const HealthScoreIndicator: React.FC<HealthScoreIndicatorProps> = ({ score }) => {
  const getScoreColorClasses = () => {
    if (score >= 80) {
      return 'bg-green-100 text-green-800';
    }
    if (score >= 50) {
      return 'bg-amber-100 text-amber-800';
    }
    return 'bg-red-100 text-red-800';
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getScoreColorClasses()}`}>
      <TrendingUpIcon className="w-4 h-4 mr-1.5" />
      {score}
    </span>
  );
};

export default HealthScoreIndicator;
