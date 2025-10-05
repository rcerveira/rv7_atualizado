import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import AuthGate from './components/auth/AuthGate';
import DynamicThemeProvider from './components/DynamicThemeProvider';
import { ToastProvider } from './components/ToastProvider';
import LoginPage from './components/auth/LoginPage';


const App: React.FC = () => {
    return (
        <ToastProvider>
            <HashRouter>
                <AuthProvider>
                    <DataProvider>
                        <DynamicThemeProvider>
                            <Routes>
                                <Route path="/login" element={<LoginPage />} />
                                <Route path="/franchises/:id/*" element={<AuthGate />} />
                                <Route path="/*" element={<AuthGate />} />
                            </Routes>
                        </DynamicThemeProvider>
                    </DataProvider>
                </AuthProvider>
            </HashRouter>
        </ToastProvider>
    );
};

export default App;
