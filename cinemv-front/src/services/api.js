//centralise toutes les fonctions d’appel à l’API backend et à l’API TMDB
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

//Connecte l'utilisateur, enregistre le token dans le localStorage et le transmet dans les headers
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

// Inscription d'un utilisateur
export const register = async (userData) => {
  const response = await api.post("/utilisateur/register", userData);
  return response.data;
};

//Retourne tous les utilisateurs
export const getAllUtilisateurs = async () => {
  try {
    const response = await api.get("/utilisateur", {
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

//Récupère les données d’un utilisateur via son ID
export const getUtilisateurById = async (id) => {
  try {
    const response = await api.get(`/utilisateur/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur :", error);
    return null;
  }
};

//Met à jour les infos d’un utilisateur
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

//Supprime un utilisateur
export const deleteUtilisateur = async (id) => {
  try {
    await api.delete(`/utilisateur/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur :", error);
    throw error;
  }
};

// récupère les films actuellement au cinéma
export const getCurrentMovies = async () => {
  try {
    const response = await tmdbApi.get("movie/now_playing");
    return response.data.results;
  } catch (error) {
    console.error("Erreur lors de la récupération des films :", error);
    return [];
  }
};

// récupère les films populaires
export const getPopularMovies = async () => {
  try {
    const response = await tmdbApi.get("movie/popular");
    return response.data.results;
  } catch (error) {
    console.error("Erreur lors de la récupération des films :", error);
    return [];
  }
};

//Recherche un film via une chaîne de caractères
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

//Récupère les détails d’un film à partir de son ID.
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

//Récupère les avis liés à un film
export const getAvisByFilm = async (filmId) => {
  try {
    const response = await api.get(`/avis/film/${filmId}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des avis :", error);
    return [];
  }
};

//Récupère les notes liés à un film
export const getNotesByFilm = async (filmId) => {
  try {
    const response = await api.get(`/note/film/${filmId}`);
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

//Ajoute un avis
export const postAvis = async (contenu, utilisateurId, filmId) => {
  try {
    await api.post(
      `/avis`,
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
    console.error("Erreur lors de l'ajout de l'avis :", error);
  }
};

//Ajoute une note
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
    await api.post(
      `/note`,
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
    console.error("Erreur lors de l'ajout de la note :", error);
  }
};

//Met à jour une note
export const updateNote = async (noteId, valeur, utilisateurId, filmId) => {
  try {
    await api.put(
      `/note/${noteId}`,
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

//Supprime une note
export const deleteNote = async (noteId) => {
  try {
    await api.delete(`/note/${noteId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la suppression de la note :", error);
  }
};

//Met à jour un avis
export const updateAvis = async (avisId, contenu, utilisateurId, filmId) => {
  try {
    await api.put(
      `/avis/${avisId}`,
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

//Supprime un avis
export const deleteAvis = async (avisId) => {
  try {
    await api.delete(`/avis/${avisId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'avis :", error);
  }
};

//Ajoute un film aux favoris d’un utilisateur
export const ajouterFavoris = async (utilisateurId, filmId) => {
  try {
    await api.post(
      `/favoris/ajouter`,
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

//Retire un film des favoris
export const supprimerFavoris = async (utilisateurId, filmId) => {
  try {
    await api.delete(`/favoris/supprimer`, {
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

//Récupère tous les favoris d'un utilisateur
export const recupererFavoris = async () => {
  try {
    const response = await api.get(`/favoris/liste`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des favoris :", error);
    return [];
  }
};

//Récupère les avis liés à un utilisateur
export const getAvisByUtilisateur = async (utilisateurId) => {
  try {
    const response = await api.get(
      `/avis/utilisateur/${utilisateurId}`
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

//Récupère les notes liés à un utilisateur
export const getNotesByUtilisateur = async (utilisateurId) => {
  try {
    const response = await api.get(
      `/note/utilisateur/${utilisateurId}`
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

//Récupère toutes les listes personnalisées d’un utilisateur
export const getListesByUtilisateur = async (utilisateurId) => {
  try {
    const response = await api.get(
      `/listeFilms/utilisateur/${utilisateurId}`
    );

    for (const liste of response.data) {
      const films = await Promise.all(
        liste.filmsIds.map((id) => getMovieDetails(id))
      );
      liste.filmsDetails = films.filter((f) => f);
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

// Crée une nouvelle liste
export const createListe = async ({ titre, description, utilisateurId }) => {
  try {
    await api.post(
      "/listeFilms",
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

//Met à jour une liste existante
export const updateListe = async (listeId, data) => {
  try {
    await api.put(`/listeFilms/${listeId}`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la liste :", error);
  }
};

//Supprime une liste
export const deleteListe = async (listeId) => {
  try {
    await api.delete(`/listeFilms/${listeId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la suppression de la liste :", error);
  }
};

//Ajoute un film dans une liste
export const ajouterFilm = async (listeId, filmId) => {
  try {
    await api.post(
      `/listeFilms/${listeId}/ajouterFilm`,
      JSON.stringify(filmId),
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

//Retire un film d'une liste
export const supprimerFilm = async (listeId, filmId) => {
  try {
    await api.post(
      `/listeFilms/${listeId}/supprimerFilm`,
      JSON.stringify(filmId),
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
