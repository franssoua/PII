import config from "../config";
import axios from "axios";
const apiKey = config.apiKey;

const API_URL = "http://localhost:5180/api";

const api = axios.create({
  baseURL: API_URL,
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

export default api;
