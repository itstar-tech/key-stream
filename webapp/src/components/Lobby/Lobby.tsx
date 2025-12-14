import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameContext, useUserContext } from '../../context';
import { Section, Flex } from '../Layout';
import { Button } from '../UI';
import { RoomList } from './RoomList';
import { CreateRoom } from './CreateRoom';
import { JoinRoomModal } from './JoinRoomModal';
import styles from './Lobby.module.css';

export const Lobby: React.FC = () => {
    const navigate = useNavigate();
    const { joinRoom } = useGameContext();
    const { setUsername, setUserId } = useUserContext();

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [selectedRoomId, setSelectedRoomId] = useState<string>('');
    const [selectedRoomName, setSelectedRoomName] = useState<string>('');
    const [requiresPassword, setRequiresPassword] = useState(false);

    const handleJoinRoom = (roomId: string, roomName: string = 'Sala', isPrivate: boolean = false) => {
        setSelectedRoomId(roomId);
        setSelectedRoomName(roomName);
        setRequiresPassword(isPrivate);
        setShowJoinModal(true);
    };

    const handleJoinConfirm = (username: string, password?: string) => {
        const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        setUserId(userId);
        setUsername(username);

        joinRoom(selectedRoomId, username, password);

        navigate(`/room/${selectedRoomId}`);
    };

    const handleRoomCreated = (roomId: string) => {
        handleJoinRoom(roomId, 'Tu sala');
    };

    return (
        <div className={styles.lobby}>
            <Section
                title="Lobby"
                subtitle="Elige una sala o crea la tuya propia"
                actions={
                    <Flex gap="md">
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={() => setShowCreateModal(true)}
                        >
                            ➕ Crear Sala
                        </Button>
                    </Flex>
                }
            >
                <RoomList onJoinRoom={(roomId) => handleJoinRoom(roomId)} />
            </Section>

            <CreateRoom
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onRoomCreated={handleRoomCreated}
            />

            <JoinRoomModal
                isOpen={showJoinModal}
                onClose={() => setShowJoinModal(false)}
                onJoin={handleJoinConfirm}
                roomName={selectedRoomName}
                requiresPassword={requiresPassword}
            />
        </div>
    );
};