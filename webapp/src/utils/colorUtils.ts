export const generateRandomColor = (): string => {
    const colors = [
        '#ef4444',
        '#f59e0b',
        '#eab308',
        '#22c55e',
        '#06b6d4',
        '#3b82f6',
        '#8b5cf6',
        '#ec4899',
    ];

    return colors[Math.floor(Math.random() * colors.length)];
};


export const assignPlayerColors = (playerCount: number): string[] => {
    const baseColors = [
        '#ef4444',
        '#f59e0b',
        '#22c55e',
        '#06b6d4',
        '#3b82f6',
        '#8b5cf6',
        '#ec4899',
        '#f97316',
    ];

    const colors: string[] = [];

    for (let i = 0; i < playerCount; i++) {
        colors.push(baseColors[i % baseColors.length]);
    }

    return colors;
};

export const hexToRgba = (hex: string, alpha: number = 1): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};


export const getRankColor = (position: number): string => {
    switch (position) {
        case 1:
            return '#fbbf24';
        case 2:
            return '#9ca3af';
        case 3:
            return '#cd7f32';
        default:
            return '#64748b';
    }
};