import React, { useEffect } from 'react';
import { useData } from '../hooks/useData';

const DynamicThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { data } = useData();
    const franchisorSettings = data?.franchisorSettings;

    useEffect(() => {
        if (franchisorSettings) {
            const { primaryColor, secondaryColor } = franchisorSettings;
            const root = document.documentElement;

            if (primaryColor) {
                root.style.setProperty('--color-primary', primaryColor);
            }
            if (secondaryColor) {
                root.style.setProperty('--color-secondary', secondaryColor);
            }
        }
        
    }, [franchisorSettings]);

    return <>{children}</>;
};

export default DynamicThemeProvider;