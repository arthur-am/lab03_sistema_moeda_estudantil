import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // Nosso cliente Axios pré-configurado

import { TextField, Button, Container, Typography, Paper, Box, Alert, CircularProgress } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School'; // Um ícone para dar um toque visual

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Faz a chamada para o endpoint /api/login que implementamos no backend
      const response = await api.post('/login', {
        email: email,
        senha: password,
      });

      // Se o login for bem-sucedido:
      const { userType, userData } = response.data;
      console.log('Login bem-sucedido!', response.data);

      // Salva os dados do usuário no localStorage para manter a sessão
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('userType', userType);

      // Redireciona o usuário para a página correta com base no seu tipo
      switch (userType) {
        case 'ALUNO':
          navigate('/aluno/dashboard');
          break;
        case 'PROFESSOR':
          navigate('/professor/dashboard');
          break;
        case 'EMPRESA':
          navigate('/empresa/dashboard');
          break;
        default:
          navigate('/');
      }

    } catch (err) {
      // Se o backend retornar um erro (ex: 401 Unauthorized)
      setError('Email ou senha inválidos. Tente novamente.');
      console.error('Erro de login:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={6} sx={{ marginTop: 8, padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <SchoolIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
        <Typography component="h1" variant="h5">
          StudentCoin
        </Typography>
        <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
          
          {/* Alerta de Erro */}
          {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}

          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Seu Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Sua Senha"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading} // Desabilita o botão durante o carregamento
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
