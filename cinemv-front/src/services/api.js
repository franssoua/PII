import config from "../config";
import axios from "axios";
const apiKey = config.apiKey;

const API_URL = "http://localhost:5180/api";
const TMDB_API_URL = "https://api.themoviedb.org/3";

const api = axios.create({
  baseURL: API_URL,
});

const tmdbApi = axios.create({
  baseURL: TMDB_API_URL,
  params: {
    api_key: apiKey,
    language: "fr-FR",
  },
});

export const login = async (email, password) => {
  try {
    const response = await api.post(
      "/utilisateur/login",
      { email, password },
      { headers: { "Content-Type": "application/json" } }
    );

    const { Token } = response.data;

    if (Token) {
      localStorage.setItem("token", Token);
      api.defaults.headers.common["Authorization"] = `Bearer ${Token}`;
    }

    return response.data;
  } catch (error) {
    console.error("Erreur de connexion", error);
    throw error;
  }
};

export const register = async (userData) => {
  const response = await api.post("/utilisateur/register", userData);
  return response.data;
};

export const getAllUtilisateurs = async () => {
  try {
    const response = await axios.get("http://localhost:5180/api/utilisateur", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs :", error);
    return [];
  }
};

export const getUtilisateurById = async (id) => {
  try {
    const response = await api.get(`/utilisateur/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur :", error);
    return null;
  }
};

export const updateUtilisateur = async (id, data) => {
  try {
    const response = await api.put(`/utilisateur/${id}`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
  }
};

export const deleteUtilisateur = async (id) => {
  try {
    await axios.delete(`http://localhost:5180/api/utilisateur/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur :", error);
    throw error;
  }
};

export const getCurrentMovies = async () => {
  try {
    const response = await tmdbApi.get("movie/now_playing");
    return response.data.results;
  } catch (error) {
    console.error("Erreur lors de la récupération des films :", error);
    return [];
  }
};

export const getPopularMovies = async () => {
  try {
    const response = await tmdbApi.get("movie/popular");
    return response.data.results;
  } catch (error) {
    console.error("Erreur lors de la récupération des films :", error);
    return [];
  }
};

export const searchMovies = async (query) => {
  try {
    if (!query) return [];

    const response = await tmdbApi.get("search/movie", {
      params: { query },
    });

    return response.data.results;
  } catch (error) {
    console.error("Erreur lors de la recherche de films :", error);
    return [];
  }
};

export const getMovieDetails = async (id) => {
  try {
    const response = await tmdbApi.get(`movie/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des détails du film :",
      error
    );
    return null;
  }
};

export const getAvisByFilm = async (filmId) => {
  try {
    const response = await axios.get(`${API_URL}/avis/film/${filmId}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des avis :", error);
    return [];
  }
};

export const getNotesByFilm = async (filmId) => {
  try {
    const response = await axios.get(`${API_URL}/note/film/${filmId}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.warn(`Aucune note trouvée pour le film ${filmId}`);
      return [];
    }
    console.error("Erreur lors de la récupération des notes :", error);
    return [];
  }
};

export const postAvis = async (contenu, utilisateurId, filmId) => {
  try {
    await axios.post(
      `${API_URL}/avis`,
      {
        contenu,
        dateCreation: new Date(),
        utilisateurId,
        filmId,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    //console.error("Erreur lors de l'ajout de l'avis :", error);
    throw error;
  }
};

export const postNote = async (valeur, utilisateurId, filmId) => {
  if (valeur < 0 || valeur > 5) {
    console.error("Erreur : la note doit être comprise entre 0 et 5.");
    return;
  }

  if (!utilisateurId || !filmId) {
    console.error("Erreur : utilisateurId ou filmId manquant !");
    return;
  }

  console.log("Données envoyées :", {
    valeur: parseInt(valeur, 10),
    dateCreation: new Date().toISOString(),
    utilisateurId,
    filmId,
  });

  try {
    await axios.post(
      `${API_URL}/note`,
      {
        valeur: parseInt(valeur, 10),
        dateCreation: new Date().toISOString(),
        utilisateurId,
        filmId,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    //console.error("Erreur lors de l'ajout de la note :", error);
    throw error;
  }
};

export const updateNote = async (noteId, valeur, utilisateurId, filmId) => {
  try {
    await axios.put(
      `${API_URL}/note/${noteId}`,
      {
        valeur: parseInt(valeur, 10),
        utilisateurId,
        filmId,
        dateCreation: new Date().toISOString(),
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Erreur lors de la modification de la note :", error);
  }
};

export const deleteNote = async (noteId) => {
  try {
    await axios.delete(`${API_URL}/note/${noteId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la suppression de la note :", error);
  }
};

export const updateAvis = async (avisId, contenu, utilisateurId, filmId) => {
  try {
    await axios.put(
      `${API_URL}/avis/${avisId}`,
      {
        contenu,
        utilisateurId,
        filmId: String(filmId),
        dateCreation: new Date().toISOString(),
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Erreur lors de la modification de l'avis :", error);
    throw error;
  }
};

export const deleteAvis = async (avisId) => {
  try {
    await axios.delete(`${API_URL}/avis/${avisId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'avis :", error);
  }
};

export const ajouterFavoris = async (utilisateurId, filmId) => {
  try {
    await axios.post(
      `${API_URL}/favoris/ajouter`,
      { utilisateurId, filmId },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Erreur lors de l'ajout du film aux favoris :", error);
  }
};

export const supprimerFavoris = async (utilisateurId, filmId) => {
  try {
    await axios.delete(`${API_URL}/favoris/supprimer`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      data: { utilisateurId, filmId },
    });
  } catch (error) {
    console.error("Erreur lors de la suppression du film des favoris :", error);
  }
};

export const recupererFavoris = async () => {
  try {
    const response = await axios.get(`${API_URL}/favoris/liste`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des favoris :", error);
    return [];
  }
};

export const getAvisByUtilisateur = async (utilisateurId) => {
  try {
    const response = await axios.get(
      `${API_URL}/avis/utilisateur/${utilisateurId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des avis utilisateur :",
      error
    );
    return [];
  }
};

export const getNotesByUtilisateur = async (utilisateurId) => {
  try {
    const response = await axios.get(
      `${API_URL}/note/utilisateur/${utilisateurId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des notes utilisateur :",
      error
    );
    return [];
  }
};

// export const getListesByUtilisateur = async (utilisateurId) => {
//   try {
//     const response = await axios.get(`http://localhost:5180/api/listeFilms`);
//     const toutes = response.data.filter(
//       (l) => l.utilisateurId === utilisateurId
//     );

//     // Récupérer les détails des films pour chaque liste
//     for (const liste of toutes) {
//       const films = await Promise.all(
//         liste.filmsIds.map((id) => getMovieDetails(id))
//       );
//       liste.filmsDetails = films.filter((f) => f); // supprime les nulls
//     }

//     return toutes;
//   } catch (error) {
//     console.error("Erreur lors de la récupération des listes :", error);
//     return [];
//   }
// };
export const getListesByUtilisateur = async (utilisateurId) => {
  try {
    const response = await axios.get(
      `http://localhost:5180/api/listeFilms/utilisateur/${utilisateurId}`
    );

    for (const liste of response.data) {
      const films = await Promise.all(
        liste.filmsIds.map((id) => getMovieDetails(id))
      );
      liste.filmsDetails = films.filter((f) => f); // supprime les nulls
    }

    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des listes de l'utilisateur :",
      error
    );
    return [];
  }
};

export const createListe = async ({ titre, description, utilisateurId }) => {
  try {
    await axios.post(
      "http://localhost:5180/api/listeFilms",
      {
        titre,
        description,
        utilisateurId,
        filmsIds: [],
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Erreur lors de la création de la liste :", error);
  }
};

export const updateListe = async (listeId, data) => {
  try {
    await axios.put(`${API_URL}/listeFilms/${listeId}`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la liste :", error);
  }
};

export const deleteListe = async (listeId) => {
  try {
    await axios.delete(`${API_URL}/listeFilms/${listeId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la suppression de la liste :", error);
  }
};

export const ajouterFilm = async (listeId, filmId) => {
  try {
    await axios.post(
      `http://localhost:5180/api/listeFilms/${listeId}/ajouterFilm`,
      JSON.stringify(filmId), // car attendu en tant que string brute
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Erreur lors de l'ajout du film à la liste :", error);
    throw error;
  }
};

export const supprimerFilm = async (listeId, filmId) => {
  try {
    await axios.post(
      `http://localhost:5180/api/listeFilms/${listeId}/supprimerFilm`,
      JSON.stringify(filmId), // idem ici
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Erreur lors de la suppression du film de la liste :", error);
    throw error;
  }
};

export { api, tmdbApi };
