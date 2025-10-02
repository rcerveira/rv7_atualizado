import React, { useMemo } from 'react';
import { useData } from '../../../hooks/useData';
import { CalendarIcon, CheckCircleIcon } from '../../icons';

const TodayTasks: React.FC = () => {
    const { selectedFranchiseData } = useData();
    const tasks = selectedFranchiseData?.tasks || [];

    const todayTasks = useMemo(() => {
        const todayStr = new Date().toISOString().split('T')[0];
        return tasks
            .filter(task => !task.completed && task.dueDate <= todayStr)
            .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    }, [tasks]);
    
    const isOverdue = (dueDate: string) => new Date(dueDate) < new Date(new Date().toISOString().split('T')[0]);

    return (
        <div className="card h-full">
            <div className="flex items-center mb-4">
                <CalendarIcon className="w-6 h-6 text-primary mr-3" />
                <h3 className="section-title">Agenda do Dia</h3>
            </div>
            <div className="space-y-3">
                {todayTasks.length > 0 ? (
                    todayTasks.slice(0, 5).map(task => (
                        <div key={task.id} className="p-3 bg-gray-50 rounded-lg border flex items-start">
                            <CheckCircleIcon className="w-5 h-5 text-gray-300 mr-3 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-text-primary">{task.title}</p>
                                <p className={`text-xs font-bold ${isOverdue(task.dueDate) ? 'text-red-600' : 'text-text-secondary'}`}>
                                    Vence: {new Date(task.dueDate + 'T00:00:00').toLocaleDateString('pt-BR')}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-text-secondary">
                        <p>Nenhuma tarefa para hoje. Tudo em dia!</p>
                    </div>
                )}
            </div>
             {todayTasks.length > 5 && (
                 <p className="text-center text-sm text-text-secondary mt-4">e mais {todayTasks.length - 5}...</p>
             )}
            <button className="w-full mt-4 text-sm font-bold text-primary hover:underline">
                Ver todas as tarefas
            </button>
        </div>
    );
};

export default TodayTasks;