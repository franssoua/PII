import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useInRouterContext, useParams, Link } from "react-router-dom";
import {
  getMovieDetails,
  getAvisByFilm,
  getNotesByFilm,
  postAvis,
  postNote,
  updateAvis,
  deleteAvis,
  updateNote,
  deleteNote,
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
  ListItem,
  ListItemText,
  Rating,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { Edit, Delete, Favorite, FavoriteBorder } from "@mui/icons-material";

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

  useEffect(() => {
    const fetchData = async () => {
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
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Vous devez être connecté pour poster un avis.");
      return;
    }

    const utilisateurId = user.id; // ID temporaire en attendant l'authentification

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

    //Rafraîchir les avis et notes après ajout
    setAvis(await getAvisByFilm(id));
    const notesData = await getNotesByFilm(id);
    setNotes(notesData);
    if (notesData.length > 0) {
      setMoyenneNote(
        notesData.reduce((acc, curr) => acc + curr.valeur, 0) / notesData.length
      );
    }
  };

  const handleUpdateAvis = async (avisId, contenu, utilisateurId) => {
    const nouveauContenu = prompt("Modifier votre avis :", contenu);
    if (nouveauContenu) {
      await updateAvis(avisId, nouveauContenu, utilisateurId, id);
      setAvis(await getAvisByFilm(id));
    }
  };

  const handleDeleteAvis = async (avisId) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet avis ?")) {
      await deleteAvis(avisId);
      setAvis(await getAvisByFilm(id));
    }
  };

  const handleUpdateNote = async (noteId, valeur, utilisateurId) => {
    const nouvelleValeur = prompt(
      "Modifier votre note (entre 0 et 5) :",
      valeur
    );
    const parsedValeur = parseFloat(nouvelleValeur);
    if (!isNaN(parsedValeur) && parsedValeur >= 0 && parsedValeur <= 5) {
      await updateNote(noteId, parsedValeur, utilisateurId, id);
      setNotes(await getNotesByFilm(id));
    } else {
      alert("Veuillez entrer une valeur entre 0 et 5.");
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette note ?")) {
      await deleteNote(noteId);
      setNotes(await getNotesByFilm(id));
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

  // Fusionner avis + notes (utilisateurId en commun)
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
                sx={{ mt: 1 }}
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
                      key={liste.Id}
                      onClick={() => handleAddToList(liste.Id)}
                    >
                      {liste.Titre}
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
              sx={{ marginTop: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ marginTop: 2 }}
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

      <Container sx={{ marginTop: 4 }}>
        <Typography variant="h5">Avis des spectateurs</Typography>
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
                <ListItem
                  key={index}
                  sx={{ display: "flex", alignItems: "center", gap: 2 }}
                >
                  <Link
                    to={`/user/${utilisateurId}`}
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <img
                      src={photoProfil}
                      alt={nomUtilisateur}
                      style={{ width: 50, height: 50, borderRadius: "50%" }}
                    />
                    <Typography fontWeight="bold">{nomUtilisateur}</Typography>
                  </Link>
                  <ListItemText
                    primary={avis ? avis.contenu : "Aucun avis posté."}
                    secondary={`Posté le ${new Date(
                      (avis || note).dateCreation
                    ).toLocaleDateString()}`}
                  />

                  {note && (
                    <Typography variant="body2" sx={{ marginLeft: 2 }}>
                      Note: {note.valeur} / 5
                    </Typography>
                  )}

                  {user && user.id === utilisateurId && (
                    <>
                      {avis && (
                        <>
                          <IconButton
                            onClick={() =>
                              handleUpdateAvis(
                                avis.id,
                                avis.contenu,
                                utilisateurId
                              )
                            }
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDeleteAvis(avis.id)}
                            color="error"
                          >
                            <Delete />
                          </IconButton>
                        </>
                      )}
                      {note && (
                        <>
                          <IconButton
                            onClick={() =>
                              handleUpdateNote(
                                note.id,
                                note.valeur,
                                utilisateurId
                              )
                            }
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDeleteNote(note.id)}
                            color="error"
                          >
                            <Delete />
                          </IconButton>
                        </>
                      )}
                    </>
                  )}
                </ListItem>
              );
            })}
          </List>
        )}
      </Container>
    </Container>
  );
}

export default MovieDetails;
