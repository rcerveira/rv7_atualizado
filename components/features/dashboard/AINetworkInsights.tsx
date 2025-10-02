import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { FranchiseWithStats } from '../../../types';
import { SparklesIcon } from '../../icons';

interface AINetworkInsightsProps {
    franchisesWithStats: FranchiseWithStats[];
}

const AINetworkInsights: React.FC<AINetworkInsightsProps> = ({ franchisesWithStats }) => {
    const [insights, setInsights] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const generateInsights = async () => {
            setIsLoading(true);
            setError(null);

            if (franchisesWithStats.length < 2) {
                setInsights('Dados insuficientes para uma análise comparativa da rede.');
                setIsLoading(false);
                return;
            }

            let context = "Dados de performance da rede de franquias:\n\n";
            franchisesWithStats.forEach(f => {
                context += `- Franquia: ${f.name}\n`;
                context += `  - Faturamento: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(f.consortiumSales)}\n`;
                context += `  - Lucro: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(f.profit)}\n`;
                context += `  - Taxa de Conversão: ${(f.conversionRate * 100).toFixed(1)}%\n`;
                context += `  - Health Score: ${f.healthScore}/100\n\n`;
            });

            const prompt = `
                Você é um consultor de negócios sênior analisando a performance de uma rede de franquias financeiras.
                Com base nos dados a seguir, forneça uma análise estratégica e concisa em 3 pontos principais.

                Contexto:
                ${context}

                Sua análise deve conter:
                1.  **Destaque Positivo:** Identifique a franquia de melhor performance e explique sucintamente o porquê (ex: "RV7-SP lidera com o maior lucro, impulsionado por sua excelente taxa de conversão.").
                2.  **Ponto de Atenção:** Identifique a franquia que requer mais atenção e o principal motivo (ex: "RV7-MG, apesar do faturamento razoável, apresenta o menor lucro, sugerindo uma análise de custos operacionais.").
                3.  **Tendência da Rede:** Aponte uma observação ou tendência geral da rede (ex: "A taxa de conversão é um forte indicador de sucesso na rede, sendo o principal diferencial das franquias no topo.").

                Formate a resposta em 3 parágrafos curtos e diretos, sem usar markdown (como títulos ou listas).
            `;

            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                });
                
                setInsights(response.text);

            } catch (err) {
                console.error("Error generating AI insights:", err);
                setError("Não foi possível gerar os insights da rede. Verifique a API Key.");
            } finally {
                setIsLoading(false);
            }
        };

        generateInsights();
    }, [franchisesWithStats]);

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="space-y-3 animate-pulse">
                    <div className="h-4 bg-blue-200 rounded w-3/4"></div>
                    <div className="h-4 bg-blue-200 rounded w-full"></div>
                    <div className="h-4 bg-blue-200 rounded w-1/2"></div>
                </div>
            );
        }

        if (error) {
            return <p className="text-sm text-red-600">{error}</p>;
        }

        return (
             <div className="text-sm text-blue-900 whitespace-pre-wrap space-y-2">{insights.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}</div>
        );
    };

    return (
        <div className="bg-blue-100 p-6 rounded-2xl shadow-lg shadow-blue-500/10 border border-blue-200">
            <div className="flex items-center mb-4">
                <SparklesIcon className="w-6 h-6 text-blue-600 mr-3" />
                <h3 className="section-title text-blue-800">Painel de Insights com IA</h3>
            </div>
            {renderContent()}
        </div>
    );
};

export default AINetworkInsights;