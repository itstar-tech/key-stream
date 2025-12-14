import {
    WebSocketMessage,
    WebSocketMessageType,
    ConnectionStatus,
} from '../types';

export type MessageHandler = (message: WebSocketMessage) => void;

export interface WebSocketConfig {
    url: string;
    reconnectInterval?: number;
    maxReconnectAttempts?: number;
    heartbeatInterval?: number;
}


export class WebSocketService {
    private ws: WebSocket | null = null;
    private config: Required<WebSocketConfig>;
    private messageHandlers: Map<WebSocketMessageType, Set<MessageHandler>> = new Map();
    private reconnectAttempts: number = 0;
    private reconnectTimeout: NodeJS.Timeout | null = null;
    private heartbeatInterval: NodeJS.Timeout | null = null;
    private connectionStatus: ConnectionStatus = 'disconnected';
    private statusChangeListeners: Set<(status: ConnectionStatus) => void> = new Set();

    constructor(config: WebSocketConfig) {
        this.config = {
            url: config.url,
            reconnectInterval: config.reconnectInterval || 3000,
            maxReconnectAttempts: config.maxReconnectAttempts || 5,
            heartbeatInterval: config.heartbeatInterval || 30000,
        };
    }


    connect(): void {
        if (this.ws?.readyState === WebSocket.OPEN) {
            console.log('WebSocket ya está conectado');
            return;
        }

        this.setConnectionStatus('connecting');

        try {
            this.ws = new WebSocket(this.config.url);

            this.ws.onopen = this.handleOpen.bind(this);
            this.ws.onmessage = this.handleMessage.bind(this);
            this.ws.onerror = this.handleError.bind(this);
            this.ws.onclose = this.handleClose.bind(this);
        } catch (error) {
            console.error('Error al conectar WebSocket:', error);
            this.handleReconnect();
        }
    }


    disconnect(): void {
        this.clearReconnectTimeout();
        this.clearHeartbeat();

        if (this.ws) {
            this.ws.close(1000, 'Desconexión intencional');
            this.ws = null;
        }

        this.setConnectionStatus('disconnected');
    }


    send<T = any>(type: WebSocketMessageType, payload: T, roomId?: string): void {
        if (!this.isConnected()) {
            console.error('WebSocket no está conectado');
            return;
        }

        const message: WebSocketMessage = {
            type,
            payload,
            roomId,
            timestamp: Date.now(),
        };

        try {
            this.ws!.send(JSON.stringify(message));
        } catch (error) {
            console.error('Error al enviar mensaje:', error);
        }
    }


    on(type: WebSocketMessageType, handler: MessageHandler): () => void {
        if (!this.messageHandlers.has(type)) {
            this.messageHandlers.set(type, new Set());
        }

        this.messageHandlers.get(type)!.add(handler);

        return () => {
            this.messageHandlers.get(type)?.delete(handler);
        };
    }


    onStatusChange(listener: (status: ConnectionStatus) => void): () => void {
        this.statusChangeListeners.add(listener);

        return () => {
            this.statusChangeListeners.delete(listener);
        };
    }


    isConnected(): boolean {
        return this.ws?.readyState === WebSocket.OPEN;
    }


    getConnectionStatus(): ConnectionStatus {
        return this.connectionStatus;
    }


    private handleOpen(): void {
        console.log('WebSocket conectado');
        this.reconnectAttempts = 0;
        this.setConnectionStatus('connected');
        this.startHeartbeat();
    }


    private handleMessage(event: MessageEvent): void {
        try {
            const message: WebSocketMessage = JSON.parse(event.data);

            if (message.type === 'pong') {
                return;
            }

            const handlers = this.messageHandlers.get(message.type);
            if (handlers) {
                handlers.forEach(handler => handler(message));
            }

            const genericHandlers = this.messageHandlers.get('*' as WebSocketMessageType);
            if (genericHandlers) {
                genericHandlers.forEach(handler => handler(message));
            }
        } catch (error) {
            console.error('Error al procesar mensaje:', error);
        }
    }


    private handleError(error: Event): void {
        console.error('WebSocket error:', error);
        this.setConnectionStatus('error');
    }


    private handleClose(event: CloseEvent): void {
        console.log('WebSocket cerrado:', event.code, event.reason);
        this.clearHeartbeat();
        this.setConnectionStatus('disconnected');

        if (event.code !== 1000) {
            this.handleReconnect();
        }
    }


    private handleReconnect(): void {
        if (this.reconnectAttempts >= this.config.maxReconnectAttempts) {
            console.error('Máximo de intentos de reconexión alcanzado');
            this.setConnectionStatus('error');
            return;
        }

        this.reconnectAttempts++;
        console.log(
            `Intentando reconectar (${this.reconnectAttempts}/${this.config.maxReconnectAttempts})...`
        );

        this.reconnectTimeout = setTimeout(() => {
            this.connect();
        }, this.config.reconnectInterval);
    }


    private startHeartbeat(): void {
        this.clearHeartbeat();

        this.heartbeatInterval = setInterval(() => {
            if (this.isConnected()) {
                this.send('ping', {});
            }
        }, this.config.heartbeatInterval);
    }


    private clearHeartbeat(): void {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
    }


    private clearReconnectTimeout(): void {
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }
    }

    private setConnectionStatus(status: ConnectionStatus): void {
        if (this.connectionStatus !== status) {
            this.connectionStatus = status;
            this.statusChangeListeners.forEach(listener => listener(status));
        }
    }
}


let wsInstance: WebSocketService | null = null;


export const getWebSocketService = (): WebSocketService => {
    if (!wsInstance) {
        const wsUrl = process.env.REACT_APP_WS_URL || 'ws://localhost:8080/ws';
        wsInstance = new WebSocketService({url: wsUrl});
    }
    return wsInstance;
};

export const resetWebSocketService = (): void => {
    if (wsInstance) {
        wsInstance.disconnect();
        wsInstance = null;
    }
};