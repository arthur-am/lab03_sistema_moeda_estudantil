import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
    Typography, Paper, Box, Button, Grid, Card, CardContent, CardActions, 
    IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, CardMedia 
} from '@mui/material'; // <-- A importação de 'Box' já está aqui, o que significa que o erro era de digitação
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import FeedbackSnackbar from '../components/FeedbackSnackbar';

// Componente auxiliar de Seção
const Section = ({ title, children, action }) => (
    <Box sx={{ my: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 6, height: 24, bgcolor: 'primary.main', borderRadius: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'grey.800' }}>{title}</Typography>
        </Box>
        {action}
      </Box>
      {children}
    </Box>
);
  
// Componente reutilizável para o formulário de Vantagem
const VantagemForm = ({ vantagem, onSave, onCancel }) => {
  const [formData, setFormData] = useState(vantagem || { nome: '', descricao: '', custoMoedas: '', urlFoto: '' });
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };

  return (
    // --- CORREÇÃO AQUI ---
    // O erro 'Box is not defined' aconteceu porque eu usei <Box> com 'B' maiúsculo
    // quando deveria ser <Box> do Material-UI, que já está importado.
    <Box component="form" onSubmit={handleSubmit}>
      <DialogContent>
        <TextField name="nome" value={formData.nome} onChange={handleChange} fullWidth margin="normal" label="Nome da Vantagem" required />
        <TextField name="custoMoedas" value={formData.custoMoedas} onChange={handleChange} fullWidth margin="normal" label="Custo em Moedas" type="number" required />
        <TextField name="urlFoto" value={formData.urlFoto} onChange={handleChange} fullWidth margin="normal" label="URL da Imagem" />
        <TextField name="descricao" value={formData.descricao} onChange={handleChange} fullWidth margin="normal" label="Descrição" multiline rows={4} />
      </DialogContent>
      <DialogActions sx={{ p: '16px 24px' }}>
        <Button onClick={onCancel}>Cancelar</Button>
        <Button type="submit" variant="contained">Salvar Vantagem</Button>
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

  // A função fetchVantagens é definida no escopo do componente
  const fetchVantagens = async () => {
    try {
        const response = await api.get(`/empresas/${empresa.id}/vantagens`);
        setVantagens(response.data);
    } catch (error) {
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
      handleCloseModal();
      setFeedback({ open: true, message: 'Vantagem salva com sucesso!', severity: 'success' });
      
      // --- CORREÇÃO AQUI ---
      // A chamada à função fetchVantagens estava com um erro de escopo/digitação
      fetchVantagens();

    } catch (error) {
      setFeedback({ open: true, message: 'Erro ao salvar vantagem.', severity: 'error' });
    }
  };

  const handleDeleteVantagem = async (id) => {
    if (window.confirm('Tem certeza que deseja remover esta vantagem?')) {
      try {
        await api.delete(`/vantagens/${id}`);
        setFeedback({ open: true, message: 'Vantagem removida!', severity: 'success' });

        // --- CORREÇÃO AQUI ---
        // A chamada à função fetchVantagens também estava com o mesmo erro
        fetchVantagens();

      } catch (error) {
        setFeedback({ open: true, message: 'Erro ao remover vantagem.', severity: 'error' });
      }
    }
  };

  return (
    <>
      <Section 
        title="Minhas Vantagens"
        action={
          <Button variant="contained" size="small" startIcon={<AddCircleIcon />} onClick={() => handleOpenModal()}>
            Nova Vantagem
          </Button>
        }
      >
        <Paper sx={{ p: 2, backgroundColor: 'transparent', boxShadow: 'none' }}>
          <Grid container spacing={3}>
            {vantagens.map((v) => (
              <Grid item xs={12} sm={6} md={4} key={v.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia component="img" height="140" image={v.urlFoto || "https://via.placeholder.com/300x140.png?text=Sem+Imagem"} alt={v.nome} />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="h2">{v.nome}</Typography>
                    <Typography variant="body2" color="text.secondary">{v.descricao}</Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'space-between', p: 2, pt: 0 }}>
                    <Typography variant="h6" color="primary">{v.custoMoedas} moedas</Typography>
                    <Box>
                      <IconButton size="small" onClick={() => handleOpenModal(v)}><EditIcon /></IconButton>
                      <IconButton size="small" onClick={() => handleDeleteVantagem(v.id)}><DeleteIcon color="error" /></IconButton>
                    </Box>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          {vantagens.length === 0 && <Typography sx={{ mt: 3, textAlign: 'center' }}>Nenhuma vantagem cadastrada ainda.</Typography>}
        </Paper>
      </Section>
      <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <DialogTitle>{editingVantagem ? 'Editar Vantagem' : 'Adicionar Nova Vantagem'}</DialogTitle>
        <VantagemForm vantagem={editingVantagem} onSave={handleSaveVantagem} onCancel={handleCloseModal} />
      </Dialog>
      <FeedbackSnackbar open={feedback.open} message={feedback.message} severity={feedback.severity} onClose={handleCloseFeedback} />
    </>
  );
}
