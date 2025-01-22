namespace cinemvBack.Models;

public class ListeFilms
{
    public int Id { get; set; }
    public string Titre { get; set; } = null!;
    public string Description { get; set; } = null!;
    public int UtilisateurId { get; set; }
    public Utilisateur Utilisateur { get; set; } = null!;
    public ICollection<string> FilmsIds { get; set; } = new List<string>();

    public ListeFilms() { }
}
