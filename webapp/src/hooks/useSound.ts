import { useRef, useCallback } from 'react';

interface UseSoundReturn {
    play: () => void;
    pause: () => void;
    stop: () => void;
}


export const useSound = (
    url: string,
    { volume = 1.0 }: { volume?: number } = {}
): UseSoundReturn => {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    if (!audioRef.current) {
        audioRef.current = new Audio(url);
        audioRef.current.volume = volume;
    }

    const play = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch((error) => {
                console.error('Error playing sound:', error);
            });
        }
    }, []);

    const pause = useCallback(() => {
        audioRef.current?.pause();
    }, []);

    const stop = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    }, []);

    return { play, pause, stop };
};