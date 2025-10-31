import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
    Container, Typography, Paper, Box, Tabs, Tab, TextField, Button, 
    Table, TableBody, TableCell, TableHead, TableRow, Alert, CircularProgress 
} from '@mui/material';

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
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');

    // Efeito para carregar o extrato quando a aba 1 for selecionada
    useEffect(() => {
        if (professor?.id && tabValue === 1) {
            const fetchExtrato = async () => {
                try {
                    // **BACKEND:** Certifique-se de que o ProfessorController existe com este endpoint
                    const response = await api.get(`/professores/${professor.id}/extrato`);
                    setExtrato(response.data || []);
                } catch (err) {
                    console.error("Erro ao buscar extrato:", err);
                }
            };
            fetchExtrato();
        }
    }, [professor, tabValue]); // Roda quando 'professor' ou 'tabValue' mudam

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        setFormError(''); setFormSuccess('');
    };

    const handleSubmitEnvio = async (event) => {
        event.preventDefault();
        setFormError(''); setFormSuccess(''); setLoading(true);

        const valorEnvio = parseFloat(quantidade);
        if (valorEnvio > professor.saldoMoedas) {
            setFormError("Saldo insuficiente.");
            setLoading(false);
            return;
        }

        try {
            // --- CORREÇÃO AQUI ---
            // Chamando o endpoint correto do NegocioController
            const response = await api.post('/negocio/enviar-moedas', { 
                professorId: professor.id,
                alunoEmail: emailAluno, // Enviando o email, como esperado pelo backend agora
                quantidade: valorEnvio,
                motivo: motivo
            });

            setFormSuccess('Moedas enviadas com sucesso!');
            setEmailAluno(''); setQuantidade(''); setMotivo('');

            // Atualiza o saldo localmente para refletir a mudança instantaneamente
            const novoSaldo = professor.saldoMoedas - valorEnvio;
            const professorAtualizado = { ...professor, saldoMoedas: novoSaldo };
            setProfessor(professorAtualizado);
            localStorage.setItem('user', JSON.stringify(professorAtualizado));

            // Adiciona a nova transação (retornada pela API) ao início do extrato
            setExtrato(prevExtrato => [response.data, ...prevExtrato]);

        } catch (err) {
            setFormError(err.response?.data || "Erro ao processar a solicitação.");
        } finally {
            setLoading(false);
        }
    };

    if (!professor) {
        return <Typography sx={{ p: 4 }}>Acesso Negado. Faça login como professor para continuar.</Typography>;
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h4">Painel do Professor</Typography>
                <Typography variant="h6" color="text.secondary">Bem-vindo, {professor.nome}!</Typography>
                <Typography variant="h5" color="primary" sx={{ mt: 2 }}>Saldo: {(professor.saldoMoedas || 0).toFixed(2)} moedas</Typography>
                
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 3 }}>
                    <Tabs value={tabValue} onChange={handleTabChange}><Tab label="Enviar Moedas" /><Tab label="Meu Extrato" /></Tabs>
                </Box>

                {tabValue === 0 && (
                    <Box component="form" sx={{ mt: 3 }} onSubmit={handleSubmitEnvio}>
                        <Typography variant="h6">Reconhecer um Aluno</Typography>
                        <TextField fullWidth margin="normal" label="Email do Aluno" value={emailAluno} onChange={e => setEmailAluno(e.target.value)} required />
                        <TextField fullWidth margin="normal" label="Quantidade de Moedas" type="number" value={quantidade} onChange={e => setQuantidade(e.target.value)} required InputProps={{ inputProps: { min: 0.01, step: "0.01" } }}/>
                        <TextField fullWidth margin="normal" label="Motivo do Reconhecimento" multiline rows={3} value={motivo} onChange={e => setMotivo(e.target.value)} required />
                        
                        {formError && <Alert severity="error" sx={{ mt: 2 }}>{formError}</Alert>}
                        {formSuccess && <Alert severity="success" sx={{ mt: 2 }}>{formSuccess}</Alert>}

                        <Button type="submit" variant="contained" sx={{ mt: 2 }} disabled={loading}>
                            {loading ? <CircularProgress size={24} /> : 'Enviar Moedas'}
                        </Button>
                    </Box>
                )}

                {tabValue === 1 && (
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="h6">Histórico de Envios</Typography>
                        {extrato.length === 0 ? <Typography sx={{ mt: 2 }}>Nenhuma transação encontrada.</Typography> : (
                            <Table size="small" sx={{ mt: 2 }}>
                                <TableHead><TableRow><TableCell>Data</TableCell><TableCell>Motivo</TableCell><TableCell align="right">Valor</TableCell></TableRow></TableHead>
                                <TableBody>
                                    {extrato.map((t) => (
                                        <TableRow key={t.id}>
                                            <TableCell>{formatarData(t.data)}</TableCell>
                                            <TableCell>{t.motivo}</TableCell>
                                            <TableCell align="right" sx={{ color: 'red', fontWeight: 'bold' }}>- {parseFloat(t.valor).toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </Box>
                )}
            </Paper>
        </Container>
    );
}
