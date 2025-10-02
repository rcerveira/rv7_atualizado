import React, { useState, useMemo } from 'react';
import { useData } from '../../hooks/useData';
import { useAuth } from '../../hooks/useAuth';
import { ForumPost } from '../../types';
import Modal from '../Modal';
import AddPostForm from './AddPostForm';
import { PlusIcon, UserIcon, ChatBubbleLeftRightIcon } from '../icons';

const ForumPostCard: React.FC<{ post: ForumPost, onReply: (postId: number, content: string) => void }> = ({ post, onReply }) => {
    const [replyContent, setReplyContent] = useState('');
    const [showReplies, setShowReplies] = useState(false);

    const handleReplySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (replyContent.trim()) {
            onReply(post.id, replyContent.trim());
            setReplyContent('');
        }
    };

    return (
        <div className="bg-white p-5 rounded-lg shadow-md border">
            <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <UserIcon className="h-6 w-6 text-gray-500" />
                </div>
                <div>
                    <h3 className="font-bold text-lg text-gray-800">{post.title}</h3>
                    <p className="text-xs text-gray-500">
                        Por <span className="font-semibold">{post.authorName}</span> ({post.authorFranchiseName}) em {new Date(post.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                </div>
            </div>
            <p className="mt-4 text-gray-700 whitespace-pre-wrap">{post.content}</p>
            
            <div className="mt-4 pt-4 border-t">
                <button onClick={() => setShowReplies(!showReplies)} className="text-sm font-bold text-primary">
                    {showReplies ? 'Ocultar' : 'Ver'} Respostas ({post.replies.length})
                </button>
            </div>

            {showReplies && (
                <div className="mt-4 space-y-4 pl-6 border-l-2">
                    {post.replies.map(reply => (
                        <div key={reply.id} className="flex items-start space-x-3">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                                <UserIcon className="h-5 w-5 text-gray-400" />
                            </div>
                             <div>
                                <p className="text-xs text-gray-500">
                                    <span className="font-semibold text-gray-700">{reply.authorName}</span> ({reply.authorFranchiseName})
                                </p>
                                <div className="mt-1 bg-gray-50 p-2 rounded-md text-sm text-gray-800">
                                    {reply.content}
                                </div>
                            </div>
                        </div>
                    ))}
                    <form onSubmit={handleReplySubmit} className="flex items-start space-x-3">
                         <textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            rows={2}
                            placeholder="Escreva sua resposta..."
                            className="flex-1 p-2 bg-white border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm"
                        />
                        <button type="submit" className="px-4 py-2 bg-primary text-white font-semibold rounded-md text-sm">Responder</button>
                    </form>
                </div>
            )}
        </div>
    );
};

const CommunityForumView: React.FC = () => {
    const { data, handlers } = useData();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const sortedPosts = useMemo(() => {
        return [...data.forumPosts].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [data.forumPosts]);

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <ChatBubbleLeftRightIcon className="w-8 h-8 text-primary"/>
                        <h2 className="text-2xl font-bold text-gray-800">Fórum da Comunidade</h2>
                    </div>
                    <button onClick={() => setIsAddModalOpen(true)} className="button-primary">
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Criar Novo Post
                    </button>
                </div>
            </div>
            
            <div className="space-y-4">
                {sortedPosts.map(post => (
                    <ForumPostCard key={post.id} post={post} onReply={handlers.addForumReply} />
                ))}
            </div>

            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Criar Novo Post no Fórum">
                <AddPostForm 
                    onSubmit={(data) => {
                        handlers.addForumPost(data);
                        setIsAddModalOpen(false);
                    }} 
                    onClose={() => setIsAddModalOpen(false)} 
                />
            </Modal>
        </div>
    );
};

export default CommunityForumView;