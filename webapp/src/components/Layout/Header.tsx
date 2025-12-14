import React from 'react';
import { useUserContext } from '../../context';
import { ConnectionStatus } from '../UI';
import styles from './Header.module.css';

interface HeaderProps {
    showConnectionStatus?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
                                                  showConnectionStatus = true
                                              }) => {
    const { username } = useUserContext();

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <div className={styles.left}>
                    <h1 className={styles.logo}>
                        <span className={styles.icon}>⚡</span>
                        <span className={styles.title}>Typing Battle Royale</span>
                    </h1>
                </div>

                <div className={styles.right}>
                    {showConnectionStatus && <ConnectionStatus />}

                    {username && (
                        <div className={styles.userInfo}>
                            <span className={styles.userIcon}>👤</span>
                            <span className={styles.username}>{username}</span>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};