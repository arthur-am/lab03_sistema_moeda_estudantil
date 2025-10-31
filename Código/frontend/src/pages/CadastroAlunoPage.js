import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import api from '../services/api';
import {
  TextField, Button, Container, Typography, Paper, Box, Alert, Select, MenuItem, InputLabel, FormControl, Grid, Link
} from '@mui/material';

export default function CadastroAlunoPage() {
  const [formData, setFormData] = useState({
    nome: '', email: '', cpf: '', rg: '', endereco: '', curso: '', senha: '', instituicaoEnsino: ''
  });
  const [instituicoes, setInstituicoes] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Busca as instituições pré-cadastradas
    const fetchInstituicoes = async () => {
      try {
        // **BACKEND:** Crie o endpoint GET /api/instituicoes
        const response = await api.get('/instituicoes'); 
        setInstituicoes(response.data);
      } catch (err) {
        setError("Não foi possível carregar as instituições de ensino.");
      }
    };
    fetchInstituicoes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Para o Select, o valor é o objeto da instituição, precisamos do ID
    if (name === 'instituicaoEnsino') {
      setFormData({ ...formData, [name]: { id: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      // **BACKEND:** Usa o endpoint POST /api/alunos
      await api.post('/alunos', formData);
      setSuccess('Cadastro realizado com sucesso! Você será redirecionado para o login.');
      setTimeout(() => navigate('/login'), 3000); // Redireciona após 3s
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao realizar o cadastro. Verifique os dados.');
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={6} sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
        <Typography component="h1" variant="h4" align="center">
          Crie sua Conta de Aluno
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          <Grid container spacing={2}>
            <Grid item xs={12}><TextField name="nome" required fullWidth label="Nome Completo" onChange={handleChange} /></Grid>
            <Grid item xs={12} sm={6}><TextField name="email" type="email" required fullWidth label="Email" onChange={handleChange} /></Grid>
            <Grid item xs={12} sm={6}><TextField name="senha" type="password" required fullWidth label="Senha" onChange={handleChange} /></Grid>
            <Grid item xs={12} sm={6}><TextField name="cpf" required fullWidth label="CPF" onChange={handleChange} /></Grid>
            <Grid item xs={12} sm={6}><TextField name="rg" fullWidth label="RG" onChange={handleChange} /></Grid>
            <Grid item xs={12}><TextField name="endereco" fullWidth label="Endereço" onChange={handleChange} /></Grid>
            <Grid item xs={12} sm={6}><TextField name="curso" required fullWidth label="Curso" onChange={handleChange} /></Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel id="instituicao-label">Instituição de Ensino</InputLabel>
                <Select labelId="instituicao-label" name="instituicaoEnsino" value={formData.instituicaoEnsino.id || ''} label="Instituição de Ensino" onChange={handleChange}>
                  {instituicoes.map((inst) => ( <MenuItem key={inst.id} value={inst.id}>{inst.nome}</MenuItem> ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Cadastrar</Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link component={RouterLink} to="/login" variant="body2">Já tem uma conta? Faça login</Link>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}
