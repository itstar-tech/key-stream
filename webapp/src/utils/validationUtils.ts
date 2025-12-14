export const validateUsername = (username: string): {
    valid: boolean;
    error?: string;
} => {
    if (!username || username.trim().length === 0) {
        return {valid: false, error: 'El nombre de usuario es requerido'};
    }

    if (username.length < 3) {
        return {valid: false, error: 'El nombre debe tener al menos 3 caracteres'};
    }

    if (username.length > 20) {
        return {valid: false, error: 'El nombre no puede tener más de 20 caracteres'};
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
        return {
            valid: false,
            error: 'Solo se permiten letras, números, guiones y guiones bajos',
        };
    }

    return {valid: true};
};


export const validateRoomName = (roomName: string): {
    valid: boolean;
    error?: string;
} => {
    if (!roomName || roomName.trim().length === 0) {
        return {valid: false, error: 'El nombre de la sala es requerido'};
    }

    if (roomName.length < 3) {
        return {valid: false, error: 'El nombre debe tener al menos 3 caracteres'};
    }

    if (roomName.length > 50) {
        return {valid: false, error: 'El nombre no puede tener más de 50 caracteres'};
    }

    return {valid: true};
};


export const validateGameSettings = (settings: {
    maxPlayers: number;
    eliminationInterval: number;
}): {
    valid: boolean;
    error?: string;
} => {
    if (settings.maxPlayers < 2) {
        return {valid: false, error: 'Debe haber al menos 2 jugadores'};
    }

    if (settings.maxPlayers > 50) {
        return {valid: false, error: 'No puede haber más de 50 jugadores'};
    }

    if (settings.eliminationInterval < 10) {
        return {valid: false, error: 'El intervalo de eliminación debe ser al menos 10 segundos'};
    }

    if (settings.eliminationInterval > 300) {
        return {valid: false, error: 'El intervalo de eliminación no puede ser mayor a 5 minutos'};
    }

    return {valid: true};
};