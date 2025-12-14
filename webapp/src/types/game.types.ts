import { Player } from './player.types';

export type GameState = 'waiting' | 'countdown' | 'playing' | 'finished';

export interface Game {
    id: string;
    roomId: string;
    state: GameState;
    text: string;
    players: Player[];
    startTime: number | null;
    endTime: number | null;
    maxPlayers: number;
    eliminationInterval: number;
    countdownTime?: number;
}

export interface GameSettings {
    maxPlayers: number;
    eliminationInterval: number;
    textDifficulty: 'easy' | 'medium' | 'hard';
    isPrivate: boolean;
    roomName: string;
}

export interface GameResult {
    winner: Player;
    finalPlayers: Player[];
    duration: number;
    timestamp: number;
}

export interface EliminationEvent {
    playerId: string;
    username: string;
    reason: 'slowest' | 'timeout' | 'disconnect';
    timestamp: number;
}