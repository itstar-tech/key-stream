export const calculateAccuracy = (
    correctChars: number,
    totalChars: number
): number => {
    if (totalChars === 0) return 100;

    const accuracy = (correctChars / totalChars) * 100;

    return Math.round(accuracy * 10) / 10; // Redondear a 1 decimal
};


export const calculateAccuracyFromErrors = (
    totalChars: number,
    errors: number
): number => {
    if (totalChars === 0) return 100;

    const correctChars = totalChars - errors;

    return calculateAccuracy(correctChars, totalChars);
};

export const isGoodAccuracy = (accuracy: number): boolean => {
    return accuracy >= 95;
};

export const getAccuracyColor = (accuracy: number): string => {
    if (accuracy >= 98) return 'var(--color-success)';
    if (accuracy >= 95) return 'var(--color-info)';
    if (accuracy >= 90) return 'var(--color-warning)';
    return 'var(--color-danger)';
};