import React, { useMemo } from 'react';
import { KnowledgeBaseResource, KnowledgeBaseCategory } from '../types';
import { BookOpenIcon } from './icons';

interface KnowledgeBaseViewProps {
  resources: KnowledgeBaseResource[];
}

const KnowledgeBaseView: React.FC<KnowledgeBaseViewProps> = ({ resources }) => {
  const groupedResources = useMemo(() => {
    return resources.reduce((acc, resource) => {
      (acc[resource.category] = acc[resource.category] || []).push(resource);
      return acc;
    }, {} as Record<KnowledgeBaseCategory, KnowledgeBaseResource[]>);
  }, [resources]);
  
  const categories = Object.values(KnowledgeBaseCategory);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
       <div className="flex items-center space-x-3 mb-6">
            <BookOpenIcon className="w-8 h-8 text-primary"/>
            <h2 className="text-2xl font-bold text-gray-800">Base de Conhecimento e Recursos</h2>
        </div>
      <div className="space-y-8">
        {categories.map(category => (
          groupedResources[category] && (
            <div key={category}>
              <h3 className="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b">{category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedResources[category].map(resource => (
                  <a
                    key={resource.id}
                    href={resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 hover:border-primary transition-all group"
                  >
                    <h4 className="font-bold text-primary group-hover:underline">{resource.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                    <p className="text-xs text-gray-400 mt-3">
                      Publicado em: {new Date(resource.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default KnowledgeBaseView;