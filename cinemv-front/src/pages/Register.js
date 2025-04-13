//Permet de créer un compte utilisateur avec nom, email et mot de passe
//Redirige vers la page de connexion après une inscription réussie
import { useState } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { register } from "../services/api";

function Register() {
  const [nomUtilisateur, setNomUtilisateur] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register({
        NomUtilisateur: nomUtilisateur,
        Email: email,
        MotDePasse: motDePasse,
      });
      navigate("/login");
    } catch (error) {
      alert("Erreur lors de l'inscription. Vérifiez vos informations.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mb: 11,
          mt: 5,
          p: 3,
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: "white",
        }}
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
            sx={{
              "& label": { color: "#095d40" },
              "& label.Mui-focused": {
                color: "#074d34",
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#095d40" },
                "&:hover fieldset": { borderColor: "#074d34" },
                "&.Mui-focused fieldset": { borderColor: "#074d34" },
              },
            }}
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{
              "& label": { color: "#095d40" },
              "& label.Mui-focused": {
                color: "#074d34",
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#095d40" },
                "&:hover fieldset": { borderColor: "#074d34" },
                "&.Mui-focused fieldset": { borderColor: "#074d34" },
              },
            }}
          />
          <TextField
            label="Mot de passe"
            type="password"
            fullWidth
            margin="normal"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            required
            sx={{
              "& label": { color: "#095d40" },
              "& label.Mui-focused": {
                color: "#074d34",
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#095d40" },
                "&:hover fieldset": { borderColor: "#074d34" },
                "&.Mui-focused fieldset": { borderColor: "#074d34" },
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              mt: 2,
              backgroundColor: "#095d40",
              color: "white",
              "&:hover": { backgroundColor: "#074d34" },
            }}
          >
            S'inscrire
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default Register;
