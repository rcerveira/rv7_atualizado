
import React, { useState } from 'react';
import { LeadStatus } from '../types';

interface KanbanColumnProps {
  title: string;
  status: LeadStatus;
  children: React.ReactNode;
  onDrop: (e: React.DragEvent<HTMLDivElement>, status: LeadStatus) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
}

const statusColorMap: Record<LeadStatus, string> = {
    [LeadStatus.NEW]: 'border-t-gray-400',
    [LeadStatus.CONTACTED]: 'border-t-blue-500',
    [LeadStatus.NEGOTIATING]: 'border-t-yellow-500',
    [LeadStatus.WON]: 'border-t-green-500',
    [LeadStatus.LOST]: 'border-t-red-500',
};

const KanbanColumn: React.FC<KanbanColumnProps> = ({ title, status, children, onDrop, onDragOver }) => {
    const [isOver, setIsOver] = useState(false);
  
    return (
        <div
        onDrop={(e) => {
            onDrop(e, status);
            setIsOver(false);
        }}
        onDragOver={(e) => {
            onDragOver(e);
            setIsOver(true);
        }}
        onDragLeave={() => setIsOver(false)}
        onDragEnd={() => setIsOver(false)}
        className={`w-72 bg-gray-100 rounded-lg shadow-inner flex-shrink-0 transition-colors ${isOver ? 'bg-blue-100' : ''}`}
        >
        <div className={`p-4 border-t-4 ${statusColorMap[status]} rounded-t-lg`}>
            <h3 className="font-semibold text-gray-700">{title}</h3>
        </div>
        <div className="p-2 space-y-3 min-h-full">
            {children}
        </div>
        </div>
    );
};

export default KanbanColumn;
