import React, { useState, useEffect } from 'react';
import { FranchisorSettings, SystemUser, Product } from '../types';
import Modal from './Modal';
import ConfirmationModal from './ConfirmationModal';
import AddUserForm from './AddUserForm';
import AddProductForm from './AddProductForm';
import { MailIcon, PencilAltIcon, PhoneIcon, PlusIcon, ShieldCheckIcon, TrashIcon, UserIcon, BriefcaseIcon, PaintBrushIcon } from './icons';
import { useData } from '../hooks/useData';
import { maskPhone } from '../utils/formatters';

const SettingsView: React.FC = () => { 
    const { 
        data,
        handlers 
    } = useData();
    const { systemUsers, franchisorSettings, products } = data;
    const {
        addUser: onAddUser,
        updateUser: onUpdateUser,
        deleteUser: onDeleteUser,
        updateFranchisorSettings: onUpdateFranchisorSettings,
        addProduct: onAddProduct,
        updateProduct: onUpdateProduct,
        deleteProduct: onDeleteProduct
    } = handlers;

    const [settings, setSettings] = useState<FranchisorSettings>(franchisorSettings);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [userToDelete, setUserToDelete] = useState<SystemUser | null>(null);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);

    useEffect(() => {
        setSettings(franchisorSettings);
    }, [franchisorSettings]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        let finalValue: string | number = value;

        if (name === 'contactPhone') {
            finalValue = maskPhone(value);
        } else if (name.includes('Percentage') || name.includes('Fee')) {
            finalValue = value === '' ? '' : Number(value);
        } else if (name === 'contactName' || name === 'franchisorName') {
            finalValue = value.toUpperCase();
        }
        
        setSettings(prev => ({
            ...prev,
            [name]: finalValue,
        }));
    };

    const handleSettingsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdateFranchisorSettings(settings);
        alert('Configurações salvas com sucesso!');
    };
    
    const handleUserFormSubmit = (userData: (Omit<SystemUser, 'id'> & { password?: string }) | SystemUser) => {
        if ('id' in userData) {
            onUpdateUser(userData);
        } else {
            onAddUser(userData);
        }
        closeUserModal();
    };
    
    const handleProductFormSubmit = (productData: Omit<Product, 'id'> | Product) => {
        if ('id' in productData) {
            onUpdateProduct(productData);
        } else {
            onAddProduct(productData);
        }
        closeProductModal();
    };

    const openUserModal = (user: SystemUser | null = null) => {
        setEditingUser(user);
        setIsUserModalOpen(true);
    };

    const closeUserModal = () => {
        setEditingUser(null);
        setIsUserModalOpen(false);
    };

    const openProductModal = (product: Product | null = null) => {
        setEditingProduct(product);
        setIsProductModalOpen(true);
    };

    const closeProductModal = () => {
        setEditingProduct(null);
        setIsProductModalOpen(false);
    };

    const handleConfirmDeleteUser = () => {
        if (userToDelete) {
            onDeleteUser(userToDelete.id);
            setUserToDelete(null);
        }
    };
    
    const handleConfirmDeleteProduct = () => {
        if (productToDelete) {
            onDeleteProduct(productToDelete.id);
            setProductToDelete(null);
        }
    };


    return (
        <div className="space-y-10">
             <h1 className="page-title">Configurações do Sistema</h1>
            {/* Franchisor Settings Form */}
            <div className="card">
                <form onSubmit={handleSettingsSubmit} className="space-y-8">
                    {/* Branding Customization */}
                    <div>
                        <h3 className="section-title border-b border-border pb-2 flex items-center"><PaintBrushIcon className="w-5 h-5 mr-2" />Personalização da Marca (White-Label)</h3>
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="franchisorName" className="block text-sm font-medium text-gray-700">Nome da Franqueadora</label>
                                <input type="text" id="franchisorName" name="franchisorName" value={settings.franchisorName} onChange={handleChange} className="input-style" />
                            </div>
                            <div>
                                <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700">URL do Logo</label>
                                <input type="text" id="logoUrl" name="logoUrl" value={settings.logoUrl} onChange={handleChange} className="input-style" placeholder="Cole a URL da imagem ou Base64"/>
                            </div>
                            <div className="flex items-center gap-4">
                                <div>
                                    <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700">Cor Primária</label>
                                    <input type="color" id="primaryColor" name="primaryColor" value={settings.primaryColor} onChange={handleChange} className="mt-1 h-10 w-20 p-1 border border-border rounded-md" />
                                </div>
                                <div>
                                    <label htmlFor="secondaryColor" className="block text-sm font-medium text-gray-700">Cor Secundária</label>
                                    <input type="color" id="secondaryColor" name="secondaryColor" value={settings.secondaryColor} onChange={handleChange} className="mt-1 h-10 w-20 p-1 border border-border rounded-md" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Financial Parameters */}
                    <div>
                        <h3 className="section-title border-b border-border pb-2">Parâmetros Financeiros</h3>
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div>
                                <label htmlFor="royaltyPercentage" className="block text-sm font-medium text-gray-700">Taxa de Royalties (%)</label>
                                <input type="number" id="royaltyPercentage" name="royaltyPercentage" value={settings.royaltyPercentage} onChange={handleChange} className="input-style"/>
                            </div>
                            <div>
                                <label htmlFor="marketingFeePercentage" className="block text-sm font-medium text-gray-700">Fundo de Marketing (%)</label>
                                <input type="number" id="marketingFeePercentage" name="marketingFeePercentage" value={settings.marketingFeePercentage} onChange={handleChange} className="input-style"/>
                            </div>
                            <div>
                                <label htmlFor="defaultSoftwareFee" className="block text-sm font-medium text-gray-700">Taxa de Software (R$)</label>
                                <input type="number" id="defaultSoftwareFee" name="defaultSoftwareFee" value={settings.defaultSoftwareFee} onChange={handleChange} className="input-style"/>
                            </div>
                             <div>
                                <label htmlFor="defaultSalesCommissionPercentage" className="block text-sm font-medium text-gray-700">Comissão Vendas (%)</label>
                                <input type="number" id="defaultSalesCommissionPercentage" name="defaultSalesCommissionPercentage" value={settings.defaultSalesCommissionPercentage} onChange={handleChange} className="input-style"/>
                            </div>
                             <div>
                                <label htmlFor="initialFranchiseFee" className="block text-sm font-medium text-gray-700">Taxa de Franquia (R$)</label>
                                <input type="number" id="initialFranchiseFee" name="initialFranchiseFee" value={settings.initialFranchiseFee} onChange={handleChange} className="input-style"/>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div>
                        <h3 className="section-title border-b border-border pb-2">Informações de Contato (Suporte)</h3>
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label htmlFor="contactName" className="flex items-center text-sm font-medium text-gray-700"><UserIcon className="w-5 h-5 mr-2 text-text-secondary" />Nome do Contato</label>
                                <input type="text" id="contactName" name="contactName" value={settings.contactName} onChange={handleChange} className="input-style" placeholder="Nome completo" autoComplete="name"/>
                            </div>
                            <div>
                                <label htmlFor="contactEmail" className="flex items-center text-sm font-medium text-gray-700"><MailIcon className="w-5 h-5 mr-2 text-text-secondary" />Email de Contato</label>
                                <input type="email" id="contactEmail" name="contactEmail" value={settings.contactEmail} onChange={handleChange} className="input-style" placeholder="email@suporte.com" autoComplete="email"/>
                            </div>
                            <div>
                                <label htmlFor="contactPhone" className="flex items-center text-sm font-medium text-gray-700"><PhoneIcon className="w-5 h-5 mr-2 text-text-secondary" />Telefone de Contato</label>
                                <input type="tel" id="contactPhone" name="contactPhone" value={settings.contactPhone} onChange={handleChange} className="input-style" placeholder="(11) 99999-9999" autoComplete="tel"/>
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end pt-4 border-t border-border">
                        <button type="submit" className="button-primary">
                            Salvar Alterações
                        </button>
                    </div>
                </form>
            </div>

            {/* User Management */}
            <div className="card">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="section-title flex items-center">
                      <ShieldCheckIcon className="w-6 h-6 mr-3"/>
                      Gerenciamento de Usuários
                    </h2>
                    <button onClick={() => openUserModal()} className="flex items-center text-sm font-bold text-primary hover:text-blue-800">
                        <PlusIcon className="w-4 h-4 mr-1" />
                        Adicionar Usuário
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-border">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-text-secondary uppercase">Nome</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-text-secondary uppercase">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-text-secondary uppercase">Função</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-text-secondary uppercase">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="bg-card divide-y divide-border">
                            {systemUsers.map(user => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">{user.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{user.role}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-3">
                                            <button onClick={() => openUserModal(user)} className="text-primary hover:text-blue-700 p-1 rounded-full hover:bg-blue-100 transition-colors">
                                                <PencilAltIcon className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => setUserToDelete(user)} className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors">
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

             {/* Product Management */}
            <div className="card">
                <div className="flex justify-between items-center mb-4">
                     <h2 className="section-title flex items-center">
                        <BriefcaseIcon className="w-6 h-6 mr-3"/>
                        Gerenciamento de Produtos/Serviços
                    </h2>
                    <button onClick={() => openProductModal(null)} className="flex items-center text-sm font-bold text-primary hover:text-blue-800">
                        <PlusIcon className="w-4 h-4 mr-1" />
                        Adicionar Produto
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-border">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-text-secondary uppercase">Nome do Produto</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-text-secondary uppercase">Descrição</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-text-secondary uppercase">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-text-secondary uppercase">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="bg-card divide-y divide-border">
                            {products.map(product => (
                                <tr key={product.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">{product.name}</td>
                                    <td className="px-6 py-4 whitespace-normal text-sm text-text-secondary max-w-sm">{product.description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                                         <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {product.isActive ? 'Ativo' : 'Inativo'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-3">
                                            <button onClick={() => openProductModal(product)} className="text-primary hover:text-blue-700 p-1 rounded-full hover:bg-blue-100 transition-colors">
                                                <PencilAltIcon className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => setProductToDelete(product)} className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors">
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
            
            <Modal isOpen={isUserModalOpen} onClose={closeUserModal} title={editingUser ? "Editar Usuário" : "Adicionar Novo Usuário"}>
                <AddUserForm 
                    onSubmit={handleUserFormSubmit} 
                    onClose={closeUserModal} 
                    initialData={editingUser}
                />
            </Modal>

            <Modal isOpen={isProductModalOpen} onClose={closeProductModal} title={editingProduct ? "Editar Produto" : "Adicionar Novo Produto/Serviço"}>
                <AddProductForm 
                    onSubmit={handleProductFormSubmit}
                    onClose={closeProductModal}
                    initialData={editingProduct}
                />
            </Modal>

            <ConfirmationModal
                isOpen={!!userToDelete}
                onClose={() => setUserToDelete(null)}
                onConfirm={handleConfirmDeleteUser}
                title="Confirmar Exclusão de Usuário"
                message={`Tem certeza que deseja excluir o usuário "${userToDelete?.name}"? Esta ação não pode ser desfeita.`}
            />
            
             <ConfirmationModal
                isOpen={!!productToDelete}
                onClose={() => setProductToDelete(null)}
                onConfirm={handleConfirmDeleteProduct}
                title="Confirmar Exclusão de Produto"
                message={`Tem certeza que deseja excluir o produto "${productToDelete?.name}"?`}
            />
        </div>
    );
};


export default SettingsView;