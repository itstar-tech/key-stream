import React, {useEffect, useState} from 'react';
import {getRooms} from '../../services';
import type {RoomListItem} from '../../types';
import {Card, Button, Badge, Spinner} from '../UI';
import {Grid} from '../Layout';
import styles from './RoomList.module.css';

interface RoomListProps {
    onJoinRoom: (roomId: string) => void;
}

export const RoomList: React.FC<RoomListProps> = ({onJoinRoom}) => {
    const [rooms, setRooms] = useState<RoomListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadRooms().then(r => console.log(r));

        const interval = setInterval(loadRooms, 5000);

        return () => clearInterval(interval);
    }, []);

    const loadRooms = async () => {
        try {
            const data = await getRooms();
            setRooms(data);
            setError(null);
        } catch (err) {
            setError('Error al cargar las salas');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getStateBadge = (state: string) => {
        switch (state) {
            case 'waiting':
                return <Badge variant="warning">Esperando</Badge>;
            case 'playing':
                return <Badge variant="info">En juego</Badge>;
            case 'finished':
                return <Badge variant="secondary">Finalizado</Badge>;
            default:
                return <Badge variant="secondary">{state}</Badge>;
        }
    };

    if (loading) {
        return (
            <div className={styles.loading}>
                <Spinner size="lg"/>
                <p>Cargando salas...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.error}>
                <p>{error}</p>
                <Button onClick={loadRooms}>Reintentar</Button>
            </div>
        );
    }

    if (rooms.length === 0) {
        return (
            <div className={styles.empty}>
                <span className={styles.emptyIcon}>🎮</span>
                <h3>No hay salas disponibles</h3>
                <p>Sé el primero en crear una sala</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3>Salas Disponibles ({rooms.length})</h3>
                <Button size="sm" variant="secondary" onClick={loadRooms}>
                    🔄 Actualizar
                </Button>
            </div>

            <Grid columns={2} gap="md">
                {rooms.map((room) => (
                    <Card key={room.id} className={styles.roomCard} hover>
                        <div className={styles.roomHeader}>
                            <h4 className={styles.roomName}>{room.name}</h4>
                            {getStateBadge(room.state)}
                        </div>

                        <div className={styles.roomInfo}>
                            <div className={styles.infoItem}>
                                <span className={styles.infoIcon}>👥</span>
                                <span>
                  {room.currentPlayers}/{room.maxPlayers} jugadores
                </span>
                            </div>

                            {room.isPrivate && (
                                <div className={styles.infoItem}>
                                    <span className={styles.infoIcon}>🔒</span>
                                    <span>Privada</span>
                                </div>
                            )}
                        </div>

                        <Button
                            fullWidth
                            variant="primary"
                            disabled={
                                room.state !== 'waiting' ||
                                room.currentPlayers >= room.maxPlayers
                            }
                            onClick={() => onJoinRoom(room.id)}
                        >
                            {room.state === 'waiting'
                                ? room.currentPlayers >= room.maxPlayers
                                    ? 'Sala llena'
                                    : 'Unirse'
                                : 'En juego'}
                        </Button>
                    </Card>
                ))}
            </Grid>
        </div>
    );
};