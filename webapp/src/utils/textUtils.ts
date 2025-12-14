const SAMPLE_TEXTS = {
    easy: [
        'El rápido zorro marrón salta sobre el perro perezoso. Los gatos duermen todo el día.',
        'La programación es divertida cuando aprendes paso a paso. Cada día mejoras más.',
        'Me gusta escribir código limpio y bien organizado. Es importante ser ordenado.',
    ],
    medium: [
        'En el desarrollo web moderno, React se ha convertido en una de las bibliotecas más populares para crear interfaces de usuario interactivas y dinámicas.',
        'TypeScript añade tipado estático a JavaScript, lo que ayuda a prevenir errores y mejora la experiencia de desarrollo con mejor autocompletado.',
        'La arquitectura de software es crucial para proyectos escalables. Una buena estructura facilita el mantenimiento y la colaboración.',
    ],
    hard: [
        'La complejidad algorítmica, expresada en notación Big O, describe cómo el tiempo de ejecución o el espacio requerido crecen relativamente al tamaño de la entrada.',
        'WebSockets proporcionan comunicación bidireccional full-duplex sobre una única conexión TCP, permitiendo aplicaciones en tiempo real eficientes.',
        'El patrón Observer define una dependencia uno-a-muchos entre objetos, de modo que cuando un objeto cambia su estado, todos sus dependientes son notificados automáticamente.',
    ],
};

export const getRandomText = (
    difficulty: 'easy' | 'medium' | 'hard' = 'medium'
): string => {
    const texts = SAMPLE_TEXTS[difficulty];
    const randomIndex = Math.floor(Math.random() * texts.length);
    return texts[randomIndex];
};


export const isCharacterCorrect = (
    typed: string,
    expected: string
): boolean => {
    return typed === expected;
};


export const calculateProgress = (
    currentIndex: number,
    totalLength: number
): number => {
    if (totalLength === 0) return 0;

    const progress = (currentIndex / totalLength) * 100;

    return Math.min(100, Math.round(progress * 10) / 10);
};


export const formatTextForDisplay = (text: string): string => {
    return text
        .replace(/ /g, '·') // Espacios visibles
        .replace(/\n/g, '↵\n'); // Saltos de línea visibles
};

export const countWords = (text: string): number => {
    return text.trim().split(/\s+/).length;
};

export const getTextPreview = (text: string, maxLength: number = 50): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};


export const normalizeText = (text: string): string => {
    return text
        .replace(/\s+/g, ' ')
        .trim();
};