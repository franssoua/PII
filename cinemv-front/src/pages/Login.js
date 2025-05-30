//Page de connexion pour les utilisateurs
import { useState, useContext } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/movies"); // Redirection après connexion
    } catch (error) {
      alert("Échec de connexion, vérifiez vos identifiants !");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mb: 21,
          mt: 5,
          p: 3,
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: "white",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Connexion
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            type="email"
            label="Email"
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
            type="password"
            label="Mot de passe"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            Se connecter
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Login;
