import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { FranchiseeLead } from '../types';
import { SparklesIcon } from './icons';

interface AICandidateAnalysisProps {
    lead: FranchiseeLead;
}

const AICandidateAnalysis: React.FC<AICandidateAnalysisProps> = ({ lead }) => {
    const [analysis, setAnalysis] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const generateAnalysis = async () => {
            setIsLoading(true);
            setError(null);

            let context = `**Dados do Candidato:**\n`;
            context += `- Nome: ${lead.candidateName}\n`;
            context += `- Cidade de Interesse: ${lead.cityOfInterest}\n`;
            context += `- Capital de Investimento: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(lead.investmentCapital)}\n`;
            context += `- Status no Funil: ${lead.status}\n\n`;

            context += `**Status da Documentação:**\n`;
            if (lead.documents.length > 0) {
                 context += lead.documents.map(doc => `- ${doc.name}: ${doc.status}`).join('\n');
            } else {
                context += "Nenhum documento registrado.\n";
            }
            context += `\n\n`;

            context += `**Anotações Internas da Equipe:**\n`;
            if (lead.internalNotes.length > 0) {
                 context += lead.internalNotes.map(note => `- [${note.author}]: ${note.text}`).join('\n');
            } else {
                context += "Nenhuma anotação interna registrada.\n";
            }

            const prompt = `
                Você é um diretor de expansão de uma rede de franquias financeiras. Sua tarefa é analisar o perfil de um candidato a franqueado e fornecer um resumo para a diretoria. Com base nos dados abaixo, gere uma análise concisa.

                ${context}

                **Sua Análise (use EXATAMENTE este formato, com os títulos em negrito):**
                **Resumo:** (Um parágrafo curto resumindo o perfil e a situação atual do candidato).
                **Pontos Fortes:** (Liste 2-3 pontos positivos, como capital, experiência, documentação em dia).
                **Pontos de Atenção:** (Liste 1-2 pontos que requerem atenção, como documentos pendentes, falta de experiência, etc.).
                **Recomendação:** (Sugira um próximo passo: "Recomendado para aprovação", "Requer análise adicional de documentação", "Agendar entrevista final", etc.).
            `;

            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                });
                
                setAnalysis(response.text);

            } catch (err) {
                console.error("Error generating AI analysis:", err);
                setError("Não foi possível gerar a análise. Verifique a API Key.");
            } finally {
                setIsLoading(false);
            }
        };

        generateAnalysis();
    }, [lead]);

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="space-y-4 animate-pulse">
                    <div className="h-4 bg-blue-200 rounded w-1/4"></div>
                    <div className="h-3 bg-blue-200 rounded w-full"></div>
                    <div className="h-3 bg-blue-200 rounded w-5/6"></div>
                    <div className="h-4 bg-blue-200 rounded w-1/3 mt-3"></div>
                    <div className="h-3 bg-blue-200 rounded w-full"></div>
                </div>
            );
        }

        if (error) {
            return <p className="text-sm text-red-600">{error}</p>;
        }

        // Simple parser for the specific bolded format
        return analysis.split('**').map((part, index) => {
            if (index % 2 === 1) { // Part is between **
                return <strong key={index} className="block font-bold text-blue-800 mt-3 mb-1">{part}</strong>;
            }
            return <span key={index}>{part}</span>;
        });
    };

    return (
        <div className="bg-blue-50 p-6 rounded-lg shadow-md border border-blue-200 sticky top-6">
            <div className="flex items-center mb-4">
                <SparklesIcon className="w-6 h-6 text-blue-600 mr-3" />
                <h3 className="text-lg font-semibold text-blue-800">Análise do Candidato (IA)</h3>
            </div>
            <div className="text-sm text-gray-800 space-y-1">{renderContent()}</div>
        </div>
    );
};

export default AICandidateAnalysis;
