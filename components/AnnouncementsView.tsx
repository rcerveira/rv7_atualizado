import React, { useState, useMemo } from 'react';
import { Announcement } from '../types';
import { MegaphoneIcon, PlusIcon } from './icons';
import Modal from './Modal';
import ConfirmationModal from './ConfirmationModal';
import AddAnnouncementForm from './AddAnnouncementForm';
import AnnouncementCard from './AnnouncementCard';
import { useAuth } from '../hooks/useAuth';

interface AnnouncementsViewProps {
    announcements: Announcement[];
    onAddAnnouncement?: (announcement: Omit<Announcement, 'id' | 'author' | 'createdAt'>) => void;
    onDeleteAnnouncement?: (id: number) => void;
}

const AnnouncementsView: React.FC<AnnouncementsViewProps> = ({ announcements, onAddAnnouncement, onDeleteAnnouncement }) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [announcementToDelete, setAnnouncementToDelete] = useState<Announcement | null>(null);
    const { user } = useAuth();

    const isFranchisorView = !!onAddAnnouncement;

    const handleAddSubmit = (data: Omit<Announcement, 'id' | 'author' | 'createdAt'>) => {
        if (onAddAnnouncement) {
            onAddAnnouncement(data);
            setIsAddModalOpen(false);
        }
    };
    
    const handleConfirmDelete = () => {
        if (announcementToDelete && onDeleteAnnouncement) {
            onDeleteAnnouncement(announcementToDelete.id);
            setAnnouncementToDelete(null);
        }
    };
    
    const sortedAnnouncements = useMemo(() => {
        return [...announcements].sort((a, b) => {
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
    }, [announcements]);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-3">
                    <MegaphoneIcon className="w-8 h-8 text-primary"/>
                    <h2 className="text-2xl font-bold text-gray-800">Comunicados da Rede</h2>
                </div>
                {isFranchisorView && (
                    <button onClick={() => setIsAddModalOpen(true)} className="flex items-center justify-center bg-primary hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg shadow-md">
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Novo Comunicado
                    </button>
                )}
            </div>

            <div className="space-y-4">
                {sortedAnnouncements.length > 0 ? (
                    sortedAnnouncements.map(ann => (
                        <AnnouncementCard 
                            key={ann.id} 
                            announcement={ann}
                            onDelete={isFranchisorView ? () => setAnnouncementToDelete(ann) : undefined}
                        />
                    ))
                ) : (
                    <p className="text-center text-gray-500 py-8">Nenhum comunicado publicado ainda.</p>
                )}
            </div>
            
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Novo Comunicado">
                <AddAnnouncementForm onSubmit={handleAddSubmit} onClose={() => setIsAddModalOpen(false)} />
            </Modal>

            <ConfirmationModal
                isOpen={!!announcementToDelete}
                onClose={() => setAnnouncementToDelete(null)}
                onConfirm={handleConfirmDelete}
                title="Confirmar Exclusão"
                message={`Tem certeza que deseja excluir o comunicado "${announcementToDelete?.title}"?`}
            />
        </div>
    );
};

export default AnnouncementsView;
