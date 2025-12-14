export const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};


export const formatMilliseconds = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    return formatTime(seconds);
};


export const getElapsedTime = (startTime: number | null): number => {
    if (!startTime) return 0;
    return Math.floor((Date.now() - startTime) / 1000);
};


export const getElapsedTimeMs = (startTime: number | null): number => {
    if (!startTime) return 0;
    return Date.now() - startTime;
};


export const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const getTimeRemaining = (futureTime: number): number => {
    const remaining = futureTime - Date.now();
    return Math.max(0, Math.floor(remaining / 1000));
};