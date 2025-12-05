import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import api from '../services/api';

// Importações do Material-UI
import {
  TextField, Button, Typography, Paper, Box, Grid, Link,
  CircularProgress, Checkbox, FormControlLabel
} from '@mui/material';
import FeedbackSnackbar from '../components/FeedbackSnackbar';

// --- IMPORTANTE ---
// Salve a imagem que você quer usar como fundo na pasta `frontend/public/images/`
// Por exemplo: `frontend/public/images/puc-minas-login-bg.jpg`
// Usar a pasta `public` é a maneira correta para referenciar imagens no CSS.

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
      
      const dashboardPath = `/${userType.toLowerCase()}/dashboard`;
      navigate(dashboardPath);
    } catch (err) {
      setFeedback({ open: true, message: 'Email ou senha inválidos. Tente novamente.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseFeedback = () => setFeedback({ ...feedback, open: false });

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      {/* 1. Painel da Esquerda (Imagem de Fundo) */}
      <Grid
        item
        xs={false} // Oculto em telas extra pequenas
        sm={4}
        md={7}
        sx={{
          // --- ESTA É A CORREÇÃO PRINCIPAL ---
          // A imagem agora é o fundo do Grid
          backgroundImage: 'url(/images/login.jpg)', // Caminho relativo à pasta 'public'
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) => t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
          backgroundSize: 'cover',   // Garante que a imagem cubra todo o espaço
          backgroundPosition: 'center', // Centraliza a imagem
        }}
      />
      
      {/* 2. Painel da Direita (Formulário) */}
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          <Typography component="h1" variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>
            LOGIN
          </Typography>

          <Box component="form" noValidate onSubmit={handleLogin} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Username ou Email"
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
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', mt: 1 }}>
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Link href="#" variant="body2">
                Esqueceu a Senha?
              </Link>
            </Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ mt: 3, mb: 2, py: 1.5, fontSize: '1rem' }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
            </Button>
            <Typography variant="body2" align="center">
              Não Tem Uma Conta? {' '}
              <Link component={RouterLink} to="/cadastro/aluno">Inscrever-se</Link> ou como {' '}
              <Link component={RouterLink} to="/cadastro/empresa">Empresa</Link>
            </Typography>
          </Box>
        </Box>
      </Grid>

      <FeedbackSnackbar 
        open={feedback.open} 
        message={feedback.message} 
        severity={feedback.severity} 
        onClose={handleCloseFeedback} 
      />
    </Grid>
  );
}
