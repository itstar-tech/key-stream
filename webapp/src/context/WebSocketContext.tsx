import React, { createContext, useContext, useEffect, useState } from 'react';
import { WebSocketService, getWebSocketService } from '../services';
import type { ConnectionStatus } from '../types';

interface WebSocketContextValue {
    ws: WebSocketService | null;
    isConnected: boolean;
    connectionStatus: ConnectionStatus;
}

const WebSocketContext = createContext<WebSocketContextValue | undefined>(
    undefined
);

interface WebSocketProviderProps {
    children: React.ReactNode;
}


export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
                                                                        children,
                                                                    }) => {
    const [ws, setWs] = useState<WebSocketService | null>(null);
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');

    useEffect(() => {
        const wsService = getWebSocketService();
        setWs(wsService);

        wsService.connect();

        const unsubscribe = wsService.onStatusChange((status) => {
            setConnectionStatus(status);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const value: WebSocketContextValue = {
        ws,
        isConnected: connectionStatus === 'connected',
        connectionStatus,
    };

    return (
        <WebSocketContext.Provider value={value}>
            {children}
        </WebSocketContext.Provider>
    );
};


export const useWebSocketContext = (): WebSocketContextValue => {
    const context = useContext(WebSocketContext);

    if (context === undefined) {
        throw new Error(
            'useWebSocketContext debe ser usado dentro de WebSocketProvider'
        );
    }

    return context;
};