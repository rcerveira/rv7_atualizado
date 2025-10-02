
import React, { useState } from 'react';
import { Franchise, FranchiseUser, Product } from '../types';
import { BriefcaseIcon, DocumentReportIcon, PencilAltIcon, PlusIcon, TrashIcon, UserIcon } from './icons';
import Modal from './Modal';
import ConfirmationModal from './ConfirmationModal';
import AddFranchiseUserForm from './AddFranchiseUserForm';
import { useData } from '../hooks/useData';

const DetailItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{value || '-'}</dd>
    </div>
);

const FranchiseDetailsView: React.FC = () => {
  const { selectedFranchiseData, handlers } = useData();
  const [userModal, setUserModal] = useState<{ isOpen: boolean; data: FranchiseUser | null }>({ isOpen: false, data: null });
  const [userToDelete, setUserToDelete] = useState<FranchiseUser | null>(null);

  if (!selectedFranchiseData) return null;
  const { franchise, franchiseUsers, products } = selectedFranchiseData;
  const { addFranchiseUser, updateFranchiseUser, deleteFranchiseUser } = handlers;

  const handleUserSubmit = (userData: (Omit<FranchiseUser, 'id' | 'franchiseId'> & { password?: string }) | (Omit<FranchiseUser, 'franchiseId'> & { id: number })) => {
    if ('id' in userData) {
        updateFranchiseUser({ ...userData, franchiseId: franchise.id });
    } else {
        addFranchiseUser({ ...userData, franchiseId: franchise.id });
    }
    setUserModal({ isOpen: false, data: null });
  };
  
  const handleConfirmDelete = () => {
    if (userToDelete) {
        deleteFranchiseUser(userToDelete.id);
        setUserToDelete(null);
    }
  };

  const allowedProducts = franchise.allowedProductIds
      ? products.filter((p: Product) => franchise.allowedProductIds!.includes(p.id))
      : [];

  return (
    <>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex items-center space-x-3">
              <DocumentReportIcon className="w-8 h-8 text-primary"/>
              <h2 className="text-2xl font-bold text-gray-800">Dados da Franquia</h2>
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="px-4 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 py-4">Informações da Empresa</h3>
              <DetailItem label="Razão Social" value={franchise.corporateName} />
              <DetailItem label="CNPJ" value={franchise.cnpj} />
              <DetailItem label="Localização" value={franchise.location} />
              <DetailItem label="Data de Inauguração" value={new Date(franchise.inaugurationDate + 'T00:00:00').toLocaleDateString('pt-BR')} />
            </div>
            <div className="px-4 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 pt-8 pb-4">Informações do Proprietário</h3>
              <DetailItem label="Nome do Proprietário" value={franchise.ownerName} />
              <DetailItem label="E-mail de Contato" value={franchise.ownerEmail} />
              <DetailItem label="Telefone de Contato" value={franchise.ownerPhone} />
            </div>
          </dl>
        </div>
      </div>

       <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div className="flex items-center space-x-3">
                <BriefcaseIcon className="w-6 h-6 text-primary"/>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Produtos/Serviços Ativos</h3>
            </div>
        </div>
        <div className="border-t border-gray-200">
            {allowedProducts.length > 0 ? (
                <ul role="list" className="divide-y divide-gray-200">
                    {allowedProducts.map((product: Product) => (
                        <li key={product.id} className="px-6 py-4">
                            <p className="text-sm font-medium text-gray-900">{product.name}</p>
                            <p className="text-sm text-gray-500">{product.description}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="px-6 py-4 text-sm text-gray-500">Nenhum produto ativo configurado para esta franquia.</p>
            )}
        </div>
      </div>

      <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div className="flex items-center space-x-3">
                <UserIcon className="w-6 h-6 text-primary"/>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Equipe da Franquia</h3>
            </div>
            <button onClick={() => setUserModal({ isOpen: true, data: null })} className="flex items-center text-sm font-medium text-primary hover:text-blue-800">
                <PlusIcon className="w-4 h-4 mr-1" />
                Adicionar Membro
            </button>
        </div>
        <div className="border-t border-gray-200">
            <ul role="list" className="divide-y divide-gray-200">
                {franchiseUsers.map((user) => (
                    <li key={user.id} className="flex items-center justify-between px-6 py-4">
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                            <p className="text-sm text-gray-500 truncate">{user.email}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {user.role}
                            </span>
                            <div className="flex items-center space-x-2">
                                <button onClick={() => setUserModal({ isOpen: true, data: user })} className="text-primary hover:text-blue-700 p-1 rounded-full hover:bg-blue-100 transition-colors">
                                    <PencilAltIcon className="w-5 h-5" />
                                </button>
                                <button onClick={() => setUserToDelete(user)} className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors">
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
      </div>
      
      <Modal isOpen={userModal.isOpen} onClose={() => setUserModal({ isOpen: false, data: null })} title={userModal.data ? "Editar Membro da Equipe" : "Adicionar Membro à Equipe"}>
          <AddFranchiseUserForm onSubmit={handleUserSubmit} onClose={() => setUserModal({ isOpen: false, data: null })} initialData={userModal.data} />
      </Modal>

      <ConfirmationModal
          isOpen={!!userToDelete}
          onClose={() => setUserToDelete(null)}
          onConfirm={handleConfirmDelete}
          title="Confirmar Exclusão"
          message={`Tem certeza que deseja remover "${userToDelete?.name}" da equipe?`}
      />
    </>
  );
};

export default FranchiseDetailsView;
