import React, { useState } from 'react';
import { LeadNote } from '../types';

interface AddNoteFormProps {
    leadId: number;
    onAddNote: (note: Omit<LeadNote, 'id' | 'createdAt' | 'author'>) => void;
}

const AddNoteForm: React.FC<AddNoteFormProps> = ({ leadId, onAddNote }) => {
    const [text, setText] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim() === '') {
            alert('A nota não pode estar vazia.');
            return;
        }
        onAddNote({ leadId, text });
        setText('');
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md sticky top-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Adicionar Anotação</h3>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={5}
                    placeholder="Registre aqui os detalhes da ligação, e-mail ou reunião..."
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent placeholder-gray-500"
                />
                <button
                    type="submit"
                    className="mt-4 w-full bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors"
                >
                    Salvar Anotação
                </button>
            </form>
        </div>
    );
};

export default AddNoteForm;
