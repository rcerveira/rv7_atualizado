import React, { useState, useMemo } from 'react';
import { Sale, Contract, ContractStatus } from '../../types';
import { useData } from '../../hooks/useData';
import Modal from '../Modal';
// FIX: Removed `UploadIcon` from this import as it's defined locally below.
import { DocumentReportIcon } from '../icons'; 

const UploadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    </svg>
);


interface SaleDetailModalProps {
    sale: Sale;
    isOpen: boolean;
    onClose: () => void;
}

const SaleDetailModal: React.FC<SaleDetailModalProps> = ({ sale, isOpen, onClose }) => {
    const { selectedFranchiseData, data, handlers } = useData();
    const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
    const [signedContractFile, setSignedContractFile] = useState<File | null>(null);

    const { clients, contracts, saleItems } = selectedFranchiseData!;
    const { contractTemplates } = data;

    const saleContract = useMemo(() => {
        return contracts.find(c => c.saleId === sale.id);
    }, [contracts, sale.id]);

    const client = clients.find(c => c.id === sale.clientId);
    const itemsOfThisSale = saleItems.filter(i => i.saleId === sale.id);
    
    // Suggest templates based on products in sale
    const relevantTemplates = useMemo(() => {
        const productIdsInSale = new Set(itemsOfThisSale.map(i => i.productId));
        return contractTemplates.filter(t => t.isActive && productIdsInSale.has(t.productId));
    }, [itemsOfThisSale, contractTemplates]);

    const handleGenerateContract = () => {
        if (!selectedTemplateId) {
            alert("Por favor, selecione um modelo de contrato.");
            return;
        }
        handlers.generateContract(sale.id, Number(selectedTemplateId));
    };
    
    const handleStatusChange = (newStatus: ContractStatus) => {
        if (saleContract) {
            handlers.updateContractStatus(saleContract.id, newStatus);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSignedContractFile(event.target.files[0]);
        }
    };


    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Detalhes da Venda #${sale.id}`} maxWidth="max-w-4xl">
            <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-3">
                
                {/* Sale and Client Info */}
                <div className="p-4 bg-gray-50 border rounded-lg">
                    <h3 className="font-semibold text-lg text-gray-800">Resumo da Venda</h3>
                    <p><strong>Cliente:</strong> {client?.name}</p>
                    <p><strong>Data:</strong> {new Date(sale.saleDate).toLocaleDateString('pt-BR')}</p>
                    <p><strong>Valor Total:</strong> {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sale.totalAmount)}</p>
                </div>

                {/* Observations */}
                {sale.observations && (
                    <div className="p-4">
                        <h3 className="font-semibold text-lg text-gray-800">Observações</h3>
                        <p className="mt-2 text-gray-600 whitespace-pre-wrap bg-gray-50 border rounded-md p-3">{sale.observations}</p>
                    </div>
                )}

                {/* Contract Section */}
                <div className="border rounded-lg">
                    <div className="p-4 border-b">
                         <h3 className="font-semibold text-lg text-gray-800">Gestão do Contrato</h3>
                    </div>
                    {saleContract ? (
                        <div className="p-4 space-y-4">
                            <div className="flex justify-between items-center">
                                <label htmlFor="contractStatus" className="font-medium text-gray-700">Status do Contrato:</label>
                                <select 
                                    id="contractStatus"
                                    value={saleContract.status} 
                                    onChange={(e) => handleStatusChange(e.target.value as ContractStatus)} 
                                    className="input-style w-auto"
                                >
                                    {Object.values(ContractStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="p-4 border bg-white rounded-md max-h-80 overflow-y-auto font-mono text-xs whitespace-pre-wrap leading-relaxed">
                                {saleContract.content}
                            </div>
                             
                             {saleContract.status === ContractStatus.SIGNED && (
                                <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
                                    <h4 className="font-semibold text-green-800">Contrato Assinado</h4>
                                    {saleContract.signedAt && <p className="text-xs text-green-700">Assinado em: {new Date(saleContract.signedAt).toLocaleString('pt-BR')}</p>}
                                    <div className="mt-3">
                                        <label htmlFor="file-upload" className="button-secondary cursor-pointer inline-flex items-center">
                                            <UploadIcon className="w-5 h-5 mr-2" />
                                            Anexar Contrato
                                        </label>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.png,.jpg,.jpeg"/>
                                        {signedContractFile && <p className="mt-2 text-sm text-gray-600">Arquivo selecionado: <span className="font-medium">{signedContractFile.name}</span></p>}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2 italic">A funcionalidade de anexo é para fins de registro visual e não armazena o arquivo permanentemente.</p>
                                </div>
                             )}

                             <div className="flex justify-end space-x-2 pt-2 border-t">
                                <button className="button-secondary">Imprimir</button>
                            </div>
                        </div>
                    ) : (
                        <div className="p-4 space-y-4 text-center">
                            <p className="text-gray-600">Nenhum contrato gerado para esta venda ainda.</p>
                            <div className="flex items-center justify-center gap-4">
                                <select value={selectedTemplateId} onChange={e => setSelectedTemplateId(e.target.value)} className="input-style">
                                    <option value="" disabled>Selecione um modelo...</option>
                                    {relevantTemplates.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                                </select>
                                <button onClick={handleGenerateContract} className="button-primary" disabled={!selectedTemplateId}>
                                    Gerar Contrato
                                </button>
                            </div>
                            {relevantTemplates.length === 0 && <p className="text-xs text-amber-700 bg-amber-100 p-2 rounded-md mt-2">Nenhum modelo de contrato ativo encontrado para os produtos desta venda. Verifique as configurações de modelos.</p>}
                        </div>
                    )}
                </div>

            </div>
        </Modal>
    );
};

export default SaleDetailModal;