import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useGameContext} from '../../context';
import {getElapsedTime} from '../../utils';
import {Section} from '../Layout';
import {Button, Spinner} from '../UI';
import {WaitingRoom} from '../Lobby';
import {TypingArea} from './TypingArea';
import {GameStats} from './GameStats';
import {PlayerList} from './PlayerList';
import {Countdown} from './Countdown';
import {GameOver} from './GameOver';
import type {TypingMetrics} from '../../types';
import styles from './Game.module.css';

export const Game: React.FC = () => {
    const navigate = useNavigate();

    const {
        room,
        game,
        players,
        currentPlayer,
        gameState,
        countdown,
        winner,
        leaveRoom,
        startGame,
        sendTypingUpdate,
    } = useGameContext();

    const [elapsedTime, setElapsedTime] = useState(0);
    const [metrics, setMetrics] = useState<TypingMetrics>({
        wpm: 0,
        rawWpm: 0,
        accuracy: 100,
        correctChars: 0,
        incorrectChars: 0,
        totalChars: 0,
        elapsedTime: 0,
    });

    useEffect(() => {
        if (gameState === 'playing' && game?.startTime) {
            const interval = setInterval(() => {
                setElapsedTime(getElapsedTime(game.startTime));
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [gameState, game?.startTime]);

    const handleLeave = () => {
        leaveRoom();
        navigate('/');
    };

    const handleStartGame = () => {
        startGame();
    };

    const handleComplete = () => {
        console.log('¡Texto completado!');
    };

    const handleProgressUpdate = (
        progress: number,
        wpm: number,
        accuracy: number
    ) => {
        setMetrics((prev) => ({
            ...prev,
            wpm,
            accuracy,
        }));

        sendTypingUpdate({
            progress,
            wpm,
            accuracy,
            currentIndex: Math.round((progress / 100) * (game?.text.length || 0)),
        });
    };

    const handleGameOverClose = () => {
        handleLeave();
    };

    if (!room || !game) {
        return (
            <div className={styles.loading}>
                <Spinner size="lg"/>
                <p>Cargando sala...</p>
            </div>
        );
    }

    if (gameState === 'waiting') {
        return (
            <WaitingRoom onLeave={handleLeave} onStartGame={handleStartGame}/>
        );
    }

    if (countdown !== null) {
        return <Countdown seconds={countdown}/>;
    }

    return (
        <div className={styles.game}>
            <Section
                title={room.name}
                subtitle="Elimina a tus oponentes y sé el último en pie"
                actions={
                    <Button variant="danger" onClick={handleLeave}>
                        Salir
                    </Button>
                }
            >
                <div className={styles.gameContent}>
                    <div className={styles.leftPanel}>
                        <GameStats metrics={metrics} elapsedTime={elapsedTime}/>

                        <TypingArea
                            text={game.text}
                            onComplete={handleComplete}
                            onProgressUpdate={handleProgressUpdate}
                            disabled={gameState === 'finished'}
                        />
                    </div>

                    <div className={styles.rightPanel}>
                        <PlayerList
                            players={players}
                            currentPlayerId={currentPlayer?.id || null}
                        />
                    </div>
                </div>
            </Section>

            {winner && (
                <GameOver
                    winner={winner}
                    allPlayers={players}
                    onClose={handleGameOverClose}
                />
            )}
        </div>
    );
};