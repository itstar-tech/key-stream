import React, { useState } from 'react';
import { createRoom } from '../../services';
import type { CreateRoomRequest } from '../../types';
import { validateRoomName, validateGameSettings } from '../../utils';
import { Modal, Button, Input } from '../UI';
import styles from './CreateRoom.module.css';

interface CreateRoomProps {
    isOpen: boolean;
    onClose: () => void;
    onRoomCreated: (roomId: string) => void;
}

export const CreateRoom: React.FC<CreateRoomProps> = ({
                                                          isOpen,
                                                          onClose,
                                                          onRoomCreated,
                                                      }) => {
    const [formData, setFormData] = useState({
        name: '',
        maxPlayers: 10,
        eliminationInterval: 30,
        isPrivate: false,
        password: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]:
                type === 'checkbox'
                    ? (e.target as HTMLInputElement).checked
                    : type === 'number'
                        ? Number(value)
                        : value,
        }));

        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        const nameValidation = validateRoomName(formData.name);
        if (!nameValidation.valid) {
            newErrors.name = nameValidation.error!;
        }

        const settingsValidation = validateGameSettings({
            maxPlayers: formData.maxPlayers,
            eliminationInterval: formData.eliminationInterval,
        });
        if (!settingsValidation.valid) {
            newErrors.settings = settingsValidation.error!;
        }

        if (formData.isPrivate && formData.password.length < 4) {
            newErrors.password = 'La contraseña debe tener al menos 4 caracteres';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);

        try {
            const request: CreateRoomRequest = {
                name: formData.name,
                maxPlayers: formData.maxPlayers,
                eliminationInterval: formData.eliminationInterval,
                isPrivate: formData.isPrivate,
                password: formData.isPrivate ? formData.password : undefined,
            };

            const room = await createRoom(request);
            onRoomCreated(room.id);
            handleClose();
        } catch (error: any) {
            setErrors({
                submit: error.message || 'Error al crear la sala',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            name: '',
            maxPlayers: 10,
            eliminationInterval: 30,
            isPrivate: false,
            password: '',
        });
        setErrors({});
        setLoading(false);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Crear Nueva Sala"
            size="md"
        >
            <form onSubmit={handleSubmit} className={styles.form}>
                <Input
                    label="Nombre de la sala"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Mi sala épica"
                    error={errors.name}
                    fullWidth
                    required
                />

                <div className={styles.row}>
                    <div className={styles.field}>
                        <label className={styles.label}>Jugadores máximos</label>
                        <select
                            name="maxPlayers"
                            value={formData.maxPlayers}
                            onChange={handleChange}
                            className={styles.select}
                        >
                            <option value={2}>2 jugadores</option>
                            <option value={4}>4 jugadores</option>
                            <option value={6}>6 jugadores</option>
                            <option value={8}>8 jugadores</option>
                            <option value={10}>10 jugadores</option>
                            <option value={15}>15 jugadores</option>
                            <option value={20}>20 jugadores</option>
                        </select>
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>
                            Intervalo de eliminación (seg)
                        </label>
                        <select
                            name="eliminationInterval"
                            value={formData.eliminationInterval}
                            onChange={handleChange}
                            className={styles.select}
                        >
                            <option value={10}>10 segundos</option>
                            <option value={20}>20 segundos</option>
                            <option value={30}>30 segundos</option>
                            <option value={45}>45 segundos</option>
                            <option value={60}>60 segundos</option>
                        </select>
                    </div>
                </div>

                <div className={styles.checkbox}>
                    <input
                        type="checkbox"
                        id="isPrivate"
                        name="isPrivate"
                        checked={formData.isPrivate}
                        onChange={handleChange}
                    />
                    <label htmlFor="isPrivate">Sala privada (requiere contraseña)</label>
                </div>

                {formData.isPrivate && (
                    <Input
                        label="Contraseña"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Ingresa una contraseña"
                        error={errors.password}
                        fullWidth
                        required
                    />
                )}

                {errors.settings && (
                    <div className={styles.errorMessage}>{errors.settings}</div>
                )}

                {errors.submit && (
                    <div className={styles.errorMessage}>{errors.submit}</div>
                )}

                <div className={styles.actions}>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleClose}
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                    <Button type="submit" variant="primary" isLoading={loading}>
                        Crear Sala
                    </Button>
                </div>
            </form>
        </Modal>
    );
};