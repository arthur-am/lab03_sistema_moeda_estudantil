import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
    Container, Typography, Grid, Paper, Box as MuiBox, Button, Dialog, DialogActions, 
    DialogContent, DialogContentText, DialogTitle, CardMedia, Card, CardContent, CircularProgress, Avatar
} from '@mui/material';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import FeedbackSnackbar from '../components/FeedbackSnackbar';

// Componente auxiliar para seções, como no wireframe
const Section = ({ title, children }) => (
  <MuiBox sx={{ my: 4 }}>
    <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
      <MuiBox sx={{ width: 6, height: 24, bgcolor: 'primary.main', borderRadius: 2 }} />
      <Typography variant="h6" sx={{ fontWeight: 600, color: 'grey.800' }}>{title}</Typography>
    </MuiBox>
    {children}
  </MuiBox>
);

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
            setFeedback({ open: true, message: 'Saldo insuficiente para este resgate.', severity: 'warning' });
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
            {/* Seção do Saldo */}
            <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2, fontSize: 16 }} gutterBottom>
                    <AccountBalanceWalletOutlinedIcon sx={{ fontSize: 20, mr: 1 }} />Meu Saldo
                </Typography>
                <MuiBox sx={{ p: 3, borderRadius: 3, backgroundColor: 'primary.main', color: 'white', textAlign: 'center' }}>
                    <Typography variant="h6" sx={{opacity: 0.8}}>Saldo Atual</Typography>
                    <Typography component="p" variant="h3" sx={{fontWeight: 'bold'}}>
                        {(aluno.saldoMoedas || 0).toFixed(2)}
                    </Typography>
                    <Typography variant="subtitle1">StudentCoins</Typography>
                </MuiBox>
            </Paper>

            {/* Seção das Vantagens */}
            <Section title="Vantagens para Resgatar">
                {loading ? <CircularProgress /> : (
                    <Grid container spacing={3}>
                        {vantagens.map((vantagem) => (
                            <Grid item xs={12} sm={6} md={4} key={vantagem.id}>
                                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <CardMedia component="img" height="140" image={vantagem.urlFoto || "https://via.placeholder.com/300x140.png?text=Sem+Imagem"} alt={vantagem.nome} />
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography gutterBottom variant="h6">{vantagem.nome}</Typography>
                                        <Typography variant="body2" color="text.secondary">{vantagem.empresaParceira?.nome}</Typography>
                                    </CardContent>
                                    <MuiBox sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="h5" color="primary">{vantagem.custoMoedas} moedas</Typography>
                                        <Button size="small" variant="contained" onClick={() => handleOpenDialog(vantagem)}>Resgatar</Button>
                                    </MuiBox>
                                </Card>
                            </Grid>
                        ))}
                        {vantagens.length === 0 && <Typography sx={{ p: 3, width: '100%', textAlign: 'center' }}>Nenhuma vantagem disponível no momento.</Typography>}
                    </Grid>
                )}
            </Section>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Confirmar Resgate</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Deseja resgatar "{selectedVantagem?.nome}" por {selectedVantagem?.custoMoedas} moedas?
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
