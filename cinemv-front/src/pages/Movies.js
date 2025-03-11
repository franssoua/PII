import { useEffect, useState } from "react";
import { getCurrentMovies } from "../services/api";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";

function Movies() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const data = await getCurrentMovies();
      setMovies(data);
    };
    fetchMovies();
  }, []);

  return (
    <Container>
      <Typography variant="h3" gutterBottom align="center">
        Au cinéma en ce moment
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        {movies.map((movie) => (
          <Grid item key={movie.id} xs={12} sm={6} md={4} lg={2.1}>
            <Card
              sx={{
                maxWidth: 180,
                height: 310,
                mx: "auto",
                transition: "0.3s",
                "&:hover": { transform: "scale(1.05)" },
              }}
            >
              <CardMedia
                component="img"
                image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                sx={{ height: 250 }}
              />
              <CardContent sx={{ textAlign: "center", padding: "8px" }}>
                <Typography variant="subtitle2">{movie.title}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Movies;
