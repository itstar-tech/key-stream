import {useState, useEffect, useCallback, useRef} from 'react';
import type {TypingMetrics, TypingSession, CharacterStatus} from '../types';
import {
    calculateLiveWPM,
    calculateAccuracy,
    isCharacterCorrect,
} from '../utils/index';

interface UseTypingOptions {
    text: string;
    onComplete?: () => void;
    onProgressUpdate?: (metrics: TypingMetrics) => void;
}

interface UseTypingReturn {
    currentIndex: number;
    typedText: string;
    metrics: TypingMetrics;
    characterStatuses: CharacterStatus[];
    isComplete: boolean;
    hasStarted: boolean;
    handleKeyPress: (key: string) => void;
    reset: () => void;
    session: TypingSession;
}


export const useTyping = ({
                              text,
                              onComplete,
                              onProgressUpdate,
                          }: UseTypingOptions): UseTypingReturn => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [typedText, setTypedText] = useState('');
    const [errors, setErrors] = useState<Set<number>>(new Set());
    const [startTime, setStartTime] = useState<number | null>(null);
    const [isComplete, setIsComplete] = useState(false);

    const textRef = useRef(text);
    const updateIntervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        textRef.current = text;
    }, [text]);


    const calculateMetrics = useCallback((): TypingMetrics => {
        const elapsedTime = startTime
            ? Math.floor((Date.now() - startTime) / 1000)
            : 0;

        const correctChars = currentIndex - errors.size;
        const wpm = calculateLiveWPM(currentIndex, startTime, errors.size);
        const accuracy = calculateAccuracy(correctChars, currentIndex);

        return {
            wpm,
            rawWpm: calculateLiveWPM(currentIndex, startTime, 0),
            accuracy,
            correctChars,
            incorrectChars: errors.size,
            totalChars: currentIndex,
            elapsedTime,
        };
    }, [currentIndex, errors, startTime]);

    const [metrics, setMetrics] = useState<TypingMetrics>(calculateMetrics());


    const characterStatuses: CharacterStatus[] = textRef.current
        .split('')
        .map((char, index) => ({
            char,
            index,
            status:
                index < currentIndex
                    ? errors.has(index)
                        ? 'incorrect'
                        : 'correct'
                    : index === currentIndex
                        ? 'current'
                        : 'pending',
        }));


    const handleKeyPress = useCallback(
        (key: string) => {
            if (isComplete) return;

            if (!startTime) {
                setStartTime(Date.now());
            }

            const expectedChar = textRef.current[currentIndex];

            if (key === 'Backspace') {
                if (currentIndex > 0) {
                    setCurrentIndex((prev) => prev - 1);
                    setTypedText((prev) => prev.slice(0, -1));

                    setErrors((prev) => {
                        const newErrors = new Set(prev);
                        newErrors.delete(currentIndex - 1);
                        return newErrors;
                    });
                }
                return;
            }

            if (key.length > 1) return;

            const correct = isCharacterCorrect(key, expectedChar);

            if (!correct) {
                setErrors((prev) => new Set(prev).add(currentIndex));
            }

            setTypedText((prev) => prev + key);
            setCurrentIndex((prev) => prev + 1);

            if (currentIndex + 1 >= textRef.current.length) {
                setIsComplete(true);
                onComplete?.();
            }
        },
        [currentIndex, isComplete, startTime, onComplete]
    );


    const reset = useCallback(() => {
        setCurrentIndex(0);
        setTypedText('');
        setErrors(new Set());
        setStartTime(null);
        setIsComplete(false);
        setMetrics({
            wpm: 0,
            rawWpm: 0,
            accuracy: 100,
            correctChars: 0,
            incorrectChars: 0,
            totalChars: 0,
            elapsedTime: 0,
        });
    }, []);


    useEffect(() => {
        if (startTime && !isComplete) {
            updateIntervalRef.current = setInterval(() => {
                const newMetrics = calculateMetrics();
                setMetrics(newMetrics);
                onProgressUpdate?.(newMetrics);
            }, 500);

            return () => {
                if (updateIntervalRef.current) {
                    clearInterval(updateIntervalRef.current);
                }
            };
        }
    }, [startTime, isComplete, calculateMetrics, onProgressUpdate]);


    useEffect(() => {
        const newMetrics = calculateMetrics();
        setMetrics(newMetrics);
    }, [calculateMetrics]);


    useEffect(() => {
        reset();
    }, [text, reset]);

    const session: TypingSession = {
        startTime,
        endTime: isComplete ? Date.now() : null,
        text: textRef.current,
        currentIndex,
        typedChars: typedText.split(''),
        keystrokes: [],
        errors,
    };

    return {
        currentIndex,
        typedText,
        metrics,
        characterStatuses,
        isComplete,
        hasStarted: startTime !== null,
        handleKeyPress,
        reset,
        session,
    };
};