import React from 'react';
import styles from './Spinner.module.css';

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    color?: string;
    className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
                                                    size = 'md',
                                                    color,
                                                    className = '',
                                                }) => {
    const classNames = [styles.spinner, styles[size], className]
        .filter(Boolean)
        .join(' ');

    const style = color ? {borderTopColor: color} : undefined;

    return <div className={classNames} style={style}></div>;
};