import React, { useState } from 'react';
import { Menu, MenuItem, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import UserModal from './user_modal.component'

interface ActionMenuProps {
    userId: string;
}

const ActionMenu: React.FC<ActionMenuProps> = ({ userId }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [action, setAction] = useState<'view' | 'edit' | 'delete' | 'create' | 'sms'>('view');

    const handleMenuClick = (event: React.MouseEvent<HTMLDivElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = (selectedAction: 'view' | 'edit' | 'delete' | 'create' | 'sms') => {
        setAction(selectedAction);
        setAnchorEl(null);
        setOpenModal(true);
    };

    return (
        <>
            {/* Usa un div o span en lugar de IconButton para evitar botones anidados */}
            <div onClick={handleMenuClick} style={{ cursor: 'pointer' }}>
                <MoreVertIcon />
            </div>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                <MenuItem onClick={() => handleMenuClose('sms')}>Envio Sms</MenuItem>
                <MenuItem onClick={() => handleMenuClose('view')}>Ver</MenuItem>
                <MenuItem onClick={() => handleMenuClose('edit')}>Editar</MenuItem>
                <MenuItem onClick={() => handleMenuClose('delete')}>Eliminar</MenuItem>
            </Menu>
            {openModal && <UserModal userId={userId} action={action} onClose={() => setOpenModal(false)} />}
        </>
    );
};

export default ActionMenu;
