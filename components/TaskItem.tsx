import React from 'react';
import { Task, Lead, Client } from '../types';
import { CheckCircleIcon, CircleIcon, CalendarIcon, UsersIcon } from './icons';

interface TaskItemProps {
  task: Task;
  leads: Lead[];
  clients: Client[];
  onToggleTask: (taskId: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, leads, clients, onToggleTask }) => {
  const linkedLead = task.leadId ? leads.find(lead => lead.id === task.leadId) : null;
  const linkedClient = linkedLead ? clients.find(c => c.id === linkedLead.clientId) : null;
  const isOverdue = !task.completed && new Date(task.dueDate) < new Date(new Date().toISOString().split('T')[0]);

  return (
    <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200 transition-colors hover:bg-gray-100">
      <button onClick={() => onToggleTask(task.id)} className="mr-4 flex-shrink-0">
        {task.completed ? (
          <CheckCircleIcon className="w-6 h-6 text-green-500" solid />
        ) : (
          <CircleIcon className="w-6 h-6 text-gray-400" />
        )}
      </button>
      <div className="flex-grow">
        <p className={`text-sm font-medium text-gray-800 ${task.completed ? 'line-through text-gray-500' : ''}`}>
          {task.title}
        </p>
        <div className="flex items-center text-xs text-gray-500 mt-1 space-x-4">
            <div className={`flex items-center ${isOverdue ? 'text-red-500 font-semibold' : ''}`}>
                <CalendarIcon className="w-4 h-4 mr-1"/>
                <span>Vence em: {new Date(task.dueDate + 'T00:00:00-03:00').toLocaleDateString('pt-BR')}</span>
            </div>
            {linkedClient && (
                <div className="flex items-center">
                    <UsersIcon className="w-4 h-4 mr-1"/>
                    <span>Relacionado a: {linkedClient.name}</span>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default TaskItem;