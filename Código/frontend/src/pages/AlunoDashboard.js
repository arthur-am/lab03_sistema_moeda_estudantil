import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
    Container, Typography, Grid, Paper, Box, Button, CircularProgress, Alert, 
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle 
} from '@mui/material';

export default function AlunoDashboard() {
    // Carrega o aluno do localStorage, onde foi salvo durante o login
    const [aluno, setAluno] = useState(() => JSON.parse(localStorage.getItem('user')));
    const [vantagens, setVantagens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    // Estados para o modal de confirmação de resgate
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedVantagem, setSelectedVantagem] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!aluno) {
                setLoading(false);
                return;
            }
            try {
                // Busca a lista de todas as vantagens disponíveis
                const vantagensResponse = await api.get('/vantagens');
                setVantagens(vantagensResponse.data);
            } catch (err) {
                setError('Não foi possível carregar as vantagens disponíveis.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [aluno]);

    const handleOpenDialog = (vantagem) => {
        if (aluno.saldoMoedas < vantagem.custoMoedas) {
            setError('Você não tem moedas suficientes para resgatar esta vantagem.');
        } else {
            setSelectedVantagem(vantagem);
            setOpenDialog(true);
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedVantagem(null);
    };

    const handleConfirmarResgate = async () => {
        if (!selectedVantagem) return;
        
        setError('');
        setSuccess('');

        try {
            // Chama o endpoint de resgate no backend
            const response = await api.post('/negocio/resgatar-vantagem', {
                alunoId: aluno.id,
                vantagemId: selectedVantagem.id
            });
            
            setSuccess(response.data); // Exibe a mensagem de sucesso da API

            // Atualiza o saldo do aluno localmente para feedback instantâneo
            const novoSaldo = aluno.saldoMoedas - selectedVantagem.custoMoedas;
            const alunoAtualizado = { ...aluno, saldoMoedas: novoSaldo };
            setAluno(alunoAtualizado);
            localStorage.setItem('user', JSON.stringify(alunoAtualizado));

        } catch (err) {
            setError(err.response?.data || 'Ocorreu um erro ao tentar resgatar a vantagem.');
        } finally {
            handleCloseDialog();
        }
    };

    if (!aluno) {
        return (
            <Container sx={{mt: 4}}>
                <Alert severity="error">Acesso Negado. Por favor, faça login como aluno para continuar.</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>Bem-vindo, {aluno.nome}!</Typography>
            
            <Box sx={{ mb: 4 }}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'primary.main', color: 'white' }}>
                    <Typography variant="h6">Seu Saldo</Typography>
                    <Typography component="p" variant="h4">{(aluno.saldoMoedas || 0).toFixed(2)} moedas</Typography>
                </Paper>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

            <Typography variant="h5" gutterBottom>Vantagens para Resgatar</Typography>
            
            {loading ? <CircularProgress /> : (
                <Grid container spacing={3}>
                    {vantagens.map((vantagem) => (
                        <Grid item xs={12} sm={6} md={4} key={vantagem.id}>
                            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
                                <Typography variant="h6" component="h3">{vantagem.nome}</Typography>
                                <Typography color="text.secondary">{vantagem.empresaParceira?.nome || 'Empresa'}</Typography>
                                <Box sx={{ flexGrow: 1, my: 1 }}>
                                    <Typography variant="body2">{vantagem.descricao}</Typography>
                                </Box>
                                <Typography variant="h5" color="primary">{vantagem.custoMoedas} moedas</Typography>
                                <Button 
                                    variant="contained" 
                                    sx={{ mt: 2 }}
                                    onClick={() => handleOpenDialog(vantagem)}
                                >
                                    Resgatar
                                </Button>
                            </Paper>
                        </Grid>
                    ))}
                    {vantagens.length === 0 && <Typography sx={{p: 3}}>Nenhuma vantagem disponível no momento.</Typography>}
                </Grid>
            )}

            {/* Modal de Confirmação */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Confirmar Resgate</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Você tem certeza que deseja resgatar a vantagem "{selectedVantagem?.nome}" por {selectedVantagem?.custoMoedas} moedas?
                        <br/><br/>
                        Seu saldo ficará com {(aluno.saldoMoedas - (selectedVantagem?.custoMoedas || 0)).toFixed(2)} moedas.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button onClick={handleConfirmarResgate} variant="contained" autoFocus>
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
