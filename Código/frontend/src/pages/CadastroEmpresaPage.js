import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import api from '../services/api';
import {
  TextField, Button, Container, Typography, Paper, Box, Grid, Link, CircularProgress
} from '@mui/material';
import FeedbackSnackbar from '../components/FeedbackSnackbar'; // Importa o componente de feedback

export default function CadastroEmpresaPage() {
  const [formData, setFormData] = useState({
    nome: '',
    cnpj: '',
    email: '',
    senha: '',
  });
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ open: false, message: '', severity: 'info' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/empresas', formData);
      setFeedback({ open: true, message: 'Empresa cadastrada com sucesso! Redirecionando...', severity: 'success' });
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      // --- LÓGICA DE EXIBIÇÃO DE ERRO ---
      // 'err.response.data' agora conterá a mensagem específica do backend
      // (ex: "Já existe uma empresa cadastrada com este CNPJ.")
      const errorMessage = err.response?.data || 'Erro ao realizar o cadastro. Já existe uma empresa com esse CNPJ.';
      setFeedback({ open: true, message: errorMessage, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };
  
  const handleCloseFeedback = () => setFeedback({ ...feedback, open: false });

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={6} sx={{ my: 4, p: 4 }}>
        <Typography component="h1" variant="h4" align="center">
          Cadastre sua Empresa
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
          Faça parte da nossa rede de parceiros!
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}><TextField name="nome" required fullWidth label="Nome da Empresa" onChange={handleChange} /></Grid>
            <Grid item xs={12}><TextField name="cnpj" required fullWidth label="CNPJ" onChange={handleChange} /></Grid>
            <Grid item xs={12}><TextField name="email" type="email" required fullWidth label="Email de Contato" onChange={handleChange} /></Grid>
            <Grid item xs={12}><TextField name="senha" type="password" required fullWidth label="Crie uma Senha" onChange={handleChange} /></Grid>
          </Grid>
          <Button type="submit" fullWidth variant="contained" disabled={loading} sx={{ mt: 3, mb: 2 }}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Cadastrar Empresa'}
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link component={RouterLink} to="/login" variant="body2">
                Já tem uma conta? Faça login
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Paper>
      {/* Componente de feedback para exibir o erro ou sucesso */}
      <FeedbackSnackbar 
        open={feedback.open} 
        message={feedback.message} 
        severity={feedback.severity} 
        onClose={handleCloseFeedback} 
      />
    </Container>
  );
}
