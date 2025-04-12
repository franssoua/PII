// Réponse retournée après une authentification réussie, contenant un token JWT et les infos de l’utilisateur connecté
using cinemvBack.Models;

public class AuthResponse
{
    public required string Token { get; set; }
    public required Utilisateur Utilisateur { get; set; }
}
