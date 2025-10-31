import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// --- IMPORTE TODAS AS SUAS PÁGINAS ---
import LoginPage from './pages/LoginPage';
import CadastroAlunoPage from './pages/CadastroAlunoPage';
import CadastroEmpresaPage from './pages/CadastroEmpresaPage';
import AlunoDashboard from './pages/AlunoDashboard';
import ProfessorDashboard from './pages/ProfessorDashboard';
import EmpresaDashboard from './pages/EmpresaDashboard';

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
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* --- ROTAS ADICIONADAS --- */}
          <Route path="/cadastro/aluno" element={<CadastroAlunoPage />} />
          <Route path="/cadastro/empresa" element={<CadastroEmpresaPage />} />

          {/* Rotas dos Painéis (Dashboards) */}
          <Route path="/aluno/dashboard" element={<AlunoDashboard />} />
          <Route path="/professor/dashboard" element={<ProfessorDashboard />} />
          <Route path="/empresa/dashboard" element={<EmpresaDashboard />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
