
import React, { useState, useMemo } from 'react';
import { Client, Product, Sale, SaleItem, FranchiseUserRole } from '../../types';
import { useData } from '../../hooks/useData';
import { useAuth } from '../../hooks/useAuth';
import { ArrowLeftIcon, PlusIcon, TrashIcon, CalendarIcon } from '../icons';

interface CreateSaleViewProps {
    client: Client;
    leadId?: number;
    onSaleCreated: () => void;
    onCancel: () => void;
}

type LineItem = Omit<SaleItem, 'id' | 'saleId'>;

const CreateSaleView: React.FC<CreateSaleViewProps> = ({ client, leadId, onSaleCreated, onCancel }) => {
    const { selectedFranchiseData, handlers } = useData();
    const { user } = useAuth();

    const [lineItems, setLineItems] = useState<LineItem[]>([{ productId: 0, productName: '', value: 0 }]);
    const [paymentMethod, setPaymentMethod] = useState<'À Vista' | 'Parcelado'>('À Vista');
    const [installments, setInstallments] = useState(1);
    const [observations, setObservations] = useState('');

    if (!selectedFranchiseData || !user) return null;
    const { franchise, franchiseUsers, products } = selectedFranchiseData;

    const availableProducts = useMemo(() => {
        return franchise.allowedProductIds
            ? products.filter(p => franchise.allowedProductIds?.includes(p.id) && p.isActive)
            : products.filter(p => p.isActive);
    }, [products, franchise]);

    const totalAmount = useMemo(() => {
        return lineItems.reduce((sum, item) => sum + item.value, 0);
    }, [lineItems]);
    
    const handleItemChange = (index: number, field: keyof LineItem, value: any) => {
        const newLineItems = [...lineItems];
        const currentItem = { ...newLineItems[index] };
        
        if (field === 'productId') {
            const selectedProduct = availableProducts.find(p => p.id === Number(value));
            currentItem.productId = Number(value);
            currentItem.productName = selectedProduct?.name || '';
        } else if (field === 'value') {
            currentItem.value = Number(value);
        }
        
        newLineItems[index] = currentItem;
        setLineItems(newLineItems);
    };

    const addLineItem = () => {
        setLineItems([...lineItems, { productId: 0, productName: '', value: 0 }]);
    };

    const removeLineItem = (index: number) => {
        if(lineItems.length > 1) {
            setLineItems(lineItems.filter((_, i) => i !== index));
        }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (lineItems.some(item => item.productId === 0 || item.value <= 0)) {
            alert("Por favor, selecione um produto e insira um valor válido para todos os itens.");
            return;
        }

        const currentUser = franchiseUsers.find(fu => fu.email === user.email);

        const saleData: Omit<Sale, 'id' | 'status'> = {
            franchiseId: franchise.id,
            clientId: client.id,
            leadId,
            salespersonId: currentUser?.role === FranchiseUserRole.SALESPERSON ? currentUser.id : undefined,
            saleDate: new Date().toISOString(),
            totalAmount,
            paymentMethod,
            installments: paymentMethod === 'Parcelado' ? installments : 1,
            observations,
        };
        
        await handlers.addSale(saleData, lineItems);
        onSaleCreated();
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-4xl mx-auto">
             <button onClick={onCancel} className="flex items-center text-sm font-medium text-primary hover:text-blue-800 mb-6">
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Cancelar e Voltar
            </button>
            <h2 className="text-3xl font-bold text-gray-800">Registrar Nova Venda</h2>
            <p className="text-gray-500 mt-1">Cliente: <span className="font-semibold text-gray-700">{client.name}</span></p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-8">
                {/* Sale Items */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Itens da Venda</h3>
                    <div className="space-y-4">
                        {lineItems.map((item, index) => (
                             <div key={index} className="grid grid-cols-12 gap-4 items-end p-3 bg-gray-50 rounded-lg border">
                                <div className="col-span-12 sm:col-span-6">
                                    <label className="block text-sm font-medium text-gray-700">Produto/Serviço</label>
                                    <select value={item.productId} onChange={e => handleItemChange(index, 'productId', e.target.value)} className="mt-1 block w-full input-style">
                                        <option value={0} disabled>Selecione...</option>
                                        {availableProducts.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                </div>
                                <div className="col-span-10 sm:col-span-5">
                                    <label className="block text-sm font-medium text-gray-700">Valor (R$)</label>
                                    <input type="number" value={item.value} onChange={e => handleItemChange(index, 'value', e.target.value)} className="mt-1 block w-full input-style" />
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                     <button type="button" onClick={() => removeLineItem(index)} className="p-2 text-red-500 hover:bg-red-100 rounded-full disabled:opacity-50" disabled={lineItems.length <= 1}>
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button type="button" onClick={addLineItem} className="mt-4 flex items-center text-sm font-bold text-primary hover:text-blue-800">
                        <PlusIcon className="w-4 h-4 mr-2" /> Adicionar Item
                    </button>
                </div>

                 {/* Payment */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Financeiro e Pagamento</h3>
                    <div className="p-4 bg-gray-50 rounded-lg border grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Forma de Pagamento</label>
                            <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value as any)} className="mt-1 block w-full input-style">
                                <option>À Vista</option>
                                <option>Parcelado</option>
                            </select>
                        </div>
                        {paymentMethod === 'Parcelado' && (
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Nº de Parcelas</label>
                                <input type="number" value={installments} onChange={e => setInstallments(Math.max(2, Number(e.target.value)))} className="mt-1 block w-full input-style" min="2" />
                            </div>
                        )}
                        <div className="md:col-start-3 flex flex-col justify-end items-end">
                            <p className="text-sm text-gray-500">Valor Total</p>
                            <p className="text-3xl font-bold text-primary">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalAmount)}</p>
                        </div>
                    </div>
                </div>
                
                 {/* Observations */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Observações (Opcional)</h3>
                    <textarea
                        value={observations}
                        onChange={(e) => setObservations(e.target.value)}
                        rows={3}
                        placeholder="Insira aqui qualquer informação adicional sobre a venda, como acordos especiais, próximos passos, etc."
                        className="mt-1 block w-full input-style"
                    />
                </div>

                {/* Actions */}
                <div className="pt-6 border-t flex justify-end">
                    <button type="submit" className="button-primary px-10 py-3 text-base">
                        Finalizar e Registrar Venda
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateSaleView;