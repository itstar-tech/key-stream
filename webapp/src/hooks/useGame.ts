import { useState } from 'react';
import { useWebSocketMessage } from './useWebsocket';
import type {
    Game,
    Player,
    GameState,
    EliminationEvent,
    RoomStatePayload,
    GameStartPayload,
    PlayerProgressPayload,
    EliminationPayload,
    WinnerPayload,
} from '../types';

interface UseGameReturn {
    game: Game | null;
    players: Player[];
    currentPlayer: Player | null;
    gameState: GameState;
    isHost: boolean;
    winner: Player | null;
    eliminations: EliminationEvent[];
}


export const useGame = (
    roomId: string,
    userId: string
): UseGameReturn => {
    const [game, setGame] = useState<Game | null>(null);
    const [players, setPlayers] = useState<Player[]>([]);
    const [winner, setWinner] = useState<Player | null>(null);
    const [eliminations, setEliminations] = useState<EliminationEvent[]>([]);


    useWebSocketMessage<RoomStatePayload>(
        'room_state',
        (payload) => {
            if (payload.room.id === roomId) {
                setGame(payload.game);
                setPlayers(payload.game.players);
            }
        },
        [roomId]
    );


    useWebSocketMessage<GameStartPayload>(
        'game_start',
        (payload) => {
            console.log('¡El juego ha comenzado!', payload);
        },
        []
    );


    useWebSocketMessage<PlayerProgressPayload>(
        'player_progress',
        (payload) => {
            setPlayers((prevPlayers) =>
                prevPlayers.map((player) =>
                    player.id === payload.playerId
                        ? {
                            ...player,
                            progress: payload.progress,
                            wpm: payload.wpm,
                            accuracy: payload.accuracy,
                            alive: payload.alive,
                        }
                        : player
                )
            );
        },
        []
    );


    useWebSocketMessage<EliminationPayload>(
        'elimination',
        (payload) => {
            const eliminationEvent: EliminationEvent = {
                playerId: payload.player.id,
                username: payload.player.username,
                reason: 'slowest',
                timestamp: Date.now(),
            };

            setEliminations((prev) => [...prev, eliminationEvent]);

            setPlayers((prevPlayers) =>
                prevPlayers.map((player) =>
                    player.id === payload.player.id
                        ? { ...player, alive: false }
                        : player
                )
            );
        },
        []
    );


    useWebSocketMessage<WinnerPayload>(
        'winner',
        (payload) => {
            setWinner(payload.winner);
            setPlayers(payload.finalPlayers);

            if (game) {
                setGame({ ...game, state: 'finished' });
            }
        },
        [game]
    );

    const currentPlayer = players.find((p) => p.id === userId) || null;
    const gameState: GameState = game?.state || 'waiting';
    const isHost = game?.roomId === userId;

    return {
        game,
        players,
        currentPlayer,
        gameState,
        isHost,
        winner,
        eliminations,
    };
};