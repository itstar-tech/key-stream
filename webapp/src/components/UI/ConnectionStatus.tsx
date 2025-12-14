import React from 'react';
import { useWebSocketContext } from '../../context';
import styles from './ConnectionStatus.module.css';

export const ConnectionStatus: React.FC = () => {
    const { connectionStatus } = useWebSocketContext();

    const statusConfig = {
        connected: {
            label: 'Conectado',
            className: styles.connected,
        },
        connecting: {
            label: 'Conectando...',
            className: styles.connecting,
        },
        disconnected: {
            label: 'Desconectado',
            className: styles.disconnected,
        },
        error: {
            label: 'Error de conexión',
            className: styles.error,
        },
    };

    const config = statusConfig[connectionStatus];

    return (
        <div className={`${styles.container} ${config.className}`}>
            <span className={styles.indicator}></span>
            <span className={styles.label}>{config.label}</span>
        </div>
    );
};