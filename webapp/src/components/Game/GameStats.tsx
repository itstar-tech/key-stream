import React from 'react';
import type {TypingMetrics} from '../../types';
import {Card} from '../UI';
import {Flex} from '../Layout';
import {formatTime, getAccuracyColor} from '../../utils';
import styles from './GameStats.module.css';

interface GameStatsProps {
    metrics: TypingMetrics;
    elapsedTime: number;
}

export const GameStats: React.FC<GameStatsProps> = ({
                                                        metrics,
                                                        elapsedTime,
                                                    }) => {
    return (
        <Card className={styles.container}>
            <Flex direction="row" justify="between" gap="lg" wrap>
                {/* WPM */}
                <div className={styles.stat}>
                    <div className={styles.statIcon}>⚡</div>
                    <div className={styles.statContent}>
                        <div className={styles.statLabel}>WPM</div>
                        <div className={styles.statValue}>{metrics.wpm}</div>
                    </div>
                </div>

                <div className={styles.stat}>
                    <div className={styles.statIcon}>🎯</div>
                    <div className={styles.statContent}>
                        <div className={styles.statLabel}>Precisión</div>
                        <div
                            className={styles.statValue}
                            style={{color: getAccuracyColor(metrics.accuracy)}}
                        >
                            {metrics.accuracy.toFixed(1)}%
                        </div>
                    </div>
                </div>

                <div className={styles.stat}>
                    <div className={styles.statIcon}>⏱️</div>
                    <div className={styles.statContent}>
                        <div className={styles.statLabel}>Tiempo</div>
                        <div className={styles.statValue}>{formatTime(elapsedTime)}</div>
                    </div>
                </div>

                <div className={styles.stat}>
                    <div className={styles.statIcon}>📝</div>
                    <div className={styles.statContent}>
                        <div className={styles.statLabel}>Caracteres</div>
                        <div className={styles.statValue}>
                            <span className={styles.correct}>{metrics.correctChars}</span>
                            <span className={styles.separator}>/</span>
                            <span className={styles.incorrect}>{metrics.incorrectChars}</span>
                        </div>
                    </div>
                </div>
            </Flex>
        </Card>
    );
};