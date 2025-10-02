import React from 'react';
import { Lead, LeadStatus, Client } from '../types';
import KanbanColumn from './KanbanColumn';
import LeadCard from './LeadCard';

interface KanbanBoardProps {
  leads: Lead[];
  clients: Client[];
  onUpdateLeadStatus: (leadId: number, newStatus: LeadStatus) => void;
  onSelectLead: (leadId: number) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ leads, clients, onUpdateLeadStatus, onSelectLead }) => {
  const columns: LeadStatus[] = [
    LeadStatus.NEW,
    LeadStatus.CONTACTED,
    LeadStatus.NEGOTIATING,
    LeadStatus.WON,
    LeadStatus.LOST,
  ];

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, status: LeadStatus) => {
    e.preventDefault();
    const leadId = Number(e.dataTransfer.getData('leadId'));
    onUpdateLeadStatus(leadId, status);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // This is necessary to allow dropping
  };

  return (
    <div className="flex space-x-4 overflow-x-auto p-2 min-h-[600px]">
      {columns.map((status) => (
        <KanbanColumn
          key={status}
          title={status}
          status={status}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {leads
            .filter((lead) => lead.status === status)
            .map((lead) => (
              <LeadCard key={lead.id} lead={lead} clients={clients} onSelectLead={onSelectLead} />
            ))}
        </KanbanColumn>
      ))}
    </div>
  );
};

export default KanbanBoard;