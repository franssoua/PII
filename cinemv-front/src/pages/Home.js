import { Stack, Button, Container, Typography, Box } from "@mui/material";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Home() {
  const { user, logout } = useContext(AuthContext);

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "80vh",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#ffffff",
          padding: 4,
          borderRadius: 4,
          boxShadow: 4,
          width: "100%",
          textAlign: "center",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Bienvenue sur Ciné'MV
        </Typography>

        <Stack spacing={2} mt={3}>
          {user ? (
            <>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: "#095d40",
                  "&:hover": { backgroundColor: "#074d34" },
                }}
                onClick={logout}
              >
                Déconnexion
              </Button>
              <Link to="/movies">
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundColor: "#095d40",
                    "&:hover": { backgroundColor: "#074d34" },
                  }}
                >
                  Les films
                </Button>
              </Link>
              <Link to="/profile">
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundColor: "#095d40",
                    "&:hover": { backgroundColor: "#074d34" },
                  }}
                >
                  Votre profil
                </Button>
              </Link>
              {user.isAdmin && (
                <Link to="/admin">
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      backgroundColor: "#095d40",
                      "&:hover": { backgroundColor: "#074d34" },
                    }}
                  >
                    Admin
                  </Button>
                </Link>
              )}
            </>
          ) : (
            <>
              <Link to="/login">
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundColor: "#095d40",
                    "&:hover": { backgroundColor: "#074d34" },
                  }}
                >
                  Connexion
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundColor: "#095d40",
                    "&:hover": { backgroundColor: "#074d34" },
                  }}
                >
                  S'inscrire
                </Button>
              </Link>
              <Link to="/movies">
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundColor: "#095d40",
                    "&:hover": { backgroundColor: "#074d34" },
                  }}
                >
                  Les films
                </Button>
              </Link>
            </>
          )}
        </Stack>
      </Box>
    </Container>
  );
}

export default Home;
