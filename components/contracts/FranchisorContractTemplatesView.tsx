import React, { useState } from 'react';
import { useData } from '../../hooks/useData';
import { ContractTemplate } from '../../types';
import Modal from '../Modal';
import ConfirmationModal from '../ConfirmationModal';
import { PlusIcon, PencilAltIcon, TrashIcon, ClipboardDocumentIcon } from '../icons';
import AddContractTemplateForm from './AddContractTemplateForm';

const FranchisorContractTemplatesView: React.FC = () => {
    const { data, handlers } = useData();
    const { contractTemplates, products } = data;
    const [modalState, setModalState] = useState<{ isOpen: boolean; data: ContractTemplate | null }>({ isOpen: false, data: null });
    const [templateToDelete, setTemplateToDelete] = useState<ContractTemplate | null>(null);

    const getProductName = (productId: number) => {
        return products.find(p => p.id === productId)?.name || 'Todos';
    };
    
    const handleFormSubmit = (templateData: Omit<ContractTemplate, 'id'> | ContractTemplate) => {
        if ('id' in templateData) {
            handlers.updateContractTemplate(templateData);
        } else {
            handlers.addContractTemplate(templateData);
        }
        setModalState({ isOpen: false, data: null });
    };

    const handleConfirmDelete = () => {
        if (templateToDelete) {
            handlers.deleteContractTemplate(templateToDelete.id);
            setTemplateToDelete(null);
        }
    };

    return (
        <>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-3">
                        <ClipboardDocumentIcon className="w-8 h-8 text-primary"/>
                        <h2 className="text-2xl font-bold text-gray-800">Modelos de Contrato</h2>
                    </div>
                    <button onClick={() => setModalState({ isOpen: true, data: null })} className="button-primary">
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Novo Modelo
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Título do Modelo</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Serviço Vinculado</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {contractTemplates.map(template => (
                                <tr key={template.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{template.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getProductName(template.productId)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${template.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {template.isActive ? 'Ativo' : 'Inativo'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-3">
                                            <button onClick={() => setModalState({ isOpen: true, data: template })} className="text-primary hover:text-blue-700 p-1 rounded-full hover:bg-blue-100">
                                                <PencilAltIcon className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => setTemplateToDelete(template)} className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100">
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <Modal isOpen={modalState.isOpen} onClose={() => setModalState({ isOpen: false, data: null })} title={modalState.data ? "Editar Modelo" : "Novo Modelo de Contrato"}>
                <AddContractTemplateForm
                    onSubmit={handleFormSubmit}
                    onClose={() => setModalState({ isOpen: false, data: null })}
                    initialData={modalState.data}
                    products={products}
                />
            </Modal>

            <ConfirmationModal
                isOpen={!!templateToDelete}
                onClose={() => setTemplateToDelete(null)}
                onConfirm={handleConfirmDelete}
                title="Confirmar Exclusão"
                message={`Tem certeza que deseja excluir o modelo "${templateToDelete?.title}"?`}
            />
        </>
    );
};

export default FranchisorContractTemplatesView;
