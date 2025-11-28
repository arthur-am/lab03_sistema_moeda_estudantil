import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
    Typography, Grid, Paper, Box, Button, CircularProgress, Dialog, DialogActions, 
    DialogContent, DialogContentText, DialogTitle, CardMedia, Card, CardContent
} from '@mui/material';
import FeedbackSnackbar from '../components/FeedbackSnackbar';

export default function AlunoDashboard() {
    const [aluno, setAluno] = useState(() => JSON.parse(localStorage.getItem('user')));
    const [vantagens, setVantagens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState({ open: false, message: '', severity: 'info' });
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedVantagem, setSelectedVantagem] = useState(null);

    useEffect(() => {
        if (!aluno) { setLoading(false); return; }
        const fetchData = async () => {
            try {
                const vantagensResponse = await api.get('/vantagens');
                setVantagens(vantagensResponse.data);
            } catch (err) {
                setFeedback({ open: true, message: 'Não foi possível carregar as vantagens.', severity: 'error' });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [aluno]);

    const handleOpenDialog = (vantagem) => {
        if (aluno.saldoMoedas < vantagem.custoMoedas) {
            setFeedback({ open: true, message: 'Você não tem moedas suficientes para resgatar esta vantagem.', severity: 'warning' });
        } else {
            setSelectedVantagem(vantagem);
            setOpenDialog(true);
        }
    };

    const handleCloseDialog = () => setOpenDialog(false);
    
    const handleConfirmarResgate = async () => {
        if (!selectedVantagem) return;
        try {
            const response = await api.post('/negocio/resgatar-vantagem', { alunoId: aluno.id, vantagemId: selectedVantagem.id });
            setFeedback({ open: true, message: response.data, severity: 'success' });
            
            const novoSaldo = aluno.saldoMoedas - selectedVantagem.custoMoedas;
            const alunoAtualizado = { ...aluno, saldoMoedas: novoSaldo };
            setAluno(alunoAtualizado);
            localStorage.setItem('user', JSON.stringify(alunoAtualizado));
        } catch (err) {
            setFeedback({ open: true, message: err.response?.data || 'Erro ao resgatar vantagem.', severity: 'error' });
        } finally {
            handleCloseDialog();
        }
    };
    
    const handleCloseFeedback = () => setFeedback({ ...feedback, open: false });

    if (!aluno) return <Typography sx={{p:4}}>Acesso Negado. Faça login como aluno.</Typography>;

    return (
        <>
            <Box sx={{ mb: 4 }}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'primary.main', color: 'white' }}>
                    <Typography variant="h6">Seu Saldo</Typography>
                    <Typography component="p" variant="h4">{(aluno.saldoMoedas || 0).toFixed(2)} moedas</Typography>
                </Paper>
            </Box>
            <Typography variant="h5" gutterBottom>Vantagens para Resgatar</Typography>
            {loading ? <CircularProgress /> : (
                <Grid container spacing={3}>
                    {vantagens.map((vantagem) => (
                        <Grid item xs={12} sm={6} md={4} key={vantagem.id}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardMedia component="img" height="140" image={vantagem.urlFoto || "https://via.placeholder.com/300x140.png?text=Sem+Imagem"} alt={vantagem.nome} />
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography gutterBottom variant="h6">{vantagem.nome}</Typography>
                                    <Typography variant="body2" color="text.secondary">{vantagem.empresaParceira?.nome}</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{mt: 1}}>{vantagem.descricao}</Typography>
                                </CardContent>
                                <Box sx={{ p: 2, pt: 0 }}>
                                    <Typography variant="h5" color="primary">{vantagem.custoMoedas} moedas</Typography>
                                    <Button variant="contained" fullWidth sx={{ mt: 1 }} onClick={() => handleOpenDialog(vantagem)}>Resgatar</Button>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                    {vantagens.length === 0 && <Typography sx={{ p: 3 }}>Nenhuma vantagem disponível no momento.</Typography>}
                </Grid>
            )}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Confirmar Resgate</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Deseja resgatar "{selectedVantagem?.nome}" por {selectedVantagem?.custoMoedas} moedas?
                        <br/>Seu novo saldo será de {(aluno.saldoMoedas - (selectedVantagem?.custoMoedas || 0)).toFixed(2)} moedas.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button onClick={handleConfirmarResgate} variant="contained" autoFocus>Confirmar</Button>
                </DialogActions>
            </Dialog>
            <FeedbackSnackbar open={feedback.open} message={feedback.message} severity={feedback.severity} onClose={handleCloseFeedback} />
        </>
    );
}
