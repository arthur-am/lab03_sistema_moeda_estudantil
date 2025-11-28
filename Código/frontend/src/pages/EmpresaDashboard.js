import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
    Typography, Paper, Box, Button, Grid, Card, CardContent, CardActions, 
    IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, CardMedia 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import FeedbackSnackbar from '../components/FeedbackSnackbar';

const VantagemForm = ({ vantagem, onSave, onCancel }) => {
  const [formData, setFormData] = useState(vantagem || { nome: '', descricao: '', custoMoedas: '', urlFoto: '' });
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <DialogContent>
        <TextField name="nome" value={formData.nome} onChange={handleChange} fullWidth margin="normal" label="Nome da Vantagem" required />
        <TextField name="custoMoedas" value={formData.custoMoedas} onChange={handleChange} fullWidth margin="normal" label="Custo em Moedas" type="number" required />
        <TextField name="descricao" value={formData.descricao} onChange={handleChange} fullWidth margin="normal" label="Descrição" multiline rows={3} />
        <TextField name="urlFoto" value={formData.urlFoto} onChange={handleChange} fullWidth margin="normal" label="URL da Imagem do Produto" />
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
  const [feedback, setFeedback] = useState({ open: false, message: '', severity: 'info' });

  const fetchVantagens = async () => {
    try {
        // **BACKEND:** Crie um endpoint GET /api/empresas/{id}/vantagens
        const response = await api.get(`/empresas/${empresa.id}/vantagens`);
        setVantagens(response.data);
    } catch (error) {
        console.error("Erro ao buscar vantagens", error);
        setFeedback({ open: true, message: 'Não foi possível carregar suas vantagens.', severity: 'error' });
    }
  };

  useEffect(() => { if(empresa?.id) fetchVantagens(); }, [empresa]);

  const handleOpenModal = (vantagem = null) => { setEditingVantagem(vantagem); setOpenModal(true); };
  const handleCloseModal = () => { setEditingVantagem(null); setOpenModal(false); };
  const handleCloseFeedback = () => setFeedback({ ...feedback, open: false });

  const handleSaveVantagem = async (vantagemData) => {
    const dataToSave = { ...vantagemData, custoMoedas: parseFloat(vantagemData.custoMoedas), empresaParceira: { id: empresa.id } };
    try {
      if (editingVantagem) {
        await api.put(`/vantagens/${editingVantagem.id}`, dataToSave);
      } else {
        await api.post('/vantagens', dataToSave);
      }
      fetchVantagens();
      handleCloseModal();
      setFeedback({ open: true, message: 'Vantagem salva com sucesso!', severity: 'success' });
    } catch (error) {
      setFeedback({ open: true, message: 'Erro ao salvar vantagem.', severity: 'error' });
    }
  };

  const handleDeleteVantagem = async (id) => {
    if (window.confirm('Tem certeza que deseja remover esta vantagem?')) {
      try {
        await api.delete(`/vantagens/${id}`);
        fetchVantagens();
        setFeedback({ open: true, message: 'Vantagem removida!', severity: 'success' });
      } catch (error) {
        setFeedback({ open: true, message: 'Erro ao remover vantagem.', severity: 'error' });
      }
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Gestão de Vantagens</Typography>
        <Button variant="contained" startIcon={<AddCircleIcon />} onClick={() => handleOpenModal()}>Nova Vantagem</Button>
      </Box>
      <Paper sx={{ p: 2 }}>
        <Grid container spacing={3}>
          {vantagens.map((v) => (
            <Grid item xs={12} sm={6} md={4} key={v.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia component="img" height="140" image={v.urlFoto || "https://via.placeholder.com/300x140.png?text=Sem+Imagem"} alt={v.nome} />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5">{v.nome}</Typography>
                  <Typography variant="body2" color="text.secondary">{v.descricao}</Typography>
                  <Typography variant="h6" color="primary" sx={{ mt: 2 }}>{v.custoMoedas} moedas</Typography>
                </CardContent>
                <CardActions>
                  <IconButton onClick={() => handleOpenModal(v)}><EditIcon /></IconButton>
                  <IconButton onClick={() => handleDeleteVantagem(v.id)}><DeleteIcon color="error" /></IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
        {vantagens.length === 0 && <Typography sx={{ mt: 3, textAlign: 'center' }}>Nenhuma vantagem cadastrada.</Typography>}
      </Paper>
      <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <DialogTitle>{editingVantagem ? 'Editar Vantagem' : 'Adicionar Nova Vantagem'}</DialogTitle>
        <VantagemForm vantagem={editingVantagem} onSave={handleSaveVantagem} onCancel={handleCloseModal} />
      </Dialog>
      <FeedbackSnackbar open={feedback.open} message={feedback.message} severity={feedback.severity} onClose={handleCloseFeedback} />
    </>
  );
}
