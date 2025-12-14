import { useEffect, useCallback } from 'react';


export const useKeyPress = (
    targetKey: string,
    callback: (event: KeyboardEvent) => void,
    options: {
        preventDefault?: boolean;
        enabled?: boolean;
    } = {}
): void => {
    const { preventDefault = false, enabled = true } = options;

    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            if (!enabled) return;

            if (event.key === targetKey) {
                if (preventDefault) {
                    event.preventDefault();
                }
                callback(event);
            }
        },
        [targetKey, callback, preventDefault, enabled]
    );

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);
};


export const useKeyCapture = (
    callback: (key: string, event: KeyboardEvent) => void,
    options: {
        enabled?: boolean;
        preventDefault?: boolean;
        ignoreInputs?: boolean;
    } = {}
): void => {
    const {
        enabled = true,
        preventDefault = false,
        ignoreInputs = true,
    } = options;

    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            if (!enabled) return;

            if (ignoreInputs) {
                const target = event.target as HTMLElement;
                if (
                    target.tagName === 'INPUT' ||
                    target.tagName === 'TEXTAREA' ||
                    target.isContentEditable
                ) {
                    return;
                }
            }

            if (preventDefault) {
                event.preventDefault();
            }

            callback(event.key, event);
        },
        [callback, enabled, preventDefault, ignoreInputs]
    );

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);
};