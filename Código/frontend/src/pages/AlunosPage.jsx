import React, { useState, useEffect } from 'react';
import api from '../services/api';

function AlunosPage() {
  const [alunos, setAlunos] = useState([]);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');

  // Função para buscar os alunos na API
  const fetchAlunos = async () => {
    try {
      const response = await api.get('/alunos');
      setAlunos(response.data);
    } catch (error) {
      console.error("Erro ao buscar alunos:", error);
    }
  };

  // useEffect para carregar os dados quando o componente montar
  useEffect(() => {
    fetchAlunos();
  }, []);

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const novoAluno = { nome, email, cpf }; // Adicione outros campos conforme necessário
      await api.post('/alunos', novoAluno);
      alert('Aluno cadastrado com sucesso!');
      // Limpa os campos e atualiza a lista
      setNome('');
      setEmail('');
      setCpf('');
      fetchAlunos();
    } catch (error) {
      console.error("Erro ao cadastrar aluno:", error);
      alert('Erro ao cadastrar aluno.');
    }
  };

  return (
    <div>
      <h1>Cadastro de Alunos</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome do Aluno"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="text"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          placeholder="CPF"
          required
        />
        <button type="submit">Cadastrar Aluno</button>
      </form>

      <hr />

      <h2>Alunos Cadastrados</h2>
      <ul>
        {alunos.map((aluno) => (
          <li key={aluno.id}>
            {aluno.nome} - {aluno.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AlunosPage;
