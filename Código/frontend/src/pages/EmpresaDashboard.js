import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Container, Typography, Paper, Box, Tabs, Tab, TextField, Button, Grid, Card, CardContent, 
  CardActions, IconButton, Dialog, DialogTitle, DialogContent, DialogActions 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const VantagemForm = ({ vantagem, onSave, onCancel }) => {
  const [formData, setFormData] = useState(vantagem || { nome: '', descricao: '', custoMoedas: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <DialogContent>
        <TextField name="nome" value={formData.nome} onChange={handleChange} fullWidth margin="normal" label="Nome da Vantagem" required />
        <TextField name="custoMoedas" value={formData.custoMoedas} onChange={handleChange} fullWidth margin="normal" label="Custo em Moedas" type="number" required />
        <TextField name="descricao" value={formData.descricao} onChange={handleChange} fullWidth margin="normal" label="Descrição" multiline rows={3} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancelar</Button>
        <Button type="submit" variant="contained">Salvar</Button>
      </DialogActions>
    </Box>
  );
};

export default function EmpresaDashboard() {
  const [empresa] = useState(JSON.parse(localStorage.getItem('user')));
  const [vantagens, setVantagens] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingVantagem, setEditingVantagem] = useState(null);

  const fetchVantagens = async () => {
    try {
        // **BACKEND:** Crie o endpoint GET /api/empresas/{id}/vantagens
        const response = await api.get(`/empresas/${empresa.id}/vantagens`);
        setVantagens(response.data);
    } catch (error) {
        console.error("Erro ao buscar vantagens", error);
    }
  };

  useEffect(() => {
    fetchVantagens();
  }, [empresa.id]);

  const handleOpenModal = (vantagem = null) => {
    setEditingVantagem(vantagem);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setEditingVantagem(null);
    setOpenModal(false);
  };

  const handleSaveVantagem = async (vantagemData) => {
    const dataToSave = { ...vantagemData, empresaParceira: { id: empresa.id } };
    try {
      if (editingVantagem) {
        // **UPDATE:** Usa o endpoint PUT /api/vantagens/{id}
        await api.put(`/vantagens/${editingVantagem.id}`, dataToSave);
      } else {
        // **CREATE:** Usa o endpoint POST /api/vantagens
        await api.post('/vantagens', dataToSave);
      }
      fetchVantagens(); // Re-fetch para atualizar a lista
      handleCloseModal();
    } catch (error) {
      console.error("Erro ao salvar vantagem", error);
    }
  };

  const handleDeleteVantagem = async (id) => {
    if (window.confirm('Tem certeza que deseja remover esta vantagem?')) {
      try {
        // **DELETE:** Usa o endpoint DELETE /api/vantagens/{id}
        await api.delete(`/vantagens/${id}`);
        fetchVantagens(); // Re-fetch para atualizar a lista
      } catch (error) {
        console.error("Erro ao deletar vantagem", error);
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Gestão de Vantagens</Typography>
        <Button variant="contained" startIcon={<AddCircleIcon />} onClick={() => handleOpenModal()}>
          Nova Vantagem
        </Button>
      </Box>
      <Paper sx={{ p: 2 }}>
        <Grid container spacing={3}>
          {vantagens.map((vantagem) => (
            <Grid item xs={12} sm={6} md={4} key={vantagem.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">{vantagem.nome}</Typography>
                  <Typography variant="body2" color="text.secondary">{vantagem.descricao}</Typography>
                  <Typography variant="h6" color="primary" sx={{ mt: 2 }}>{vantagem.custoMoedas} moedas</Typography>
                </CardContent>
                <CardActions>
                  <IconButton onClick={() => handleOpenModal(vantagem)}><EditIcon /></IconButton>
                  <IconButton onClick={() => handleDeleteVantagem(vantagem.id)}><DeleteIcon color="error" /></IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
        {vantagens.length === 0 && <Typography sx={{mt: 3, textAlign: 'center'}}>Nenhuma vantagem cadastrada.</Typography>}
      </Paper>
      
      <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <DialogTitle>{editingVantagem ? 'Editar Vantagem' : 'Adicionar Nova Vantagem'}</DialogTitle>
        <VantagemForm vantagem={editingVantagem} onSave={handleSaveVantagem} onCancel={handleCloseModal} />
      </Dialog>
    </Container>
  );
}
