import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import api from '../services/api';
import {
  TextField, Button, Container, Typography, Paper, Box, Alert, Grid, Link
} from '@mui/material';

export default function CadastroEmpresaPage() {
  const [formData, setFormData] = useState({
    nome: '',
    cnpj: '',
    email: '',
    senha: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      // BACKEND: Certifique-se de que você tem o endpoint POST /api/empresas
      await api.post('/empresas', formData);
      setSuccess('Cadastro de empresa realizado com sucesso! Você será redirecionado para o login.');
      setTimeout(() => navigate('/login'), 3000); // Redireciona após 3s
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao realizar o cadastro. Verifique os dados.');
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={6} sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
        <Typography component="h1" variant="h4" align="center">
          Cadastre sua Empresa
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
          Faça parte da nossa rede de parceiros!
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          <Grid container spacing={2}>
            <Grid item xs={12}><TextField name="nome" required fullWidth label="Nome da Empresa" onChange={handleChange} /></Grid>
            <Grid item xs={12}><TextField name="cnpj" required fullWidth label="CNPJ" onChange={handleChange} /></Grid>
            <Grid item xs={12}><TextField name="email" type="email" required fullWidth label="Email de Contato" onChange={handleChange} /></Grid>
            <Grid item xs={12}><TextField name="senha" type="password" required fullWidth label="Crie uma Senha" onChange={handleChange} /></Grid>
          </Grid>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Cadastrar Empresa
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
    </Container>
  );
}
