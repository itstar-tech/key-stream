import {WebSocketService} from './websocket';
import {
    JoinRoomPayload,
    LeaveRoomPayload,
    TypingUpdatePayload,
} from '../types';


export class GameService {
    constructor(private ws: WebSocketService) {
    }


    joinRoom(roomId: string, username: string, password?: string): void {
        const payload: JoinRoomPayload = {
            roomId,
            username,
            password,
        };

        this.ws.send('join_room', payload, roomId);
    }


    leaveRoom(roomId: string): void {
        const payload: LeaveRoomPayload = {
            roomId,
        };

        this.ws.send('leave_room', payload, roomId);
    }


    startGame(roomId: string): void {
        this.ws.send('start_game', {}, roomId);
    }


    sendTypingUpdate(
        roomId: string,
        data: TypingUpdatePayload
    ): void {
        this.ws.send('typing_update', data, roomId);
    }


    sendChatMessage(roomId: string, message: string): void {
        this.ws.send('chat_message', {message}, roomId);
    }

    setPlayerReady(roomId: string, ready: boolean): void {
        this.ws.send('player_ready', {ready}, roomId);
    }
}


export const createGameService = (ws: WebSocketService): GameService => {
    return new GameService(ws);
};