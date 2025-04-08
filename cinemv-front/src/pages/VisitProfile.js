import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import {
  getUtilisateurById,
  getAvisByUtilisateur,
  getNotesByUtilisateur,
  getListesByUtilisateur,
  getMovieDetails,
} from "../services/api";
import MovieCard from "../components/MovieCard";
import AvisCard from "../components/AvisCard";

function VisitProfile() {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [avis, setAvis] = useState([]);
  const [notes, setNotes] = useState([]);
  const [listes, setListes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const user = await getUtilisateurById(id);
      setUserData(user);

      const fetchedAvis = await getAvisByUtilisateur(id);
      const avisAvecFilms = await Promise.all(
        fetchedAvis.map(async (a) => {
          const film = await getMovieDetails(a.filmId);
          return { ...a, film };
        })
      );
      setAvis(avisAvecFilms);

      const fetchedNotes = await getNotesByUtilisateur(id);
      const notesAvecFilms = await Promise.all(
        fetchedNotes.map(async (n) => {
          const film = await getMovieDetails(n.filmId);
          return { ...n, film };
        })
      );
      setNotes(notesAvecFilms);

      const listesUtilisateur = await getListesByUtilisateur(id);
      setListes(listesUtilisateur);
    };

    fetchData();
  }, [id]);

  if (!userData) return <Typography>Chargement...</Typography>;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4">Profil de {userData.nomUtilisateur}</Typography>
      <Typography variant="subtitle1">
        Inscrit(e) depuis le{" "}
        {new Date(userData.dateInscription).toLocaleDateString()}
      </Typography>
      <img
        src={userData.photoProfil || "/images/Default_pfp.svg.webp"}
        alt="Profil"
        style={{
          width: 100,
          height: 100,
          borderRadius: "50%",
          margin: "1rem 0",
        }}
      />

      <Typography variant="h5" sx={{ mt: 4 }}>
        Avis
      </Typography>
      {avis.length === 0 ? (
        <Typography>Aucun avis posté.</Typography>
      ) : (
        avis.map((a) =>
          a.film ? (
            <AvisCard
              key={a.id}
              lien={`/movie/${a.film.id}`}
              imageSrc={`https://image.tmdb.org/t/p/w200${a.film.poster_path}`}
              titre={a.film.title}
              contenu={a.contenu}
              note={null}
              date={a.dateCreation}
              isOwner={false}
              layout="card"
            />
          ) : null
        )
      )}

      <Typography variant="h5" sx={{ mt: 4 }}>
        Notes
      </Typography>
      {notes.length === 0 ? (
        <Typography>Aucune note attribuée.</Typography>
      ) : (
        notes.map((n) =>
          n.film ? (
            <AvisCard
              key={n.id}
              lien={`/movie/${n.film.id}`}
              imageSrc={`https://image.tmdb.org/t/p/w200${n.film.poster_path}`}
              titre={n.film.title}
              contenu={null}
              note={n.valeur}
              date={n.dateCreation}
              isOwner={false}
              layout="card"
            />
          ) : null
        )
      )}

      <Typography variant="h5" sx={{ mt: 4 }}>
        Listes
      </Typography>
      {listes.length === 0 ? (
        <Typography>Aucune liste créée.</Typography>
      ) : (
        listes.map((liste) => (
          <Card key={liste.id || liste.Id} sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6">{liste.titre || liste.Titre}</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {liste.description || liste.Description}
              </Typography>
              <Grid container spacing={2}>
                {liste.filmsDetails?.map((film) => (
                  <Grid item key={film.id} xs={6} sm={4} md={3}>
                    <MovieCard film={film} />
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        ))
      )}
    </Container>
  );
}

export default VisitProfile;
