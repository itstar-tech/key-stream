import { Player } from './player.types';
import { GameState } from './game.types';

export interface Room {
    id: string;
    name: string;
    hostId: string;
    players: Player[];
    maxPlayers: number;
    currentPlayers: number;
    state: GameState;
    isPrivate: boolean;
    createdAt: number;
}

export interface RoomListItem {
    id: string;
    name: string;
    currentPlayers: number;
    maxPlayers: number;
    state: GameState;
    isPrivate: boolean;
}

export interface CreateRoomRequest {
    name: string;
    maxPlayers: number;
    eliminationInterval: number;
    isPrivate: boolean;
    password?: string;
}

export interface JoinRoomRequest {
    roomId: string;
    username: string;
    password?: string;
}