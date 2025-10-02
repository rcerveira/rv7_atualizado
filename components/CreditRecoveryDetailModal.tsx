import React, { useState } from 'react';
import { CreditRecoveryCase, Client, InternalNote, CreditRecoveryStatus } from '../types';
import Modal from './Modal';
import { UserIcon, CalendarIcon } from './icons';

interface CreditRecoveryDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  creditCase: CreditRecoveryCase;
  client: Client;
  onAddNote: (caseId: number, noteText: string) => void;
}

const statusColorMap: Record<CreditRecoveryStatus, string> = {
  [CreditRecoveryStatus.INITIAL_CONTACT]: 'bg-gray-100 text-gray-800',
  [CreditRecoveryStatus.NEGOTIATING]: 'bg-blue-100 text-blue-800',
  [CreditRecoveryStatus.RESOLVED]: 'bg-green-100 text-green-800',
  [CreditRecoveryStatus.UNRESOLVED]: 'bg-red-100 text-red-800',
};

const CreditRecoveryDetailModal: React.FC<CreditRecoveryDetailModalProps> = ({ isOpen, onClose, creditCase, client, onAddNote }) => {
    const [noteText, setNoteText] = useState('');

    if (!isOpen) return null;

    const handleAddNote = () => {
        if (noteText.trim()) {
            onAddNote(creditCase.id, noteText.trim());
            setNoteText('');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Recuperação de Crédito: ${client.name}`}>
            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
                
                {/* Case Details */}
                <div className="p-4 bg-gray-50 rounded-lg border">
                    <h4 className="text-md font-semibold text-gray-800 mb-2">Detalhes do Caso</h4>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <div className="font-medium text-gray-500">Valor da Dívida:</div>
                        <div className="font-semibold text-gray-900">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(creditCase.debtAmount)}</div>
                        
                        <div className="font-medium text-gray-500">Status:</div>
                        <div><span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColorMap[creditCase.status]}`}>{creditCase.status}</span></div>

                        <div className="font-medium text-gray-500">Último Contato:</div>
                        <div className="text-gray-900">{new Date(creditCase.lastContactDate).toLocaleDateString('pt-BR')}</div>
                    </div>
                </div>

                {/* Contact History */}
                <div>
                    <h4 className="text-md font-semibold text-gray-800 mb-2">Histórico de Contatos</h4>
                    {creditCase.contactHistory.length > 0 ? (
                        <ul className="space-y-2">
                           {creditCase.contactHistory.map((entry, index) => (
                               <li key={index} className="flex items-start text-sm">
                                   <CalendarIcon className="w-4 h-4 text-gray-500 mt-1 mr-2 flex-shrink-0" />
                                   <div>
                                       <span className="font-semibold">{new Date(entry.date).toLocaleDateString('pt-BR')}:</span>
                                       <span className="text-gray-700 ml-1">{entry.summary}</span>
                                   </div>
                               </li>
                           ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500 italic">Nenhum histórico de contato registrado.</p>
                    )}
                </div>

                {/* Internal Notes */}
                 <div>
                    <h4 className="text-md font-semibold text-gray-800 mb-3">Anotações Internas</h4>
                    <div className="space-y-4">
                        {creditCase.internalNotes.length > 0 ? (
                            creditCase.internalNotes.map(note => (
                                <div key={note.id} className="flex items-start">
                                    <div className="flex-shrink-0 mr-3">
                                        <span className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                            <UserIcon className="w-5 h-5 text-gray-600" />
                                        </span>
                                    </div>
                                    <div className="flex-1 bg-gray-50 p-2 border rounded-md">
                                        <p className="text-sm text-gray-800">{note.text}</p>
                                        <p className="text-xs text-gray-500 mt-1">{note.author} - {new Date(note.createdAt).toLocaleString('pt-BR')}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500 italic">Nenhuma anotação interna.</p>
                        )}
                    </div>
                </div>


                {/* Add Note Form */}
                <div className="pt-4 border-t">
                     <h4 className="text-md font-semibold text-gray-800 mb-2">Adicionar Anotação</h4>
                    <textarea
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        rows={3}
                        className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        placeholder="Registre o andamento da negociação..."
                    />
                    <div className="text-right mt-2">
                         <button onClick={handleAddNote} className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-md hover:bg-blue-800">
                            Salvar Nota
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default CreditRecoveryDetailModal;