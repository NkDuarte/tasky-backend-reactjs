import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, IconButton, Box, Typography, Button, TableContainer, Paper } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import { getUsers } from '../services/user.services';
import ActionMenu from './action_menu.component'
import UserModal from './user_modal.component';
import RefreshIcon from '@mui/icons-material/Refresh';

interface User {
    id: string; // Ahora el id es un string dinámico
    name: string;
    email: string;
}

const UserTable: React.FC = () => {

    const [users, setUsers] = useState<User[]>([]);
    const [action, setAction] = useState<'view' | 'edit' | 'delete' | 'create' | 'sms'>('view');
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    const loadUsers = async () => {
        const data = await getUsers();
        setUsers(data);
    };

    const handleCreateUser = () => {
        setAction('create');
        setOpenModal(true);
    };

    const handleMenuAction = (userId: string, selectedAction: 'view' | 'edit' | 'delete' | 'create' | 'sms') => {
        setSelectedUserId(userId);
        setAction(selectedAction);
        setOpenModal(true);
    };

    const handleModalClose = () => {
        loadUsers();
        setOpenModal(false);
    };

    useEffect(() => {
        loadUsers()
    }, []);

    return (
        <>
            <Box sx={{ padding: 4 }}>
                {/* Encabezado */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h4" component="h1" sx={{ textAlign: 'center' }}>
                        Usuarios
                    </Typography>
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<RefreshIcon />}
                        onClick={loadUsers}
                        sx={{ ml: 2 }}
                    >
                        Refrescar
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={handleCreateUser}
                    >
                        Crear Usuario
                    </Button>
                </Box>

                {/* Contenedor de la tabla centrado */}
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
                    <TableContainer component={Paper} sx={{ width: '50%' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map(user => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <IconButton>
                                                <ActionMenu userId={user.id} />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>
            {openModal && (
                <UserModal
                    userId={selectedUserId}
                    action={action}
                    onClose={handleModalClose}
                />
            )}
        </>
    );
};

export default UserTable;
