import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, Button, TextField } from '@mui/material';
import { getUserById, updateUser, deleteUser, createUser, sendMessageSms } from '../services/user.services';
import { toast } from 'react-toastify';

interface UserModalProps {
    userId: string | null; // Puede ser null para crear un nuevo usuario
    action: 'view' | 'edit' | 'delete' | 'create' | 'sms'; // Tipo de unión para todos los casos posibles
    onClose: () => void;
}

const UserModal: React.FC<UserModalProps> = ({ userId, action, onClose }) => {
    const [user, setUser] = useState<{ name: string; email: string; password: string; phone: string }>({
        name: '',
        email: '',
        password: '',
        phone: ''
    });
    const [sms, setSms] = useState<{ message: string; }>({
        message: '',
    });
    const [loading, setLoading] = useState<boolean>(false); // Estado de carga
    const [confirmDelete, setConfirmDelete] = useState<boolean>(false); // Estado para confirmar eliminación

    useEffect(() => {
        if (action === 'edit' || action === 'view' && userId) {
            const fetchUser = async () => {
                setLoading(true);
                try {
                    const data = await getUserById(String(userId));
                    setUser(data.data);
                } catch (error) {
                    toast.error('Error al cargar los datos del usuario.');
                } finally {
                    setLoading(false);
                }
            };
            fetchUser();
        } else if (action === 'create') {
            setUser({ name: '', email: '', password: '', phone: '' });
        } else if (action === 'sms') {
            setSms({ message: '' });
        }
    }, [userId, action]);

    const handleAction = async () => {
        try {
            setLoading(true);
            if (action === 'edit' && userId) {
                await updateUser(String(userId), user);
                toast.success('Usuario actualizado correctamente.');
            } else if (action === 'delete' && userId) {
                if (confirmDelete) {
                    await deleteUser(String(userId));
                    toast.success('Usuario eliminado correctamente.');
                    onClose();
                }
            } else if (action === 'create') {
                await createUser(user);
                toast.success('Usuario creado correctamente.');
                onClose();
            } else if (action === 'sms') {
                await sendMessageSms({...sms, "phone": "+18777804236",});
                toast.success('SMS enviado correctamente a numer test twilio, para confirmar el correcto envio revisa el network de la aplicacion para el especifico http request.');
                onClose();
            }
        } catch (error) {
            console.error('Error in handleAction:', error);
            toast.error('Error al procesar la acción.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUser({ ...user, [e.target.name]: e.target.value });
        setSms({ ...sms, [e.target.name]: e.target.value });
    };

    if (loading) {
        return <Typography>Cargando...</Typography>; // Indicador de carga
    }

    return (
        <Modal open={true} onClose={onClose}>
            <Box sx={{ padding: 4, backgroundColor: 'white', margin: '100px auto', width: 400 }}>
                {action === 'view' && user && (
                    <Box>
                        <Typography variant="h6" sx={{ mb: 2 }}>Detalles del Usuario</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="body1" sx={{ fontWeight: 'bold', width: '120px' }}>Nombre:</Typography>
                                <Typography variant="body1">{user.name}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="body1" sx={{ fontWeight: 'bold', width: '120px' }}>Email:</Typography>
                                <Typography variant="body1">{user.email}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="body1" sx={{ fontWeight: 'bold', width: '120px' }}>Teléfono:</Typography>
                                <Typography variant="body1">{user.phone}</Typography>
                            </Box>
                        </Box>
                    </Box>
                )}


                {(action === 'edit' || action === 'create') && (
                    <form onSubmit={(e) => { e.preventDefault(); handleAction(); }}>
                        <Typography variant="h6">{action === 'edit' ? 'Editar Usuario' : 'Crear Usuario'}</Typography>

                        <TextField
                            label="Nombre"
                            name="name"
                            value={user.name}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />

                        <TextField
                            label="Email"
                            name="email"
                            value={user.email}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />

                        <TextField
                            label="Teléfono"
                            name="phone"
                            value={user.phone}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />

                        {(action === 'edit' || action === 'create') && (
                            <TextField
                                label="Contraseña"
                                name="password"
                                value={user.password}
                                onChange={handleChange}
                                type="password"
                                fullWidth
                                margin="normal"
                            />
                        )}
                    </form>
                )}

                {(action === 'sms') && (
                    <form onSubmit={(e) => { e.preventDefault(); handleAction(); }}>
                        <Typography variant="h6">Envio de SMS</Typography>

                        <TextField
                            label="Mensaje"
                            name="message"
                            value={sms.message}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />

                    </form>
                )}

                {action === 'delete' && (
                    <Typography variant="h6">¿Estás seguro de eliminar este usuario?</Typography>
                )}

                <Box sx={{ mt: 2 }}>
                    {action === 'delete' && !confirmDelete ? (
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => setConfirmDelete(true)}
                            sx={{ mr: 1 }}
                        >
                            Confirmar Eliminación
                        </Button>
                    ) : (
                        <>
                            <Button
                                type="submit"
                                variant="contained"
                                color={action === 'delete' ? 'secondary' : 'primary'}
                                sx={{ mr: 1 }}
                                onClick={handleAction}
                                disabled={action === 'view' ? true : false}
                            >
                                {(() => {
                                    switch (action) {
                                        case 'delete':
                                            return 'Eliminar';
                                        case 'edit':
                                            return 'Guardar';
                                        case 'create':
                                            return 'Crear';
                                        case 'sms':
                                            return 'Envio SMS';
                                        default:
                                            return 'Sin Acción';
                                    }
                                })()}
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={onClose}
                            >
                                Cancelar
                            </Button>
                        </>
                    )}
                </Box>
            </Box>
        </Modal>
    );
};

export default UserModal;
