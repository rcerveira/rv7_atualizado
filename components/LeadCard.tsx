import React, { useState } from 'react';
import { Lead, Client } from '../types';
import { PhoneIcon, MailIcon, CashIcon, WhatsAppIcon } from './icons';
import { formatPhoneNumberForWhatsApp } from '../utils/formatters';

interface LeadCardProps {
  lead: Lead;
  clients: Client[];
  onSelectLead: (leadId: number) => void;
}

const serviceColorMap: Record<string, string> = {
    'Consórcio de Imóveis': 'bg-blue-100 text-blue-800',
    'Consórcio de Automóveis': 'bg-indigo-100 text-indigo-800',
    'Recuperação de Crédito (Limpa Nome)': 'bg-green-100 text-green-800'
};

const serviceBorderColorMap: Record<string, string> = {
    'Consórcio de Imóveis': 'border-t-blue-500',
    'Consórcio de Automóveis': 'border-t-indigo-500',
    'Recuperação de Crédito (Limpa Nome)': 'border-t-green-500'
};

const LeadCard: React.FC<LeadCardProps> = ({ lead, clients, onSelectLead }) => {
  const [isDragging, setIsDragging] = useState(false);
  const client = clients.find(c => c.id === lead.clientId);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation(); 
    e.dataTransfer.setData('leadId', lead.id.toString());
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };
  
  if (!client) {
      return null;
  }

  const serviceColor = serviceColorMap[lead.serviceOfInterest] || 'bg-gray-100 text-gray-800';
  const serviceBorderColor = serviceBorderColorMap[lead.serviceOfInterest] || 'border-t-gray-500';

  return (
    <div
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={() => onSelectLead(lead.id)}
      className={`p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-lg hover:border-primary transition-all border-t-4 ${serviceBorderColor} bg-gradient-to-b from-blue-50 to-white ${isDragging ? 'opacity-50' : ''}`}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold text-base text-gray-900">{client.name}</h4>
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${serviceColor}`}>
            {lead.serviceOfInterest}
        </span>
      </div>
      <div className="mt-3 space-y-2 text-sm text-gray-600">
         <div className="flex items-center justify-between">
            <p className="flex items-center">
                <PhoneIcon className="w-4 h-4 mr-2 text-gray-400"/>
                {client.phone}
            </p>
            {client.phone && (
                <a href={`https://wa.me/${formatPhoneNumberForWhatsApp(client.phone)}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-green-500 hover:text-green-600 p-1 rounded-full hover:bg-green-100 transition-colors">
                    <WhatsAppIcon className="w-5 h-5" />
                </a>
            )}
        </div>
        <p className="flex items-center">
            <MailIcon className="w-4 h-4 mr-2 text-gray-400"/>
            {client.email}
        </p>
      </div>
      {lead.negotiatedValue && (
        <div className="mt-3 pt-2 border-t border-gray-200/60 flex items-center text-sm font-semibold">
            <CashIcon className="w-4 h-4 mr-2 text-green-500" />
            <span className="text-gray-700">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(lead.negotiatedValue)}
            </span>
        </div>
      )}
      <div className="text-right text-xs text-gray-400 mt-3">
        Criado em: {new Date(lead.createdAt).toLocaleDateString('pt-BR')}
      </div>
    </div>
  );
};

export default LeadCard;
