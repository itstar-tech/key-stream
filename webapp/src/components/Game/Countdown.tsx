import React from 'react';
import styles from './Countdown.module.css';

interface CountdownProps {
    seconds: number;
}

export const Countdown: React.FC<CountdownProps> = ({ seconds }) => {
    return (
        <div className={styles.overlay}>
            <div className={styles.countdown}>
                {seconds > 0 ? (
                    <div className={styles.number}>{seconds}</div>
                ) : (
                    <div className={styles.go}>¡GO!</div>
                )}
            </div>
        </div>
    );
};