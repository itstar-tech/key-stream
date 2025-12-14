export const calculateWPM = (
    correctChars: number,
    timeInSeconds: number
): number => {
    if (timeInSeconds === 0) return 0;

    const timeInMinutes = timeInSeconds / 60;
    const words = correctChars / 5;
    const wpm = words / timeInMinutes;

    return Math.round(wpm);
};


export const calculateRawWPM = (
    totalChars: number,
    timeInSeconds: number
): number => {
    if (timeInSeconds === 0) return 0;

    const timeInMinutes = timeInSeconds / 60;
    const words = totalChars / 5;
    const rawWpm = words / timeInMinutes;

    return Math.round(rawWpm);
};

export const calculateLiveWPM = (
    currentIndex: number,
    startTime: number | null,
    errors: number = 0
): number => {
    if (!startTime || currentIndex === 0) return 0;

    const elapsedSeconds = (Date.now() - startTime) / 1000;

    if (elapsedSeconds < 2) return 0;

    const correctChars = Math.max(0, currentIndex - errors);

    return calculateWPM(correctChars, elapsedSeconds);
};