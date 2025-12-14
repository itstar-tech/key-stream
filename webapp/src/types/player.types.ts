export interface Player {
    id: string;
    username: string;
    progress: number;
    wpm: number;
    accuracy: number;
    alive: boolean;
    position?: number;
    avatar?: string;
    color?: string;
}

export interface PlayerStats {
    wpm: number;
    accuracy: number;
    correctChars: number;
    incorrectChars: number;
    totalChars: number;
    timeElapsed: number;
}

export interface PlayerInput {
    currentIndex: number;
    typedText: string;
    errors: number[];
    startTime: number | null;
    endTime: number | null;
}