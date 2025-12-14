import React from 'react';
import styles from './Grid.module.css';

interface GridProps {
    children: React.ReactNode;
    columns?: 1 | 2 | 3 | 4;
    gap?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const Grid: React.FC<GridProps> = ({
                                              children,
                                              columns = 2,
                                              gap = 'md',
                                              className = '',
                                          }) => {
    const classNames = [
        styles.grid,
        styles[`cols${columns}`],
        styles[`gap${gap.charAt(0).toUpperCase() + gap.slice(1)}`],
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return <div className={classNames}>{children}</div>;
};