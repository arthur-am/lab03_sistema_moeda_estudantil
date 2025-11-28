import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import api from '../services/api';

import {
  TextField, Button, Container, Typography, Paper, Box,
  CircularProgress, Grid, Link
} from '@mui/material';
import FeedbackSnackbar from '../components/FeedbackSnackbar'; // Importa o Snackbar
import logo from '../assets/images/logo.png'; // Importa a logo

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ open: false, message: '', severity: 'info' });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/login', { email, senha: password });
      const { userType, userData } = response.data;
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('userType', userType);
      
      switch (userType) {
        case 'ALUNO': navigate('/aluno/dashboard'); break;
        case 'PROFESSOR': navigate('/professor/dashboard'); break;
        case 'EMPRESA': navigate('/empresa/dashboard'); break;
        default: navigate('/');
      }
    } catch (err) {
      setFeedback({ open: true, message: 'Email ou senha inválidos. Tente novamente.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseFeedback = () => setFeedback({ ...feedback, open: false });

  return (
    <Box sx={{
        height: '100vh',
        backgroundImage: 'url(/login-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }}>
      <Container component="main" maxWidth="xs">
        <Paper elevation={6} sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src={logo} alt="StudentCoin Logo" style={{ width: '100px', marginBottom: '16px' }} />
          <Typography component="h1" variant="h5">Bem-vindo ao StudentCoin</Typography>
          <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
            <TextField margin="normal" required fullWidth id="email" label="Seu Email" name="email" autoComplete="email" autoFocus value={email} onChange={(e) => setEmail(e.target.value)} />
            <TextField margin="normal" required fullWidth name="password" label="Sua Senha" type="password" id="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button type="submit" fullWidth variant="contained" disabled={loading} sx={{ mt: 3, mb: 2 }}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
            </Button>
            <Grid container spacing={1} justifyContent="flex-end">
              <Grid item><Link component={RouterLink} to="/cadastro/aluno" variant="body2">Cadastre-se como Aluno</Link></Grid>
              <Grid item><Link component={RouterLink} to="/cadastro/empresa" variant="body2">É uma empresa? Cadastre-se</Link></Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
      <FeedbackSnackbar open={feedback.open} message={feedback.message} severity={feedback.severity} onClose={handleCloseFeedback} />
    </Box>
  );
}
