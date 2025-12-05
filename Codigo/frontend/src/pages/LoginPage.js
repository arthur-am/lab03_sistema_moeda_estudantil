import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import api from "../services/api";

// Importações do Material-UI
import {
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  Grid,
  Link,
  CircularProgress,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import FeedbackSnackbar from "../components/FeedbackSnackbar";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/login", { email, senha: password });
      const { userType, userData } = response.data;
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("userType", userType);

      const dashboardPath = `/${userType.toLowerCase()}/dashboard`;
      navigate(dashboardPath);
    } catch (err) {
      setFeedback({
        open: true,
        message: "Email ou senha inválidos. Tente novamente.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseFeedback = () => setFeedback({ ...feedback, open: false });

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: 'url("https://sedu.es.gov.br/Media/sedu/_Profiles/c4d8c6e6/982b8e1d/SURURU%20(1).png?v=638635717000748020")',
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: { xs: "none", sm: "block" }, // Importante: Esconde no mobile para focar no login
        }}
      />
      <Grid 
        item 
        xs={12} 
        sm={8} 
        md={5} 
        component={Paper} 
        elevation={6} 
        square
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center' // Centraliza verticalmente o conteúdo
        }}
      >
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <Typography
            component="h1"
            variant="h4"
            sx={{ fontWeight: "bold", mb: 4 }}
          >
            LOGIN
          </Typography>

          <Box
            component="form"
            noValidate
            onSubmit={handleLogin}
            sx={{ width: "100%" }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Username ou Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                mt: 1,
              }}
            >
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Lembrar-me"
              />
              <Link href="#" variant="body2">
                Esqueceu a Senha?
              </Link>
            </Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ mt: 3, mb: 2, py: 1.5, fontSize: "1rem" }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Entrar"
              )}
            </Button>
            <Typography variant="body2" align="center">
              Não tem uma conta?{" "}
              <Link component={RouterLink} to="/cadastro/aluno">
                Inscrever-se
              </Link>{" "}
              ou como{" "}
              <Link component={RouterLink} to="/cadastro/empresa">
                Empresa
              </Link>
            </Typography>
          </Box>
        </Box>
      </Grid>
      <FeedbackSnackbar
        open={feedback.open}
        message={feedback.message}
        severity={feedback.severity}
        onClose={handleCloseFeedback}
      />
    </Grid>
  );
}
