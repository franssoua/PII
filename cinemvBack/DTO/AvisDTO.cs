using System.Text.Json.Serialization;

public class AvisDTO
{
    public int Id { get; set; }
    public string Contenu { get; set; } = null!;
    public DateTime DateCreation { get; set; }
    public int UtilisateurId { get; set; }
    public string FilmId { get; set; } = null!;

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public string? NomUtilisateur { get; set; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public string? PhotoProfil { get; set; }

    public AvisDTO() { }

    public AvisDTO(Avis avis)
    {
        Id = avis.Id;
        Contenu = avis.Contenu;
        DateCreation = avis.DateCreation;
        UtilisateurId = avis.UtilisateurId;
        FilmId = avis.FilmId;
        if (avis.Utilisateur != null)
        {
            NomUtilisateur = avis.Utilisateur.NomUtilisateur;
            PhotoProfil = avis.Utilisateur.PhotoProfil;
        }
    }
}
