import React, { useMemo } from 'react';
import { FranchiseWithStats } from '../types';
import { PencilAltIcon, BriefcaseIcon } from './icons';
import HealthScoreIndicator from './HealthScoreIndicator';

interface LeaderboardProps {
  franchises: FranchiseWithStats[];
  onEdit: (franchiseId: number) => void;
  onViewSummary: (franchiseId: number) => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ franchises, onEdit, onViewSummary }) => {

  const sortedFranchises = useMemo(() => {
    return [...franchises].sort((a, b) => b.healthScore - a.healthScore);
  }, [franchises]);
  
  const getRankColor = (rank: number) => {
      if (rank === 0) return 'bg-amber-400 text-white';
      if (rank === 1) return 'bg-gray-400 text-white';
      if (rank === 2) return 'bg-amber-600 text-white';
      return 'bg-gray-200 text-text-tertiary';
  }

  return (
    <div className="card">
      <h3 className="section-title mb-4">Leaderboard de Franquias</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border">
              <th className="p-4 text-sm font-bold text-text-secondary uppercase">#</th>
              <th className="p-4 text-sm font-bold text-text-secondary uppercase">Franquia</th>
              <th className="p-4 text-sm font-bold text-text-secondary uppercase text-center">Faturamento</th>
              <th className="p-4 text-sm font-bold text-text-secondary uppercase text-center">Conversão</th>
              <th className="p-4 text-sm font-bold text-text-secondary uppercase text-center">Health Score</th>
              <th className="p-4 text-sm font-bold text-text-secondary uppercase text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {sortedFranchises.map((franchise, index) => (
              <tr 
                key={franchise.id} 
                className="border-b border-border last:border-b-0 hover:bg-gray-50 cursor-pointer"
                onClick={() => onViewSummary(franchise.id)}
              >
                <td className="p-4">
                  <span className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${getRankColor(index)}`}>
                      {index + 1}
                  </span>
                </td>
                <td 
                  className="p-4"
                >
                  <div className="flex items-center space-x-3">
                    <img src={`https://i.pravatar.cc/40?u=${franchise.id}`} alt="Franchise logo" className="w-10 h-10 rounded-full"/>
                    <div>
                        <p className="font-bold text-text-primary">{franchise.name}</p>
                        <p className="text-sm text-text-secondary">{franchise.location}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-center">
                  <p className="font-bold text-text-primary">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact' }).format(franchise.consortiumSales)}</p>
                </td>
                <td className="p-4 text-center">
                  <p className="font-bold text-text-primary">{(franchise.conversionRate * 100).toFixed(1)}%</p>
                </td>
                <td className="p-4 text-center">
                  <HealthScoreIndicator score={franchise.healthScore} />
                </td>
                <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                   <div className="flex items-center justify-end space-x-4">
                      <button onClick={() => onEdit(franchise.id)} className="text-text-tertiary hover:text-primary flex items-center text-sm font-bold">
                        <PencilAltIcon className="w-4 h-4 mr-1" />
                        Editar
                      </button>
                      <a href={`#/franchises/${franchise.id}/dashboard`} className="text-primary hover:text-blue-700 flex items-center text-sm font-bold">
                        <BriefcaseIcon className="w-4 h-4 mr-1" />
                        Gerenciar
                      </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;