import React from 'react';
import type {Player} from '../../types';
import {Modal, Button, Badge} from '../UI';
import {Flex} from '../Layout';
import styles from './GameOver.module.css';

interface GameOverProps {
    winner: Player;
    allPlayers: Player[];
    onClose: () => void;
}

export const GameOver: React.FC<GameOverProps> = ({
                                                      winner,
                                                      allPlayers,
                                                      onClose,
                                                  }) => {
    const topPlayers = [...allPlayers]
        .sort((a, b) => {
            if (b.progress !== a.progress) return b.progress - a.progress;
            return b.wpm - a.wpm;
        })
        .slice(0, 3);

    const getPodiumIcon = (position: number) => {
        switch (position) {
            case 1:
                return '🥇';
            case 2:
                return '🥈';
            case 3:
                return '🥉';
            default:
                return '';
        }
    };

    return (
        <Modal isOpen={true} onClose={onClose} size="lg" closeOnBackdropClick={false}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.trophy}>🏆</div>
                    <h2 className={styles.title}>¡Juego Terminado!</h2>
                    <p className={styles.subtitle}>
                        {winner.username} ha ganado el Battle Royale
                    </p>
                </div>

                <div className={styles.podium}>
                    {topPlayers.map((player, index) => (
                        <div
                            key={player.id}
                            className={`${styles.podiumPlace} ${
                                index === 0 ? styles.first : ''
                            }`}
                        >
                            <div className={styles.podiumIcon}>
                                {getPodiumIcon(index + 1)}
                            </div>

                            <div
                                className={styles.podiumAvatar}
                                style={{background: player.color || '#6366f1'}}
                            >
                                {player.username.charAt(0).toUpperCase()}
                            </div>

                            <div className={styles.podiumInfo}>
                                <div className={styles.podiumName}>{player.username}</div>
                                <div className={styles.podiumStats}>
                                    <Badge variant={index === 0 ? 'success' : 'info'} size="sm">
                                        {player.wpm} WPM
                                    </Badge>
                                    <Badge variant="secondary" size="sm">
                                        {player.accuracy.toFixed(1)}%
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.allPlayers}>
                    <h3>Clasificación Final</h3>
                    <div className={styles.playersList}>
                        {allPlayers
                            .sort((a, b) => {
                                if (b.progress !== a.progress) return b.progress - a.progress;
                                return b.wpm - a.wpm;
                            })
                            .map((player, index) => (
                                <div key={player.id} className={styles.playerRow}>
                                    <span className={styles.rank}>#{index + 1}</span>
                                    <div
                                        className={styles.miniAvatar}
                                        style={{background: player.color || '#6366f1'}}
                                    >
                                        {player.username.charAt(0).toUpperCase()}
                                    </div>
                                    <span className={styles.playerName}>{player.username}</span>
                                    <div className={styles.playerRowStats}>
                                        <span>{player.wpm} WPM</span>
                                        <span className={styles.dot}>•</span>
                                        <span>{player.accuracy.toFixed(1)}%</span>
                                        <span className={styles.dot}>•</span>
                                        <span>{Math.round(player.progress)}%</span>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>

                <Flex justify="center" gap="md">
                    <Button variant="primary" size="lg" onClick={onClose}>
                        Volver al Lobby
                    </Button>
                </Flex>
            </div>
        </Modal>
    );
};