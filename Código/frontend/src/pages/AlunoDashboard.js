import React from 'react';
import { Container, Typography, Grid, Paper, Box } from '@mui/material';

// Dados de exemplo - você buscaria isso da API
const aluno = { nome: 'Pedro Rolim', saldoMoedas: 450.50 };
const vantagens = [
  { id: 1, nome: 'Café Expresso Grátis', custoMoedas: 25, empresa: 'Cafeteria Central' },
  { id: 2, nome: '10% de Desconto na Livraria', custoMoedas: 100, empresa: 'Livraria Saber' },
];

export default function AlunoDashboard() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Bem-vindo, {aluno.nome}!
      </Typography>
      
      {/* Saldo */}
      <Box sx={{ mb: 4 }}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'primary.main', color: 'white' }}>
          <Typography variant="h6">Seu Saldo</Typography>
          <Typography component="p" variant="h4">
            {aluno.saldoMoedas.toFixed(2)} moedas
          </Typography>
        </Paper>
      </Box>

      {/* Vantagens Disponíveis */}
      <Typography variant="h5" gutterBottom>
        Vantagens para Resgatar
      </Typography>
      <Grid container spacing={3}>
        {vantagens.map((vantagem) => (
          <Grid item xs={12} sm={6} md={4} key={vantagem.id}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 160 }}>
                <Typography variant="h6" component="h3">{vantagem.nome}</Typography>
                <Typography color="text.secondary">{vantagem.empresa}</Typography>
                <Box sx={{ flexGrow: 1 }} />
                <Typography variant="h5" color="primary">{vantagem.custoMoedas} moedas</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
