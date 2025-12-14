import {useState, useEffect, useCallback} from 'react';
import {saveToStorage, getFromStorage} from '../utils';


export const useLocalStorage = <T>(
    key: string,
    initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] => {
    const [storedValue, setStoredValue] = useState<T>(() => {
        const item = getFromStorage<T>(key);
        return item !== null ? item : initialValue;
    });


    const setValue = useCallback(
        (value: T | ((prev: T) => T)) => {
            setStoredValue((prev) => {
                const valueToStore = value instanceof Function ? value(prev) : value;
                saveToStorage(key, valueToStore);
                return valueToStore;
            });
        },
        [key]
    );


    const removeValue = useCallback(() => {
        localStorage.removeItem(key);
        setStoredValue(initialValue);
    }, [key, initialValue]);


    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === key && e.newValue) {
                try {
                    setStoredValue(JSON.parse(e.newValue));
                } catch (error) {
                    console.error('Error parsing storage value:', error);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [key]);

    return [storedValue, setValue, removeValue];
};