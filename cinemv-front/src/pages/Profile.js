import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  getTousLesFavoris,
  getMovieDetails,
  recupererFavoris,
} from "../services/api";
import {
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";

function Profile() {
  const { user } = useContext(AuthContext);
  const [favoris, setFavoris] = useState([]);
  const [showFavoris, setShowFavoris] = useState(false);

  useEffect(() => {
    const fetchFavoris = async () => {
      if (user) {
        const allFavoris = await recupererFavoris();
        const userFavoris = allFavoris.find((f) => f.utilisateurId === user.id);
        if (userFavoris) {
          const films = await Promise.all(
            userFavoris.favorisFilms.map((filmId) => getMovieDetails(filmId))
          );
          setFavoris(films);
        }
      }
    };

    if (showFavoris) {
      fetchFavoris();
    }
  }, [showFavoris, user]);

  if (!user)
    return (
      <Typography align="center">
        Connectez-vous pour voir votre profil
      </Typography>
    );

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        Profil de {user.nomUtilisateur}
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => setShowFavoris((prev) => !prev)}
        sx={{ mb: 3 }}
      >
        {showFavoris ? "Cacher les favoris" : "Voir mes favoris"}
      </Button>

      {showFavoris && (
        <Grid container spacing={2} justifyContent="center">
          {favoris.length === 0 ? (
            <Typography>Aucun film dans vos favoris.</Typography>
          ) : (
            favoris.map((film) => (
              <Grid item key={film.id} xs={12} sm={6} md={4} lg={2}>
                <Card sx={{ maxWidth: 200, mx: "auto" }}>
                  <CardMedia
                    component="img"
                    height="300"
                    image={`https://image.tmdb.org/t/p/w500${film.poster_path}`}
                    alt={film.title}
                  />
                  <CardContent>
                    <Typography variant="subtitle1">{film.title}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}
    </div>
  );
}

export default Profile;
