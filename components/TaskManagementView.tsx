import React, { useState, useMemo } from 'react';
import { Task, Lead, Client } from '../types';
import Modal from './Modal';
import AddTaskForm from './AddTaskForm';
import TaskItem from './TaskItem';
import { CalendarIcon, PlusIcon } from './icons';
import { useData } from '../hooks/useData';

const TaskManagementView: React.FC = () => {
    const { selectedFranchiseData, handlers } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!selectedFranchiseData) return null;

    const { franchise, tasks, leads, clients } = selectedFranchiseData;
    const { addTask: onAddTask, toggleTask: onToggleTask } = handlers;

    const handleAddTaskSubmit = (task: Omit<Task, 'id' | 'franchiseId' | 'completed'>) => {
        onAddTask({ ...task, franchiseId: franchise.id });
    };

    const { overdue, today, upcoming } = useMemo(() => {
        const todayStr = new Date().toISOString().split('T')[0];
        const overdueTasks: Task[] = [];
        const todayTasks: Task[] = [];
        const upcomingTasks: Task[] = [];

        tasks.filter(t => !t.completed).forEach(task => {
            if (task.dueDate < todayStr) {
                overdueTasks.push(task);
            } else if (task.dueDate === todayStr) {
                todayTasks.push(task);
            } else {
                upcomingTasks.push(task);
            }
        });

        const sortByDueDate = (a: Task, b: Task) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        overdueTasks.sort(sortByDueDate);
        todayTasks.sort(sortByDueDate);
        upcomingTasks.sort(sortByDueDate);


        return { overdue: overdueTasks, today: todayTasks, upcoming: upcomingTasks };
    }, [tasks]);
    
    const completedTasks = useMemo(() => {
        return tasks.filter(t => t.completed).sort((a,b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
    }, [tasks]);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <CalendarIcon className="w-8 h-8 text-primary"/>
                    <h2 className="text-2xl font-bold text-gray-800">Agenda de Tarefas</h2>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center bg-primary hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105">
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Nova Tarefa
                </button>
            </div>
            
            <div className="space-y-6">
                <TaskSection title="Atrasadas" tasks={overdue} leads={leads} clients={clients} onToggleTask={onToggleTask} />
                <TaskSection title="Hoje" tasks={today} leads={leads} clients={clients} onToggleTask={onToggleTask} />
                <TaskSection title="Próximas Tarefas" tasks={upcoming} leads={leads} clients={clients} onToggleTask={onToggleTask} />
                <TaskSection title="Concluídas" tasks={completedTasks} leads={leads} clients={clients} onToggleTask={onToggleTask} isCompletedSection />
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Adicionar Nova Tarefa">
                <AddTaskForm onAdd={handleAddTaskSubmit} onClose={() => setIsModalOpen(false)} leads={leads} clients={clients} />
            </Modal>
        </div>
    );
};

interface TaskSectionProps {
    title: string;
    tasks: Task[];
    leads: Lead[];
    clients: Client[];
    onToggleTask: (taskId: number) => void;
    isCompletedSection?: boolean;
}

const TaskSection: React.FC<TaskSectionProps> = ({ title, tasks, leads, clients, onToggleTask, isCompletedSection = false }) => {
    if (tasks.length === 0 && !isCompletedSection) return null;

    return (
         <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{title} ({tasks.length})</h3>
            {tasks.length > 0 ? (
                <div className="space-y-3">
                    {tasks.map(task => (
                        <TaskItem key={task.id} task={task} leads={leads} clients={clients} onToggleTask={onToggleTask} />
                    ))}
                </div>
            ) : (
                <p className="text-sm text-gray-500">Nenhuma tarefa aqui.</p>
            )}
        </div>
    );
};


export default TaskManagementView;
