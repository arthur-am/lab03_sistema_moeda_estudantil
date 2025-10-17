import React, { useState } from 'react';
import api from '../services/api';

const EnviarMoedasForm = () => {
  const [professorId, setProfessorId] = useState('');
  const [alunoId, setAlunoId] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [motivo, setMotivo] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleEnvio = async (e) => {
    e.preventDefault();
    setMensagem(''); // Limpa a mensagem anterior

    const dadosEnvio = {
      professorId: Number(professorId),
      alunoId: Number(alunoId),
      quantidade: parseFloat(quantidade),
      motivo,
    };

    try {
      const response = await api.post('/negocio/enviar-moedas', dadosEnvio);
      setMensagem(response.data); // "Moedas enviadas com sucesso!"
    } catch (error) {
      // Captura a mensagem de erro enviada pelo backend (ex: "Saldo insuficiente")
      setMensagem(`Erro: ${error.response.data}`);
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', marginTop: '20px' }}>
      <h2>Enviar Moedas</h2>
      <form onSubmit={handleEnvio}>
        <input type="number" value={professorId} onChange={(e) => setProfessorId(e.target.value)} placeholder="ID do Professor" required />
        <input type="number" value={alunoId} onChange={(e) => setAlunoId(e.target.value)} placeholder="ID do Aluno" required />
        <input type="number" step="0.01" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} placeholder="Quantidade" required />
        <textarea value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Motivo (obrigatório)" required />
        <button type="submit">Enviar</button>
      </form>
      {mensagem && <p>{mensagem}</p>}
    </div>
  );
};

export default EnviarMoedasForm;
