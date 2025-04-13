// Fournit des fonctions liées à l'authentification côté client

// Vérifie s'il y a un token JWT en localStorage pour déterminer si l'utilisateur est connecté
export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token;
};

// Supprime le token de localStorage pour déconnecter l'utilisateur
export const logout = () => {
  localStorage.removeItem("token");
};
