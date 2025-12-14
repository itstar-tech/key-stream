export {
    calculateWPM,
    calculateRawWPM,
    calculateLiveWPM,
} from './calculateWPM';

export {
    calculateAccuracy,
    calculateAccuracyFromErrors,
    isGoodAccuracy,
    getAccuracyColor,
} from './calculateAccuracy';

export {
    getRandomText,
    isCharacterCorrect,
    calculateProgress,
    formatTextForDisplay,
    countWords,
    getTextPreview,
    normalizeText,
} from './textUtils';

export {
    formatTime,
    formatMilliseconds,
    getElapsedTime,
    getElapsedTimeMs,
    formatDate,
    getTimeRemaining,
} from './timeUtils';

export {
    generateRandomColor,
    assignPlayerColors,
    hexToRgba,
    getRankColor,
} from './colorUtils';

export {
    validateUsername,
    validateRoomName,
    validateGameSettings,
} from './validationUtils';

export {
    saveToStorage,
    getFromStorage,
    removeFromStorage,
    clearStorage,
    STORAGE_KEYS,
    saveUsername,
    getSavedUsername,
    saveUserId,
    getSavedUserId,
} from './storageUtils';