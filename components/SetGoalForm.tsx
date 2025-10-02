import React, { useState, useEffect } from 'react';
import { Goal } from '../types';

interface SetGoalFormProps {
    onSubmit: (goalData: { revenueTarget: number; conversionRateTarget: number; }) => void;
    onClose: () => void;
    initialData?: Goal | null;
}

const SetGoalForm: React.FC<SetGoalFormProps> = ({ onSubmit, onClose, initialData }) => {
    const [revenueTarget, setRevenueTarget] = useState<string>('');
    const [conversionRateTarget, setConversionRateTarget] = useState<string>('');

    useEffect(() => {
        if (initialData) {
            setRevenueTarget(String(initialData.revenueTarget));
            setConversionRateTarget(String(initialData.conversionRateTarget * 100)); // Display as percentage, e.g., 20 for 20%
        } else {
            setRevenueTarget('');
            setConversionRateTarget('');
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const revenue = parseFloat(revenueTarget);
        const conversion = parseFloat(conversionRateTarget);

        if (isNaN(revenue) || revenue < 0 || isNaN(conversion) || conversion < 0 || conversion > 100) {
            alert('Por favor, insira valores numéricos válidos. A taxa de conversão deve ser entre 0 e 100.');
            return;
        }

        onSubmit({
            revenueTarget: revenue,
            conversionRateTarget: conversion / 100, // Store as decimal, e.g., 0.20
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="revenueTarget" className="block text-sm font-medium text-gray-700">Meta de Faturamento (R$)</label>
                <input
                    type="number"
                    id="revenueTarget"
                    value={revenueTarget}
                    onChange={(e) => setRevenueTarget(e.target.value)}
                    className="mt-1 block w-full input-style"
                    placeholder="Ex: 150000"
                    required
                />
            </div>
            <div>
                <label htmlFor="conversionRateTarget" className="block text-sm font-medium text-gray-700">Meta de Taxa de Conversão (%)</label>
                <input
                    type="number"
                    id="conversionRateTarget"
                    value={conversionRateTarget}
                    onChange={(e) => setConversionRateTarget(e.target.value)}
                    className="mt-1 block w-full input-style"
                    placeholder="Ex: 20"
                    min="0"
                    max="100"
                    required
                />
            </div>
            <div className="flex justify-end pt-4 space-x-2 border-t mt-6">
                <button type="button" onClick={onClose} className="button-secondary">
                    Cancelar
                </button>
                <button type="submit" className="button-primary">
                    {initialData ? 'Atualizar Meta' : 'Definir Meta'}
                </button>
            </div>
        </form>
    );
};

export default SetGoalForm;