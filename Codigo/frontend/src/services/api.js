import axios from 'axios';

const api = axios.create({
  // ELE TENTA LER A VARIÁVEL DE AMBIENTE PRIMEIRO
  // Se não encontrar (no ambiente local), ele usa o localhost como padrão.
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
});

export default api;
