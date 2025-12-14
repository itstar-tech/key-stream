import type {Player, PlayerStats} from './player.types';
import type {Game} from './game.types';
import type {Room} from './room.types';

export type WebSocketMessageType =
    | 'join_room'
    | 'leave_room'
    | 'room_state'
    | 'start_game'
    | 'game_start'
    | 'game_countdown'
    | 'typing_update'
    | 'player_progress'
    | 'elimination'
    | 'winner'
    | 'player_joined'
    | 'player_left'
    | 'player_ready'
    | 'chat_message'
    | 'error'
    | 'ping'
    | 'pong';

export interface WebSocketMessage<T = any> {
    type: WebSocketMessageType;
    payload: T;
    roomId?: string;
    userId?: string;
    timestamp: number;
}


export interface JoinRoomPayload {
    roomId: string;
    username: string;
    password?: string;
}

export interface LeaveRoomPayload {
    roomId: string;
}

export interface RoomStatePayload {
    room: Room;
    game: Game;
}

export interface GameStartPayload {
    startTime: number;
    text: string;
}

export interface GameCountdownPayload {
    countdown: number;
}

export interface TypingUpdatePayload {
    progress: number;
    wpm: number;
    accuracy: number;
    currentIndex: number;
}

export interface PlayerProgressPayload {
    playerId: string;
    progress: number;
    wpm: number;
    accuracy: number;
    alive: boolean;
}

export interface EliminationPayload {
    player: Player;
    reason: string;
    remainingPlayers: number;
}

export interface WinnerPayload {
    winner: Player;
    stats: PlayerStats;
    finalPlayers: Player[];
}

export interface PlayerJoinedPayload {
    player: Player;
    totalPlayers: number;
}

export interface PlayerLeftPayload {
    playerId: string;
    username: string;
    totalPlayers: number;
}

export interface PlayerReadyPayload {
    ready: boolean;
}

export interface ChatMessagePayload {
    message: string;
    playerId?: string;
    username?: string;
    timestamp?: number;
}

export interface ErrorPayload {
    message: string;
    code?: string;
}

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

export interface WebSocketState {
    status: ConnectionStatus;
    error: string | null;
    reconnectAttempts: number;
    lastPing: number | null;
}