// Modèle représentant un avis textuel laissé par un utilisateur sur un film
using cinemvBack.Models;

public class Avis
{
    public int Id { get; set; }
    public string Contenu { get; set; } = null!;
    public DateTime DateCreation { get; set; }
    public int UtilisateurId { get; set; }
    public Utilisateur Utilisateur { get; set; } = null!;
    public string FilmId { get; set; } = null!;

    public Avis() { }

    public Avis(AvisDTO avisDTO)
    {
        Id = avisDTO.Id;
        Contenu = avisDTO.Contenu;
        DateCreation = avisDTO.DateCreation;
        UtilisateurId = avisDTO.UtilisateurId;
        FilmId = avisDTO.FilmId;
    }
}
