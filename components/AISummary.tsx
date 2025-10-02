import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { LeadNote, Task } from '../types';
import { SparklesIcon } from './icons';

interface AISummaryProps {
    leadName: string;
    notes: LeadNote[];
    tasks: Task[];
}

const AISummary: React.FC<AISummaryProps> = ({ leadName, notes, tasks }) => {
    const [summary, setSummary] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const generateSummary = async () => {
            setIsLoading(true);
            setError(null);

            const completedTasks = tasks.filter(t => t.completed);
            
            if (notes.length === 0 && completedTasks.length === 0) {
                setSummary('Não há atividades suficientes para gerar um resumo.');
                setIsLoading(false);
                return;
            }

            // Constructing a detailed context string for the AI
            let context = `Histórico de interações com o cliente ${leadName}:\n\n`;

            if (notes.length > 0) {
                context += "Anotações do vendedor:\n";
                notes.forEach(note => {
                    context += `- [${new Date(note.createdAt).toLocaleDateString('pt-BR')} por ${note.author}]: ${note.text}\n`;
                });
                context += "\n";
            }

            if (completedTasks.length > 0) {
                context += "Tarefas concluídas relacionadas ao cliente:\n";
                completedTasks.forEach(task => {
                    context += `- [Concluída em ${new Date(task.dueDate).toLocaleDateString('pt-BR')}]: ${task.title}\n`;
                });
            }

            const prompt = `
                Você é um assistente de vendas sênior analisando o histórico de um lead para um vendedor. Com base no contexto abaixo, forneça uma análise concisa.

                Contexto:
                ${context}

                Sua análise deve conter:
                1.  **Resumo da Situação:** Um resumo de 1-2 frases sobre o estado atual da negociação.
                2.  **Ponto de Atenção:** Identifique a principal objeção, dúvida ou ponto crítico da negociação. Se não houver, mencione o principal interesse.
                3.  **Sugestão de Próximo Passo:** Recomende a próxima ação mais estratégica para o vendedor.

                Formate a resposta de maneira clara e direta, sem usar markdown ou títulos.
            `;

            const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY as string | undefined;
            if (!apiKey) {
                setError("Recurso de IA desabilitado: configure VITE_GEMINI_API_KEY.");
                setIsLoading(false);
                return;
            }

            try {
                const ai = new GoogleGenAI({ apiKey });
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                });
                
                setSummary(response.text);

            } catch (err) {
                console.error("Error generating AI summary:", err);
                setError("Não foi possível gerar o resumo. Tente novamente mais tarde.");
            } finally {
                setIsLoading(false);
            }
        };

        generateSummary();
    }, [notes, tasks, leadName]);

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="space-y-3 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
            );
        }

        if (error) {
            return <p className="text-sm text-red-600">{error}</p>;
        }

        return (
             <p className="text-sm text-gray-700 whitespace-pre-wrap">{summary}</p>
        );
    };

    return (
        <div className="bg-blue-50 p-6 rounded-lg shadow-md border border-blue-200">
            <div className="flex items-center mb-4">
                <SparklesIcon className="w-6 h-6 text-blue-600 mr-3" />
                <h3 className="text-lg font-semibold text-blue-800">Assistente de Vendas IA</h3>
            </div>
            {renderContent()}
        </div>
    );
};

export default AISummary;