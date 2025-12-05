import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Avatar } from '@mui/material';
import logoIcon from '../../public/images/logo.png';

export default function MainLayout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const userType = localStorage.getItem('userType');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };
  
  // --- FUNÇÃO CORRIGIDA PARA PEGAR INICIAIS ---
  const getInitials = (name = '') => {
    const names = name.split(' ').filter(Boolean); // Divide o nome e remove espaços extras
    if (names.length === 0) return '?';
    if (names.length === 1) return names[0][0].toUpperCase();
    
    // Pega a inicial do primeiro e do último nome
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'grey.100' }}>
      <AppBar 
        position="static" 
        color="default" 
        elevation={1} 
        sx={{ backgroundColor: 'white' }}
      >
        <Toolbar>
          <img src={logoIcon} alt="StudentCoin" style={{ width: '40px', height: '40px', marginRight: '16px' }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            StudentCoin
          </Typography>
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ textAlign: 'right' }}>
                <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{user.nome}</Typography>
                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{userType}</Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'primary.main' }}>{getInitials(user.nome)}</Avatar>
              <Button variant="outlined" size="small" onClick={handleLogout} sx={{ ml: 1 }}>
                Sair
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, width: '100%' }}>
        <Outlet />
      </Box>
    </Box>
  );
}
