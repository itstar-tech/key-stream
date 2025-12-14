import React from 'react';
import { useGameContext } from '../../context';
import { Card, Button, Badge, ProgressBar } from '../UI';
import { Section, Flex, Grid } from '../Layout';
import styles from './WaitingRoom.module.css';

interface WaitingRoomProps {
    onLeave: () => void;
    onStartGame: () => void;
}

export const WaitingRoom: React.FC<WaitingRoomProps> = ({
                                                            onLeave,
                                                            onStartGame,
                                                        }) => {
    const { room, players, isHost, currentPlayer } = useGameContext();

    if (!room) return null;

    const playerProgress = (players.length / room.maxPlayers) * 100;
    const canStart = players.length >= 2 && isHost;

    return (
        <div className={styles.container}>
            <Section
                title={room.name}
                subtitle={`Código de sala: ${room.id}`}
                actions={
                    <Flex gap="md">
                        {isHost && (
                            <Button
                                variant="success"
                                size="lg"
                                disabled={!canStart}
                                onClick={onStartGame}
                            >
                                🎮 Iniciar Juego
                            </Button>
                        )}
                        <Button variant="danger" size="lg" onClick={onLeave}>
                            Salir
                        </Button>
                    </Flex>
                }
            >
                <div className={styles.content}>
                    {/* Info de la sala */}
                    <Card className={styles.infoCard}>
                        <h3>Estado de la Sala</h3>
                        <div className={styles.infoGrid}>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>Jugadores</span>
                                <span className={styles.infoValue}>
                  {players.length}/{room.maxPlayers}
                </span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>Estado</span>
                                <Badge variant="warning">Esperando</Badge>
                            </div>
                            {room.isPrivate && (
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Tipo</span>
                                    <Badge variant="info">🔒 Privada</Badge>
                                </div>
                            )}
                        </div>

                        <div className={styles.progress}>
                            <ProgressBar value={playerProgress} showLabel animated />
                        </div>

                        {!canStart && (
                            <div className={styles.waitingMessage}>
                                <span>⏳</span>
                                <p>
                                    {players.length < 2
                                        ? 'Esperando al menos 2 jugadores para comenzar...'
                                        : isHost
                                            ? 'Puedes iniciar el juego cuando estés listo'
                                            : 'Esperando a que el host inicie el juego...'}
                                </p>
                            </div>
                        )}
                    </Card>

                    {/* Lista de jugadores */}
                    <div className={styles.playersSection}>
                        <h3>Jugadores ({players.length})</h3>
                        <Grid columns={2} gap="md">
                            {players.map((player) => (
                                <Card key={player.id} className={styles.playerCard}>
                                    <Flex align="center" justify="between">
                                        <Flex align="center" gap="md">
                                            <div
                                                className={styles.playerAvatar}
                                                style={{ background: player.color || '#6366f1' }}
                                            >
                                                {player.username.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className={styles.playerName}>
                                                    {player.username}
                                                    {player.id === currentPlayer?.id && ' (Tú)'}
                                                </div>
                                                {player.id === room.hostId && (
                                                    <Badge size="sm" variant="warning">
                                                        👑 Host
                                                    </Badge>
                                                )}
                                            </div>
                                        </Flex>
                                        <Badge variant="success">Listo</Badge>
                                    </Flex>
                                </Card>
                            ))}
                        </Grid>
                    </div>
                </div>
            </Section>
        </div>
    );
};