import React from 'react';
import styles from './ProgressBar.module.css';

interface ProgressBarProps {
    value: number;
    max?: number;
    showLabel?: boolean;
    color?: string;
    height?: number;
    animated?: boolean;
    className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
                                                            value,
                                                            max = 100,
                                                            showLabel = false,
                                                            color,
                                                            height = 8,
                                                            animated = false,
                                                            className = '',
                                                        }) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const barStyle: React.CSSProperties = {
        width: `${percentage}%`,
        height: `${height}px`,
        ...(color && {background: color}),
    };

    const containerClasses = [
        styles.container,
        animated ? styles.animated : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={containerClasses}>
            <div className={styles.track} style={{height: `${height}px`}}>
                <div className={styles.bar} style={barStyle}></div>
            </div>
            {showLabel && (
                <span className={styles.label}>{Math.round(percentage)}%</span>
            )}
        </div>
    );
};