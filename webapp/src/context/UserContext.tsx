import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    saveUsername,
    getSavedUsername,
    saveUserId,
    getSavedUserId,
} from '../utils';

interface UserContextValue {
    userId: string | null;
    username: string | null;
    setUserId: (id: string) => void;
    setUsername: (name: string) => void;
    clearUser: () => void;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

interface UserProviderProps {
    children: React.ReactNode;
}


export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [userId, setUserIdState] = useState<string | null>(null);
    const [username, setUsernameState] = useState<string | null>(null);

    useEffect(() => {
        const savedUserId = getSavedUserId();
        const savedUsername = getSavedUsername();

        if (savedUserId) setUserIdState(savedUserId);
        if (savedUsername) setUsernameState(savedUsername);
    }, []);


    const setUserId = (id: string) => {
        setUserIdState(id);
        saveUserId(id);
    };


    const setUsername = (name: string) => {
        setUsernameState(name);
        saveUsername(name);
    };


    const clearUser = () => {
        setUserIdState(null);
        setUsernameState(null);
        localStorage.removeItem('typing_br_user_id');
        localStorage.removeItem('typing_br_username');
    };

    const value: UserContextValue = {
        userId,
        username,
        setUserId,
        setUsername,
        clearUser,
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};


export const useUserContext = (): UserContextValue => {
    const context = useContext(UserContext);

    if (context === undefined) {
        throw new Error('useUserContext debe ser usado dentro de UserProvider');
    }

    return context;
};