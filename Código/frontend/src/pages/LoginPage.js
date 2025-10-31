import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import api from '../services/api';

// Importações do Material-UI
import { 
  TextField, 
  Button, 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Alert, 
  CircularProgress,
  Grid,
  Link 
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';

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
      // Faz a chamada para o endpoint /api/login
      const response = await api.post('/login', {
        email: email,
        senha: password,
      });

      // Se o login for bem-sucedido:
      const { userType, userData } = response.data;
      
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
      // Se o backend retornar um erro
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
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
          </Button>

          {/* --- LINKS DE CADASTRO ADICIONADOS AQUI --- */}
          <Grid container spacing={1} justifyContent="flex-end">
            <Grid item>
              <Link component={RouterLink} to="/cadastro/aluno" variant="body2">
                Não tem conta? Cadastre-se como Aluno
              </Link>
            </Grid>
            <Grid item>
              <Link component={RouterLink} to="/cadastro/empresa" variant="body2">
                É uma empresa? Cadastre-se aqui
              </Link>
            </Grid>
          </Grid>

        </Box>
      </Paper>
    </Container>
  );
}
