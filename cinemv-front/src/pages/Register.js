import { useState, useContext } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { register } from "../services/api";

function Register() {
  const [nomUtilisateur, setNomUtilisateur] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const { login } = useContext(AuthContext); // Pour se connecter directement après inscription
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register({
        "Nom d'utilisateur": nomUtilisateur,
        Email: email,
        "Mot de passe": motDePasse,
      });
      await login(email, motDePasse); // Connexion automatique après l'inscription
      navigate("/"); // Redirige vers la page d'accueil
    } catch (error) {
      alert("Erreur lors de l'inscription. Vérifiez vos informations.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: "white" }}
      >
        <Typography variant="h4" gutterBottom>
          Inscription
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Nom d'utilisateur"
            fullWidth
            margin="normal"
            value={nomUtilisateur}
            onChange={(e) => setNomUtilisateur(e.target.value)}
            required
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Mot de passe"
            type="password"
            fullWidth
            margin="normal"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            S'inscrire
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default Register;
