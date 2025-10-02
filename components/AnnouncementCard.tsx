import React from 'react';
import { Announcement } from '../types';
import { TrashIcon } from './icons';

interface AnnouncementCardProps {
    announcement: Announcement;
    onDelete?: (id: number) => void;
}

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({ announcement, onDelete }) => {
    const canDelete = !!onDelete;
    
    return (
        <div className={`p-5 rounded-lg border ${announcement.isPinned ? 'bg-blue-50 border-primary' : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-bold text-lg text-gray-800">{announcement.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">
                        Por {announcement.author} em {new Date(announcement.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    {announcement.isPinned && (
                        <span className="text-xs font-semibold text-primary bg-blue-100 px-2 py-1 rounded-full">Fixo</span>
                    )}
                    {canDelete && (
                        <button onClick={() => onDelete(announcement.id)} className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors">
                           <TrashIcon className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>
            <p className="text-sm text-gray-700 mt-3 whitespace-pre-wrap">{announcement.content}</p>
        </div>
    );
};

export default AnnouncementCard;
