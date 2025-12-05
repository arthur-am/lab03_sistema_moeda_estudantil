import axios from 'axios';

const api = axios.create({
  // Usando a sintaxe do Create React App (process.env)
  // e o prefixo correto (REACT_APP_)
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
});

export default api;
