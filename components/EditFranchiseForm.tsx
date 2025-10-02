import React, { useState, useEffect } from 'react';
import { Franchise, Product } from '../types';
import { maskCNPJ, maskPhone } from '../utils/formatters';

interface EditFranchiseFormProps {
  franchise: Franchise;
  allProducts: Product[];
  onSubmit: (franchise: Franchise) => void;
  onClose: () => void;
}

const EditFranchiseForm: React.FC<EditFranchiseFormProps> = ({ franchise, allProducts, onSubmit, onClose }) => {
  const [formData, setFormData] = useState<Franchise>(franchise);

  useEffect(() => {
    setFormData(franchise);
  }, [franchise]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let finalValue = value;
    if (name === 'cnpj') finalValue = maskCNPJ(value);
    if (name === 'ownerPhone') finalValue = maskPhone(value);

    const upperCaseFields = ['name', 'corporateName', 'location', 'ownerName'];
    if (upperCaseFields.includes(name)) {
        finalValue = value.toUpperCase();
    }

    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleProductToggle = (productId: number) => {
    const currentIds = formData.allowedProductIds || [];
    const newIds = currentIds.includes(productId)
      ? currentIds.filter(id => id !== productId)
      : [...currentIds, productId];
    setFormData(prev => ({ ...prev, allowedProductIds: newIds }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[75vh] overflow-y-auto pr-2">
      <div>
        <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Detalhes da Franquia</h3>
        <div className="space-y-4 mt-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome da Franquia</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-text-primary" required />
          </div>
          <div>
            <label htmlFor="corporateName" className="block text-sm font-medium text-gray-700">Razão Social</label>
            <input type="text" id="corporateName" name="corporateName" value={formData.corporateName} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-text-primary" required />
          </div>
          <div>
            <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700">CNPJ</label>
            <input type="text" id="cnpj" name="cnpj" value={formData.cnpj} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-text-primary" required />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Localização</label>
            <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-text-primary" required />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 border-b pb-2 pt-4">Detalhes do Proprietário</h3>
        <div className="space-y-4 mt-4">
            <div>
                <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700">Nome do Proprietário</label>
                <input type="text" id="ownerName" name="ownerName" value={formData.ownerName} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-text-primary" required />
            </div>
            <div>
                <label htmlFor="ownerEmail" className="block text-sm font-medium text-gray-700">Email do Proprietário</label>
                <input type="email" id="ownerEmail" name="ownerEmail" value={formData.ownerEmail} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-text-primary" required />
            </div>
            <div>
                <label htmlFor="ownerPhone" className="block text-sm font-medium text-gray-700">Telefone do Proprietário</label>
                <input type="tel" id="ownerPhone" name="ownerPhone" value={formData.ownerPhone} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-text-primary" required />
            </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Produtos Ativos</h3>
        <div className="mt-4 space-y-3">
          {allProducts.filter(p => p.isActive).map(product => (
            <label key={product.id} className="flex items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.allowedProductIds?.includes(product.id) || false}
                onChange={() => handleProductToggle(product.id)}
                className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="ml-3 text-sm font-medium text-gray-800">{product.name}</span>
            </label>
          ))}
           {allProducts.filter(p => p.isActive).length === 0 && (
                <p className="text-sm text-gray-500">Nenhum produto ativo cadastrado no sistema. Adicione produtos na tela de Configurações.</p>
           )}
        </div>
      </div>

      <div className="flex justify-end pt-4 space-x-2 border-t mt-6">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancelar</button>
        <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-800">Salvar Alterações</button>
      </div>
    </form>
  );
};

export default EditFranchiseForm;