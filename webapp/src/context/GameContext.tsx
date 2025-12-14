import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useWebSocketMessage } from '../hooks';
import { createGameService, GameService } from '../services';
import { useWebSocketContext } from './WebSocketContext';
import type {
    Game,
    Player,
    GameState,
    Room,
    RoomStatePayload,
    GameStartPayload,
    GameCountdownPayload,
    PlayerProgressPayload,
    EliminationPayload,
    WinnerPayload,
    PlayerJoinedPayload,
    PlayerLeftPayload,
    TypingUpdatePayload,
} from '../types';

interface GameContextValue {
    room: Room | null;
    game: Game | null;
    players: Player[];
    currentPlayer: Player | null;
    gameState: GameState;

    userId: string | null;
    username: string | null;

    isHost: boolean;
    isInRoom: boolean;
    countdown: number | null;
    winner: Player | null;

    setUserId: (id: string) => void;
    setUsername: (name: string) => void;
    joinRoom: (roomId: string, username: string, password?: string) => void;
    leaveRoom: () => void;
    startGame: () => void;
    sendTypingUpdate: (data: TypingUpdatePayload) => void;

    gameService: GameService | null;
}

const GameContext = createContext<GameContextValue | undefined>(undefined);

interface GameProviderProps {
    children: React.ReactNode;
}


export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
    const { ws, isConnected } = useWebSocketContext();

    const [userId, setUserId] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);

    const [room, setRoom] = useState<Room | null>(null);
    const [game, setGame] = useState<Game | null>(null);
    const [players, setPlayers] = useState<Player[]>([]);
    const [countdown, setCountdown] = useState<number | null>(null);
    const [winner, setWinner] = useState<Player | null>(null);

    const [gameService, setGameService] = useState<GameService | null>(null);

    useEffect(() => {
        if (ws) {
            setGameService(createGameService(ws));
        }
    }, [ws]);


    useWebSocketMessage<RoomStatePayload>(
        'room_state',
        (payload) => {
            setRoom(payload.room);
            setGame(payload.game);
            setPlayers(payload.game.players);
        },
        []
    );


    useWebSocketMessage<GameStartPayload>(
        'game_start',
        (payload) => {
            console.log('¡El juego ha comenzado!', payload);
            if (game) {
                setGame({ ...game, state: 'playing', startTime: payload.startTime });
            }
        },
        [game]
    );


    useWebSocketMessage<GameCountdownPayload>(
        'game_countdown',
        (payload) => {
            setCountdown(payload.countdown);

            if (payload.countdown === 0) {
                setCountdown(null);
            }
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
            console.log(`${payload.player.username} ha sido eliminado!`);

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
            console.log(`¡${payload.winner.username} ha ganado!`);
            setWinner(payload.winner);
            setPlayers(payload.finalPlayers);

            if (game) {
                setGame({ ...game, state: 'finished' });
            }
        },
        [game]
    );


    useWebSocketMessage<PlayerJoinedPayload>(
        'player_joined',
        (payload) => {
            console.log(`${payload.player.username} se ha unido`);
            setPlayers((prev) => [...prev, payload.player]);
        },
        []
    );

    useWebSocketMessage<PlayerLeftPayload>(
        'player_left',
        (payload) => {
            console.log(`${payload.username} se ha ido`);
            setPlayers((prev) => prev.filter((p) => p.id !== payload.playerId));
        },
        []
    );


    const joinRoom = useCallback(
        (roomId: string, username: string, password?: string) => {
            if (gameService && isConnected) {
                gameService.joinRoom(roomId, username, password);
            }
        },
        [gameService, isConnected]
    );


    const leaveRoom = useCallback(() => {
        if (gameService && room) {
            gameService.leaveRoom(room.id);
            setRoom(null);
            setGame(null);
            setPlayers([]);
            setWinner(null);
            setCountdown(null);
        }
    }, [gameService, room]);


    const startGame = useCallback(() => {
        if (gameService && room && isHost) {
            gameService.startGame(room.id);
        }
    }, [gameService, room]);


    const sendTypingUpdate = useCallback(
        (data: TypingUpdatePayload) => {
            if (gameService && room) {
                gameService.sendTypingUpdate(room.id, data);
            }
        },
        [gameService, room]
    );

    const currentPlayer = players.find((p) => p.id === userId) || null;
    const gameState: GameState = game?.state || 'waiting';
    const isHost = room?.hostId === userId;
    const isInRoom = room !== null;

    const value: GameContextValue = {
        room,
        game,
        players,
        currentPlayer,
        gameState,
        userId,
        username,
        isHost,
        isInRoom,
        countdown,
        winner,
        setUserId,
        setUsername,
        joinRoom,
        leaveRoom,
        startGame,
        sendTypingUpdate,
        gameService,
    };

    return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};


export const useGameContext = (): GameContextValue => {
    const context = useContext(GameContext);

    if (context === undefined) {
        throw new Error('useGameContext debe ser usado dentro de GameProvider');
    }

    return context;
};