using System.Text.Json.Serialization;
using cinemvBack.Models;

public class UtilisateurDTO
{
    [JsonPropertyName("Id")]
    public int Id { get; set; }

    [JsonPropertyName("Nom d'utilisateur")]
    public string NomUtilisateur { get; set; } = null!;

    [JsonPropertyName("Email")]
    public string Email { get; set; } = null!;

    [JsonPropertyName("Date d'inscription")]
    public string DateInscription { get; set; } = null!;

    public UtilisateurDTO() { }

    public UtilisateurDTO(Utilisateur utilisateur)
    {
        Id = utilisateur.Id;
        NomUtilisateur = utilisateur.NomUtilisateur;
        Email = utilisateur.Email;
        DateInscription = utilisateur.DateInscription.ToString("yyyy-MM-dd");
    }
}

public class RegisterDTO
{
    [JsonPropertyName("Nom d'utilisateur")]
    public string NomUtilisateur { get; set; } = null!;

    [JsonPropertyName("Email")]
    public string Email { get; set; } = null!;

    [JsonPropertyName("Mot de passe")]
    public string MotDePasse { get; set; } = null!;

    [JsonPropertyName("Date d'inscription")]
    public DateTime DateInscription { get; set; }
}

public class LoginDTO
{
    [JsonPropertyName("Email")]
    public string Email { get; set; } = null!;

    [JsonPropertyName("Mot de passe")]
    public string MotDePasse { get; set; } = null!;
}

public class UpdateUtilisateurDTO
{
    [JsonPropertyName("Nom d'utilisateur")]
    public string? NomUtilisateur { get; set; }

    [JsonPropertyName("Email")]
    public string? Email { get; set; }

    [JsonPropertyName("Mot de passe")]
    public string? MotDePasse { get; set; }
}
