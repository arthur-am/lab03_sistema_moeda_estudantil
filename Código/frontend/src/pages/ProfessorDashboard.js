import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
    Container, Typography, Paper, Box, Tabs, Tab, TextField, 
    Button, Table, TableBody, TableCell, TableHead, TableRow 
} from '@mui/material';

// Função auxiliar para formatar datas (opcional, mas melhora a leitura)
const formatarData = (isoString) => {
    if (!isoString) return 'N/A';
    return new Date(isoString).toLocaleString('pt-BR');
};

export default function ProfessorDashboard() {
    const [tabValue, setTabValue] = useState(0);
    
    // Tenta carregar o professor do localStorage, mas pode ser null
    const [professor, setProfessor] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('user'));
        } catch (e) {
            console.error("Erro ao ler 'user' do localStorage", e);
            return null;
        }
    });
    
    const [extrato, setExtrato] = useState([]);
    const [loadingExtrato, setLoadingExtrato] = useState(true);

    // Estado para o formulário de envio
    const [emailAluno, setEmailAluno] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [motivo, setMotivo] = useState('');
    const [formError, setFormError] = useState(null);
    const [formSuccess, setFormSuccess] = useState(null);

    // Carregar extrato do professor
    useEffect(() => {
        // Só executa se o professor estiver carregado e tiver um ID
        if (professor && professor.id) {
            const fetchExtrato = async () => {
                setLoadingExtrato(true);
                try {
                    // Descomentado e corrigido
                    const response = await api.get(`/professores/${professor.id}/extrato`);
                    setExtrato(response.data || []);
                } catch (err) {
                    console.error("Erro ao buscar extrato:", err);
                    setFormError("Não foi possível carregar o histórico.");
                } finally {
                    setLoadingExtrato(false);
                }
            };
            fetchExtrato();
        } else {
            // Se não há professor, não há o que carregar
            setLoadingExtrato(false);
        }
    }, [professor]); // Depende do objeto professor

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        // Limpa mensagens ao trocar de aba
        setFormError(null);
        setFormSuccess(null);
    };

    // Função para lidar com o envio de moedas
    const handleSubmitEnvio = async (event) => {
        event.preventDefault(); // Impede o recarregamento da página
        setFormError(null);
        setFormSuccess(null);

        const valorEnvio = parseFloat(quantidade);

        // Validações
        if (!emailAluno || !motivo || !valorEnvio) {
            setFormError("Todos os campos são obrigatórios.");
            return;
        }
        if (valorEnvio <= 0) {
            setFormError("A quantidade deve ser positiva.");
            return;
        }
        if (valorEnvio > professor.saldoMoedas) {
            setFormError("Saldo insuficiente para esta transação.");
            return;
        }

        try {
            // Endpoint de exemplo, ajuste conforme sua API
            const response = await api.post('/transacoes/enviar', { 
                professorId: professor.id,
                alunoEmail: emailAluno,
                valor: valorEnvio,
                motivo: motivo
            });

            // Sucesso!
            setFormSuccess('Moedas enviadas com sucesso!');
            
            // Limpa o formulário
            setEmailAluno('');
            setQuantidade('');
            setMotivo('');

            // Atualiza o saldo localmente para refletir a mudança
            const novoSaldo = professor.saldoMoedas - valorEnvio;
            const professorAtualizado = { ...professor, saldoMoedas: novoSaldo };
            setProfessor(professorAtualizado);
            localStorage.setItem('user', JSON.stringify(professorAtualizado));

            // Adiciona a nova transação ao extrato local (se a API retornar)
            if (response.data && response.data.transacao) {
                setExtrato(prevExtrato => [response.data.transacao, ...prevExtrato]);
            }

        } catch (err) {
            console.error("Erro ao enviar moedas:", err);
            const msg = err.response?.data?.message || "Erro ao processar a solicitação.";
            setFormError(msg);
        }
    };

    // Se o professor não for encontrado (não logado), mostra mensagem
    if (!professor) {
        return (
            <Container maxWidth="sm" sx={{ mt: 4 }}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h5" color="error">Acesso Negado</Typography>
                    <Typography sx={{ mt: 2 }}>
                        Você precisa estar logado como professor para acessar este painel.
                    </Typography>
                </Paper>
            </Container>
        );
    }

    // Renderização principal do painel
    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h4">Painel do Professor</Typography>
                <Typography variant="h6" color="text.secondary">
                    Bem-vindo, {professor.nome}!
                </Typography>
                <Typography variant="h5" color="primary" sx={{ mt: 2 }}>
                    Saldo: {(professor.saldoMoedas || 0).toFixed(2)} moedas
                </Typography>
                
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 3 }}>
                    <Tabs value={tabValue} onChange={handleTabChange}>
                        <Tab label="Enviar Moedas" />
                        <Tab label="Meu Extrato" />
                    </Tabs>
                </Box>

                {/* Painel de Enviar Moedas (Aba 0) */}
                {tabValue === 0 && (
                    <Box component="form" sx={{ mt: 3 }} onSubmit={handleSubmitEnvio}>
                        <Typography variant="h6">Reconhecer um Aluno</Typography>
                        <TextField 
                            fullWidth 
                            margin="normal" 
                            label="Email do Aluno"
                            value={emailAluno}
                            onChange={(e) => setEmailAluno(e.target.value)}
                            required 
                        />
                        <TextField 
                            fullWidth 
                            margin="normal" 
                            label="Quantidade de Moedas" 
                            type="number"
                            value={quantidade}
                            onChange={(e) => setQuantidade(e.target.value)}
                            required
                            InputProps={{ inputProps: { min: 0.01, step: "0.01" } }}
                        />
                        <TextField 
                            fullWidth 
                            margin="normal" 
                            label="Motivo do Reconhecimento" 
                            multiline 
                            rows={3}
                            value={motivo}
                            onChange={(e) => setMotivo(e.target.value)}
                            required
                        />

                        {/* Feedback para o usuário */}
                        {formError && <Typography color="error" sx={{ mt: 2 }}>{formError}</Typography>}
                        {formSuccess && <Typography color="green" sx={{ mt: 2 }}>{formSuccess}</Typography>}

                        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                            Enviar Moedas
                        </Button>
                    </Box>
                )}

                {/* Painel de Extrato (Aba 1) */}
                {tabValue === 1 && (
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="h6">Histórico de Envios</Typography>
                        
                        {loadingExtrato ? (
                            <Typography sx={{ mt: 2 }}>Carregando histórico...</Typography>
                        ) : extrato.length === 0 ? (
                            <Typography sx={{ mt: 2 }}>Nenhuma transação encontrada.</Typography>
                        ) : (
                            <Table size="small" sx={{ mt: 2 }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Data</TableCell>
                                        <TableCell>Para (Aluno)</TableCell>
                                        <TableCell>Motivo</TableCell>
                                        <TableCell align="right">Valor</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {/* Ajuste os nomes dos campos (ex: transacao.aluno.nome) conforme sua API */}
                                    {extrato.map((transacao) => (
                                        <TableRow key={transacao.id}>
                                            <TableCell>{formatarData(transacao.data)}</TableCell>
                                            <TableCell>{transacao.aluno?.nome || transacao.aluno?.email || 'N/A'}</TableCell>
                                            <TableCell>{transacao.motivo}</TableCell>
                                            <TableCell align="right" sx={{ color: 'red', fontWeight: 'bold' }}>
                                                - {parseFloat(transacao.valor).toFixed(2)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </Box>
                )}
            </Paper>
        </Container>
    ); // Fechamento correto do return
}