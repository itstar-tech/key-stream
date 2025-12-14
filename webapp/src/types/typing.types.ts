export interface CharacterStatus {
    char: string;
    status: 'pending' | 'correct' | 'incorrect' | 'current';
    index: number;
}

export interface TypingMetrics {
    wpm: number;
    rawWpm: number;
    accuracy: number;
    correctChars: number;
    incorrectChars: number;
    totalChars: number;
    elapsedTime: number;
}

export interface KeystrokeData {
    key: string;
    timestamp: number;
    isCorrect: boolean;
    expectedChar: string;
}

export interface TypingSession {
    startTime: number | null;
    endTime: number | null;
    text: string;
    currentIndex: number;
    typedChars: string[];
    keystrokes: KeystrokeData[];
    errors: Set<number>;
}