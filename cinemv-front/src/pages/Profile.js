import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  getMovieDetails,
  recupererFavoris,
  getAvisByUtilisateur,
  getNotesByFilm,
} from "../services/api";
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Tabs,
  Tab,
  Rating,
} from "@mui/material";

function Profile() {
  const { user } = useContext(AuthContext);
  const [favoris, setFavoris] = useState([]);
  const [showFavoris, setShowFavoris] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [avis, setAvis] = useState([]);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchFavoris = async () => {
      if (user) {
        const allFavoris = await recupererFavoris();
        const userFavoris = allFavoris.find((f) => f.utilisateurId === user.id);
        if (userFavoris) {
          const films = (
            await Promise.all(
              userFavoris.favorisFilms.map((filmId) => getMovieDetails(filmId))
            )
          ).filter((film) => film !== null);

          setFavoris(films);
        }
      }
    };

    const fetchAvis = async () => {
      if (user) {
        const avisUtilisateur = await getAvisByUtilisateur(user.id);

        const avisAvecDetails = [];

        for (const a of avisUtilisateur) {
          if (!a.filmId) continue;

          try {
            const film = await getMovieDetails(a.filmId);
            const filmNotes = await getNotesByFilm(a.filmId);
            const notePourFilm = filmNotes.find(
              (n) => n.utilisateurId === user.id
            );

            if (film && film.title) {
              avisAvecDetails.push({
                ...a,
                film,
                note: notePourFilm?.valeur || null,
              });
            }
          } catch (err) {
            console.warn(
              `Film introuvable pour filmId = ${a.filmId} :`,
              err.message
            );
          }
        }

        setAvis(avisAvecDetails);
      }
    };

    if (showFavoris) {
      fetchFavoris();
    }

    if (tabIndex === 1) {
      fetchAvis();
    }
  }, [tabIndex, showFavoris, user]);

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

      <Tabs
        value={tabIndex}
        onChange={(e, newIndex) => setTabIndex(newIndex)}
        centered
        sx={{ mb: 3 }}
      >
        <Tab label="Favoris" />
        <Tab label="Avis" />
      </Tabs>

      {tabIndex === 0 && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowFavoris((prev) => !prev)}
          sx={{ mb: 3 }}
        >
          {showFavoris ? "Cacher les favoris" : "Voir mes favoris"}
        </Button>
      )}

      {tabIndex === 0 && showFavoris && (
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

      {tabIndex === 1 && (
        <Grid container spacing={2} justifyContent="center">
          {avis.length === 0 ? (
            <Typography>Aucun avis posté.</Typography>
          ) : (
            avis.map((a) =>
              a.film ? (
                <Grid item key={a.id} xs={12} sm={6} md={4}>
                  <Card sx={{ display: "flex", alignItems: "center", p: 1 }}>
                    <CardMedia
                      component="img"
                      image={`https://image.tmdb.org/t/p/w200${a.film.poster_path}`}
                      alt={a.film.title}
                      sx={{ width: 100 }}
                    />
                    <CardContent sx={{ flex: 1 }}>
                      <Typography variant="subtitle1">
                        {a.film.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {a.contenu}
                      </Typography>
                      {a.note !== null && (
                        <Rating
                          value={a.note}
                          precision={0.5}
                          readOnly
                          size="small"
                          sx={{ mb: 1 }}
                        />
                      )}
                      <Typography variant="caption">
                        Posté le {new Date(a.dateCreation).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ) : null
            )
          )}
        </Grid>
      )}
    </div>
  );
}

export default Profile;
