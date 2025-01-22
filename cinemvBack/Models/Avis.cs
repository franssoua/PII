using cinemvBack.Models;

public class Avis
{
    public int Id { get; set; }
    public string Contenu { get; set; } = null!;
    public DateTime DateCreation { get; set; } //=DateTime.Now;
    public int UtilisateurId { get; set; }
    public Utilisateur Utilisateur { get; set; } = null!;
    public string FilmId { get; set; } = null!;

    public Avis() { }
}
