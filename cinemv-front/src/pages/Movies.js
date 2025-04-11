import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getCurrentMovies,
  getPopularMovies,
  searchMovies,
} from "../services/api";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  TextField,
} from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

function Movies() {
  const [currentMovies, setCurrentMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const current = await getCurrentMovies();
      setCurrentMovies(current);

      const popular = await getPopularMovies();
      setPopularMovies(popular);
    };
    fetchMovies();
  }, []);

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchTerm(query);

    if (query.length > 2) {
      const results = await searchMovies(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  return (
    <Container>
      <TextField
        label="Rechercher un film..."
        variant="outlined"
        fullWidth
        sx={{
          mt: 3,
          mb: 5,
          backgroundColor: "white",
          borderRadius: 1,
          boxShadow: 2,
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
              borderColor: "#095d40",
            },
          },
          "& .MuiInputLabel-root": {
            color: "#095d40",
          },
          "& .MuiInputBase-input": {
            color: "#095d40",
          },
        }}
        onChange={handleSearch}
      />

      {searchTerm.length > 2 && (
        <>
          <Typography variant="h4" gutterBottom align="center">
            Résultats de la recherche
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            {searchResults.map((movie) => (
              <Grid item key={movie.id} xs={12} sm={6} md={4} lg={2.1}>
                <Link
                  to={`/movie/${movie.id}`}
                  style={{ textDecoration: "none" }}
                >
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
                </Link>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      <Typography variant="h3" gutterBottom align="center">
        Au cinéma en ce moment
      </Typography>
      <Swiper
        spaceBetween={10}
        slidesPerView={5}
        pagination={{ clickable: true }}
        modules={[Pagination]}
        style={{ paddingBottom: "50px", position: "relative" }}
      >
        {currentMovies.map((movie) => (
          <SwiperSlide key={movie.id}>
            <Link to={`/movie/${movie.id}`} style={{ textDecoration: "none" }}>
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
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      <Typography
        variant="h3"
        gutterBottom
        align="center"
        sx={{ marginTop: 4 }}
      >
        Films populaires
      </Typography>
      <Swiper
        spaceBetween={10}
        slidesPerView={5}
        pagination={{ clickable: true }}
        modules={[Pagination]}
        style={{ paddingBottom: "50px", position: "relative" }}
      >
        {popularMovies.map((movie) => (
          <SwiperSlide key={movie.id}>
            <Link to={`/movie/${movie.id}`} style={{ textDecoration: "none" }}>
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
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </Container>
  );
}

export default Movies;
