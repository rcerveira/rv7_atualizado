import React, { useMemo } from 'react';
import { LeadNote, Task } from '../types';
import { CheckCircleIcon, UserIcon } from './icons';

interface ActivityFeedProps {
    notes: LeadNote[];
    tasks: Task[];
}

type FeedItem = 
    | { type: 'note'; data: LeadNote; date: Date }
    | { type: 'task'; data: Task; date: Date };

const ActivityFeed: React.FC<ActivityFeedProps> = ({ notes, tasks }) => {
    
    const sortedFeed = useMemo<FeedItem[]>(() => {
        const combined: FeedItem[] = [];

        notes.forEach(note => {
            combined.push({ type: 'note', data: note, date: new Date(note.createdAt) });
        });

        tasks.filter(task => task.completed).forEach(task => {
            // Use task due date as the event date for sorting
            combined.push({ type: 'task', data: task, date: new Date(task.dueDate) });
        });

        return combined.sort((a, b) => b.date.getTime() - a.date.getTime());
    }, [notes, tasks]);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Histórico de Atividades</h3>
            {sortedFeed.length > 0 ? (
                <div className="flow-root">
                    <ul role="list" className="-mb-8">
                        {sortedFeed.map((item, itemIdx) => (
                            <li key={`${item.type}-${item.data.id}`}>
                                <div className="relative pb-8">
                                    {itemIdx !== sortedFeed.length - 1 ? (
                                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                                    ) : null}
                                    <div className="relative flex space-x-3">
                                        <div>
                                            <span className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center ring-8 ring-white">
                                                {item.type === 'note' ? (
                                                    <UserIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
                                                ) : (
                                                    <CheckCircleIcon className="h-5 w-5 text-green-500" aria-hidden="true" />
                                                )}
                                            </span>
                                        </div>
                                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                            <div>
                                                {item.type === 'note' ? (
                                                    <>
                                                        <p className="text-sm text-gray-500">
                                                            Nota adicionada por <span className="font-medium text-gray-900">{item.data.author}</span>
                                                        </p>
                                                        <div className="mt-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-md border">
                                                            <p>{item.data.text}</p>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <p className="text-sm text-gray-500">
                                                        Tarefa concluída: <span className="font-medium text-gray-900">{item.data.title}</span>
                                                    </p>
                                                )}
                                            </div>
                                            <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                                <time dateTime={item.date.toISOString()}>
                                                    {item.date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </time>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p className="text-sm text-gray-500 text-center py-4">Nenhuma atividade registrada para este lead ainda.</p>
            )}
        </div>
    );
};

export default ActivityFeed;