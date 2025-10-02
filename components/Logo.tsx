import React from 'react';
import { useData } from '../hooks/useData';

// This base64 string represents the default logo
const defaultLogoBase64 = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkMSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzEwQjk4MTtzdG9wLW9wYWNpdHk6MSIgLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMxRTNBOEE7c3RvcC1vcGFjaXR5OjEiIC8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHBhdGggZD0iTTIwLDgwIE M0MCw4MCA0MCw1MCA1MCw1MCBDNjAsNTAgNjAsODAgODAsODAiIHN0cm9rZT0idXJsKCNncmFkMSkiIHN0cm9rZS13aWR0aD0iOCIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PGNpcmNsZSBjeD0iMjAiIGN5PSI4MCIgcj0iMTAiIGZpbGw9IiMxRTNBOEEiLz48Y2lyY2xlIGN4PSI4MCIgY3k9IjgwIiByPSIxMCIgZmlsbD0iIzFFM0E4QSIvPjxwYXRoIGQ9Ik01MCw1MCBMNTAsMjAgTDYwLDMwIE01MCwyMCBMNDAsMzAiIHN0cm9rZT0iIzEwQjk4MSIgc3Ryb2tlLXdpZHRoPSI4IiBmaWxsPSJub25lIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=';

interface LogoProps {
    className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = 'h-10 w-10' }) => {
    const { data } = useData();
    const logoSrc = data?.franchisorSettings?.logoUrl || defaultLogoBase64;

    return (
        <img
            src={logoSrc}
            alt="Logo da Franqueadora"
            className={className}
        />
    );
};

export default Logo;