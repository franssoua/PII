import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { AppBar, Toolbar, Button, Box } from "@mui/material";

function Header() {
  const { user, logout } = useContext(AuthContext);

  return (
    <AppBar position="static" sx={{ backgroundColor: "#f2ebd9", boxShadow: 2 }}>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
            }}
          >
            <img
              src="/images/LOGO.png"
              alt="Logo Ciné'MV"
              style={{ height: 50 }}
            />
            <span
              style={{
                marginLeft: 8,
                fontSize: 22,
                fontWeight: "bold",
                color: "#095d40",
              }}
            >
              Ciné'MV
            </span>
          </Link>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Link to="/movies">
            <Button variant="text" sx={{ color: "#000" }}>
              Films
            </Button>
          </Link>
          {user?.isAdmin && (
            <Link to="/admin">
              <Button variant="text" sx={{ color: "#000" }}>
                Admin
              </Button>
            </Link>
          )}
          {user && (
            <Link to="/profile">
              <Button variant="text" sx={{ color: "#000" }}>
                Profil
              </Button>
            </Link>
          )}
          {user ? (
            <Button
              onClick={logout}
              variant="contained"
              sx={{
                backgroundColor: "#095d40",
                color: "#fff",
                "&:hover": { backgroundColor: "#074d34" },
              }}
            >
              Déconnexion
            </Button>
          ) : (
            <Link to="/login">
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#095d40",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#074d34" },
                }}
              >
                Se connecter
              </Button>
            </Link>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
