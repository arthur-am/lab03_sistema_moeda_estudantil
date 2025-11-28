import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import api from '../services/api';
import { TextField, Button, Container, Typography, Paper, Box, Select, MenuItem, InputLabel, FormControl, Grid, Link } from '@mui/material';
import FeedbackSnackbar from '../components/FeedbackSnackbar';

export default function CadastroAlunoPage() {
  const [formData, setFormData] = useState({
    nome: '', email: '', cpf: '', rg: '', endereco: '', curso: '', senha: '', instituicaoEnsino: ''
  });
  const [instituicoes, setInstituicoes] = useState([]);
  const [feedback, setFeedback] = useState({ open: false, message: '', severity: 'info' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInstituicoes = async () => {
      try {
        const response = await api.get('/instituicoes');
        setInstituicoes(response.data);
      } catch (err) {
        setFeedback({ open: true, message: 'Não foi possível carregar as instituições.', severity: 'error' });
      }
    };
    fetchInstituicoes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'instituicaoEnsino') {
      setFormData({ ...formData, [name]: { id: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/alunos', formData);
      setFeedback({ open: true, message: 'Cadastro realizado com sucesso! Redirecionando...', severity: 'success' });
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erro ao realizar o cadastro.';
      setFeedback({ open: true, message: errorMessage, severity: 'error' });
    }
  };

  const handleCloseFeedback = () => setFeedback({ ...feedback, open: false });

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={6} sx={{ my: 4, p: 4 }}>
        <Typography component="h1" variant="h4" align="center">Crie sua Conta de Aluno</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
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
                  {instituicoes.map((inst) => (<MenuItem key={inst.id} value={inst.id}>{inst.nome}</MenuItem>))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Cadastrar</Button>
          <Grid container justifyContent="flex-end">
            <Grid item><Link component={RouterLink} to="/login" variant="body2">Já tem uma conta? Faça login</Link></Grid>
          </Grid>
        </Box>
      </Paper>
      <FeedbackSnackbar open={feedback.open} message={feedback.message} severity={feedback.severity} onClose={handleCloseFeedback} />
    </Container>
  );
}
