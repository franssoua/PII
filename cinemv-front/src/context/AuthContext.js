import { createContext, useState, useEffect } from "react";
import { api } from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api
        .get("/utilisateur/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => {
          console.error(
            "Erreur lors de la récupération de l'utilisateur :",
            err
          );
          localStorage.removeItem("token");
          delete api.defaults.headers.common["Authorization"];
          setUser(null);
        });
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post("/utilisateur/login", {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.token}`;
      setUser(response.data.utilisateur);
    } catch (error) {
      console.error("Erreur de connexion", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  };

  const updateUserLocally = (updatedUser) => {
    setUser(updatedUser);
    // Tu peux aussi remettre à jour le localStorage si tu t'en sers ailleurs
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, setUser, updateUserLocally }}
    >
      {children}
    </AuthContext.Provider>
  );
};
