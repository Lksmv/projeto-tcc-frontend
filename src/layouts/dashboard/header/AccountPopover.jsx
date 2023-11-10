import React, { useState, useEffect } from 'react';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton, Popover } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../components/context/authProvider';

const MENU_OPTIONS = [
  {
    id: 1,
    label: 'Usuário',
    route: '/usuario',
    requiresAdmin: true,
  },
  {
    id: 2,
    label: 'Funcionários',
    route: '/funcionario',
    requiresAdmin: true,
  },
];

const AccountPopover = () => {
  const navigate = useNavigate();
  const { authState, logout } = useAuth();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    setUserData(storedUserData);
  }, []);

  const token = userData?.token;
  const usuario = userData?.usuario;
  const cargo = userData?.cargo;

  const cargoLimpo = cargo ? cargo.substring(5).charAt(0) + cargo.substring(5).slice(1).toLowerCase() : 'Usuário não autenticado';
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    if (token) {
      logout();
    }
    navigate('/login');
    handleClose();
  };

  const handleOptionClick = (option) => {
    if (option.requiresAdmin) {
      if (cargo === "ROLE_ADMIN") {
        navigate(option.route);
      }
    } else {
      navigate(option.route);
    }

    handleClose();
  };

  const openPopover = Boolean(anchorEl);

  return (
    <>
      <IconButton onClick={handleOpen} sx={{ padding: 0 }}>
        <Avatar alt="avatar" sx={{ bgcolor: 'transparent', color: '#fff' }} />
      </IconButton>

      <Popover
        open={openPopover}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ sx: { p: 0, mt: 1.5, ml: 0.75, width: 180 } }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {usuario}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {cargoLimpo}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem
              key={option.id}
              onClick={() => handleOptionClick(option)}
              disabled={option.requiresAdmin && cargo === "ROLE_FUNCIONARIO"}
            >
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
          Sair
        </MenuItem>
      </Popover>
    </>
  );
};

export default AccountPopover;
