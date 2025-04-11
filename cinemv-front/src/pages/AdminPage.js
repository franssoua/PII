import { useEffect, useState, useContext } from "react";
import {
  Container,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { AuthContext } from "../context/AuthContext";
import { getAllUtilisateurs, deleteUtilisateur } from "../services/api";

function AdminPage() {
  const { user } = useContext(AuthContext);
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [showList, setShowList] = useState(false);

  const fetchUtilisateurs = async () => {
    const data = await getAllUtilisateurs();
    setUtilisateurs(data);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Confirmer la suppression de cet utilisateur ?"
    );
    if (!confirm) return;

    try {
      await deleteUtilisateur(id);
      setUtilisateurs((prev) => prev.filter((u) => u.id !== id));
    } catch (error) {
      alert("Erreur lors de la suppression.");
    }
  };

  useEffect(() => {
    if (showList) {
      fetchUtilisateurs();
    }
  }, [showList]);

  if (!user || !user.nomUtilisateur) {
    return <Typography>Chargement du profil administrateur...</Typography>;
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Administrateur {user.nomUtilisateur}
      </Typography>

      <Button
        variant="contained"
        onClick={() => setShowList((prev) => !prev)}
        sx={{
          mb: 3,
          backgroundColor: "#095d40",
          color: "#fff",
          "&:hover": {
            backgroundColor: "#074d34",
          },
        }}
      >
        {showList ? "Cacher les utilisateurs" : "Voir les utilisateurs"}
      </Button>

      {showList && (
        <>
          {utilisateurs.length === 0 ? (
            <Typography>Aucun utilisateur trouvé.</Typography>
          ) : (
            <List sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {utilisateurs.map((u) => (
                <ListItem
                  key={u.id}
                  sx={{
                    backgroundColor: "#fff",
                    borderRadius: 2,
                    boxShadow: 2,
                    px: 3,
                    py: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" fontWeight="bold">
                        {u.nomUtilisateur}
                      </Typography>
                    }
                    secondary={u.email}
                  />
                  <IconButton
                    edge="end"
                    color="error"
                    onClick={() => handleDelete(u.id)}
                  >
                    <Delete />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          )}
        </>
      )}
    </Container>
  );
}

export default AdminPage;
