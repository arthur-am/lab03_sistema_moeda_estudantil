import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
    Typography, Paper, Box, Tabs, Tab, TextField, Button, 
    Table, TableBody, TableCell, TableHead, TableRow, CircularProgress 
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ListAltIcon from '@mui/icons-material/ListAlt';
import FeedbackSnackbar from '../components/FeedbackSnackbar';

const formatarData = (isoString) => isoString ? new Date(isoString).toLocaleString('pt-BR') : 'N/A';

export default function ProfessorDashboard() {
    const [tabValue, setTabValue] = useState(0);
    const [professor, setProfessor] = useState(() => JSON.parse(localStorage.getItem('user')));
    const [extrato, setExtrato] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Estados do formulário de envio
    const [emailAluno, setEmailAluno] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [motivo, setMotivo] = useState('');
    const [feedback, setFeedback] = useState({ open: false, message: '', severity: 'info' });

    useEffect(() => {
        if (professor?.id && tabValue === 1) {
            const fetchExtrato = async () => {
                try {
                    const response = await api.get(`/professores/${professor.id}/extrato`);
                    setExtrato(response.data || []);
                } catch (err) {
                    setFeedback({ open: true, message: 'Não foi possível carregar o extrato.', severity: 'error' });
                }
            };
            fetchExtrato();
        }
    }, [professor, tabValue]);

    const handleTabChange = (_, newValue) => setTabValue(newValue);
    const handleCloseFeedback = () => setFeedback({ ...feedback, open: false });

    const handleSubmitEnvio = async (event) => {
        event.preventDefault();
        setLoading(true);
        if (parseFloat(quantidade) > professor.saldoMoedas) {
            setFeedback({ open: true, message: 'Saldo insuficiente.', severity: 'error' });
            setLoading(false);
            return;
        }
        try {
            const response = await api.post('/negocio/enviar-moedas', { professorId: professor.id, alunoEmail: emailAluno, quantidade: parseFloat(quantidade), motivo });
            setFeedback({ open: true, message: 'Moedas enviadas com sucesso!', severity: 'success' });
            setEmailAluno(''); setQuantidade(''); setMotivo('');
            
            const novoSaldo = professor.saldoMoedas - parseFloat(quantidade);
            const professorAtualizado = { ...professor, saldoMoedas: novoSaldo };
            setProfessor(professorAtualizado);
            localStorage.setItem('user', JSON.stringify(professorAtualizado));

            // Adiciona a nova transação ao extrato, caso o usuário navegue para lá
            setExtrato(prev => [response.data, ...prev]);
        } catch (err) {
            setFeedback({ open: true, message: err.response?.data || "Erro ao enviar moedas.", severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    if (!professor) return <Typography sx={{p:4}}>Acesso Negado.</Typography>;

    return (
        <>
            <Paper sx={{ p: { xs: 2, md: 4 } }}>
                <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Saldo Atual: {(professor.saldoMoedas || 0).toFixed(2)} moedas
                </Typography>
                
                <Tabs value={tabValue} onChange={handleTabChange} indicatorColor="primary" textColor="primary" sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tab icon={<SendIcon />} iconPosition="start" label="Enviar Moedas" />
                    <Tab icon={<ListAltIcon />} iconPosition="start" label="Meu Extrato" />
                </Tabs>

                {/* Painel de Enviar Moedas */}
                {tabValue === 0 && (
                    <Box sx={{ pt: 3 }}>
                        <Typography variant="h6" gutterBottom>Reconhecer um Aluno</Typography>
                        <Box component="form" onSubmit={handleSubmitEnvio}>
                            <TextField fullWidth margin="normal" label="Email do Aluno" value={emailAluno} onChange={e => setEmailAluno(e.target.value)} required />
                            <TextField fullWidth margin="normal" label="Quantidade de Moedas" type="number" value={quantidade} onChange={e => setQuantidade(e.target.value)} required InputProps={{ inputProps: { min: 0.01, step: "0.01" } }}/>
                            <TextField fullWidth margin="normal" label="Motivo do Reconhecimento" multiline rows={4} value={motivo} onChange={e => setMotivo(e.target.value)} required />
                            <Button type="submit" variant="contained" sx={{ mt: 2, py: 1.5, fontSize: '1rem' }} disabled={loading} fullWidth>
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Enviar Moedas'}
                            </Button>
                        </Box>
                    </Box>
                )}

                {/* Painel de Extrato */}
                {tabValue === 1 && (
                    <Box sx={{ pt: 3 }}>
                        <Typography variant="h6">Histórico de Envios</Typography>
                        {extrato.length === 0 ? <Typography sx={{ mt: 2 }}>Nenhuma transação encontrada.</Typography> : (
                            <Table size="small" sx={{ mt: 2 }}>
                                <TableHead><TableRow><TableCell>Data</TableCell><TableCell>Motivo</TableCell><TableCell align="right">Valor</TableCell></TableRow></TableHead>
                                <TableBody>
                                    {extrato.map((t) => (
                                        <TableRow key={t.id} hover>
                                            <TableCell>{formatarData(t.data)}</TableCell>
                                            <TableCell>{t.motivo}</TableCell>
                                            <TableCell align="right" sx={{ color: 'error.main', fontWeight: 'bold' }}>- {parseFloat(t.valor).toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </Box>
                )}
            </Paper>
            <FeedbackSnackbar open={feedback.open} message={feedback.message} severity={feedback.severity} onClose={handleCloseFeedback} />
        </>
    );
}
