import React, { useState } from 'react';
import { Container, Typography, Paper, Box, Tabs, Tab, TextField, Button, Grid, Card, CardContent, CardActions } from '@mui/material';

export default function EmpresaDashboard() {
  const [tabValue, setTabValue] = useState(0);
  const [empresa, setEmpresa] = useState(JSON.parse(localStorage.getItem('user')));
  const [vantagens, setVantagens] = useState([ /* ... buscar da API ... */ ]);

  const handleTabChange = (event, newValue) => setTabValue(newValue);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4">Painel da Empresa Parceira</Typography>
        <Typography variant="h6" color="text.secondary">Empresa: {empresa.nome}</Typography>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Minhas Vantagens" />
            <Tab label="Adicionar Nova Vantagem" />
          </Tabs>
        </Box>

        {/* Painel de Vantagens Existentes */}
        {tabValue === 0 && (
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {/* ... Mapear o array 'vantagens' e renderizar um <Card> para cada uma ... */}
            <Grid item xs={12} md={6}>
                <Card>
                    <CardContent>
                        <Typography variant="h5">10% de Desconto</Typography>
                        <Typography color="text.secondary">Custo: 100 moedas</Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small">Editar</Button>
                        <Button size="small" color="error">Remover</Button>
                    </CardActions>
                </Card>
            </Grid>
          </Grid>
        )}

        {/* Painel para Adicionar Vantagem */}
        {tabValue === 1 && (
           <Box component="form" sx={{ mt: 3 }}>
            <Typography variant="h6">Cadastrar Vantagem</Typography>
            <TextField fullWidth margin="normal" label="Nome da Vantagem" />
            <TextField fullWidth margin="normal" label="Custo em Moedas" type="number" />
            <TextField fullWidth margin="normal" label="Descrição" multiline rows={3} />
            <Button variant="contained" sx={{ mt: 2 }}>Salvar Vantagem</Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
}
