public class AvisDTO
{
    public int Id { get; set; }
    public string Contenu { get; set; } = null!;
    public DateTime DateCreation { get; set; }
    public int UtilisateurId { get; set; }
    public string FilmId { get; set; } = null!;

    public AvisDTO() { }

    public AvisDTO(Avis avis)
    {
        Id = avis.Id;
        Contenu = avis.Contenu;
        DateCreation = avis.DateCreation;
        UtilisateurId = avis.UtilisateurId;
        FilmId = avis.FilmId;
    }
}
