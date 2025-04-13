//Composant représentant un film sous forme de carte : 
//  - Affiche l’affiche, le titre,
//  - Peut contenir une icône d'action personnalisée (ex. : favoris, suppression),
//  - Navigue vers la page de détails du film au clic
import {
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

function MovieCard({
  film,
  onActionClick,
  actionIcon,
  actionColor = "default",
  actionPosition = { top: 8, right: 8 },
}) {
  return (
    <Link to={`/movie/${film.id}`} style={{ textDecoration: "none" }}>
      <Card sx={{ maxWidth: 200, mx: "auto", position: "relative" }}>
        <CardMedia
          component="img"
          height="300"
          image={`https://image.tmdb.org/t/p/w500${film.poster_path}`}
          alt={film.title}
        />
        {onActionClick && actionIcon && (
          <IconButton
            sx={{
              position: "absolute",
              ...actionPosition,
              color: `${actionColor}.main`,
              backgroundColor: "rgba(255,255,255,0.8)",
              borderRadius: "50%",
            }}
            onClick={(e) => {
              e.preventDefault();
              onActionClick(film.id);
            }}
          >
            {actionIcon}
          </IconButton>
        )}
        <CardContent>
          <Typography variant="subtitle1">{film.title}</Typography>
        </CardContent>
      </Card>
    </Link>
  );
}

export default MovieCard;
