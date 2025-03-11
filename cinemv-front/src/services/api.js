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

export const getCurrentMovies = async () => {
  try {
    const response = await tmdbApi.get("movie/now_playing");
    return response.data.results;
  } catch (error) {
    console.error("Erreur lors de la récupération des films :", error);
    return [];
  }
};

export { api, tmdbApi };
