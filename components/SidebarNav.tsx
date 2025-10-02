

import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon, ChevronDownIcon, LogoutIcon } from './icons';
import Logo from './Logo';
import { useData } from '../hooks/useData';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

type Tab = {
    id: string;
    label: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
};

type Group = {
    title: string;
    items: readonly Tab[];
};

interface SidebarNavProps {
  franchiseName: string;
  currentTab: string;
  tabGroups: readonly Group[];
  onTabClick: (tabId: string) => void;
  onBack: () => void;
  isFranchiseeView: boolean;
  isOpen: boolean;
  onClose: () => void;
}

const SidebarNav: React.FC<SidebarNavProps> = ({ franchiseName, currentTab, tabGroups, onTabClick, onBack, isFranchiseeView, isOpen, onClose }) => {
  const { data: { franchisorSettings }, selectedFranchiseData } = useData();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  const franchiseId = selectedFranchiseData?.franchise.id;

  useEffect(() => {
    // Quando a aba atual muda (navegação), abre o grupo correspondente.
    const activeGroup = tabGroups.find(g => g.items.some(t => t.id === currentTab));
    if (activeGroup) {
      setOpenGroup(activeGroup.title);
    }
  }, [currentTab, tabGroups]);

  const toggleGroup = (title: string) => {
    // Se o grupo clicado já está aberto, fecha-o. Caso contrário, abre-o.
    setOpenGroup(prevOpenGroup => (prevOpenGroup === title ? null : title));
  };

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
      e.preventDefault();
      navigate(path);
      onClose();
  }

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={onClose} />}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-card text-text-primary flex flex-col shadow-2xl z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
      <div className="flex items-center justify-center p-6 border-b border-border">
        <a 
            href={isFranchiseeView ? '#/dashboard' : `#/franchises/${franchiseId}/dashboard`} 
            onClick={(e) => handleNav(e, isFranchiseeView ? '/dashboard' : `/franchises/${franchiseId}/dashboard`)}
            className="flex items-center space-x-3 group"
        >
          <Logo className="h-10 w-10 transition-transform group-hover:rotate-12" />
          <span className="font-bold text-xl">{franchiseName}</span>
        </a>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {tabGroups.map((group) => {
            const isActiveGroup = group.items.some(tab => tab.id === currentTab);
            const isOpen = openGroup === group.title;
            return (
                <div key={group.title}>
                    <button
                        onClick={() => toggleGroup(group.title)}
                        className={`w-full flex items-center justify-between px-4 py-3 text-sm font-bold rounded-lg hover:bg-background transition-colors text-left ${
                            isActiveGroup ? 'text-text-primary' : 'text-text-tertiary'
                        }`}
                        aria-expanded={isOpen}
                        aria-controls={`group-panel-${group.title.replace(/\s+/g, '-')}`}
                    >
                        <span>{group.title.toUpperCase()}</span>
                        <ChevronDownIcon className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <div
                        id={`group-panel-${group.title.replace(/\s+/g, '-')}`}
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px]' : 'max-h-0'}`}
                    >
                         <div className="pl-2 mt-1 space-y-1 pt-1 pb-2">
                            {group.items.map((tab) => {
                                const IconComponent = tab.icon;
                                const isActive = currentTab === tab.id;
                                const path = isFranchiseeView ? `/${tab.id}` : `/franchises/${franchiseId}/${tab.id}`;
                                return (
                                    <a
                                        key={tab.id}
                                        href={`#${path}`}
                                        onClick={(e) => handleNav(e, path)}
                                        className={`w-full flex items-center px-4 py-3 text-sm font-bold rounded-lg transition-all duration-200 text-left ${
                                        isActive
                                            ? 'bg-primary text-white shadow-md'
                                            : 'text-text-secondary hover:bg-background hover:text-text-primary'
                                        }`}
                                    >
                                        <IconComponent className={`w-5 h-5 mr-3 flex-shrink-0 ${isActive ? 'text-white' : ''}`} />
                                        {tab.label}
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </div>
            );
        })}
      </nav>
      <div className="p-4 border-t border-border">
        {isFranchiseeView ? (
            <button
                onClick={logout}
                className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg text-text-tertiary hover:bg-background hover:text-text-primary transition-colors"
            >
                <LogoutIcon className="w-5 h-5 mr-3" />
                Sair
            </button>
        ) : (
            <a
            href="#/dashboard"
            onClick={(e) => handleNav(e, '/dashboard')}
            className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg text-text-tertiary hover:bg-background hover:text-text-primary transition-colors"
            >
            <ArrowLeftIcon className="w-5 h-5 mr-3" />
            Voltar para {franchisorSettings?.franchisorName || 'Painel'}
            </a>
        )}
      </div>
    </aside>
    </>
  );
};

export default SidebarNav;
