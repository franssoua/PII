import { Stack, Button, Container, Typography } from "@mui/material";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Home() {
  const { user, logout } = useContext(AuthContext);
  // const navigate = useNavigate();

  // const handleLogout = () => {
  //   logout();
  //   navigate("/login");
  // };

  return (
    <Container>
      <Typography variant="h3" gutterBottom>
        Bienvenue sur My Movie App
      </Typography>
      <Stack spacing={2} sx={{ maxWidth: 300, margin: "auto" }}>
        {user ? (
          <Button variant="contained" color="secondary" onClick={logout}>
            Déconnexion
          </Button>
        ) : (
          <>
            <Link to="/login">
              <Button variant="contained" color="primary" fullWidth>
                Connexion
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="contained" color="primary" fullWidth>
                S'inscrire
              </Button>
            </Link>
          </>
        )}
      </Stack>
    </Container>
  );
}

export default Home;
