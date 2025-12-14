import React, { useEffect, useRef } from 'react';
import { useTyping } from '../../hooks';
import type { CharacterStatus } from '../../types';
import { Card } from '../UI';
import styles from './TypingArea.module.css';

interface TypingAreaProps {
    text: string;
    onComplete: () => void;
    onProgressUpdate: (progress: number, wpm: number, accuracy: number) => void;
    disabled?: boolean;
}

export const TypingArea: React.FC<TypingAreaProps> = ({
                                                          text,
                                                          onComplete,
                                                          onProgressUpdate,
                                                          disabled = false,
                                                      }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const currentCharRef = useRef<HTMLSpanElement>(null);

    const {
        characterStatuses,
        handleKeyPress,
        isComplete,
        hasStarted,
    } = useTyping({
        text,
        onComplete,
        onProgressUpdate: (m) => {
            const progress = (m.totalChars / text.length) * 100;
            onProgressUpdate(progress, m.wpm, m.accuracy);
        },
    });

    useEffect(() => {
        if (currentCharRef.current && containerRef.current) {
            const container = containerRef.current;
            const char = currentCharRef.current;

            const containerRect = container.getBoundingClientRect();
            const charRect = char.getBoundingClientRect();

            if (charRect.bottom > containerRect.bottom - 50) {
                char.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [characterStatuses]);

    useEffect(() => {
        if (disabled || isComplete) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (
                e.key === 'Backspace' ||
                e.key === 'Tab' ||
                e.key === 'Enter' ||
                e.key === ' '
            ) {
                e.preventDefault();
            }

            handleKeyPress(e.key);
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [disabled, isComplete, handleKeyPress]);

    const getCharacterClass = (status: CharacterStatus['status']) => {
        switch (status) {
            case 'correct':
                return styles.correct;
            case 'incorrect':
                return styles.incorrect;
            case 'current':
                return styles.current;
            default:
                return styles.pending;
        }
    };

    return (
        <Card className={styles.container}>
            {!hasStarted && !disabled && (
                <div className={styles.startMessage}>
                    <span className={styles.startIcon}>⌨️</span>
                    <p>Comienza a escribir para iniciar el juego...</p>
                </div>
            )}

            <div
                ref={containerRef}
                className={`${styles.textContainer} ${disabled ? styles.disabled : ''}`}
            >
                {characterStatuses.map((char, index) => (
                    <span
                        key={index}
                        ref={char.status === 'current' ? currentCharRef : null}
                        className={`${styles.character} ${getCharacterClass(char.status)}`}
                        data-char={char.char === ' ' ? '␣' : char.char}
                    >
            {char.char === ' ' ? '\u00A0' : char.char}
          </span>
                ))}
            </div>

            {isComplete && (
                <div className={styles.completeMessage}>
                    <span className={styles.completeIcon}>🎉</span>
                    <p>¡Texto completado!</p>
                </div>
            )}
        </Card>
    );
};