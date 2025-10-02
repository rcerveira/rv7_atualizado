import React, { useState } from 'react';
import { ForumPost } from '../../types';

interface AddPostFormProps {
    onSubmit: (postData: Omit<ForumPost, 'id' | 'authorId' | 'authorName' | 'authorFranchiseName' | 'createdAt' | 'replies'>) => void;
    onClose: () => void;
}

const AddPostForm: React.FC<AddPostFormProps> = ({ onSubmit, onClose }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isPinned, setIsPinned] = useState(false); // Only for franchisor view, but we can include it

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            alert("Título e conteúdo são obrigatórios.");
            return;
        }
        onSubmit({ title, content, isPinned });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título do Post</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 block w-full input-style"
                    required
                />
            </div>
            <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">Conteúdo</label>
                <textarea
                    id="content"
                    rows={6}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="mt-1 block w-full input-style"
                    placeholder="Compartilhe sua dúvida, dica ou experiência..."
                    required
                />
            </div>
            <div className="flex justify-end pt-4 space-x-2 border-t">
                <button type="button" onClick={onClose} className="button-secondary">
                    Cancelar
                </button>
                <button type="submit" className="button-primary">
                    Publicar Post
                </button>
            </div>
        </form>
    );
};

export default AddPostForm;