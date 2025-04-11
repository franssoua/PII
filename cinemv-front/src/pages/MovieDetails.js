import { useEffect, useState, useContext, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import { useParams } from "react-router-dom";
import {
  getMovieDetails,
  getAvisByFilm,
  getNotesByFilm,
  postAvis,
  postNote,
  ajouterFavoris,
  supprimerFavoris,
  recupererFavoris,
  getListesByUtilisateur,
  ajouterFilm,
} from "../services/api";
import {
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  TextField,
  Button,
  List,
  Rating,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import AvisCard from "../components/AvisCard";
import {
  handleUpdateAvis,
  handleDeleteAvis,
  handleUpdateNote,
  handleDeleteNote,
} from "../utils/avisHandlers";

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [avis, setAvis] = useState([]);
  const [notes, setNotes] = useState([]);
  const [moyenneNote, setMoyenneNote] = useState(0);
  const [commentaire, setCommentaire] = useState("");
  const [note, setNote] = useState(0);
  const { user } = useContext(AuthContext);
  const [isFavoris, setIsFavoris] = useState(false);
  const [listes, setListes] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  const fetchData = useCallback(async () => {
    const data = await getMovieDetails(id);
    setMovie(data);

    const avisData = await getAvisByFilm(id);
    setAvis(avisData);

    const notesData = await getNotesByFilm(id);
    setNotes(notesData || []);

    if (notesData.length > 0) {
      const moyenne =
        notesData.reduce((acc, curr) => acc + curr.valeur, 0) /
        notesData.length;
      setMoyenneNote(moyenne.toFixed(1));
    }

    if (user) {
      const favoris = await recupererFavoris();
      const userFavoris = favoris.find((f) => f.utilisateurId === user.id);
      if (userFavoris && userFavoris.favorisFilms.includes(id)) {
        setIsFavoris(true);
      }

      const listesUser = await getListesByUtilisateur(user.id);
      setListes(listesUser);
    }
  }, [id, user]);

  useEffect(() => {
    fetchData();
  }, [id, fetchData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Vous devez être connecté pour poster un avis.");
      return;
    }

    const utilisateurId = user.id;

    if (!commentaire && note === 0) {
      alert("Veuillez entrer une note ou un commentaire.");
      return;
    }

    try {
      if (commentaire) {
        await postAvis(commentaire, utilisateurId, id);
      }
    } catch (error) {
      console.log("Erreur avis :", error.response?.data); //à enlever quand ça marchera
      if (
        error.response &&
        error.response.status === 400 &&
        typeof error.response.data === "string" &&
        error.response.data?.includes("déjà laissé un avis")
      ) {
        alert("Vous avez déjà posté un avis pour ce film.");
      } else {
        console.error("Erreur lors de l'ajout de l'avis :", error);
      }
    }

    try {
      if (note > 0) {
        await postNote(note, utilisateurId, id);
      }
    } catch (error) {
      console.log("Erreur note :", error.response?.data); //à enlever quand ça marchera
      if (
        error.response &&
        error.response.status === 400 &&
        typeof error.response.data === "string" &&
        error.response.data?.includes("déjà noté ce film")
      ) {
        alert("Vous avez déjà noté ce FILM.");
      } else {
        console.error("Erreur lors de l'ajout de la note :", error);
      }
    }

    setCommentaire("");
    setNote(0);

    setAvis(await getAvisByFilm(id));
    const notesData = await getNotesByFilm(id);
    setNotes(notesData);
    if (notesData.length > 0) {
      setMoyenneNote(
        notesData.reduce((acc, curr) => acc + curr.valeur, 0) / notesData.length
      );
    }
  };

  const toggleFavoris = async () => {
    if (!user) return alert("Connextez-vous pour ajouter aux favoris.");
    if (isFavoris) {
      await supprimerFavoris(user.id, id);
      setIsFavoris(false);
    } else {
      await ajouterFavoris(user.id, id);
      setIsFavoris(true);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAddToList = async (listeId) => {
    try {
      await ajouterFilm(listeId, id);
      alert("Film ajouté à la liste !");
    } catch (error) {
      console.error("Erreur lors de l'ajout du film à la liste :", error);
      alert("Erreur : ce film est peut-être déjà dans cette liste.");
    } finally {
      handleMenuClose();
    }
  };

  const utilisateursAvecAvisOuNote = {};

  avis.forEach((a) => {
    utilisateursAvecAvisOuNote[a.utilisateurId] = {
      avis: a,
      note: null,
    };
  });

  notes.forEach((n) => {
    if (!utilisateursAvecAvisOuNote[n.utilisateurId]) {
      utilisateursAvecAvisOuNote[n.utilisateurId] = {
        avis: null,
        note: n,
      };
    } else {
      utilisateursAvecAvisOuNote[n.utilisateurId].note = n;
    }
  });

  const affichageFinal = Object.values(utilisateursAvecAvisOuNote);

  if (!movie) return <Typography align="center">Chargement...</Typography>;

  return (
    <Container sx={{ textAlign: "center", marginTop: 4 }}>
      <Typography variant="h3" gutterBottom>
        {movie.title}
      </Typography>
      <Card sx={{ maxWidth: 500, mx: "auto" }}>
        <CardMedia
          component="img"
          image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
        />
        <CardContent>
          <Typography variant="body1">{movie.overview}</Typography>
          <Typography variant="subtitle1" sx={{ marginTop: 2 }}>
            Date de sortie : {movie.release_date}
          </Typography>
          <Typography variant="subtitle1">
            Note moyenne des utilisateurs : {moyenneNote} / 5
          </Typography>
          {user && (
            <>
              <IconButton onClick={toggleFavoris}>
                {isFavoris ? <Favorite color="error" /> : <FavoriteBorder />}
              </IconButton>
              <p />
              <Button
                variant="outlined"
                onClick={handleMenuOpen}
                sx={{
                  borderColor: "#095d40",
                  color: "#095d40",
                }}
              >
                Ajouter
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                {listes.length === 0 ? (
                  <MenuItem disabled>Aucune liste</MenuItem>
                ) : (
                  listes.map((liste) => (
                    <MenuItem
                      key={liste.id}
                      onClick={() => handleAddToList(liste.id)}
                    >
                      {liste.titre}
                    </MenuItem>
                  ))
                )}
              </Menu>
            </>
          )}
        </CardContent>
      </Card>

      {user ? (
        <Container sx={{ marginTop: 4 }}>
          <Typography variant="h5">Laisser un avis</Typography>
          <form onSubmit={handleSubmit}>
            <Rating
              value={note}
              onChange={(event, newValue) => setNote(newValue)}
              precision={0.5}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Votre avis"
              variant="outlined"
              value={commentaire}
              onChange={(e) => setCommentaire(e.target.value)}
              sx={{
                marginTop: 2,
                "& label": {
                  color: "#095d40",
                },
                "& label.Mui-focused": {
                  color: "#074d34",
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#095d40",
                  },
                  "&:hover fieldset": {
                    borderColor: "#074d34",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#074d34",
                  },
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                mt: 1,
                backgroundColor: "#095d40",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#074d34",
                },
              }}
            >
              Envoyer
            </Button>
          </form>
        </Container>
      ) : (
        <Typography variant="h6" sx={{ marginTop: 4 }}>
          Vous devez être connecté pour laisser un avis.
        </Typography>
      )}

      <Container maxWidth="md" sx={{ marginTop: 4 }}>
        <Typography variant="h5" gutterBottom>
          Avis des spectateurs
        </Typography>
        {affichageFinal.length === 0 ? (
          <Typography>Aucun avis ou note pour ce film.</Typography>
        ) : (
          <List>
            {affichageFinal.map((item, index) => {
              const { avis, note } = item;
              const utilisateurId = avis?.utilisateurId || note?.utilisateurId;
              const nomUtilisateur =
                avis?.nomUtilisateur || note?.nomUtilisateur || "Inconnu";
              const photoProfil =
                avis?.photoProfil ||
                note?.photoProfil ||
                "/images/Default_pfp.svg.webp";

              return (
                <Card
                  key={utilisateurId}
                  sx={{
                    mb: 2,
                    p: 2,
                    backgroundColor: "white",
                    borderRadius: 2,
                    boxShadow: 2,
                  }}
                >
                  <AvisCard
                    lien={`/user/${utilisateurId}`}
                    imageSrc={photoProfil}
                    titre={nomUtilisateur}
                    contenu={avis?.contenu}
                    note={note?.valeur ?? null}
                    date={(avis || note)?.dateCreation}
                    isOwner={user?.id === utilisateurId}
                    onUpdateAvis={() =>
                      handleUpdateAvis(
                        avis?.id,
                        avis?.contenu,
                        utilisateurId,
                        id,
                        fetchData
                      )
                    }
                    onDeleteAvis={() => handleDeleteAvis(avis?.id, fetchData)}
                    onUpdateNote={() =>
                      handleUpdateNote(
                        note.id,
                        note.valeur,
                        utilisateurId,
                        id,
                        fetchData
                      )
                    }
                    onDeleteNote={() => handleDeleteNote(note?.id, fetchData)}
                    layout="list"
                  />
                </Card>
              );
            })}
          </List>
        )}
      </Container>
    </Container>
  );
}

export default MovieDetails;
