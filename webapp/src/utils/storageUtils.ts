export const saveToStorage = <T>(key: string, value: T): boolean => {
    try {
        const serialized = JSON.stringify(value);
        localStorage.setItem(key, serialized);
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
};


export const getFromStorage = <T>(key: string): T | null => {
    try {
        const serialized = localStorage.getItem(key);
        if (serialized === null) return null;
        return JSON.parse(serialized) as T;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return null;
    }
};


export const removeFromStorage = (key: string): boolean => {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('Error removing from localStorage:', error);
        return false;
    }
};


export const clearStorage = (): boolean => {
    try {
        localStorage.clear();
        return true;
    } catch (error) {
        console.error('Error clearing localStorage:', error);
        return false;
    }
};

export const STORAGE_KEYS = {
    USERNAME: 'typing_br_username',
    USER_ID: 'typing_br_user_id',
    SETTINGS: 'typing_br_settings',
    STATS: 'typing_br_stats',
    LAST_ROOM: 'typing_br_last_room',
} as const;


export const saveUsername = (username: string): boolean => {
    return saveToStorage(STORAGE_KEYS.USERNAME, username);
};


export const getSavedUsername = (): string | null => {
    return getFromStorage<string>(STORAGE_KEYS.USERNAME);
};


export const saveUserId = (userId: string): boolean => {
    return saveToStorage(STORAGE_KEYS.USER_ID, userId);
};


export const getSavedUserId = (): string | null => {
    return getFromStorage<string>(STORAGE_KEYS.USER_ID);
};