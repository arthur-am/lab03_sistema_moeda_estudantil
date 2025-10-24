import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  TextField, Button, Container, Typography, Paper, Box, Alert, Select, MenuItem, InputLabel, FormControl
} from '@mui/material';

export default function CadastroAlunoPage() {
  const [formData, setFormData] = useState({ /* ... campos do formulário ... */ });
  const [instituicoes, setInstituicoes] = useState([]);
  const navigate = useNavigate();
  // ... (lógica de estado para erro e loading) ...

  useEffect(() => {
    // Busca as instituições pré-cadastradas quando a página carrega
    const fetchInstituicoes = async () => {
      try {
        const response = await api.get('/instituicoes'); // Crie este endpoint no backend
        setInstituicoes(response.data);
      } catch (error) {
        console.error("Erro ao buscar instituições", error);
      }
    };
    fetchInstituicoes();
  }, []);

  const handleSubmit = async (e) => {
    // ... (lógica para enviar os dados do formulário para /api/alunos) ...
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={6} sx={{ my: 4, p: 4 }}>
        <Typography component="h1" variant="h5" align="center">Cadastro de Aluno</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          {/* ... Crie TextFields para nome, email, cpf, rg, etc ... */}
          <FormControl fullWidth margin="normal">
            <InputLabel id="instituicao-label">Instituição de Ensino</InputLabel>
            <Select
              labelId="instituicao-label"
              id="instituicao"
              name="instituicaoEnsino"
              // ... (lógica de onChange para atualizar o estado) ...
            >
              {instituicoes.map((inst) => (
                <MenuItem key={inst.id} value={inst.id}>{inst.nome}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
            Cadastrar
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
