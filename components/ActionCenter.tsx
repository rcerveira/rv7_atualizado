import React, { useMemo } from 'react';
import { Lead, LeadNote, LeadStatus, Task, Client } from '../types';
import { ClockIcon, BellIcon } from './icons';

interface ActionCenterProps {
    tasks: Task[];
    leads: Lead[];
    notes: LeadNote[];
    clients: Client[];
}

const ActionCenter: React.FC<ActionCenterProps> = ({ tasks, leads, notes, clients }) => {
    const overdueTasks = useMemo(() => {
        const todayStr = new Date().toISOString().split('T')[0];
        return tasks.filter(task => !task.completed && task.dueDate < todayStr);
    }, [tasks]);

    const coldLeads = useMemo(() => {
        const fiveDaysAgo = new Date();
        fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

        const negotiatingLeads = leads.filter(l => l.status === LeadStatus.NEGOTIATING);
        
        return negotiatingLeads.filter(lead => {
            const leadNotes = notes.filter(n => n.leadId === lead.id);
            
            if (leadNotes.length === 0) {
                // If no notes, check creation date
                return new Date(lead.createdAt) < fiveDaysAgo;
            }

            // Find the most recent note date
            const lastNoteDate = new Date(
                Math.max(...leadNotes.map(note => new Date(note.createdAt).getTime()))
            );
            
            return lastNoteDate < fiveDaysAgo;
        });
    }, [leads, notes]);
    
    const getClientName = (clientId: number) => {
        return clients.find(c => c.id === clientId)?.name || 'Cliente';
    }

    const actions = [
        ...overdueTasks.map(task => ({ type: 'task' as const, data: task, id: `task-${task.id}` })),
        ...coldLeads.map(lead => ({ type: 'lead' as const, data: lead, id: `lead-${lead.id}` }))
    ];

    if (actions.length === 0) {
        return null;
    }

    return (
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg mb-8 shadow-sm">
            <h3 className="text-lg font-bold text-amber-800 mb-3">Central de Ações Inteligentes</h3>
            <div className="space-y-3">
                {actions.map((action) => (
                    <div key={action.id} className="flex items-start p-3 bg-white rounded-md border border-gray-200">
                        <div className="flex-shrink-0 mr-3 pt-1">
                           {action.type === 'task' ? 
                                <ClockIcon className="w-6 h-6 text-red-500" /> : 
                                <BellIcon className="w-6 h-6 text-blue-500" />
                            }
                        </div>
                        <div>
                            {action.type === 'task' ? (
                                <>
                                    <p className="font-semibold text-gray-800">Tarefa Atrasada! ⏰</p>
                                    <p className="text-sm text-gray-600">A tarefa "{action.data.title}" venceu em {new Date(action.data.dueDate + 'T00:00:00-03:00').toLocaleDateString('pt-BR')}.</p>
                                </>
                            ) : (
                                <>
                                    <p className="font-semibold text-gray-800">Lead Esfriando! ❄️</p>
                                    <p className="text-sm text-gray-600">Nenhuma interação registrada com "{getClientName(action.data.clientId)}" nos últimos 5 dias. Considere um follow-up.</p>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActionCenter;