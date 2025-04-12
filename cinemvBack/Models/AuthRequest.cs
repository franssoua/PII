// Données nécessaires à la connexion d’un utilisateur : nom d'utilisateur et mot de passe
public class AuthRequest
{
    public required string NomUtilisateur { get; set; }
    public required string MotDePasse { get; set; }
}
