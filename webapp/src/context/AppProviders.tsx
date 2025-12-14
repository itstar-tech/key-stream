import React from 'react';
import { WebSocketProvider } from './WebSocketContext';
import { UserProvider } from './UserContext';
import { GameProvider } from './GameContext';

interface AppProvidersProps {
    children: React.ReactNode;
}


export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
    return (
        <WebSocketProvider>
            <UserProvider>
                <GameProvider>
                    {children}
                </GameProvider>
            </UserProvider>
        </WebSocketProvider>
    );
};