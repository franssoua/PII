import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import {
  getMovieDetails,
  recupererFavoris,
  getAvisByUtilisateur,
  getNotesByUtilisateur,
  getNotesByFilm,
  updateAvis,
  updateNote,
  deleteAvis,
  deleteNote,
  supprimerFavoris,
  getListesByUtilisateur,
  createListe,
  updateListe,
  deleteListe,
  supprimerFilm,
  updateUtilisateur,
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
  IconButton,
} from "@mui/material";
import { Edit, Delete, Favorite, Remove } from "@mui/icons-material";

function Profile() {
  const { user, updateUserLocally } = useContext(AuthContext);
  const [favoris, setFavoris] = useState([]);
  const [showFavoris, setShowFavoris] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [avis, setAvis] = useState([]);
  const [notes, setNotes] = useState([]);
  const [listes, setListes] = useState([]);
  const navigate = useNavigate();

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

    if (showFavoris) {
      fetchFavoris();
    }

    if (tabIndex === 1) {
      fetchAvis();
    }

    if (tabIndex === 2) {
      fetchListes();
    }
  }, [tabIndex, showFavoris, user]);

  const fetchAvis = async () => {
    if (user) {
      const avisUtilisateur = await getAvisByUtilisateur(user.id);
      const notesUtilisateur = await getNotesByUtilisateur(user.id);

      const toutFilmIds = [
        ...new Set([
          ...avisUtilisateur.map((a) => a.filmId),
          ...notesUtilisateur.map((n) => n.filmId),
        ]),
      ];

      const avisEtNotes = [];

      for (const filmId of toutFilmIds) {
        try {
          const film = await getMovieDetails(filmId);

          const avis = avisUtilisateur.find((a) => a.filmId === filmId);
          const note = notesUtilisateur.find((n) => n.filmId === filmId);

          if (film && film.title) {
            avisEtNotes.push({
              id: avis?.id || null,
              contenu: avis?.contenu || null,
              dateCreation: avis?.dateCreation || note?.dateCreation || null,
              film,
              note: note?.valeur || null,
              noteId: note?.id || null,
            });
          }
        } catch (err) {
          console.warn(
            `Film introuvable pour filmId = ${filmId} :`,
            err.message
          );
        }
      }

      // Trier du plus récent au plus ancien (optionnel)
      avisEtNotes.sort(
        (a, b) => new Date(b.dateCreation) - new Date(a.dateCreation)
      );

      setAvis(avisEtNotes);
    }
  };

  const fetchListes = async () => {
    if (user) {
      try {
        const listesUtilisateur = await getListesByUtilisateur(user.id);
        setListes(listesUtilisateur);
      } catch (error) {
        console.error("Erreur lors de la récupération des listes :", error);
      }
    }
  };

  const handleUpdateAvis = async (avisId, contenu, utilisateurId, filmId) => {
    const nouveauContenu = prompt("Modifier votre avis :", contenu);
    if (nouveauContenu) {
      await updateAvis(avisId, nouveauContenu, utilisateurId, filmId);
      await fetchAvis();
    }
  };

  const handleUpdateNote = async (noteId, valeur, utilisateurId, filmId) => {
    const nouvelleValeur = prompt("Modifier votre note :", valeur);
    const parsedValeur = parseFloat(nouvelleValeur);
    if (!isNaN(parsedValeur) && parsedValeur >= 0 && parsedValeur <= 5) {
      await updateNote(noteId, parsedValeur, utilisateurId, String(filmId));
      await fetchAvis();
    } else {
      alert("Veuillez entrer une valeur entre 0 et 5.");
    }
  };

  const handleDeleteAvis = async (avisId) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet avis ?")) {
      await deleteAvis(avisId);
      await fetchAvis();
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette note ?")) {
      await deleteNote(noteId);
      await fetchAvis();
    }
  };

  const handleRemoveFavori = async (filmId) => {
    if (!user) return;
    await supprimerFavoris(user.id, String(filmId));
    const allFavoris = await recupererFavoris();
    const userFavoris = allFavoris.find((f) => f.utilisateurId === user.id);
    if (userFavoris) {
      const films = (
        await Promise.all(
          userFavoris.favorisFilms.map((filmId) => getMovieDetails(filmId))
        )
      ).filter((film) => film !== null);
      setFavoris(films);
    } else {
      setFavoris([]);
    }
  };

  const handleUpdateListe = async (liste) => {
    const nouveauTitre = prompt("Nouveau titre :", liste.titre);
    const nouvelleDescription = prompt(
      "Nouvelle description :",
      liste.description
    );
    if (nouveauTitre && nouvelleDescription) {
      await updateListe(liste.Id, {
        titre: nouveauTitre,
        description: nouvelleDescription,
        utilisateurId: user.id,
        filmsIds: liste.filmsIds || [],
      });
      fetchListes();
    }
  };

  const handleDeleteListe = async (listeId) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette liste ?")) {
      await deleteListe(listeId);
      fetchListes();
    }
  };

  const handleRemoveFilmFromListe = async (listeId, filmId) => {
    if (!user) return;
    const confirm = window.confirm("Supprimer ce film de cette liste ?");
    if (!confirm) return;

    try {
      await supprimerFilm(listeId, String(filmId));
      fetchListes(); // refresh
    } catch (error) {
      console.error("Erreur suppression film de la liste :", error);
    }
  };

  const handleUpdatePhotoProfil = async () => {
    const newUrl = prompt("Entrez l’URL de votre nouvelle photo de profil :");
    if (newUrl) {
      await updateUtilisateur(user.id, { photoProfil: newUrl });
      updateUserLocally({ ...user, photoProfil: newUrl });
    }
  };

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
      <div
        style={{
          height: "100px",
          width: "100px",
          borderRadius: "50%",
          backgroundImage: `url(${
            user.photoProfil || "/images/Default_pfp.svg.webp"
          })`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      ></div>
      {/* 
      <img
        src={user.photoProfil || "/images/Default_pfp.svg.webp"}
        alt="Profil"
        style={{ width: 100, height: 100, borderRadius: "50%" }}
      /> */}
      <Button className="bg-green" onClick={handleUpdatePhotoProfil}>
        Modifier la photo de profil
      </Button>

      <Tabs
        value={tabIndex}
        onChange={(e, newIndex) => setTabIndex(newIndex)}
        centered
        sx={{ mb: 3 }}
      >
        <Tab label="Favoris" />
        <Tab label="Avis" />
        <Tab label="Listes" />
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
                <Link
                  to={`/movie/${film.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <Card
                    sx={{ maxWidth: 200, mx: "auto", position: "relative" }}
                  >
                    <CardMedia
                      component="img"
                      height="300"
                      image={`https://image.tmdb.org/t/p/w500${film.poster_path}`}
                      alt={film.title}
                    />
                    <IconButton
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        color: "error.main",
                        backgroundColor: "rgba(255,255,255,0.8)",
                        borderRadius: "50%",
                      }}
                      onClick={() => handleRemoveFavori(film.id)}
                    >
                      <Favorite />
                    </IconButton>
                    <CardContent>
                      <Typography variant="subtitle1">{film.title}</Typography>
                    </CardContent>
                  </Card>
                </Link>
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
                <Grid item key={a.id || a.noteId} xs={12} sm={6} md={4}>
                  <Link
                    to={`/movie/${a.film.id}`}
                    style={{ textDecoration: "none" }}
                  >
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
                          <>
                            <Rating
                              value={a.note}
                              precision={0.5}
                              readOnly
                              size="small"
                              sx={{ mb: 1 }}
                            />
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleUpdateNote(
                                  a.noteId,
                                  a.note,
                                  user.id,
                                  a.film.id
                                )
                              }
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteNote(a.noteId)}
                              color="error"
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </>
                        )}
                        {a.id && (
                          <>
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleUpdateAvis(
                                  a.id,
                                  a.contenu,
                                  user.id,
                                  a.film.id
                                )
                              }
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteAvis(a.id)}
                              color="error"
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </>
                        )}

                        <Typography variant="caption">
                          Posté le{" "}
                          {new Date(a.dateCreation).toLocaleDateString()}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Link>
                </Grid>
              ) : null
            )
          )}
        </Grid>
      )}

      {tabIndex === 2 && (
        <Container>
          <Button
            variant="contained"
            color="primary"
            onClick={async () => {
              const titre = prompt("Titre de la nouvelle liste :");
              const description = prompt("Description :");

              if (titre && description) {
                await createListe({
                  titre,
                  description,
                  utilisateurId: user.id,
                });
                fetchListes();
              }
            }}
            sx={{ mb: 3 }}
          >
            Nouvelle liste
          </Button>

          {listes.length === 0 ? (
            <Typography>Aucune liste créée.</Typography>
          ) : (
            listes.map((liste) => (
              <Card key={liste.Id} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6">
                    {liste.Titre}{" "}
                    <IconButton onClick={() => handleUpdateListe(liste)}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteListe(liste.Id)}
                      color="error"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    {liste.Description}
                  </Typography>
                  {liste.filmsIds.length === 0 ? (
                    <>
                      <Typography>Aucun film dans cette liste.</Typography>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={() => navigate("/movies")}
                        sx={{ mt: 1 }}
                      >
                        Ajouter des films
                      </Button>
                    </>
                  ) : (
                    <Grid container spacing={2}>
                      {liste.filmsDetails?.map((film) => (
                        <Grid item key={film.id} xs={6} sm={4} md={3}>
                          <Link
                            to={`/movie/${film.id}`}
                            style={{ textDecoration: "none" }}
                          >
                            <Card sx={{ position: "relative" }}>
                              <CardMedia
                                component="img"
                                height="200"
                                image={`https://image.tmdb.org/t/p/w500${film.poster_path}`}
                                alt={film.title}
                              />
                              <IconButton
                                size="small"
                                onClick={() =>
                                  handleRemoveFilmFromListe(liste.Id, film.id)
                                }
                                sx={{
                                  position: "absolute",
                                  top: 8,
                                  right: 8,
                                  backgroundColor: "rgba(255,255,255,0.8)",
                                  borderRadius: "50%",
                                }}
                              >
                                <Remove fontSize="small" />
                              </IconButton>
                              <CardContent>
                                <Typography variant="subtitle2">
                                  {film.title}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Link>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </Container>
      )}
    </div>
  );
}

export default Profile;
