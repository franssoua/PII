namespace cinemvBack.Models;

using BCrypt.Net;

public class Utilisateur
{
    public int Id { get; set; }
    public string NomUtilisateur { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string MotDePasse { get; set; } = null!;
    public DateTime DateInscription { get; set; } //=DateTime.Now;
    public ICollection<ListeFilms>? Listes { get; set; }
    public ICollection<Avis>? Avis { get; set; }
    public ICollection<Note>? Notes { get; set; }
    public ICollection<Utilisateur> Abonnements { get; set; } = new List<Utilisateur>();
    public ICollection<string> FavorisFilmsIds { get; set; } = new List<string>();

    public Utilisateur() { }

    public Utilisateur(UtilisateurDTO utilisateurDTO)
    {
        Id = utilisateurDTO.Id;
        NomUtilisateur = utilisateurDTO.NomUtilisateur;
        Email = utilisateurDTO.Email;
        DateInscription = DateTime.Parse(utilisateurDTO.DateInscription);
        Listes = new List<ListeFilms>();
        Avis = new List<Avis>();
        Notes = new List<Note>();
        Abonnements = new List<Utilisateur>();
    }

    public static Utilisateur FromDto(RegisterDTO registerDTO)
    {
        return new Utilisateur
        {
            NomUtilisateur = registerDTO.NomUtilisateur,
            Email = registerDTO.Email,
            MotDePasse = HashPassword(registerDTO.MotDePasse),
            DateInscription = registerDTO.DateInscription,
        };
    }

    public bool VerifyPassword(string plainPassword)
    {
        return BCrypt.Verify(plainPassword, this.MotDePasse);
    }

    public void UpdateFromDTO(UpdateUtilisateurDTO updateUtilisateurDTO)
    {
        if (!string.IsNullOrEmpty(updateUtilisateurDTO.NomUtilisateur))
        {
            NomUtilisateur = updateUtilisateurDTO.NomUtilisateur;
        }

        if (!string.IsNullOrEmpty(updateUtilisateurDTO.Email))
        {
            Email = updateUtilisateurDTO.Email;
        }

        if (!string.IsNullOrEmpty(updateUtilisateurDTO.MotDePasse))
        {
            MotDePasse = updateUtilisateurDTO.MotDePasse;
        }
    }

    private static string HashPassword(string motDePasse)
    {
        return BCrypt.HashPassword(motDePasse);
    }

    public bool AjouterAbonnement(Utilisateur utilisateur)
    {
        if (!Abonnements.Contains(utilisateur))
        {
            Abonnements.Add(utilisateur);
            return true;
        }
        return false;
    }

    public bool SupprimerAbonnement(Utilisateur utilisateur)
    {
        return Abonnements.Remove(utilisateur);
    }

    public bool AjouterFilmFavoris(string filmId)
    {
        if (!FavorisFilmsIds.Contains(filmId))
        {
            FavorisFilmsIds.Add(filmId);
            return true;
        }
        return false;
    }

    public bool SupprimerFilmFavoris(string filmId)
    {
        return FavorisFilmsIds.Remove(filmId);
    }
}
