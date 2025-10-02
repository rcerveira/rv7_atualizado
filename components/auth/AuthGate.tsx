import React, { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import LoginPage from './LoginPage';
import FranchisorDashboard from '../FranchisorDashboard';
import FranchiseWorkspace from '../FranchiseWorkspace';
import { useData } from '../../hooks/useData';
import { SpinnerIcon } from '../icons';
import { useLocation } from 'react-router-dom';

const AuthGate: React.FC = () => {
    const { user, loading: authLoading } = useAuth();
    const { handlers, data, isLoading: dataLoading } = useData();
    const location = useLocation();
    const path = location.pathname || '/';

    useEffect(() => {
        const parts = path.split('/').filter(Boolean);
        if (user?.role === 'FRANCHISOR') {
            if (parts[0] === 'franchises' && parts[1]) {
                const franchiseId = parseInt(parts[1], 10);
                if (!isNaN(franchiseId)) {
                    handlers.setManagedFranchiseId(franchiseId);
                }
            } else {
                handlers.setManagedFranchiseId(null);
            }
        }
    }, [path, user, handlers]);
    
    if (authLoading || dataLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-background">
                <div className="text-center">
                    <SpinnerIcon className="w-12 h-12 text-primary mx-auto animate-spin" />
                    <p className="mt-4 text-lg font-semibold text-text-primary">Carregando dados...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <LoginPage />;
    }
    
    // Ensure data is loaded before rendering dashboards that depend on it
    if (!data) {
         return (
            <div className="flex items-center justify-center h-screen bg-background">
                <div className="text-center">
                    <SpinnerIcon className="w-12 h-12 text-primary mx-auto animate-spin" />
                    <p className="mt-4 text-lg font-semibold text-text-primary">Finalizando a preparação do ambiente...</p>
                </div>
            </div>
        );
    }

    if (user.role === 'FRANCHISOR') {
        const pathParts = path.split('/').filter(Boolean);
        if (pathParts[0] === 'franchises' && pathParts[1]) {
            return <FranchiseWorkspace />;
        }
        return <FranchisorDashboard />;
    }

    if (user.role === 'FRANCHISEE') {
        return <FranchiseWorkspace isFranchiseeView={true} />;
    }
    
    // Fallback to login page if user role is not recognized
    return <LoginPage />;
};

export default AuthGate;