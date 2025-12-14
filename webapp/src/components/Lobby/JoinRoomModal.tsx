import React, {useState} from 'react';
import {Modal, Button, Input} from '../UI';
import {validateUsername} from '../../utils';
import styles from './JoinRoomModal.module.css';

interface JoinRoomModalProps {
    isOpen: boolean;
    onClose: () => void;
    onJoin: (username: string, password?: string) => void;
    roomName: string;
    requiresPassword: boolean;
}

export const JoinRoomModal: React.FC<JoinRoomModalProps> = ({
                                                                isOpen,
                                                                onClose,
                                                                onJoin,
                                                                roomName,
                                                                requiresPassword,
                                                            }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: Record<string, string> = {};

        // Validar username
        const usernameValidation = validateUsername(username);
        if (!usernameValidation.valid) {
            newErrors.username = usernameValidation.error!;
        }

        // Validar password si es requerida
        if (requiresPassword && password.length === 0) {
            newErrors.password = 'La contraseña es requerida';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onJoin(username, requiresPassword ? password : undefined);
        handleClose();
    };

    const handleClose = () => {
        setUsername('');
        setPassword('');
        setErrors({});
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={`Unirse a ${roomName}`}
            size="sm"
        >
            <form onSubmit={handleSubmit} className={styles.form}>
                <Input
                    label="Nombre de usuario"
                    value={username}
                    onChange={(e) => {
                        setUsername(e.target.value);
                        if (errors.username) {
                            setErrors((prev) => {
                                const newErrors = {...prev};
                                delete newErrors.username;
                                return newErrors;
                            });
                        }
                    }}
                    placeholder="Tu nombre"
                    error={errors.username}
                    fullWidth
                    autoFocus
                />

                {requiresPassword && (
                    <Input
                        label="Contraseña"
                        type="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            if (errors.password) {
                                setErrors((prev) => {
                                    const newErrors = {...prev};
                                    delete newErrors.password;
                                    return newErrors;
                                });
                            }
                        }}
                        placeholder="Contraseña de la sala"
                        error={errors.password}
                        fullWidth
                    />
                )}

                <div className={styles.actions}>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleClose}
                        fullWidth
                    >
                        Cancelar
                    </Button>
                    <Button type="submit" variant="primary" fullWidth>
                        Unirse
                    </Button>
                </div>
            </form>
        </Modal>
    );
};