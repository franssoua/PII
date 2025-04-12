using cinemvBack.Models;

// Représente un utilisateur sous forme simplifiée pour les transferts de données
public class UtilisateurDTO
{
    public int Id { get; set; }
    public string NomUtilisateur { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string DateInscription { get; set; } = null!;
    public string? PhotoProfil { get; set; }
    public bool IsAdmin { get; set; }

    public UtilisateurDTO() { }

    public UtilisateurDTO(Utilisateur utilisateur)
    {
        Id = utilisateur.Id;
        NomUtilisateur = utilisateur.NomUtilisateur;
        Email = utilisateur.Email;
        DateInscription = utilisateur.DateInscription.ToString("yyyy-MM-dd");
        PhotoProfil = utilisateur.PhotoProfil;
        IsAdmin = utilisateur.IsAdmin;
    }
}

// Utilisé lors de l'inscription d’un nouvel utilisateur
public class RegisterDTO
{
    public string NomUtilisateur { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string MotDePasse { get; set; } = null!;
    public DateTime DateInscription { get; set; }
}

// Utilisé pour la connexion d’un utilisateur avec email et mot de passe
public class LoginDTO
{
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
}

// Utilisé pour mettre à jour un utilisateur (nom, email, mot de passe ou photo)
public class UpdateUtilisateurDTO
{
    public string? NomUtilisateur { get; set; }
    public string? Email { get; set; }
    public string? MotDePasse { get; set; }
    public string? PhotoProfil { get; set; }
}
