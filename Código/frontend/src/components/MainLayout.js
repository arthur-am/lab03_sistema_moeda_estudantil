import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

export default function MainLayout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const userType = localStorage.getItem('userType');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            StudentCoin
          </Typography>
          {user && (
            <>
              <Typography sx={{ mr: 2 }}>
                {user.nome} ({userType})
              </Typography>
              <Button color="inherit" onClick={handleLogout}>Sair</Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: '100%',
          mt: '64px', // Altura da AppBar
          backgroundColor: '#f5f5f5', // Um fundo cinza claro, como o Canvas
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        {/* As páginas (dashboards) serão renderizadas aqui */}
        <Outlet />
      </Box>
    </Box>
  );
}
