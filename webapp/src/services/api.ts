import {
    Room,
    RoomListItem,
    CreateRoomRequest,
} from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';


class ApiError extends Error {
    constructor(
        message: string,
        public status?: number,
        public code?: string
    ) {
        super(message);
        this.name = 'ApiError';
    }
}


const fetchApi = async <T>(
    endpoint: string,
    options?: RequestInit
): Promise<T> => {
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({
                message: 'Error desconocido',
            }));
            throw new ApiError(
                error.message || 'Error en la solicitud',
                response.status,
                error.code
            );
        }

        return await response.json();
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError('Error de conexión con el servidor');
    }
};


export const getRooms = async (): Promise<RoomListItem[]> => {
    return fetchApi<RoomListItem[]>('/rooms');
};


export const getRoom = async (roomId: string): Promise<Room> => {
    return fetchApi<Room>(`/rooms/${roomId}`);
};


export const createRoom = async (
    data: CreateRoomRequest
): Promise<Room> => {
    return fetchApi<Room>('/rooms', {
        method: 'POST',
        body: JSON.stringify(data),
    });
};


export const checkRoomExists = async (roomId: string): Promise<boolean> => {
    try {
        await getRoom(roomId);
        return true;
    } catch (error) {
        return false;
    }
};


export const getServerStats = async (): Promise<{
    totalRooms: number;
    totalPlayers: number;
    activeGames: number;
}> => {
    return fetchApi('/stats');
};


export const healthCheck = async (): Promise<{ status: string }> => {
    return fetchApi('/health');
};

export {ApiError};