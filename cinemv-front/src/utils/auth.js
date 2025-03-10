export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token; // Retourne true si le token existe
};

export const logout = () => {
  localStorage.removeItem("token"); // Supprime le token pour déconnecter l'utilisateur
};
