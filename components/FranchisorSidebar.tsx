

import React from 'react';
import Logo from './Logo';
import { useAuth } from '../hooks/useAuth';
import { useData } from '../hooks/useData';
import { UsersIcon, BriefcaseIcon, ShieldCheckIcon, AcademicCapIcon, PhotoIcon, ChatBubbleLeftRightIcon, ChartBarIcon, DatabaseIcon } from './icons';

// A simple LogoutIcon for demonstration
const LogoutIconFC: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m-3 0l3-3m0 0l-3-3m3 3H9" />
    </svg>
);

const HomeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a.75.75 0 011.06 0l8.955 8.955M13.28 21V16.5a1.5 1.5 0 00-1.5-1.5h-1.5a1.5 1.5 0 00-1.5 1.5V21m6.062-6.062a3 3 0 00-4.242 0M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const CurrencyDollarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-6h6m-6 6h6m-6-12h6M3.75 6.75h16.5M3.75 17.25h16.5" />
    </svg>
);
const CogIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-1.008 1.118-1.226M11.46 2.714a.974.974 0 011.08 0l2.121 1.225a1 1 0 001.226 0l2.121-1.225a.974.974 0 011.08 0l2.122 1.225a1 1 0 001.226 0l2.121-1.225a.974.974 0 011.08 0l1.225 2.121a1 1 0 000 1.226l-1.225 2.121a.974.974 0 010 1.08l1.225 2.121a1 1 0 000 1.226l-1.225 2.121a.974.974 0 01-1.08 0l-2.121-1.225a1 1 0 00-1.226 0l-2.121 1.225a.974.974 0 01-1.08 0l-2.121-1.225a1 1 0 00-1.226 0l-2.121 1.225a.974.974 0 01-1.08 0l-1.225-2.121a1 1 0 000-1.226l1.225-2.121a.974.974 0 010-1.08l-1.225-2.121a1 1 0 000-1.226l1.225-2.121z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5z" />
    </svg>
);

const ClipboardDocumentIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM10.5 16.5h3.75" />
    </svg>
);


const franchisorTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
    { id: 'franchises', label: 'Franquias', icon: UsersIcon },
    { id: 'expansion', label: 'Expansão (CRM)', icon: BriefcaseIcon },
    { id: 'financials', label: 'Financeiro', icon: CurrencyDollarIcon },
    { id: 'audits', label: 'Auditorias', icon: ShieldCheckIcon },
    { id: 'training', label: 'Treinamentos', icon: AcademicCapIcon },
    { id: 'marketing', label: 'Marketing', icon: PhotoIcon },
    { id: 'contracts', label: 'Modelos de Contrato', icon: ClipboardDocumentIcon },
    { id: 'communication', label: 'Comunicação', icon: ChatBubbleLeftRightIcon },
    { id: 'forum', label: 'Fórum da Comunidade', icon: ChatBubbleLeftRightIcon },
    { id: 'reports', label: 'Relatórios', icon: ChartBarIcon },
    { id: 'schema', label: 'Schema DB', icon: DatabaseIcon },
    { id: 'settings', label: 'Configurações', icon: CogIcon },
];

interface FranchisorSidebarProps {
    activeTab: string;
    onSelectTab: (tabId: string) => void;
    isOpen: boolean;
    onClose: () => void;
}

const FranchisorSidebar: React.FC<FranchisorSidebarProps> = ({ activeTab, onSelectTab, isOpen, onClose }) => {
    const { logout } = useAuth();
    const { data: { franchisorSettings } } = useData();
    
    return (
        <>
            {isOpen && <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={onClose} />}
            <aside className={`fixed top-0 left-0 h-full w-64 bg-card text-text-primary flex flex-col shadow-2xl z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                <div className="flex items-center justify-center p-6 border-b border-border">
                    <div className="flex items-center space-x-3">
                        <Logo className="h-10 w-10" />
                        <span className="font-bold text-xl text-text-primary">{franchisorSettings?.franchisorName}</span>
                    </div>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {franchisorTabs.map((tab) => {
                        const IconComponent = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <a
                                key={tab.id}
                                href={`#/${tab.id}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    onSelectTab(tab.id);
                                }}
                                className={`w-full flex items-center px-4 py-3 text-sm font-bold rounded-lg transition-all duration-200 ${
                                isActive
                                    ? 'bg-primary text-white shadow-md'
                                    : 'text-text-secondary hover:bg-background hover:text-text-primary'
                                }`}
                            >
                                <IconComponent className={`w-6 h-6 mr-3 flex-shrink-0 ${isActive ? 'text-white' : ''}`} />
                                {tab.label}
                            </a>
                        );
                    })}
                </nav>
                <div className="p-4 border-t border-border">
                    <button
                    onClick={logout}
                    className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg text-text-tertiary hover:bg-background hover:text-text-primary transition-colors"
                    >
                    <LogoutIconFC className="w-5 h-5 mr-3" />
                    Sair
                    </button>
                </div>
            </aside>
        </>
    );
};

export default FranchisorSidebar;
