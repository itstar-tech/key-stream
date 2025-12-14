import React from 'react';
import type {Player} from '../../types';
import {Card, Badge, ProgressBar} from '../UI';
import styles from './PlayerList.module.css';

interface PlayerListProps {
    players: Player[];
    currentPlayerId: string | null;
}

export const PlayerList: React.FC<PlayerListProps> = ({
                                                          players,
                                                          currentPlayerId,
                                                      }) => {
    const sortedPlayers = [...players].sort((a, b) => b.progress - a.progress);

    return (
        <Card className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.title}>Jugadores</h3>
                <Badge variant="info">{players.filter(p => p.alive).length} vivos</Badge>
            </div>

            <div className={styles.playerList}>
                {sortedPlayers.map((player, index) => {
                    const isCurrentPlayer = player.id === currentPlayerId;
                    const position = index + 1;

                    return (
                        <div
                            key={player.id}
                            className={`${styles.playerItem} ${
                                !player.alive ? styles.eliminated : ''
                            } ${isCurrentPlayer ? styles.currentPlayer : ''}`}
                        >
                            <div className={styles.playerHeader}>
                                <div className={styles.playerInfo}>
                                    <div className={styles.position}>#{position}</div>

                                    <div
                                        className={styles.avatar}
                                        style={{background: player.color || '#6366f1'}}
                                    >
                                        {player.username.charAt(0).toUpperCase()}
                                    </div>

                                    <div className={styles.nameSection}>
                                        <div className={styles.name}>
                                            {player.username}
                                            {isCurrentPlayer && (
                                                <span className={styles.youLabel}>(Tú)</span>
                                            )}
                                        </div>
                                        <div className={styles.stats}>
                                            <span>{player.wpm} WPM</span>
                                            <span className={styles.dot}>•</span>
                                            <span>{player.accuracy.toFixed(1)}%</span>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.statusBadge}>
                                    {!player.alive ? (
                                        <Badge variant="danger" size="sm">
                                            💀 Eliminado
                                        </Badge>
                                    ) : player.progress >= 100 ? (
                                        <Badge variant="success" size="sm">
                                            ✅ Completado
                                        </Badge>
                                    ) : (
                                        <span className={styles.progressText}>
                      {Math.round(player.progress)}%
                    </span>
                                    )}
                                </div>
                            </div>

                            <ProgressBar
                                value={player.progress}
                                color={player.alive ? player.color : '#64748b'}
                                height={6}
                                animated={player.alive}
                            />
                        </div>
                    );
                })}
            </div>
        </Card>
    );
};