import { useEffect, useState, useCallback, useRef } from 'react';
import {
    WebSocketService,
    getWebSocketService,
    MessageHandler,
} from '../services';
import type {
    WebSocketMessage,
    WebSocketMessageType,
    ConnectionStatus,
} from '../types';

interface UseWebSocketReturn {
    isConnected: boolean;
    connectionStatus: ConnectionStatus;
    sendMessage: <T = any>(
        type: WebSocketMessageType,
        payload: T,
        roomId?: string
    ) => void;
    subscribe: (
        type: WebSocketMessageType,
        handler: MessageHandler
    ) => void;
    unsubscribe: (
        type: WebSocketMessageType,
        handler: MessageHandler
    ) => void;
}


export const useWebSocket = (): UseWebSocketReturn => {
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
    const wsRef = useRef<WebSocketService | null>(null);
    const handlersRef = useRef<Map<WebSocketMessageType, Set<MessageHandler>>>(
        new Map()
    );

    useEffect(() => {
        wsRef.current = getWebSocketService();

        wsRef.current.connect();

        const unsubscribe = wsRef.current.onStatusChange((status) => {
            setConnectionStatus(status);
        });

        return () => {
            unsubscribe();
        };
    }, []);


    const sendMessage = useCallback(
        <T = any>(
            type: WebSocketMessageType,
            payload: T,
            roomId?: string
        ) => {
            wsRef.current?.send(type, payload, roomId);
        },
        []
    );

    const subscribe = useCallback(
        (type: WebSocketMessageType, handler: MessageHandler) => {
            if (!handlersRef.current.has(type)) {
                handlersRef.current.set(type, new Set());
            }
            handlersRef.current.get(type)!.add(handler);

            wsRef.current?.on(type, handler);
        },
        []
    );


    const unsubscribe = useCallback(
        (type: WebSocketMessageType, handler: MessageHandler) => {
            handlersRef.current.get(type)?.delete(handler);
        },
        []
    );

    const isConnected = connectionStatus === 'connected';

    return {
        isConnected,
        connectionStatus,
        sendMessage,
        subscribe,
        unsubscribe,
    };
};


export const useWebSocketMessage = <T = any>(
    type: WebSocketMessageType,
    handler: (payload: T, message: WebSocketMessage) => void,
    deps: React.DependencyList = []
): void => {
    const wsRef = useRef<WebSocketService | null>(null);

    useEffect(() => {
        wsRef.current = getWebSocketService();

        const messageHandler: MessageHandler = (message) => {
            handler(message.payload as T, message);
        };

        const unsubscribe = wsRef.current.on(type, messageHandler);

        return () => {
            unsubscribe();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type, ...deps]);
};