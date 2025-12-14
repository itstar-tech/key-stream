import {useState, useEffect, useRef, useCallback} from 'react';

export interface UseCountdownOptions {
    initialSeconds: number;
    onComplete?: () => void;
    autoStart?: boolean;
}

export interface UseCountdownReturn {
    seconds: number;
    isRunning: boolean;
    isComplete: boolean;
    start: () => void;
    pause: () => void;
    reset: () => void;
}


export const useCountdown = ({
                                 initialSeconds,
                                 onComplete,
                                 autoStart = false,
                             }: UseCountdownOptions): UseCountdownReturn => {
    const [seconds, setSeconds] = useState(initialSeconds);
    const [isRunning, setIsRunning] = useState(autoStart);
    const [isComplete, setIsComplete] = useState(false);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const onCompleteRef = useRef(onComplete);

    useEffect(() => {
        onCompleteRef.current = onComplete;
    }, [onComplete]);

    const start = useCallback(() => {
        if (!isComplete) {
            setIsRunning(true);
        }
    }, [isComplete]);

    const pause = useCallback(() => {
        setIsRunning(false);
    }, []);

    const reset = useCallback(() => {
        setSeconds(initialSeconds);
        setIsRunning(false);
        setIsComplete(false);
    }, [initialSeconds]);

    useEffect(() => {
        if (isRunning && seconds > 0) {
            intervalRef.current = setInterval(() => {
                setSeconds((prev) => {
                    if (prev <= 1) {
                        setIsRunning(false);
                        setIsComplete(true);
                        onCompleteRef.current?.();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => {
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                }
            };
        }
    }, [isRunning, seconds]);

    return {
        seconds,
        isRunning,
        isComplete,
        start,
        pause,
        reset,
    };
};