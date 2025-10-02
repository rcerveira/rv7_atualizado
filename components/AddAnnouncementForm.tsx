import React, { useState } from 'react';
import { Announcement } from '../types';

interface AddAnnouncementFormProps {
    onSubmit: (announcement: Omit<Announcement, 'id' | 'author' | 'createdAt'>) => void;
    onClose: () => void;
}

const AddAnnouncementForm: React.FC<AddAnnouncementFormProps> = ({ onSubmit, onClose }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isPinned, setIsPinned] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !content) {
            alert("Título e conteúdo são obrigatórios.");
            return;
        }
        onSubmit({ title, content, isPinned });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    required
                />
            </div>
            <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">Conteúdo do Comunicado</label>
                <textarea
                    id="content"
                    rows={5}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    required
                />
            </div>
             <div className="flex items-start">
                <div className="flex items-center h-5">
                <input
                    id="isPinned"
                    name="isPinned"
                    type="checkbox"
                    checked={isPinned}
                    onChange={(e) => setIsPinned(e.target.checked)}
                    className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                />
                </div>
                <div className="ml-3 text-sm">
                <label htmlFor="isPinned" className="font-medium text-gray-700">Fixar no Topo</label>
                <p className="text-gray-500">Comunicados fixados aparecerão sempre primeiro para os franqueados.</p>
                </div>
            </div>
            <div className="flex justify-end pt-4 space-x-2">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                    Cancelar
                </button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-800">
                    Publicar Comunicado
                </button>
            </div>
        </form>
    );
};

export default AddAnnouncementForm;
