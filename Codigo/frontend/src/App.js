import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import LoginPage from './pages/LoginPage';
import CadastroAlunoPage from './pages/CadastroAlunoPage';
import CadastroEmpresaPage from './pages/CadastroEmpresaPage';
import AlunoDashboard from './pages/AlunoDashboard';
import ProfessorDashboard from './pages/ProfessorDashboard';
import EmpresaDashboard from './pages/EmpresaDashboard';
import MainLayout from './components/MainLayout';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6200ea',
    },
    secondary: {
      main: '#03dac6',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro/aluno" element={<CadastroAlunoPage />} />
          <Route path="/cadastro/empresa" element={<CadastroEmpresaPage />} />
          <Route path="/" element={<LoginPage />} />

          {/* Rotas Protegidas (dentro do MainLayout) */}
          <Route element={<MainLayout />}>
            <Route path="/aluno/dashboard" element={<AlunoDashboard />} />
            <Route path="/professor/dashboard" element={<ProfessorDashboard />} />
            <Route path="/empresa/dashboard" element={<EmpresaDashboard />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
